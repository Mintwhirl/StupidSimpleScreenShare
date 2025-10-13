import {
  createRedisClient,
  setCorsHeaders,
  asyncHandler,
  sendError,
  validateRoomId,
  validateRTCDescriptor,
  TTL_ROOM
} from "./_utils.js";

async function handleAnswer(req, res) {
  const redis = createRedisClient();
  setCorsHeaders(res);

  if (req.method === 'OPTIONS') {
    return res.status(204).end();
  }

  if (req.method === 'POST') {
    const { roomId, desc } = req.body || {};

    const roomValidation = validateRoomId(roomId);
    if (!roomValidation.valid) {
      return sendError(res, 400, roomValidation.error);
    }

    const descValidation = validateRTCDescriptor(desc);
    if (!descValidation.valid) {
      return sendError(res, 400, descValidation.error);
    }

    if (desc.type !== 'answer') {
      return sendError(res, 400, 'Descriptor must be of type "answer"');
    }

    const roomExists = await redis.get(`room:${roomId}:meta`);
    if (!roomExists) {
      return sendError(res, 410, 'Room expired or not found');
    }

    await redis.set(`room:${roomId}:answer`, JSON.stringify(desc));
    await redis.expire(`room:${roomId}:answer`, TTL_ROOM);

    return res.json({ ok: true });
  }

  if (req.method === 'GET') {
    const { roomId } = req.query || {};

    const roomValidation = validateRoomId(roomId);
    if (!roomValidation.valid) {
      return sendError(res, 400, roomValidation.error);
    }

    const roomExists = await redis.get(`room:${roomId}:meta`);
    if (!roomExists) {
      return sendError(res, 410, 'Room expired or not found');
    }

    const raw = await redis.get(`room:${roomId}:answer`);
    if (!raw) {
      return res.status(404).json({ error: 'No answer available yet' });
    }

    try {
      const desc = JSON.parse(raw);
      return res.json({ desc });
    } catch (error) {
      return sendError(res, 500, 'Failed to parse answer data', error);
    }
  }

  return sendError(res, 405, 'Method not allowed');
}

export default asyncHandler(handleAnswer);