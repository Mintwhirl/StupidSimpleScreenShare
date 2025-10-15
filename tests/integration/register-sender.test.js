import { vi, describe, it, expect, beforeEach, afterEach } from 'vitest';

// Mock Redis client
const mockRedis = {
  get: vi.fn(),
  set: vi.fn(),
  del: vi.fn(),
  exists: vi.fn(),
  expire: vi.fn(),
  quit: vi.fn(),
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
    validateSender: vi.fn((sender) => {
      if (!sender || sender.trim().length === 0) {
        return { valid: false, error: 'Sender ID is required' };
      }
      if (sender.length > 50) {
        return { valid: false, error: 'Sender ID too long' };
      }
      return { valid: true };
    }),
    getClientIdentifier: vi.fn(() => 'test-client-id'),
    TTL_ROOM: 1800,
  };
});

describe('Register Sender Endpoint Integration', () => {
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

  describe('POST /api/register-sender - Register Sender', () => {
    it('should register sender successfully', async () => {
      mockReq.method = 'POST';
      mockReq.body = {
        roomId: 'abc123def456789012345678',
        senderId: 'John Doe',
      };

      const registerSenderHandler = (await import('../../api/register-sender.js')).default;
      await registerSenderHandler(mockReq, mockRes);

      expect(mockRes.json).toHaveBeenCalledWith({
        ok: true,
        message: 'Sender ID registered successfully',
        secret: expect.any(String),
      });

      // Verify Redis operations with exact key format (senderId.trim())
      expect(mockRedis.set).toHaveBeenCalledWith(
        'room:abc123def456789012345678:sender:John Doe',
        expect.stringContaining('"clientId":"test-client-id"')
      );
      expect(mockRedis.expire).toHaveBeenCalledWith(
        'room:abc123def456789012345678:sender:John Doe',
        1800 // TTL_ROOM
      );

      // Verify the stored data contains all required fields
      const setCall = mockRedis.set.mock.calls.find(
        (call) => call[0] === 'room:abc123def456789012345678:sender:John Doe'
      );
      expect(setCall).toBeDefined();
      const storedData = JSON.parse(setCall[1]);
      expect(storedData).toHaveProperty('clientId', 'test-client-id');
      expect(storedData).toHaveProperty('secret');
      expect(storedData).toHaveProperty('registeredAt');
      expect(storedData.secret).toMatch(/^[a-z0-9]+$/); // Random alphanumeric string
      expect(storedData.registeredAt).toBeGreaterThan(Date.now() - 5000); // Recent timestamp
    });

    it('should reject non-POST requests', async () => {
      mockReq.method = 'GET';

      const registerSenderHandler = (await import('../../api/register-sender.js')).default;
      await registerSenderHandler(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(405);
      expect(mockRes.json).toHaveBeenCalledWith({
        error: 'Method not allowed',
        timestamp: expect.any(String),
      });
    });

    it('should reject missing room', async () => {
      mockReq.method = 'POST';
      mockReq.body = {
        roomId: 'abc123def456789012345678',
        senderId: 'John Doe',
      };

      // Mock room not found
      mockRedis.get.mockResolvedValue(null);

      const registerSenderHandler = (await import('../../api/register-sender.js')).default;
      await registerSenderHandler(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(410);
      expect(mockRes.json).toHaveBeenCalledWith({
        error: 'Room expired or not found',
        timestamp: expect.any(String),
      });
    });

    it('should reject invalid room ID', async () => {
      mockReq.method = 'POST';
      mockReq.body = {
        roomId: 'invalid-room-id',
        senderId: 'John Doe',
      };

      const registerSenderHandler = (await import('../../api/register-sender.js')).default;
      await registerSenderHandler(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(400);
      expect(mockRes.json).toHaveBeenCalledWith({
        error: 'Invalid roomId format',
        timestamp: expect.any(String),
      });
    });

    it('should reject invalid sender ID', async () => {
      mockReq.method = 'POST';
      mockReq.body = {
        roomId: 'abc123def456789012345678',
        senderId: '', // Empty sender ID
      };

      const registerSenderHandler = (await import('../../api/register-sender.js')).default;
      await registerSenderHandler(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(400);
      expect(mockRes.json).toHaveBeenCalledWith({
        error: 'Sender ID is required',
        timestamp: expect.any(String),
      });
    });

    it('should handle sender ID with whitespace (trim)', async () => {
      mockReq.method = 'POST';
      mockReq.body = {
        roomId: 'abc123def456789012345678',
        senderId: '  John Doe  ', // Whitespace that should be trimmed
      };

      const registerSenderHandler = (await import('../../api/register-sender.js')).default;
      await registerSenderHandler(mockReq, mockRes);

      expect(mockRes.json).toHaveBeenCalledWith({
        ok: true,
        message: 'Sender ID registered successfully',
        secret: expect.any(String),
      });

      // Verify the Redis key uses trimmed sender ID
      expect(mockRedis.set).toHaveBeenCalledWith(
        'room:abc123def456789012345678:sender:John Doe', // Trimmed
        expect.any(String)
      );
    });

    it('should handle Redis errors gracefully', async () => {
      mockReq.method = 'POST';
      mockReq.body = {
        roomId: 'abc123def456789012345678',
        senderId: 'John Doe',
      };

      // Mock Redis error
      mockRedis.set.mockRejectedValue(new Error('Redis connection failed'));

      const registerSenderHandler = (await import('../../api/register-sender.js')).default;
      await registerSenderHandler(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(500);
      expect(mockRes.json).toHaveBeenCalledWith({
        error: 'Failed to register sender ID',
        timestamp: expect.any(String),
      });
    });
  });
});
