import {
  createRedisClient,
  setCorsHeaders,
  asyncHandler,
  sendError,
  validateRoomId,
  validateSender,
  getClientIdentifier,
  TTL_ROOM,
} from './_utils.js';

/**
 * API endpoint for registering a sender ID for chat
 * POST /register-sender - Register a sender ID for a room
 */
async function handleRegisterSender(req, res) {
  const redis = createRedisClient();
  setCorsHeaders(res);

  if (req.method === 'OPTIONS') {
    return res.status(204).end();
  }

  if (req.method !== 'POST') {
    return sendError(res, 405, 'Method not allowed');
  }

  const { roomId, senderId } = req.body || {};

  // Validate inputs
  const roomValidation = validateRoomId(roomId);
  if (!roomValidation.valid) {
    return sendError(res, 400, roomValidation.error);
  }

  const senderValidation = validateSender(senderId);
  if (!senderValidation.valid) {
    return sendError(res, 400, senderValidation.error);
  }

  // Check room exists
  const roomExists = await redis.get(`room:${roomId}:meta`);
  if (!roomExists) {
    return sendError(res, 410, 'Room expired or not found');
  }

  try {
    const clientId = getClientIdentifier(req);
    const senderKey = `room:${roomId}:sender:${senderId.trim()}`;

    // Register the sender ID for this client
    await redis.set(senderKey, clientId);
    await redis.expire(senderKey, TTL_ROOM);

    return res.json({ ok: true, message: 'Sender ID registered successfully' });
  } catch (error) {
    console.error('Error registering sender:', error);
    return sendError(res, 500, 'Failed to register sender ID', error);
  }
}

export default asyncHandler(handleRegisterSender);
