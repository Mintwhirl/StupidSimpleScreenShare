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
    sendError: vi.fn((res, status, message, error) => {
      return res.status(status).json({
        error: message,
        timestamp: new Date().toISOString(),
      });
    }),
    TTL_ROOM: 3600,
  };
});

describe('Offer Endpoint Integration', () => {
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

  describe('POST /api/offer - Store Offer', () => {
    it('should store offer successfully', async () => {
      mockReq.method = 'POST';
      mockReq.body = {
        roomId: 'abc123def456789012345678',
        desc: {
          type: 'offer',
          sdp: 'v=0\r\no=- 123456789 2 IN IP4 127.0.0.1\r\ns=-\r\nt=0 0\r\n',
        },
      };

      const offerHandler = (await import('../../api/offer.js')).default;
      await offerHandler(mockReq, mockRes);

      expect(mockRes.json).toHaveBeenCalledWith({ ok: true });

      // Verify Redis operations
      expect(mockRedis.set).toHaveBeenCalledWith(
        'room:abc123def456789012345678:offer',
        JSON.stringify(mockReq.body.desc),
      );
      expect(mockRedis.expire).toHaveBeenCalledWith('room:abc123def456789012345678:offer', 3600);
    });

    it('should reject invalid room ID', async () => {
      mockReq.method = 'POST';
      mockReq.body = {
        roomId: 'invalid-room-id',
        desc: {
          type: 'offer',
          sdp: 'v=0\r\no=- 123456789 2 IN IP4 127.0.0.1\r\ns=-\r\nt=0 0\r\n',
        },
      };

      const offerHandler = (await import('../../api/offer.js')).default;
      await offerHandler(mockReq, mockRes);

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
          type: 'offer',
          // Missing required sdp field
        },
      };

      const offerHandler = (await import('../../api/offer.js')).default;
      await offerHandler(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(400);
      expect(mockRes.json).toHaveBeenCalledWith({
        error: 'Missing or invalid SDP',
        timestamp: expect.any(String),
      });
    });

    it('should reject non-offer descriptor type', async () => {
      mockReq.method = 'POST';
      mockReq.body = {
        roomId: 'abc123def456789012345678',
        desc: {
          type: 'answer', // Wrong type
          sdp: 'v=0\r\no=- 123456789 2 IN IP4 127.0.0.1\r\ns=-\r\nt=0 0\r\n',
        },
      };

      const offerHandler = (await import('../../api/offer.js')).default;
      await offerHandler(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(400);
      expect(mockRes.json).toHaveBeenCalledWith({
        error: 'Descriptor must be of type "offer"',
        timestamp: expect.any(String),
      });
    });

    it('should reject missing room', async () => {
      mockReq.method = 'POST';
      mockReq.body = {
        roomId: 'abc123def456789012345678',
        desc: {
          type: 'offer',
          sdp: 'v=0\r\no=- 123456789 2 IN IP4 127.0.0.1\r\ns=-\r\nt=0 0\r\n',
        },
      };

      // Mock room not found
      mockRedis.get.mockResolvedValue(null);

      const offerHandler = (await import('../../api/offer.js')).default;
      await offerHandler(mockReq, mockRes);

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
          type: 'offer',
          sdp: 'v=0\r\no=- 123456789 2 IN IP4 127.0.0.1\r\ns=-\r\nt=0 0\r\n',
        },
      };

      // Mock Redis error
      mockRedis.set.mockRejectedValue(new Error('Redis connection failed'));

      const offerHandler = (await import('../../api/offer.js')).default;
      await offerHandler(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(500);
      expect(mockRes.json).toHaveBeenCalledWith({
        error: 'Internal server error',
        timestamp: expect.any(String),
      });
    });
  });

  describe('GET /api/offer - Retrieve Offer', () => {
    it('should retrieve offer successfully', async () => {
      mockReq.method = 'GET';
      mockReq.query = {
        roomId: 'abc123def456789012345678',
      };

      const mockOffer = {
        type: 'offer',
        sdp: 'v=0\r\no=- 123456789 2 IN IP4 127.0.0.1\r\ns=-\r\nt=0 0\r\n',
      };

      // Mock offer exists
      mockRedis.get
        .mockResolvedValueOnce('{"createdAt":1234567890,"version":"1.0"}') // Room exists
        .mockResolvedValueOnce(JSON.stringify(mockOffer)); // Offer exists

      const offerHandler = (await import('../../api/offer.js')).default;
      await offerHandler(mockReq, mockRes);

      expect(mockRes.json).toHaveBeenCalledWith({ desc: mockOffer });
    });

    it('should handle auto-parsed JSON from Redis', async () => {
      mockReq.method = 'GET';
      mockReq.query = {
        roomId: 'abc123def456789012345678',
      };

      const mockOffer = {
        type: 'offer',
        sdp: 'v=0\r\no=- 123456789 2 IN IP4 127.0.0.1\r\ns=-\r\nt=0 0\r\n',
      };

      // Mock Redis returning already parsed object
      mockRedis.get
        .mockResolvedValueOnce('{"createdAt":1234567890,"version":"1.0"}') // Room exists
        .mockResolvedValueOnce(mockOffer); // Offer as object (not string)

      const offerHandler = (await import('../../api/offer.js')).default;
      await offerHandler(mockReq, mockRes);

      expect(mockRes.json).toHaveBeenCalledWith({ desc: mockOffer });
    });

    it('should return 404 when no offer exists', async () => {
      mockReq.method = 'GET';
      mockReq.query = {
        roomId: 'abc123def456789012345678',
      };

      // Mock room exists but no offer
      mockRedis.get
        .mockResolvedValueOnce('{"createdAt":1234567890,"version":"1.0"}') // Room exists
        .mockResolvedValueOnce(null); // No offer

      const offerHandler = (await import('../../api/offer.js')).default;
      await offerHandler(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(404);
      expect(mockRes.json).toHaveBeenCalledWith({ error: 'No offer available yet' });
    });

    it('should reject invalid room ID for GET', async () => {
      mockReq.method = 'GET';
      mockReq.query = {
        roomId: 'invalid-room-id',
      };

      const offerHandler = (await import('../../api/offer.js')).default;
      await offerHandler(mockReq, mockRes);

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

      const offerHandler = (await import('../../api/offer.js')).default;
      await offerHandler(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(410);
      expect(mockRes.json).toHaveBeenCalledWith({
        error: 'Room expired or not found',
        timestamp: expect.any(String),
      });
    });

    it('should handle malformed offer JSON gracefully', async () => {
      mockReq.method = 'GET';
      mockReq.query = {
        roomId: 'abc123def456789012345678',
      };

      // Mock room exists but offer is malformed JSON
      mockRedis.get
        .mockResolvedValueOnce('{"createdAt":1234567890,"version":"1.0"}') // Room exists
        .mockResolvedValueOnce('invalid-json-string'); // Malformed JSON

      const offerHandler = (await import('../../api/offer.js')).default;
      await offerHandler(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(500);
      expect(mockRes.json).toHaveBeenCalledWith({
        error: 'Failed to parse offer data',
        timestamp: expect.any(String),
      });
    });
  });

  describe('General Offer Endpoint Behavior', () => {
    it('should handle OPTIONS requests for CORS preflight', async () => {
      mockReq.method = 'OPTIONS';

      const offerHandler = (await import('../../api/offer.js')).default;
      await offerHandler(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(204);
      expect(mockRes.end).toHaveBeenCalled();
    });

    it('should reject unsupported HTTP methods', async () => {
      mockReq.method = 'PUT';
      mockReq.query = {
        roomId: 'abc123def456789012345678',
      };

      const offerHandler = (await import('../../api/offer.js')).default;
      await offerHandler(mockReq, mockRes);

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
        desc: { type: 'offer', sdp: 'test' },
      };

      const offerHandler = (await import('../../api/offer.js')).default;
      await offerHandler(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(400);
      expect(mockRes.json).toHaveBeenCalledWith({
        error: 'Invalid roomId format',
        timestamp: expect.any(String),
      });
    });

    it('should handle large SDP offers', async () => {
      mockReq.method = 'POST';
      mockReq.body = {
        roomId: 'abc123def456789012345678',
        desc: {
          type: 'offer',
          sdp: 'v=0\r\no=- 123456789 2 IN IP4 127.0.0.1\r\ns=-\r\nt=0 0\r\n' + 'a=ice-ufrag:test\r\n'.repeat(100), // Large SDP
        },
      };

      const offerHandler = (await import('../../api/offer.js')).default;
      await offerHandler(mockReq, mockRes);

      expect(mockRes.json).toHaveBeenCalledWith({ ok: true });
      expect(mockRedis.set).toHaveBeenCalledWith(
        'room:abc123def456789012345678:offer',
        JSON.stringify(mockReq.body.desc),
      );
    });

    it('should handle empty SDP gracefully', async () => {
      mockReq.method = 'POST';
      mockReq.body = {
        roomId: 'abc123def456789012345678',
        desc: {
          type: 'offer',
          sdp: '', // Empty SDP
        },
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
});
