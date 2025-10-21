import { Ratelimit } from '@upstash/ratelimit';
import { Redis } from '@upstash/redis';

const RATE_LIMIT_CONFIG = {
  roomCreation: { limit: 50, window: '1 h', prefix: '@upstash/ratelimit/room-creation' },
  chat: { limit: 60, window: '1 m', prefix: '@upstash/ratelimit/chat' },
  api: { limit: 2000, window: '1 m', prefix: '@upstash/ratelimit/api' },
  signaling: { limit: 100, window: '1 m', prefix: '@upstash/ratelimit/signaling' },
  candidates: { limit: 500, window: '1 m', prefix: '@upstash/ratelimit/candidates' },
};

const globalUpstashState =
  globalThis.__STUPID_SIMPLE_UPSTASH__ ||
  (globalThis.__STUPID_SIMPLE_UPSTASH__ = {
    redis: null,
    fallbackRedis: null,
    rateLimiters: new Map(),
    validated: false,
    useFallbackRedis: false,
    rateLimitingDisabled: false,
    redisConfig: null,
    warningLogged: false,
  });

function getUpstashState() {
  return globalThis.__STUPID_SIMPLE_UPSTASH__ || globalUpstashState;
}

function parseWindowToMs(windowValue) {
  if (typeof windowValue === 'number') return windowValue;
  if (typeof windowValue !== 'string') return 60000;

  const trimmed = windowValue.trim();
  const match = trimmed.match(/^(\d+(?:\.\d+)?)\s*(ms|s|m|h|d)?$/i);
  if (!match) return 60000;

  const value = Number(match[1]);
  const unit = (match[2] || 'ms').toLowerCase();
  const multipliers = {
    ms: 1,
    s: 1000,
    m: 60 * 1000,
    h: 60 * 60 * 1000,
    d: 24 * 60 * 60 * 1000,
  };

  return value * (multipliers[unit] || 1);
}

function getFallbackFlag() {
  const flag = process.env.ENABLE_DEV_REDIS_FALLBACK;
  if (flag === 'false') return false;
  if (flag === '0') return false;
  if (flag === 'true' || flag === '1') return true;
  return process.env.NODE_ENV === 'test';
}

function createInMemoryRedis() {
  const kv = new Map();
  const sets = new Map();
  const sortedSets = new Map();
  const lists = new Map();
  const expirations = new Map();

  const purgeIfExpired = (key) => {
    const expiresAt = expirations.get(key);
    if (expiresAt && expiresAt <= Date.now()) {
      kv.delete(key);
      sets.delete(key);
      sortedSets.delete(key);
      lists.delete(key);
      expirations.delete(key);
      return true;
    }
    return false;
  };

  const hasKey = (key) => {
    purgeIfExpired(key);
    return kv.has(key) || sets.has(key) || sortedSets.has(key) || lists.has(key);
  };

  const redis = {
    async get(key) {
      if (purgeIfExpired(key)) return null;
      return kv.has(key) ? kv.get(key) : null;
    },
    async set(key, value) {
      kv.set(key, value);
      sets.delete(key);
      sortedSets.delete(key);
      lists.delete(key);
      expirations.delete(key);
      return 'OK';
    },
    async del(key) {
      const existed = hasKey(key);
      kv.delete(key);
      sets.delete(key);
      sortedSets.delete(key);
      lists.delete(key);
      expirations.delete(key);
      return existed ? 1 : 0;
    },
    async expire(key, ttlSeconds) {
      if (!hasKey(key)) return 0;
      expirations.set(key, Date.now() + ttlSeconds * 1000);
      return 1;
    },
    async ping() {
      return 'PONG';
    },
    async sadd(key, member) {
      purgeIfExpired(key);
      const set = sets.get(key) || new Set();
      const sizeBefore = set.size;
      set.add(member);
      sets.set(key, set);
      kv.delete(key);
      sortedSets.delete(key);
      lists.delete(key);
      return set.size - sizeBefore;
    },
    async smembers(key) {
      if (purgeIfExpired(key)) return [];
      const set = sets.get(key);
      return set ? Array.from(set) : [];
    },
    async rpush(key, value) {
      purgeIfExpired(key);
      const list = lists.get(key) || [];
      list.push(value);
      lists.set(key, list);
      kv.delete(key);
      sortedSets.delete(key);
      return list.length;
    },
    async lrange(key, start, stop) {
      if (purgeIfExpired(key)) return [];
      const list = lists.get(key) || [];
      const startIndex = start < 0 ? Math.max(list.length + start, 0) : start;
      const endIndex = stop < 0 ? list.length + stop : stop;
      return list.slice(startIndex, endIndex + 1);
    },
    async zadd(key, { score, member }) {
      purgeIfExpired(key);
      const entries = sortedSets.get(key) || [];
      const filtered = entries.filter((entry) => entry.member !== member);
      filtered.push({ score, member, addedAt: Date.now() });
      filtered.sort((a, b) => {
        if (a.score === b.score) return a.addedAt - b.addedAt;
        return a.score - b.score;
      });
      sortedSets.set(key, filtered);
      kv.delete(key);
      sets.delete(key);
      lists.delete(key);
      return filtered.length;
    },
    async zrange(key, start, stop) {
      if (purgeIfExpired(key)) return [];
      const entries = sortedSets.get(key) || [];
      const members = entries.map((entry) => entry.member);
      const startIndex = start < 0 ? Math.max(members.length + start, 0) : start;
      const endIndex = stop < 0 ? members.length + stop : stop;
      return members.slice(startIndex, endIndex + 1);
    },
    async zremrangebyrank(key, start, stop) {
      if (purgeIfExpired(key)) return 0;
      const entries = sortedSets.get(key);
      if (!entries) return 0;
      const startIndex = start < 0 ? Math.max(entries.length + start, 0) : start;
      const endIndex = stop < 0 ? entries.length + stop : stop;
      if (startIndex > endIndex) return 0;
      const removed = entries.splice(startIndex, endIndex - startIndex + 1);
      sortedSets.set(key, entries);
      return removed.length;
    },
    multi() {
      const commands = [];
      const chain = {
        get: (key) => {
          commands.push(() => redis.get(key));
          return chain;
        },
        set: (key, value) => {
          commands.push(() => redis.set(key, value));
          return chain;
        },
        expire: (key, ttl) => {
          commands.push(() => redis.expire(key, ttl));
          return chain;
        },
        rpush: (key, value) => {
          commands.push(() => redis.rpush(key, value));
          return chain;
        },
        lrange: (key, start, stop) => {
          commands.push(() => redis.lrange(key, start, stop));
          return chain;
        },
        del: (key) => {
          commands.push(() => redis.del(key));
          return chain;
        },
        exec: async () => {
          const results = [];
          for (const command of commands) {
            // eslint-disable-next-line no-await-in-loop
            results.push(await command());
          }
          return results;
        },
      };

      return chain;
    },
  };

  return redis;
}

