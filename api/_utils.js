import { Ratelimit } from '@upstash/ratelimit';
import { Redis } from '@upstash/redis';

import { validateSenderSecret as validateSenderSecretFromShared } from '../shared/signaling/auth.js';
import {
  getRoomMetaKey,
  getOfferKey,
  getAnswerKey,
  getDescriptorKey,
  getCandidateKey,
  getSenderKey,
  getChatKey,
  resolveSenderId,
} from '../shared/signaling/keys.js';

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
let _signalingRateLimit = null;
let _candidateRateLimit = null;

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

// Rate limiter for signaling endpoints (offer/answer) - 100 per minute per IP
export function getSignalingRateLimit() {
  if (!_signalingRateLimit) {
    const redis = createRedisClient();
    _signalingRateLimit = new Ratelimit({
      redis,
      limiter: Ratelimit.slidingWindow(100, '1 m'),
      analytics: true,
      prefix: '@upstash/ratelimit/signaling',
    });
  }
  return _signalingRateLimit;
}

// Rate limiter for ICE candidates - 500 per minute per IP (more lenient)
export function getCandidateRateLimit() {
  if (!_candidateRateLimit) {
    const redis = createRedisClient();
    _candidateRateLimit = new Ratelimit({
      redis,
      limiter: Ratelimit.slidingWindow(500, '1 m'),
      analytics: true,
      prefix: '@upstash/ratelimit/candidates',
    });
  }
  return _candidateRateLimit;
}

// CORS headers helper
export function setCorsHeaders(req, res) {
  const requestOrigin = req.headers.origin;

  // Allow all Vercel preview deployments + production + localhost (dev/testing)
  const allowedOrigins = [
    'https://stupid-simple-screen-share.vercel.app', // Production
    /^https:\/\/stupid-simple-screen-share-[a-z0-9]+\.vercel\.app$/, // Preview deployments
    'http://localhost:5173', // Vite dev
    'http://localhost:3000', // Alternative dev
  ];

  const isAllowed = allowedOrigins.some((origin) => {
    if (typeof origin === 'string') return origin === requestOrigin;
    return origin.test(requestOrigin);
  });

  const origin = isAllowed ? requestOrigin : 'https://stupid-simple-screen-share.vercel.app';

  res.setHeader('Access-Control-Allow-Origin', origin);
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type,x-auth-secret,x-sender-secret,Authorization');
  res.setHeader('Access-Control-Allow-Credentials', 'true');
}

// Security headers helper
export function setSecurityHeaders(res) {
  // Content Security Policy
  res.setHeader(
    'Content-Security-Policy',
    "default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; img-src 'self' data:; connect-src 'self'"
  );

  // Prevent MIME sniffing
  res.setHeader('X-Content-Type-Options', 'nosniff');

  // Prevent clickjacking
  res.setHeader('X-Frame-Options', 'DENY');

  // Force HTTPS (1 year)
  res.setHeader('Strict-Transport-Security', 'max-age=31536000; includeSubDomains');

  // Prevent XSS
  res.setHeader('X-XSS-Protection', '1; mode=block');

  // Referrer policy
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
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

// Get client IP address only (for testing and basic identification)
export function getClientIP(req) {
  if (!req) {
    return 'unknown';
  }

  // Try various headers for IP (Vercel/proxy compatible)
  const ip =
    req.headers?.['x-forwarded-for']?.split(',')[0]?.trim() ||
    req.headers?.['x-real-ip'] ||
    req.connection?.remoteAddress ||
    'unknown';

  return ip;
}

// Get client identifier (IP address with fingerprinting for production)
export function getClientIdentifier(req) {
  const ip = getClientIP(req);

  // Add additional fingerprinting to make spoofing harder
  const userAgent = req.headers['user-agent'] || 'unknown';
  const acceptLanguage = req.headers['accept-language'] || 'unknown';

  // Create a more robust identifier by combining multiple factors
  // This makes it much harder to spoof than just IP alone
  const fingerprint = `${ip}:${userAgent.substring(0, 50)}:${acceptLanguage.substring(0, 20)}`;

  return fingerprint;
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

// Extract sender secret from request (header or body)
export function extractSenderSecret(req) {
  // Try header first (more secure)
  const headerSecret = req.headers['x-sender-secret'];
  if (headerSecret) {
    return headerSecret;
  }

  // Fallback to body (for backward compatibility)
  const bodySecret = req.body?.senderSecret;
  if (bodySecret) {
    return bodySecret;
  }

  return null;
}

// Constants
export const TTL_ROOM = 60 * 30; // 30 minutes
export const TTL_HEARTBEAT = 30; // 30 seconds
export const MAX_MESSAGES = 50; // Max chat messages to keep

export const validateSenderSecret = validateSenderSecretFromShared;

export {
  getRoomMetaKey,
  getOfferKey,
  getAnswerKey,
  getDescriptorKey,
  getCandidateKey,
  getSenderKey,
  getChatKey,
  resolveSenderId,
};
