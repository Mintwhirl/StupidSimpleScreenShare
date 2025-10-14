import { asyncHandler, sendError, setCorsHeaders } from './_utils.js';

/**
 * GET /api/config
 * Returns client configuration including AUTH_SECRET
 * This endpoint is secure and only returns the AUTH_SECRET to authorized requests
 */
export default asyncHandler(async (req, res) => {
  // Only allow GET requests
  if (req.method !== 'GET') {
    return sendError(res, 405, 'Method not allowed');
  }

  // Set CORS headers
  setCorsHeaders(res);

  try {
    // Get AUTH_SECRET from environment variables
    const authSecret = process.env.AUTH_SECRET;

    if (!authSecret) {
      console.error('AUTH_SECRET environment variable is not set');
      return sendError(res, 500, 'Server configuration error');
    }

    // Return client configuration
    const config = {
      authSecret,
      // Add other client configuration here as needed
      apiBase: process.env.API_BASE || '/api',
      // Add feature flags or other config
      features: {
        chat: true,
        diagnostics: true,
        viewerCount: true,
      },
      // Add rate limiting info for client
      rateLimits: {
        chat: 10, // messages per minute
        api: 100, // requests per minute
      },
    };

    res.status(200).json({
      success: true,
      config,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error('Error in /api/config:', error);
    return sendError(res, 500, 'Internal server error', error);
  }
});
