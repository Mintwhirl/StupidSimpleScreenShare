import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';

import { sendError } from '../../api/_utils.js';

describe('sendError', () => {
  let mockRes;
  let consoleSpy;

  beforeEach(() => {
    // Mock response object
    mockRes = {
      status: vi.fn().mockReturnThis(),
      json: vi.fn().mockReturnThis(),
    };

    // Spy on console.error
    consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterEach(() => {
    consoleSpy.mockRestore();
  });

  describe('basic error response', () => {
    it('should send error response with status and message', () => {
      const result = sendError(mockRes, 400, 'Bad request');

      expect(mockRes.status).toHaveBeenCalledWith(400);
      expect(mockRes.json).toHaveBeenCalledWith({
        error: 'Bad request',
        timestamp: expect.any(String),
      });
      expect(result).toBe(mockRes);
    });

    it('should send error response with different status codes', () => {
      sendError(mockRes, 404, 'Not found');

      expect(mockRes.status).toHaveBeenCalledWith(404);
      expect(mockRes.json).toHaveBeenCalledWith({
        error: 'Not found',
        timestamp: expect.any(String),
      });
    });

    it('should send error response with 500 status', () => {
      sendError(mockRes, 500, 'Internal server error');

      expect(mockRes.status).toHaveBeenCalledWith(500);
      expect(mockRes.json).toHaveBeenCalledWith({
        error: 'Internal server error',
        timestamp: expect.any(String),
      });
    });

    it('should include timestamp in response', () => {
      const beforeCall = new Date().toISOString();
      sendError(mockRes, 400, 'Test error');
      const afterCall = new Date().toISOString();

      const callArgs = mockRes.json.mock.calls[0][0];
      const { timestamp } = callArgs;

      expect(timestamp).toMatch(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/);
      expect(timestamp >= beforeCall).toBe(true);
      expect(timestamp <= afterCall).toBe(true);
    });
  });

  describe('error logging', () => {
    it('should not log to console when no error object is provided', () => {
      sendError(mockRes, 400, 'Bad request');

      expect(consoleSpy).not.toHaveBeenCalled();
    });

    it('should log error to console when error object is provided', () => {
      const error = new Error('Database connection failed');
      sendError(mockRes, 500, 'Internal server error', error);

      expect(consoleSpy).toHaveBeenCalledWith('API Error [500]: Internal server error', error);
    });

    it('should log error with different status codes', () => {
      const error = new Error('Validation failed');
      sendError(mockRes, 422, 'Validation error', error);

      expect(consoleSpy).toHaveBeenCalledWith('API Error [422]: Validation error', error);
    });

    it('should handle null error object', () => {
      sendError(mockRes, 500, 'Internal server error', null);

      expect(consoleSpy).not.toHaveBeenCalled();
    });

    it('should handle undefined error object', () => {
      sendError(mockRes, 500, 'Internal server error', undefined);

      expect(consoleSpy).not.toHaveBeenCalled();
    });

    it('should handle string error object', () => {
      const error = 'Simple string error';
      sendError(mockRes, 400, 'Bad request', error);

      expect(consoleSpy).toHaveBeenCalledWith('API Error [400]: Bad request', error);
    });

    it('should handle object error', () => {
      const error = { code: 'VALIDATION_ERROR', details: 'Invalid input' };
      sendError(mockRes, 400, 'Bad request', error);

      expect(consoleSpy).toHaveBeenCalledWith('API Error [400]: Bad request', error);
    });
  });

  describe('response chaining', () => {
    it('should return the response object for chaining', () => {
      const result = sendError(mockRes, 400, 'Bad request');

      expect(result).toBe(mockRes);
    });

    it('should work with chained response methods', () => {
      const chainedRes = {
        status: vi.fn().mockReturnThis(),
        json: vi.fn().mockReturnThis(),
        end: vi.fn(),
      };

      const result = sendError(chainedRes, 404, 'Not found');

      expect(result).toBe(chainedRes);
      expect(chainedRes.status).toHaveBeenCalledWith(404);
      expect(chainedRes.json).toHaveBeenCalledWith({
        error: 'Not found',
        timestamp: expect.any(String),
      });
    });
  });

  describe('edge cases', () => {
    it('should handle empty error message', () => {
      sendError(mockRes, 400, '');

      expect(mockRes.json).toHaveBeenCalledWith({
        error: '',
        timestamp: expect.any(String),
      });
    });

    it('should handle very long error messages', () => {
      const longMessage = 'A'.repeat(1000);
      sendError(mockRes, 400, longMessage);

      expect(mockRes.json).toHaveBeenCalledWith({
        error: longMessage,
        timestamp: expect.any(String),
      });
    });

    it('should handle special characters in error message', () => {
      const specialMessage = 'Error with special chars: @#$%^&*()_+-=[]{}|;:,.<>?';
      sendError(mockRes, 400, specialMessage);

      expect(mockRes.json).toHaveBeenCalledWith({
        error: specialMessage,
        timestamp: expect.any(String),
      });
    });

    it('should handle unicode characters in error message', () => {
      const unicodeMessage = 'Error with unicode: 测试 🚀 émojis';
      sendError(mockRes, 400, unicodeMessage);

      expect(mockRes.json).toHaveBeenCalledWith({
        error: unicodeMessage,
        timestamp: expect.any(String),
      });
    });

    it('should handle zero status code', () => {
      sendError(mockRes, 0, 'Zero status error');

      expect(mockRes.status).toHaveBeenCalledWith(0);
      expect(mockRes.json).toHaveBeenCalledWith({
        error: 'Zero status error',
        timestamp: expect.any(String),
      });
    });

    it('should handle negative status code', () => {
      sendError(mockRes, -1, 'Negative status error');

      expect(mockRes.status).toHaveBeenCalledWith(-1);
      expect(mockRes.json).toHaveBeenCalledWith({
        error: 'Negative status error',
        timestamp: expect.any(String),
      });
    });
  });

  describe('timestamp format', () => {
    it('should generate valid ISO timestamp', () => {
      sendError(mockRes, 400, 'Test error');

      const callArgs = mockRes.json.mock.calls[0][0];
      const { timestamp } = callArgs;

      // Should be a valid ISO string
      expect(() => new Date(timestamp)).not.toThrow();
      expect(new Date(timestamp).toISOString()).toBe(timestamp);
    });

    it('should generate different timestamps for different calls', () => {
      // Use fake timers to control time
      vi.useFakeTimers();

      // Set initial time
      vi.setSystemTime(new Date('2022-01-01T00:00:00.000Z'));

      sendError(mockRes, 400, 'First error');
      const firstTimestamp = mockRes.json.mock.calls[0][0].timestamp;

      // Advance time by 1 second
      vi.advanceTimersByTime(1000);

      sendError(mockRes, 400, 'Second error');
      const secondTimestamp = mockRes.json.mock.calls[1][0].timestamp;

      expect(firstTimestamp).not.toBe(secondTimestamp);
      expect(firstTimestamp).toBe('2022-01-01T00:00:00.000Z');
      expect(secondTimestamp).toBe('2022-01-01T00:00:01.000Z');

      // Restore real timers
      vi.useRealTimers();
    });
  });
});
