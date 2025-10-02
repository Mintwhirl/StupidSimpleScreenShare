import { Redis } from "@upstash/redis";

// Initialize Redis connection with validation
export function createRedisClient() {
  const url = process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.UPSTASH_REDIS_REST_TOKEN;

  if (!url || !token) {
    throw new Error('Missing required environment variables: UPSTASH_REDIS_REST_URL and UPSTASH_REDIS_REST_TOKEN');
  }

  return new Redis({ url, token });
}

// CORS headers helper
export function setCorsHeaders(res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
}

// Input validation helpers
export function validateRoomId(roomId) {
  if (!roomId || typeof roomId !== 'string') {
    return { valid: false, error: 'Missing or invalid roomId' };
  }

  // Room IDs should be 24 hex characters (from randomBytes(12))
  if (!/^[a-f0-9]{24}$/i.test(roomId)) {
    return { valid: false, error: 'Invalid roomId format' };
  }

  return { valid: true };
}

export function validateRole(role) {
  if (!role || typeof role !== 'string') {
    return { valid: false, error: 'Missing or invalid role' };
  }

  if (!['host', 'viewer'].includes(role)) {
    return { valid: false, error: 'Role must be either "host" or "viewer"' };
  }

  return { valid: true };
}

export function validateViewerId(viewerId) {
  if (!viewerId || typeof viewerId !== 'string') {
    return { valid: false, error: 'Missing or invalid viewerId' };
  }

  // Viewer IDs should be reasonable length
  if (viewerId.length < 5 || viewerId.length > 50) {
    return { valid: false, error: 'ViewerId must be between 5 and 50 characters' };
  }

  // Alphanumeric and underscores only
  if (!/^[a-zA-Z0-9_]+$/.test(viewerId)) {
    return { valid: false, error: 'ViewerId must be alphanumeric with underscores' };
  }

  return { valid: true };
}

export function validateMessage(message) {
  if (!message || typeof message !== 'string') {
    return { valid: false, error: 'Missing or invalid message' };
  }

  if (message.length > 500) {
    return { valid: false, error: 'Message too long (max 500 characters)' };
  }

  if (message.trim().length === 0) {
    return { valid: false, error: 'Message cannot be empty' };
  }

  return { valid: true };
}

export function validateSender(sender) {
  if (!sender || typeof sender !== 'string') {
    return { valid: false, error: 'Missing or invalid sender' };
  }

  if (sender.length > 50) {
    return { valid: false, error: 'Sender name too long (max 50 characters)' };
  }

  if (sender.trim().length === 0) {
    return { valid: false, error: 'Sender name cannot be empty' };
  }

  return { valid: true };
}

// WebRTC descriptor validation
export function validateRTCDescriptor(desc) {
  if (!desc || typeof desc !== 'object') {
    return { valid: false, error: 'Missing or invalid descriptor' };
  }

  if (!desc.type || !['offer', 'answer'].includes(desc.type)) {
    return { valid: false, error: 'Invalid descriptor type (must be "offer" or "answer")' };
  }

  if (!desc.sdp || typeof desc.sdp !== 'string') {
    return { valid: false, error: 'Missing or invalid SDP' };
  }

  // Basic SDP format check
  if (desc.sdp.length > 100000) {
    return { valid: false, error: 'SDP too large' };
  }

  return { valid: true };
}

// ICE candidate validation
export function validateICECandidate(candidate) {
  if (!candidate || typeof candidate !== 'object') {
    return { valid: false, error: 'Missing or invalid candidate' };
  }

  // ICE candidates have specific required fields
  if (!candidate.candidate || typeof candidate.candidate !== 'string') {
    return { valid: false, error: 'Invalid candidate string' };
  }

  // Prevent excessively large candidates
  if (JSON.stringify(candidate).length > 5000) {
    return { valid: false, error: 'Candidate data too large' };
  }

  return { valid: true };
}

// Error response helper with proper logging
export function sendError(res, status, message, error = null) {
  if (error) {
    console.error(`API Error [${status}]: ${message}`, error);
  }

  return res.status(status).json({
    error: message,
    timestamp: new Date().toISOString()
  });
}

// Async error wrapper for handlers
export function asyncHandler(handler) {
  return async (req, res) => {
    try {
      await handler(req, res);
    } catch (error) {
      console.error('Unhandled error in API handler:', error);

      if (!res.headersSent) {
        sendError(res, 500, 'Internal server error', error);
      }
    }
  };
}

// Constants
export const TTL_ROOM = 60 * 30; // 30 minutes
export const TTL_HEARTBEAT = 30; // 30 seconds
export const MAX_MESSAGES = 50; // Max chat messages to keep
