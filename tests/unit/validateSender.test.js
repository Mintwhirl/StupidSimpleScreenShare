import { describe, it, expect } from 'vitest';

import { validateSender } from '../../api/_utils.js';

describe('validateSender', () => {
  describe('valid sender names', () => {
    it('should accept simple sender name', () => {
      const result = validateSender('John');

      expect(result).toEqual({ valid: true });
    });

    it('should accept sender name with numbers', () => {
      const result = validateSender('User123');

      expect(result).toEqual({ valid: true });
    });

    it('should accept sender name with special characters', () => {
      const result = validateSender('John_Doe');

      expect(result).toEqual({ valid: true });
    });

    it('should accept sender name with spaces', () => {
      const result = validateSender('John Doe');

      expect(result).toEqual({ valid: true });
    });

    it('should accept sender name with hyphens', () => {
      const result = validateSender('John-Doe');

      expect(result).toEqual({ valid: true });
    });

    it('should accept sender name with dots', () => {
      const result = validateSender('John.Doe');

      expect(result).toEqual({ valid: true });
    });

    it('should accept sender name with apostrophes', () => {
      const result = validateSender("O'Connor");

      expect(result).toEqual({ valid: true });
    });

    it('should accept sender name with emojis', () => {
      const result = validateSender('John 😊');

      expect(result).toEqual({ valid: true });
    });

    it('should accept single character sender name', () => {
      const result = validateSender('J');

      expect(result).toEqual({ valid: true });
    });

    it('should accept maximum length sender name (50 characters)', () => {
      const longSender = 'A'.repeat(50);
      const result = validateSender(longSender);

      expect(result).toEqual({ valid: true });
    });

    it('should accept sender name with unicode characters', () => {
      const result = validateSender('José María');

      expect(result).toEqual({ valid: true });
    });

    it('should accept sender name with mixed content', () => {
      const result = validateSender('John_Doe-123 @#$%');

      expect(result).toEqual({ valid: true });
    });
  });

  describe('invalid sender names', () => {
    it('should reject null sender', () => {
      const result = validateSender(null);

      expect(result).toEqual({
        valid: false,
        error: 'Missing or invalid sender',
      });
    });

    it('should reject undefined sender', () => {
      const result = validateSender(undefined);

      expect(result).toEqual({
        valid: false,
        error: 'Missing or invalid sender',
      });
    });

    it('should reject empty string sender', () => {
      const result = validateSender('');

      expect(result).toEqual({
        valid: false,
        error: 'Missing or invalid sender',
      });
    });

    it('should reject non-string sender (number)', () => {
      const result = validateSender(123);

      expect(result).toEqual({
        valid: false,
        error: 'Missing or invalid sender',
      });
    });

    it('should reject non-string sender (object)', () => {
      const result = validateSender({ sender: 'John' });

      expect(result).toEqual({
        valid: false,
        error: 'Missing or invalid sender',
      });
    });

    it('should reject non-string sender (array)', () => {
      const result = validateSender(['John', 'Doe']);

      expect(result).toEqual({
        valid: false,
        error: 'Missing or invalid sender',
      });
    });

    it('should reject non-string sender (boolean)', () => {
      const result = validateSender(true);

      expect(result).toEqual({
        valid: false,
        error: 'Missing or invalid sender',
      });
    });

    it('should reject sender name that is too long (51 characters)', () => {
      const longSender = 'A'.repeat(51);
      const result = validateSender(longSender);

      expect(result).toEqual({
        valid: false,
        error: 'Sender name too long (max 50 characters)',
      });
    });

    it('should reject sender name that is too long (100 characters)', () => {
      const longSender = 'A'.repeat(100);
      const result = validateSender(longSender);

      expect(result).toEqual({
        valid: false,
        error: 'Sender name too long (max 50 characters)',
      });
    });

    it('should reject sender name with only spaces', () => {
      const result = validateSender('   ');

      expect(result).toEqual({
        valid: false,
        error: 'Sender name cannot be empty',
      });
    });

    it('should reject sender name with only tabs', () => {
      const result = validateSender('\t\t\t');

      expect(result).toEqual({
        valid: false,
        error: 'Sender name cannot be empty',
      });
    });

    it('should reject sender name with only newlines', () => {
      const result = validateSender('\n\n\n');

      expect(result).toEqual({
        valid: false,
        error: 'Sender name cannot be empty',
      });
    });

    it('should reject sender name with only whitespace characters', () => {
      const result = validateSender(' \t\n \t\n ');

      expect(result).toEqual({
        valid: false,
        error: 'Sender name cannot be empty',
      });
    });

    it('should accept sender name with leading and trailing spaces (but not only spaces)', () => {
      const result = validateSender('  John Doe  ');

      expect(result).toEqual({ valid: true });
    });

    it('should accept sender name with leading and trailing tabs', () => {
      const result = validateSender('\tJohn Doe\t');

      expect(result).toEqual({ valid: true });
    });

    it('should accept sender name with leading and trailing newlines', () => {
      const result = validateSender('\nJohn Doe\n');

      expect(result).toEqual({ valid: true });
    });
  });
});
