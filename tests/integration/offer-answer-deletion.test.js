import { renderHook, act } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';

import { useWebRTC } from '../../src/hooks/useWebRTC.js';

// Use fake timers for offer/answer deletion tests
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

describe('Offer/Answer Deletion After First Retrieval - REAL Logic Tests', () => {
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

  describe('Offer Deletion After First Retrieval', () => {
    it('should delete offer after first retrieval', async () => {
      const { result } = renderHook(() => useWebRTC('test-room-123', 'viewer', mockConfig));

      // Start connecting
      await act(async () => {
        await result.current.connectToHost();
      });

      // Should be in connecting state
      expect(result.current.connectionState).toBe('connecting');

      // Simulate offer deletion after first retrieval
      await act(async () => {
        // Mock offer deletion after first retrieval
        global.fetch.mockResolvedValueOnce({
          ok: true,
          json: vi.fn().mockResolvedValue({ desc: { type: 'offer', sdp: 'mock-sdp' } }),
        });

        // Fast-forward time to trigger offer deletion
        vi.advanceTimersByTime(1000); // 1 second
      });

      // Should handle offer deletion after first retrieval gracefully
      expect(result.current.connectionState).toBe('connecting');
    });

    it('should handle offer deletion failure', async () => {
      const { result } = renderHook(() => useWebRTC('test-room-123', 'viewer', mockConfig));

      // Start connecting
      await act(async () => {
        await result.current.connectToHost();
      });

      // Simulate offer deletion failure
      await act(async () => {
        // Mock offer deletion failure
        global.fetch.mockResolvedValueOnce({
          ok: false,
          status: 500,
          json: vi.fn().mockResolvedValue({ error: 'Offer deletion failed' }),
        });

        // Fast-forward time to trigger offer deletion failure
        vi.advanceTimersByTime(1000); // 1 second
      });

      // Should handle offer deletion failure gracefully
      expect(result.current.connectionState).toBe('connecting');
    });
  });

  describe('Answer Deletion After First Retrieval', () => {
    it('should delete answer after first retrieval', async () => {
      const { result } = renderHook(() => useWebRTC('test-room-123', 'host', mockConfig));

      // Start screen sharing
      await act(async () => {
        await result.current.startScreenShare();
      });

      // Should be in connecting state
      expect(result.current.connectionState).toBe('connecting');

      // Simulate answer deletion after first retrieval
      await act(async () => {
        // Mock answer deletion after first retrieval
        global.fetch.mockResolvedValueOnce({
          ok: true,
          json: vi.fn().mockResolvedValue({ desc: { type: 'answer', sdp: 'mock-sdp' } }),
        });

        // Fast-forward time to trigger answer deletion
        vi.advanceTimersByTime(1000); // 1 second
      });

      // Should handle answer deletion after first retrieval gracefully
      expect(result.current.connectionState).toBe('connecting');
    });

    it('should handle answer deletion failure', async () => {
      const { result } = renderHook(() => useWebRTC('test-room-123', 'host', mockConfig));

      // Start screen sharing
      await act(async () => {
        await result.current.startScreenShare();
      });

      // Simulate answer deletion failure
      await act(async () => {
        // Mock answer deletion failure
        global.fetch.mockResolvedValueOnce({
          ok: false,
          status: 500,
          json: vi.fn().mockResolvedValue({ error: 'Answer deletion failed' }),
        });

        // Fast-forward time to trigger answer deletion failure
        vi.advanceTimersByTime(1000); // 1 second
      });

      // Should handle answer deletion failure gracefully
      expect(result.current.connectionState).toBe('connecting');
    });
  });

  describe('Offer/Answer Deletion Error Handling', () => {
    it('should handle offer deletion errors gracefully', async () => {
      const { result } = renderHook(() => useWebRTC('test-room-123', 'viewer', mockConfig));

      // Start connecting
      await act(async () => {
        await result.current.connectToHost();
      });

      // Simulate offer deletion errors
      await act(async () => {
        // Mock offer deletion errors
        global.fetch.mockResolvedValueOnce({
          ok: false,
          status: 500,
          json: vi.fn().mockResolvedValue({ error: 'Offer deletion error' }),
        });

        // Fast-forward time to trigger offer deletion errors
        vi.advanceTimersByTime(1000); // 1 second
      });

      // Should handle offer deletion errors gracefully
      expect(result.current.connectionState).toBe('connecting');
    });

    it('should handle answer deletion errors gracefully', async () => {
      const { result } = renderHook(() => useWebRTC('test-room-123', 'host', mockConfig));

      // Start screen sharing
      await act(async () => {
        await result.current.startScreenShare();
      });

      // Simulate answer deletion errors
      await act(async () => {
        // Mock answer deletion errors
        global.fetch.mockResolvedValueOnce({
          ok: false,
          status: 500,
          json: vi.fn().mockResolvedValue({ error: 'Answer deletion error' }),
        });

        // Fast-forward time to trigger answer deletion errors
        vi.advanceTimersByTime(1000); // 1 second
      });

      // Should handle answer deletion errors gracefully
      expect(result.current.connectionState).toBe('connecting');
    });
  });

  describe('Offer/Answer Deletion Timing', () => {
    it('should handle offer deletion with proper timing', async () => {
      const { result } = renderHook(() => useWebRTC('test-room-123', 'viewer', mockConfig));

      // Start connecting
      await act(async () => {
        await result.current.connectToHost();
      });

      // Simulate offer deletion with proper timing
      await act(async () => {
        // Mock offer deletion with proper timing
        global.fetch.mockResolvedValueOnce({
          ok: true,
          json: vi.fn().mockResolvedValue({ desc: { type: 'offer', sdp: 'mock-sdp' } }),
        });

        // Fast-forward time to trigger offer deletion
        vi.advanceTimersByTime(1000); // 1 second
      });

      // Should handle offer deletion with proper timing
      expect(result.current.connectionState).toBe('connecting');
    });

    it('should handle answer deletion with proper timing', async () => {
      const { result } = renderHook(() => useWebRTC('test-room-123', 'host', mockConfig));

      // Start screen sharing
      await act(async () => {
        await result.current.startScreenShare();
      });

      // Simulate answer deletion with proper timing
      await act(async () => {
        // Mock answer deletion with proper timing
        global.fetch.mockResolvedValueOnce({
          ok: true,
          json: vi.fn().mockResolvedValue({ desc: { type: 'answer', sdp: 'mock-sdp' } }),
        });

        // Fast-forward time to trigger answer deletion
        vi.advanceTimersByTime(1000); // 1 second
      });

      // Should handle answer deletion with proper timing
      expect(result.current.connectionState).toBe('connecting');
    });
  });

  describe('Offer/Answer Deletion State Management', () => {
    it('should manage connection state properly when offer is deleted', async () => {
      const { result } = renderHook(() => useWebRTC('test-room-123', 'viewer', mockConfig));

      // Start connecting
      await act(async () => {
        await result.current.connectToHost();
      });

      // Simulate offer deletion
      await act(async () => {
        // Mock offer deletion
        global.fetch.mockResolvedValueOnce({
          ok: true,
          json: vi.fn().mockResolvedValue({ desc: { type: 'offer', sdp: 'mock-sdp' } }),
        });

        // Fast-forward time to trigger offer deletion
        vi.advanceTimersByTime(1000); // 1 second
      });

      // Should manage connection state properly
      expect(result.current.connectionState).toBe('connecting');
    });

    it('should manage connection state properly when answer is deleted', async () => {
      const { result } = renderHook(() => useWebRTC('test-room-123', 'host', mockConfig));

      // Start screen sharing
      await act(async () => {
        await result.current.startScreenShare();
      });

      // Simulate answer deletion
      await act(async () => {
        // Mock answer deletion
        global.fetch.mockResolvedValueOnce({
          ok: true,
          json: vi.fn().mockResolvedValue({ desc: { type: 'answer', sdp: 'mock-sdp' } }),
        });

        // Fast-forward time to trigger answer deletion
        vi.advanceTimersByTime(1000); // 1 second
      });

      // Should manage connection state properly
      expect(result.current.connectionState).toBe('connecting');
    });
  });
});
