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
  getRoomMetaKey,
  getOfferKey,
} from './_utils.js';

async function handleOffer(req, res, { redis }) {
  if (req.method === 'POST') {
    const { roomId, desc, role } = req.body || {};

    // Rate limiting: 100 requests per minute per IP for signaling
    const clientId = getClientIdentifier(req);
    const rateLimitError = await checkRateLimit(getSignalingRateLimit(), clientId, res);
    if (rateLimitError) return rateLimitError;

    // Authentication: Validate sender secret
    const senderSecret = extractSenderSecret(req);
    if (senderSecret) {
      const authValidation = await validateSenderSecret(redis, roomId, role || 'host', senderSecret);
      if (!authValidation.valid) {
        return sendError(res, 403, authValidation.error);
      }
    }

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
    const offerKey = getOfferKey(roomId);
    const multi = redis.multi();
    multi.get(getRoomMetaKey(roomId));
    multi.set(offerKey, JSON.stringify(desc));
    multi.expire(offerKey, TTL_ROOM);

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

    const roomExists = await redis.get(getRoomMetaKey(roomId));
    if (!roomExists) {
      return sendError(res, 410, 'Room expired or not found');
    }

    const offerKey = getOfferKey(roomId);
    const raw = await redis.get(offerKey);
    if (!raw) {
      return res.status(404).json({ error: 'No offer available yet' });
    }

    try {
      // Upstash Redis auto-parses JSON, so check if it's already an object
      const desc = typeof raw === 'string' ? JSON.parse(raw) : raw;

      // Delete the offer after retrieving it to prevent multiple viewers from getting the same offer
      await redis.del(offerKey);

      return res.json({ desc });
    } catch (error) {
      return sendError(res, 500, 'Failed to parse offer data', error);
    }
  }

  return sendError(res, 405, 'Method not allowed');
}

export default createCompleteHandler(handleOffer, {
  requireRoom: true,
  allowedMethods: ['GET', 'POST', 'OPTIONS'],
  validators: {
    roomId: validateRoomId,
    desc: validateRTCDescriptor,
  },
});
