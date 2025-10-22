import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';

import {
  createApiHandler,
  createRateLimitedHandler,
  createValidatedHandler,
  createCompleteHandler,
} from '../../api/_middleware.js';
import {
  createRedisClient,
  setCorsHeaders,
  setSecurityHeaders,
  asyncHandler,
  sendError,
  validateRoomId,
  validateSender,
} from '../../api/_utils.js';

// Mock the utils
vi.mock('../../api/_utils.js', async () => {
  const actual = await vi.importActual('../../api/_utils.js');
  return {
    ...actual,
    createRedisClient: vi.fn(() => ({ ping: vi.fn() })),
    setCorsHeaders: vi.fn(),
    setSecurityHeaders: vi.fn(),
    asyncHandler: vi.fn((fn) => fn),
    sendError: vi.fn((res, status, message) => res.status(status).json({ error: message })),
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
      return { valid: true };
    }),
  };
});

describe('API Middleware Integration Tests', () => {
  let mockReq;
  let mockRes;
  let mockHandler;

  beforeEach(() => {
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

    mockHandler = vi.fn().mockResolvedValue({ success: true });

    vi.clearAllMocks();
  });

  describe('createApiHandler', () => {
    it('should set security and CORS headers', async () => {
      const wrappedHandler = createApiHandler(mockHandler);
      await wrappedHandler(mockReq, mockRes);

      expect(setSecurityHeaders).toHaveBeenCalledWith(mockRes);
      expect(setCorsHeaders).toHaveBeenCalledWith(mockReq, mockRes);
    });

    it('should handle OPTIONS requests', async () => {
      mockReq.method = 'OPTIONS';
      const wrappedHandler = createApiHandler(mockHandler);
      await wrappedHandler(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(204);
      expect(mockRes.end).toHaveBeenCalled();
      expect(mockHandler).not.toHaveBeenCalled();
    });

    it('should reject disallowed HTTP methods', async () => {
      mockReq.method = 'DELETE';
      const wrappedHandler = createApiHandler(mockHandler, {
        allowedMethods: ['GET', 'POST'],
      });
      await wrappedHandler(mockReq, mockRes);

      expect(sendError).toHaveBeenCalledWith(mockRes, 405, 'Method not allowed');
      expect(mockHandler).not.toHaveBeenCalled();
    });

    it('should reject missing room ID when requireRoom is true', async () => {
      mockReq.method = 'POST';
      mockReq.body = {}; // No roomId

      const wrappedHandler = createApiHandler(mockHandler, {
        requireRoom: true,
      });
      await wrappedHandler(mockReq, mockRes);

      expect(sendError).toHaveBeenCalledWith(mockRes, 400, 'Room ID is required');
      expect(mockHandler).not.toHaveBeenCalled();
    });

    it('should validate room ID format when requireRoom is true (SECURITY FIX)', async () => {
      mockReq.method = 'POST';
      mockReq.body = { roomId: 'invalid-format' }; // Invalid format

      const wrappedHandler = createApiHandler(mockHandler, {
        requireRoom: true,
      });
      await wrappedHandler(mockReq, mockRes);

      // SECURITY FIX: The middleware now validates room ID format!
      expect(sendError).toHaveBeenCalledWith(mockRes, 400, 'Invalid roomId format');
      expect(mockHandler).not.toHaveBeenCalled();
    });

    it('should pass room ID from query when requireRoom is true', async () => {
      mockReq.method = 'GET';
      mockReq.query = { roomId: 'abc123def456789012345678' };

      const wrappedHandler = createApiHandler(mockHandler, {
        requireRoom: true,
      });
      await wrappedHandler(mockReq, mockRes);

      expect(mockHandler).toHaveBeenCalledWith(mockReq, mockRes, {
        redis: expect.any(Object),
      });
    });

    it('should pass room ID from body when requireRoom is true', async () => {
      mockReq.method = 'POST';
      mockReq.body = { roomId: 'abc123def456789012345678' };

      const wrappedHandler = createApiHandler(mockHandler, {
        requireRoom: true,
      });
      await wrappedHandler(mockReq, mockRes);

      expect(mockHandler).toHaveBeenCalledWith(mockReq, mockRes, {
        redis: expect.any(Object),
      });
    });

    it('should create Redis client and pass to handler', async () => {
      const wrappedHandler = createApiHandler(mockHandler);
      await wrappedHandler(mockReq, mockRes);

      expect(createRedisClient).toHaveBeenCalled();
      expect(mockHandler).toHaveBeenCalledWith(mockReq, mockRes, {
        redis: expect.any(Object),
      });
    });
  });

  describe('createRateLimitedHandler', () => {
    it('should apply rate limiting before calling handler', async () => {
      const mockRateLimitFn = vi.fn().mockResolvedValue(null);
      const mockGetRateLimitId = vi.fn().mockReturnValue('test-id');

      const wrappedHandler = createRateLimitedHandler(mockHandler, mockRateLimitFn, mockGetRateLimitId);
      await wrappedHandler(mockReq, mockRes);

      expect(mockGetRateLimitId).toHaveBeenCalledWith(mockReq);
      expect(mockRateLimitFn).toHaveBeenCalledWith('test-id', mockRes);
      expect(mockHandler).toHaveBeenCalled();
    });

    it('should return rate limit error when rate limit is exceeded', async () => {
      const mockRateLimitFn = vi.fn().mockResolvedValue({
        status: 429,
        json: { error: 'Rate limit exceeded' },
      });
      const mockGetRateLimitId = vi.fn().mockReturnValue('test-id');

      const wrappedHandler = createRateLimitedHandler(mockHandler, mockRateLimitFn, mockGetRateLimitId);
      await wrappedHandler(mockReq, mockRes);

      expect(mockRateLimitFn).toHaveBeenCalledWith('test-id', mockRes);
      expect(mockHandler).not.toHaveBeenCalled();
    });

    it('should throttle repeated calls once the limit is exceeded', async () => {
      const mockRateLimitFn = vi
        .fn()
        .mockResolvedValueOnce(null)
        .mockResolvedValueOnce({
          status: 429,
          json: { error: 'Rate limit exceeded' },
        });
      const mockGetRateLimitId = vi.fn().mockReturnValue('test-id');

      const wrappedHandler = createRateLimitedHandler(mockHandler, mockRateLimitFn, mockGetRateLimitId);

      await wrappedHandler(mockReq, mockRes);
      await wrappedHandler(mockReq, mockRes);

      expect(mockGetRateLimitId).toHaveBeenCalledTimes(2);
      expect(mockRateLimitFn).toHaveBeenCalledTimes(2);
      expect(mockHandler).toHaveBeenCalledTimes(1);
    });
  });

  describe('createValidatedHandler', () => {
    it('should validate request data before calling handler', async () => {
      mockReq.method = 'POST';
      mockReq.body = {
        roomId: 'abc123def456789012345678',
        sender: 'John Doe',
      };

      const validators = {
        roomId: validateRoomId,
        sender: validateSender,
      };

      const wrappedHandler = createValidatedHandler(mockHandler, validators);
      await wrappedHandler(mockReq, mockRes);

      expect(validateRoomId).toHaveBeenCalledWith('abc123def456789012345678');
      expect(validateSender).toHaveBeenCalledWith('John Doe');
      expect(mockHandler).toHaveBeenCalled();
    });

    it('should return validation error when validation fails', async () => {
      mockReq.method = 'POST';
      mockReq.body = {
        roomId: 'invalid',
        sender: 'John Doe',
      };

      const validators = {
        roomId: validateRoomId,
        sender: validateSender,
      };

      const wrappedHandler = createValidatedHandler(mockHandler, validators);
      await wrappedHandler(mockReq, mockRes);

      expect(sendError).toHaveBeenCalledWith(mockRes, 400, 'Invalid roomId format');
      expect(mockHandler).not.toHaveBeenCalled();
    });

    it('should only validate fields that are present in request', async () => {
      mockReq.method = 'GET';
      mockReq.query = { roomId: 'abc123def456789012345678' };
      // No sender in query

      const validators = {
        roomId: validateRoomId,
        sender: validateSender,
      };

      const wrappedHandler = createValidatedHandler(mockHandler, validators);
      await wrappedHandler(mockReq, mockRes);

      expect(validateRoomId).toHaveBeenCalledWith('abc123def456789012345678');
      expect(validateSender).not.toHaveBeenCalled();
      expect(mockHandler).toHaveBeenCalled();
    });

    it('should handle null and undefined values gracefully', async () => {
      mockReq.method = 'POST';
      mockReq.body = {
        roomId: 'abc123def456789012345678',
        sender: null,
      };

      const validators = {
        roomId: validateRoomId,
        sender: validateSender,
      };

      const wrappedHandler = createValidatedHandler(mockHandler, validators);
      await wrappedHandler(mockReq, mockRes);

      expect(validateRoomId).toHaveBeenCalledWith('abc123def456789012345678');
      expect(validateSender).not.toHaveBeenCalled();
      expect(mockHandler).toHaveBeenCalled();
    });
  });

  describe('createCompleteHandler', () => {
    it('should apply all middleware layers in correct order', async () => {
      const mockRateLimitFn = vi.fn().mockResolvedValue(null);
      const mockGetRateLimitId = vi.fn().mockReturnValue('test-id');

      const config = {
        requireRoom: true,
        allowedMethods: ['GET', 'POST'],
        rateLimitFn: mockRateLimitFn,
        getRateLimitId: mockGetRateLimitId,
        validators: {
          roomId: validateRoomId,
        },
      };

      mockReq.method = 'POST';
      mockReq.body = { roomId: 'abc123def456789012345678' };

      const wrappedHandler = createCompleteHandler(mockHandler, config);
      await wrappedHandler(mockReq, mockRes);

      // Verify all middleware was applied
      expect(setSecurityHeaders).toHaveBeenCalled();
      expect(setCorsHeaders).toHaveBeenCalled();
      expect(mockGetRateLimitId).toHaveBeenCalled();
      expect(mockRateLimitFn).toHaveBeenCalled();
      expect(validateRoomId).toHaveBeenCalled();
      expect(mockHandler).toHaveBeenCalled();
    });

    it('should work without rate limiting', async () => {
      const config = {
        requireRoom: true,
        validators: {
          roomId: validateRoomId,
        },
      };

      mockReq.method = 'POST';
      mockReq.body = { roomId: 'abc123def456789012345678' };

      const wrappedHandler = createCompleteHandler(mockHandler, config);
      await wrappedHandler(mockReq, mockRes);

      expect(validateRoomId).toHaveBeenCalled();
      expect(mockHandler).toHaveBeenCalled();
    });

    it('should work without validation', async () => {
      const config = {
        requireRoom: true,
      };

      mockReq.method = 'POST';
      mockReq.body = { roomId: 'abc123def456789012345678' };

      const wrappedHandler = createCompleteHandler(mockHandler, config);
      await wrappedHandler(mockReq, mockRes);

      expect(mockHandler).toHaveBeenCalled();
    });

    it('should work with minimal config', async () => {
      const wrappedHandler = createCompleteHandler(mockHandler);
      await wrappedHandler(mockReq, mockRes);

      expect(setSecurityHeaders).toHaveBeenCalled();
      expect(setCorsHeaders).toHaveBeenCalled();
      expect(mockHandler).toHaveBeenCalled();
    });
  });

  describe('Error Handling', () => {
    it('should handle handler errors gracefully', async () => {
      const errorHandler = vi.fn().mockRejectedValue(new Error('Handler failed'));

      const wrappedHandler = createApiHandler(errorHandler);

      // Since asyncHandler is mocked to just return the function, errors will propagate
      // In real usage, asyncHandler would catch and handle the error
      await expect(wrappedHandler(mockReq, mockRes)).rejects.toThrow('Handler failed');
    });

    it('should handle rate limit function errors gracefully', async () => {
      const mockRateLimitFn = vi.fn().mockRejectedValue(new Error('Rate limit error'));
      const mockGetRateLimitId = vi.fn().mockReturnValue('test-id');

      const wrappedHandler = createRateLimitedHandler(mockHandler, mockRateLimitFn, mockGetRateLimitId);

      // Since asyncHandler is mocked, errors will propagate
      await expect(wrappedHandler(mockReq, mockRes)).rejects.toThrow('Rate limit error');
    });

    it('should handle validation function errors gracefully', async () => {
      const errorValidator = vi.fn().mockImplementation(() => {
        throw new Error('Validation error');
      });

      mockReq.method = 'POST';
      mockReq.body = { roomId: 'abc123def456789012345678' };

      const validators = {
        roomId: errorValidator,
      };

      const wrappedHandler = createValidatedHandler(mockHandler, validators);

      // Since asyncHandler is mocked, errors will propagate
      await expect(wrappedHandler(mockReq, mockRes)).rejects.toThrow('Validation error');
    });
  });
});
