import { createRedisClient } from '../_utils.js';

/**
 * Vercel Cron Job - Health Check
 * Keeps Upstash Redis database active by pinging it weekly
 * This endpoint is automatically called by Vercel Cron
 */
export default async function handler(req, res) {
  // Verify the request is from Vercel Cron
  const authHeader = req.headers.authorization;
  const cronSecret = process.env.CRON_SECRET;

  if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  try {
    const redis = createRedisClient();

    // Ping Redis to keep it active
    await redis.ping();

    // Get some stats
    const timestamp = Date.now();
    await redis.set('health:last_check', timestamp);

    console.log(`Health check successful at ${new Date(timestamp).toISOString()}`);

    return res.status(200).json({
      status: 'healthy',
      timestamp,
      message: 'Redis connection active',
    });
  } catch (error) {
    console.error('Health check failed:', error);
    return res.status(500).json({
      status: 'unhealthy',
      error: error.message,
    });
  }
}
