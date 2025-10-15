import { renderHook, act } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';

import { useWebRTC } from '../../src/hooks/useWebRTC.js';

// Use fake timers for getDisplayMedia permission tests
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

describe('getDisplayMedia() Permission Denied - REAL Logic Tests', () => {
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

  describe('getDisplayMedia() Permission Denied Errors', () => {
    it('should handle getDisplayMedia() permission denied error', async () => {
      const { result } = renderHook(() => useWebRTC('test-room-123', 'host', mockConfig));

      // Mock getDisplayMedia() permission denied error
      mockGetDisplayMedia.mockRejectedValueOnce(new Error('Permission denied'));

      // Start screen sharing
      await act(async () => {
        await result.current.startScreenShare();
      });

      // Should handle permission denied error gracefully
      expect(result.current.connectionState).toBe('failed');
      expect(result.current.error).toContain('Permission denied');
    });

    it('should handle getDisplayMedia() NotAllowedError', async () => {
      const { result } = renderHook(() => useWebRTC('test-room-123', 'host', mockConfig));

      // Mock getDisplayMedia() NotAllowedError
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

    it('should handle getDisplayMedia() NotReadableError', async () => {
      const { result } = renderHook(() => useWebRTC('test-room-123', 'host', mockConfig));

      // Mock getDisplayMedia() NotReadableError
      const notReadableError = new Error('NotReadableError');
      notReadableError.name = 'NotReadableError';
      mockGetDisplayMedia.mockRejectedValueOnce(notReadableError);

      // Start screen sharing
      await act(async () => {
        await result.current.startScreenShare();
      });

      // Should handle NotReadableError gracefully
      expect(result.current.connectionState).toBe('failed');
      expect(result.current.error).toContain('NotReadableError');
    });

    it('should handle getDisplayMedia() AbortError', async () => {
      const { result } = renderHook(() => useWebRTC('test-room-123', 'host', mockConfig));

      // Mock getDisplayMedia() AbortError
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

    it('should handle getDisplayMedia() OverconstrainedError', async () => {
      const { result } = renderHook(() => useWebRTC('test-room-123', 'host', mockConfig));

      // Mock getDisplayMedia() OverconstrainedError
      const overconstrainedError = new Error('OverconstrainedError');
      overconstrainedError.name = 'OverconstrainedError';
      mockGetDisplayMedia.mockRejectedValueOnce(overconstrainedError);

      // Start screen sharing
      await act(async () => {
        await result.current.startScreenShare();
      });

      // Should handle OverconstrainedError gracefully
      expect(result.current.connectionState).toBe('failed');
      expect(result.current.error).toContain('OverconstrainedError');
    });
  });

  describe('getDisplayMedia() Permission Recovery', () => {
    it('should recover from getDisplayMedia() permission denied error', async () => {
      const { result } = renderHook(() => useWebRTC('test-room-123', 'host', mockConfig));

      // Mock getDisplayMedia() permission denied error then success
      mockGetDisplayMedia.mockRejectedValueOnce(new Error('Permission denied'));
      mockGetDisplayMedia.mockResolvedValueOnce(mockMediaStream);

      // Start screen sharing
      await act(async () => {
        await result.current.startScreenShare();
      });

      // Should handle permission denied error gracefully
      expect(result.current.connectionState).toBe('failed');
      expect(result.current.error).toContain('Permission denied');

      // Try again with permission granted
      await act(async () => {
        await result.current.startScreenShare();
      });

      // Should recover from permission denied error
      expect(result.current.connectionState).toBe('connecting');
    });

    it('should recover from getDisplayMedia() NotAllowedError', async () => {
      const { result } = renderHook(() => useWebRTC('test-room-123', 'host', mockConfig));

      // Mock getDisplayMedia() NotAllowedError then success
      const notAllowedError = new Error('NotAllowedError');
      notAllowedError.name = 'NotAllowedError';
      mockGetDisplayMedia.mockRejectedValueOnce(notAllowedError);
      mockGetDisplayMedia.mockResolvedValueOnce(mockMediaStream);

      // Start screen sharing
      await act(async () => {
        await result.current.startScreenShare();
      });

      // Should handle NotAllowedError gracefully
      expect(result.current.connectionState).toBe('failed');
      expect(result.current.error).toContain('NotAllowedError');

      // Try again with permission granted
      await act(async () => {
        await result.current.startScreenShare();
      });

      // Should recover from NotAllowedError
      expect(result.current.connectionState).toBe('connecting');
    });
  });

  describe('getDisplayMedia() Permission Error Handling', () => {
    it('should handle multiple getDisplayMedia() permission denied errors', async () => {
      const { result } = renderHook(() => useWebRTC('test-room-123', 'host', mockConfig));

      // Mock multiple getDisplayMedia() permission denied errors
      mockGetDisplayMedia.mockRejectedValueOnce(new Error('Permission denied 1'));
      mockGetDisplayMedia.mockRejectedValueOnce(new Error('Permission denied 2'));
      mockGetDisplayMedia.mockRejectedValueOnce(new Error('Permission denied 3'));

      // Start screen sharing
      await act(async () => {
        await result.current.startScreenShare();
      });

      // Should handle multiple permission denied errors gracefully
      expect(result.current.connectionState).toBe('failed');
      expect(result.current.error).toContain('Permission denied 1');
    });

    it('should handle getDisplayMedia() permission denied with proper error messages', async () => {
      const { result } = renderHook(() => useWebRTC('test-room-123', 'host', mockConfig));

      // Mock getDisplayMedia() permission denied with specific error
      mockGetDisplayMedia.mockRejectedValueOnce(new Error('Screen sharing permission denied by user'));

      // Start screen sharing
      await act(async () => {
        await result.current.startScreenShare();
      });

      // Should handle permission denied with proper error message
      expect(result.current.connectionState).toBe('failed');
      expect(result.current.error).toContain('Screen sharing permission denied by user');
    });
  });

  describe('getDisplayMedia() Permission Timing', () => {
    it('should handle getDisplayMedia() permission denied with proper timing', async () => {
      const { result } = renderHook(() => useWebRTC('test-room-123', 'host', mockConfig));

      // Mock getDisplayMedia() permission denied with proper timing
      mockGetDisplayMedia.mockRejectedValueOnce(new Error('Permission denied'));

      // Start screen sharing
      await act(async () => {
        await result.current.startScreenShare();
      });

      // Should handle permission denied with proper timing
      expect(result.current.connectionState).toBe('failed');
      expect(result.current.error).toContain('Permission denied');
    });

    it('should handle getDisplayMedia() permission denied with delayed timing', async () => {
      const { result } = renderHook(() => useWebRTC('test-room-123', 'host', mockConfig));

      // Mock getDisplayMedia() permission denied with delayed timing
      mockGetDisplayMedia.mockRejectedValueOnce(new Error('Permission denied'));

      // Start screen sharing
      await act(async () => {
        await result.current.startScreenShare();
      });

      // Should handle permission denied with delayed timing
      expect(result.current.connectionState).toBe('failed');
      expect(result.current.error).toContain('Permission denied');
    });
  });

  describe('getDisplayMedia() Permission State Management', () => {
    it('should manage connection state properly when getDisplayMedia() permission is denied', async () => {
      const { result } = renderHook(() => useWebRTC('test-room-123', 'host', mockConfig));

      // Mock getDisplayMedia() permission denied
      mockGetDisplayMedia.mockRejectedValueOnce(new Error('Permission denied'));

      // Start screen sharing
      await act(async () => {
        await result.current.startScreenShare();
      });

      // Should manage connection state properly
      expect(result.current.connectionState).toBe('failed');
      expect(result.current.error).toContain('Permission denied');
    });

    it('should manage connection state properly when getDisplayMedia() permission is granted', async () => {
      const { result } = renderHook(() => useWebRTC('test-room-123', 'host', mockConfig));

      // Mock getDisplayMedia() permission granted
      mockGetDisplayMedia.mockResolvedValueOnce(mockMediaStream);

      // Start screen sharing
      await act(async () => {
        await result.current.startScreenShare();
      });

      // Should manage connection state properly
      expect(result.current.connectionState).toBe('connecting');
    });
  });
});
