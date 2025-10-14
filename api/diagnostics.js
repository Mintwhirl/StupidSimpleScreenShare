import { createCompleteHandler } from './_middleware.js';

/**
 * API endpoint for network and system diagnostics
 * GET /diagnostics - Get server health status
 * GET /diagnostics?roomId=X - Get room-specific diagnostics
 */
async function handleDiagnostics(req, res, { redis }) {
  const { roomId } = req.query;

  try {
    // Test Redis connection
    const redisHealthy = await testRedisConnection(redis);

    const diagnostics = {
      timestamp: Date.now(),
      server: {
        status: 'online',
        region: process.env.VERCEL_REGION || 'unknown',
        redis: redisHealthy ? 'connected' : 'disconnected',
      },
    };

    // If roomId provided, check room-specific diagnostics
    if (roomId) {
      const roomDiag = await getRoomDiagnostics(roomId, redis);
      diagnostics.room = roomDiag;
    }

    return res.json(diagnostics);
  } catch (error) {
    console.error('Diagnostics error:', error);
    return res.status(500).json({
      error: 'Diagnostics failed',
      message: error.message,
    });
  }
}

async function testRedisConnection(redis) {
  try {
    const result = await redis.ping();
    console.log('Redis ping result:', result);
    return true;
  } catch (e) {
    console.error('Redis connection test failed:', e);
    return false;
  }
}

async function getRoomDiagnostics(roomId, redis) {
  try {
    const meta = await redis.get(`room:${roomId}:meta`);

    if (!meta) {
      return {
        exists: false,
        status: 'not_found',
      };
    }

    const [offer, answer, viewers, chatMsgs] = await Promise.all([
      redis.get(`room:${roomId}:offer`),
      redis.get(`room:${roomId}:answer`),
      redis.smembers(`room:${roomId}:viewers`),
      redis.lrange(`room:${roomId}:chat`, 0, -1),
    ]);

    // Check which viewers are still active (have recent heartbeats)
    const activeViewers = [];
    if (viewers && viewers.length > 0) {
      for (const viewerId of viewers) {
        const heartbeat = await redis.get(`room:${roomId}:viewer:${viewerId}:heartbeat`);
        if (heartbeat) {
          activeViewers.push(viewerId);
        }
      }
    }

    return {
      exists: true,
      status: 'active',
      hasOffer: !!offer,
      hasAnswer: !!answer,
      viewerCount: activeViewers.length,
      chatMessageCount: (chatMsgs || []).length,
      created: typeof meta === 'string' ? JSON.parse(meta).createdAt : meta.createdAt,
    };
  } catch (e) {
    return {
      exists: false,
      status: 'error',
      error: e.message,
    };
  }
}

export default createCompleteHandler(handleDiagnostics, {
  requireRoom: false, // Diagnostics can work without room
  allowedMethods: ['GET', 'OPTIONS'],
});
