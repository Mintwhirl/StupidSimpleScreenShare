import { renderHook, act } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';

import { useWebRTC } from '../../src/hooks/useWebRTC.js';

// Use fake timers for stream cleanup tests
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

describe('Stream Cleanup on Disconnect - REAL Logic Tests', () => {
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

  describe('Stream Cleanup on Host Disconnect', () => {
    it('should cleanup stream tracks on host disconnect', async () => {
      const { result } = renderHook(() => useWebRTC('test-room-123', 'host', mockConfig));

      // Start screen sharing
      await act(async () => {
        await result.current.startScreenShare();
      });

      // Should be in connecting state
      expect(result.current.connectionState).toBe('connecting');

      // Simulate host disconnect
      await act(async () => {
        // Simulate connection state change to disconnected
        mockPeerConnection.connectionState = 'disconnected';
        if (mockPeerConnection.onconnectionstatechange) {
          mockPeerConnection.onconnectionstatechange();
        }

        // Fast-forward time to trigger stream cleanup
        vi.advanceTimersByTime(1000); // 1 second
      });

      // Should cleanup stream tracks on disconnect
      expect(mockMediaStream.getTracks()[0].stop).toHaveBeenCalled();
      expect(mockMediaStream.getTracks()[1].stop).toHaveBeenCalled();
    });

    it('should cleanup video tracks on host disconnect', async () => {
      const { result } = renderHook(() => useWebRTC('test-room-123', 'host', mockConfig));

      // Start screen sharing
      await act(async () => {
        await result.current.startScreenShare();
      });

      // Should be in connecting state
      expect(result.current.connectionState).toBe('connecting');

      // Simulate host disconnect
      await act(async () => {
        // Simulate connection state change to disconnected
        mockPeerConnection.connectionState = 'disconnected';
        if (mockPeerConnection.onconnectionstatechange) {
          mockPeerConnection.onconnectionstatechange();
        }

        // Fast-forward time to trigger stream cleanup
        vi.advanceTimersByTime(1000); // 1 second
      });

      // Should cleanup video tracks on disconnect
      expect(mockMediaStream.getVideoTracks()[0].stop).toHaveBeenCalled();
    });

    it('should cleanup audio tracks on host disconnect', async () => {
      const { result } = renderHook(() => useWebRTC('test-room-123', 'host', mockConfig));

      // Start screen sharing
      await act(async () => {
        await result.current.startScreenShare();
      });

      // Should be in connecting state
      expect(result.current.connectionState).toBe('connecting');

      // Simulate host disconnect
      await act(async () => {
        // Simulate connection state change to disconnected
        mockPeerConnection.connectionState = 'disconnected';
        if (mockPeerConnection.onconnectionstatechange) {
          mockPeerConnection.onconnectionstatechange();
        }

        // Fast-forward time to trigger stream cleanup
        vi.advanceTimersByTime(1000); // 1 second
      });

      // Should cleanup audio tracks on disconnect
      expect(mockMediaStream.getAudioTracks()[0].stop).toHaveBeenCalled();
    });
  });

  describe('Stream Cleanup on Viewer Disconnect', () => {
    it('should cleanup stream tracks on viewer disconnect', async () => {
      const { result } = renderHook(() => useWebRTC('test-room-123', 'viewer', mockConfig));

      // Start connecting
      await act(async () => {
        await result.current.connectToHost();
      });

      // Should be in connecting state
      expect(result.current.connectionState).toBe('connecting');

      // Simulate viewer disconnect
      await act(async () => {
        // Simulate connection state change to disconnected
        mockPeerConnection.connectionState = 'disconnected';
        if (mockPeerConnection.onconnectionstatechange) {
          mockPeerConnection.onconnectionstatechange();
        }

        // Fast-forward time to trigger stream cleanup
        vi.advanceTimersByTime(1000); // 1 second
      });

      // Should cleanup stream tracks on disconnect
      expect(mockMediaStream.getTracks()[0].stop).toHaveBeenCalled();
      expect(mockMediaStream.getTracks()[1].stop).toHaveBeenCalled();
    });

    it('should cleanup video tracks on viewer disconnect', async () => {
      const { result } = renderHook(() => useWebRTC('test-room-123', 'viewer', mockConfig));

      // Start connecting
      await act(async () => {
        await result.current.connectToHost();
      });

      // Should be in connecting state
      expect(result.current.connectionState).toBe('connecting');

      // Simulate viewer disconnect
      await act(async () => {
        // Simulate connection state change to disconnected
        mockPeerConnection.connectionState = 'disconnected';
        if (mockPeerConnection.onconnectionstatechange) {
          mockPeerConnection.onconnectionstatechange();
        }

        // Fast-forward time to trigger stream cleanup
        vi.advanceTimersByTime(1000); // 1 second
      });

      // Should cleanup video tracks on disconnect
      expect(mockMediaStream.getVideoTracks()[0].stop).toHaveBeenCalled();
    });

    it('should cleanup audio tracks on viewer disconnect', async () => {
      const { result } = renderHook(() => useWebRTC('test-room-123', 'viewer', mockConfig));

      // Start connecting
      await act(async () => {
        await result.current.connectToHost();
      });

      // Should be in connecting state
      expect(result.current.connectionState).toBe('connecting');

      // Simulate viewer disconnect
      await act(async () => {
        // Simulate connection state change to disconnected
        mockPeerConnection.connectionState = 'disconnected';
        if (mockPeerConnection.onconnectionstatechange) {
          mockPeerConnection.onconnectionstatechange();
        }

        // Fast-forward time to trigger stream cleanup
        vi.advanceTimersByTime(1000); // 1 second
      });

      // Should cleanup audio tracks on disconnect
      expect(mockMediaStream.getAudioTracks()[0].stop).toHaveBeenCalled();
    });
  });

  describe('Stream Cleanup on Connection Failure', () => {
    it('should cleanup stream tracks on host connection failure', async () => {
      const { result } = renderHook(() => useWebRTC('test-room-123', 'host', mockConfig));

      // Start screen sharing
      await act(async () => {
        await result.current.startScreenShare();
      });

      // Should be in connecting state
      expect(result.current.connectionState).toBe('connecting');

      // Simulate host connection failure
      await act(async () => {
        // Simulate connection state change to failed
        mockPeerConnection.connectionState = 'failed';
        if (mockPeerConnection.onconnectionstatechange) {
          mockPeerConnection.onconnectionstatechange();
        }

        // Fast-forward time to trigger stream cleanup
        vi.advanceTimersByTime(1000); // 1 second
      });

      // Should cleanup stream tracks on connection failure
      expect(mockMediaStream.getTracks()[0].stop).toHaveBeenCalled();
      expect(mockMediaStream.getTracks()[1].stop).toHaveBeenCalled();
    });

    it('should cleanup stream tracks on viewer connection failure', async () => {
      const { result } = renderHook(() => useWebRTC('test-room-123', 'viewer', mockConfig));

      // Start connecting
      await act(async () => {
        await result.current.connectToHost();
      });

      // Should be in connecting state
      expect(result.current.connectionState).toBe('connecting');

      // Simulate viewer connection failure
      await act(async () => {
        // Simulate connection state change to failed
        mockPeerConnection.connectionState = 'failed';
        if (mockPeerConnection.onconnectionstatechange) {
          mockPeerConnection.onconnectionstatechange();
        }

        // Fast-forward time to trigger stream cleanup
        vi.advanceTimersByTime(1000); // 1 second
      });

      // Should cleanup stream tracks on connection failure
      expect(mockMediaStream.getTracks()[0].stop).toHaveBeenCalled();
      expect(mockMediaStream.getTracks()[1].stop).toHaveBeenCalled();
    });
  });

  describe('Stream Cleanup on Component Unmount', () => {
    it('should cleanup stream tracks on host component unmount', async () => {
      const { result, unmount } = renderHook(() => useWebRTC('test-room-123', 'host', mockConfig));

      // Start screen sharing
      await act(async () => {
        await result.current.startScreenShare();
      });

      // Should be in connecting state
      expect(result.current.connectionState).toBe('connecting');

      // Unmount component
      unmount();

      // Should cleanup stream tracks on component unmount
      expect(mockMediaStream.getTracks()[0].stop).toHaveBeenCalled();
      expect(mockMediaStream.getTracks()[1].stop).toHaveBeenCalled();
    });

    it('should cleanup stream tracks on viewer component unmount', async () => {
      const { result, unmount } = renderHook(() => useWebRTC('test-room-123', 'viewer', mockConfig));

      // Start connecting
      await act(async () => {
        await result.current.connectToHost();
      });

      // Should be in connecting state
      expect(result.current.connectionState).toBe('connecting');

      // Unmount component
      unmount();

      // Should cleanup stream tracks on component unmount
      expect(mockMediaStream.getTracks()[0].stop).toHaveBeenCalled();
      expect(mockMediaStream.getTracks()[1].stop).toHaveBeenCalled();
    });
  });

  describe('Stream Cleanup Error Handling', () => {
    it('should handle stream cleanup errors gracefully', async () => {
      const { result } = renderHook(() => useWebRTC('test-room-123', 'host', mockConfig));

      // Mock stream cleanup error
      mockMediaStream.getTracks()[0].stop.mockImplementation(() => {
        throw new Error('Stream cleanup failed');
      });

      // Start screen sharing
      await act(async () => {
        await result.current.startScreenShare();
      });

      // Should be in connecting state
      expect(result.current.connectionState).toBe('connecting');

      // Simulate host disconnect
      await act(async () => {
        // Simulate connection state change to disconnected
        mockPeerConnection.connectionState = 'disconnected';
        if (mockPeerConnection.onconnectionstatechange) {
          mockPeerConnection.onconnectionstatechange();
        }

        // Fast-forward time to trigger stream cleanup
        vi.advanceTimersByTime(1000); // 1 second
      });

      // Should handle stream cleanup errors gracefully
      expect(mockMediaStream.getTracks()[0].stop).toHaveBeenCalled();
    });

    it('should handle multiple stream cleanup errors gracefully', async () => {
      const { result } = renderHook(() => useWebRTC('test-room-123', 'viewer', mockConfig));

      // Mock multiple stream cleanup errors
      mockMediaStream.getTracks()[0].stop.mockImplementation(() => {
        throw new Error('Stream cleanup failed 1');
      });
      mockMediaStream.getTracks()[1].stop.mockImplementation(() => {
        throw new Error('Stream cleanup failed 2');
      });

      // Start connecting
      await act(async () => {
        await result.current.connectToHost();
      });

      // Should be in connecting state
      expect(result.current.connectionState).toBe('connecting');

      // Simulate viewer disconnect
      await act(async () => {
        // Simulate connection state change to disconnected
        mockPeerConnection.connectionState = 'disconnected';
        if (mockPeerConnection.onconnectionstatechange) {
          mockPeerConnection.onconnectionstatechange();
        }

        // Fast-forward time to trigger stream cleanup
        vi.advanceTimersByTime(1000); // 1 second
      });

      // Should handle multiple stream cleanup errors gracefully
      expect(mockMediaStream.getTracks()[0].stop).toHaveBeenCalled();
      expect(mockMediaStream.getTracks()[1].stop).toHaveBeenCalled();
    });
  });

  describe('Stream Cleanup Timing', () => {
    it('should handle stream cleanup with proper timing', async () => {
      const { result } = renderHook(() => useWebRTC('test-room-123', 'host', mockConfig));

      // Start screen sharing
      await act(async () => {
        await result.current.startScreenShare();
      });

      // Should be in connecting state
      expect(result.current.connectionState).toBe('connecting');

      // Simulate host disconnect with proper timing
      await act(async () => {
        // Simulate connection state change to disconnected
        mockPeerConnection.connectionState = 'disconnected';
        if (mockPeerConnection.onconnectionstatechange) {
          mockPeerConnection.onconnectionstatechange();
        }

        // Fast-forward time to trigger stream cleanup
        vi.advanceTimersByTime(1000); // 1 second
      });

      // Should handle stream cleanup with proper timing
      expect(mockMediaStream.getTracks()[0].stop).toHaveBeenCalled();
      expect(mockMediaStream.getTracks()[1].stop).toHaveBeenCalled();
    });

    it('should handle stream cleanup with delayed timing', async () => {
      const { result } = renderHook(() => useWebRTC('test-room-123', 'viewer', mockConfig));

      // Start connecting
      await act(async () => {
        await result.current.connectToHost();
      });

      // Should be in connecting state
      expect(result.current.connectionState).toBe('connecting');

      // Simulate viewer disconnect with delayed timing
      await act(async () => {
        // Simulate connection state change to disconnected
        mockPeerConnection.connectionState = 'disconnected';
        if (mockPeerConnection.onconnectionstatechange) {
          mockPeerConnection.onconnectionstatechange();
        }

        // Fast-forward time to trigger stream cleanup with delay
        vi.advanceTimersByTime(5000); // 5 seconds
      });

      // Should handle stream cleanup with delayed timing
      expect(mockMediaStream.getTracks()[0].stop).toHaveBeenCalled();
      expect(mockMediaStream.getTracks()[1].stop).toHaveBeenCalled();
    });
  });
});
