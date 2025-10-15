import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';

// Mock Redis client with REAL behavior simulation
const mockRedis = {
  get: vi.fn(),
  zadd: vi.fn(),
  zremrangebyrank: vi.fn(),
  expire: vi.fn(),
  zrange: vi.fn(),
  zrangebyscore: vi.fn(),
};

// Mock the Redis client creation
vi.mock('../../api/_utils.js', async () => {
  const actual = await vi.importActual('../../api/_utils.js');
  return {
    ...actual,
    createRedisClient: vi.fn(() => mockRedis),
    sendError: vi.fn((res, status, message, error) =>
      res.status(status).json({
        error: message,
        timestamp: new Date().toISOString(),
      })
    ),
    checkRateLimit: vi.fn(),
    getClientIdentifier: vi.fn(() => 'test-client-id'),
    getChatRateLimit: vi.fn(() => ({
      limit: vi.fn().mockResolvedValue({
        success: true,
        limit: 60,
        reset: Date.now() + 60000,
        remaining: 59,
      }),
    })),
    TTL_ROOM: 1800,
    MAX_MESSAGES: 50,
  };
});

describe('Chat Endpoint - REAL Logic Tests', () => {
  let mockReq;
  let mockRes;
  let originalEnv;

  beforeEach(() => {
    originalEnv = process.env;
    process.env = {
      ...originalEnv,
    };

    mockReq = {
      method: 'POST',
      headers: {},
      body: {},
      query: {},
    };

    mockRes = {
      status: vi.fn().mockReturnThis(),
      json: vi.fn().mockReturnThis(),
      setHeader: vi.fn(),
      end: vi.fn(),
    };

    vi.clearAllMocks();
  });

  afterEach(() => {
    process.env = originalEnv;
  });

  describe('POST /api/chat - REAL Message Storage Testing', () => {
    it('should store message with correct JSON structure and sender sanitization', async () => {
      mockReq.method = 'POST';
      mockReq.body = {
        roomId: 'abc123def456789012345678',
        sender: 'John Doe', // Space in name
        message: 'Hello, world!',
        secret: 'test-secret',
      };

      // Mock sender authorization with CORRECT sanitized key
      mockRedis.get.mockImplementation((key) => {
        if (key === 'room:abc123def456789012345678:meta') {
          return Promise.resolve('{"createdAt":1234567890,"version":"1.0"}');
        }
        if (key === 'room:abc123def456789012345678:sender:John_Doe') {
          // Sanitized key
          return Promise.resolve('{"clientId":"test-client-id","secret":"test-secret"}');
        }
        return Promise.resolve(null);
      });

      // Mock Redis operations
      mockRedis.zadd.mockResolvedValue(1);
      mockRedis.zremrangebyrank.mockResolvedValue(0);
      mockRedis.expire.mockResolvedValue(1);

      const chatHandler = (await import('../../api/chat.js')).default;
      await chatHandler(mockReq, mockRes);

      expect(mockRes.json).toHaveBeenCalledWith({
        ok: true,
        message: {
          id: expect.stringMatching(/^\d+_[a-z0-9]+$/),
          sender: 'John Doe', // Should be trimmed original name
          message: 'Hello, world!',
          timestamp: expect.any(Number),
        },
      });

      // Verify REAL Redis operations with correct data
      expect(mockRedis.zadd).toHaveBeenCalledWith(
        'room:abc123def456789012345678:chat',
        expect.any(Number), // Timestamp score
        expect.stringContaining('"sender":"John Doe"') // Original sender name in JSON
      );
      expect(mockRedis.zremrangebyrank).toHaveBeenCalledWith('room:abc123def456789012345678:chat', 0, -51);
      expect(mockRedis.expire).toHaveBeenCalledWith('room:abc123def456789012345678:chat', 1800);
    });

    it('should reject messages that are too long before trimming', async () => {
      mockReq.method = 'POST';
      mockReq.body = {
        roomId: 'abc123def456789012345678',
        sender: 'John Doe',
        message: 'B'.repeat(600), // 600 chars - too long for validation
        secret: 'test-secret',
      };

      // Mock sender authorization
      mockRedis.get.mockImplementation((key) => {
        if (key === 'room:abc123def456789012345678:meta') {
          return Promise.resolve('{"createdAt":1234567890,"version":"1.0"}');
        }
        if (key === 'room:abc123def456789012345678:sender:John_Doe') {
          return Promise.resolve('{"clientId":"test-client-id","secret":"test-secret"}');
        }
        return Promise.resolve(null);
      });

      const chatHandler = (await import('../../api/chat.js')).default;
      await chatHandler(mockReq, mockRes);

      // Should be rejected by validation BEFORE trimming
      expect(mockRes.status).toHaveBeenCalledWith(400);
      expect(mockRes.json).toHaveBeenCalledWith({
        error: 'Message too long (max 500 characters)',
        timestamp: expect.any(String),
      });
    });

    it('should trim sender names and messages when within limits', async () => {
      mockReq.method = 'POST';
      mockReq.body = {
        roomId: 'abc123def456789012345678',
        sender: `  ${'A'.repeat(30)}  `, // 34 chars total, 30 A's
        message: `  ${'B'.repeat(200)}  `, // 204 chars total, 200 B's
        secret: 'test-secret',
      };

      const trimmedSender = 'A'.repeat(30); // Should be trimmed to 30 chars
      const trimmedMessage = 'B'.repeat(200); // Should be trimmed to 200 chars

      // Mock sender authorization with sanitized key
      mockRedis.get.mockImplementation((key) => {
        if (key === 'room:abc123def456789012345678:meta') {
          return Promise.resolve('{"createdAt":1234567890,"version":"1.0"}');
        }
        if (key === `room:abc123def456789012345678:sender:${trimmedSender.replace(/[^a-zA-Z0-9_-]/g, '_')}`) {
          return Promise.resolve('{"clientId":"test-client-id","secret":"test-secret"}');
        }
        return Promise.resolve(null);
      });

      // Mock Redis operations
      mockRedis.zadd.mockResolvedValue(1);
      mockRedis.zremrangebyrank.mockResolvedValue(0);
      mockRedis.expire.mockResolvedValue(1);

      const chatHandler = (await import('../../api/chat.js')).default;
      await chatHandler(mockReq, mockRes);

      expect(mockRes.json).toHaveBeenCalledWith({
        ok: true,
        message: {
          id: expect.stringMatching(/^\d+_[a-z0-9]+$/),
          sender: trimmedSender, // Should be trimmed
          message: trimmedMessage, // Should be trimmed
          timestamp: expect.any(Number),
        },
      });

      // Verify the stored JSON contains trimmed values
      const zaddCall = mockRedis.zadd.mock.calls[0];
      const storedMessage = JSON.parse(zaddCall[2]);
      expect(storedMessage.sender).toBe(trimmedSender);
      expect(storedMessage.message).toBe(trimmedMessage);
    });

    it('should handle sender name sanitization for Redis keys', async () => {
      mockReq.method = 'POST';
      mockReq.body = {
        roomId: 'abc123def456789012345678',
        sender: 'John@Doe#123', // Special characters
        message: 'Hello!',
        secret: 'test-secret',
      };

      // Mock sender authorization with CORRECT sanitized key
      mockRedis.get.mockImplementation((key) => {
        if (key === 'room:abc123def456789012345678:meta') {
          return Promise.resolve('{"createdAt":1234567890,"version":"1.0"}');
        }
        if (key === 'room:abc123def456789012345678:sender:John_Doe_123') {
          // Sanitized key
          return Promise.resolve('{"clientId":"test-client-id","secret":"test-secret"}');
        }
        return Promise.resolve(null);
      });

      // Mock Redis operations
      mockRedis.zadd.mockResolvedValue(1);
      mockRedis.zremrangebyrank.mockResolvedValue(0);
      mockRedis.expire.mockResolvedValue(1);

      const chatHandler = (await import('../../api/chat.js')).default;
      await chatHandler(mockReq, mockRes);

      expect(mockRes.json).toHaveBeenCalledWith({
        ok: true,
        message: {
          id: expect.stringMatching(/^\d+_[a-z0-9]+$/),
          sender: 'John@Doe#123', // Original name in response
          message: 'Hello!',
          timestamp: expect.any(Number),
        },
      });
    });

    it('should reject unauthorized sender', async () => {
      mockReq.method = 'POST';
      mockReq.body = {
        roomId: 'abc123def456789012345678',
        sender: 'John Doe',
        message: 'Hello!',
        secret: 'test-secret',
      };

      // Mock sender NOT authorized
      mockRedis.get.mockImplementation((key) => {
        if (key === 'room:abc123def456789012345678:meta') {
          return Promise.resolve('{"createdAt":1234567890,"version":"1.0"}');
        }
        if (key === 'room:abc123def456789012345678:sender:John_Doe') {
          return Promise.resolve(null); // No sender data
        }
        return Promise.resolve(null);
      });

      const chatHandler = (await import('../../api/chat.js')).default;
      await chatHandler(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(403);
      expect(mockRes.json).toHaveBeenCalledWith({
        error: 'Unauthorized: Sender not registered for this room',
        timestamp: expect.any(String),
      });
    });

    it('should reject invalid sender credentials', async () => {
      mockReq.method = 'POST';
      mockReq.body = {
        roomId: 'abc123def456789012345678',
        sender: 'John Doe',
        message: 'Hello!',
        secret: 'wrong-secret',
      };

      // Mock sender with wrong secret
      mockRedis.get.mockImplementation((key) => {
        if (key === 'room:abc123def456789012345678:meta') {
          return Promise.resolve('{"createdAt":1234567890,"version":"1.0"}');
        }
        if (key === 'room:abc123def456789012345678:sender:John_Doe') {
          return Promise.resolve('{"clientId":"test-client-id","secret":"correct-secret"}');
        }
        return Promise.resolve(null);
      });

      const chatHandler = (await import('../../api/chat.js')).default;
      await chatHandler(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(403);
      expect(mockRes.json).toHaveBeenCalledWith({
        error: 'Unauthorized: Invalid sender credentials',
        timestamp: expect.any(String),
      });
    });
  });

  describe('GET /api/chat - REAL Message Retrieval Testing', () => {
    it('should retrieve and parse messages correctly', async () => {
      const testMessages = [
        JSON.stringify({
          id: '1234567890_abc123',
          sender: 'John Doe',
          message: 'Hello!',
          timestamp: 1234567890,
        }),
        JSON.stringify({
          id: '1234567891_def456',
          sender: 'Jane Smith',
          message: 'Hi there!',
          timestamp: 1234567891,
        }),
      ];

      mockReq.method = 'GET';
      mockReq.query = {
        roomId: 'abc123def456789012345678',
      };

      // Mock room exists
      mockRedis.get.mockResolvedValue('{"createdAt":1234567890,"version":"1.0"}');

      // Mock message retrieval
      mockRedis.zrange.mockResolvedValue(testMessages);

      const chatHandler = (await import('../../api/chat.js')).default;
      await chatHandler(mockReq, mockRes);

      expect(mockRes.json).toHaveBeenCalledWith({
        messages: [
          {
            id: '1234567891_def456',
            sender: 'Jane Smith',
            message: 'Hi there!',
            timestamp: 1234567891,
          },
          {
            id: '1234567890_abc123',
            sender: 'John Doe',
            message: 'Hello!',
            timestamp: 1234567890,
          },
        ],
      });

      // Verify REAL Redis operations
      expect(mockRedis.get).toHaveBeenCalledWith('room:abc123def456789012345678:meta');
      expect(mockRedis.zrange).toHaveBeenCalledWith('room:abc123def456789012345678:chat', -50, -1);
    });

    it('should handle malformed JSON in messages gracefully', async () => {
      const malformedMessages = ['{"valid": "json"}', 'invalid-json-string', '{"another": "valid"}'];

      mockReq.method = 'GET';
      mockReq.query = {
        roomId: 'abc123def456789012345678',
      };

      // Mock room exists
      mockRedis.get.mockResolvedValue('{"createdAt":1234567890,"version":"1.0"}');

      // Mock message retrieval with malformed JSON
      mockRedis.zrange.mockResolvedValue(malformedMessages);

      const chatHandler = (await import('../../api/chat.js')).default;
      await chatHandler(mockReq, mockRes);

      // Should return empty array because malformed JSON is filtered out
      expect(mockRes.json).toHaveBeenCalledWith({
        messages: [],
      });
    });
  });
});
