import { renderHook, act } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';

import { useWebRTC } from '../../src/hooks/useWebRTC.js';

// Use fake timers for connection state recovery tests
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

describe('Connection State Recovery - REAL Logic Tests', () => {
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

  describe('Connection State Recovery from Failed to Connecting', () => {
    it('should recover connection state from failed to connecting (host)', async () => {
      const { result } = renderHook(() => useWebRTC('test-room-123', 'host', mockConfig));

      // Start screen sharing
      await act(async () => {
        await result.current.startScreenShare();
      });

      // Simulate connection failure
      await act(async () => {
        // Mock API failure
        global.fetch.mockRejectedValueOnce(new Error('Connection failed'));

        // Fast-forward time to trigger failure
        vi.advanceTimersByTime(1000); // 1 second
      });

      // Should be in failed state
      expect(result.current.connectionState).toBe('failed');

      // Simulate connection recovery
      await act(async () => {
        // Mock API success
        global.fetch.mockResolvedValueOnce({
          ok: true,
          json: vi.fn().mockResolvedValue({ ok: true }),
        });

        // Simulate connection state change to connecting
        mockPeerConnection.connectionState = 'connecting';
        if (mockPeerConnection.onconnectionstatechange) {
          mockPeerConnection.onconnectionstatechange();
        }

        // Fast-forward time to trigger recovery
        vi.advanceTimersByTime(1000); // 1 second
      });

      // Should recover to connecting state
      expect(result.current.connectionState).toBe('connecting');
    });

    it('should recover connection state from failed to connecting (viewer)', async () => {
      const { result } = renderHook(() => useWebRTC('test-room-123', 'viewer', mockConfig));

      // Start connecting
      await act(async () => {
        await result.current.connectToHost();
      });

      // Simulate connection failure
      await act(async () => {
        // Mock API failure
        global.fetch.mockRejectedValueOnce(new Error('Connection failed'));

        // Fast-forward time to trigger failure
        vi.advanceTimersByTime(1000); // 1 second
      });

      // Should be in failed state
      expect(result.current.connectionState).toBe('failed');

      // Simulate connection recovery
      await act(async () => {
        // Mock API success
        global.fetch.mockResolvedValueOnce({
          ok: true,
          json: vi.fn().mockResolvedValue({ ok: true }),
        });

        // Simulate connection state change to connecting
        mockPeerConnection.connectionState = 'connecting';
        if (mockPeerConnection.onconnectionstatechange) {
          mockPeerConnection.onconnectionstatechange();
        }

        // Fast-forward time to trigger recovery
        vi.advanceTimersByTime(1000); // 1 second
      });

      // Should recover to connecting state
      expect(result.current.connectionState).toBe('connecting');
    });
  });

  describe('Connection State Recovery from Disconnected to Connected', () => {
    it('should recover connection state from disconnected to connected (host)', async () => {
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

      // Simulate connection disconnection
      await act(async () => {
        // Simulate connection state change to disconnected
        mockPeerConnection.connectionState = 'disconnected';
        if (mockPeerConnection.onconnectionstatechange) {
          mockPeerConnection.onconnectionstatechange();
        }
      });

      // Should be disconnected
      expect(result.current.connectionState).toBe('disconnected');

      // Simulate connection recovery
      await act(async () => {
        // Mock API success
        global.fetch.mockResolvedValueOnce({
          ok: true,
          json: vi.fn().mockResolvedValue({ ok: true }),
        });

        // Simulate connection state change to connected
        mockPeerConnection.connectionState = 'connected';
        if (mockPeerConnection.onconnectionstatechange) {
          mockPeerConnection.onconnectionstatechange();
        }

        // Fast-forward time to trigger recovery
        vi.advanceTimersByTime(1000); // 1 second
      });

      // Should recover to connected state
      expect(result.current.connectionState).toBe('connected');
    });

    it('should recover connection state from disconnected to connected (viewer)', async () => {
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

      // Simulate connection disconnection
      await act(async () => {
        // Simulate connection state change to disconnected
        mockPeerConnection.connectionState = 'disconnected';
        if (mockPeerConnection.onconnectionstatechange) {
          mockPeerConnection.onconnectionstatechange();
        }
      });

      // Should be disconnected
      expect(result.current.connectionState).toBe('disconnected');

      // Simulate connection recovery
      await act(async () => {
        // Mock API success
        global.fetch.mockResolvedValueOnce({
          ok: true,
          json: vi.fn().mockResolvedValue({ ok: true }),
        });

        // Simulate connection state change to connected
        mockPeerConnection.connectionState = 'connected';
        if (mockPeerConnection.onconnectionstatechange) {
          mockPeerConnection.onconnectionstatechange();
        }

        // Fast-forward time to trigger recovery
        vi.advanceTimersByTime(1000); // 1 second
      });

      // Should recover to connected state
      expect(result.current.connectionState).toBe('connected');
    });
  });

  describe('Connection State Recovery from ICE Connection Failed', () => {
    it('should recover connection state from ICE connection failed (host)', async () => {
      const { result } = renderHook(() => useWebRTC('test-room-123', 'host', mockConfig));

      // Start screen sharing
      await act(async () => {
        await result.current.startScreenShare();
      });

      // Simulate ICE connection failure
      await act(async () => {
        // Simulate ICE connection state change to failed
        mockPeerConnection.iceConnectionState = 'failed';
        if (mockPeerConnection.oniceconnectionstatechange) {
          mockPeerConnection.oniceconnectionstatechange();
        }
      });

      // Should be in failed state
      expect(result.current.connectionState).toBe('failed');

      // Simulate ICE connection recovery
      await act(async () => {
        // Mock API success
        global.fetch.mockResolvedValueOnce({
          ok: true,
          json: vi.fn().mockResolvedValue({ ok: true }),
        });

        // Simulate ICE connection state change to connected
        mockPeerConnection.iceConnectionState = 'connected';
        if (mockPeerConnection.oniceconnectionstatechange) {
          mockPeerConnection.oniceconnectionstatechange();
        }

        // Simulate connection state change to connected
        mockPeerConnection.connectionState = 'connected';
        if (mockPeerConnection.onconnectionstatechange) {
          mockPeerConnection.onconnectionstatechange();
        }

        // Fast-forward time to trigger recovery
        vi.advanceTimersByTime(1000); // 1 second
      });

      // Should recover to connected state
      expect(result.current.connectionState).toBe('connected');
    });

    it('should recover connection state from ICE connection failed (viewer)', async () => {
      const { result } = renderHook(() => useWebRTC('test-room-123', 'viewer', mockConfig));

      // Start connecting
      await act(async () => {
        await result.current.connectToHost();
      });

      // Simulate ICE connection failure
      await act(async () => {
        // Simulate ICE connection state change to failed
        mockPeerConnection.iceConnectionState = 'failed';
        if (mockPeerConnection.oniceconnectionstatechange) {
          mockPeerConnection.oniceconnectionstatechange();
        }
      });

      // Should be in failed state
      expect(result.current.connectionState).toBe('failed');

      // Simulate ICE connection recovery
      await act(async () => {
        // Mock API success
        global.fetch.mockResolvedValueOnce({
          ok: true,
          json: vi.fn().mockResolvedValue({ ok: true }),
        });

        // Simulate ICE connection state change to connected
        mockPeerConnection.iceConnectionState = 'connected';
        if (mockPeerConnection.oniceconnectionstatechange) {
          mockPeerConnection.oniceconnectionstatechange();
        }

        // Simulate connection state change to connected
        mockPeerConnection.connectionState = 'connected';
        if (mockPeerConnection.onconnectionstatechange) {
          mockPeerConnection.onconnectionstatechange();
        }

        // Fast-forward time to trigger recovery
        vi.advanceTimersByTime(1000); // 1 second
      });

      // Should recover to connected state
      expect(result.current.connectionState).toBe('connected');
    });
  });

  describe('Connection State Recovery from Multiple Failures', () => {
    it('should recover connection state from multiple failures (host)', async () => {
      const { result } = renderHook(() => useWebRTC('test-room-123', 'host', mockConfig));

      // Start screen sharing
      await act(async () => {
        await result.current.startScreenShare();
      });

      // Simulate multiple failures
      await act(async () => {
        // Mock multiple API failures
        global.fetch.mockRejectedValueOnce(new Error('Connection failed 1'));
        global.fetch.mockRejectedValueOnce(new Error('Connection failed 2'));
        global.fetch.mockRejectedValueOnce(new Error('Connection failed 3'));

        // Fast-forward time to trigger multiple failures
        vi.advanceTimersByTime(3000); // 3 seconds
      });

      // Should be in failed state
      expect(result.current.connectionState).toBe('failed');

      // Simulate connection recovery
      await act(async () => {
        // Mock API success
        global.fetch.mockResolvedValueOnce({
          ok: true,
          json: vi.fn().mockResolvedValue({ ok: true }),
        });

        // Simulate connection state change to connecting
        mockPeerConnection.connectionState = 'connecting';
        if (mockPeerConnection.onconnectionstatechange) {
          mockPeerConnection.onconnectionstatechange();
        }

        // Fast-forward time to trigger recovery
        vi.advanceTimersByTime(1000); // 1 second
      });

      // Should recover to connecting state
      expect(result.current.connectionState).toBe('connecting');
    });

    it('should recover connection state from multiple failures (viewer)', async () => {
      const { result } = renderHook(() => useWebRTC('test-room-123', 'viewer', mockConfig));

      // Start connecting
      await act(async () => {
        await result.current.connectToHost();
      });

      // Simulate multiple failures
      await act(async () => {
        // Mock multiple API failures
        global.fetch.mockRejectedValueOnce(new Error('Connection failed 1'));
        global.fetch.mockRejectedValueOnce(new Error('Connection failed 2'));
        global.fetch.mockRejectedValueOnce(new Error('Connection failed 3'));

        // Fast-forward time to trigger multiple failures
        vi.advanceTimersByTime(3000); // 3 seconds
      });

      // Should be in failed state
      expect(result.current.connectionState).toBe('failed');

      // Simulate connection recovery
      await act(async () => {
        // Mock API success
        global.fetch.mockResolvedValueOnce({
          ok: true,
          json: vi.fn().mockResolvedValue({ ok: true }),
        });

        // Simulate connection state change to connecting
        mockPeerConnection.connectionState = 'connecting';
        if (mockPeerConnection.onconnectionstatechange) {
          mockPeerConnection.onconnectionstatechange();
        }

        // Fast-forward time to trigger recovery
        vi.advanceTimersByTime(1000); // 1 second
      });

      // Should recover to connecting state
      expect(result.current.connectionState).toBe('connecting');
    });
  });

  describe('Connection State Recovery Timing', () => {
    it('should handle connection state recovery with proper timing (host)', async () => {
      const { result } = renderHook(() => useWebRTC('test-room-123', 'host', mockConfig));

      // Start screen sharing
      await act(async () => {
        await result.current.startScreenShare();
      });

      // Simulate connection failure
      await act(async () => {
        // Mock API failure
        global.fetch.mockRejectedValueOnce(new Error('Connection failed'));

        // Fast-forward time to trigger failure
        vi.advanceTimersByTime(1000); // 1 second
      });

      // Should be in failed state
      expect(result.current.connectionState).toBe('failed');

      // Simulate connection recovery with proper timing
      await act(async () => {
        // Mock API success
        global.fetch.mockResolvedValueOnce({
          ok: true,
          json: vi.fn().mockResolvedValue({ ok: true }),
        });

        // Simulate connection state change to connecting
        mockPeerConnection.connectionState = 'connecting';
        if (mockPeerConnection.onconnectionstatechange) {
          mockPeerConnection.onconnectionstatechange();
        }

        // Fast-forward time to trigger recovery
        vi.advanceTimersByTime(1000); // 1 second
      });

      // Should recover to connecting state
      expect(result.current.connectionState).toBe('connecting');
    });

    it('should handle connection state recovery with proper timing (viewer)', async () => {
      const { result } = renderHook(() => useWebRTC('test-room-123', 'viewer', mockConfig));

      // Start connecting
      await act(async () => {
        await result.current.connectToHost();
      });

      // Simulate connection failure
      await act(async () => {
        // Mock API failure
        global.fetch.mockRejectedValueOnce(new Error('Connection failed'));

        // Fast-forward time to trigger failure
        vi.advanceTimersByTime(1000); // 1 second
      });

      // Should be in failed state
      expect(result.current.connectionState).toBe('failed');

      // Simulate connection recovery with proper timing
      await act(async () => {
        // Mock API success
        global.fetch.mockResolvedValueOnce({
          ok: true,
          json: vi.fn().mockResolvedValue({ ok: true }),
        });

        // Simulate connection state change to connecting
        mockPeerConnection.connectionState = 'connecting';
        if (mockPeerConnection.onconnectionstatechange) {
          mockPeerConnection.onconnectionstatechange();
        }

        // Fast-forward time to trigger recovery
        vi.advanceTimersByTime(1000); // 1 second
      });

      // Should recover to connecting state
      expect(result.current.connectionState).toBe('connecting');
    });
  });

  describe('Connection State Recovery Error Handling', () => {
    it('should handle connection state recovery errors gracefully (host)', async () => {
      const { result } = renderHook(() => useWebRTC('test-room-123', 'host', mockConfig));

      // Start screen sharing
      await act(async () => {
        await result.current.startScreenShare();
      });

      // Simulate connection failure
      await act(async () => {
        // Mock API failure
        global.fetch.mockRejectedValueOnce(new Error('Connection failed'));

        // Fast-forward time to trigger failure
        vi.advanceTimersByTime(1000); // 1 second
      });

      // Should be in failed state
      expect(result.current.connectionState).toBe('failed');

      // Simulate connection recovery failure
      await act(async () => {
        // Mock API failure during recovery
        global.fetch.mockRejectedValueOnce(new Error('Recovery failed'));

        // Fast-forward time to trigger recovery failure
        vi.advanceTimersByTime(1000); // 1 second
      });

      // Should handle recovery failure gracefully
      expect(result.current.connectionState).toBe('failed');
      expect(result.current.error).toContain('Recovery failed');
    });

    it('should handle connection state recovery errors gracefully (viewer)', async () => {
      const { result } = renderHook(() => useWebRTC('test-room-123', 'viewer', mockConfig));

      // Start connecting
      await act(async () => {
        await result.current.connectToHost();
      });

      // Simulate connection failure
      await act(async () => {
        // Mock API failure
        global.fetch.mockRejectedValueOnce(new Error('Connection failed'));

        // Fast-forward time to trigger failure
        vi.advanceTimersByTime(1000); // 1 second
      });

      // Should be in failed state
      expect(result.current.connectionState).toBe('failed');

      // Simulate connection recovery failure
      await act(async () => {
        // Mock API failure during recovery
        global.fetch.mockRejectedValueOnce(new Error('Recovery failed'));

        // Fast-forward time to trigger recovery failure
        vi.advanceTimersByTime(1000); // 1 second
      });

      // Should handle recovery failure gracefully
      expect(result.current.connectionState).toBe('failed');
      expect(result.current.error).toContain('Recovery failed');
    });
  });
});
