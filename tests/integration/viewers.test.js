import { vi, describe, it, expect, beforeEach, afterEach } from 'vitest';

// Mock Redis client
const mockRedis = {
  get: vi.fn(),
  set: vi.fn(),
  del: vi.fn(),
  exists: vi.fn(),
  expire: vi.fn(),
  quit: vi.fn(),
  sadd: vi.fn(),
  smembers: vi.fn(),
};

// Mock the API utilities
vi.mock('../../api/_utils.js', async () => {
  const actual = await vi.importActual('../../api/_utils.js');
  return {
    ...actual,
    createRedisClient: vi.fn(() => mockRedis),
    sendError: vi.fn((res, status, message) =>
      res.status(status).json({
        error: message,
        timestamp: new Date().toISOString(),
      })
    ),
    validateRoomId: vi.fn((roomId) => {
      if (!roomId || roomId.length !== 24) {
        return { valid: false, error: 'Invalid roomId format' };
      }
      return { valid: true };
    }),
    validateViewerId: vi.fn((viewerId) => {
      if (!viewerId || viewerId.trim().length === 0) {
        return { valid: false, error: 'Viewer ID is required' };
      }
      if (viewerId.length > 50) {
        return { valid: false, error: 'Viewer ID too long' };
      }
      return { valid: true };
    }),
    TTL_ROOM: 1800,
    TTL_HEARTBEAT: 30,
  };
});

describe('Viewers Endpoint Integration', () => {
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
    mockRedis.sadd.mockResolvedValue(1);
    mockRedis.smembers.mockResolvedValue([]);
  });

  afterEach(() => {
    // Restore original environment
    process.env = originalEnv;
  });

  describe('POST /api/viewers - Register Viewer Heartbeat', () => {
    it('should register viewer heartbeat successfully', async () => {
      mockReq.method = 'POST';
      mockReq.body = {
        roomId: 'abc123def456789012345678',
        viewerId: 'viewer123',
      };

      const viewersHandler = (await import('../../api/viewers.js')).default;
      await viewersHandler(mockReq, mockRes);

      expect(mockRes.json).toHaveBeenCalledWith({ ok: true });

      // Verify Redis operations in the correct order and with correct values
      expect(mockRedis.set).toHaveBeenCalledWith(
        'room:abc123def456789012345678:viewer:viewer123:heartbeat',
        expect.any(Number)
      );
      expect(mockRedis.expire).toHaveBeenCalledWith(
        'room:abc123def456789012345678:viewer:viewer123:heartbeat',
        30 // TTL_HEARTBEAT
      );
      expect(mockRedis.sadd).toHaveBeenCalledWith('room:abc123def456789012345678:viewers', 'viewer123');
      expect(mockRedis.expire).toHaveBeenCalledWith(
        'room:abc123def456789012345678:viewers',
        1800 // TTL_ROOM
      );

      // Verify the heartbeat timestamp is recent (within last 5 seconds)
      const heartbeatCall = mockRedis.set.mock.calls.find(
        (call) => call[0] === 'room:abc123def456789012345678:viewer:viewer123:heartbeat'
      );
      expect(heartbeatCall).toBeDefined();
      const timestamp = heartbeatCall[1];
      const now = Date.now();
      expect(timestamp).toBeGreaterThan(now - 5000); // Within last 5 seconds
      expect(timestamp).toBeLessThanOrEqual(now);
    });
  });

  describe('GET /api/viewers - Get Active Viewers', () => {
    it('should return active viewer count', async () => {
      mockReq.method = 'GET';
      mockReq.query = {
        roomId: 'abc123def456789012345678',
      };

      // Mock active viewers
      mockRedis.smembers.mockResolvedValue(['viewer1', 'viewer2']);
      mockRedis.get
        .mockResolvedValueOnce('{"createdAt":1234567890,"version":"1.0"}') // Room exists
        .mockResolvedValueOnce('1234567890') // viewer1 heartbeat
        .mockResolvedValueOnce('1234567891'); // viewer2 heartbeat

      const viewersHandler = (await import('../../api/viewers.js')).default;
      await viewersHandler(mockReq, mockRes);

      expect(mockRes.json).toHaveBeenCalledWith({
        count: 2,
        viewers: ['viewer1', 'viewer2'],
      });
    });

    it('should filter out inactive viewers (no heartbeat)', async () => {
      mockReq.method = 'GET';
      mockReq.query = {
        roomId: 'abc123def456789012345678',
      };

      // Mock viewers but one has no heartbeat
      mockRedis.smembers.mockResolvedValue(['viewer1', 'viewer2', 'viewer3']);
      mockRedis.get
        .mockResolvedValueOnce('{"createdAt":1234567890,"version":"1.0"}') // Room exists
        .mockResolvedValueOnce('1234567890') // viewer1 heartbeat exists
        .mockResolvedValueOnce(null) // viewer2 heartbeat missing (inactive)
        .mockResolvedValueOnce('1234567891'); // viewer3 heartbeat exists

      const viewersHandler = (await import('../../api/viewers.js')).default;
      await viewersHandler(mockReq, mockRes);

      expect(mockRes.json).toHaveBeenCalledWith({
        count: 2,
        viewers: ['viewer1', 'viewer3'], // viewer2 filtered out
      });
    });

    it('should handle empty viewers set', async () => {
      mockReq.method = 'GET';
      mockReq.query = {
        roomId: 'abc123def456789012345678',
      };

      // Mock empty viewers set
      mockRedis.smembers.mockResolvedValue([]);
      mockRedis.get.mockResolvedValueOnce('{"createdAt":1234567890,"version":"1.0"}'); // Room exists

      const viewersHandler = (await import('../../api/viewers.js')).default;
      await viewersHandler(mockReq, mockRes);

      expect(mockRes.json).toHaveBeenCalledWith({
        count: 0,
        viewers: [],
      });
    });

    it('should reject missing room', async () => {
      mockReq.method = 'GET';
      mockReq.query = {
        roomId: 'abc123def456789012345678',
      };

      // Mock room not found
      mockRedis.get.mockResolvedValue(null);

      const viewersHandler = (await import('../../api/viewers.js')).default;
      await viewersHandler(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(410);
      expect(mockRes.json).toHaveBeenCalledWith({
        error: 'Room expired or not found',
        timestamp: expect.any(String),
      });
    });

    it('should reject invalid room ID', async () => {
      mockReq.method = 'GET';
      mockReq.query = {
        roomId: 'invalid-room-id',
      };

      const viewersHandler = (await import('../../api/viewers.js')).default;
      await viewersHandler(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(400);
      expect(mockRes.json).toHaveBeenCalledWith({
        error: 'Invalid roomId format',
        timestamp: expect.any(String),
      });
    });

    it('should reject invalid viewer ID', async () => {
      mockReq.method = 'POST';
      mockReq.body = {
        roomId: 'abc123def456789012345678',
        viewerId: '', // Empty viewer ID
      };

      const viewersHandler = (await import('../../api/viewers.js')).default;
      await viewersHandler(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(400);
      expect(mockRes.json).toHaveBeenCalledWith({
        error: 'Viewer ID is required',
        timestamp: expect.any(String),
      });
    });
  });
});
