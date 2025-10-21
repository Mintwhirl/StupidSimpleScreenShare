import { describe, it, expect, vi } from 'vitest';

import { validateSenderSecret } from '../../../shared/signaling/auth.js';
import { getSenderKey } from '../../../shared/signaling/keys.js';

describe('validateSenderSecret', () => {
  const roomId = 'room123';
  const senderId = 'host';
  const secret = 'secret-123';

  it('rejects when required parameters are missing', async () => {
    const redis = { get: vi.fn() };
    await expect(validateSenderSecret(redis, null, senderId, secret)).resolves.toEqual({
      valid: false,
      error: 'Missing authentication parameters',
    });
  });

  it('validates plain string secrets', async () => {
    const redis = { get: vi.fn().mockResolvedValue(secret) };
    const result = await validateSenderSecret(redis, roomId, senderId, secret);

    expect(result).toEqual({ valid: true });
    expect(redis.get).toHaveBeenCalledWith(getSenderKey(roomId, senderId));
  });

  it('parses JSON encoded secrets from Redis', async () => {
    const redis = {
      get: vi.fn().mockResolvedValue(JSON.stringify({ secret, clientId: 'client', registeredAt: 1234567890 })),
    };

    const result = await validateSenderSecret(redis, roomId, senderId, secret);
    expect(result).toEqual({ valid: true });
  });

  it('supports Upstash auto-parsed objects', async () => {
    const redis = { get: vi.fn().mockResolvedValue({ secret }) };
    const result = await validateSenderSecret(redis, roomId, senderId, secret);
    expect(result).toEqual({ valid: true });
  });

  it('fails when secrets do not match', async () => {
    const redis = { get: vi.fn().mockResolvedValue(JSON.stringify({ secret: 'other-secret' })) };
    const result = await validateSenderSecret(redis, roomId, senderId, secret);
    expect(result).toEqual({ valid: false, error: 'Invalid sender secret' });
  });

  it('handles Redis errors gracefully', async () => {
    const redis = { get: vi.fn().mockRejectedValue(new Error('boom')) };
    const result = await validateSenderSecret(redis, roomId, senderId, secret);
    expect(result).toEqual({ valid: false, error: 'Authentication validation failed' });
  });
});
