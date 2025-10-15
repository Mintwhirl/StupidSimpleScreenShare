import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';

import { createRedisClient } from '../../api/_utils.js';

// Mock Redis client
const mockRedis = {
  ping: vi.fn(),
  set: vi.fn(),
};

// Mock the Redis client creation
vi.mock('../../api/_utils.js', async () => {
  const actual = await vi.importActual('../../api/_utils.js');
  return {
    ...actual,
    createRedisClient: vi.fn(() => mockRedis),
  };
});

describe('Health Check Cron Job Integration', () => {
  let mockReq;
  let mockRes;
  let originalEnv;

  beforeEach(() => {
    originalEnv = process.env;
    process.env = {
      ...originalEnv,
      CRON_SECRET: 'test-cron-secret',
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
    mockRedis.set.mockResolvedValue('OK');
  });

  afterEach(() => {
    process.env = originalEnv;
  });

  describe('GET /api/cron/health - Health Check', () => {
    it('should perform health check successfully with valid auth', async () => {
      mockReq.method = 'GET';
      mockReq.headers = {
        authorization: 'Bearer test-cron-secret',
      };

      const healthHandler = (await import('../../api/cron/health.js')).default;
      await healthHandler(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.json).toHaveBeenCalledWith({
        status: 'healthy',
        timestamp: expect.any(Number),
        message: 'Redis connection active',
      });

      // Verify Redis operations
      expect(mockRedis.ping).toHaveBeenCalled();
      expect(mockRedis.set).toHaveBeenCalledWith('health:last_check', expect.any(Number));
    });

    it('should perform health check without CRON_SECRET (development mode)', async () => {
      mockReq.method = 'GET';
      mockReq.headers = {};

      // Remove CRON_SECRET to simulate development mode
      delete process.env.CRON_SECRET;

      const healthHandler = (await import('../../api/cron/health.js')).default;
      await healthHandler(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.json).toHaveBeenCalledWith({
        status: 'healthy',
        timestamp: expect.any(Number),
        message: 'Redis connection active',
      });

      // Verify Redis operations
      expect(mockRedis.ping).toHaveBeenCalled();
      expect(mockRedis.set).toHaveBeenCalledWith('health:last_check', expect.any(Number));
    });

    it('should reject unauthorized requests when CRON_SECRET is set', async () => {
      mockReq.method = 'GET';
      mockReq.headers = {
        authorization: 'Bearer wrong-secret',
      };

      const healthHandler = (await import('../../api/cron/health.js')).default;
      await healthHandler(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(401);
      expect(mockRes.json).toHaveBeenCalledWith({
        error: 'Unauthorized',
      });

      // Verify Redis operations were NOT called
      expect(mockRedis.ping).not.toHaveBeenCalled();
      expect(mockRedis.set).not.toHaveBeenCalled();
    });

    it('should reject requests without authorization header when CRON_SECRET is set', async () => {
      mockReq.method = 'GET';
      mockReq.headers = {};

      const healthHandler = (await import('../../api/cron/health.js')).default;
      await healthHandler(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(401);
      expect(mockRes.json).toHaveBeenCalledWith({
        error: 'Unauthorized',
      });

      // Verify Redis operations were NOT called
      expect(mockRedis.ping).not.toHaveBeenCalled();
      expect(mockRedis.set).not.toHaveBeenCalled();
    });

    it('should handle Redis ping failure', async () => {
      mockReq.method = 'GET';
      mockReq.headers = {
        authorization: 'Bearer test-cron-secret',
      };

      // Mock Redis ping failure
      mockRedis.ping.mockRejectedValue(new Error('Redis connection failed'));

      const healthHandler = (await import('../../api/cron/health.js')).default;
      await healthHandler(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(500);
      expect(mockRes.json).toHaveBeenCalledWith({
        status: 'unhealthy',
        error: 'Redis connection failed',
      });

      // Verify Redis ping was attempted
      expect(mockRedis.ping).toHaveBeenCalled();
      // Verify set was NOT called due to ping failure
      expect(mockRedis.set).not.toHaveBeenCalled();
    });

    it('should handle Redis set failure', async () => {
      mockReq.method = 'GET';
      mockReq.headers = {
        authorization: 'Bearer test-cron-secret',
      };

      // Mock Redis set failure
      mockRedis.set.mockRejectedValue(new Error('Redis set failed'));

      const healthHandler = (await import('../../api/cron/health.js')).default;
      await healthHandler(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(500);
      expect(mockRes.json).toHaveBeenCalledWith({
        status: 'unhealthy',
        error: 'Redis set failed',
      });

      // Verify both Redis operations were attempted
      expect(mockRedis.ping).toHaveBeenCalled();
      expect(mockRedis.set).toHaveBeenCalled();
    });

    it('should store recent timestamp in health check', async () => {
      mockReq.method = 'GET';
      mockReq.headers = {
        authorization: 'Bearer test-cron-secret',
      };

      const healthHandler = (await import('../../api/cron/health.js')).default;
      await healthHandler(mockReq, mockRes);

      // Verify the timestamp is recent (within last 5 seconds)
      const setCall = mockRedis.set.mock.calls.find((call) => call[0] === 'health:last_check');
      expect(setCall).toBeDefined();
      const timestamp = setCall[1];
      const now = Date.now();
      expect(timestamp).toBeGreaterThan(now - 5000); // Within last 5 seconds
      expect(timestamp).toBeLessThanOrEqual(now);
    });
  });
});
