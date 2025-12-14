// Pusher configuration sanity check endpoint (no secrets)

export const config = {
  runtime: 'edge',
};

export default async function handler(req, res) {
  // Set headers
  res.setHeader('Content-Type', 'application/json');
  res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');

  // Only allow GET requests
  if (req.method !== 'GET') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }

  // Get and trim environment variables
  const pusherAppId = (process.env.PUSHER_APP_ID || '').trim();
  const pusherKey = (process.env.PUSHER_KEY || '').trim();
  const pusherSecret = (process.env.PUSHER_SECRET || '').trim();
  const pusherCluster = (process.env.PUSHER_CLUSTER || '').trim();

  // Return config status (without exposing secrets)
  res.status(200).json({
    hasAppId: !!pusherAppId,
    keyPrefix: pusherKey ? pusherKey.substring(0, 6) : null,
    cluster: pusherCluster,
    hasSecret: !!pusherSecret,
    clusterLength: pusherCluster.length,
  });
}
