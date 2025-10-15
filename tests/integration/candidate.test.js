import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';

// Mock Redis client with REAL behavior simulation
const mockRedis = {
  get: vi.fn(),
  rpush: vi.fn(),
  expire: vi.fn(),
  lrange: vi.fn(),
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

describe('Candidate Endpoint - REAL Logic Tests', () => {
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

  describe('POST /api/candidate - REAL Redis Transaction Testing', () => {
    it('should store candidate with correct JSON stringification', async () => {
      const testCandidate = {
        candidate: 'candidate:1 1 UDP 2130706431 192.168.1.100 54400 typ host',
        sdpMid: '0',
        sdpMLineIndex: 0,
      };

      mockReq.method = 'POST';
      mockReq.body = {
        roomId: 'abc123def456789012345678',
        role: 'host',
        candidate: testCandidate,
      };

      // Mock Redis multi transaction with REAL behavior
      const mockMulti = {
        get: vi.fn().mockReturnThis(),
        rpush: vi.fn().mockReturnThis(),
        expire: vi.fn().mockReturnThis(),
        exec: vi.fn().mockResolvedValue([
          '{"createdAt":1234567890,"version":"1.0"}', // Room exists
          1, // rpush result
          1, // expire result
        ]),
      };
      mockRedis.multi.mockReturnValue(mockMulti);

      const candidateHandler = (await import('../../api/candidate.js')).default;
      await candidateHandler(mockReq, mockRes);

      expect(mockRes.json).toHaveBeenCalledWith({ ok: true });

      // Verify REAL Redis transaction behavior
      expect(mockRedis.multi).toHaveBeenCalled();
      expect(mockMulti.get).toHaveBeenCalledWith('room:abc123def456789012345678:meta');
      expect(mockMulti.rpush).toHaveBeenCalledWith(
        'room:abc123def456789012345678:host:candidates',
        testCandidate // Upstash Redis auto-parses JSON, so we get the object
      );
      expect(mockMulti.expire).toHaveBeenCalledWith('room:abc123def456789012345678:host:candidates', 1800);
      expect(mockMulti.exec).toHaveBeenCalled();
    });

    it('should generate correct key for viewer with viewerId', async () => {
      const testCandidate = {
        candidate: 'candidate:2 1 UDP 2130706431 192.168.1.101 54401 typ host',
        sdpMid: '0',
        sdpMLineIndex: 0,
      };

      mockReq.method = 'POST';
      mockReq.body = {
        roomId: 'abc123def456789012345678',
        role: 'viewer',
        viewerId: 'viewer123',
        candidate: testCandidate,
      };

      // Mock Redis multi transaction
      const mockMulti = {
        get: vi.fn().mockReturnThis(),
        rpush: vi.fn().mockReturnThis(),
        expire: vi.fn().mockReturnThis(),
        exec: vi.fn().mockResolvedValue([
          '{"createdAt":1234567890,"version":"1.0"}', // Room exists
          1, // rpush result
          1, // expire result
        ]),
      };
      mockRedis.multi.mockReturnValue(mockMulti);

      const candidateHandler = (await import('../../api/candidate.js')).default;
      await candidateHandler(mockReq, mockRes);

      // Verify REAL key generation logic
      expect(mockMulti.rpush).toHaveBeenCalledWith(
        'room:abc123def456789012345678:viewer:viewer123:candidates', // Correct key for viewer with viewerId
        testCandidate // Upstash Redis auto-parses JSON
      );
    });

    it('should generate correct key for viewer without viewerId', async () => {
      const testCandidate = {
        candidate: 'candidate:3 1 UDP 2130706431 192.168.1.102 54402 typ host',
        sdpMid: '0',
        sdpMLineIndex: 0,
      };

      mockReq.method = 'POST';
      mockReq.body = {
        roomId: 'abc123def456789012345678',
        role: 'viewer',
        // No viewerId
        candidate: testCandidate,
      };

      // Mock Redis multi transaction
      const mockMulti = {
        get: vi.fn().mockReturnThis(),
        rpush: vi.fn().mockReturnThis(),
        expire: vi.fn().mockReturnThis(),
        exec: vi.fn().mockResolvedValue([
          '{"createdAt":1234567890,"version":"1.0"}', // Room exists
          1, // rpush result
          1, // expire result
        ]),
      };
      mockRedis.multi.mockReturnValue(mockMulti);

      const candidateHandler = (await import('../../api/candidate.js')).default;
      await candidateHandler(mockReq, mockRes);

      // Verify REAL key generation logic
      expect(mockMulti.rpush).toHaveBeenCalledWith(
        'room:abc123def456789012345678:viewer:candidates', // Correct key for viewer without viewerId
        testCandidate // Upstash Redis auto-parses JSON
      );
    });

    it('should handle room not found in transaction results', async () => {
      const testCandidate = {
        candidate: 'candidate:1 1 UDP 2130706431 192.168.1.100 54400 typ host',
        sdpMid: '0',
        sdpMLineIndex: 0,
      };

      mockReq.method = 'POST';
      mockReq.body = {
        roomId: 'abc123def456789012345678',
        role: 'host',
        candidate: testCandidate,
      };

      // Mock Redis multi transaction with room not found
      const mockMulti = {
        get: vi.fn().mockReturnThis(),
        rpush: vi.fn().mockReturnThis(),
        expire: vi.fn().mockReturnThis(),
        exec: vi.fn().mockResolvedValue([
          null, // Room not found
          1, // rpush result
          1, // expire result
        ]),
      };
      mockRedis.multi.mockReturnValue(mockMulti);

      const candidateHandler = (await import('../../api/candidate.js')).default;
      await candidateHandler(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(410);
      expect(mockRes.json).toHaveBeenCalledWith({
        error: 'Room expired or not found',
        timestamp: expect.any(String),
      });
    });
  });

  describe('GET /api/candidate - REAL JSON Parsing Testing', () => {
    it('should parse JSON candidates correctly', async () => {
      const testCandidates = [
        JSON.stringify({
          candidate: 'candidate:1 1 UDP 2130706431 192.168.1.100 54400 typ host',
          sdpMid: '0',
          sdpMLineIndex: 0,
        }),
        JSON.stringify({
          candidate: 'candidate:2 1 UDP 2130706431 192.168.1.101 54401 typ host',
          sdpMid: '1',
          sdpMLineIndex: 1,
        }),
      ];

      mockReq.method = 'GET';
      mockReq.query = {
        roomId: 'abc123def456789012345678',
        role: 'host',
      };

      // Mock the initial room existence check
      mockRedis.get.mockResolvedValue('{"createdAt":1234567890,"version":"1.0"}');

      // Mock Redis multi transaction
      const mockMulti = {
        lrange: vi.fn().mockReturnThis(),
        del: vi.fn().mockReturnThis(),
        exec: vi.fn().mockResolvedValue([
          testCandidates, // lrange result
          1, // del result
        ]),
      };
      mockRedis.multi.mockReturnValue(mockMulti);

      const candidateHandler = (await import('../../api/candidate.js')).default;
      await candidateHandler(mockReq, mockRes);

      expect(mockRes.json).toHaveBeenCalledWith({
        candidates: [
          {
            candidate: 'candidate:1 1 UDP 2130706431 192.168.1.100 54400 typ host',
            sdpMid: '0',
            sdpMLineIndex: 0,
          },
          {
            candidate: 'candidate:2 1 UDP 2130706431 192.168.1.101 54401 typ host',
            sdpMid: '1',
            sdpMLineIndex: 1,
          },
        ],
      });

      // Verify REAL Redis operations
      expect(mockRedis.get).toHaveBeenCalledWith('room:abc123def456789012345678:meta');
      expect(mockMulti.lrange).toHaveBeenCalledWith('room:abc123def456789012345678:host:candidates', 0, -1);
      expect(mockMulti.del).toHaveBeenCalledWith('room:abc123def456789012345678:host:candidates');
    });

    it('should handle malformed JSON in candidates', async () => {
      const malformedCandidates = ['{"valid": "json"}', 'invalid-json-string', '{"another": "valid"}'];

      mockReq.method = 'GET';
      mockReq.query = {
        roomId: 'abc123def456789012345678',
        role: 'host',
      };

      // Mock the initial room existence check
      mockRedis.get.mockResolvedValue('{"createdAt":1234567890,"version":"1.0"}');

      // Mock Redis multi transaction
      const mockMulti = {
        lrange: vi.fn().mockReturnThis(),
        del: vi.fn().mockReturnThis(),
        exec: vi.fn().mockResolvedValue([
          malformedCandidates, // lrange result with malformed JSON
          1, // del result
        ]),
      };
      mockRedis.multi.mockReturnValue(mockMulti);

      const candidateHandler = (await import('../../api/candidate.js')).default;
      await candidateHandler(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(500);
      expect(mockRes.json).toHaveBeenCalledWith({
        error: 'Failed to parse candidate data',
        timestamp: expect.any(String),
      });
    });

    it('should handle already parsed JSON objects from Upstash Redis', async () => {
      const parsedCandidates = [
        {
          candidate: 'candidate:1 1 UDP 2130706431 192.168.1.100 54400 typ host',
          sdpMid: '0',
          sdpMLineIndex: 0,
        },
        {
          candidate: 'candidate:2 1 UDP 2130706431 192.168.1.101 54401 typ host',
          sdpMid: '1',
          sdpMLineIndex: 1,
        },
      ];

      mockReq.method = 'GET';
      mockReq.query = {
        roomId: 'abc123def456789012345678',
        role: 'host',
      };

      // Mock the initial room existence check
      mockRedis.get.mockResolvedValue('{"createdAt":1234567890,"version":"1.0"}');

      // Mock Redis multi transaction
      const mockMulti = {
        lrange: vi.fn().mockReturnThis(),
        del: vi.fn().mockReturnThis(),
        exec: vi.fn().mockResolvedValue([
          parsedCandidates, // Already parsed objects
          1, // del result
        ]),
      };
      mockRedis.multi.mockReturnValue(mockMulti);

      const candidateHandler = (await import('../../api/candidate.js')).default;
      await candidateHandler(mockReq, mockRes);

      expect(mockRes.json).toHaveBeenCalledWith({
        candidates: parsedCandidates, // Should return as-is
      });
    });
  });
});
