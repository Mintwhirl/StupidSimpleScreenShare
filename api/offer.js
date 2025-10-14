import {
  createRedisClient,
  setCorsHeaders,
  asyncHandler,
  sendError,
  validateRoomId,
  validateRTCDescriptor,
  TTL_ROOM,
} from './_utils.js';

async function handleOffer(req, res) {
  const redis = createRedisClient();
  setCorsHeaders(res);

  if (req.method === 'OPTIONS') {
    return res.status(204).end();
  }

  if (req.method === 'POST') {
    const { roomId, desc } = req.body || {};

    // Validate input
    const roomValidation = validateRoomId(roomId);
    if (!roomValidation.valid) {
      return sendError(res, 400, roomValidation.error);
    }

    const descValidation = validateRTCDescriptor(desc);
    if (!descValidation.valid) {
      return sendError(res, 400, descValidation.error);
    }

    if (desc.type !== 'offer') {
      return sendError(res, 400, 'Descriptor must be of type "offer"');
    }

    // Use atomic transaction to check room exists and store offer
    const multi = redis.multi();
    multi.get(`room:${roomId}:meta`);
    multi.set(`room:${roomId}:offer`, JSON.stringify(desc));
    multi.expire(`room:${roomId}:offer`, TTL_ROOM);

    const results = await multi.exec();
    const roomExists = results[0];

    if (!roomExists) {
      return sendError(res, 410, 'Room expired or not found');
    }

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

    const raw = await redis.get(`room:${roomId}:offer`);
    if (!raw) {
      return res.status(404).json({ error: 'No offer available yet' });
    }

    try {
      // Upstash Redis auto-parses JSON, so check if it's already an object
      const desc = typeof raw === 'string' ? JSON.parse(raw) : raw;

      // Delete the offer after retrieving it to prevent multiple viewers from getting the same offer
      await redis.del(`room:${roomId}:offer`);

      return res.json({ desc });
    } catch (error) {
      return sendError(res, 500, 'Failed to parse offer data', error);
    }
  }

  return sendError(res, 405, 'Method not allowed');
}

export default asyncHandler(handleOffer);
