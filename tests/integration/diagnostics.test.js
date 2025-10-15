import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';

import { createRedisClient, sendError } from '../../api/_utils.js';

// Mock Redis client
const mockRedis = {
  ping: vi.fn(),
  get: vi.fn(),
  smembers: vi.fn(),
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
  };
});

describe('Diagnostics Endpoint Integration', () => {
  let mockReq;
  let mockRes;
  let originalEnv;

  beforeEach(() => {
    originalEnv = process.env;
    process.env = {
      ...originalEnv,
      VERCEL_REGION: 'us-east-1',
    };

    mockReq = {
      method: 'GET',
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

    // Default Redis responses
    mockRedis.ping.mockResolvedValue('PONG');
    mockRedis.get.mockResolvedValue(null);
    mockRedis.smembers.mockResolvedValue([]);
    mockRedis.lrange.mockResolvedValue([]);
  });

  afterEach(() => {
    process.env = originalEnv;
  });

  describe('GET /api/diagnostics - Server Health', () => {
    it('should return server diagnostics with healthy Redis', async () => {
      mockReq.method = 'GET';
      mockReq.query = {};

      const diagnosticsHandler = (await import('../../api/diagnostics.js')).default;
      await diagnosticsHandler(mockReq, mockRes);

      expect(mockRes.json).toHaveBeenCalledWith({
        timestamp: expect.any(Number),
        server: {
          status: 'online',
          region: 'us-east-1',
          redis: 'connected',
        },
      });

      // Verify Redis ping was called to test connection
      expect(mockRedis.ping).toHaveBeenCalled();
    });

    it('should return server diagnostics with unhealthy Redis', async () => {
      mockReq.method = 'GET';
      mockReq.query = {};

      // Mock Redis ping failure
      mockRedis.ping.mockRejectedValue(new Error('Connection failed'));

      const diagnosticsHandler = (await import('../../api/diagnostics.js')).default;
      await diagnosticsHandler(mockReq, mockRes);

      expect(mockRes.json).toHaveBeenCalledWith({
        timestamp: expect.any(Number),
        server: {
          status: 'online',
          region: 'us-east-1',
          redis: 'disconnected',
        },
      });

      // Verify Redis ping was called and failed
      expect(mockRedis.ping).toHaveBeenCalled();
    });

    it('should handle missing VERCEL_REGION environment variable', async () => {
      mockReq.method = 'GET';
      mockReq.query = {};

      // Remove VERCEL_REGION
      delete process.env.VERCEL_REGION;

      const diagnosticsHandler = (await import('../../api/diagnostics.js')).default;
      await diagnosticsHandler(mockReq, mockRes);

      expect(mockRes.json).toHaveBeenCalledWith({
        timestamp: expect.any(Number),
        server: {
          status: 'online',
          region: 'unknown',
          redis: 'connected',
        },
      });
    });
  });

  describe('GET /api/diagnostics?roomId=X - Room Diagnostics', () => {
    it('should return room diagnostics for existing room', async () => {
      mockReq.method = 'GET';
      mockReq.query = {
        roomId: 'abc123def456789012345678',
      };

      // Mock room exists with data
      mockRedis.get
        .mockResolvedValueOnce('{"createdAt":1234567890,"version":"1.0"}') // Room meta
        .mockResolvedValueOnce('{"type":"offer","sdp":"v=0..."}') // Offer exists
        .mockResolvedValueOnce('{"type":"answer","sdp":"v=0..."}') // Answer exists
        .mockResolvedValueOnce('1234567890') // Viewer1 heartbeat
        .mockResolvedValueOnce('1234567891'); // Viewer2 heartbeat

      mockRedis.smembers.mockResolvedValue(['viewer1', 'viewer2']);
      mockRedis.lrange.mockResolvedValue(['msg1', 'msg2', 'msg3']);

      const diagnosticsHandler = (await import('../../api/diagnostics.js')).default;
      await diagnosticsHandler(mockReq, mockRes);

      expect(mockRes.json).toHaveBeenCalledWith({
        timestamp: expect.any(Number),
        server: {
          status: 'online',
          region: 'us-east-1',
          redis: 'connected',
        },
        room: {
          exists: true,
          status: 'active',
          hasOffer: true,
          hasAnswer: true,
          viewerCount: 2,
          chatMessageCount: 3,
          created: 1234567890,
        },
      });

      // Verify all Redis operations were called
      expect(mockRedis.get).toHaveBeenCalledWith('room:abc123def456789012345678:meta');
      expect(mockRedis.get).toHaveBeenCalledWith('room:abc123def456789012345678:offer');
      expect(mockRedis.get).toHaveBeenCalledWith('room:abc123def456789012345678:answer');
      expect(mockRedis.smembers).toHaveBeenCalledWith('room:abc123def456789012345678:viewers');
      expect(mockRedis.lrange).toHaveBeenCalledWith('room:abc123def456789012345678:chat', 0, -1);
    });

    it('should return room diagnostics for non-existent room', async () => {
      mockReq.method = 'GET';
      mockReq.query = {
        roomId: 'nonexistentroom123456789',
      };

      // Mock room doesn't exist
      mockRedis.get.mockResolvedValue(null);

      const diagnosticsHandler = (await import('../../api/diagnostics.js')).default;
      await diagnosticsHandler(mockReq, mockRes);

      expect(mockRes.json).toHaveBeenCalledWith({
        timestamp: expect.any(Number),
        server: {
          status: 'online',
          region: 'us-east-1',
          redis: 'connected',
        },
        room: {
          exists: false,
          status: 'not_found',
        },
      });
    });

    it('should filter out inactive viewers (no heartbeat)', async () => {
      mockReq.method = 'GET';
      mockReq.query = {
        roomId: 'abc123def456789012345678',
      };

      // Mock room exists with mixed active/inactive viewers
      mockRedis.get
        .mockResolvedValueOnce('{"createdAt":1234567890,"version":"1.0"}') // Room meta
        .mockResolvedValueOnce(null) // No offer
        .mockResolvedValueOnce(null) // No answer
        .mockResolvedValueOnce('1234567890') // Viewer1 heartbeat exists
        .mockResolvedValueOnce(null); // Viewer2 heartbeat missing

      mockRedis.smembers.mockResolvedValue(['viewer1', 'viewer2']);
      mockRedis.lrange.mockResolvedValue([]);

      const diagnosticsHandler = (await import('../../api/diagnostics.js')).default;
      await diagnosticsHandler(mockReq, mockRes);

      expect(mockRes.json).toHaveBeenCalledWith({
        timestamp: expect.any(Number),
        server: {
          status: 'online',
          region: 'us-east-1',
          redis: 'connected',
        },
        room: {
          exists: true,
          status: 'active',
          hasOffer: false,
          hasAnswer: false,
          viewerCount: 1, // Only viewer1 is active
          chatMessageCount: 0,
          created: 1234567890,
        },
      });
    });

    it('should handle Redis errors gracefully in room diagnostics', async () => {
      mockReq.method = 'GET';
      mockReq.query = {
        roomId: 'abc123def456789012345678',
      };

      // Mock Redis error in room diagnostics - getRoomDiagnostics catches and returns error object
      mockRedis.get.mockRejectedValue(new Error('Redis connection failed'));

      const diagnosticsHandler = (await import('../../api/diagnostics.js')).default;
      await diagnosticsHandler(mockReq, mockRes);

      // The endpoint should still return 200 with error status in room object
      expect(mockRes.json).toHaveBeenCalledWith({
        timestamp: expect.any(Number),
        server: {
          status: 'online',
          region: 'us-east-1',
          redis: 'connected',
        },
        room: {
          exists: false,
          status: 'error',
          error: 'Redis connection failed',
        },
      });
    });
  });

  describe('Error Handling', () => {
    it('should handle general errors gracefully', async () => {
      mockReq.method = 'GET';
      mockReq.query = {};

      // Mock a different type of error that would cause the main handler to fail
      // We need to mock something that would cause the main try-catch to fail
      // Let's mock Date.now to throw an error
      const originalDateNow = Date.now;
      Date.now = vi.fn(() => {
        throw new Error('Date.now failed');
      });

      const diagnosticsHandler = (await import('../../api/diagnostics.js')).default;
      await diagnosticsHandler(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(500);
      expect(mockRes.json).toHaveBeenCalledWith({
        error: 'Diagnostics failed',
        message: 'Date.now failed',
      });

      // Restore Date.now
      Date.now = originalDateNow;
    });
  });
});
