import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';

// Mock Redis client
const mockRedis = {
  get: vi.fn(),
  set: vi.fn(),
  expire: vi.fn(),
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
    TTL_ROOM: 3600,
  };
});

describe('Answer Endpoint Integration', () => {
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
    mockRedis.set.mockResolvedValue('OK');
    mockRedis.expire.mockResolvedValue(1);
  });

  afterEach(() => {
    // Restore original environment
    process.env = originalEnv;
  });

  describe('POST /api/answer - Store Answer', () => {
    it('should store answer successfully', async () => {
      mockReq.method = 'POST';
      mockReq.body = {
        roomId: 'abc123def456789012345678',
        desc: {
          type: 'answer',
          sdp: 'v=0\r\no=- 987654321 2 IN IP4 127.0.0.1\r\ns=-\r\nt=0 0\r\n',
        },
      };

      const answerHandler = (await import('../../api/answer.js')).default;
      await answerHandler(mockReq, mockRes);

      expect(mockRes.json).toHaveBeenCalledWith({ ok: true });

      // Verify Redis operations
      expect(mockRedis.set).toHaveBeenCalledWith(
        'room:abc123def456789012345678:answer',
        JSON.stringify(mockReq.body.desc)
      );
      expect(mockRedis.expire).toHaveBeenCalledWith('room:abc123def456789012345678:answer', 3600);
    });

    it('should reject invalid room ID', async () => {
      mockReq.method = 'POST';
      mockReq.body = {
        roomId: 'invalid-room-id',
        desc: {
          type: 'answer',
          sdp: 'v=0\r\no=- 987654321 2 IN IP4 127.0.0.1\r\ns=-\r\nt=0 0\r\n',
        },
      };

      const answerHandler = (await import('../../api/answer.js')).default;
      await answerHandler(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(400);
      expect(mockRes.json).toHaveBeenCalledWith({
        error: 'Invalid roomId format',
        timestamp: expect.any(String),
      });
    });

    it('should reject invalid descriptor', async () => {
      mockReq.method = 'POST';
      mockReq.body = {
        roomId: 'abc123def456789012345678',
        desc: {
          type: 'answer',
          // Missing required sdp field
        },
      };

      const answerHandler = (await import('../../api/answer.js')).default;
      await answerHandler(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(400);
      expect(mockRes.json).toHaveBeenCalledWith({
        error: 'Missing or invalid SDP',
        timestamp: expect.any(String),
      });
    });

    it('should reject non-answer descriptor type', async () => {
      mockReq.method = 'POST';
      mockReq.body = {
        roomId: 'abc123def456789012345678',
        desc: {
          type: 'offer', // Wrong type
          sdp: 'v=0\r\no=- 987654321 2 IN IP4 127.0.0.1\r\ns=-\r\nt=0 0\r\n',
        },
      };

      const answerHandler = (await import('../../api/answer.js')).default;
      await answerHandler(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(400);
      expect(mockRes.json).toHaveBeenCalledWith({
        error: 'Descriptor must be of type "answer"',
        timestamp: expect.any(String),
      });
    });

    it('should reject missing room', async () => {
      mockReq.method = 'POST';
      mockReq.body = {
        roomId: 'abc123def456789012345678',
        desc: {
          type: 'answer',
          sdp: 'v=0\r\no=- 987654321 2 IN IP4 127.0.0.1\r\ns=-\r\nt=0 0\r\n',
        },
      };

      // Mock room not found
      mockRedis.get.mockResolvedValue(null);

      const answerHandler = (await import('../../api/answer.js')).default;
      await answerHandler(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(410);
      expect(mockRes.json).toHaveBeenCalledWith({
        error: 'Room expired or not found',
        timestamp: expect.any(String),
      });
    });

    it('should handle Redis errors gracefully', async () => {
      mockReq.method = 'POST';
      mockReq.body = {
        roomId: 'abc123def456789012345678',
        desc: {
          type: 'answer',
          sdp: 'v=0\r\no=- 987654321 2 IN IP4 127.0.0.1\r\ns=-\r\nt=0 0\r\n',
        },
      };

      // Mock Redis error
      mockRedis.set.mockRejectedValue(new Error('Redis connection failed'));

      const answerHandler = (await import('../../api/answer.js')).default;
      await answerHandler(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(500);
      expect(mockRes.json).toHaveBeenCalledWith({
        error: 'Internal server error',
        timestamp: expect.any(String),
      });
    });
  });

  describe('GET /api/answer - Retrieve Answer', () => {
    it('should retrieve answer successfully', async () => {
      mockReq.method = 'GET';
      mockReq.query = {
        roomId: 'abc123def456789012345678',
      };

      const mockAnswer = {
        type: 'answer',
        sdp: 'v=0\r\no=- 987654321 2 IN IP4 127.0.0.1\r\ns=-\r\nt=0 0\r\n',
      };

      // Mock answer exists
      mockRedis.get
        .mockResolvedValueOnce('{"createdAt":1234567890,"version":"1.0"}') // Room exists
        .mockResolvedValueOnce(JSON.stringify(mockAnswer)); // Answer exists

      const answerHandler = (await import('../../api/answer.js')).default;
      await answerHandler(mockReq, mockRes);

      expect(mockRes.json).toHaveBeenCalledWith({ desc: mockAnswer });
    });

    it('should handle auto-parsed JSON from Redis', async () => {
      mockReq.method = 'GET';
      mockReq.query = {
        roomId: 'abc123def456789012345678',
      };

      const mockAnswer = {
        type: 'answer',
        sdp: 'v=0\r\no=- 987654321 2 IN IP4 127.0.0.1\r\ns=-\r\nt=0 0\r\n',
      };

      // Mock Redis returning already parsed object
      mockRedis.get
        .mockResolvedValueOnce('{"createdAt":1234567890,"version":"1.0"}') // Room exists
        .mockResolvedValueOnce(mockAnswer); // Answer as object (not string)

      const answerHandler = (await import('../../api/answer.js')).default;
      await answerHandler(mockReq, mockRes);

      expect(mockRes.json).toHaveBeenCalledWith({ desc: mockAnswer });
    });

    it('should return 404 when no answer exists', async () => {
      mockReq.method = 'GET';
      mockReq.query = {
        roomId: 'abc123def456789012345678',
      };

      // Mock room exists but no answer
      mockRedis.get
        .mockResolvedValueOnce('{"createdAt":1234567890,"version":"1.0"}') // Room exists
        .mockResolvedValueOnce(null); // No answer

      const answerHandler = (await import('../../api/answer.js')).default;
      await answerHandler(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(404);
      expect(mockRes.json).toHaveBeenCalledWith({ error: 'No answer available yet' });
    });

    it('should reject invalid room ID for GET', async () => {
      mockReq.method = 'GET';
      mockReq.query = {
        roomId: 'invalid-room-id',
      };

      const answerHandler = (await import('../../api/answer.js')).default;
      await answerHandler(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(400);
      expect(mockRes.json).toHaveBeenCalledWith({
        error: 'Invalid roomId format',
        timestamp: expect.any(String),
      });
    });

    it('should reject missing room for GET', async () => {
      mockReq.method = 'GET';
      mockReq.query = {
        roomId: 'abc123def456789012345678',
      };

      // Mock room not found
      mockRedis.get.mockResolvedValue(null);

      const answerHandler = (await import('../../api/answer.js')).default;
      await answerHandler(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(410);
      expect(mockRes.json).toHaveBeenCalledWith({
        error: 'Room expired or not found',
        timestamp: expect.any(String),
      });
    });

    it('should handle malformed answer JSON gracefully', async () => {
      mockReq.method = 'GET';
      mockReq.query = {
        roomId: 'abc123def456789012345678',
      };

      // Mock room exists but answer is malformed JSON
      mockRedis.get
        .mockResolvedValueOnce('{"createdAt":1234567890,"version":"1.0"}') // Room exists
        .mockResolvedValueOnce('invalid-json-string'); // Malformed JSON

      const answerHandler = (await import('../../api/answer.js')).default;
      await answerHandler(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(500);
      expect(mockRes.json).toHaveBeenCalledWith({
        error: 'Failed to parse answer data',
        timestamp: expect.any(String),
      });
    });
  });

  describe('General Answer Endpoint Behavior', () => {
    it('should handle OPTIONS requests for CORS preflight', async () => {
      mockReq.method = 'OPTIONS';

      const answerHandler = (await import('../../api/answer.js')).default;
      await answerHandler(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(204);
      expect(mockRes.end).toHaveBeenCalled();
    });

    it('should reject unsupported HTTP methods', async () => {
      mockReq.method = 'PUT';
      mockReq.query = {
        roomId: 'abc123def456789012345678',
      };

      const answerHandler = (await import('../../api/answer.js')).default;
      await answerHandler(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(405);
      expect(mockRes.json).toHaveBeenCalledWith({
        error: 'Method not allowed',
        timestamp: expect.any(String),
      });
    });

    it('should validate room ID for both POST and GET', async () => {
      // Test POST with invalid room ID
      mockReq.method = 'POST';
      mockReq.body = {
        roomId: 'invalid',
        desc: { type: 'answer', sdp: 'test' },
      };

      const answerHandler = (await import('../../api/answer.js')).default;
      await answerHandler(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(400);
      expect(mockRes.json).toHaveBeenCalledWith({
        error: 'Invalid roomId format',
        timestamp: expect.any(String),
      });
    });

    it('should handle large SDP answers', async () => {
      mockReq.method = 'POST';
      mockReq.body = {
        roomId: 'abc123def456789012345678',
        desc: {
          type: 'answer',
          sdp: `v=0\r\no=- 987654321 2 IN IP4 127.0.0.1\r\ns=-\r\nt=0 0\r\n${'a=ice-ufrag:test\r\n'.repeat(100)}`, // Large SDP
        },
      };

      const answerHandler = (await import('../../api/answer.js')).default;
      await answerHandler(mockReq, mockRes);

      expect(mockRes.json).toHaveBeenCalledWith({ ok: true });
      expect(mockRedis.set).toHaveBeenCalledWith(
        'room:abc123def456789012345678:answer',
        JSON.stringify(mockReq.body.desc)
      );
    });

    it('should handle empty SDP gracefully', async () => {
      mockReq.method = 'POST';
      mockReq.body = {
        roomId: 'abc123def456789012345678',
        desc: {
          type: 'answer',
          sdp: '', // Empty SDP
        },
      };

      const answerHandler = (await import('../../api/answer.js')).default;
      await answerHandler(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(400);
      expect(mockRes.json).toHaveBeenCalledWith({
        error: 'Missing or invalid SDP',
        timestamp: expect.any(String),
      });
    });
  });
});
