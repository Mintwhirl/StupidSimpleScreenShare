import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';

// Mock Redis client with REAL behavior simulation
const mockRedis = {
  get: vi.fn(),
  set: vi.fn(),
  expire: vi.fn(),
  del: vi.fn(),
  multi: vi.fn(),
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
    TTL_ROOM: 1800,
  };
});

describe('Answer Endpoint - REAL Logic Tests', () => {
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

  describe('POST /api/answer - REAL Answer Storage Testing', () => {
    it('should store answer with correct JSON stringification and room validation', async () => {
      const testAnswer = {
        type: 'answer',
        sdp: 'v=0\r\no=- 987654321 2 IN IP4 127.0.0.1\r\ns=-\r\nt=0 0\r\n',
      };

      mockReq.method = 'POST';
      mockReq.body = {
        roomId: 'abc123def456789012345678',
        desc: testAnswer,
      };

      // Mock Redis multi transaction with REAL behavior
      const mockMulti = {
        get: vi.fn().mockReturnThis(),
        set: vi.fn().mockReturnThis(),
        expire: vi.fn().mockReturnThis(),
        exec: vi.fn().mockResolvedValue([
          '{"createdAt":1234567890,"version":"1.0"}', // Room exists
          'OK', // set result
          1, // expire result
        ]),
      };
      mockRedis.multi.mockReturnValue(mockMulti);

      const answerHandler = (await import('../../api/answer.js')).default;
      await answerHandler(mockReq, mockRes);

      expect(mockRes.json).toHaveBeenCalledWith({ ok: true });

      // Verify REAL Redis transaction behavior
      expect(mockRedis.multi).toHaveBeenCalled();
      expect(mockMulti.get).toHaveBeenCalledWith('room:abc123def456789012345678:meta');
      expect(mockMulti.set).toHaveBeenCalledWith(
        'room:abc123def456789012345678:answer',
        JSON.stringify(testAnswer) // Verify JSON stringification
      );
      expect(mockMulti.expire).toHaveBeenCalledWith('room:abc123def456789012345678:answer', 1800);
      expect(mockMulti.exec).toHaveBeenCalled();
    });

    it('should reject non-answer descriptor types', async () => {
      const testOffer = {
        type: 'offer', // Wrong type
        sdp: 'v=0\r\no=- 987654321 2 IN IP4 127.0.0.1\r\ns=-\r\nt=0 0\r\n',
      };

      mockReq.method = 'POST';
      mockReq.body = {
        roomId: 'abc123def456789012345678',
        desc: testOffer,
      };

      const answerHandler = (await import('../../api/answer.js')).default;
      await answerHandler(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(400);
      expect(mockRes.json).toHaveBeenCalledWith({
        error: 'Descriptor must be of type "answer"',
        timestamp: expect.any(String),
      });
    });
  });

  describe('GET /api/answer - REAL Answer Retrieval Testing', () => {
    it('should retrieve and parse answer correctly', async () => {
      const testAnswer = {
        type: 'answer',
        sdp: 'v=0\r\no=- 987654321 2 IN IP4 127.0.0.1\r\ns=-\r\nt=0 0\r\n',
      };

      mockReq.method = 'GET';
      mockReq.query = {
        roomId: 'abc123def456789012345678',
      };

      // Mock room exists
      mockRedis.get
        .mockResolvedValueOnce('{"createdAt":1234567890,"version":"1.0"}') // Room check
        .mockResolvedValueOnce(JSON.stringify(testAnswer)); // Answer retrieval

      const answerHandler = (await import('../../api/answer.js')).default;
      await answerHandler(mockReq, mockRes);

      expect(mockRes.json).toHaveBeenCalledWith({
        desc: testAnswer,
      });

      // Verify REAL Redis operations
      expect(mockRedis.get).toHaveBeenCalledWith('room:abc123def456789012345678:meta');
      expect(mockRedis.get).toHaveBeenCalledWith('room:abc123def456789012345678:answer');
    });

    it('should handle answer not found', async () => {
      mockReq.method = 'GET';
      mockReq.query = {
        roomId: 'abc123def456789012345678',
      };

      // Mock room exists but no answer
      mockRedis.get
        .mockResolvedValueOnce('{"createdAt":1234567890,"version":"1.0"}') // Room check
        .mockResolvedValueOnce(null); // No answer

      const answerHandler = (await import('../../api/answer.js')).default;
      await answerHandler(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(404);
      expect(mockRes.json).toHaveBeenCalledWith({
        error: 'No answer available yet',
      });
    });

    it('should delete answer after retrieval', async () => {
      const testAnswer = {
        type: 'answer',
        sdp: 'v=0\r\no=- 987654321 2 IN IP4 127.0.0.1\r\ns=-\r\nt=0 0\r\n',
      };

      mockReq.method = 'GET';
      mockReq.query = {
        roomId: 'abc123def456789012345678',
      };

      // Mock room exists and answer exists
      mockRedis.get
        .mockResolvedValueOnce('{"createdAt":1234567890,"version":"1.0"}') // Room check
        .mockResolvedValueOnce(JSON.stringify(testAnswer)); // Answer retrieval
      mockRedis.del.mockResolvedValue(1);

      const answerHandler = (await import('../../api/answer.js')).default;
      await answerHandler(mockReq, mockRes);

      expect(mockRes.json).toHaveBeenCalledWith({
        desc: testAnswer,
      });

      // Verify answer is deleted after retrieval
      expect(mockRedis.del).toHaveBeenCalledWith('room:abc123def456789012345678:answer');
    });
  });
});
