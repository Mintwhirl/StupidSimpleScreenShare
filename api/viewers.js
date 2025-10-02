import {
  createRedisClient,
  setCorsHeaders,
  asyncHandler,
  sendError,
  validateRoomId,
  validateViewerId,
  TTL_ROOM,
  TTL_HEARTBEAT
} from "./_utils.js";

const redis = createRedisClient();

/**
 * API endpoint to track active viewers in a room (viewer presence)
 * POST /viewers - Register viewer heartbeat
 * GET /viewers?roomId=X - Get active viewer count
 */
async function handleViewers(req, res) {
  setCorsHeaders(res);

  if (req.method === 'OPTIONS') {
    return res.status(204).end();
  }

  const { roomId } = req.method === 'POST' ? req.body || {} : req.query || {};

  const roomValidation = validateRoomId(roomId);
  if (!roomValidation.valid) {
    return sendError(res, 400, roomValidation.error);
  }

  // Validate room exists
  const roomExists = await redis.get(`room:${roomId}:meta`);
  if (!roomExists) {
    return sendError(res, 410, 'Room expired or not found');
  }

  if (req.method === 'POST') {
    const { viewerId } = req.body || {};

    const viewerValidation = validateViewerId(viewerId);
    if (!viewerValidation.valid) {
      return sendError(res, 400, viewerValidation.error);
    }

    // Update viewer heartbeat
    const key = `room:${roomId}:viewer:${viewerId}:heartbeat`;
    await redis.set(key, Date.now());
    await redis.expire(key, TTL_HEARTBEAT);

    // Add to viewers set
    await redis.sadd(`room:${roomId}:viewers`, viewerId);
    await redis.expire(`room:${roomId}:viewers`, TTL_ROOM);

    return res.json({ ok: true });
  }

  if (req.method === 'GET') {
    // Get all viewers and filter by those with active heartbeats
    const viewers = await redis.smembers(`room:${roomId}:viewers`) || [];

    // Check which viewers are still active
    const activeViewers = [];
    for (const viewerId of viewers) {
      const heartbeat = await redis.get(`room:${roomId}:viewer:${viewerId}:heartbeat`);
      if (heartbeat) {
        activeViewers.push(viewerId);
      }
    }

    return res.json({ count: activeViewers.length, viewers: activeViewers });
  }

  return sendError(res, 405, 'Method not allowed');
}

export default asyncHandler(handleViewers);
