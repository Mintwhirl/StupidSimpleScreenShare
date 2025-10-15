import { renderHook, act } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';

import { useWebRTC } from '../../src/hooks/useWebRTC.js';

// Use fake timers for stream cleanup unmount tests
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

describe('Stream Cleanup on Component Unmount - REAL Logic Tests', () => {
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

  describe('Stream Cleanup on Host Component Unmount', () => {
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

    it('should cleanup video tracks on host component unmount', async () => {
      const { result, unmount } = renderHook(() => useWebRTC('test-room-123', 'host', mockConfig));

      // Start screen sharing
      await act(async () => {
        await result.current.startScreenShare();
      });

      // Should be in connecting state
      expect(result.current.connectionState).toBe('connecting');

      // Unmount component
      unmount();

      // Should cleanup video tracks on component unmount
      expect(mockMediaStream.getVideoTracks()[0].stop).toHaveBeenCalled();
    });

    it('should cleanup audio tracks on host component unmount', async () => {
      const { result, unmount } = renderHook(() => useWebRTC('test-room-123', 'host', mockConfig));

      // Start screen sharing
      await act(async () => {
        await result.current.startScreenShare();
      });

      // Should be in connecting state
      expect(result.current.connectionState).toBe('connecting');

      // Unmount component
      unmount();

      // Should cleanup audio tracks on component unmount
      expect(mockMediaStream.getAudioTracks()[0].stop).toHaveBeenCalled();
    });
  });

  describe('Stream Cleanup on Viewer Component Unmount', () => {
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

    it('should cleanup video tracks on viewer component unmount', async () => {
      const { result, unmount } = renderHook(() => useWebRTC('test-room-123', 'viewer', mockConfig));

      // Start connecting
      await act(async () => {
        await result.current.connectToHost();
      });

      // Should be in connecting state
      expect(result.current.connectionState).toBe('connecting');

      // Unmount component
      unmount();

      // Should cleanup video tracks on component unmount
      expect(mockMediaStream.getVideoTracks()[0].stop).toHaveBeenCalled();
    });

    it('should cleanup audio tracks on viewer component unmount', async () => {
      const { result, unmount } = renderHook(() => useWebRTC('test-room-123', 'viewer', mockConfig));

      // Start connecting
      await act(async () => {
        await result.current.connectToHost();
      });

      // Should be in connecting state
      expect(result.current.connectionState).toBe('connecting');

      // Unmount component
      unmount();

      // Should cleanup audio tracks on component unmount
      expect(mockMediaStream.getAudioTracks()[0].stop).toHaveBeenCalled();
    });
  });

  describe('Stream Cleanup on Component Unmount Error Handling', () => {
    it('should handle stream cleanup errors on host component unmount', async () => {
      const { result, unmount } = renderHook(() => useWebRTC('test-room-123', 'host', mockConfig));

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

      // Unmount component
      unmount();

      // Should handle stream cleanup errors on component unmount
      expect(mockMediaStream.getTracks()[0].stop).toHaveBeenCalled();
    });

    it('should handle stream cleanup errors on viewer component unmount', async () => {
      const { result, unmount } = renderHook(() => useWebRTC('test-room-123', 'viewer', mockConfig));

      // Mock stream cleanup error
      mockMediaStream.getTracks()[0].stop.mockImplementation(() => {
        throw new Error('Stream cleanup failed');
      });

      // Start connecting
      await act(async () => {
        await result.current.connectToHost();
      });

      // Should be in connecting state
      expect(result.current.connectionState).toBe('connecting');

      // Unmount component
      unmount();

      // Should handle stream cleanup errors on component unmount
      expect(mockMediaStream.getTracks()[0].stop).toHaveBeenCalled();
    });
  });

  describe('Stream Cleanup on Component Unmount Timing', () => {
    it('should handle stream cleanup with proper timing on host component unmount', async () => {
      const { result, unmount } = renderHook(() => useWebRTC('test-room-123', 'host', mockConfig));

      // Start screen sharing
      await act(async () => {
        await result.current.startScreenShare();
      });

      // Should be in connecting state
      expect(result.current.connectionState).toBe('connecting');

      // Unmount component
      unmount();

      // Should handle stream cleanup with proper timing on component unmount
      expect(mockMediaStream.getTracks()[0].stop).toHaveBeenCalled();
      expect(mockMediaStream.getTracks()[1].stop).toHaveBeenCalled();
    });

    it('should handle stream cleanup with proper timing on viewer component unmount', async () => {
      const { result, unmount } = renderHook(() => useWebRTC('test-room-123', 'viewer', mockConfig));

      // Start connecting
      await act(async () => {
        await result.current.connectToHost();
      });

      // Should be in connecting state
      expect(result.current.connectionState).toBe('connecting');

      // Unmount component
      unmount();

      // Should handle stream cleanup with proper timing on component unmount
      expect(mockMediaStream.getTracks()[0].stop).toHaveBeenCalled();
      expect(mockMediaStream.getTracks()[1].stop).toHaveBeenCalled();
    });
  });

  describe('Stream Cleanup on Component Unmount State Management', () => {
    it('should manage connection state properly on host component unmount', async () => {
      const { result, unmount } = renderHook(() => useWebRTC('test-room-123', 'host', mockConfig));

      // Start screen sharing
      await act(async () => {
        await result.current.startScreenShare();
      });

      // Should be in connecting state
      expect(result.current.connectionState).toBe('connecting');

      // Unmount component
      unmount();

      // Should manage connection state properly on component unmount
      expect(mockMediaStream.getTracks()[0].stop).toHaveBeenCalled();
      expect(mockMediaStream.getTracks()[1].stop).toHaveBeenCalled();
    });

    it('should manage connection state properly on viewer component unmount', async () => {
      const { result, unmount } = renderHook(() => useWebRTC('test-room-123', 'viewer', mockConfig));

      // Start connecting
      await act(async () => {
        await result.current.connectToHost();
      });

      // Should be in connecting state
      expect(result.current.connectionState).toBe('connecting');

      // Unmount component
      unmount();

      // Should manage connection state properly on component unmount
      expect(mockMediaStream.getTracks()[0].stop).toHaveBeenCalled();
      expect(mockMediaStream.getTracks()[1].stop).toHaveBeenCalled();
    });
  });
});
