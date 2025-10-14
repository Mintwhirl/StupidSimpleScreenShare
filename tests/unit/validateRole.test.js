import { describe, it, expect } from 'vitest';

import { validateRole } from '../../api/_utils.js';

describe('validateRole', () => {
  describe('valid roles', () => {
    it('should accept "host" role', () => {
      const result = validateRole('host');

      expect(result).toEqual({ valid: true });
    });

    it('should accept "viewer" role', () => {
      const result = validateRole('viewer');

      expect(result).toEqual({ valid: true });
    });
  });

  describe('invalid roles', () => {
    it('should reject null role', () => {
      const result = validateRole(null);

      expect(result).toEqual({
        valid: false,
        error: 'Missing or invalid role',
      });
    });

    it('should reject undefined role', () => {
      const result = validateRole(undefined);

      expect(result).toEqual({
        valid: false,
        error: 'Missing or invalid role',
      });
    });

    it('should reject empty string role', () => {
      const result = validateRole('');

      expect(result).toEqual({
        valid: false,
        error: 'Missing or invalid role',
      });
    });

    it('should reject non-string role (number)', () => {
      const result = validateRole(123);

      expect(result).toEqual({
        valid: false,
        error: 'Missing or invalid role',
      });
    });

    it('should reject non-string role (object)', () => {
      const result = validateRole({ role: 'host' });

      expect(result).toEqual({
        valid: false,
        error: 'Missing or invalid role',
      });
    });

    it('should reject non-string role (array)', () => {
      const result = validateRole(['host']);

      expect(result).toEqual({
        valid: false,
        error: 'Missing or invalid role',
      });
    });

    it('should reject non-string role (boolean)', () => {
      const result = validateRole(true);

      expect(result).toEqual({
        valid: false,
        error: 'Missing or invalid role',
      });
    });

    it('should reject invalid role "admin"', () => {
      const result = validateRole('admin');

      expect(result).toEqual({
        valid: false,
        error: 'Role must be either "host" or "viewer"',
      });
    });

    it('should reject invalid role "moderator"', () => {
      const result = validateRole('moderator');

      expect(result).toEqual({
        valid: false,
        error: 'Role must be either "host" or "viewer"',
      });
    });

    it('should reject invalid role "guest"', () => {
      const result = validateRole('guest');

      expect(result).toEqual({
        valid: false,
        error: 'Role must be either "host" or "viewer"',
      });
    });

    it('should reject role with extra whitespace " host "', () => {
      const result = validateRole(' host ');

      expect(result).toEqual({
        valid: false,
        error: 'Role must be either "host" or "viewer"',
      });
    });

    it('should reject role with extra whitespace " viewer "', () => {
      const result = validateRole(' viewer ');

      expect(result).toEqual({
        valid: false,
        error: 'Role must be either "host" or "viewer"',
      });
    });

    it('should reject case-sensitive variations "Host"', () => {
      const result = validateRole('Host');

      expect(result).toEqual({
        valid: false,
        error: 'Role must be either "host" or "viewer"',
      });
    });

    it('should reject case-sensitive variations "VIEWER"', () => {
      const result = validateRole('VIEWER');

      expect(result).toEqual({
        valid: false,
        error: 'Role must be either "host" or "viewer"',
      });
    });

    it('should reject partial matches "hosts"', () => {
      const result = validateRole('hosts');

      expect(result).toEqual({
        valid: false,
        error: 'Role must be either "host" or "viewer"',
      });
    });

    it('should reject partial matches "viewers"', () => {
      const result = validateRole('viewers');

      expect(result).toEqual({
        valid: false,
        error: 'Role must be either "host" or "viewer"',
      });
    });

    it('should reject role with special characters "host!"', () => {
      const result = validateRole('host!');

      expect(result).toEqual({
        valid: false,
        error: 'Role must be either "host" or "viewer"',
      });
    });

    it('should reject role with numbers "host123"', () => {
      const result = validateRole('host123');

      expect(result).toEqual({
        valid: false,
        error: 'Role must be either "host" or "viewer"',
      });
    });
  });
});
