import { Ratelimit } from '@upstash/ratelimit';
import { Redis } from '@upstash/redis';

// Initialize Redis connection with validation
export function createRedisClient() {
  const url = process.env.UPSTASH_REDIS_REST_URL?.trim();
  const token = process.env.UPSTASH_REDIS_REST_TOKEN?.trim();

  // In test environment, use fallback values if not provided
  if (process.env.NODE_ENV === 'test') {
    const testUrl = url || 'http://localhost:6379';
    const testToken = token || 'test-token';
    return new Redis({ url: testUrl, token: testToken });
  }

  if (!url || !token) {
    throw new Error('Missing required environment variables: UPSTASH_REDIS_REST_URL and UPSTASH_REDIS_REST_TOKEN');
  }

  return new Redis({ url, token });
}

// Lazy-loaded rate limiters (initialized on first use)
let _roomCreationRateLimit = null;
let _chatRateLimit = null;
let _apiRateLimit = null;

// Rate limiter for room creation (50 per hour per IP - more generous for testing)
export function getRoomCreationRateLimit() {
  if (!_roomCreationRateLimit) {
    const redis = createRedisClient();
    _roomCreationRateLimit = new Ratelimit({
      redis,
      limiter: Ratelimit.slidingWindow(50, '1 h'),
      analytics: true,
      prefix: '@upstash/ratelimit/room-creation',
    });
  }
  return _roomCreationRateLimit;
}

// Rate limiter for chat messages (60 per minute per room+user)
export function getChatRateLimit() {
  if (!_chatRateLimit) {
    const redis = createRedisClient();
    _chatRateLimit = new Ratelimit({
      redis,
      limiter: Ratelimit.slidingWindow(60, '1 m'),
      analytics: true,
      prefix: '@upstash/ratelimit/chat',
    });
  }
  return _chatRateLimit;
}

// Rate limiter for API calls (2000 per minute per IP - very generous for testing)
export function getApiRateLimit() {
  if (!_apiRateLimit) {
    const redis = createRedisClient();
    _apiRateLimit = new Ratelimit({
      redis,
      limiter: Ratelimit.slidingWindow(2000, '1 m'),
      analytics: true,
      prefix: '@upstash/ratelimit/api',
    });
  }
  return _apiRateLimit;
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
    timestamp: new Date().toISOString(),
  });
}

// Rate limit helper
export async function checkRateLimit(ratelimit, identifier, res) {
  const { success, limit, reset, remaining } = await ratelimit.limit(identifier);

  // Add rate limit headers
  res.setHeader('X-RateLimit-Limit', limit.toString());
  res.setHeader('X-RateLimit-Remaining', remaining.toString());
  res.setHeader('X-RateLimit-Reset', reset.toString());

  if (!success) {
    const resetDate = new Date(reset);
    return sendError(res, 429, `Rate limit exceeded. Try again at ${resetDate.toISOString()}`);
  }

  return null; // No error
}

// Get client identifier (IP address)
export function getClientIdentifier(req) {
  // Try various headers for IP (Vercel/proxy compatible)
  return (
    req.headers['x-forwarded-for']?.split(',')[0] ||
    req.headers['x-real-ip'] ||
    req.connection?.remoteAddress ||
    'unknown'
  );
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
