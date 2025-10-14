/**
 * Reusable API Middleware
 * Abstracts common API patterns to reduce boilerplate
 */

import { createRedisClient, setCorsHeaders, asyncHandler, sendError } from './_utils.js';

/**
 * Create a standardized API handler with common middleware
 * @param {Function} handler - The main handler function
 * @param {Object} options - Configuration options
 * @param {boolean} options.requireAuth - Whether to require authentication
 * @param {boolean} options.requireRoom - Whether to require room validation
 * @param {Array} options.allowedMethods - Array of allowed HTTP methods
 * @returns {Function} - The wrapped handler
 */
export function createApiHandler(handler, options = {}) {
  const {
    requireAuth: _requireAuth = false,
    requireRoom = false,
    allowedMethods = ['GET', 'POST', 'OPTIONS'],
  } = options;

  return asyncHandler(async (req, res) => {
    // Set CORS headers
    setCorsHeaders(res);

    // Handle OPTIONS request
    if (req.method === 'OPTIONS') {
      return res.status(204).end();
    }

    // Check allowed methods
    if (!allowedMethods.includes(req.method)) {
      return sendError(res, 405, 'Method not allowed');
    }

    // Create Redis client
    const redis = createRedisClient();

    // Validate room if required
    if (requireRoom) {
      const { roomId } = req.query || req.body || {};
      if (!roomId) {
        return sendError(res, 400, 'Room ID is required');
      }

      const roomExists = await redis.get(`room:${roomId}:meta`);
      if (!roomExists) {
        return sendError(res, 410, 'Room expired or not found');
      }
    }

    // Call the main handler with enhanced context
    return handler(req, res, { redis });
  });
}

/**
 * Create a rate-limited API handler
 * @param {Function} handler - The main handler function
 * @param {Function} rateLimitFn - The rate limit function
 * @param {Function} getRateLimitId - Function to get rate limit identifier
 * @param {Object} options - Additional options
 * @returns {Function} - The wrapped handler
 */
export function createRateLimitedHandler(handler, rateLimitFn, getRateLimitId, options = {}) {
  return createApiHandler(async (req, res, context) => {
    const { redis: _redis } = context;

    // Apply rate limiting
    const rateLimitId = getRateLimitId(req);
    const rateLimitError = await rateLimitFn(rateLimitId, res);
    if (rateLimitError) return rateLimitError;

    // Call the main handler
    return handler(req, res, context);
  }, options);
}

/**
 * Create a validated API handler
 * @param {Function} handler - The main handler function
 * @param {Object} validators - Validation functions for request data
 * @param {Object} options - Additional options
 * @returns {Function} - The wrapped handler
 */
export function createValidatedHandler(handler, validators = {}, options = {}) {
  return createApiHandler(async (req, res, context) => {
    // Validate request data
    for (const [field, validator] of Object.entries(validators)) {
      const value = req.body?.[field] || req.query?.[field];
      const validation = validator(value);

      if (!validation.valid) {
        return sendError(res, 400, validation.error);
      }
    }

    // Call the main handler
    return handler(req, res, context);
  }, options);
}

/**
 * Create a complete API handler with all middleware
 * @param {Function} handler - The main handler function
 * @param {Object} config - Complete configuration
 * @returns {Function} - The wrapped handler
 */
export function createCompleteHandler(handler, config = {}) {
  const {
    requireAuth = false,
    requireRoom = false,
    allowedMethods = ['GET', 'POST', 'OPTIONS'],
    rateLimitFn = null,
    getRateLimitId = null,
    validators = {},
  } = config;

  let wrappedHandler = handler;

  // Apply rate limiting if provided
  if (rateLimitFn && getRateLimitId) {
    wrappedHandler = createRateLimitedHandler(wrappedHandler, rateLimitFn, getRateLimitId, {
      requireAuth,
      requireRoom,
      allowedMethods,
    });
  }

  // Apply validation if provided
  if (Object.keys(validators).length > 0) {
    wrappedHandler = createValidatedHandler(wrappedHandler, validators, {
      requireAuth,
      requireRoom,
      allowedMethods,
    });
  }

  // Apply base middleware
  return createApiHandler(wrappedHandler, {
    requireAuth,
    requireRoom,
    allowedMethods,
  });
}
