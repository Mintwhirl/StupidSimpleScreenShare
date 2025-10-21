import { getSenderKey } from './keys.js';

export async function validateSenderSecret(redis, roomId, senderId, providedSecret) {
  if (!roomId || !senderId || !providedSecret) {
    return { valid: false, error: 'Missing authentication parameters' };
  }

  try {
    const key = getSenderKey(roomId, senderId);
    const storedValue = await redis.get(key);

    if (!storedValue) {
      return { valid: false, error: 'Sender not registered in this room' };
    }

    let expectedSecret = storedValue;

    if (typeof storedValue === 'string') {
      try {
        const parsed = JSON.parse(storedValue);
        expectedSecret = parsed?.secret ?? storedValue;
      } catch (parseError) {
        expectedSecret = storedValue;
      }
    } else if (typeof storedValue === 'object' && storedValue !== null) {
      expectedSecret = storedValue.secret ?? storedValue;
    }

    if (expectedSecret !== providedSecret) {
      return { valid: false, error: 'Invalid sender secret' };
    }

    return { valid: true };
  } catch (error) {
    console.error('Error validating sender secret:', error);
    return { valid: false, error: 'Authentication validation failed' };
  }
}

export default {
  validateSenderSecret,
};
