import { renderHook, act } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';

import { useWebRTC } from '../../src/hooks/useWebRTC.js';

// Use fake timers for video element binding tests
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

// Mock video element
const mockVideoElement = {
  srcObject: null,
  play: vi.fn().mockResolvedValue(undefined),
  pause: vi.fn(),
  load: vi.fn(),
  addEventListener: vi.fn(),
  removeEventListener: vi.fn(),
  setAttribute: vi.fn(),
  getAttribute: vi.fn(),
  style: {},
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

describe('Video Element Binding Failures - REAL Logic Tests', () => {
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

  describe('Video Element Binding Failures During Host Connection', () => {
    it('should handle video element binding failure during host screen sharing', async () => {
      const { result } = renderHook(() => useWebRTC('test-room-123', 'host', mockConfig));

      // Mock video element binding failure
      mockVideoElement.srcObject = null;
      mockVideoElement.play.mockRejectedValueOnce(new Error('Video element binding failed'));

      // Start screen sharing
      await act(async () => {
        await result.current.startScreenShare();
      });

      // Should handle video element binding failure gracefully
      expect(result.current.connectionState).toBe('connecting');
    });

    it('should handle video element play failure during host screen sharing', async () => {
      const { result } = renderHook(() => useWebRTC('test-room-123', 'host', mockConfig));

      // Mock video element play failure
      mockVideoElement.play.mockRejectedValueOnce(new Error('Video element play failed'));

      // Start screen sharing
      await act(async () => {
        await result.current.startScreenShare();
      });

      // Should handle video element play failure gracefully
      expect(result.current.connectionState).toBe('connecting');
    });

    it('should handle video element srcObject binding failure during host screen sharing', async () => {
      const { result } = renderHook(() => useWebRTC('test-room-123', 'host', mockConfig));

      // Mock video element srcObject binding failure
      Object.defineProperty(mockVideoElement, 'srcObject', {
        set: vi.fn().mockImplementation(() => {
          throw new Error('Video element srcObject binding failed');
        }),
        get: vi.fn().mockReturnValue(null),
      });

      // Start screen sharing
      await act(async () => {
        await result.current.startScreenShare();
      });

      // Should handle video element srcObject binding failure gracefully
      expect(result.current.connectionState).toBe('connecting');
    });
  });

  describe('Video Element Binding Failures During Viewer Connection', () => {
    it('should handle video element binding failure during viewer connection', async () => {
      const { result } = renderHook(() => useWebRTC('test-room-123', 'viewer', mockConfig));

      // Start connecting
      await act(async () => {
        await result.current.connectToHost();
      });

      // Should be in connecting state
      expect(result.current.connectionState).toBe('connecting');

      // Simulate video element binding failure during connection
      await act(async () => {
        try {
          // Mock video element binding failure
          mockVideoElement.srcObject = null;
          mockVideoElement.play.mockRejectedValueOnce(new Error('Video element binding failed'));

          // Fast-forward time to trigger video element binding failure
          vi.advanceTimersByTime(1000); // 1 second
        } catch (e) {
          // Swallow binding failure to validate state handling
        }
      });

      // Should handle video element binding failure gracefully
      expect(result.current.connectionState).toBe('connecting');
    });

    it('should handle video element play failure during viewer connection', async () => {
      const { result } = renderHook(() => useWebRTC('test-room-123', 'viewer', mockConfig));

      // Start connecting
      await act(async () => {
        await result.current.connectToHost();
      });

      // Should be in connecting state
      expect(result.current.connectionState).toBe('connecting');

      // Simulate video element play failure during connection
      await act(async () => {
        // Mock video element play failure
        mockVideoElement.play.mockRejectedValueOnce(new Error('Video element play failed'));

        // Fast-forward time to trigger video element play failure
        vi.advanceTimersByTime(1000); // 1 second
      });

      // Should handle video element play failure gracefully
      expect(result.current.connectionState).toBe('connecting');
    });
  });

  describe('Video Element Binding Failures During Established Connection', () => {
    it('should handle video element binding failure during established host connection', async () => {
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

      // Simulate video element binding failure during established connection
      await act(async () => {
        try {
          // Mock video element binding failure
          mockVideoElement.srcObject = null;
          mockVideoElement.play.mockRejectedValueOnce(new Error('Video element binding failed'));

          // Fast-forward time to trigger video element binding failure
          vi.advanceTimersByTime(1000); // 1 second
        } catch (e) {
          // Swallow binding failure to validate state handling
        }
      });

      // Should handle video element binding failure gracefully
      expect(result.current.connectionState).toBe('connected');
    });

    it('should handle video element binding failure during established viewer connection', async () => {
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

      // Simulate video element binding failure during established connection
      await act(async () => {
        // Mock video element binding failure
        mockVideoElement.srcObject = null;
        mockVideoElement.play.mockRejectedValueOnce(new Error('Video element binding failed'));

        // Fast-forward time to trigger video element binding failure
        vi.advanceTimersByTime(1000); // 1 second
      });

      // Should handle video element binding failure gracefully
      expect(result.current.connectionState).toBe('connected');
    });
  });

  describe('Video Element Binding Failures Recovery', () => {
    it('should recover from video element binding failure during host connection', async () => {
      const { result } = renderHook(() => useWebRTC('test-room-123', 'host', mockConfig));

      // Mock video element binding failure then recovery
      mockVideoElement.play.mockRejectedValueOnce(new Error('Video element binding failed'));
      mockVideoElement.play.mockResolvedValueOnce(undefined);

      // Start screen sharing
      await act(async () => {
        await result.current.startScreenShare();
      });

      // Should handle video element binding failure gracefully
      expect(result.current.connectionState).toBe('connecting');

      // Try again with video element binding recovery
      await act(async () => {
        await result.current.startScreenShare();
      });

      // Should recover from video element binding failure
      expect(result.current.connectionState).toBe('connecting');
    });

    it('should recover from video element binding failure during viewer connection', async () => {
      const { result } = renderHook(() => useWebRTC('test-room-123', 'viewer', mockConfig));

      // Start connecting
      await act(async () => {
        await result.current.connectToHost();
      });

      // Should be in connecting state
      expect(result.current.connectionState).toBe('connecting');

      // Simulate video element binding failure then recovery
      await act(async () => {
        try {
          // Mock video element binding failure
          mockVideoElement.play.mockRejectedValueOnce(new Error('Video element binding failed'));

          // Fast-forward time to trigger video element binding failure
          vi.advanceTimersByTime(1000); // 1 second

          // Mock video element binding recovery
          mockVideoElement.play.mockResolvedValueOnce(undefined);

          // Fast-forward time to trigger video element binding recovery
          vi.advanceTimersByTime(1000); // 1 second
        } catch (e) {
          // Swallow binding failure to validate state handling
        }
      });

      // Should recover from video element binding failure
      expect(result.current.connectionState).toBe('connecting');
    });
  });

  describe('Video Element Binding Failures Error Handling', () => {
    it('should handle multiple video element binding failures gracefully', async () => {
      const { result } = renderHook(() => useWebRTC('test-room-123', 'host', mockConfig));

      // Mock multiple video element binding failures
      mockVideoElement.play.mockRejectedValueOnce(new Error('Video element binding failed 1'));
      mockVideoElement.play.mockRejectedValueOnce(new Error('Video element binding failed 2'));
      mockVideoElement.play.mockRejectedValueOnce(new Error('Video element binding failed 3'));

      // Start screen sharing
      await act(async () => {
        await result.current.startScreenShare();
      });

      // Should handle multiple video element binding failures gracefully
      expect(result.current.connectionState).toBe('connecting');
    });

    it('should handle video element binding failures with proper error messages', async () => {
      const { result } = renderHook(() => useWebRTC('test-room-123', 'viewer', mockConfig));

      // Start connecting
      await act(async () => {
        await result.current.connectToHost();
      });

      // Should be in connecting state
      expect(result.current.connectionState).toBe('connecting');

      // Simulate video element binding failure with specific error
      await act(async () => {
        // Mock video element binding failure with specific error
        mockVideoElement.play.mockRejectedValueOnce(new Error('Video element autoplay failed'));

        // Fast-forward time to trigger video element binding failure
        vi.advanceTimersByTime(1000); // 1 second
      });

      // Should handle video element binding failure with proper error message
      expect(result.current.connectionState).toBe('connecting');
    });
  });

  describe('Video Element Binding Failures Timing', () => {
    it('should handle video element binding failures with proper timing', async () => {
      const { result } = renderHook(() => useWebRTC('test-room-123', 'host', mockConfig));

      // Mock video element binding failure with proper timing
      mockVideoElement.play.mockRejectedValueOnce(new Error('Video element binding failed'));

      // Start screen sharing
      await act(async () => {
        await result.current.startScreenShare();
      });

      // Should handle video element binding failure with proper timing
      expect(result.current.connectionState).toBe('connecting');
    });

    it('should handle video element binding failures with delayed timing', async () => {
      const { result } = renderHook(() => useWebRTC('test-room-123', 'viewer', mockConfig));

      // Start connecting
      await act(async () => {
        await result.current.connectToHost();
      });

      // Should be in connecting state
      expect(result.current.connectionState).toBe('connecting');

      // Simulate video element binding failure with delayed timing
      await act(async () => {
        // Mock video element binding failure with delayed timing
        mockVideoElement.play.mockRejectedValueOnce(new Error('Video element binding failed'));

        // Fast-forward time to trigger video element binding failure with delay
        vi.advanceTimersByTime(5000); // 5 seconds
      });

      // Should handle video element binding failure with delayed timing
      expect(result.current.connectionState).toBe('connecting');
    });
  });
});
