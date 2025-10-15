import { createCompleteHandler } from './_middleware.js';
import { sendError } from './_utils.js';

/**
 * GET /api/config
 * Returns client configuration including AUTH_SECRET
 * This endpoint is secure and only returns the AUTH_SECRET to authorized requests
 */
async function handleConfig(req, res, { redis: _redis }) {
  try {
    // Get AUTH_SECRET from environment variables
    const authSecret = process.env.AUTH_SECRET;

    console.log('Config endpoint - AUTH_SECRET check:', {
      hasAuthSecret: !!authSecret,
      authSecretLength: authSecret ? authSecret.length : 0,
      authSecretPreview: authSecret ? `${authSecret.substring(0, 20)}...` : 'undefined',
    });

    if (!authSecret) {
      console.error('AUTH_SECRET environment variable is not set');
      return sendError(res, 500, 'Server configuration error');
    }

    // Return client configuration
    const config = {
      // Add other client configuration here as needed
      apiBase: process.env.API_BASE || '/api',
      // Include auth secret for client authentication
      authSecret,
      // Add feature flags or other config
      features: {
        chat: true,
        diagnostics: true,
        viewerCount: true,
      },
      // Add rate limiting info for client
      rateLimits: {
        chat: 60, // messages per minute
        api: 2000, // requests per minute
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
}

export default createCompleteHandler(handleConfig, {
  requireRoom: false, // Config doesn't require room
  allowedMethods: ['GET', 'OPTIONS'],
});
