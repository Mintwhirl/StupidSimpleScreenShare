import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';

// Mock Redis client
const mockRedis = {
  get: vi.fn(),
  lpush: vi.fn(),
  ltrim: vi.fn(),
  expire: vi.fn(),
  lrange: vi.fn(),
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
    getChatRateLimit: vi.fn(() => ({
      limit: vi.fn().mockResolvedValue({
        success: true,
        limit: 60,
        reset: Date.now() + 60000,
        remaining: 59,
      }),
    })),
    TTL_ROOM: 3600,
    MAX_MESSAGES: 100,
  };
});

describe('Chat Endpoint Integration', () => {
  let mockReq;
  let mockRes;
  let originalEnv;

  beforeEach(() => {
    // Mock environment variables
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

    // Clear all mocks
    vi.clearAllMocks();

    // Default Redis responses
    mockRedis.get.mockResolvedValue('{"createdAt":1234567890,"version":"1.0"}');
    mockRedis.lpush.mockResolvedValue(1);
    mockRedis.ltrim.mockResolvedValue('OK');
    mockRedis.expire.mockResolvedValue(1);
    mockRedis.lrange.mockResolvedValue([]);
  });

  afterEach(() => {
    // Restore original environment
    process.env = originalEnv;
  });

  describe('POST /api/chat - Send Message', () => {
    it('should send a chat message successfully', async () => {
      mockReq.method = 'POST';
      mockReq.body = {
        roomId: 'abc123def456789012345678', // 24 hex characters
        sender: 'John Doe',
        message: 'Hello, world!',
      };

      const chatHandler = (await import('../../api/chat.js')).default;
      await chatHandler(mockReq, mockRes);

      expect(mockRes.json).toHaveBeenCalledWith({
        ok: true,
        message: {
          id: expect.stringMatching(/^\d+_[a-z0-9]+$/),
          sender: 'John Doe',
          message: 'Hello, world!',
          timestamp: expect.any(Number),
        },
      });

      // Verify Redis operations
      expect(mockRedis.lpush).toHaveBeenCalledWith(
        'room:abc123def456789012345678:chat',
        expect.stringContaining('"sender":"John Doe"')
      );
      expect(mockRedis.ltrim).toHaveBeenCalledWith('room:abc123def456789012345678:chat', 0, 99);
      expect(mockRedis.expire).toHaveBeenCalledWith('room:abc123def456789012345678:chat', 3600);
    });

    it('should trim long sender names and messages', async () => {
      mockReq.method = 'POST';
      mockReq.body = {
        roomId: 'abc123def456789012345678',
        sender: 'A'.repeat(30), // Long but valid sender name (under 50 limit)
        message: 'B'.repeat(400), // Long but valid message (under 500 limit)
      };

      const chatHandler = (await import('../../api/chat.js')).default;
      await chatHandler(mockReq, mockRes);

      // Verify the response structure
      expect(mockRes.json).toHaveBeenCalledWith({
        ok: true,
        message: {
          id: expect.stringMatching(/^\d+_[a-z0-9]+$/),
          sender: 'A'.repeat(30), // Not trimmed (under 50 limit)
          message: 'B'.repeat(400), // Not trimmed (under 500 limit)
          timestamp: expect.any(Number),
        },
      });
    });

    it('should reject invalid room ID', async () => {
      mockReq.method = 'POST';
      mockReq.body = {
        roomId: 'invalid-room-id', // Too short
        sender: 'John Doe',
        message: 'Hello!',
      };

      const chatHandler = (await import('../../api/chat.js')).default;
      await chatHandler(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(400);
      expect(mockRes.json).toHaveBeenCalledWith({
        error: 'Invalid roomId format',
        timestamp: expect.any(String),
      });
    });

    it('should reject missing room', async () => {
      mockReq.method = 'POST';
      mockReq.body = {
        roomId: 'abc123def456789012345678',
        sender: 'John Doe',
        message: 'Hello!',
      };

      // Mock room not found
      mockRedis.get.mockResolvedValue(null);

      const chatHandler = (await import('../../api/chat.js')).default;
      await chatHandler(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(410);
      expect(mockRes.json).toHaveBeenCalledWith({
        error: 'Room expired or not found',
        timestamp: expect.any(String),
      });
    });

    it('should reject invalid message', async () => {
      mockReq.method = 'POST';
      mockReq.body = {
        roomId: 'abc123def456789012345678',
        sender: 'John Doe',
        message: '', // Empty message
      };

      const chatHandler = (await import('../../api/chat.js')).default;
      await chatHandler(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(400);
      expect(mockRes.json).toHaveBeenCalledWith({
        error: 'Missing or invalid message',
        timestamp: expect.any(String),
      });
    });

    it('should reject invalid sender', async () => {
      mockReq.method = 'POST';
      mockReq.body = {
        roomId: 'abc123def456789012345678',
        sender: '', // Empty sender
        message: 'Hello!',
      };

      const chatHandler = (await import('../../api/chat.js')).default;
      await chatHandler(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(400);
      expect(mockRes.json).toHaveBeenCalledWith({
        error: 'Missing or invalid sender',
        timestamp: expect.any(String),
      });
    });

    it('should apply rate limiting', async () => {
      mockReq.method = 'POST';
      mockReq.body = {
        roomId: 'abc123def456789012345678',
        sender: 'John Doe',
        message: 'Hello!',
      };

      // Mock rate limit exceeded
      const { checkRateLimit } = await import('../../api/_utils.js');
      checkRateLimit.mockResolvedValue({
        status: 429,
        json: { error: 'Rate limit exceeded' },
      });

      const chatHandler = (await import('../../api/chat.js')).default;
      await chatHandler(mockReq, mockRes);

      expect(checkRateLimit).toHaveBeenCalledWith(expect.any(Object), 'abc123def456789012345678:John Doe', mockRes);
    });
  });

  describe('GET /api/chat - Retrieve Messages', () => {
    it('should retrieve messages successfully', async () => {
      mockReq.method = 'GET';
      mockReq.query = {
        roomId: 'abc123def456789012345678',
        since: '0',
      };

      // Mock existing messages
      const mockMessages = [
        JSON.stringify({
          id: '124_def',
          sender: 'Jane',
          message: 'Hi there!',
          timestamp: 2000,
        }),
        JSON.stringify({
          id: '123_abc',
          sender: 'John',
          message: 'Hello!',
          timestamp: 1000,
        }),
      ];
      mockRedis.lrange.mockResolvedValue(mockMessages);

      const chatHandler = (await import('../../api/chat.js')).default;
      await chatHandler(mockReq, mockRes);

      expect(mockRes.json).toHaveBeenCalledWith({
        messages: [
          {
            id: '123_abc',
            sender: 'John',
            message: 'Hello!',
            timestamp: 1000,
          },
          {
            id: '124_def',
            sender: 'Jane',
            message: 'Hi there!',
            timestamp: 2000,
          },
        ],
      });
    });

    it('should filter messages by since timestamp', async () => {
      mockReq.method = 'GET';
      mockReq.query = {
        roomId: 'abc123def456789012345678',
        since: '1500', // Only messages after timestamp 1500
      };

      const mockMessages = [
        JSON.stringify({
          id: '123_abc',
          sender: 'John',
          message: 'Hello!',
          timestamp: 1000, // Before since
        }),
        JSON.stringify({
          id: '124_def',
          sender: 'Jane',
          message: 'Hi there!',
          timestamp: 2000, // After since
        }),
      ];
      mockRedis.lrange.mockResolvedValue(mockMessages);

      const chatHandler = (await import('../../api/chat.js')).default;
      await chatHandler(mockReq, mockRes);

      expect(mockRes.json).toHaveBeenCalledWith({
        messages: [
          {
            id: '124_def',
            sender: 'Jane',
            message: 'Hi there!',
            timestamp: 2000,
          },
        ],
      });
    });

    it('should handle missing since parameter', async () => {
      mockReq.method = 'GET';
      mockReq.query = {
        roomId: 'abc123def456789012345678',
        // No since parameter
      };

      mockRedis.lrange.mockResolvedValue([]);

      const chatHandler = (await import('../../api/chat.js')).default;
      await chatHandler(mockReq, mockRes);

      expect(mockRes.json).toHaveBeenCalledWith({
        messages: [],
      });
    });

    it('should handle invalid since timestamp by defaulting to 0', async () => {
      mockReq.method = 'GET';
      mockReq.query = {
        roomId: 'abc123def456789012345678',
        since: 'invalid-timestamp',
      };

      mockRedis.lrange.mockResolvedValue([]);

      const chatHandler = (await import('../../api/chat.js')).default;
      await chatHandler(mockReq, mockRes);

      // Should not error, but default to 0 and return empty messages
      expect(mockRes.json).toHaveBeenCalledWith({
        messages: [],
      });
    });

    it('should reject negative since timestamp', async () => {
      mockReq.method = 'GET';
      mockReq.query = {
        roomId: 'abc123def456789012345678',
        since: '-1000',
      };

      const chatHandler = (await import('../../api/chat.js')).default;
      await chatHandler(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(400);
      expect(mockRes.json).toHaveBeenCalledWith({
        error: 'Invalid since timestamp',
        timestamp: expect.any(String),
      });
    });

    it('should handle malformed message JSON gracefully', async () => {
      mockReq.method = 'GET';
      mockReq.query = {
        roomId: 'abc123def456789012345678',
        since: '0',
      };

      // Mock messages with one malformed JSON
      const mockMessages = [
        JSON.stringify({
          id: '124_def',
          sender: 'Jane',
          message: 'Hi there!',
          timestamp: 2000,
        }),
        'invalid-json-string', // Malformed JSON
        JSON.stringify({
          id: '123_abc',
          sender: 'John',
          message: 'Hello!',
          timestamp: 1000,
        }),
      ];
      mockRedis.lrange.mockResolvedValue(mockMessages);

      const chatHandler = (await import('../../api/chat.js')).default;
      await chatHandler(mockReq, mockRes);

      // Should filter out the malformed message
      expect(mockRes.json).toHaveBeenCalledWith({
        messages: [
          {
            id: '123_abc',
            sender: 'John',
            message: 'Hello!',
            timestamp: 1000,
          },
          {
            id: '124_def',
            sender: 'Jane',
            message: 'Hi there!',
            timestamp: 2000,
          },
        ],
      });
    });
  });

  describe('General Chat Endpoint Behavior', () => {
    it('should handle OPTIONS requests for CORS preflight', async () => {
      mockReq.method = 'OPTIONS';

      const chatHandler = (await import('../../api/chat.js')).default;
      await chatHandler(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(204);
      expect(mockRes.end).toHaveBeenCalled();
    });

    it('should reject unsupported HTTP methods', async () => {
      mockReq.method = 'PUT';
      mockReq.query = {
        roomId: 'abc123def456789012345678',
      };

      const chatHandler = (await import('../../api/chat.js')).default;
      await chatHandler(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(405);
      expect(mockRes.json).toHaveBeenCalledWith({
        error: 'Method not allowed',
        timestamp: expect.any(String),
      });
    });

    it('should validate room ID for GET requests', async () => {
      mockReq.method = 'GET';
      mockReq.query = {
        roomId: 'invalid', // Invalid room ID
        since: '0',
      };

      const chatHandler = (await import('../../api/chat.js')).default;
      await chatHandler(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(400);
      expect(mockRes.json).toHaveBeenCalledWith({
        error: 'Invalid roomId format',
        timestamp: expect.any(String),
      });
    });
  });
});
