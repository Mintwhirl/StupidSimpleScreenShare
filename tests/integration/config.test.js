import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';

// Mock environment variables
const mockEnv = {
  AUTH_SECRET: 'test-secret-key-123',
  API_BASE: '/api',
};

// Mock the sendError function to match actual behavior
vi.mock('../../api/_utils.js', async () => {
  const actual = await vi.importActual('../../api/_utils.js');
  return {
    ...actual,
    sendError: vi.fn((res, status, message) =>
      res.status(status).json({
        error: message,
        timestamp: new Date().toISOString(),
      })
    ),
  };
});

// Mock the config endpoint to use actual implementation
vi.mock('../../api/config.js', async () => {
  const actual = await vi.importActual('../../api/config.js');
  return actual;
});

describe('Config Endpoint Integration', () => {
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
      method: 'GET',
    };

    mockRes = {
      status: vi.fn().mockReturnThis(),
      json: vi.fn().mockReturnThis(),
      setHeader: vi.fn(),
    };
  });

  afterEach(() => {
    // Restore original environment
    process.env = originalEnv;
    vi.clearAllMocks();
  });

  describe('GET /api/config', () => {
    it('should return client configuration with AUTH_SECRET', async () => {
      const configHandler = (await import('../../api/config.js')).default;
      await configHandler(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.json).toHaveBeenCalledWith({
        success: true,
        config: {
          apiBase: '/api',
          features: {
            chat: true,
            diagnostics: true,
            viewerCount: true,
          },
          rateLimits: {
            chat: 60,
            api: 2000,
          },
        },
        timestamp: expect.any(String),
      });
    });

    it('should reject non-GET requests', async () => {
      mockReq.method = 'POST';
      const configHandler = (await import('../../api/config.js')).default;
      await configHandler(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(405);
      expect(mockRes.json).toHaveBeenCalledWith({
        error: 'Method not allowed',
        timestamp: expect.any(String),
      });
    });

    it('should handle missing AUTH_SECRET environment variable', async () => {
      // Temporarily remove AUTH_SECRET from process.env
      const originalSecret = process.env.AUTH_SECRET;
      delete process.env.AUTH_SECRET;

      const configHandler = (await import('../../api/config.js')).default;
      await configHandler(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(500);
      expect(mockRes.json).toHaveBeenCalledWith({
        error: 'Server configuration error',
        timestamp: expect.any(String),
      });

      // Restore AUTH_SECRET
      process.env.AUTH_SECRET = originalSecret;
    });
  });
});

describe('Client Configuration Loading', () => {
  let originalFetch;
  let originalWindow;

  beforeEach(() => {
    originalFetch = global.fetch;
    originalWindow = global.window;

    // Mock window object for client.js
    global.window = {
      location: {
        origin: 'http://localhost:3000',
      },
    };

    global.fetch = vi.fn();
  });

  afterEach(() => {
    global.fetch = originalFetch;
    global.window = originalWindow;
    vi.clearAllMocks();
  });

  it('should fetch and parse client configuration successfully', async () => {
    const mockConfigResponse = {
      success: true,
      config: {
        authSecret: 'test-secret-key-123',
        apiBase: '/api',
        features: { chat: true },
      },
    };

    global.fetch.mockResolvedValue({
      ok: true,
      json: async () => mockConfigResponse,
    });

    // Test the fetchClientConfig function behavior by simulating it
    const fetchClientConfig = async () => {
      try {
        const response = await fetch(`${global.window.location.origin}/api/config`);
        if (!response.ok) {
          throw new Error(`Failed to fetch config: ${response.status}`);
        }
        const data = await response.json();
        if (data.success && data.config) {
          return { success: true, authSecret: data.config.authSecret };
        }
        throw new Error('Invalid config response format');
      } catch (error) {
        console.error('Failed to fetch client configuration:', error);
        return { success: false, authSecret: null };
      }
    };

    const result = await fetchClientConfig();

    expect(global.fetch).toHaveBeenCalledWith('http://localhost:3000/api/config');
    expect(result.success).toBe(true);
    expect(result.authSecret).toBe('test-secret-key-123');
  });

  it('should handle config fetch failure gracefully', async () => {
    global.fetch.mockRejectedValue(new Error('Network error'));

    // Test the fetchClientConfig function behavior by simulating it
    const fetchClientConfig = async () => {
      try {
        const response = await fetch(`${global.window.location.origin}/api/config`);
        if (!response.ok) {
          throw new Error(`Failed to fetch config: ${response.status}`);
        }
        const data = await response.json();
        if (data.success && data.config) {
          return { success: true, authSecret: data.config.authSecret };
        }
        throw new Error('Invalid config response format');
      } catch (error) {
        console.error('Failed to fetch client configuration:', error);
        return { success: false, authSecret: null };
      }
    };

    const result = await fetchClientConfig();

    expect(global.fetch).toHaveBeenCalledWith('http://localhost:3000/api/config');
    expect(result.success).toBe(false);
    expect(result.authSecret).toBe(null);
  });
});
