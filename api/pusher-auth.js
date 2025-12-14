// Pusher authentication endpoint for Vercel
// Authenticates clients for private/presence channels

export const config = {
  runtime: 'edge',
};

export default async function handler(request) {
  // Only allow POST requests
  if (request.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'Method not allowed' }), {
      status: 405,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  try {
    const body = await request.json();
    const { socket_id: socketId, channel_name: channelName } = body;

    // Validate required fields
    if (!socketId || !channelName) {
      console.error('Pusher auth missing fields:', { socketId: !!socketId, channelName: !!channelName });
      return new Response(JSON.stringify({ error: 'Missing required fields' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // Validate channel name starts with private- or presence-
    if (!channelName.startsWith('private-') && !channelName.startsWith('presence-')) {
      console.error('Pusher auth invalid channel type:', channelName);
      return new Response(JSON.stringify({ error: 'Invalid channel type' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // Environment variables from Vercel
    const pusherAppId = process.env.PUSHER_APP_ID;
    const pusherKey = process.env.PUSHER_KEY;
    const pusherSecret = process.env.PUSHER_SECRET;

    if (!pusherAppId || !pusherKey || !pusherSecret) {
      console.error('Pusher credentials missing:', {
        hasAppId: !!pusherAppId,
        hasKey: !!pusherKey,
        hasSecret: !!pusherSecret,
      });
      return new Response(JSON.stringify({ error: 'Server configuration error' }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    console.log('Pusher auth request:', {
      channel: channelName,
      socketId: `${socketId.substring(0, 8)}...`,
      channelType: channelName.startsWith('presence-') ? 'presence' : 'private',
    });

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
    };

    // Add channel_data for presence channels
    if (channelName.startsWith('presence-')) {
      authData.channel_data = JSON.stringify({
        user_id: `user_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`,
        user_info: {},
      });
    }

    console.log('Pusher auth success:', { channel: channelName });

    return new Response(JSON.stringify(authData), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'no-cache, no-store, must-revalidate',
      },
    });
  } catch (error) {
    console.error('Pusher auth error:', error.message);
    return new Response(JSON.stringify({ error: 'Authentication failed' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
