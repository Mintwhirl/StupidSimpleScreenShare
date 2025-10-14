import { describe, it, expect } from 'vitest';

import { validateViewerId } from '../../api/_utils.js';

describe('validateViewerId', () => {
  describe('valid viewer IDs', () => {
    it('should accept valid viewer ID with letters only', () => {
      const result = validateViewerId('johns');

      expect(result).toEqual({ valid: true });
    });

    it('should accept valid viewer ID with numbers only', () => {
      const result = validateViewerId('12345');

      expect(result).toEqual({ valid: true });
    });

    it('should accept valid viewer ID with letters and numbers', () => {
      const result = validateViewerId('user123');

      expect(result).toEqual({ valid: true });
    });

    it('should accept valid viewer ID with underscores', () => {
      const result = validateViewerId('user_name');

      expect(result).toEqual({ valid: true });
    });

    it('should accept valid viewer ID with mixed case', () => {
      const result = validateViewerId('JohnDoe');

      expect(result).toEqual({ valid: true });
    });

    it('should accept valid viewer ID with multiple underscores', () => {
      const result = validateViewerId('user_name_123');

      expect(result).toEqual({ valid: true });
    });

    it('should accept valid viewer ID starting with underscore', () => {
      const result = validateViewerId('_user123');

      expect(result).toEqual({ valid: true });
    });

    it('should accept valid viewer ID ending with underscore', () => {
      const result = validateViewerId('user123_');

      expect(result).toEqual({ valid: true });
    });

    it('should accept minimum length viewer ID (5 characters)', () => {
      const result = validateViewerId('user1');

      expect(result).toEqual({ valid: true });
    });

    it('should accept maximum length viewer ID (50 characters)', () => {
      const longViewerId = 'a'.repeat(50);
      const result = validateViewerId(longViewerId);

      expect(result).toEqual({ valid: true });
    });
  });

  describe('invalid viewer IDs', () => {
    it('should reject null viewer ID', () => {
      const result = validateViewerId(null);

      expect(result).toEqual({
        valid: false,
        error: 'Missing or invalid viewerId',
      });
    });

    it('should reject undefined viewer ID', () => {
      const result = validateViewerId(undefined);

      expect(result).toEqual({
        valid: false,
        error: 'Missing or invalid viewerId',
      });
    });

    it('should reject empty string viewer ID', () => {
      const result = validateViewerId('');

      expect(result).toEqual({
        valid: false,
        error: 'Missing or invalid viewerId',
      });
    });

    it('should reject non-string viewer ID (number)', () => {
      const result = validateViewerId(12345);

      expect(result).toEqual({
        valid: false,
        error: 'Missing or invalid viewerId',
      });
    });

    it('should reject non-string viewer ID (object)', () => {
      const result = validateViewerId({ viewerId: 'user123' });

      expect(result).toEqual({
        valid: false,
        error: 'Missing or invalid viewerId',
      });
    });

    it('should reject non-string viewer ID (array)', () => {
      const result = validateViewerId(['user123']);

      expect(result).toEqual({
        valid: false,
        error: 'Missing or invalid viewerId',
      });
    });

    it('should reject viewer ID that is too short (4 characters)', () => {
      const result = validateViewerId('user');

      expect(result).toEqual({
        valid: false,
        error: 'ViewerId must be between 5 and 50 characters',
      });
    });

    it('should reject viewer ID that is too short (3 characters)', () => {
      const result = validateViewerId('usr');

      expect(result).toEqual({
        valid: false,
        error: 'ViewerId must be between 5 and 50 characters',
      });
    });

    it('should reject viewer ID that is too short (1 character)', () => {
      const result = validateViewerId('u');

      expect(result).toEqual({
        valid: false,
        error: 'ViewerId must be between 5 and 50 characters',
      });
    });

    it('should reject viewer ID that is too long (51 characters)', () => {
      const longViewerId = 'a'.repeat(51);
      const result = validateViewerId(longViewerId);

      expect(result).toEqual({
        valid: false,
        error: 'ViewerId must be between 5 and 50 characters',
      });
    });

    it('should reject viewer ID that is too long (100 characters)', () => {
      const longViewerId = 'a'.repeat(100);
      const result = validateViewerId(longViewerId);

      expect(result).toEqual({
        valid: false,
        error: 'ViewerId must be between 5 and 50 characters',
      });
    });

    it('should reject viewer ID with spaces', () => {
      const result = validateViewerId('user name');

      expect(result).toEqual({
        valid: false,
        error: 'ViewerId must be alphanumeric with underscores',
      });
    });

    it('should reject viewer ID with hyphens', () => {
      const result = validateViewerId('user-name');

      expect(result).toEqual({
        valid: false,
        error: 'ViewerId must be alphanumeric with underscores',
      });
    });

    it('should reject viewer ID with special characters', () => {
      const result = validateViewerId('user@name');

      expect(result).toEqual({
        valid: false,
        error: 'ViewerId must be alphanumeric with underscores',
      });
    });

    it('should reject viewer ID with dots', () => {
      const result = validateViewerId('user.name');

      expect(result).toEqual({
        valid: false,
        error: 'ViewerId must be alphanumeric with underscores',
      });
    });

    it('should reject viewer ID with slashes', () => {
      const result = validateViewerId('user/name');

      expect(result).toEqual({
        valid: false,
        error: 'ViewerId must be alphanumeric with underscores',
      });
    });

    it('should reject viewer ID with backslashes', () => {
      const result = validateViewerId('user\\name');

      expect(result).toEqual({
        valid: false,
        error: 'ViewerId must be alphanumeric with underscores',
      });
    });

    it('should reject viewer ID with parentheses', () => {
      const result = validateViewerId('user(name)');

      expect(result).toEqual({
        valid: false,
        error: 'ViewerId must be alphanumeric with underscores',
      });
    });

    it('should reject viewer ID with brackets', () => {
      const result = validateViewerId('user[name]');

      expect(result).toEqual({
        valid: false,
        error: 'ViewerId must be alphanumeric with underscores',
      });
    });

    it('should reject viewer ID with only spaces', () => {
      const result = validateViewerId('     ');

      expect(result).toEqual({
        valid: false,
        error: 'ViewerId must be alphanumeric with underscores',
      });
    });

    it('should reject viewer ID with only special characters', () => {
      const result = validateViewerId('!@#$%');

      expect(result).toEqual({
        valid: false,
        error: 'ViewerId must be alphanumeric with underscores',
      });
    });
  });
});
