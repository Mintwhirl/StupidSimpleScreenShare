import { describe, it, expect } from 'vitest';

import { validateRTCDescriptor } from '../../api/_utils.js';

describe('validateRTCDescriptor', () => {
  describe('valid RTC descriptors', () => {
    it('should accept valid offer descriptor', () => {
      const validDescriptor = {
        type: 'offer',
        sdp: 'v=0\r\no=- 123456789 2 IN IP4 127.0.0.1\r\ns=-\r\nt=0 0\r\n',
      };

      const result = validateRTCDescriptor(validDescriptor);

      expect(result).toEqual({ valid: true });
    });

    it('should accept valid answer descriptor', () => {
      const validDescriptor = {
        type: 'answer',
        sdp: 'v=0\r\no=- 123456789 2 IN IP4 127.0.0.1\r\ns=-\r\nt=0 0\r\n',
      };

      const result = validateRTCDescriptor(validDescriptor);

      expect(result).toEqual({ valid: true });
    });

    it('should accept descriptor with complex SDP', () => {
      const validDescriptor = {
        type: 'offer',
        sdp: 'v=0\r\no=- 123456789 2 IN IP4 127.0.0.1\r\ns=-\r\nt=0 0\r\nm=audio 9 UDP/TLS/RTP/SAVPF 111\r\na=rtpmap:111 opus/48000/2\r\nm=video 9 UDP/TLS/RTP/SAVPF 96\r\na=rtpmap:96 VP8/90000\r\n',
      };

      const result = validateRTCDescriptor(validDescriptor);

      expect(result).toEqual({ valid: true });
    });

    it('should accept descriptor with maximum size SDP (100000 characters)', () => {
      const largeSdp = `v=0\r\no=- 123456789 2 IN IP4 127.0.0.1\r\ns=-\r\nt=0 0\r\n${'a=test\r\n'.repeat(10000)}`;
      const validDescriptor = {
        type: 'offer',
        sdp: largeSdp,
      };

      const result = validateRTCDescriptor(validDescriptor);

      expect(result).toEqual({ valid: true });
    });

    it('should accept descriptor with additional properties', () => {
      const validDescriptor = {
        type: 'offer',
        sdp: 'v=0\r\no=- 123456789 2 IN IP4 127.0.0.1\r\ns=-\r\nt=0 0\r\n',
        extraProperty: 'should be ignored',
      };

      const result = validateRTCDescriptor(validDescriptor);

      expect(result).toEqual({ valid: true });
    });
  });

  describe('invalid RTC descriptors', () => {
    it('should reject null descriptor', () => {
      const result = validateRTCDescriptor(null);

      expect(result).toEqual({
        valid: false,
        error: 'Missing or invalid descriptor',
      });
    });

    it('should reject undefined descriptor', () => {
      const result = validateRTCDescriptor(undefined);

      expect(result).toEqual({
        valid: false,
        error: 'Missing or invalid descriptor',
      });
    });

    it('should reject non-object descriptor (string)', () => {
      const result = validateRTCDescriptor('not an object');

      expect(result).toEqual({
        valid: false,
        error: 'Missing or invalid descriptor',
      });
    });

    it('should reject non-object descriptor (number)', () => {
      const result = validateRTCDescriptor(123);

      expect(result).toEqual({
        valid: false,
        error: 'Missing or invalid descriptor',
      });
    });

    it('should reject non-object descriptor (array)', () => {
      const result = validateRTCDescriptor([{ type: 'offer', sdp: 'test' }]);

      expect(result).toEqual({
        valid: false,
        error: 'Invalid descriptor type (must be "offer" or "answer")',
      });
    });

    it('should reject descriptor without type property', () => {
      const invalidDescriptor = {
        sdp: 'v=0\r\no=- 123456789 2 IN IP4 127.0.0.1\r\ns=-\r\nt=0 0\r\n',
      };

      const result = validateRTCDescriptor(invalidDescriptor);

      expect(result).toEqual({
        valid: false,
        error: 'Invalid descriptor type (must be "offer" or "answer")',
      });
    });

    it('should reject descriptor with null type', () => {
      const invalidDescriptor = {
        type: null,
        sdp: 'v=0\r\no=- 123456789 2 IN IP4 127.0.0.1\r\ns=-\r\nt=0 0\r\n',
      };

      const result = validateRTCDescriptor(invalidDescriptor);

      expect(result).toEqual({
        valid: false,
        error: 'Invalid descriptor type (must be "offer" or "answer")',
      });
    });

    it('should reject descriptor with empty string type', () => {
      const invalidDescriptor = {
        type: '',
        sdp: 'v=0\r\no=- 123456789 2 IN IP4 127.0.0.1\r\ns=-\r\nt=0 0\r\n',
      };

      const result = validateRTCDescriptor(invalidDescriptor);

      expect(result).toEqual({
        valid: false,
        error: 'Invalid descriptor type (must be "offer" or "answer")',
      });
    });

    it('should reject descriptor with invalid type "pranswer"', () => {
      const invalidDescriptor = {
        type: 'pranswer',
        sdp: 'v=0\r\no=- 123456789 2 IN IP4 127.0.0.1\r\ns=-\r\nt=0 0\r\n',
      };

      const result = validateRTCDescriptor(invalidDescriptor);

      expect(result).toEqual({
        valid: false,
        error: 'Invalid descriptor type (must be "offer" or "answer")',
      });
    });

    it('should reject descriptor with invalid type "rollback"', () => {
      const invalidDescriptor = {
        type: 'rollback',
        sdp: 'v=0\r\no=- 123456789 2 IN IP4 127.0.0.1\r\ns=-\r\nt=0 0\r\n',
      };

      const result = validateRTCDescriptor(invalidDescriptor);

      expect(result).toEqual({
        valid: false,
        error: 'Invalid descriptor type (must be "offer" or "answer")',
      });
    });

    it('should reject descriptor with case-sensitive type "Offer"', () => {
      const invalidDescriptor = {
        type: 'Offer',
        sdp: 'v=0\r\no=- 123456789 2 IN IP4 127.0.0.1\r\ns=-\r\nt=0 0\r\n',
      };

      const result = validateRTCDescriptor(invalidDescriptor);

      expect(result).toEqual({
        valid: false,
        error: 'Invalid descriptor type (must be "offer" or "answer")',
      });
    });

    it('should reject descriptor with case-sensitive type "ANSWER"', () => {
      const invalidDescriptor = {
        type: 'ANSWER',
        sdp: 'v=0\r\no=- 123456789 2 IN IP4 127.0.0.1\r\ns=-\r\nt=0 0\r\n',
      };

      const result = validateRTCDescriptor(invalidDescriptor);

      expect(result).toEqual({
        valid: false,
        error: 'Invalid descriptor type (must be "offer" or "answer")',
      });
    });

    it('should reject descriptor without sdp property', () => {
      const invalidDescriptor = {
        type: 'offer',
      };

      const result = validateRTCDescriptor(invalidDescriptor);

      expect(result).toEqual({
        valid: false,
        error: 'Missing or invalid SDP',
      });
    });

    it('should reject descriptor with null sdp', () => {
      const invalidDescriptor = {
        type: 'offer',
        sdp: null,
      };

      const result = validateRTCDescriptor(invalidDescriptor);

      expect(result).toEqual({
        valid: false,
        error: 'Missing or invalid SDP',
      });
    });

    it('should reject descriptor with non-string sdp (number)', () => {
      const invalidDescriptor = {
        type: 'offer',
        sdp: 123,
      };

      const result = validateRTCDescriptor(invalidDescriptor);

      expect(result).toEqual({
        valid: false,
        error: 'Missing or invalid SDP',
      });
    });

    it('should reject descriptor with non-string sdp (object)', () => {
      const invalidDescriptor = {
        type: 'offer',
        sdp: { sdp: 'v=0\r\no=- 123456789 2 IN IP4 127.0.0.1\r\ns=-\r\nt=0 0\r\n' },
      };

      const result = validateRTCDescriptor(invalidDescriptor);

      expect(result).toEqual({
        valid: false,
        error: 'Missing or invalid SDP',
      });
    });

    it('should reject descriptor with empty string sdp', () => {
      const invalidDescriptor = {
        type: 'offer',
        sdp: '',
      };

      const result = validateRTCDescriptor(invalidDescriptor);

      expect(result).toEqual({
        valid: false,
        error: 'Missing or invalid SDP',
      });
    });

    it('should reject descriptor with SDP that is too large (100001 characters)', () => {
      const largeSdp = 'a'.repeat(100001);
      const invalidDescriptor = {
        type: 'offer',
        sdp: largeSdp,
      };

      const result = validateRTCDescriptor(invalidDescriptor);

      expect(result).toEqual({
        valid: false,
        error: 'SDP too large',
      });
    });

    it('should reject descriptor with SDP that is extremely large (1MB)', () => {
      const largeSdp = 'a'.repeat(1000000);
      const invalidDescriptor = {
        type: 'offer',
        sdp: largeSdp,
      };

      const result = validateRTCDescriptor(invalidDescriptor);

      expect(result).toEqual({
        valid: false,
        error: 'SDP too large',
      });
    });
  });
});
