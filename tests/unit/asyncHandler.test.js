import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';

import { asyncHandler } from '../../api/_utils.js';

describe('asyncHandler', () => {
  let mockReq;
  let mockRes;
  let mockHandler;
  let consoleSpy;

  beforeEach(() => {
    // Mock request object
    mockReq = {
      method: 'GET',
      url: '/test',
    };

    // Mock response object
    mockRes = {
      headersSent: false,
      status: vi.fn().mockReturnThis(),
      json: vi.fn().mockReturnThis(),
    };

    // Mock handler function
    mockHandler = vi.fn();

    // Spy on console.error
    consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

    // Clear any previous calls
    consoleSpy.mockClear();
  });

  afterEach(() => {
    consoleSpy.mockRestore();
  });

  describe('successful handler execution', () => {
    it('should call the original handler with req and res', async () => {
      mockHandler.mockResolvedValue(undefined);

      const wrappedHandler = asyncHandler(mockHandler);
      await wrappedHandler(mockReq, mockRes);

      expect(mockHandler).toHaveBeenCalledWith(mockReq, mockRes);
      expect(mockHandler).toHaveBeenCalledTimes(1);
    });

    it('should not log errors when handler succeeds', async () => {
      mockHandler.mockResolvedValue(undefined);

      const wrappedHandler = asyncHandler(mockHandler);
      await wrappedHandler(mockReq, mockRes);

      expect(consoleSpy).not.toHaveBeenCalled();
    });
  });

  describe('handler error handling', () => {
    it('should catch and handle errors from the handler', async () => {
      const error = new Error('Handler failed');
      mockHandler.mockRejectedValue(error);

      const wrappedHandler = asyncHandler(mockHandler);
      await wrappedHandler(mockReq, mockRes);

      expect(mockHandler).toHaveBeenCalledWith(mockReq, mockRes);
      expect(consoleSpy).toHaveBeenCalledWith('Unhandled error in API handler:', error);
    });

    it('should call sendError when handler throws and headers not sent', async () => {
      const error = new Error('Handler failed');
      mockHandler.mockRejectedValue(error);
      mockRes.headersSent = false;

      const wrappedHandler = asyncHandler(mockHandler);
      await wrappedHandler(mockReq, mockRes);

      // sendError calls res.status().json()
      expect(mockRes.status).toHaveBeenCalledWith(500);
      expect(mockRes.json).toHaveBeenCalledWith({
        error: 'Internal server error',
        timestamp: expect.any(String),
      });
      expect(consoleSpy).toHaveBeenCalledWith('Unhandled error in API handler:', error);
    });

    it('should not call sendError when headers already sent', async () => {
      const error = new Error('Handler failed');
      mockHandler.mockRejectedValue(error);
      mockRes.headersSent = true;

      const wrappedHandler = asyncHandler(mockHandler);
      await wrappedHandler(mockReq, mockRes);

      expect(mockRes.status).not.toHaveBeenCalled();
      expect(mockRes.json).not.toHaveBeenCalled();
      expect(consoleSpy).toHaveBeenCalledWith('Unhandled error in API handler:', error);
    });

    it('should handle different types of errors', async () => {
      const stringError = 'String error';
      mockHandler.mockRejectedValue(stringError);

      const wrappedHandler = asyncHandler(mockHandler);
      await wrappedHandler(mockReq, mockRes);

      expect(consoleSpy).toHaveBeenCalledWith('Unhandled error in API handler:', stringError);
      expect(mockRes.status).toHaveBeenCalledWith(500);
      expect(mockRes.json).toHaveBeenCalledWith({
        error: 'Internal server error',
        timestamp: expect.any(String),
      });
    });

    it('should handle object errors', async () => {
      const objectError = { code: 'CUSTOM_ERROR', message: 'Custom error' };
      mockHandler.mockRejectedValue(objectError);

      const wrappedHandler = asyncHandler(mockHandler);
      await wrappedHandler(mockReq, mockRes);

      expect(consoleSpy).toHaveBeenCalledWith('Unhandled error in API handler:', objectError);
      expect(mockRes.status).toHaveBeenCalledWith(500);
      expect(mockRes.json).toHaveBeenCalledWith({
        error: 'Internal server error',
        timestamp: expect.any(String),
      });
    });

    it('should handle null errors', async () => {
      mockHandler.mockRejectedValue(null);

      const wrappedHandler = asyncHandler(mockHandler);
      await wrappedHandler(mockReq, mockRes);

      expect(consoleSpy).toHaveBeenCalledWith('Unhandled error in API handler:', null);
      expect(mockRes.status).toHaveBeenCalledWith(500);
      expect(mockRes.json).toHaveBeenCalledWith({
        error: 'Internal server error',
        timestamp: expect.any(String),
      });
    });

    it('should handle undefined errors', async () => {
      mockHandler.mockRejectedValue(undefined);

      const wrappedHandler = asyncHandler(mockHandler);
      await wrappedHandler(mockReq, mockRes);

      expect(consoleSpy).toHaveBeenCalledWith('Unhandled error in API handler:', undefined);
      expect(mockRes.status).toHaveBeenCalledWith(500);
      expect(mockRes.json).toHaveBeenCalledWith({
        error: 'Internal server error',
        timestamp: expect.any(String),
      });
    });
  });

  describe('handler function behavior', () => {
    it('should work with synchronous handlers', async () => {
      mockHandler.mockReturnValue('sync result');

      const wrappedHandler = asyncHandler(mockHandler);
      await wrappedHandler(mockReq, mockRes);

      expect(mockHandler).toHaveBeenCalledWith(mockReq, mockRes);
    });

    it('should handle handlers that throw synchronously', async () => {
      const error = new Error('Sync error');
      mockHandler.mockImplementation(() => {
        throw error;
      });

      const wrappedHandler = asyncHandler(mockHandler);
      await wrappedHandler(mockReq, mockRes);

      expect(consoleSpy).toHaveBeenCalledWith('Unhandled error in API handler:', error);
    });
  });

  describe('edge cases', () => {
    it('should handle handler that returns undefined', async () => {
      mockHandler.mockResolvedValue(undefined);

      const wrappedHandler = asyncHandler(mockHandler);
      await wrappedHandler(mockReq, mockRes);

      expect(mockHandler).toHaveBeenCalledWith(mockReq, mockRes);
    });
  });

  describe('multiple calls', () => {
    it('should handle multiple successful calls', async () => {
      mockHandler.mockResolvedValue('success');

      const wrappedHandler = asyncHandler(mockHandler);

      await wrappedHandler(mockReq, mockRes);
      await wrappedHandler(mockReq, mockRes);
      await wrappedHandler(mockReq, mockRes);

      expect(mockHandler).toHaveBeenCalledTimes(3);
    });

    it('should handle mixed successful and failed calls', async () => {
      mockHandler
        .mockResolvedValueOnce('success')
        .mockRejectedValueOnce(new Error('failure'))
        .mockResolvedValueOnce('success again');

      const wrappedHandler = asyncHandler(mockHandler);

      await wrappedHandler(mockReq, mockRes);
      await wrappedHandler(mockReq, mockRes);
      await wrappedHandler(mockReq, mockRes);

      expect(mockHandler).toHaveBeenCalledTimes(3);
      // Console error should be called at least once for the failed call
      expect(consoleSpy).toHaveBeenCalled();
    });
  });
});
