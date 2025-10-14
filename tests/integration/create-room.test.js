import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';

// Mock Redis client
const mockRedis = {
  set: vi.fn(),
  expire: vi.fn(),
  get: vi.fn(),
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
    checkRateLimit: vi.fn(),
    getClientIdentifier: vi.fn(() => 'test-client-id'),
    getRoomCreationRateLimit: vi.fn(() => ({
      limit: vi.fn().mockResolvedValue({
        success: true,
        limit: 50,
        reset: Date.now() + 3600000,
        remaining: 49,
      }),
    })),
    TTL_ROOM: 3600,
  };
});

describe('Create Room Endpoint Integration', () => {
  let mockReq;
  let mockRes;
  let originalEnv;

  beforeEach(() => {
    // Mock environment variables
    originalEnv = process.env;
    process.env = {
      ...originalEnv,
      AUTH_SECRET: 'test-secret-key-123',
    };

    mockReq = {
      method: 'POST',
      headers: {},
      body: {},
    };

    mockRes = {
      status: vi.fn().mockReturnThis(),
      json: vi.fn().mockReturnThis(),
      setHeader: vi.fn(),
      end: vi.fn(),
    };

    // Clear all mocks
    vi.clearAllMocks();
  });

  afterEach(() => {
    // Restore original environment
    process.env = originalEnv;
  });

  describe('POST /api/create-room', () => {
    it('should create a room successfully with valid auth secret in header', async () => {
      mockReq.headers['x-auth-secret'] = 'test-secret-key-123';

      const createRoomHandler = (await import('../../api/create-room.js')).default;
      await createRoomHandler(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(201);
      expect(mockRes.json).toHaveBeenCalledWith({
        roomId: expect.stringMatching(/^[a-f0-9]{24}$/), // 24 hex characters
        expiresIn: 3600,
      });

      // Verify Redis operations
      expect(mockRedis.set).toHaveBeenCalledWith(
        expect.stringMatching(/^room:[a-f0-9]{24}:meta$/),
        expect.stringContaining('"createdAt"')
      );
      expect(mockRedis.expire).toHaveBeenCalledWith(expect.stringMatching(/^room:[a-f0-9]{24}:meta$/), 3600);
    });

    it('should create a room successfully with valid auth secret in body', async () => {
      mockReq.body.authSecret = 'test-secret-key-123';

      const createRoomHandler = (await import('../../api/create-room.js')).default;
      await createRoomHandler(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(201);
      expect(mockRes.json).toHaveBeenCalledWith({
        roomId: expect.stringMatching(/^[a-f0-9]{24}$/),
        expiresIn: 3600,
      });
    });

    it('should create a room successfully when no AUTH_SECRET is set (development mode)', async () => {
      // Remove AUTH_SECRET to simulate development mode
      delete process.env.AUTH_SECRET;

      const createRoomHandler = (await import('../../api/create-room.js')).default;
      await createRoomHandler(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(201);
      expect(mockRes.json).toHaveBeenCalledWith({
        roomId: expect.stringMatching(/^[a-f0-9]{24}$/),
        expiresIn: 3600,
      });
    });

    it('should reject request with invalid auth secret', async () => {
      mockReq.headers['x-auth-secret'] = 'wrong-secret';

      const createRoomHandler = (await import('../../api/create-room.js')).default;
      await createRoomHandler(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(401);
      expect(mockRes.json).toHaveBeenCalledWith({
        error: 'Unauthorized - Invalid or missing auth secret',
        timestamp: expect.any(String),
      });
    });

    it('should reject request with missing auth secret when AUTH_SECRET is required', async () => {
      // No auth secret provided

      const createRoomHandler = (await import('../../api/create-room.js')).default;
      await createRoomHandler(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(401);
      expect(mockRes.json).toHaveBeenCalledWith({
        error: 'Unauthorized - Invalid or missing auth secret',
        timestamp: expect.any(String),
      });
    });

    it('should reject non-POST requests', async () => {
      mockReq.method = 'GET';

      const createRoomHandler = (await import('../../api/create-room.js')).default;
      await createRoomHandler(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(405);
      expect(mockRes.json).toHaveBeenCalledWith({
        error: 'Method not allowed',
        timestamp: expect.any(String),
      });
    });

    it('should handle OPTIONS requests for CORS preflight', async () => {
      mockReq.method = 'OPTIONS';

      const createRoomHandler = (await import('../../api/create-room.js')).default;
      await createRoomHandler(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(204);
      expect(mockRes.end).toHaveBeenCalled();
    });

    it('should handle Redis errors gracefully', async () => {
      mockReq.headers['x-auth-secret'] = 'test-secret-key-123';
      mockRedis.set.mockRejectedValue(new Error('Redis connection failed'));

      const createRoomHandler = (await import('../../api/create-room.js')).default;
      await createRoomHandler(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(500);
      expect(mockRes.json).toHaveBeenCalledWith({
        error: 'Failed to create room',
        timestamp: expect.any(String),
      });
    });

    it('should generate unique room IDs', async () => {
      mockReq.headers['x-auth-secret'] = 'test-secret-key-123';

      // Ensure Redis mock is working
      mockRedis.set.mockResolvedValue('OK');
      mockRedis.expire.mockResolvedValue(1);

      const createRoomHandler = (await import('../../api/create-room.js')).default;

      // Create first room
      await createRoomHandler(mockReq, mockRes);

      // Verify the first room was created successfully
      expect(mockRes.json).toHaveBeenCalledWith({
        roomId: expect.stringMatching(/^[a-f0-9]{24}$/),
        expiresIn: 3600,
      });

      const firstRoomId = mockRes.json.mock.calls[0][0].roomId;

      // Create second room with fresh mocks
      const mockRes2 = {
        status: vi.fn().mockReturnThis(),
        json: vi.fn().mockReturnThis(),
        setHeader: vi.fn(),
        end: vi.fn(),
      };

      await createRoomHandler(mockReq, mockRes2);
      const secondRoomId = mockRes2.json.mock.calls[0][0].roomId;

      expect(firstRoomId).not.toBe(secondRoomId);
      expect(firstRoomId).toMatch(/^[a-f0-9]{24}$/);
      expect(secondRoomId).toMatch(/^[a-f0-9]{24}$/);
    });

    it('should store room metadata with correct format', async () => {
      mockReq.headers['x-auth-secret'] = 'test-secret-key-123';

      const createRoomHandler = (await import('../../api/create-room.js')).default;
      await createRoomHandler(mockReq, mockRes);

      const roomMetaCall = mockRedis.set.mock.calls.find((call) => call[0].includes(':meta'));

      expect(roomMetaCall).toBeDefined();
      const roomMeta = JSON.parse(roomMetaCall[1]);

      expect(roomMeta).toHaveProperty('createdAt');
      expect(roomMeta).toHaveProperty('version', '1.0');
      expect(typeof roomMeta.createdAt).toBe('number');
      expect(roomMeta.createdAt).toBeGreaterThan(Date.now() - 1000); // Within last second
    });

    it('should apply rate limiting when AUTH_SECRET is set', async () => {
      mockReq.headers['x-auth-secret'] = 'test-secret-key-123';

      // Mock rate limit exceeded
      const { checkRateLimit } = await import('../../api/_utils.js');
      checkRateLimit.mockResolvedValue({
        status: 429,
        json: { error: 'Rate limit exceeded' },
      });

      const createRoomHandler = (await import('../../api/create-room.js')).default;
      await createRoomHandler(mockReq, mockRes);

      expect(checkRateLimit).toHaveBeenCalled();
    });

    it('should skip rate limiting in development mode (no AUTH_SECRET)', async () => {
      delete process.env.AUTH_SECRET;

      const createRoomHandler = (await import('../../api/create-room.js')).default;
      await createRoomHandler(mockReq, mockRes);

      const { checkRateLimit } = await import('../../api/_utils.js');
      expect(checkRateLimit).not.toHaveBeenCalled();
    });
  });
});
