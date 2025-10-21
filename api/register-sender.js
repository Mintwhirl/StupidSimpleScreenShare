import { randomBytes } from 'crypto';

import { createCompleteHandler } from './_middleware.js';
import {
  sendError,
  validateRoomId,
  validateSender,
  getClientIdentifier,
  TTL_ROOM,
  getRoomMetaKey,
  getSenderKey,
} from './_utils.js';

/**
 * API endpoint for registering a sender ID for chat
 * POST /register-sender - Register a sender ID for a room
 */
async function handleRegisterSender(req, res, { redis }) {
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
  const roomExists = await redis.get(getRoomMetaKey(roomId));
  if (!roomExists) {
    return sendError(res, 410, 'Room expired or not found');
  }

  try {
    const clientId = getClientIdentifier(req);
    const senderKey = getSenderKey(roomId, senderId.trim());

    // Generate a unique secret for this sender
    const senderSecret = randomBytes(16).toString('hex'); // 32 hex chars (128 bits)

    // Store both client ID and secret
    const senderData = {
      clientId,
      secret: senderSecret,
      registeredAt: Date.now(),
    };

    await redis.set(senderKey, JSON.stringify(senderData));
    await redis.expire(senderKey, TTL_ROOM);

    return res.json({
      ok: true,
      message: 'Sender ID registered successfully',
      secret: senderSecret, // Return secret to client
    });
  } catch (error) {
    console.error('Error registering sender:', error);
    return sendError(res, 500, 'Failed to register sender ID', error);
  }
}

export default createCompleteHandler(handleRegisterSender, {
  requireRoom: true,
  allowedMethods: ['POST', 'OPTIONS'],
  validators: {
    roomId: validateRoomId,
    senderId: validateSender,
  },
});
