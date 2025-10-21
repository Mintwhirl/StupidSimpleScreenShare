import { describe, it, expect } from 'vitest';

import {
  getRoomMetaKey,
  getOfferKey,
  getAnswerKey,
  getDescriptorKey,
  getCandidateKey,
  getSenderKey,
  getChatKey,
  resolveSenderId,
} from '../../../shared/signaling/keys.js';

describe('signaling key helpers', () => {
  it('builds deterministic room keys', () => {
    expect(getRoomMetaKey('room123')).toBe('room:room123:meta');
    expect(getOfferKey('room123')).toBe('room:room123:offer');
    expect(getAnswerKey('room123')).toBe('room:room123:answer');
    expect(getChatKey('room123')).toBe('room:room123:chat');
  });

  it('normalizes whitespace for room identifiers', () => {
    expect(getRoomMetaKey('  roomABC  ')).toBe('room:roomABC:meta');
  });

  it('selects descriptor keys based on type', () => {
    expect(getDescriptorKey('room123', 'offer')).toBe('room:room123:offer');
    expect(getDescriptorKey('room123', 'answer')).toBe('room:room123:answer');
    expect(() => getDescriptorKey('room123', 'candidate')).toThrow(/Unsupported descriptor type/);
  });

  it('builds candidate keys for hosts and viewers', () => {
    expect(getCandidateKey('room123', 'host')).toBe('room:room123:host:candidates');
    expect(getCandidateKey('room123', 'viewer')).toBe('room:room123:viewer:candidates');
    expect(getCandidateKey('room123', 'viewer', 'viewer-42')).toBe('room:room123:viewer:viewer-42:candidates');
  });

  it('requires sender identifiers when building sender keys', () => {
    expect(getSenderKey('room123', 'host')).toBe('room:room123:sender:host');
    expect(() => getSenderKey('room123', '   ')).toThrow(/senderId is required/);
  });

  it('resolves sender identity from role and viewerId', () => {
    expect(resolveSenderId('host')).toBe('host');
    expect(resolveSenderId('viewer', 'abc')).toBe('abc');
    expect(resolveSenderId('viewer', '  viewer-99  ')).toBe('viewer-99');
  });

  it('throws when required parameters are missing', () => {
    expect(() => getRoomMetaKey()).toThrow(/roomId is required/);
    expect(() => getCandidateKey('room123')).toThrow(/role is required/);
  });
});
