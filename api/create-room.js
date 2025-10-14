import { randomBytes } from 'crypto';

import {
  createRedisClient,
  setCorsHeaders,
  asyncHandler,
  sendError,
  checkRateLimit,
  getClientIdentifier,
  getRoomCreationRateLimit,
  TTL_ROOM,
} from './_utils.js';

async function handleCreateRoom(req, res) {
  const redis = createRedisClient();
  setCorsHeaders(res);

  if (req.method === 'OPTIONS') {
    return res.status(204).end();
  }

  if (req.method !== 'POST') {
    return sendError(res, 405, 'Method not allowed');
  }

  // Log request details for debugging (only in development)
  if (process.env.NODE_ENV !== 'production') {
    console.log('Create room request:', {
      method: req.method,
      headers: req.headers,
      body: req.body,
      query: req.query,
    });
  }

  // Optional authentication (set AUTH_SECRET in environment variables)
  const authSecret = process.env.AUTH_SECRET;
  if (authSecret) {
    const providedSecret = req.headers['x-auth-secret'] || req.body?.authSecret;
    if (providedSecret !== authSecret) {
      console.log(
        'Auth mismatch - Server secret:',
        `${authSecret?.substring(0, 10) || 'undefined'}...`,
        'Client secret:',
        `${providedSecret?.substring(0, 10) || 'undefined'}...`
      );
      return sendError(res, 401, 'Unauthorized - Invalid or missing auth secret');
    }
  }

  // Rate limiting: 50 rooms per hour per IP (bypassed in development)
  const clientId = getClientIdentifier(req);

  // Skip rate limiting in development (when no AUTH_SECRET is set)
  if (process.env.AUTH_SECRET) {
    const rateLimitError = await checkRateLimit(getRoomCreationRateLimit(), clientId, res);
    if (rateLimitError) return rateLimitError;
  }

  try {
    const roomId = randomBytes(12).toString('hex'); // 24 hex chars, cryptographically secure

    const roomMeta = JSON.stringify({
      createdAt: Date.now(),
      version: '1.0',
    });

    await redis.set(`room:${roomId}:meta`, roomMeta);
    await redis.expire(`room:${roomId}:meta`, TTL_ROOM);

    return res.status(201).json({
      roomId,
      expiresIn: TTL_ROOM,
    });
  } catch (error) {
    return sendError(res, 500, 'Failed to create room', error);
  }
}

export default asyncHandler(handleCreateRoom);
