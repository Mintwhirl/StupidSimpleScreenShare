import { describe, it, expect } from 'vitest';

import { validateMessage } from '../../api/_utils.js';

describe('validateMessage', () => {
  describe('valid messages', () => {
    it('should accept simple text message', () => {
      const result = validateMessage('Hello world');

      expect(result).toEqual({ valid: true });
    });

    it('should accept message with numbers', () => {
      const result = validateMessage('Message 123');

      expect(result).toEqual({ valid: true });
    });

    it('should accept message with special characters', () => {
      const result = validateMessage('Hello! How are you? @#$%');

      expect(result).toEqual({ valid: true });
    });

    it('should accept message with emojis', () => {
      const result = validateMessage('Hello! 😊 How are you? 🎉');

      expect(result).toEqual({ valid: true });
    });

    it('should accept message with newlines', () => {
      const result = validateMessage('Line 1\nLine 2\nLine 3');

      expect(result).toEqual({ valid: true });
    });

    it('should accept message with tabs', () => {
      const result = validateMessage('Column1\tColumn2\tColumn3');

      expect(result).toEqual({ valid: true });
    });

    it('should accept single character message', () => {
      const result = validateMessage('A');

      expect(result).toEqual({ valid: true });
    });

    it('should accept maximum length message (500 characters)', () => {
      const longMessage = 'A'.repeat(500);
      const result = validateMessage(longMessage);

      expect(result).toEqual({ valid: true });
    });

    it('should accept message with unicode characters', () => {
      const result = validateMessage('Café naïve résumé');

      expect(result).toEqual({ valid: true });
    });

    it('should accept message with mixed content', () => {
      const result = validateMessage('Hello! This is a test message with numbers 123, symbols @#$%, and emojis 🎉');

      expect(result).toEqual({ valid: true });
    });
  });

  describe('invalid messages', () => {
    it('should reject null message', () => {
      const result = validateMessage(null);

      expect(result).toEqual({
        valid: false,
        error: 'Missing or invalid message',
      });
    });

    it('should reject undefined message', () => {
      const result = validateMessage(undefined);

      expect(result).toEqual({
        valid: false,
        error: 'Missing or invalid message',
      });
    });

    it('should reject empty string message', () => {
      const result = validateMessage('');

      expect(result).toEqual({
        valid: false,
        error: 'Missing or invalid message',
      });
    });

    it('should reject non-string message (number)', () => {
      const result = validateMessage(123);

      expect(result).toEqual({
        valid: false,
        error: 'Missing or invalid message',
      });
    });

    it('should reject non-string message (object)', () => {
      const result = validateMessage({ message: 'Hello' });

      expect(result).toEqual({
        valid: false,
        error: 'Missing or invalid message',
      });
    });

    it('should reject non-string message (array)', () => {
      const result = validateMessage(['Hello', 'world']);

      expect(result).toEqual({
        valid: false,
        error: 'Missing or invalid message',
      });
    });

    it('should reject non-string message (boolean)', () => {
      const result = validateMessage(true);

      expect(result).toEqual({
        valid: false,
        error: 'Missing or invalid message',
      });
    });

    it('should reject message that is too long (501 characters)', () => {
      const longMessage = 'A'.repeat(501);
      const result = validateMessage(longMessage);

      expect(result).toEqual({
        valid: false,
        error: 'Message too long (max 500 characters)',
      });
    });

    it('should reject message that is too long (1000 characters)', () => {
      const longMessage = 'A'.repeat(1000);
      const result = validateMessage(longMessage);

      expect(result).toEqual({
        valid: false,
        error: 'Message too long (max 500 characters)',
      });
    });

    it('should reject message with only spaces', () => {
      const result = validateMessage('   ');

      expect(result).toEqual({
        valid: false,
        error: 'Message cannot be empty',
      });
    });

    it('should reject message with only tabs', () => {
      const result = validateMessage('\t\t\t');

      expect(result).toEqual({
        valid: false,
        error: 'Message cannot be empty',
      });
    });

    it('should reject message with only newlines', () => {
      const result = validateMessage('\n\n\n');

      expect(result).toEqual({
        valid: false,
        error: 'Message cannot be empty',
      });
    });

    it('should reject message with only whitespace characters', () => {
      const result = validateMessage(' \t\n \t\n ');

      expect(result).toEqual({
        valid: false,
        error: 'Message cannot be empty',
      });
    });

    it('should accept message with leading and trailing spaces (but not only spaces)', () => {
      const result = validateMessage('  Hello world  ');

      expect(result).toEqual({ valid: true });
    });

    it('should accept message with leading and trailing tabs', () => {
      const result = validateMessage('\tHello world\t');

      expect(result).toEqual({ valid: true });
    });

    it('should accept message with leading and trailing newlines', () => {
      const result = validateMessage('\nHello world\n');

      expect(result).toEqual({ valid: true });
    });
  });
});
