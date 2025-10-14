/**
 * Polling Utilities
 * Provides exponential backoff and timeout functionality for polling operations
 */

import { POLLING_INTERVALS } from '../constants';

/**
 * Create a polling function with exponential backoff
 * @param {Function} pollFn - The function to call for polling
 * @param {Object} options - Polling options
 * @param {number} options.initialInterval - Initial polling interval in ms
 * @param {number} options.maxInterval - Maximum polling interval in ms
 * @param {number} options.backoffFactor - Factor to multiply interval by on backoff
 * @param {number} options.maxPolls - Maximum number of polls before timeout
 * @param {number} options.backoffAfter - Number of polls before starting backoff
 * @returns {Function} - Polling function that returns a promise
 */
export function createExponentialBackoffPolling(pollFn, options = {}) {
  const {
    initialInterval = POLLING_INTERVALS.DEFAULT,
    maxInterval = 30000, // 30 seconds max
    backoffFactor = 1.5,
    maxPolls = 60,
    backoffAfter = 10,
  } = options;

  return async () => {
    let pollCount = 0;
    let currentInterval = initialInterval;

    const poll = async () => {
      pollCount++;

      // Check timeout
      if (pollCount > maxPolls) {
        throw new Error('Polling timeout reached');
      }

      // Execute the polling function
      const result = await pollFn();

      // If we get a result, return it
      if (result) {
        return result;
      }

      // If no result and we've hit the backoff threshold, increase interval
      if (pollCount > backoffAfter) {
        currentInterval = Math.min(currentInterval * backoffFactor, maxInterval);
      }

      // Schedule next poll
      return new Promise((resolve, reject) => {
        const timeoutId = setTimeout(async () => {
          try {
            const nextResult = await poll();
            resolve(nextResult);
          } catch (error) {
            reject(error);
          }
        }, currentInterval);

        // Store timeout ID for potential cleanup
        poll.timeoutId = timeoutId;
      });
    };

    return poll();
  };
}

/**
 * Create a simple polling function with timeout
 * @param {Function} pollFn - The function to call for polling
 * @param {Object} options - Polling options
 * @param {number} options.interval - Polling interval in ms
 * @param {number} options.maxPolls - Maximum number of polls before timeout
 * @returns {Function} - Polling function that returns a promise
 */
export function createSimplePolling(pollFn, options = {}) {
  const { interval = POLLING_INTERVALS.DEFAULT, maxPolls = 60 } = options;

  return async () => {
    let pollCount = 0;

    const poll = async () => {
      pollCount++;

      // Check timeout
      if (pollCount > maxPolls) {
        throw new Error('Polling timeout reached');
      }

      // Execute the polling function
      const result = await pollFn();

      // If we get a result, return it
      if (result) {
        return result;
      }

      // Schedule next poll
      return new Promise((resolve, reject) => {
        const timeoutId = setTimeout(async () => {
          try {
            const nextResult = await poll();
            resolve(nextResult);
          } catch (error) {
            reject(error);
          }
        }, interval);

        // Store timeout ID for potential cleanup
        poll.timeoutId = timeoutId;
      });
    };

    return poll();
  };
}

/**
 * Stop a polling function by clearing its timeout
 * @param {Function} pollFn - The polling function to stop
 */
export function stopPolling(pollFn) {
  if (pollFn.timeoutId) {
    clearTimeout(pollFn.timeoutId);
    pollFn.timeoutId = null;
  }
}
