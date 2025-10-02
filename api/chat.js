import { Redis } from "@upstash/redis";

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL,
  token: process.env.UPSTASH_REDIS_REST_TOKEN
});

/**
 * Simple chat API for room participants
 * POST /chat - Send a chat message
 * GET /chat?roomId=X&since=timestamp - Get messages since timestamp
 */
export default async function handler(req, res) {
  // CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.status(204).end();
    return;
  }

  const { roomId } = req.method === 'POST' ? req.body : req.query;

  if (!roomId) {
    return res.status(400).json({ error: 'Missing roomId' });
  }

  // Validate room exists
  const roomExists = await redis.get(`room:${roomId}:meta`);
  if (!roomExists) {
    return res.status(410).json({ error: 'Room expired or not found' });
  }

  if (req.method === 'POST') {
    const { message, sender } = req.body;

    if (!message || !sender) {
      return res.status(400).json({ error: 'Missing message or sender' });
    }

    // Validate message length
    if (message.length > 500) {
      return res.status(400).json({ error: 'Message too long (max 500 chars)' });
    }

    // Create message object
    const chatMessage = {
      id: Date.now() + '_' + Math.random().toString(36).substring(7),
      sender: sender.substring(0, 50), // Limit sender name
      message: message.substring(0, 500), // Limit message length
      timestamp: Date.now()
    };

    // Store in list (keep last 50 messages)
    const key = `room:${roomId}:chat`;
    await redis.lpush(key, JSON.stringify(chatMessage));
    await redis.ltrim(key, 0, 49); // Keep only last 50 messages
    await redis.expire(key, 60 * 30); // 30 min TTL

    return res.json({ ok: true, message: chatMessage });
  }

  if (req.method === 'GET') {
    const { since } = req.query;
    const sinceTimestamp = parseInt(since) || 0;

    // Get all messages
    const messages = await redis.lrange(`room:${roomId}:chat`, 0, -1) || [];

    // Parse and filter messages
    const parsed = messages
      .map(msg => {
        try {
          return JSON.parse(msg);
        } catch (e) {
          return null;
        }
      })
      .filter(msg => msg && msg.timestamp > sinceTimestamp)
      .reverse(); // Oldest first

    return res.json({ messages: parsed });
  }

  res.status(405).json({ error: 'Method not allowed' });
}
