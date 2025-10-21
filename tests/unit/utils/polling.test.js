import { describe, it, expect, vi, afterEach } from 'vitest';

import { createExponentialBackoffPolling } from '../../../src/utils/polling.js';

afterEach(() => {
  vi.useRealTimers();
  vi.restoreAllMocks();
});

describe('createExponentialBackoffPolling', () => {
  it('applies exponential backoff after the configured threshold', async () => {
    vi.useFakeTimers();
    const timeoutSpy = vi.spyOn(globalThis, 'setTimeout');
    const pollFn = vi.fn().mockResolvedValueOnce(null).mockResolvedValueOnce(null).mockResolvedValueOnce('success');

    const poll = createExponentialBackoffPolling(pollFn, {
      initialInterval: 100,
      backoffFactor: 2,
      backoffAfter: 1,
      maxInterval: 1000,
      maxPolls: 5,
    });

    const resultPromise = poll();

    // Initial call happens immediately
    expect(pollFn).toHaveBeenCalledTimes(1);

    await vi.advanceTimersByTimeAsync(100);
    expect(pollFn).toHaveBeenCalledTimes(2);

    await vi.advanceTimersByTimeAsync(200);
    expect(pollFn).toHaveBeenCalledTimes(3);
    await expect(resultPromise).resolves.toBe('success');

    expect(timeoutSpy).toHaveBeenNthCalledWith(1, expect.any(Function), 100);
    expect(timeoutSpy).toHaveBeenNthCalledWith(2, expect.any(Function), 200);
  });

  it('throws when the maximum number of polls is reached', async () => {
    vi.useFakeTimers();
    const pollFn = vi.fn().mockResolvedValue(null);

    const poll = createExponentialBackoffPolling(pollFn, {
      maxPolls: 0,
    });

    await expect(poll()).rejects.toThrow('Polling timeout reached');
    expect(pollFn).not.toHaveBeenCalled();
  });
});