function createInMemoryRateLimiter(config) {
  const maxRequests = config.limit;
  const windowMs = parseWindowToMs(config.window);
  const entries = new Map();

  return {
    async limit(identifier) {
      const key = identifier ?? 'anonymous';
      const now = Date.now();
      const current = entries.get(key) || {
        remaining: maxRequests,
        reset: now + windowMs,
      };

      if (current.reset <= now) {
        current.remaining = maxRequests;
        current.reset = now + windowMs;
      }

      if (current.remaining <= 0) {
        entries.set(key, current);
        return {
          success: false,
          limit: maxRequests,
          remaining: 0,
          reset: current.reset,
        };
      }

      current.remaining -= 1;
      entries.set(key, current);

      return {
        success: true,
        limit: maxRequests,
        remaining: current.remaining,
        reset: current.reset,
      };
    },
  };
}

function createNoopRateLimiter(config) {
  const maxRequests = config.limit;
  const windowMs = parseWindowToMs(config.window);

  return {
    async limit() {
      return {
        success: true,
        limit: maxRequests,
        remaining: maxRequests,
        reset: Date.now() + windowMs,
      };
    },
  };
}

function ensureRedisConfiguration() {
  const state = getUpstashState();
  if (state.validated) return state;

  const url = process.env.UPSTASH_REDIS_REST_URL?.trim();
  const token = process.env.UPSTASH_REDIS_REST_TOKEN?.trim();
  const fallbackEnabled = getFallbackFlag();
  const rateLimitingDisabled = ['true', '1'].includes(process.env.DISABLE_RATE_LIMITING);

  state.rateLimitingDisabled = rateLimitingDisabled;

  if (!url || !token) {
    if (fallbackEnabled) {
      state.useFallbackRedis = true;
      if (!state.warningLogged && process.env.NODE_ENV !== 'test') {
        console.warn(
          'Upstash Redis credentials were not provided. Using in-memory Redis fallback. Do not enable ENABLE_DEV_REDIS_FALLBACK in production.'
        );
      }
      state.warningLogged = true;
      state.validated = true;
      return state;
    }

    const missingVars = [!url ? 'UPSTASH_REDIS_REST_URL' : null, !token ? 'UPSTASH_REDIS_REST_TOKEN' : null].filter(
      Boolean
    );

    throw new Error(
      `Missing required Upstash Redis environment variables: ${missingVars.join(
        ' and '
      )}. Provide valid credentials or enable local development fallback by setting ENABLE_DEV_REDIS_FALLBACK=true. To bypass rate limiting entirely (not recommended), set DISABLE_RATE_LIMITING=true.`
    );
  }

  state.redisConfig = { url, token };
  state.validated = true;
  state.useFallbackRedis = false;
  return state;
}

