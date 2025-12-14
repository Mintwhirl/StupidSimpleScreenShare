// Pusher authentication endpoint for Vercel
// Authenticates clients for private channels

import { parse as parseQueryString } from 'querystring';

import Pusher from 'pusher';

export const config = {
  runtime: 'nodejs',
};

export default async function handler(req, res) {
  // Set headers
  res.setHeader('Content-Type', 'application/json');
  res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');

  // Only allow POST requests
  if (req.method !== 'POST') {
    console.log('Pusher auth: Method not allowed -', req.method);
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }

  try {
    let socketId;
    let channelName;

    // Parse body based on content type
    const contentType = req.headers['content-type'] || '';

    console.log('Pusher auth request:', {
      method: req.method,
      contentType,
    });

    if (contentType.includes('application/x-www-form-urlencoded')) {
      // Parse form-encoded data
      const body = await new Promise((resolve, reject) => {
        let data = '';
        req.on('data', (chunk) => {
          data += chunk;
        });
        req.on('end', () => resolve(data));
        req.on('error', reject);
      });

      const parsed = parseQueryString(body);
      socketId = parsed.socket_id;
      channelName = parsed.channel_name;
    } else if (contentType.includes('application/json')) {
      // Parse JSON data
      const body = await new Promise((resolve, reject) => {
        let data = '';
        req.on('data', (chunk) => {
          data += chunk;
        });
        req.on('end', () => resolve(data));
        req.on('error', reject);
      });

      const parsed = JSON.parse(body);
      socketId = parsed.socket_id;
      channelName = parsed.channel_name;
    } else {
      console.log('Pusher auth: Unsupported content type:', contentType);
      res.status(400).json({ error: 'Unsupported content type' });
      return;
    }

    // Validate required fields
    if (!socketId || !channelName) {
      console.log('Pusher auth: Missing fields:', {
        hasSocketId: !!socketId,
        hasChannelName: !!channelName,
      });
      res.status(400).json({ error: 'Missing socket_id or channel_name' });
      return;
    }

    // Validate channel name starts with private-
    if (!channelName.startsWith('private-')) {
      console.log('Pusher auth: Invalid channel type:', channelName);
      res.status(400).json({ error: 'Invalid channel type' });
      return;
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
      res.status(500).json({ error: 'Server configuration error' });
      return;
    }

    console.log('Pusher auth request:', {
      channel: channelName,
      socketId: `${socketId.substring(0, 8)}...`,
      channelType: 'private',
    });

    // Create Pusher instance
    const pusher = new Pusher({
      appId: pusherAppId,
      key: pusherKey,
      secret: pusherSecret,
      useTLS: true,
      cluster: process.env.PUSHER_CLUSTER,
    });

    // Authorize the channel
    const auth = pusher.authorizeChannel(socketId, channelName);

    console.log('Pusher auth success:', { channel: channelName });

    // Return auth response
    res.status(200).json(auth);
  } catch (error) {
    console.error('Pusher auth error:', error.message);
    console.error(error.stack);
    res.status(400).json({ error: 'Authentication failed' });
  }
}
