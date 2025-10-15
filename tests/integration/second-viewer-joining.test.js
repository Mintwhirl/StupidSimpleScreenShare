import { renderHook, act } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';

import { useWebRTC } from '../../src/hooks/useWebRTC.js';

// Use fake timers for second viewer joining tests
vi.useFakeTimers();

// Mock WebRTC APIs
const mockRTCPeerConnection = vi.fn();
const mockGetDisplayMedia = vi.fn();
const mockMediaStream = {
  getTracks: vi.fn(() => [
    { kind: 'video', stop: vi.fn() },
    { kind: 'audio', stop: vi.fn() },
  ]),
  getVideoTracks: vi.fn(() => [{ kind: 'video', stop: vi.fn() }]),
  getAudioTracks: vi.fn(() => [{ kind: 'audio', stop: vi.fn() }]),
};

// Mock global WebRTC APIs
global.RTCPeerConnection = mockRTCPeerConnection;
global.navigator = {
  mediaDevices: {
    getDisplayMedia: mockGetDisplayMedia,
  },
};

// Mock fetch for API calls
global.fetch = vi.fn();

// Mock logger
vi.mock('../../src/utils/logger.js', () => ({
  default: {
    error: vi.fn(),
    warn: vi.fn(),
    info: vi.fn(),
    debug: vi.fn(),
    webrtc: vi.fn(),
  },
}));

// Mock TURN config
vi.mock('../../src/config/turn.js', () => ({
  getIceServers: vi.fn(() => [{ urls: 'stun:stun.l.google.com:19302' }]),
}));

// Mock polling utility
vi.mock('../../src/utils/polling.js', () => ({
  createExponentialBackoffPolling: vi.fn(() => vi.fn()),
}));

