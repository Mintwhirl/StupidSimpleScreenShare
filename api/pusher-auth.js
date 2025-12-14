// Pusher authentication endpoint for Vercel
// This endpoint authenticates clients for Pusher Channels

export const config = {
  runtime: 'nodejs',
};

export default async function handler(request) {
  // eslint-disable-next-line global-require
  const crypto = require('crypto');
  try {
    const { socket_id: socketId, channel_name: channelName } = await request.json();

    // Environment variables from Vercel
    const pusherAppId = process.env.PUSHER_APP_ID;
    const pusherKey = process.env.PUSHER_KEY;
    const pusherSecret = process.env.PUSHER_SECRET;

    if (!pusherAppId || !pusherKey || !pusherSecret) {
      return new Response(JSON.stringify({ error: 'Pusher credentials not configured' }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // Create auth string
    const authString = `${socketId}:${channelName}`;

    // Using Node.js crypto module for better compatibility
    const signature = crypto.createHmac('sha256', pusherSecret).update(authString).digest('hex');

    const authData = {
      auth: `${pusherKey}:${signature}`,
      channel_data: JSON.stringify({
        user_id: crypto.randomUUID(),
        user_info: {},
      }),
    };

    return new Response(JSON.stringify(authData), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Pusher auth error:', error);
    return new Response(JSON.stringify({ error: 'Authentication failed' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
