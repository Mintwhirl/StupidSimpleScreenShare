import { describe, it, expect } from 'vitest';

import { getClientIdentifier } from '../../api/_utils.js';

describe('getClientIdentifier', () => {
  describe('x-forwarded-for header', () => {
    it('should return first IP from x-forwarded-for header', () => {
      const req = {
        headers: {
          'x-forwarded-for': '192.168.1.100, 10.0.0.1, 172.16.0.1',
        },
      };

      const result = getClientIdentifier(req);

      expect(result).toBe('192.168.1.100');
    });

    it('should return single IP from x-forwarded-for header', () => {
      const req = {
        headers: {
          'x-forwarded-for': '192.168.1.100',
        },
      };

      const result = getClientIdentifier(req);

      expect(result).toBe('192.168.1.100');
    });

    it('should trim whitespace from x-forwarded-for IP', () => {
      const req = {
        headers: {
          'x-forwarded-for': ' 192.168.1.100 , 10.0.0.1 ',
        },
      };

      const result = getClientIdentifier(req);

      expect(result).toBe(' 192.168.1.100 ');
    });

    it('should handle empty x-forwarded-for header', () => {
      const req = {
        headers: {
          'x-forwarded-for': '',
        },
      };

      const result = getClientIdentifier(req);

      expect(result).toBe('unknown');
    });
  });

  describe('x-real-ip header', () => {
    it('should return x-real-ip when x-forwarded-for is not present', () => {
      const req = {
        headers: {
          'x-real-ip': '203.0.113.1',
        },
      };

      const result = getClientIdentifier(req);

      expect(result).toBe('203.0.113.1');
    });

    it('should return x-real-ip when x-forwarded-for is null', () => {
      const req = {
        headers: {
          'x-forwarded-for': null,
          'x-real-ip': '203.0.113.1',
        },
      };

      const result = getClientIdentifier(req);

      expect(result).toBe('203.0.113.1');
    });

    it('should return x-real-ip when x-forwarded-for is undefined', () => {
      const req = {
        headers: {
          'x-real-ip': '203.0.113.1',
        },
      };

      const result = getClientIdentifier(req);

      expect(result).toBe('203.0.113.1');
    });
  });

  describe('connection.remoteAddress', () => {
    it('should return connection.remoteAddress when headers are not present', () => {
      const req = {
        headers: {},
        connection: {
          remoteAddress: '127.0.0.1',
        },
      };

      const result = getClientIdentifier(req);

      expect(result).toBe('127.0.0.1');
    });

    it('should return connection.remoteAddress when headers are null', () => {
      const req = {
        headers: {
          'x-forwarded-for': null,
          'x-real-ip': null,
        },
        connection: {
          remoteAddress: '127.0.0.1',
        },
      };

      const result = getClientIdentifier(req);

      expect(result).toBe('127.0.0.1');
    });

    it('should return connection.remoteAddress when headers are undefined', () => {
      const req = {
        connection: {
          remoteAddress: '127.0.0.1',
        },
      };

      expect(() => getClientIdentifier(req)).toThrow();
    });
  });

  describe('fallback to unknown', () => {
    it('should return "unknown" when no IP sources are available', () => {
      const req = {
        headers: {},
      };

      const result = getClientIdentifier(req);

      expect(result).toBe('unknown');
    });

    it('should return "unknown" when req is empty object', () => {
      const req = {
        headers: {},
      };

      const result = getClientIdentifier(req);

      expect(result).toBe('unknown');
    });

    it('should return "unknown" when connection is null', () => {
      const req = {
        headers: {},
        connection: null,
      };

      const result = getClientIdentifier(req);

      expect(result).toBe('unknown');
    });

    it('should return "unknown" when connection.remoteAddress is null', () => {
      const req = {
        headers: {},
        connection: {
          remoteAddress: null,
        },
      };

      const result = getClientIdentifier(req);

      expect(result).toBe('unknown');
    });

    it('should return "unknown" when connection.remoteAddress is undefined', () => {
      const req = {
        headers: {},
        connection: {},
      };

      const result = getClientIdentifier(req);

      expect(result).toBe('unknown');
    });
  });

  describe('priority order', () => {
    it('should prioritize x-forwarded-for over x-real-ip', () => {
      const req = {
        headers: {
          'x-forwarded-for': '192.168.1.100',
          'x-real-ip': '203.0.113.1',
        },
        connection: {
          remoteAddress: '127.0.0.1',
        },
      };

      const result = getClientIdentifier(req);

      expect(result).toBe('192.168.1.100');
    });

    it('should prioritize x-real-ip over connection.remoteAddress', () => {
      const req = {
        headers: {
          'x-real-ip': '203.0.113.1',
        },
        connection: {
          remoteAddress: '127.0.0.1',
        },
      };

      const result = getClientIdentifier(req);

      expect(result).toBe('203.0.113.1');
    });

    it('should prioritize connection.remoteAddress over unknown', () => {
      const req = {
        headers: {},
        connection: {
          remoteAddress: '127.0.0.1',
        },
      };

      const result = getClientIdentifier(req);

      expect(result).toBe('127.0.0.1');
    });
  });

  describe('edge cases', () => {
    it('should handle IPv6 addresses', () => {
      const req = {
        headers: {
          'x-forwarded-for': '2001:db8::1',
        },
      };

      const result = getClientIdentifier(req);

      expect(result).toBe('2001:db8::1');
    });

    it('should handle mixed IPv4 and IPv6 in x-forwarded-for', () => {
      const req = {
        headers: {
          'x-forwarded-for': '2001:db8::1, 192.168.1.100',
        },
      };

      const result = getClientIdentifier(req);

      expect(result).toBe('2001:db8::1');
    });

    it('should handle non-IP values in headers', () => {
      const req = {
        headers: {
          'x-forwarded-for': 'not-an-ip, 192.168.1.100',
        },
      };

      const result = getClientIdentifier(req);

      expect(result).toBe('not-an-ip');
    });

    it('should handle null req', () => {
      expect(() => getClientIdentifier(null)).toThrow();
    });

    it('should handle undefined req', () => {
      expect(() => getClientIdentifier(undefined)).toThrow();
    });
  });
});
