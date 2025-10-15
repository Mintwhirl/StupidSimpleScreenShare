import { createCompleteHandler } from './_middleware.js';
import {
  sendError,
  validateRoomId,
  validateMessage,
  validateSender,
  checkRateLimit,
  getChatRateLimit,
  getClientIdentifier,
  TTL_ROOM,
  MAX_MESSAGES,
} from './_utils.js';

/**
 * Simple chat API for room participants
 * POST /chat - Send a chat message
 * GET /chat?roomId=X&since=timestamp - Get messages since timestamp
 */
async function handleChat(req, res, { redis }) {
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
    const { message, sender, secret } = req.body || {};

    const messageValidation = validateMessage(message);
    if (!messageValidation.valid) {
      return sendError(res, 400, messageValidation.error);
    }

    const senderValidation = validateSender(sender);
    if (!senderValidation.valid) {
      return sendError(res, 400, senderValidation.error);
    }

    // Validate sender is authorized for this room
    const clientId = getClientIdentifier(req);
    // Sanitize sender name to prevent Redis key pollution
    const sanitizedSender = sender.trim().replace(/[^a-zA-Z0-9_-]/g, '_');

    // Validate sender is registered and authorized for this room
    const senderKey = `room:${roomId}:sender:${sanitizedSender}`;
    const authorizedSenderData = await redis.get(senderKey);

    if (!authorizedSenderData) {
      return sendError(res, 403, 'Unauthorized: Sender not registered for this room');
    }

    try {
      const senderData = JSON.parse(authorizedSenderData);
      // Primary authentication: secret must match
      if (senderData.secret !== secret) {
        return sendError(res, 403, 'Unauthorized: Invalid sender credentials');
      }
      // Secondary check: client ID should match, but allow some flexibility for browser fingerprinting issues
      if (senderData.clientId !== clientId) {
        console.warn(
          `Client ID mismatch for sender ${sanitizedSender}: expected ${senderData.clientId}, got ${clientId}`
        );
        // For now, we'll allow this but log it for monitoring
        // In production, you might want to implement a more sophisticated client validation
      }
    } catch (parseError) {
      return sendError(res, 403, 'Unauthorized: Invalid sender data');
    }

    // Rate limiting: 60 messages per minute per room+sender combo
    const rateLimitId = `${roomId}:${sender.trim().substring(0, 50)}`;
    const rateLimitError = await checkRateLimit(getChatRateLimit(), rateLimitId, res);
    if (rateLimitError) return rateLimitError;

    // Create message object
    const chatMessage = {
      id: `${Date.now()}_${Math.random().toString(36).substring(7)}`,
      sender: sender.trim().substring(0, 50),
      message: message.trim().substring(0, 500),
      timestamp: Date.now(),
    };

    // Store in sorted set with timestamp as score (more efficient for polling)
    const key = `room:${roomId}:chat`;
    const score = chatMessage.timestamp;
    await redis.zadd(key, { score, member: JSON.stringify(chatMessage) });

    // Keep only the most recent messages and set expiration
    await redis.zremrangebyrank(key, 0, -(MAX_MESSAGES + 1));
    await redis.expire(key, TTL_ROOM);

    return res.json({ ok: true, message: chatMessage });
  }

  if (req.method === 'GET') {
    const { since } = req.query || {};
    const sinceTimestamp = parseInt(since) || 0;

    if (isNaN(sinceTimestamp) || sinceTimestamp < 0) {
      return sendError(res, 400, 'Invalid since timestamp');
    }

    // Get messages since timestamp using sorted set (much more efficient)
    const key = `room:${roomId}:chat`;
    const messages =
      sinceTimestamp > 0
        ? (await redis.zrangebyscore(key, sinceTimestamp + 1, '+inf')) || []
        : (await redis.zrange(key, -MAX_MESSAGES, -1)) || [];

    // Parse messages
    const parsed = messages
      .map((msg) => {
        try {
          // Upstash Redis auto-parses JSON, so check if it's already an object
          return typeof msg === 'string' ? JSON.parse(msg) : msg;
        } catch (e) {
          console.error('Failed to parse chat message:', e);
          return null;
        }
      })
      .filter((msg) => msg && msg.timestamp > sinceTimestamp)
      .reverse(); // Oldest first

    return res.json({ messages: parsed });
  }

  return sendError(res, 405, 'Method not allowed');
}

export default createCompleteHandler(handleChat, {
  requireRoom: true,
  allowedMethods: ['GET', 'POST', 'OPTIONS'],
  validators: {
    roomId: validateRoomId,
    message: validateMessage,
    sender: validateSender,
  },
});
