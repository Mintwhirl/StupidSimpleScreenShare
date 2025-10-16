import { createCompleteHandler } from './_middleware.js';
import {
  sendError,
  validateRoomId,
  validateRole,
  validateICECandidate,
  TTL_ROOM,
  checkRateLimit,
  getCandidateRateLimit,
  getClientIdentifier,
  validateSenderSecret,
  extractSenderSecret,
} from './_utils.js';

async function handleCandidate(req, res, { redis }) {
  if (req.method === 'POST') {
    const { roomId, role, viewerId, candidate } = req.body || {};

    // Rate limiting: 500 requests per minute per IP for ICE candidates (more lenient)
    const clientId = getClientIdentifier(req);
    const rateLimitError = await checkRateLimit(getCandidateRateLimit(), clientId, res);
    if (rateLimitError) return rateLimitError;

    // Authentication: Validate sender secret
    const senderSecret = extractSenderSecret(req);
    if (senderSecret) {
      const senderId = role === 'viewer' && viewerId ? viewerId : role;
      const authValidation = await validateSenderSecret(redis, roomId, senderId, senderSecret);
      if (!authValidation.valid) {
        return sendError(res, 403, authValidation.error);
      }
    }

    // Validation is now handled by middleware

    // Use atomic transaction to check room exists and store candidate
    const key =
      role === 'viewer' && viewerId
        ? `room:${roomId}:${role}:${viewerId}:candidates`
        : `room:${roomId}:${role}:candidates`;

    const multi = redis.multi();
    multi.get(`room:${roomId}:meta`);
    multi.rpush(key, JSON.stringify(candidate)); // Store RTCIceCandidate directly
    multi.expire(key, TTL_ROOM);

    const results = await multi.exec();
    const roomExists = results[0];

    if (!roomExists) {
      return sendError(res, 410, 'Room expired or not found');
    }

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

    // Use Redis transaction to atomically read and delete candidates
    const multi = redis.multi();
    multi.lrange(key, 0, -1);
    multi.del(key);
    const results = await multi.exec();

    const arr = results[0] || [];

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

export default createCompleteHandler(handleCandidate, {
  requireRoom: true,
  allowedMethods: ['GET', 'POST', 'OPTIONS'],
  validators: {
    roomId: validateRoomId,
    role: validateRole,
    candidate: validateICECandidate,
  },
});
