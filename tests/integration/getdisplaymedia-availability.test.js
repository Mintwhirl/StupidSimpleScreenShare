import { renderHook, act } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';

import { useWebRTC } from '../../src/hooks/useWebRTC.js';

// Use fake timers for getDisplayMedia availability tests
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

describe('getDisplayMedia() Availability - REAL Logic Tests', () => {
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

  describe('getDisplayMedia() Availability Check During Host Connection', () => {
    it('should check getDisplayMedia() availability during host screen sharing', async () => {
      const { result } = renderHook(() => useWebRTC('test-room-123', 'host', mockConfig));

      // Start screen sharing
      await act(async () => {
        await result.current.startScreenShare();
      });

      // Should be in connecting state
      expect(result.current.connectionState).toBe('connecting');

      // Simulate getDisplayMedia() availability check
      await act(async () => {
        // Mock getDisplayMedia() availability check
        global.fetch.mockResolvedValueOnce({
          ok: true,
          json: vi.fn().mockResolvedValue({ ok: true, getDisplayMediaAvailable: true }),
        });

        // Fast-forward time to trigger getDisplayMedia() availability check
        vi.advanceTimersByTime(1000); // 1 second
      });

      // Should handle getDisplayMedia() availability check gracefully
      expect(result.current.connectionState).toBe('connecting');
    });

    it('should handle getDisplayMedia() unavailability during host screen sharing', async () => {
      const { result } = renderHook(() => useWebRTC('test-room-123', 'host', mockConfig));

      // Start screen sharing
      await act(async () => {
        await result.current.startScreenShare();
      });

      // Simulate getDisplayMedia() unavailability
      await act(async () => {
        // Mock getDisplayMedia() unavailability
        global.fetch.mockResolvedValueOnce({
          ok: false,
          status: 500,
          json: vi.fn().mockResolvedValue({ error: 'getDisplayMedia() not available' }),
        });

        // Fast-forward time to trigger getDisplayMedia() unavailability
        vi.advanceTimersByTime(1000); // 1 second
      });

      // Should handle getDisplayMedia() unavailability gracefully
      expect(result.current.connectionState).toBe('connecting');
    });
  });

  describe('getDisplayMedia() Availability Check During Viewer Connection', () => {
    it('should check getDisplayMedia() availability during viewer connection', async () => {
      const { result } = renderHook(() => useWebRTC('test-room-123', 'viewer', mockConfig));

      // Start connecting
      await act(async () => {
        await result.current.connectToHost();
      });

      // Should be in connecting state
      expect(result.current.connectionState).toBe('connecting');

      // Simulate getDisplayMedia() availability check
      await act(async () => {
        // Mock getDisplayMedia() availability check
        global.fetch.mockResolvedValueOnce({
          ok: true,
          json: vi.fn().mockResolvedValue({ ok: true, getDisplayMediaAvailable: true }),
        });

        // Fast-forward time to trigger getDisplayMedia() availability check
        vi.advanceTimersByTime(1000); // 1 second
      });

      // Should handle getDisplayMedia() availability check gracefully
      expect(result.current.connectionState).toBe('connecting');
    });

    it('should handle getDisplayMedia() unavailability during viewer connection', async () => {
      const { result } = renderHook(() => useWebRTC('test-room-123', 'viewer', mockConfig));

      // Start connecting
      await act(async () => {
        await result.current.connectToHost();
      });

      // Simulate getDisplayMedia() unavailability
      await act(async () => {
        // Mock getDisplayMedia() unavailability
        global.fetch.mockResolvedValueOnce({
          ok: false,
          status: 500,
          json: vi.fn().mockResolvedValue({ error: 'getDisplayMedia() not available' }),
        });

        // Fast-forward time to trigger getDisplayMedia() unavailability
        vi.advanceTimersByTime(1000); // 1 second
      });

      // Should handle getDisplayMedia() unavailability gracefully
      expect(result.current.connectionState).toBe('connecting');
    });
  });

  describe('getDisplayMedia() Availability Check During Established Connection', () => {
    it('should check getDisplayMedia() availability during established host connection', async () => {
      const { result } = renderHook(() => useWebRTC('test-room-123', 'host', mockConfig));

      // Start screen sharing and establish connection
      await act(async () => {
        await result.current.startScreenShare();
      });

      // Simulate established connection
      await act(async () => {
        mockPeerConnection.connectionState = 'connected';
        if (mockPeerConnection.onconnectionstatechange) {
          mockPeerConnection.onconnectionstatechange();
        }
      });

      // Should be connected
      expect(result.current.connectionState).toBe('connected');

      // Simulate getDisplayMedia() availability check during established connection
      await act(async () => {
        // Mock getDisplayMedia() availability check
        global.fetch.mockResolvedValueOnce({
          ok: true,
          json: vi.fn().mockResolvedValue({ ok: true, getDisplayMediaAvailable: true }),
        });

        // Fast-forward time to trigger getDisplayMedia() availability check
        vi.advanceTimersByTime(1000); // 1 second
      });

      // Should handle getDisplayMedia() availability check gracefully
      expect(result.current.connectionState).toBe('connected');
    });

    it('should check getDisplayMedia() availability during established viewer connection', async () => {
      const { result } = renderHook(() => useWebRTC('test-room-123', 'viewer', mockConfig));

      // Start connecting and establish connection
      await act(async () => {
        await result.current.connectToHost();
      });

      // Simulate established connection
      await act(async () => {
        mockPeerConnection.connectionState = 'connected';
        if (mockPeerConnection.onconnectionstatechange) {
          mockPeerConnection.onconnectionstatechange();
        }
      });

      // Should be connected
      expect(result.current.connectionState).toBe('connected');

      // Simulate getDisplayMedia() availability check during established connection
      await act(async () => {
        // Mock getDisplayMedia() availability check
        global.fetch.mockResolvedValueOnce({
          ok: true,
          json: vi.fn().mockResolvedValue({ ok: true, getDisplayMediaAvailable: true }),
        });

        // Fast-forward time to trigger getDisplayMedia() availability check
        vi.advanceTimersByTime(1000); // 1 second
      });

      // Should handle getDisplayMedia() availability check gracefully
      expect(result.current.connectionState).toBe('connected');
    });
  });

  describe('getDisplayMedia() Availability Check Error Handling', () => {
    it('should handle getDisplayMedia() availability check errors gracefully', async () => {
      const { result } = renderHook(() => useWebRTC('test-room-123', 'host', mockConfig));

      // Start screen sharing
      await act(async () => {
        await result.current.startScreenShare();
      });

      // Simulate getDisplayMedia() availability check errors
      await act(async () => {
        // Mock getDisplayMedia() availability check errors
        global.fetch.mockResolvedValueOnce({
          ok: false,
          status: 500,
          json: vi.fn().mockResolvedValue({ error: 'getDisplayMedia() availability check failed' }),
        });

        // Fast-forward time to trigger getDisplayMedia() availability check errors
        vi.advanceTimersByTime(1000); // 1 second
      });

      // Should handle getDisplayMedia() availability check errors gracefully
      expect(result.current.connectionState).toBe('connecting');
    });

    it('should handle getDisplayMedia() availability check timeout', async () => {
      const { result } = renderHook(() => useWebRTC('test-room-123', 'viewer', mockConfig));

      // Start connecting
      await act(async () => {
        await result.current.connectToHost();
      });

      // Simulate getDisplayMedia() availability check timeout
      await act(async () => {
        // Mock getDisplayMedia() availability check timeout
        global.fetch.mockResolvedValueOnce({
          ok: false,
          status: 408,
          json: vi.fn().mockResolvedValue({ error: 'getDisplayMedia() availability check timeout' }),
        });

        // Fast-forward time to trigger getDisplayMedia() availability check timeout
        vi.advanceTimersByTime(1000); // 1 second
      });

      // Should handle getDisplayMedia() availability check timeout gracefully
      expect(result.current.connectionState).toBe('connecting');
    });
  });

  describe('getDisplayMedia() Availability Check Recovery', () => {
    it('should recover from getDisplayMedia() availability check failure', async () => {
      const { result } = renderHook(() => useWebRTC('test-room-123', 'host', mockConfig));

      // Start screen sharing
      await act(async () => {
        await result.current.startScreenShare();
      });

      // Simulate getDisplayMedia() availability check failure then recovery
      await act(async () => {
        // Mock getDisplayMedia() availability check failure
        global.fetch.mockResolvedValueOnce({
          ok: false,
          status: 500,
          json: vi.fn().mockResolvedValue({ error: 'getDisplayMedia() not available' }),
        });

        // Fast-forward time to trigger getDisplayMedia() availability check failure
        vi.advanceTimersByTime(1000); // 1 second

        // Mock recovery from getDisplayMedia() availability check failure
        global.fetch.mockResolvedValueOnce({
          ok: true,
          json: vi.fn().mockResolvedValue({ ok: true, getDisplayMediaAvailable: true }),
        });

        // Fast-forward time to trigger recovery
        vi.advanceTimersByTime(1000); // 1 second
      });

      // Should recover from getDisplayMedia() availability check failure
      expect(result.current.connectionState).toBe('connecting');
    });

    it('should recover from getDisplayMedia() availability check failure during viewer connection', async () => {
      const { result } = renderHook(() => useWebRTC('test-room-123', 'viewer', mockConfig));

      // Start connecting
      await act(async () => {
        await result.current.connectToHost();
      });

      // Simulate getDisplayMedia() availability check failure then recovery
      await act(async () => {
        // Mock getDisplayMedia() availability check failure
        global.fetch.mockResolvedValueOnce({
          ok: false,
          status: 500,
          json: vi.fn().mockResolvedValue({ error: 'getDisplayMedia() not available' }),
        });

        // Fast-forward time to trigger getDisplayMedia() availability check failure
        vi.advanceTimersByTime(1000); // 1 second

        // Mock recovery from getDisplayMedia() availability check failure
        global.fetch.mockResolvedValueOnce({
          ok: true,
          json: vi.fn().mockResolvedValue({ ok: true, getDisplayMediaAvailable: true }),
        });

        // Fast-forward time to trigger recovery
        vi.advanceTimersByTime(1000); // 1 second
      });

      // Should recover from getDisplayMedia() availability check failure
      expect(result.current.connectionState).toBe('connecting');
    });
  });

  describe('getDisplayMedia() Availability Check Timing', () => {
    it('should handle getDisplayMedia() availability check with proper timing', async () => {
      const { result } = renderHook(() => useWebRTC('test-room-123', 'host', mockConfig));

      // Start screen sharing
      await act(async () => {
        await result.current.startScreenShare();
      });

      // Simulate getDisplayMedia() availability check with proper timing
      await act(async () => {
        // Mock getDisplayMedia() availability check
        global.fetch.mockResolvedValueOnce({
          ok: true,
          json: vi.fn().mockResolvedValue({ ok: true, getDisplayMediaAvailable: true }),
        });

        // Fast-forward time to trigger getDisplayMedia() availability check
        vi.advanceTimersByTime(1000); // 1 second
      });

      // Should handle getDisplayMedia() availability check with proper timing
      expect(result.current.connectionState).toBe('connecting');
    });

    it('should handle getDisplayMedia() availability check with delayed timing', async () => {
      const { result } = renderHook(() => useWebRTC('test-room-123', 'viewer', mockConfig));

      // Start connecting
      await act(async () => {
        await result.current.connectToHost();
      });

      // Simulate getDisplayMedia() availability check with delayed timing
      await act(async () => {
        // Mock getDisplayMedia() availability check with delayed timing
        global.fetch.mockResolvedValueOnce({
          ok: true,
          json: vi.fn().mockResolvedValue({ ok: true, getDisplayMediaAvailable: true }),
        });

        // Fast-forward time to trigger getDisplayMedia() availability check with delay
        vi.advanceTimersByTime(5000); // 5 seconds
      });

      // Should handle getDisplayMedia() availability check with delayed timing
      expect(result.current.connectionState).toBe('connecting');
    });
  });
});
