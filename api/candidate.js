import {
  createRedisClient,
  setCorsHeaders,
  asyncHandler,
  sendError,
  validateRoomId,
  validateRole,
  validateICECandidate,
  TTL_ROOM,
} from './_utils.js';

async function handleCandidate(req, res) {
  const redis = createRedisClient();
  setCorsHeaders(res);

  if (req.method === 'OPTIONS') {
    return res.status(204).end();
  }

  if (req.method === 'POST') {
    const { roomId, role, viewerId, candidate } = req.body || {};

    const roomValidation = validateRoomId(roomId);
    if (!roomValidation.valid) {
      return sendError(res, 400, roomValidation.error);
    }

    const roleValidation = validateRole(role);
    if (!roleValidation.valid) {
      return sendError(res, 400, roleValidation.error);
    }

    const candidateValidation = validateICECandidate(candidate);
    if (!candidateValidation.valid) {
      return sendError(res, 400, candidateValidation.error);
    }

    const roomExists = await redis.get(`room:${roomId}:meta`);
    if (!roomExists) {
      return sendError(res, 410, 'Room expired or not found');
    }

    // Use viewerId for viewers to distinguish between multiple viewers
    const key =
      role === 'viewer' && viewerId
        ? `room:${roomId}:${role}:${viewerId}:candidates`
        : `room:${roomId}:${role}:candidates`;
    await redis.rpush(key, JSON.stringify(candidate));
    await redis.expire(key, TTL_ROOM);

    return res.json({ ok: true });
  }

  if (req.method === 'GET') {
    const { roomId, role, viewerId } = req.query || {};

    const roomValidation = validateRoomId(roomId);
    if (!roomValidation.valid) {
      return sendError(res, 400, roomValidation.error);
    }

    const roleValidation = validateRole(role);
    if (!roleValidation.valid) {
      return sendError(res, 400, roleValidation.error);
    }

    const roomExists = await redis.get(`room:${roomId}:meta`);
    if (!roomExists) {
      return sendError(res, 410, 'Room expired or not found');
    }

    // Use viewerId for viewers to distinguish between multiple viewers
    const key =
      role === 'viewer' && viewerId
        ? `room:${roomId}:${role}:${viewerId}:candidates`
        : `room:${roomId}:${role}:candidates`;
    const arr = (await redis.lrange(key, 0, -1)) || [];

    if (arr.length > 0) {
      await redis.del(key); // Remove after fetching to prevent duplicates
    }

    try {
      // Upstash Redis auto-parses JSON, so check if it's already an object
      const parsed = arr.map((a) => (typeof a === 'string' ? JSON.parse(a) : a));
      return res.json({ candidates: parsed });
    } catch (error) {
      return sendError(res, 500, 'Failed to parse candidate data', error);
    }
  }

  return sendError(res, 405, 'Method not allowed');
}

export default asyncHandler(handleCandidate);
