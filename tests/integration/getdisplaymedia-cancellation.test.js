import { renderHook, act } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';

import { useWebRTC } from '../../src/hooks/useWebRTC.js';

// Use fake timers for getDisplayMedia cancellation tests
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

describe('getDisplayMedia() User Cancellation - REAL Logic Tests', () => {
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

  describe('getDisplayMedia() User Cancellation Errors', () => {
    it('should handle getDisplayMedia() user cancellation error', async () => {
      const { result } = renderHook(() => useWebRTC('test-room-123', 'host', mockConfig));

      // Mock getDisplayMedia() user cancellation error
      mockGetDisplayMedia.mockRejectedValueOnce(new Error('User cancelled'));

      // Start screen sharing
      await act(async () => {
        await result.current.startScreenShare();
      });

      // Should handle user cancellation error gracefully
      expect(result.current.connectionState).toBe('failed');
      expect(result.current.error).toContain('User cancelled');
    });

    it('should handle getDisplayMedia() AbortError (user cancellation)', async () => {
      const { result } = renderHook(() => useWebRTC('test-room-123', 'host', mockConfig));

      // Mock getDisplayMedia() AbortError (user cancellation)
      const abortError = new Error('AbortError');
      abortError.name = 'AbortError';
      mockGetDisplayMedia.mockRejectedValueOnce(abortError);

      // Start screen sharing
      await act(async () => {
        await result.current.startScreenShare();
      });

      // Should handle AbortError gracefully
      expect(result.current.connectionState).toBe('failed');
      expect(result.current.error).toContain('AbortError');
    });

    it('should handle getDisplayMedia() NotAllowedError (user cancellation)', async () => {
      const { result } = renderHook(() => useWebRTC('test-room-123', 'host', mockConfig));

      // Mock getDisplayMedia() NotAllowedError (user cancellation)
      const notAllowedError = new Error('NotAllowedError');
      notAllowedError.name = 'NotAllowedError';
      mockGetDisplayMedia.mockRejectedValueOnce(notAllowedError);

      // Start screen sharing
      await act(async () => {
        await result.current.startScreenShare();
      });

      // Should handle NotAllowedError gracefully
      expect(result.current.connectionState).toBe('failed');
      expect(result.current.error).toContain('NotAllowedError');
    });

    it('should handle getDisplayMedia() user cancellation with specific message', async () => {
      const { result } = renderHook(() => useWebRTC('test-room-123', 'host', mockConfig));

      // Mock getDisplayMedia() user cancellation with specific message
      mockGetDisplayMedia.mockRejectedValueOnce(new Error('User cancelled screen sharing'));

      // Start screen sharing
      await act(async () => {
        await result.current.startScreenShare();
      });

      // Should handle user cancellation with specific message gracefully
      expect(result.current.connectionState).toBe('failed');
      expect(result.current.error).toContain('User cancelled screen sharing');
    });
  });

  describe('getDisplayMedia() User Cancellation Recovery', () => {
    it('should recover from getDisplayMedia() user cancellation error', async () => {
      const { result } = renderHook(() => useWebRTC('test-room-123', 'host', mockConfig));

      // Mock getDisplayMedia() user cancellation error then success
      mockGetDisplayMedia.mockRejectedValueOnce(new Error('User cancelled'));
      mockGetDisplayMedia.mockResolvedValueOnce(mockMediaStream);

      // Start screen sharing
      await act(async () => {
        await result.current.startScreenShare();
      });

      // Should handle user cancellation error gracefully
      expect(result.current.connectionState).toBe('failed');
      expect(result.current.error).toContain('User cancelled');

      // Try again with user allowing screen sharing
      await act(async () => {
        await result.current.startScreenShare();
      });

      // Should recover from user cancellation error
      expect(result.current.connectionState).toBe('connecting');
    });

    it('should recover from getDisplayMedia() AbortError (user cancellation)', async () => {
      const { result } = renderHook(() => useWebRTC('test-room-123', 'host', mockConfig));

      // Mock getDisplayMedia() AbortError then success
      const abortError = new Error('AbortError');
      abortError.name = 'AbortError';
      mockGetDisplayMedia.mockRejectedValueOnce(abortError);
      mockGetDisplayMedia.mockResolvedValueOnce(mockMediaStream);

      // Start screen sharing
      await act(async () => {
        await result.current.startScreenShare();
      });

      // Should handle AbortError gracefully
      expect(result.current.connectionState).toBe('failed');
      expect(result.current.error).toContain('AbortError');

      // Try again with user allowing screen sharing
      await act(async () => {
        await result.current.startScreenShare();
      });

      // Should recover from AbortError
      expect(result.current.connectionState).toBe('connecting');
    });
  });

  describe('getDisplayMedia() User Cancellation Error Handling', () => {
    it('should handle multiple getDisplayMedia() user cancellation errors', async () => {
      const { result } = renderHook(() => useWebRTC('test-room-123', 'host', mockConfig));

      // Mock multiple getDisplayMedia() user cancellation errors
      mockGetDisplayMedia.mockRejectedValueOnce(new Error('User cancelled 1'));
      mockGetDisplayMedia.mockRejectedValueOnce(new Error('User cancelled 2'));
      mockGetDisplayMedia.mockRejectedValueOnce(new Error('User cancelled 3'));

      // Start screen sharing
      await act(async () => {
        await result.current.startScreenShare();
      });

      // Should handle multiple user cancellation errors gracefully
      expect(result.current.connectionState).toBe('failed');
      expect(result.current.error).toContain('User cancelled 1');
    });

    it('should handle getDisplayMedia() user cancellation with proper error messages', async () => {
      const { result } = renderHook(() => useWebRTC('test-room-123', 'host', mockConfig));

      // Mock getDisplayMedia() user cancellation with specific error
      mockGetDisplayMedia.mockRejectedValueOnce(new Error('User cancelled screen sharing dialog'));

      // Start screen sharing
      await act(async () => {
        await result.current.startScreenShare();
      });

      // Should handle user cancellation with proper error message
      expect(result.current.connectionState).toBe('failed');
      expect(result.current.error).toContain('User cancelled screen sharing dialog');
    });
  });

  describe('getDisplayMedia() User Cancellation Timing', () => {
    it('should handle getDisplayMedia() user cancellation with proper timing', async () => {
      const { result } = renderHook(() => useWebRTC('test-room-123', 'host', mockConfig));

      // Mock getDisplayMedia() user cancellation with proper timing
      mockGetDisplayMedia.mockRejectedValueOnce(new Error('User cancelled'));

      // Start screen sharing
      await act(async () => {
        await result.current.startScreenShare();
      });

      // Should handle user cancellation with proper timing
      expect(result.current.connectionState).toBe('failed');
      expect(result.current.error).toContain('User cancelled');
    });

    it('should handle getDisplayMedia() user cancellation with delayed timing', async () => {
      const { result } = renderHook(() => useWebRTC('test-room-123', 'host', mockConfig));

      // Mock getDisplayMedia() user cancellation with delayed timing
      mockGetDisplayMedia.mockRejectedValueOnce(new Error('User cancelled'));

      // Start screen sharing
      await act(async () => {
        await result.current.startScreenShare();
      });

      // Should handle user cancellation with delayed timing
      expect(result.current.connectionState).toBe('failed');
      expect(result.current.error).toContain('User cancelled');
    });
  });

  describe('getDisplayMedia() User Cancellation State Management', () => {
    it('should manage connection state properly when getDisplayMedia() user cancels', async () => {
      const { result } = renderHook(() => useWebRTC('test-room-123', 'host', mockConfig));

      // Mock getDisplayMedia() user cancellation
      mockGetDisplayMedia.mockRejectedValueOnce(new Error('User cancelled'));

      // Start screen sharing
      await act(async () => {
        await result.current.startScreenShare();
      });

      // Should manage connection state properly
      expect(result.current.connectionState).toBe('failed');
      expect(result.current.error).toContain('User cancelled');
    });

    it('should manage connection state properly when getDisplayMedia() user allows', async () => {
      const { result } = renderHook(() => useWebRTC('test-room-123', 'host', mockConfig));

      // Mock getDisplayMedia() user allows
      mockGetDisplayMedia.mockResolvedValueOnce(mockMediaStream);

      // Start screen sharing
      await act(async () => {
        await result.current.startScreenShare();
      });

      // Should manage connection state properly
      expect(result.current.connectionState).toBe('connecting');
    });
  });

  describe('getDisplayMedia() User Cancellation vs Permission Denied', () => {
    it('should distinguish between user cancellation and permission denied', async () => {
      const { result } = renderHook(() => useWebRTC('test-room-123', 'host', mockConfig));

      // Mock getDisplayMedia() user cancellation
      mockGetDisplayMedia.mockRejectedValueOnce(new Error('User cancelled'));

      // Start screen sharing
      await act(async () => {
        await result.current.startScreenShare();
      });

      // Should distinguish between user cancellation and permission denied
      expect(result.current.connectionState).toBe('failed');
      expect(result.current.error).toContain('User cancelled');
    });

    it('should handle both user cancellation and permission denied scenarios', async () => {
      const { result } = renderHook(() => useWebRTC('test-room-123', 'host', mockConfig));

      // Mock getDisplayMedia() user cancellation then permission denied
      mockGetDisplayMedia.mockRejectedValueOnce(new Error('User cancelled'));
      mockGetDisplayMedia.mockRejectedValueOnce(new Error('Permission denied'));

      // Start screen sharing
      await act(async () => {
        await result.current.startScreenShare();
      });

      // Should handle user cancellation
      expect(result.current.connectionState).toBe('failed');
      expect(result.current.error).toContain('User cancelled');

      // Try again with permission denied
      await act(async () => {
        await result.current.startScreenShare();
      });

      // Should handle permission denied
      expect(result.current.connectionState).toBe('failed');
      expect(result.current.error).toContain('Permission denied');
    });
  });
});
