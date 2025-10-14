import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';

// Mock Redis client
const mockRedis = {
  get: vi.fn(),
  rpush: vi.fn(),
  expire: vi.fn(),
  lrange: vi.fn(),
  del: vi.fn(),
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

describe('Candidate Endpoint Integration', () => {
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
    mockRedis.rpush.mockResolvedValue(1);
    mockRedis.expire.mockResolvedValue(1);
    mockRedis.lrange.mockResolvedValue([]);
    mockRedis.del.mockResolvedValue(1);
  });

  afterEach(() => {
    // Restore original environment
    process.env = originalEnv;
  });

  describe('POST /api/candidate - Store Candidate', () => {
    it('should store candidate successfully for host role', async () => {
      mockReq.method = 'POST';
      mockReq.body = {
        roomId: 'abc123def456789012345678',
        role: 'host',
        candidate: {
          candidate: 'candidate:1 1 UDP 2130706431 192.168.1.100 54400 typ host',
          sdpMid: '0',
          sdpMLineIndex: 0,
        },
      };

      const candidateHandler = (await import('../../api/candidate.js')).default;
      await candidateHandler(mockReq, mockRes);

      expect(mockRes.json).toHaveBeenCalledWith({ ok: true });

      // Verify Redis operations
      expect(mockRedis.rpush).toHaveBeenCalledWith(
        'room:abc123def456789012345678:host:candidates',
        JSON.stringify(mockReq.body.candidate)
      );
      expect(mockRedis.expire).toHaveBeenCalledWith('room:abc123def456789012345678:host:candidates', 3600);
    });

    it('should store candidate successfully for viewer role', async () => {
      mockReq.method = 'POST';
      mockReq.body = {
        roomId: 'abc123def456789012345678',
        role: 'viewer',
        candidate: {
          candidate: 'candidate:2 1 UDP 2130706431 192.168.1.101 54401 typ host',
          sdpMid: '0',
          sdpMLineIndex: 0,
        },
      };

      const candidateHandler = (await import('../../api/candidate.js')).default;
      await candidateHandler(mockReq, mockRes);

      expect(mockRes.json).toHaveBeenCalledWith({ ok: true });

      // Verify Redis operations
      expect(mockRedis.rpush).toHaveBeenCalledWith(
        'room:abc123def456789012345678:viewer:candidates',
        JSON.stringify(mockReq.body.candidate)
      );
      expect(mockRedis.expire).toHaveBeenCalledWith('room:abc123def456789012345678:viewer:candidates', 3600);
    });

    it('should reject invalid room ID', async () => {
      mockReq.method = 'POST';
      mockReq.body = {
        roomId: 'invalid-room-id',
        role: 'host',
        candidate: {
          candidate: 'candidate:1 1 UDP 2130706431 192.168.1.100 54400 typ host',
          sdpMid: '0',
          sdpMLineIndex: 0,
        },
      };

      const candidateHandler = (await import('../../api/candidate.js')).default;
      await candidateHandler(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(400);
      expect(mockRes.json).toHaveBeenCalledWith({
        error: 'Invalid roomId format',
        timestamp: expect.any(String),
      });
    });

    it('should reject invalid role', async () => {
      mockReq.method = 'POST';
      mockReq.body = {
        roomId: 'abc123def456789012345678',
        role: 'invalid-role',
        candidate: {
          candidate: 'candidate:1 1 UDP 2130706431 192.168.1.100 54400 typ host',
          sdpMid: '0',
          sdpMLineIndex: 0,
        },
      };

      const candidateHandler = (await import('../../api/candidate.js')).default;
      await candidateHandler(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(400);
      expect(mockRes.json).toHaveBeenCalledWith({
        error: 'Role must be either "host" or "viewer"',
        timestamp: expect.any(String),
      });
    });

    it('should reject invalid candidate', async () => {
      mockReq.method = 'POST';
      mockReq.body = {
        roomId: 'abc123def456789012345678',
        role: 'host',
        candidate: {
          // Missing required candidate field
          sdpMid: '0',
          sdpMLineIndex: 0,
        },
      };

      const candidateHandler = (await import('../../api/candidate.js')).default;
      await candidateHandler(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(400);
      expect(mockRes.json).toHaveBeenCalledWith({
        error: 'Invalid candidate string',
        timestamp: expect.any(String),
      });
    });

    it('should reject missing room', async () => {
      mockReq.method = 'POST';
      mockReq.body = {
        roomId: 'abc123def456789012345678',
        role: 'host',
        candidate: {
          candidate: 'candidate:1 1 UDP 2130706431 192.168.1.100 54400 typ host',
          sdpMid: '0',
          sdpMLineIndex: 0,
        },
      };

      // Mock room not found
      mockRedis.get.mockResolvedValue(null);

      const candidateHandler = (await import('../../api/candidate.js')).default;
      await candidateHandler(mockReq, mockRes);

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
        role: 'host',
        candidate: {
          candidate: 'candidate:1 1 UDP 2130706431 192.168.1.100 54400 typ host',
          sdpMid: '0',
          sdpMLineIndex: 0,
        },
      };

      // Mock Redis error
      mockRedis.rpush.mockRejectedValue(new Error('Redis connection failed'));

      const candidateHandler = (await import('../../api/candidate.js')).default;
      await candidateHandler(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(500);
      expect(mockRes.json).toHaveBeenCalledWith({
        error: 'Internal server error',
        timestamp: expect.any(String),
      });
    });
  });

  describe('GET /api/candidate - Retrieve Candidates', () => {
    it('should retrieve candidates successfully for host role', async () => {
      mockReq.method = 'GET';
      mockReq.query = {
        roomId: 'abc123def456789012345678',
        role: 'host',
      };

      const mockCandidates = [
        {
          candidate: 'candidate:1 1 UDP 2130706431 192.168.1.100 54400 typ host',
          sdpMid: '0',
          sdpMLineIndex: 0,
        },
        {
          candidate: 'candidate:2 1 UDP 2130706431 192.168.1.101 54401 typ host',
          sdpMid: '0',
          sdpMLineIndex: 0,
        },
      ];

      // Mock candidates exist
      mockRedis.get.mockResolvedValue('{"createdAt":1234567890,"version":"1.0"}'); // Room exists
      mockRedis.lrange.mockResolvedValue(mockCandidates.map((c) => JSON.stringify(c)));

      const candidateHandler = (await import('../../api/candidate.js')).default;
      await candidateHandler(mockReq, mockRes);

      expect(mockRes.json).toHaveBeenCalledWith({ candidates: mockCandidates });

      // Verify Redis operations
      expect(mockRedis.lrange).toHaveBeenCalledWith('room:abc123def456789012345678:host:candidates', 0, -1);
      expect(mockRedis.del).toHaveBeenCalledWith('room:abc123def456789012345678:host:candidates');
    });

    it('should retrieve candidates successfully for viewer role', async () => {
      mockReq.method = 'GET';
      mockReq.query = {
        roomId: 'abc123def456789012345678',
        role: 'viewer',
      };

      const mockCandidates = [
        {
          candidate: 'candidate:1 1 UDP 2130706431 192.168.1.100 54400 typ host',
          sdpMid: '0',
          sdpMLineIndex: 0,
        },
      ];

      // Mock candidates exist
      mockRedis.get.mockResolvedValue('{"createdAt":1234567890,"version":"1.0"}'); // Room exists
      mockRedis.lrange.mockResolvedValue(mockCandidates.map((c) => JSON.stringify(c)));

      const candidateHandler = (await import('../../api/candidate.js')).default;
      await candidateHandler(mockReq, mockRes);

      expect(mockRes.json).toHaveBeenCalledWith({ candidates: mockCandidates });

      // Verify Redis operations
      expect(mockRedis.lrange).toHaveBeenCalledWith('room:abc123def456789012345678:viewer:candidates', 0, -1);
      expect(mockRedis.del).toHaveBeenCalledWith('room:abc123def456789012345678:viewer:candidates');
    });

    it('should return empty array when no candidates exist', async () => {
      mockReq.method = 'GET';
      mockReq.query = {
        roomId: 'abc123def456789012345678',
        role: 'host',
      };

      // Mock room exists but no candidates
      mockRedis.get.mockResolvedValue('{"createdAt":1234567890,"version":"1.0"}'); // Room exists
      mockRedis.lrange.mockResolvedValue([]); // No candidates

      const candidateHandler = (await import('../../api/candidate.js')).default;
      await candidateHandler(mockReq, mockRes);

      expect(mockRes.json).toHaveBeenCalledWith({ candidates: [] });

      // Should not delete when no candidates
      expect(mockRedis.del).not.toHaveBeenCalled();
    });

    it('should handle auto-parsed JSON from Redis', async () => {
      mockReq.method = 'GET';
      mockReq.query = {
        roomId: 'abc123def456789012345678',
        role: 'host',
      };

      const mockCandidates = [
        {
          candidate: 'candidate:1 1 UDP 2130706431 192.168.1.100 54400 typ host',
          sdpMid: '0',
          sdpMLineIndex: 0,
        },
      ];

      // Mock Redis returning already parsed objects
      mockRedis.get.mockResolvedValue('{"createdAt":1234567890,"version":"1.0"}'); // Room exists
      mockRedis.lrange.mockResolvedValue(mockCandidates); // Already parsed objects

      const candidateHandler = (await import('../../api/candidate.js')).default;
      await candidateHandler(mockReq, mockRes);

      expect(mockRes.json).toHaveBeenCalledWith({ candidates: mockCandidates });
    });

    it('should reject invalid room ID for GET', async () => {
      mockReq.method = 'GET';
      mockReq.query = {
        roomId: 'invalid-room-id',
        role: 'host',
      };

      const candidateHandler = (await import('../../api/candidate.js')).default;
      await candidateHandler(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(400);
      expect(mockRes.json).toHaveBeenCalledWith({
        error: 'Invalid roomId format',
        timestamp: expect.any(String),
      });
    });

    it('should reject invalid role for GET', async () => {
      mockReq.method = 'GET';
      mockReq.query = {
        roomId: 'abc123def456789012345678',
        role: 'invalid-role',
      };

      const candidateHandler = (await import('../../api/candidate.js')).default;
      await candidateHandler(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(400);
      expect(mockRes.json).toHaveBeenCalledWith({
        error: 'Role must be either "host" or "viewer"',
        timestamp: expect.any(String),
      });
    });

    it('should reject missing room for GET', async () => {
      mockReq.method = 'GET';
      mockReq.query = {
        roomId: 'abc123def456789012345678',
        role: 'host',
      };

      // Mock room not found
      mockRedis.get.mockResolvedValue(null);

      const candidateHandler = (await import('../../api/candidate.js')).default;
      await candidateHandler(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(410);
      expect(mockRes.json).toHaveBeenCalledWith({
        error: 'Room expired or not found',
        timestamp: expect.any(String),
      });
    });

    it('should handle malformed candidate JSON gracefully', async () => {
      mockReq.method = 'GET';
      mockReq.query = {
        roomId: 'abc123def456789012345678',
        role: 'host',
      };

      // Mock room exists but candidates have malformed JSON
      mockRedis.get.mockResolvedValue('{"createdAt":1234567890,"version":"1.0"}'); // Room exists
      mockRedis.lrange.mockResolvedValue([
        JSON.stringify({
          candidate: 'candidate:1 1 UDP 2130706431 192.168.1.100 54400 typ host',
          sdpMid: '0',
          sdpMLineIndex: 0,
        }),
        'invalid-json-string', // Malformed JSON
      ]);

      const candidateHandler = (await import('../../api/candidate.js')).default;
      await candidateHandler(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(500);
      expect(mockRes.json).toHaveBeenCalledWith({
        error: 'Failed to parse candidate data',
        timestamp: expect.any(String),
      });
    });
  });

  describe('General Candidate Endpoint Behavior', () => {
    it('should handle OPTIONS requests for CORS preflight', async () => {
      mockReq.method = 'OPTIONS';

      const candidateHandler = (await import('../../api/candidate.js')).default;
      await candidateHandler(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(204);
      expect(mockRes.end).toHaveBeenCalled();
    });

    it('should reject unsupported HTTP methods', async () => {
      mockReq.method = 'PUT';
      mockReq.query = {
        roomId: 'abc123def456789012345678',
        role: 'host',
      };

      const candidateHandler = (await import('../../api/candidate.js')).default;
      await candidateHandler(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(405);
      expect(mockRes.json).toHaveBeenCalledWith({
        error: 'Method not allowed',
        timestamp: expect.any(String),
      });
    });

    it('should validate room ID and role for both POST and GET', async () => {
      // Test POST with invalid room ID
      mockReq.method = 'POST';
      mockReq.body = {
        roomId: 'invalid',
        role: 'host',
        candidate: { candidate: 'test', sdpMid: '0', sdpMLineIndex: 0 },
      };

      const candidateHandler = (await import('../../api/candidate.js')).default;
      await candidateHandler(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(400);
      expect(mockRes.json).toHaveBeenCalledWith({
        error: 'Invalid roomId format',
        timestamp: expect.any(String),
      });
    });

    it('should handle large candidate data', async () => {
      mockReq.method = 'POST';
      mockReq.body = {
        roomId: 'abc123def456789012345678',
        role: 'host',
        candidate: {
          candidate:
            'candidate:1 1 UDP 2130706431 192.168.1.100 54400 typ host generation 0 ufrag test network-cost 999',
          sdpMid: '0',
          sdpMLineIndex: 0,
          // Add additional properties to make it larger
          foundation: '1',
          component: '1',
          priority: 2130706431,
          ip: '192.168.1.100',
          port: 54400,
          type: 'host',
          generation: 0,
          ufrag: 'test',
          'network-cost': 999,
        },
      };

      const candidateHandler = (await import('../../api/candidate.js')).default;
      await candidateHandler(mockReq, mockRes);

      expect(mockRes.json).toHaveBeenCalledWith({ ok: true });
      expect(mockRedis.rpush).toHaveBeenCalledWith(
        'room:abc123def456789012345678:host:candidates',
        JSON.stringify(mockReq.body.candidate)
      );
    });

    it('should handle multiple candidates for same role', async () => {
      mockReq.method = 'POST';
      mockReq.body = {
        roomId: 'abc123def456789012345678',
        role: 'host',
        candidate: {
          candidate: 'candidate:1 1 UDP 2130706431 192.168.1.100 54400 typ host',
          sdpMid: '0',
          sdpMLineIndex: 0,
        },
      };

      const candidateHandler = (await import('../../api/candidate.js')).default;

      // Store first candidate
      await candidateHandler(mockReq, mockRes);
      expect(mockRes.json).toHaveBeenCalledWith({ ok: true });

      // Store second candidate
      mockReq.body.candidate.candidate = 'candidate:2 1 UDP 2130706431 192.168.1.101 54401 typ host';
      await candidateHandler(mockReq, mockRes);
      expect(mockRes.json).toHaveBeenCalledWith({ ok: true });

      // Verify both were stored
      expect(mockRedis.rpush).toHaveBeenCalledTimes(2);
    });
  });
});
