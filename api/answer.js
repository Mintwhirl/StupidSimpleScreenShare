import { createCompleteHandler } from './_middleware.js';
import {
  validateRoomId,
  validateRTCDescriptor,
  TTL_ROOM,
  sendError,
  checkRateLimit,
  getSignalingRateLimit,
  getClientIdentifier,
  validateSenderSecret,
  extractSenderSecret,
} from './_utils.js';

async function handleAnswer(req, res, { redis }) {
  if (req.method === 'POST') {
    const { roomId, desc, role } = req.body || {};

    // Rate limiting: 100 requests per minute per IP for signaling
    const clientId = getClientIdentifier(req);
    const rateLimitError = await checkRateLimit(getSignalingRateLimit(), clientId, res);
    if (rateLimitError) return rateLimitError;

    // Authentication: Validate sender secret
    const senderSecret = extractSenderSecret(req);
    if (senderSecret) {
      const authValidation = await validateSenderSecret(redis, roomId, role || 'viewer', senderSecret);
      if (!authValidation.valid) {
        return sendError(res, 403, authValidation.error);
      }
    }

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

    // Use atomic transaction to check room exists and store answer
    const multi = redis.multi();
    multi.get(`room:${roomId}:meta`);
    multi.set(`room:${roomId}:answer`, JSON.stringify(desc));
    multi.expire(`room:${roomId}:answer`, TTL_ROOM);

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

    const raw = await redis.get(`room:${roomId}:answer`);
    if (!raw) {
      return res.status(404).json({ error: 'No answer available yet' });
    }

    try {
      // Upstash Redis auto-parses JSON, so check if it's already an object
      const desc = typeof raw === 'string' ? JSON.parse(raw) : raw;

      // DO NOT DELETE - allow multiple viewers to retrieve the same answer

      return res.json({ desc });
    } catch (error) {
      return sendError(res, 500, 'Failed to parse answer data', error);
    }
  }

  return sendError(res, 405, 'Method not allowed');
}

export default createCompleteHandler(handleAnswer, {
  requireRoom: true,
  allowedMethods: ['GET', 'POST', 'OPTIONS'],
  validators: {
    roomId: validateRoomId,
    desc: validateRTCDescriptor,
  },
});
