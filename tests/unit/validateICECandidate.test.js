import { describe, it, expect } from 'vitest';

import { validateICECandidate } from '../../api/_utils.js';

describe('validateICECandidate', () => {
  describe('valid ICE candidates', () => {
    it('should accept valid ICE candidate with minimal required fields', () => {
      const validCandidate = {
        candidate: 'candidate:1 1 UDP 2130706431 192.168.1.100 54400 typ host',
      };

      const result = validateICECandidate(validCandidate);

      expect(result).toEqual({ valid: true });
    });

    it('should accept valid ICE candidate with all standard fields', () => {
      const validCandidate = {
        candidate: 'candidate:1 1 UDP 2130706431 192.168.1.100 54400 typ host',
        sdpMLineIndex: 0,
        sdpMid: 'audio',
      };

      const result = validateICECandidate(validCandidate);

      expect(result).toEqual({ valid: true });
    });

    it('should accept valid ICE candidate with additional properties', () => {
      const validCandidate = {
        candidate: 'candidate:2 1 UDP 1694498815 74.125.224.39 19302 typ srflx raddr 192.168.1.100 rport 54400',
        sdpMLineIndex: 1,
        sdpMid: 'video',
        extraProperty: 'should be ignored',
      };

      const result = validateICECandidate(validCandidate);

      expect(result).toEqual({ valid: true });
    });

    it('should accept valid ICE candidate with relay type', () => {
      const validCandidate = {
        candidate: 'candidate:3 1 UDP 16777215 74.125.224.39 19302 typ relay raddr 192.168.1.100 rport 54400',
      };

      const result = validateICECandidate(validCandidate);

      expect(result).toEqual({ valid: true });
    });

    it('should accept valid ICE candidate with prflx type', () => {
      const validCandidate = {
        candidate: 'candidate:4 1 UDP 16777215 74.125.224.39 19302 typ prflx raddr 192.168.1.100 rport 54400',
      };

      const result = validateICECandidate(validCandidate);

      expect(result).toEqual({ valid: true });
    });

    it('should accept valid ICE candidate with maximum size (5000 characters)', () => {
      const largeCandidate = {
        candidate: 'candidate:1 1 UDP 2130706431 192.168.1.100 54400 typ host',
        largeProperty: 'x'.repeat(4900),
      };

      const result = validateICECandidate(largeCandidate);

      expect(result).toEqual({ valid: true });
    });
  });

  describe('invalid ICE candidates', () => {
    it('should reject null candidate', () => {
      const result = validateICECandidate(null);

      expect(result).toEqual({
        valid: false,
        error: 'Missing or invalid candidate',
      });
    });

    it('should reject undefined candidate', () => {
      const result = validateICECandidate(undefined);

      expect(result).toEqual({
        valid: false,
        error: 'Missing or invalid candidate',
      });
    });

    it('should reject non-object candidate (string)', () => {
      const result = validateICECandidate('not an object');

      expect(result).toEqual({
        valid: false,
        error: 'Missing or invalid candidate',
      });
    });

    it('should reject non-object candidate (number)', () => {
      const result = validateICECandidate(123);

      expect(result).toEqual({
        valid: false,
        error: 'Missing or invalid candidate',
      });
    });

    it('should reject non-object candidate (array)', () => {
      const result = validateICECandidate([{ candidate: 'test' }]);

      expect(result).toEqual({
        valid: false,
        error: 'Invalid candidate string',
      });
    });

    it('should reject candidate without candidate property', () => {
      const invalidCandidate = {
        sdpMLineIndex: 0,
        sdpMid: 'audio',
      };

      const result = validateICECandidate(invalidCandidate);

      expect(result).toEqual({
        valid: false,
        error: 'Invalid candidate string',
      });
    });

    it('should reject candidate with null candidate property', () => {
      const invalidCandidate = {
        candidate: null,
        sdpMLineIndex: 0,
        sdpMid: 'audio',
      };

      const result = validateICECandidate(invalidCandidate);

      expect(result).toEqual({
        valid: false,
        error: 'Invalid candidate string',
      });
    });

    it('should reject candidate with non-string candidate property (number)', () => {
      const invalidCandidate = {
        candidate: 123,
        sdpMLineIndex: 0,
        sdpMid: 'audio',
      };

      const result = validateICECandidate(invalidCandidate);

      expect(result).toEqual({
        valid: false,
        error: 'Invalid candidate string',
      });
    });

    it('should reject candidate with non-string candidate property (object)', () => {
      const invalidCandidate = {
        candidate: { candidate: 'candidate:1 1 UDP 2130706431 192.168.1.100 54400 typ host' },
        sdpMLineIndex: 0,
        sdpMid: 'audio',
      };

      const result = validateICECandidate(invalidCandidate);

      expect(result).toEqual({
        valid: false,
        error: 'Invalid candidate string',
      });
    });

    it('should reject candidate with empty string candidate property', () => {
      const invalidCandidate = {
        candidate: '',
        sdpMLineIndex: 0,
        sdpMid: 'audio',
      };

      const result = validateICECandidate(invalidCandidate);

      expect(result).toEqual({
        valid: false,
        error: 'Invalid candidate string',
      });
    });

    it('should reject candidate that is too large (5001 characters)', () => {
      const largeCandidate = {
        candidate: 'candidate:1 1 UDP 2130706431 192.168.1.100 54400 typ host',
        largeProperty: 'x'.repeat(5000),
      };

      const result = validateICECandidate(largeCandidate);

      expect(result).toEqual({
        valid: false,
        error: 'Candidate data too large',
      });
    });

    it('should reject candidate that is extremely large (1MB)', () => {
      const largeCandidate = {
        candidate: 'candidate:1 1 UDP 2130706431 192.168.1.100 54400 typ host',
        largeProperty: 'x'.repeat(1000000),
      };

      const result = validateICECandidate(largeCandidate);

      expect(result).toEqual({
        valid: false,
        error: 'Candidate data too large',
      });
    });

    it('should reject candidate with deeply nested object that makes it large', () => {
      const largeCandidate = {
        candidate: 'candidate:1 1 UDP 2130706431 192.168.1.100 54400 typ host',
        nested: {
          level1: {
            level2: {
              level3: {
                data: 'x'.repeat(5000),
              },
            },
          },
        },
      };

      const result = validateICECandidate(largeCandidate);

      expect(result).toEqual({
        valid: false,
        error: 'Candidate data too large',
      });
    });

    it('should reject candidate with array that makes it large', () => {
      const largeCandidate = {
        candidate: 'candidate:1 1 UDP 2130706431 192.168.1.100 54400 typ host',
        largeArray: new Array(1000).fill('x'.repeat(10)),
      };

      const result = validateICECandidate(largeCandidate);

      expect(result).toEqual({
        valid: false,
        error: 'Candidate data too large',
      });
    });
  });
});
