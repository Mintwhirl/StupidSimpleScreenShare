
import { randomBytes } from "crypto";
import { createRedisClient, setCorsHeaders, asyncHandler, sendError, TTL_ROOM } from "./_utils.js";

const redis = createRedisClient();

async function handleCreateRoom(req, res) {
  setCorsHeaders(res);

  if (req.method === 'OPTIONS') {
    return res.status(204).end();
  }

  if (req.method !== 'POST') {
    return sendError(res, 405, 'Method not allowed');
  }

  try {
    const roomId = randomBytes(12).toString('hex'); // 24 hex chars, cryptographically secure

    const roomMeta = JSON.stringify({
      createdAt: Date.now(),
      version: '1.0'
    });

    await redis.set(`room:${roomId}:meta`, roomMeta);
    await redis.expire(`room:${roomId}:meta`, TTL_ROOM);

    return res.status(201).json({
      roomId,
      expiresIn: TTL_ROOM
    });
  } catch (error) {
    return sendError(res, 500, 'Failed to create room', error);
  }
}

export default asyncHandler(handleCreateRoom);
