import { beforeEach, describe, expect, it, vi } from 'vitest';

const ROOM_ID = 'abc123def456789012345678';
const HOST_HEADERS = {
  'x-forwarded-for': '1.1.1.1',
  'user-agent': 'host-agent',
  'accept-language': 'en-US',
};
const VIEWER_HEADERS = {
  'x-forwarded-for': '2.2.2.2',
  'user-agent': 'viewer-agent',
  'accept-language': 'en-US',
};

function createMockResponse() {
  return {
    status: vi.fn().mockReturnThis(),
    json: vi.fn().mockReturnThis(),
    setHeader: vi.fn(),
    end: vi.fn(),
  };
}

function createMockRedis() {
  const store = new Map();

  const execute = (cmd, args) => {
    switch (cmd) {
      case 'get':
        return store.has(args[0]) ? store.get(args[0]) : null;
      case 'set':
        store.set(args[0], args[1]);
        return 'OK';
      case 'expire':
        return 1;
      case 'rpush': {
        const existing = store.get(args[0]);
        const list = Array.isArray(existing) ? existing.slice() : [];
        list.push(args[1]);
        store.set(args[0], list);
        return list.length;
      }
      case 'lrange': {
        const existing = store.get(args[0]);
        if (!Array.isArray(existing)) {
          return [];
        }
        const endIndex = args[2] === -1 ? existing.length : args[2] + 1;
        return existing.slice(args[1], endIndex);
      }
      case 'del':
        return store.delete(args[0]) ? 1 : 0;
      default:
        return null;
    }
  };

  const redis = {
    store,
    get: vi.fn(async (key) => execute('get', [key])),
    set: vi.fn(async (key, value) => execute('set', [key, value])),
    expire: vi.fn(async (key, ttl) => execute('expire', [key, ttl])),
    del: vi.fn(async (key) => execute('del', [key])),
    rpush: vi.fn(async (key, value) => execute('rpush', [key, value])),
    lrange: vi.fn(async (key, start, stop) => execute('lrange', [key, start, stop])),
    multi: vi.fn(() => {
      const ops = [];
      const chain = {
        get(key) {
          ops.push(['get', key]);
          return chain;
        },
        set(key, value) {
          ops.push(['set', key, value]);
          return chain;
        },
        expire(key, ttl) {
          ops.push(['expire', key, ttl]);
          return chain;
        },
        rpush(key, value) {
          ops.push(['rpush', key, value]);
          return chain;
        },
        lrange(key, start, stop) {
          ops.push(['lrange', key, start, stop]);
          return chain;
        },
        del(key) {
          ops.push(['del', key]);
          return chain;
        },
        exec: vi.fn(async () => ops.map(([cmd, ...args]) => execute(cmd, args))),
      };
      return chain;
    }),
  };

  return redis;
}

let currentRedis;

async function loadHandlers() {
  vi.resetModules();

  vi.doMock('../../api/_utils.js', async () => {
    const actual = await vi.importActual('../../api/_utils.js');
    return {
      ...actual,
      createRedisClient: vi.fn(() => currentRedis),
      checkRateLimit: vi.fn(async (_ratelimit, _identifier, res) => {
        if (res?.setHeader) {
          const now = Date.now().toString();
          res.setHeader('X-RateLimit-Limit', '999');
          res.setHeader('X-RateLimit-Remaining', '998');
          res.setHeader('X-RateLimit-Reset', now);
        }
        return null;
      }),
      getSignalingRateLimit: vi.fn(() => ({
        limit: vi.fn(async () => ({ success: true, limit: 999, reset: Date.now(), remaining: 998 })),
      })),
      getCandidateRateLimit: vi.fn(() => ({
        limit: vi.fn(async () => ({ success: true, limit: 999, reset: Date.now(), remaining: 998 })),
      })),
    };
  });

  vi.doMock('crypto', async () => {
    const actual = await vi.importActual('crypto');
    return {
      ...actual,
      randomBytes: vi.fn((size) => Buffer.from('a'.repeat(size))),
    };
  });

  const registerSenderHandler = (await import('../../api/register-sender.js')).default;
  const offerHandler = (await import('../../api/offer.js')).default;
  const answerHandler = (await import('../../api/answer.js')).default;
  const candidateHandler = (await import('../../api/candidate.js')).default;

  vi.doUnmock('../../api/_utils.js');
  vi.doUnmock('crypto');

  return { registerSenderHandler, offerHandler, answerHandler, candidateHandler };
}

function createRequest({ method = 'POST', headers = {}, body = {}, query = {} } = {}) {
  return { method, headers, body, query };
}

