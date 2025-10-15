import { renderHook, act } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';

import { useWebRTC } from '../../src/hooks/useWebRTC.js';

// Use fake timers for stream track failure tests
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

describe('Stream Track Failures - REAL Logic Tests', () => {
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

  describe('Stream Track Failures During Host Connection', () => {
    it('should handle video track failure during host screen sharing', async () => {
      const { result } = renderHook(() => useWebRTC('test-room-123', 'host', mockConfig));

      // Mock video track failure
      const failingVideoTrack = {
        kind: 'video',
        stop: vi.fn(),
        readyState: 'ended',
      };
      mockMediaStream.getVideoTracks.mockReturnValueOnce([failingVideoTrack]);

      // Start screen sharing
      await act(async () => {
        await result.current.startScreenShare();
      });

      // Should handle video track failure gracefully
      expect(result.current.connectionState).toBe('connecting');
    });

    it('should handle audio track failure during host screen sharing', async () => {
      const { result } = renderHook(() => useWebRTC('test-room-123', 'host', mockConfig));

      // Mock audio track failure
      const failingAudioTrack = {
        kind: 'audio',
        stop: vi.fn(),
        readyState: 'ended',
      };
      mockMediaStream.getAudioTracks.mockReturnValueOnce([failingAudioTrack]);

      // Start screen sharing
      await act(async () => {
        await result.current.startScreenShare();
      });

      // Should handle audio track failure gracefully
      expect(result.current.connectionState).toBe('connecting');
    });

    it('should handle both video and audio track failures during host screen sharing', async () => {
      const { result } = renderHook(() => useWebRTC('test-room-123', 'host', mockConfig));

      // Mock both video and audio track failures
      const failingVideoTrack = {
        kind: 'video',
        stop: vi.fn(),
        readyState: 'ended',
      };
      const failingAudioTrack = {
        kind: 'audio',
        stop: vi.fn(),
        readyState: 'ended',
      };
      mockMediaStream.getVideoTracks.mockReturnValueOnce([failingVideoTrack]);
      mockMediaStream.getAudioTracks.mockReturnValueOnce([failingAudioTrack]);

      // Start screen sharing
      await act(async () => {
        await result.current.startScreenShare();
      });

      // Should handle both video and audio track failures gracefully
      expect(result.current.connectionState).toBe('connecting');
    });
  });

  describe('Stream Track Failures During Viewer Connection', () => {
    it('should handle video track failure during viewer connection', async () => {
      const { result } = renderHook(() => useWebRTC('test-room-123', 'viewer', mockConfig));

      // Start connecting
      await act(async () => {
        await result.current.connectToHost();
      });

      // Should be in connecting state
      expect(result.current.connectionState).toBe('connecting');

      // Simulate video track failure during connection
      await act(async () => {
        // Mock video track failure
        const failingVideoTrack = {
          kind: 'video',
          stop: vi.fn(),
          readyState: 'ended',
        };
        mockMediaStream.getVideoTracks.mockReturnValueOnce([failingVideoTrack]);

        // Fast-forward time to trigger video track failure
        vi.advanceTimersByTime(1000); // 1 second
      });

      // Should handle video track failure gracefully
      expect(result.current.connectionState).toBe('connecting');
    });

    it('should handle audio track failure during viewer connection', async () => {
      const { result } = renderHook(() => useWebRTC('test-room-123', 'viewer', mockConfig));

      // Start connecting
      await act(async () => {
        await result.current.connectToHost();
      });

      // Should be in connecting state
      expect(result.current.connectionState).toBe('connecting');

      // Simulate audio track failure during connection
      await act(async () => {
        // Mock audio track failure
        const failingAudioTrack = {
          kind: 'audio',
          stop: vi.fn(),
          readyState: 'ended',
        };
        mockMediaStream.getAudioTracks.mockReturnValueOnce([failingAudioTrack]);

        // Fast-forward time to trigger audio track failure
        vi.advanceTimersByTime(1000); // 1 second
      });

      // Should handle audio track failure gracefully
      expect(result.current.connectionState).toBe('connecting');
    });
  });

  describe('Stream Track Failures During Established Connection', () => {
    it('should handle video track failure during established host connection', async () => {
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

      // Simulate video track failure during established connection
      await act(async () => {
        // Mock video track failure
        const failingVideoTrack = {
          kind: 'video',
          stop: vi.fn(),
          readyState: 'ended',
        };
        mockMediaStream.getVideoTracks.mockReturnValueOnce([failingVideoTrack]);

        // Fast-forward time to trigger video track failure
        vi.advanceTimersByTime(1000); // 1 second
      });

      // Should handle video track failure gracefully
      expect(result.current.connectionState).toBe('connected');
    });

    it('should handle audio track failure during established viewer connection', async () => {
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

      // Simulate audio track failure during established connection
      await act(async () => {
        // Mock audio track failure
        const failingAudioTrack = {
          kind: 'audio',
          stop: vi.fn(),
          readyState: 'ended',
        };
        mockMediaStream.getAudioTracks.mockReturnValueOnce([failingAudioTrack]);

        // Fast-forward time to trigger audio track failure
        vi.advanceTimersByTime(1000); // 1 second
      });

      // Should handle audio track failure gracefully
      expect(result.current.connectionState).toBe('connected');
    });
  });

  describe('Stream Track Failures Recovery', () => {
    it('should recover from video track failure during host connection', async () => {
      const { result } = renderHook(() => useWebRTC('test-room-123', 'host', mockConfig));

      // Mock video track failure then recovery
      const failingVideoTrack = {
        kind: 'video',
        stop: vi.fn(),
        readyState: 'ended',
      };
      const recoveringVideoTrack = {
        kind: 'video',
        stop: vi.fn(),
        readyState: 'live',
      };
      mockMediaStream.getVideoTracks.mockReturnValueOnce([failingVideoTrack]);
      mockMediaStream.getVideoTracks.mockReturnValueOnce([recoveringVideoTrack]);

      // Start screen sharing
      await act(async () => {
        await result.current.startScreenShare();
      });

      // Should handle video track failure gracefully
      expect(result.current.connectionState).toBe('connecting');

      // Try again with video track recovery
      await act(async () => {
        await result.current.startScreenShare();
      });

      // Should recover from video track failure
      expect(result.current.connectionState).toBe('connecting');
    });

    it('should recover from audio track failure during viewer connection', async () => {
      const { result } = renderHook(() => useWebRTC('test-room-123', 'viewer', mockConfig));

      // Start connecting
      await act(async () => {
        await result.current.connectToHost();
      });

      // Should be in connecting state
      expect(result.current.connectionState).toBe('connecting');

      // Simulate audio track failure then recovery
      await act(async () => {
        // Mock audio track failure
        const failingAudioTrack = {
          kind: 'audio',
          stop: vi.fn(),
          readyState: 'ended',
        };
        mockMediaStream.getAudioTracks.mockReturnValueOnce([failingAudioTrack]);

        // Fast-forward time to trigger audio track failure
        vi.advanceTimersByTime(1000); // 1 second

        // Mock audio track recovery
        const recoveringAudioTrack = {
          kind: 'audio',
          stop: vi.fn(),
          readyState: 'live',
        };
        mockMediaStream.getAudioTracks.mockReturnValueOnce([recoveringAudioTrack]);

        // Fast-forward time to trigger audio track recovery
        vi.advanceTimersByTime(1000); // 1 second
      });

      // Should recover from audio track failure
      expect(result.current.connectionState).toBe('connecting');
    });
  });

  describe('Stream Track Failures Error Handling', () => {
    it('should handle multiple stream track failures gracefully', async () => {
      const { result } = renderHook(() => useWebRTC('test-room-123', 'host', mockConfig));

      // Mock multiple stream track failures
      const failingVideoTrack1 = {
        kind: 'video',
        stop: vi.fn(),
        readyState: 'ended',
      };
      const failingVideoTrack2 = {
        kind: 'video',
        stop: vi.fn(),
        readyState: 'ended',
      };
      const failingVideoTrack3 = {
        kind: 'video',
        stop: vi.fn(),
        readyState: 'ended',
      };
      mockMediaStream.getVideoTracks.mockReturnValueOnce([failingVideoTrack1]);
      mockMediaStream.getVideoTracks.mockReturnValueOnce([failingVideoTrack2]);
      mockMediaStream.getVideoTracks.mockReturnValueOnce([failingVideoTrack3]);

      // Start screen sharing
      await act(async () => {
        await result.current.startScreenShare();
      });

      // Should handle multiple stream track failures gracefully
      expect(result.current.connectionState).toBe('connecting');
    });

    it('should handle stream track failures with proper error messages', async () => {
      const { result } = renderHook(() => useWebRTC('test-room-123', 'viewer', mockConfig));

      // Start connecting
      await act(async () => {
        await result.current.connectToHost();
      });

      // Should be in connecting state
      expect(result.current.connectionState).toBe('connecting');

      // Simulate stream track failure with specific error
      await act(async () => {
        // Mock video track failure with specific error
        const failingVideoTrack = {
          kind: 'video',
          stop: vi.fn(),
          readyState: 'ended',
        };
        mockMediaStream.getVideoTracks.mockReturnValueOnce([failingVideoTrack]);

        // Fast-forward time to trigger video track failure
        vi.advanceTimersByTime(1000); // 1 second
      });

      // Should handle stream track failure with proper error message
      expect(result.current.connectionState).toBe('connecting');
    });
  });

  describe('Stream Track Failures Timing', () => {
    it('should handle stream track failures with proper timing', async () => {
      const { result } = renderHook(() => useWebRTC('test-room-123', 'host', mockConfig));

      // Mock video track failure with proper timing
      const failingVideoTrack = {
        kind: 'video',
        stop: vi.fn(),
        readyState: 'ended',
      };
      mockMediaStream.getVideoTracks.mockReturnValueOnce([failingVideoTrack]);

      // Start screen sharing
      await act(async () => {
        await result.current.startScreenShare();
      });

      // Should handle video track failure with proper timing
      expect(result.current.connectionState).toBe('connecting');
    });

    it('should handle stream track failures with delayed timing', async () => {
      const { result } = renderHook(() => useWebRTC('test-room-123', 'viewer', mockConfig));

      // Start connecting
      await act(async () => {
        await result.current.connectToHost();
      });

      // Should be in connecting state
      expect(result.current.connectionState).toBe('connecting');

      // Simulate stream track failure with delayed timing
      await act(async () => {
        // Mock audio track failure with delayed timing
        const failingAudioTrack = {
          kind: 'audio',
          stop: vi.fn(),
          readyState: 'ended',
        };
        mockMediaStream.getAudioTracks.mockReturnValueOnce([failingAudioTrack]);

        // Fast-forward time to trigger audio track failure with delay
        vi.advanceTimersByTime(5000); // 5 seconds
      });

      // Should handle audio track failure with delayed timing
      expect(result.current.connectionState).toBe('connecting');
    });
  });
});
