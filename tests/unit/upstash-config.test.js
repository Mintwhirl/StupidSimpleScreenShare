import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';

const redisConstructor = vi.fn((config) => {
  const instance = {
    config,
    get: vi.fn().mockResolvedValue(null),
    set: vi.fn().mockResolvedValue('OK'),
    del: vi.fn().mockResolvedValue(1),
    expire: vi.fn().mockResolvedValue(1),
    multi: vi.fn(() => {
      const commands = [];
      const chain = {
        get: (key) => {
          commands.push(['get', key]);
          return chain;
        },
        set: (key, value) => {
          commands.push(['set', key, value]);
          return chain;
        },
        expire: (key, ttl) => {
          commands.push(['expire', key, ttl]);
          return chain;
        },
        rpush: (key, value) => {
          commands.push(['rpush', key, value]);
          return chain;
        },
        lrange: (key, start, stop) => {
          commands.push(['lrange', key, start, stop]);
          return chain;
        },
        del: (key) => {
          commands.push(['del', key]);
          return chain;
        },
        exec: vi.fn(async () => commands.map(() => null)),
      };
      return chain;
    }),
  };
  return instance;
});

const ratelimitConstructor = vi.fn((config = {}) => {
  const limitValue = config?.limiter?.limit ?? 100;
  const limiter = {
    config,
    limit: vi.fn().mockResolvedValue({
      success: true,
      limit: limitValue,
      remaining: limitValue,
      reset: Date.now() + 60000,
    }),
  };
  return limiter;
});
ratelimitConstructor.slidingWindow = (limit, window) => ({ limit, window });

vi.mock('@upstash/redis', () => ({ Redis: redisConstructor }));
vi.mock('@upstash/ratelimit', () => ({ Ratelimit: ratelimitConstructor }));

describe('Upstash configuration utilities', () => {
  const originalEnv = { ...process.env };

  beforeEach(() => {
    vi.resetModules();
    redisConstructor.mockClear();
    ratelimitConstructor.mockClear();
  });

  afterEach(() => {
    Object.keys(process.env).forEach((key) => {
      if (!(key in originalEnv)) {
        delete process.env[key];
      }
    });
    Object.assign(process.env, originalEnv);
  });

  it('memoizes the Redis client across calls when credentials are present', async () => {
    process.env.UPSTASH_REDIS_REST_URL = 'https://example.upstash.io';
    process.env.UPSTASH_REDIS_REST_TOKEN = 'token';
    process.env.ENABLE_DEV_REDIS_FALLBACK = 'false';

    const { createRedisClient, __resetUpstashStateForTests } = await import('../../api/_utils.js');
    __resetUpstashStateForTests();

    const clientA = createRedisClient();
    const clientB = createRedisClient();

    expect(clientA).toBe(clientB);
    expect(redisConstructor).toHaveBeenCalledTimes(1);
  });

  it('reuses cached rate limiters without spawning extra redis connections', async () => {
    process.env.UPSTASH_REDIS_REST_URL = 'https://example.upstash.io';
    process.env.UPSTASH_REDIS_REST_TOKEN = 'token';
    process.env.ENABLE_DEV_REDIS_FALLBACK = 'false';

    const { getApiRateLimit, __resetUpstashStateForTests } = await import('../../api/_utils.js');
    __resetUpstashStateForTests();

    const limiterA = getApiRateLimit();
    const limiterB = getApiRateLimit();

    expect(limiterA).toBe(limiterB);
    expect(ratelimitConstructor).toHaveBeenCalledTimes(1);
  });

  it('surfaces actionable errors when credentials are missing and fallback is disabled', async () => {
    delete process.env.UPSTASH_REDIS_REST_URL;
    delete process.env.UPSTASH_REDIS_REST_TOKEN;
    process.env.ENABLE_DEV_REDIS_FALLBACK = 'false';

    const { createRedisClient, __resetUpstashStateForTests } = await import('../../api/_utils.js');
    __resetUpstashStateForTests();

    expect(() => createRedisClient()).toThrow(/Missing required Upstash Redis environment variables/);
  });

  it('provides an in-memory fallback for development when enabled', async () => {
    delete process.env.UPSTASH_REDIS_REST_URL;
    delete process.env.UPSTASH_REDIS_REST_TOKEN;
    process.env.ENABLE_DEV_REDIS_FALLBACK = 'true';

    const { createRedisClient, getRoomCreationRateLimit, __resetUpstashStateForTests } = await import(
      '../../api/_utils.js'
    );
    __resetUpstashStateForTests();

    const redis = createRedisClient();
    await redis.set('foo', 'bar');
    const value = await redis.get('foo');
    expect(value).toBe('bar');
    expect(redisConstructor).not.toHaveBeenCalled();

    const limiter = getRoomCreationRateLimit();
    let lastResult = null;
    for (let i = 0; i < 50; i += 1) {
      // eslint-disable-next-line no-await-in-loop
      lastResult = await limiter.limit('test');
      expect(lastResult.success).toBe(true);
    }
    lastResult = await limiter.limit('test');
    expect(lastResult.success).toBe(false);
    expect(lastResult.remaining).toBe(0);
    expect(ratelimitConstructor).not.toHaveBeenCalled();
  });

  it('disables rate limiting when the feature flag is set without instantiating Upstash clients', async () => {
    process.env.UPSTASH_REDIS_REST_URL = 'https://example.upstash.io';
    process.env.UPSTASH_REDIS_REST_TOKEN = 'token';
    process.env.ENABLE_DEV_REDIS_FALLBACK = 'false';
    process.env.DISABLE_RATE_LIMITING = 'true';

    const { getApiRateLimit, __resetUpstashStateForTests } = await import('../../api/_utils.js');
    __resetUpstashStateForTests();

    const limiter = getApiRateLimit();
    const result = await limiter.limit('any');

    expect(result.success).toBe(true);
    expect(ratelimitConstructor).not.toHaveBeenCalled();
  });
});
