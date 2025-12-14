// Pusher authentication endpoint for Vercel
// This endpoint authenticates clients for Pusher Channels

export const config = {
  runtime: 'edge',
};

export default async function handler(request) {
  // Only allow POST requests
  if (request.method !== 'POST') {
    return new Response('Method not allowed', { status: 405 });
  }

  try {
    const body = await request.json();
    const { socket_id: socketId, channel_name: channelName } = body;

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

    // Using Web Crypto API for edge runtime
    const encoder = new TextEncoder();
    const keyData = encoder.encode(pusherSecret);
    const messageData = encoder.encode(authString);

    const cryptoKey = await crypto.subtle.importKey('raw', keyData, { name: 'HMAC', hash: 'SHA-256' }, false, ['sign']);

    const signatureBuffer = await crypto.subtle.sign('HMAC', cryptoKey, messageData);
    const signature = Array.from(new Uint8Array(signatureBuffer))
      .map((b) => b.toString(16).padStart(2, '0'))
      .join('');

    const authData = {
      auth: `${pusherKey.replace(/\n/g, '')}:${signature}`,
      channel_data: JSON.stringify({
        user_id: Math.random().toString(36).substring(2, 15),
        user_info: {},
      }),
    };

    return new Response(JSON.stringify(authData), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'no-cache, no-store, must-revalidate',
      },
    });
  } catch (error) {
    console.error('Pusher auth error:', error);
    console.error('Request body:', request.body);
    console.error('Request headers:', Object.fromEntries(request.headers.entries()));
    return new Response(JSON.stringify({ error: 'Authentication failed', details: error.message }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
