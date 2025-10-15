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

describe('Offer Endpoint - REAL Logic Tests', () => {
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

  describe('POST /api/offer - REAL Offer Storage Testing', () => {
    it('should store offer with correct JSON stringification and room validation', async () => {
      const testOffer = {
        type: 'offer',
        sdp: 'v=0\r\no=- 123456789 2 IN IP4 127.0.0.1\r\ns=-\r\nt=0 0\r\n',
      };

      mockReq.method = 'POST';
      mockReq.body = {
        roomId: 'abc123def456789012345678',
        desc: testOffer,
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

      const offerHandler = (await import('../../api/offer.js')).default;
      await offerHandler(mockReq, mockRes);

      expect(mockRes.json).toHaveBeenCalledWith({ ok: true });

      // Verify REAL Redis transaction behavior
      expect(mockRedis.multi).toHaveBeenCalled();
      expect(mockMulti.get).toHaveBeenCalledWith('room:abc123def456789012345678:meta');
      expect(mockMulti.set).toHaveBeenCalledWith(
        'room:abc123def456789012345678:offer',
        JSON.stringify(testOffer) // Verify JSON stringification
      );
      expect(mockMulti.expire).toHaveBeenCalledWith('room:abc123def456789012345678:offer', 1800);
      expect(mockMulti.exec).toHaveBeenCalled();
    });

    it('should handle room not found in transaction results', async () => {
      const testOffer = {
        type: 'offer',
        sdp: 'v=0\r\no=- 123456789 2 IN IP4 127.0.0.1\r\ns=-\r\nt=0 0\r\n',
      };

      mockReq.method = 'POST';
      mockReq.body = {
        roomId: 'abc123def456789012345678',
        desc: testOffer,
      };

      // Mock Redis multi transaction with room not found
      const mockMulti = {
        get: vi.fn().mockReturnThis(),
        set: vi.fn().mockReturnThis(),
        expire: vi.fn().mockReturnThis(),
        exec: vi.fn().mockResolvedValue([
          null, // Room not found
          'OK', // set result
          1, // expire result
        ]),
      };
      mockRedis.multi.mockReturnValue(mockMulti);

      const offerHandler = (await import('../../api/offer.js')).default;
      await offerHandler(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(410);
      expect(mockRes.json).toHaveBeenCalledWith({
        error: 'Room expired or not found',
        timestamp: expect.any(String),
      });
    });

    it('should reject non-offer descriptor types', async () => {
      const testAnswer = {
        type: 'answer', // Wrong type
        sdp: 'v=0\r\no=- 123456789 2 IN IP4 127.0.0.1\r\ns=-\r\nt=0 0\r\n',
      };

      mockReq.method = 'POST';
      mockReq.body = {
        roomId: 'abc123def456789012345678',
        desc: testAnswer,
      };

      const offerHandler = (await import('../../api/offer.js')).default;
      await offerHandler(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(400);
      expect(mockRes.json).toHaveBeenCalledWith({
        error: 'Descriptor must be of type "offer"',
        timestamp: expect.any(String),
      });
    });

    it('should reject invalid SDP in descriptor', async () => {
      const testOffer = {
        type: 'offer',
        // Missing SDP
      };

      mockReq.method = 'POST';
      mockReq.body = {
        roomId: 'abc123def456789012345678',
        desc: testOffer,
      };

      const offerHandler = (await import('../../api/offer.js')).default;
      await offerHandler(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(400);
      expect(mockRes.json).toHaveBeenCalledWith({
        error: 'Missing or invalid SDP',
        timestamp: expect.any(String),
      });
    });
  });

  describe('GET /api/offer - REAL Offer Retrieval Testing', () => {
    it('should retrieve and parse offer correctly', async () => {
      const testOffer = {
        type: 'offer',
        sdp: 'v=0\r\no=- 123456789 2 IN IP4 127.0.0.1\r\ns=-\r\nt=0 0\r\n',
      };

      mockReq.method = 'GET';
      mockReq.query = {
        roomId: 'abc123def456789012345678',
      };

      // Mock room exists
      mockRedis.get.mockResolvedValue('{"createdAt":1234567890,"version":"1.0"}');

      // Mock offer retrieval
      mockRedis.get
        .mockResolvedValueOnce('{"createdAt":1234567890,"version":"1.0"}') // Room check
        .mockResolvedValueOnce(JSON.stringify(testOffer)); // Offer retrieval

      const offerHandler = (await import('../../api/offer.js')).default;
      await offerHandler(mockReq, mockRes);

      expect(mockRes.json).toHaveBeenCalledWith({
        desc: testOffer,
      });

      // Verify REAL Redis operations
      expect(mockRedis.get).toHaveBeenCalledWith('room:abc123def456789012345678:meta');
      expect(mockRedis.get).toHaveBeenCalledWith('room:abc123def456789012345678:offer');
    });

    it('should handle offer not found', async () => {
      mockReq.method = 'GET';
      mockReq.query = {
        roomId: 'abc123def456789012345678',
      };

      // Mock room exists but no offer
      mockRedis.get
        .mockResolvedValueOnce('{"createdAt":1234567890,"version":"1.0"}') // Room check
        .mockResolvedValueOnce(null); // No offer

      const offerHandler = (await import('../../api/offer.js')).default;
      await offerHandler(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(404);
      expect(mockRes.json).toHaveBeenCalledWith({
        error: 'No offer available yet',
      });
    });

    it('should handle malformed JSON in stored offer', async () => {
      mockReq.method = 'GET';
      mockReq.query = {
        roomId: 'abc123def456789012345678',
      };

      // Mock room exists
      mockRedis.get
        .mockResolvedValueOnce('{"createdAt":1234567890,"version":"1.0"}') // Room check
        .mockResolvedValueOnce('invalid-json-string'); // Malformed JSON

      const offerHandler = (await import('../../api/offer.js')).default;
      await offerHandler(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(500);
      expect(mockRes.json).toHaveBeenCalledWith({
        error: 'Failed to parse offer data',
        timestamp: expect.any(String),
      });
    });

    it('should delete offer after retrieval', async () => {
      const testOffer = {
        type: 'offer',
        sdp: 'v=0\r\no=- 123456789 2 IN IP4 127.0.0.1\r\ns=-\r\nt=0 0\r\n',
      };

      mockReq.method = 'GET';
      mockReq.query = {
        roomId: 'abc123def456789012345678',
      };

      // Mock room exists and offer exists
      mockRedis.get
        .mockResolvedValueOnce('{"createdAt":1234567890,"version":"1.0"}') // Room check
        .mockResolvedValueOnce(JSON.stringify(testOffer)); // Offer retrieval
      mockRedis.del.mockResolvedValue(1);

      const offerHandler = (await import('../../api/offer.js')).default;
      await offerHandler(mockReq, mockRes);

      expect(mockRes.json).toHaveBeenCalledWith({
        desc: testOffer,
      });

      // Verify offer is deleted after retrieval
      expect(mockRedis.del).toHaveBeenCalledWith('room:abc123def456789012345678:offer');
    });
  });
});
