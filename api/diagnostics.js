import { Redis } from "@upstash/redis";

/**
 * API endpoint for network and system diagnostics
 * GET /diagnostics - Get server health status
 * GET /diagnostics?roomId=X - Get room-specific diagnostics
 */
export default async function handler(req, res) {
  const redis = new Redis({
    url: process.env.UPSTASH_REDIS_REST_URL?.trim(),
    token: process.env.UPSTASH_REDIS_REST_TOKEN?.trim()
  });
  // CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.status(204).end();
    return;
  }

  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { roomId } = req.query;

  try {
    // Test Redis connection
    const redisHealthy = await testRedisConnection();

    const diagnostics = {
      timestamp: Date.now(),
      server: {
        status: 'online',
        region: process.env.VERCEL_REGION || 'unknown',
        redis: redisHealthy ? 'connected' : 'disconnected'
      }
    };

    // If roomId provided, check room-specific diagnostics
    if (roomId) {
      const roomDiag = await getRoomDiagnostics(roomId);
      diagnostics.room = roomDiag;
    }

    return res.json(diagnostics);
  } catch (error) {
    console.error('Diagnostics error:', error);
    return res.status(500).json({
      error: 'Diagnostics failed',
      message: error.message
    });
  }
}

async function testRedisConnection() {
  try {
    await redis.ping();
    return true;
  } catch (e) {
    return false;
  }
}

async function getRoomDiagnostics(roomId) {
  try {
    const meta = await redis.get(`room:${roomId}:meta`);

    if (!meta) {
      return {
        exists: false,
        status: 'not_found'
      };
    }

    const [offer, answer, viewers, chatMsgs] = await Promise.all([
      redis.get(`room:${roomId}:offer`),
      redis.get(`room:${roomId}:answer`),
      redis.smembers(`room:${roomId}:viewers`),
      redis.lrange(`room:${roomId}:chat`, 0, -1)
    ]);

    return {
      exists: true,
      status: 'active',
      hasOffer: !!offer,
      hasAnswer: !!answer,
      viewerCount: (viewers || []).length,
      chatMessageCount: (chatMsgs || []).length,
      created: JSON.parse(meta).createdAt
    };
  } catch (e) {
    return {
      exists: false,
      status: 'error',
      error: e.message
    };
  }
}
