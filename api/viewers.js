import { Redis } from "@upstash/redis";

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL,
  token: process.env.UPSTASH_REDIS_REST_TOKEN
});

/**
 * API endpoint to track active viewers in a room (viewer presence)
 * POST /viewers - Register viewer heartbeat
 * GET /viewers?roomId=X - Get active viewer count
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
    const { viewerId } = req.body;

    if (!viewerId) {
      return res.status(400).json({ error: 'Missing viewerId' });
    }

    // Update viewer heartbeat (30 second TTL)
    const key = `room:${roomId}:viewer:${viewerId}:heartbeat`;
    await redis.set(key, Date.now());
    await redis.expire(key, 30); // 30 second heartbeat

    // Add to viewers set
    await redis.sadd(`room:${roomId}:viewers`, viewerId);
    await redis.expire(`room:${roomId}:viewers`, 60 * 30);

    return res.json({ ok: true });
  }

  if (req.method === 'GET') {
    // Get all viewers and filter by those with active heartbeats
    const viewers = await redis.smembers(`room:${roomId}:viewers`) || [];

    // Check which viewers are still active
    const activeViewers = [];
    for (const viewerId of viewers) {
      const heartbeat = await redis.get(`room:${roomId}:viewer:${viewerId}:heartbeat`);
      if (heartbeat) {
        activeViewers.push(viewerId);
      }
    }

    return res.json({ count: activeViewers.length, viewers: activeViewers });
  }

  res.status(405).json({ error: 'Method not allowed' });
}