// Initialize Redis connection with validation
export function createRedisClient() {
  const state = ensureRedisConfiguration();

  if (state.useFallbackRedis) {
    if (!state.fallbackRedis) {
      state.fallbackRedis = createInMemoryRedis();
    }
    return state.fallbackRedis;
  }

  if (!state.redis) {
    state.redis = new Redis(state.redisConfig);
  }

  return state.redis;
}

function getCachedRateLimiter(key, config) {
  const state = ensureRedisConfiguration();
  if (state.rateLimiters.has(key)) {
    return state.rateLimiters.get(key);
  }

  let limiter;

  if (state.rateLimitingDisabled) {
    limiter = createNoopRateLimiter(config);
  } else if (state.useFallbackRedis) {
    limiter = createInMemoryRateLimiter(config);
  } else {
    limiter = new Ratelimit({
      redis: createRedisClient(),
      limiter: Ratelimit.slidingWindow(config.limit, config.window),
      analytics: true,
      prefix: config.prefix,
    });
  }

  state.rateLimiters.set(key, limiter);
  return limiter;
}

// Rate limiter for room creation (50 per hour per IP - more generous for testing)
export function getRoomCreationRateLimit() {
  return getCachedRateLimiter('roomCreation', RATE_LIMIT_CONFIG.roomCreation);
}

// Rate limiter for chat messages (60 per minute per room+user)
export function getChatRateLimit() {
  return getCachedRateLimiter('chat', RATE_LIMIT_CONFIG.chat);
}

// Rate limiter for API calls (2000 per minute per IP - very generous for testing)
export function getApiRateLimit() {
  return getCachedRateLimiter('api', RATE_LIMIT_CONFIG.api);
}

// Rate limiter for signaling endpoints (offer/answer) - 100 per minute per IP
export function getSignalingRateLimit() {
  return getCachedRateLimiter('signaling', RATE_LIMIT_CONFIG.signaling);
}

// Rate limiter for ICE candidates - 500 per minute per IP (more lenient)
export function getCandidateRateLimit() {
  return getCachedRateLimiter('candidates', RATE_LIMIT_CONFIG.candidates);
}

export function __resetUpstashStateForTests() {
  if (process.env.NODE_ENV !== 'test') return;
  const state = getUpstashState();
  state.redis = null;
  state.fallbackRedis = null;
  state.rateLimiters = new Map();
  state.validated = false;
  state.useFallbackRedis = false;
  state.rateLimitingDisabled = false;
  state.redisConfig = null;
  state.warningLogged = false;
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

function getConnectSrcDirectives() {
  const directives = new Set([
    "'self'",
    'https://stupid-simple-screen-share.vercel.app',
    'https://*.vercel.app',
    'http://localhost:5173',
    'http://localhost:3000',
    'http://127.0.0.1:5173',
    'http://127.0.0.1:3000',
    'stun:',
    'stuns:',
    'turn:',
    'turns:',
  ]);

  const vercelUrl = process.env.VERCEL_URL?.trim();
  if (vercelUrl) directives.add(`https://${vercelUrl}`);

  const branchUrl = process.env.VERCEL_BRANCH_URL?.trim();
  if (branchUrl) directives.add(`https://${branchUrl}`);

  const previewDeployment = process.env.NEXT_PUBLIC_VERCEL_URL?.trim();
  if (previewDeployment) directives.add(`https://${previewDeployment}`);

  return Array.from(directives);
}

// Security headers helper
export function setSecurityHeaders(res) {
  // Content Security Policy
  const connectSrc = getConnectSrcDirectives().join(' ');
  res.setHeader(
    'Content-Security-Policy',
    `default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; img-src 'self' data:; connect-src ${connectSrc}`
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

// Sender authentication utilities
export async function validateSenderSecret(redis, roomId, senderId, providedSecret) {
  if (!roomId || !senderId || !providedSecret) {
    return { valid: false, error: 'Missing authentication parameters' };
  }

  try {
    // Get the stored secret for this sender in this room
    const storedSecret = await redis.get(`room:${roomId}:sender:${senderId}`);

    if (!storedSecret) {
      return { valid: false, error: 'Sender not registered in this room' };
    }

    if (storedSecret !== providedSecret) {
      return { valid: false, error: 'Invalid sender secret' };
    }

    return { valid: true };
  } catch (error) {
    console.error('Error validating sender secret:', error);
    return { valid: false, error: 'Authentication validation failed' };
  }
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