describe('Sender authentication integration flow', () => {
  let handlers;

  beforeEach(async () => {
    currentRedis = createMockRedis();
    currentRedis.store.set(`room:${ROOM_ID}:meta`, JSON.stringify({ createdAt: Date.now() }));
    handlers = await loadHandlers();
  });

  it('allows host to register and send offer with matching secret and client', async () => {
    const registerRes = createMockResponse();
    const registerReq = createRequest({
      headers: HOST_HEADERS,
      body: { roomId: ROOM_ID, senderId: 'host' },
    });

    await handlers.registerSenderHandler(registerReq, registerRes);
    const hostSecret = registerRes.json.mock.calls[0][0].secret;

    expect(hostSecret).toMatch(/^[a-f0-9]{32}$/);

    const offerRes = createMockResponse();
    const offerReq = createRequest({
      headers: { ...HOST_HEADERS, 'x-sender-secret': hostSecret },
      body: {
        roomId: ROOM_ID,
        role: 'host',
        desc: { type: 'offer', sdp: 'test-offer' },
      },
    });

    await handlers.offerHandler(offerReq, offerRes);

    expect(offerRes.json).toHaveBeenCalledWith({ ok: true });
  });

  it('returns 403 when host secret is invalid', async () => {
    const registerRes = createMockResponse();
    const registerReq = createRequest({
      headers: HOST_HEADERS,
      body: { roomId: ROOM_ID, senderId: 'host' },
    });

    await handlers.registerSenderHandler(registerReq, registerRes);

    const offerRes = createMockResponse();
    const offerReq = createRequest({
      headers: { ...HOST_HEADERS, 'x-sender-secret': 'invalid-secret' },
      body: {
        roomId: ROOM_ID,
        role: 'host',
        desc: { type: 'offer', sdp: 'test-offer' },
      },
    });

    await handlers.offerHandler(offerReq, offerRes);

    expect(offerRes.status).toHaveBeenCalledWith(403);
    expect(offerRes.json).toHaveBeenCalledWith({
      error: 'Invalid sender secret',
      timestamp: expect.any(String),
    });
  });

  it('allows viewer to register and send answer and candidate with viewerId', async () => {
    const registerRes = createMockResponse();
    const registerReq = createRequest({
      headers: VIEWER_HEADERS,
      body: { roomId: ROOM_ID, senderId: 'viewer123' },
    });

    await handlers.registerSenderHandler(registerReq, registerRes);
    const viewerSecret = registerRes.json.mock.calls[0][0].secret;

    const answerRes = createMockResponse();
    const answerReq = createRequest({
      headers: { ...VIEWER_HEADERS, 'x-sender-secret': viewerSecret },
      body: {
        roomId: ROOM_ID,
        role: 'viewer',
        viewerId: 'viewer123',
        desc: { type: 'answer', sdp: 'answer-sdp' },
      },
    });

    await handlers.answerHandler(answerReq, answerRes);
    expect(answerRes.json).toHaveBeenCalledWith({ ok: true });

    const candidateRes = createMockResponse();
    const candidateReq = createRequest({
      headers: { ...VIEWER_HEADERS, 'x-sender-secret': viewerSecret },
      body: {
        roomId: ROOM_ID,
        role: 'viewer',
        viewerId: 'viewer123',
        candidate: {
          candidate: 'candidate-data',
          sdpMid: '0',
          sdpMLineIndex: 0,
        },
      },
    });

    await handlers.candidateHandler(candidateReq, candidateRes);
    expect(candidateRes.json).toHaveBeenCalledWith({ ok: true });

    const candidateKey = `room:${ROOM_ID}:viewer:viewer123:candidates`;
    expect(currentRedis.store.get(candidateKey)).toEqual([
      JSON.stringify({ candidate: 'candidate-data', sdpMid: '0', sdpMLineIndex: 0 }),
    ]);
  });

  it('returns 400 when viewerId is missing for viewer candidate submissions', async () => {
    const registerRes = createMockResponse();
    const registerReq = createRequest({
      headers: VIEWER_HEADERS,
      body: { roomId: ROOM_ID, senderId: 'viewer123' },
    });
    await handlers.registerSenderHandler(registerReq, registerRes);
    const viewerSecret = registerRes.json.mock.calls[0][0].secret;

    const candidateRes = createMockResponse();
    const candidateReq = createRequest({
      headers: { ...VIEWER_HEADERS, 'x-sender-secret': viewerSecret },
      body: {
        roomId: ROOM_ID,
        role: 'viewer',
        candidate: {
          candidate: 'candidate-data',
          sdpMid: '0',
          sdpMLineIndex: 0,
        },
      },
    });

    await handlers.candidateHandler(candidateReq, candidateRes);

    expect(candidateRes.status).toHaveBeenCalledWith(400);
    expect(candidateRes.json).toHaveBeenCalledWith({
      error: 'Missing or invalid viewerId',
      timestamp: expect.any(String),
    });
  });

  it('returns 403 when viewer secret is reused from a different client', async () => {
    const registerRes = createMockResponse();
    const registerReq = createRequest({
      headers: VIEWER_HEADERS,
      body: { roomId: ROOM_ID, senderId: 'viewer123' },
    });

    await handlers.registerSenderHandler(registerReq, registerRes);
    const viewerSecret = registerRes.json.mock.calls[0][0].secret;

    const answerRes = createMockResponse();
    const answerReq = createRequest({
      headers: {
        ...VIEWER_HEADERS,
        'user-agent': 'viewer-agent-2',
        'x-sender-secret': viewerSecret,
      },
      body: {
        roomId: ROOM_ID,
        role: 'viewer',
        viewerId: 'viewer123',
        desc: { type: 'answer', sdp: 'answer-sdp' },
      },
    });

    await handlers.answerHandler(answerReq, answerRes);

    expect(answerRes.status).toHaveBeenCalledWith(403);
    expect(answerRes.json).toHaveBeenCalledWith({
      error: 'Invalid sender secret',
      timestamp: expect.any(String),
    });
  });
});
