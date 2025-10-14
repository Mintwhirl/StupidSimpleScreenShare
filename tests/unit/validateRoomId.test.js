import { describe, it, expect } from 'vitest';

import { validateRoomId } from '../../api/_utils.js';

describe('validateRoomId', () => {
  describe('valid room IDs', () => {
    it('should accept valid 24-character hex room ID (lowercase)', () => {
      const validRoomId = 'a1b2c3d4e5f6789012345678';
      const result = validateRoomId(validRoomId);

      expect(result).toEqual({ valid: true });
    });

    it('should accept valid 24-character hex room ID (uppercase)', () => {
      const validRoomId = 'A1B2C3D4E5F6789012345678';
      const result = validateRoomId(validRoomId);

      expect(result).toEqual({ valid: true });
    });

    it('should accept valid 24-character hex room ID (mixed case)', () => {
      const validRoomId = 'a1B2c3D4e5F6789012345678';
      const result = validateRoomId(validRoomId);

      expect(result).toEqual({ valid: true });
    });

    it('should accept valid 24-character hex room ID (all numbers)', () => {
      const validRoomId = '123456789012345678901234';
      const result = validateRoomId(validRoomId);

      expect(result).toEqual({ valid: true });
    });

    it('should accept valid 24-character hex room ID (all letters)', () => {
      const validRoomId = 'abcdefabcdefabcdefabcdef';
      const result = validateRoomId(validRoomId);

      expect(result).toEqual({ valid: true });
    });
  });

  describe('invalid room IDs', () => {
    it('should reject null room ID', () => {
      const result = validateRoomId(null);

      expect(result).toEqual({
        valid: false,
        error: 'Missing or invalid roomId',
      });
    });

    it('should reject undefined room ID', () => {
      const result = validateRoomId(undefined);

      expect(result).toEqual({
        valid: false,
        error: 'Missing or invalid roomId',
      });
    });

    it('should reject empty string room ID', () => {
      const result = validateRoomId('');

      expect(result).toEqual({
        valid: false,
        error: 'Missing or invalid roomId',
      });
    });

    it('should reject non-string room ID (number)', () => {
      const result = validateRoomId(123456789012345678901234);

      expect(result).toEqual({
        valid: false,
        error: 'Missing or invalid roomId',
      });
    });

    it('should reject non-string room ID (object)', () => {
      const result = validateRoomId({ roomId: 'a1b2c3d4e5f6789012345678' });

      expect(result).toEqual({
        valid: false,
        error: 'Missing or invalid roomId',
      });
    });

    it('should reject non-string room ID (array)', () => {
      const result = validateRoomId(['a1b2c3d4e5f6789012345678']);

      expect(result).toEqual({
        valid: false,
        error: 'Missing or invalid roomId',
      });
    });

    it('should reject room ID that is too short', () => {
      const result = validateRoomId('a1b2c3d4e5f678901234567');

      expect(result).toEqual({
        valid: false,
        error: 'Invalid roomId format',
      });
    });

    it('should reject room ID that is too long', () => {
      const result = validateRoomId('a1b2c3d4e5f67890123456789');

      expect(result).toEqual({
        valid: false,
        error: 'Invalid roomId format',
      });
    });

    it('should reject room ID with invalid characters (g)', () => {
      const result = validateRoomId('a1b2c3d4e5f678901234567g');

      expect(result).toEqual({
        valid: false,
        error: 'Invalid roomId format',
      });
    });

    it('should reject room ID with invalid characters (z)', () => {
      const result = validateRoomId('a1b2c3d4e5f678901234567z');

      expect(result).toEqual({
        valid: false,
        error: 'Invalid roomId format',
      });
    });

    it('should reject room ID with special characters', () => {
      const result = validateRoomId('a1b2c3d4e5f678901234567-');

      expect(result).toEqual({
        valid: false,
        error: 'Invalid roomId format',
      });
    });

    it('should reject room ID with spaces', () => {
      const result = validateRoomId('a1b2c3d4e5f67890123456 8');

      expect(result).toEqual({
        valid: false,
        error: 'Invalid roomId format',
      });
    });

    it('should reject room ID with only spaces', () => {
      const result = validateRoomId('                        ');

      expect(result).toEqual({
        valid: false,
        error: 'Invalid roomId format',
      });
    });
  });
});
