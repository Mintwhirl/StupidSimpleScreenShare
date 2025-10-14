import { describe, it, expect, vi, beforeEach } from 'vitest';

import { checkRateLimit } from '../../api/_utils.js';

describe('checkRateLimit', () => {
  let mockRatelimit;
  let mockRes;
  let mockSendError;

  beforeEach(() => {
    // Reset mocks
    vi.clearAllMocks();

    // Mock rate limiter
    mockRatelimit = {
      limit: vi.fn(),
    };

    // Mock response object
    mockRes = {
      setHeader: vi.fn(),
      status: vi.fn().mockReturnThis(),
      json: vi.fn().mockReturnThis(),
    };
  });

  describe('successful rate limit check', () => {
    it('should return null when rate limit is not exceeded', async () => {
      mockRatelimit.limit.mockResolvedValue({
        success: true,
        limit: 100,
        reset: Date.now() + 60000,
        remaining: 99,
      });

      const result = await checkRateLimit(mockRatelimit, 'test-identifier', mockRes);

      expect(result).toBeNull();
      expect(mockRatelimit.limit).toHaveBeenCalledWith('test-identifier');
      expect(mockRes.setHeader).toHaveBeenCalledWith('X-RateLimit-Limit', '100');
      expect(mockRes.setHeader).toHaveBeenCalledWith('X-RateLimit-Remaining', '99');
      expect(mockRes.setHeader).toHaveBeenCalledWith('X-RateLimit-Reset', expect.any(String));
      // sendError should not be called for successful rate limit checks
    });

    it('should set correct headers with different rate limit values', async () => {
      mockRatelimit.limit.mockResolvedValue({
        success: true,
        limit: 50,
        reset: 1234567890,
        remaining: 25,
      });

      const result = await checkRateLimit(mockRatelimit, 'another-identifier', mockRes);

      expect(result).toBeNull();
      expect(mockRes.setHeader).toHaveBeenCalledWith('X-RateLimit-Limit', '50');
      expect(mockRes.setHeader).toHaveBeenCalledWith('X-RateLimit-Remaining', '25');
      expect(mockRes.setHeader).toHaveBeenCalledWith('X-RateLimit-Reset', '1234567890');
    });

    it('should handle zero remaining requests', async () => {
      mockRatelimit.limit.mockResolvedValue({
        success: true,
        limit: 10,
        reset: Date.now() + 30000,
        remaining: 0,
      });

      const result = await checkRateLimit(mockRatelimit, 'zero-remaining', mockRes);

      expect(result).toBeNull();
      expect(mockRes.setHeader).toHaveBeenCalledWith('X-RateLimit-Remaining', '0');
    });
  });

  describe('rate limit exceeded', () => {
    it('should call sendError when rate limit is exceeded', async () => {
      const resetTime = Date.now() + 60000;
      mockRatelimit.limit.mockResolvedValue({
        success: false,
        limit: 100,
        reset: resetTime,
        remaining: 0,
      });

      const result = await checkRateLimit(mockRatelimit, 'exceeded-identifier', mockRes);

      // sendError calls res.status().json(), so we should see those calls
      expect(mockRes.status).toHaveBeenCalledWith(429);
      expect(mockRes.json).toHaveBeenCalledWith({
        error: `Rate limit exceeded. Try again at ${new Date(resetTime).toISOString()}`,
        timestamp: expect.any(String),
      });
      expect(result).toBe(mockRes); // sendError returns res.status().json() which returns res
      expect(mockRatelimit.limit).toHaveBeenCalledWith('exceeded-identifier');
      expect(mockRes.setHeader).toHaveBeenCalledWith('X-RateLimit-Limit', '100');
      expect(mockRes.setHeader).toHaveBeenCalledWith('X-RateLimit-Remaining', '0');
      expect(mockRes.setHeader).toHaveBeenCalledWith('X-RateLimit-Reset', resetTime.toString());
    });

    it('should format reset date correctly in error message', async () => {
      const resetTime = 1640995200000; // 2022-01-01T00:00:00.000Z
      mockRatelimit.limit.mockResolvedValue({
        success: false,
        limit: 50,
        reset: resetTime,
        remaining: 0,
      });

      await checkRateLimit(mockRatelimit, 'test-identifier', mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(429);
      expect(mockRes.json).toHaveBeenCalledWith({
        error: 'Rate limit exceeded. Try again at 2022-01-01T00:00:00.000Z',
        timestamp: expect.any(String),
      });
    });

    it('should set headers even when rate limit is exceeded', async () => {
      const resetTime = 1640995200000; // 2022-01-01T00:00:00.000Z
      mockRatelimit.limit.mockResolvedValue({
        success: false,
        limit: 25,
        reset: resetTime,
        remaining: 0,
      });

      await checkRateLimit(mockRatelimit, 'test-identifier', mockRes);

      expect(mockRes.setHeader).toHaveBeenCalledWith('X-RateLimit-Limit', '25');
      expect(mockRes.setHeader).toHaveBeenCalledWith('X-RateLimit-Remaining', '0');
      expect(mockRes.setHeader).toHaveBeenCalledWith('X-RateLimit-Reset', '1640995200000');
    });
  });

  describe('error handling', () => {
    it('should propagate errors from rate limiter', async () => {
      const rateLimitError = new Error('Rate limiter failed');
      mockRatelimit.limit.mockRejectedValue(rateLimitError);

      await expect(checkRateLimit(mockRatelimit, 'test-identifier', mockRes)).rejects.toThrow('Rate limiter failed');

      expect(mockRes.setHeader).not.toHaveBeenCalled();
      // sendError should not be called for successful rate limit checks
    });

    it('should handle rate limiter returning unexpected data structure', async () => {
      mockRatelimit.limit.mockResolvedValue({
        success: true,
        limit: 100,
        // Missing reset and remaining
      });

      await expect(checkRateLimit(mockRatelimit, 'test-identifier', mockRes)).rejects.toThrow();
    });
  });

  describe('header setting', () => {
    it('should convert numeric values to strings for headers', async () => {
      mockRatelimit.limit.mockResolvedValue({
        success: true,
        limit: 100,
        reset: 1234567890,
        remaining: 42,
      });

      await checkRateLimit(mockRatelimit, 'test-identifier', mockRes);

      expect(mockRes.setHeader).toHaveBeenCalledWith('X-RateLimit-Limit', '100');
      expect(mockRes.setHeader).toHaveBeenCalledWith('X-RateLimit-Remaining', '42');
      expect(mockRes.setHeader).toHaveBeenCalledWith('X-RateLimit-Reset', '1234567890');
    });

    it('should handle very large numbers in headers', async () => {
      const largeNumber = Number.MAX_SAFE_INTEGER;
      mockRatelimit.limit.mockResolvedValue({
        success: true,
        limit: largeNumber,
        reset: largeNumber,
        remaining: largeNumber,
      });

      await checkRateLimit(mockRatelimit, 'test-identifier', mockRes);

      expect(mockRes.setHeader).toHaveBeenCalledWith('X-RateLimit-Limit', largeNumber.toString());
      expect(mockRes.setHeader).toHaveBeenCalledWith('X-RateLimit-Remaining', largeNumber.toString());
      expect(mockRes.setHeader).toHaveBeenCalledWith('X-RateLimit-Reset', largeNumber.toString());
    });
  });

  describe('identifier handling', () => {
    it('should pass identifier to rate limiter as-is', async () => {
      mockRatelimit.limit.mockResolvedValue({
        success: true,
        limit: 100,
        reset: Date.now() + 60000,
        remaining: 99,
      });

      const testIdentifier = 'complex-identifier-with-special-chars-123';
      await checkRateLimit(mockRatelimit, testIdentifier, mockRes);

      expect(mockRatelimit.limit).toHaveBeenCalledWith(testIdentifier);
    });

    it('should handle empty string identifier', async () => {
      mockRatelimit.limit.mockResolvedValue({
        success: true,
        limit: 100,
        reset: Date.now() + 60000,
        remaining: 99,
      });

      await checkRateLimit(mockRatelimit, '', mockRes);

      expect(mockRatelimit.limit).toHaveBeenCalledWith('');
    });

    it('should handle null identifier', async () => {
      mockRatelimit.limit.mockResolvedValue({
        success: true,
        limit: 100,
        reset: Date.now() + 60000,
        remaining: 99,
      });

      await checkRateLimit(mockRatelimit, null, mockRes);

      expect(mockRatelimit.limit).toHaveBeenCalledWith(null);
    });
  });
});
