import {
  createRedisClient,
  setCorsHeaders,
  asyncHandler,
  sendError,
  validateRoomId,
  validateMessage,
  validateSender,
  TTL_ROOM,
  MAX_MESSAGES
} from "./_utils.js";

const redis = createRedisClient();

/**
 * Simple chat API for room participants
 * POST /chat - Send a chat message
 * GET /chat?roomId=X&since=timestamp - Get messages since timestamp
 */
async function handleChat(req, res) {
  setCorsHeaders(res);

  if (req.method === 'OPTIONS') {
    return res.status(204).end();
  }

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
    const { message, sender } = req.body || {};

    const messageValidation = validateMessage(message);
    if (!messageValidation.valid) {
      return sendError(res, 400, messageValidation.error);
    }

    const senderValidation = validateSender(sender);
    if (!senderValidation.valid) {
      return sendError(res, 400, senderValidation.error);
    }

    // Create message object
    const chatMessage = {
      id: `${Date.now()}_${Math.random().toString(36).substring(7)}`,
      sender: sender.trim().substring(0, 50),
      message: message.trim().substring(0, 500),
      timestamp: Date.now()
    };

    // Store in list (keep last MAX_MESSAGES)
    const key = `room:${roomId}:chat`;
    await redis.lpush(key, JSON.stringify(chatMessage));
    await redis.ltrim(key, 0, MAX_MESSAGES - 1);
    await redis.expire(key, TTL_ROOM);

    return res.json({ ok: true, message: chatMessage });
  }

  if (req.method === 'GET') {
    const { since } = req.query || {};
    const sinceTimestamp = parseInt(since) || 0;

    if (isNaN(sinceTimestamp) || sinceTimestamp < 0) {
      return sendError(res, 400, 'Invalid since timestamp');
    }

    // Get all messages
    const messages = await redis.lrange(`room:${roomId}:chat`, 0, -1) || [];

    // Parse and filter messages
    const parsed = messages
      .map(msg => {
        try {
          return JSON.parse(msg);
        } catch (e) {
          console.error('Failed to parse chat message:', e);
          return null;
        }
      })
      .filter(msg => msg && msg.timestamp > sinceTimestamp)
      .reverse(); // Oldest first

    return res.json({ messages: parsed });
  }

  return sendError(res, 405, 'Method not allowed');
}

export default asyncHandler(handleChat);
