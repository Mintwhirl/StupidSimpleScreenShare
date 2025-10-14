/**
 * Client-side validation utilities
 * Shared validation logic between client and server
 */

/**
 * Validate room ID format
 * @param {string} roomId - Room ID to validate
 * @returns {object} Validation result
 */
export const validateRoomId = (roomId) => {
  if (!roomId || typeof roomId !== 'string') {
    return { valid: false, error: 'Room ID is required' };
  }

  const trimmed = roomId.trim();
  if (trimmed.length === 0) {
    return { valid: false, error: 'Room ID cannot be empty' };
  }

  // Check if it's a valid 24-character hex string
  const hexPattern = /^[a-f0-9]{24}$/i;
  if (!hexPattern.test(trimmed)) {
    return { valid: false, error: 'Room ID must be exactly 24 characters and contain only letters and numbers' };
  }

  return { valid: true };
};

/**
 * Validate viewer ID format
 * @param {string} viewerId - Viewer ID to validate
 * @returns {object} Validation result
 */
export const validateViewerId = (viewerId) => {
  if (!viewerId || typeof viewerId !== 'string') {
    return { valid: false, error: 'Viewer ID is required' };
  }

  const trimmed = viewerId.trim();
  if (trimmed.length === 0) {
    return { valid: false, error: 'Viewer ID cannot be empty' };
  }

  if (trimmed.length < 3) {
    return { valid: false, error: 'Viewer ID must be at least 3 characters long' };
  }

  if (trimmed.length > 50) {
    return { valid: false, error: 'Viewer ID must be 50 characters or less' };
  }

  // Allow alphanumeric characters, spaces, hyphens, and underscores
  const validPattern = /^[a-zA-Z0-9\s\-_]+$/;
  if (!validPattern.test(trimmed)) {
    return { valid: false, error: 'Viewer ID can only contain letters, numbers, spaces, hyphens, and underscores' };
  }

  return { valid: true };
};

/**
 * Validate chat message
 * @param {string} message - Message to validate
 * @returns {object} Validation result
 */
export const validateMessage = (message) => {
  if (!message || typeof message !== 'string') {
    return { valid: false, error: 'Message is required' };
  }

  const trimmed = message.trim();
  if (trimmed.length === 0) {
    return { valid: false, error: 'Message cannot be empty' };
  }

  if (trimmed.length > 500) {
    return { valid: false, error: 'Message must be 500 characters or less' };
  }

  return { valid: true };
};