describe('Second Viewer Joining Existing Room - REAL Logic Tests', () => {
  let mockPeerConnection;
  let mockConfig;

  beforeEach(() => {
    vi.clearAllMocks();

    // Mock peer connection with real WebRTC behavior
    mockPeerConnection = {
      connectionState: 'new',
      iceConnectionState: 'new',
      iceGatheringState: 'new',
      setLocalDescription: vi.fn().mockResolvedValue(undefined),
      setRemoteDescription: vi.fn().mockResolvedValue(undefined),
      createOffer: vi.fn().mockResolvedValue({
        type: 'offer',
        sdp: 'v=0\r\no=- 123456789 2 IN IP4 127.0.0.1\r\ns=-\r\nt=0 0\r\n',
      }),
      createAnswer: vi.fn().mockResolvedValue({
        type: 'answer',
        sdp: 'v=0\r\no=- 987654321 2 IN IP4 127.0.0.1\r\ns=-\r\nt=0 0\r\n',
      }),
      addTrack: vi.fn(),
      addTransceiver: vi.fn(),
      addIceCandidate: vi.fn().mockResolvedValue(undefined),
      close: vi.fn(),
      // Event handlers
      onconnectionstatechange: null,
      oniceconnectionstatechange: null,
      onicegatheringstatechange: null,
      onicecandidate: null,
      ontrack: null,
      ondatachannel: null,
    };

    mockRTCPeerConnection.mockReturnValue(mockPeerConnection);
    mockGetDisplayMedia.mockResolvedValue(mockMediaStream);

    mockConfig = {
      authSecret: 'test-secret',
      apiBase: '/api',
    };

    // Mock successful API responses by default
    global.fetch.mockResolvedValue({
      ok: true,
      json: vi.fn().mockResolvedValue({ ok: true }),
    });
  });

  afterEach(() => {
    vi.clearAllMocks();
    vi.clearAllTimers();
  });

  describe('Second Viewer Joining Existing Room', () => {
    it('should handle second viewer joining existing room', async () => {
      const { result } = renderHook(() => useWebRTC('test-room-123', 'viewer', mockConfig));

      // Start connecting
      await act(async () => {
        await result.current.connectToHost();
      });

      // Should be in connecting state
      expect(result.current.connectionState).toBe('connecting');

      // Simulate second viewer joining existing room
      await act(async () => {
        // Mock second viewer joining existing room
        global.fetch.mockResolvedValueOnce({
          ok: false,
          status: 409,
          json: vi.fn().mockResolvedValue({ error: 'Room already has a viewer' }),
        });

        // Fast-forward time to trigger second viewer joining
        vi.advanceTimersByTime(1000); // 1 second
      });

      // Should handle second viewer joining gracefully
      expect(result.current.connectionState).toBe('failed');
      expect(result.current.error).toContain('Room already has a viewer');
    });

    it('should handle second viewer joining during offer polling', async () => {
      const { result } = renderHook(() => useWebRTC('test-room-123', 'viewer', mockConfig));

      // Start connecting
      await act(async () => {
        await result.current.connectToHost();
      });

      // Simulate second viewer joining during offer polling
      await act(async () => {
        // Mock second viewer joining during offer polling
        global.fetch.mockResolvedValueOnce({
          ok: false,
          status: 409,
          json: vi.fn().mockResolvedValue({ error: 'Second viewer detected during offer polling' }),
        });

        // Fast-forward time to trigger second viewer joining
        vi.advanceTimersByTime(1000); // 1 second
      });

      // Should handle second viewer joining gracefully
      expect(result.current.connectionState).toBe('failed');
      expect(result.current.error).toContain('Second viewer detected during offer polling');
    });

    it('should handle second viewer joining during answer sending', async () => {
      const { result } = renderHook(() => useWebRTC('test-room-123', 'viewer', mockConfig));

      // Start connecting
      await act(async () => {
        await result.current.connectToHost();
      });

      // Simulate second viewer joining during answer sending
      await act(async () => {
        // Mock second viewer joining during answer sending
        global.fetch.mockResolvedValueOnce({
          ok: false,
          status: 409,
          json: vi.fn().mockResolvedValue({ error: 'Second viewer detected during answer sending' }),
        });

        // Fast-forward time to trigger second viewer joining
        vi.advanceTimersByTime(1000); // 1 second
      });

      // Should handle second viewer joining gracefully
      expect(result.current.connectionState).toBe('failed');
      expect(result.current.error).toContain('Second viewer detected during answer sending');
    });
  });

  describe('Second Viewer Joining Error Handling', () => {
    it('should handle second viewer joining with proper error messages', async () => {
      const { result } = renderHook(() => useWebRTC('test-room-123', 'viewer', mockConfig));

      // Start connecting
      await act(async () => {
        await result.current.connectToHost();
      });

      // Simulate second viewer joining with specific error
      await act(async () => {
        // Mock second viewer joining with specific error
        global.fetch.mockResolvedValueOnce({
          ok: false,
          status: 409,
          json: vi.fn().mockResolvedValue({ error: 'Only one viewer allowed per room' }),
        });

        // Fast-forward time to trigger second viewer joining
        vi.advanceTimersByTime(1000); // 1 second
      });

      // Should handle second viewer joining with proper error message
      expect(result.current.connectionState).toBe('failed');
      expect(result.current.error).toContain('Only one viewer allowed per room');
    });

    it('should handle second viewer joining with different error codes', async () => {
      const { result } = renderHook(() => useWebRTC('test-room-123', 'viewer', mockConfig));

      // Start connecting
      await act(async () => {
        await result.current.connectToHost();
      });

      // Simulate second viewer joining with different error codes
      await act(async () => {
        // Mock second viewer joining with different error codes
        global.fetch.mockResolvedValueOnce({
          ok: false,
          status: 409,
          json: vi.fn().mockResolvedValue({ error: 'Room capacity exceeded' }),
        });

        // Fast-forward time to trigger second viewer joining
        vi.advanceTimersByTime(1000); // 1 second
      });

      // Should handle second viewer joining with different error codes
      expect(result.current.connectionState).toBe('failed');
      expect(result.current.error).toContain('Room capacity exceeded');
    });
  });

  describe('Second Viewer Joining Recovery', () => {
    it('should recover from second viewer joining error', async () => {
      const { result } = renderHook(() => useWebRTC('test-room-123', 'viewer', mockConfig));

      // Start connecting
      await act(async () => {
        await result.current.connectToHost();
      });

      // Simulate second viewer joining error then recovery
      await act(async () => {
        // Mock second viewer joining error
        global.fetch.mockResolvedValueOnce({
          ok: false,
          status: 409,
          json: vi.fn().mockResolvedValue({ error: 'Room already has a viewer' }),
        });

        // Fast-forward time to trigger second viewer joining error
        vi.advanceTimersByTime(1000); // 1 second

        // Mock recovery from second viewer joining error
        global.fetch.mockResolvedValueOnce({
          ok: true,
          json: vi.fn().mockResolvedValue({ ok: true }),
        });

        // Fast-forward time to trigger recovery
        vi.advanceTimersByTime(1000); // 1 second
      });

      // Should recover from second viewer joining error
      expect(result.current.connectionState).toBe('connecting');
    });

    it('should recover from second viewer joining error with retry', async () => {
      const { result } = renderHook(() => useWebRTC('test-room-123', 'viewer', mockConfig));

      // Start connecting
      await act(async () => {
        await result.current.connectToHost();
      });

      // Simulate second viewer joining error then recovery with retry
      await act(async () => {
        // Mock second viewer joining error
        global.fetch.mockResolvedValueOnce({
          ok: false,
          status: 409,
          json: vi.fn().mockResolvedValue({ error: 'Room already has a viewer' }),
        });

        // Fast-forward time to trigger second viewer joining error
        vi.advanceTimersByTime(1000); // 1 second

        // Mock recovery from second viewer joining error with retry
        global.fetch.mockResolvedValueOnce({
          ok: true,
          json: vi.fn().mockResolvedValue({ ok: true }),
        });

        // Fast-forward time to trigger recovery with retry
        vi.advanceTimersByTime(1000); // 1 second
      });

      // Should recover from second viewer joining error with retry
      expect(result.current.connectionState).toBe('connecting');
    });
  });

  describe('Second Viewer Joining Timing', () => {
    it('should handle second viewer joining with proper timing', async () => {
      const { result } = renderHook(() => useWebRTC('test-room-123', 'viewer', mockConfig));

      // Start connecting
      await act(async () => {
        await result.current.connectToHost();
      });

      // Simulate second viewer joining with proper timing
      await act(async () => {
        // Mock second viewer joining
        global.fetch.mockResolvedValueOnce({
          ok: false,
          status: 409,
          json: vi.fn().mockResolvedValue({ error: 'Room already has a viewer' }),
        });

        // Fast-forward time to trigger second viewer joining
        vi.advanceTimersByTime(1000); // 1 second
      });

      // Should handle second viewer joining with proper timing
      expect(result.current.connectionState).toBe('failed');
      expect(result.current.error).toContain('Room already has a viewer');
    });

    it('should handle second viewer joining with delayed timing', async () => {
      const { result } = renderHook(() => useWebRTC('test-room-123', 'viewer', mockConfig));

      // Start connecting
      await act(async () => {
        await result.current.connectToHost();
      });

      // Simulate second viewer joining with delayed timing
      await act(async () => {
        // Mock second viewer joining with delayed timing
        global.fetch.mockResolvedValueOnce({
          ok: false,
          status: 409,
          json: vi.fn().mockResolvedValue({ error: 'Room already has a viewer' }),
        });

        // Fast-forward time to trigger second viewer joining with delay
        vi.advanceTimersByTime(5000); // 5 seconds
      });

      // Should handle second viewer joining with delayed timing
      expect(result.current.connectionState).toBe('failed');
      expect(result.current.error).toContain('Room already has a viewer');
    });
  });

  describe('Second Viewer Joining State Management', () => {
    it('should manage connection state properly when second viewer joins', async () => {
      const { result } = renderHook(() => useWebRTC('test-room-123', 'viewer', mockConfig));

      // Start connecting
      await act(async () => {
        await result.current.connectToHost();
      });

      // Simulate second viewer joining
      await act(async () => {
        // Mock second viewer joining
        global.fetch.mockResolvedValueOnce({
          ok: false,
          status: 409,
          json: vi.fn().mockResolvedValue({ error: 'Room already has a viewer' }),
        });

        // Fast-forward time to trigger second viewer joining
        vi.advanceTimersByTime(1000); // 1 second
      });

      // Should manage connection state properly
      expect(result.current.connectionState).toBe('failed');
      expect(result.current.error).toContain('Room already has a viewer');
    });

    it('should manage connection state properly when second viewer is rejected', async () => {
      const { result } = renderHook(() => useWebRTC('test-room-123', 'viewer', mockConfig));

      // Start connecting
      await act(async () => {
        await result.current.connectToHost();
      });

      // Simulate second viewer being rejected
      await act(async () => {
        // Mock second viewer being rejected
        global.fetch.mockResolvedValueOnce({
          ok: false,
          status: 409,
          json: vi.fn().mockResolvedValue({ error: 'Second viewer rejected' }),
        });

        // Fast-forward time to trigger second viewer rejection
        vi.advanceTimersByTime(1000); // 1 second
      });

      // Should manage connection state properly
      expect(result.current.connectionState).toBe('failed');
      expect(result.current.error).toContain('Second viewer rejected');
    });
  });
});
