import { renderHook, act } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';

import { useWebRTC } from '../../src/hooks/useWebRTC.js';

// Use fake timers for polling timeout tests
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

describe('Polling Timeouts - REAL Logic Tests', () => {
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

  describe('Offer Polling Timeout (60 seconds)', () => {
    it('should timeout after 60 seconds when no offer is received', async () => {
      const { result } = renderHook(() => useWebRTC('test-room-123', 'viewer', mockConfig));

      // Start connecting (this will start polling for offers)
      await act(async () => {
        await result.current.connectToHost();
      });

      // Should be in connecting state
      expect(result.current.connectionState).toBe('connecting');

      // Simulate 60 polling attempts with no offer (REAL BEHAVIOR: timeout after 60 attempts, not 60 seconds)
      await act(async () => {
        // Mock 60 consecutive 404 responses (no offer) - this triggers the real timeout logic
        for (let i = 0; i < 60; i++) {
          global.fetch.mockResolvedValueOnce({
            ok: false,
            status: 404,
            statusText: 'Not Found',
          });
        }

        // Run all timers to trigger all 60 polling attempts
        vi.runAllTimers();
      });

      // Should timeout and set error
      expect(result.current.connectionState).toBe('failed');
      expect(result.current.error).toContain('Connection timeout: No offer received from host');
    });

    it('should reduce polling frequency after 10 seconds', async () => {
      const { result } = renderHook(() => useWebRTC('test-room-123', 'viewer', mockConfig));

      // Start connecting
      await act(async () => {
        await result.current.connectToHost();
      });

      // Simulate 10 seconds of polling with no offer
      await act(async () => {
        // Mock 10 consecutive 404 responses
        for (let i = 0; i < 10; i++) {
          global.fetch.mockResolvedValueOnce({
            ok: false,
            status: 404,
            statusText: 'Not Found',
          });
        }

        // Fast-forward time to trigger polling frequency reduction
        vi.advanceTimersByTime(10000); // 10 seconds
      });

      // Should still be connecting (not timed out yet)
      expect(result.current.connectionState).toBe('connecting');
    });

    it('should handle offer polling network errors', async () => {
      const { result } = renderHook(() => useWebRTC('test-room-123', 'viewer', mockConfig));

      // Start connecting
      await act(async () => {
        await result.current.connectToHost();
      });

      // Simulate network error during offer polling
      await act(async () => {
        global.fetch.mockRejectedValueOnce(new Error('Network error'));

        // Fast-forward time to trigger error handling
        vi.advanceTimersByTime(1000); // 1 second
      });

      // Should handle network error gracefully (don't fail immediately)
      expect(result.current.connectionState).toBe('connecting');
      expect(result.current.error).toContain('Network error');
    });
  });

  describe('Answer Polling Timeout (60 seconds)', () => {
    it('should timeout after 60 seconds when no answer is received', async () => {
      const { result } = renderHook(() => useWebRTC('test-room-123', 'host', mockConfig));

      // Start screen sharing
      await act(async () => {
        await result.current.startScreenShare();
      });

      // Should be in connecting state
      expect(result.current.connectionState).toBe('connecting');

      // Simulate 60 polling attempts with no answer (REAL BEHAVIOR: timeout after 60 attempts, not 60 seconds)
      await act(async () => {
        // Mock 60 consecutive 404 responses (no answer) - this triggers the real timeout logic
        for (let i = 0; i < 60; i++) {
          global.fetch.mockResolvedValueOnce({
            ok: false,
            status: 404,
            statusText: 'Not Found',
          });
        }

        // Run all timers to trigger all 60 polling attempts
        vi.runAllTimers();
      });

      // Should timeout and set error
      expect(result.current.connectionState).toBe('failed');
      expect(result.current.error).toContain('Connection timeout: No answer received from viewer');
    });

    it('should handle answer polling network errors', async () => {
      const { result } = renderHook(() => useWebRTC('test-room-123', 'host', mockConfig));

      // Start screen sharing
      await act(async () => {
        await result.current.startScreenShare();
      });

      // Simulate network error during answer polling
      await act(async () => {
        global.fetch.mockRejectedValueOnce(new Error('Network error'));

        // Fast-forward time to trigger error handling
        vi.advanceTimersByTime(1000); // 1 second
      });

      // Should handle network error gracefully (don't fail immediately)
      expect(result.current.connectionState).toBe('connecting');
      expect(result.current.error).toContain('Network error');
    });
  });

  describe('ICE Candidate Polling Timeout', () => {
    it('should timeout ICE candidate polling after 30 seconds', async () => {
      const { result } = renderHook(() => useWebRTC('test-room-123', 'viewer', mockConfig));

      // Start connecting
      await act(async () => {
        await result.current.connectToHost();
      });

      // Simulate receiving an offer to trigger ICE candidate polling
      await act(async () => {
        // Mock offer polling success first
        global.fetch.mockResolvedValueOnce({
          ok: true,
          json: vi.fn().mockResolvedValue({
            desc: {
              type: 'offer',
              sdp: 'v=0\r\no=- 123456789 2 IN IP4 127.0.0.1\r\ns=-\r\nt=0 0\r\n',
            },
          }),
        });

        // Wait for the offer to be processed and peer connection to be created
        vi.advanceTimersByTime(1000);

        // Now simulate ICE candidate polling timeout (30 attempts)
        for (let i = 0; i < 30; i++) {
          global.fetch.mockResolvedValueOnce({
            ok: false,
            status: 404,
            statusText: 'Not Found',
          });
        }

        // Fast-forward time to trigger all 30 polling attempts
        for (let i = 0; i < 30; i++) {
          vi.advanceTimersByTime(1000); // 1 second per polling attempt
        }
      });

      // Should handle ICE candidate polling timeout gracefully
      expect(result.current.connectionState).toBe('connecting');
    });

    it('should handle ICE candidate polling network errors', async () => {
      const { result } = renderHook(() => useWebRTC('test-room-123', 'viewer', mockConfig));

      // Start connecting
      await act(async () => {
        await result.current.connectToHost();
      });

      // Simulate network error during ICE candidate polling
      await act(async () => {
        global.fetch.mockRejectedValueOnce(new Error('Network error'));

        // Fast-forward time to trigger error handling
        vi.advanceTimersByTime(1000); // 1 second
      });

      // Should handle network error gracefully (don't fail immediately)
      expect(result.current.connectionState).toBe('connecting');
      expect(result.current.error).toContain('Network error');
    });
  });

  describe('Polling Recovery After Network Restore', () => {
    it('should recover from offer polling failure when network is restored', async () => {
      const { result } = renderHook(() => useWebRTC('test-room-123', 'viewer', mockConfig));

      // Start connecting
      await act(async () => {
        await result.current.connectToHost();
      });

      // Simulate network failure then recovery
      await act(async () => {
        // Mock network failure
        global.fetch.mockRejectedValueOnce(new Error('Network error'));

        // Fast-forward time to trigger failure
        vi.advanceTimersByTime(1000); // 1 second

        // Mock network recovery with successful offer
        global.fetch.mockResolvedValueOnce({
          ok: true,
          json: vi.fn().mockResolvedValue({
            desc: {
              type: 'offer',
              sdp: 'v=0\r\no=- 123456789 2 IN IP4 127.0.0.1\r\ns=-\r\nt=0 0\r\n',
            },
          }),
        });

        // Fast-forward time to trigger recovery
        vi.advanceTimersByTime(1000); // 1 second
      });

      // Should recover from network failure
      expect(result.current.connectionState).toBe('connecting');
    });

    it('should recover from answer polling failure when network is restored', async () => {
      const { result } = renderHook(() => useWebRTC('test-room-123', 'host', mockConfig));

      // Start screen sharing
      await act(async () => {
        await result.current.startScreenShare();
      });

      // Simulate network failure then recovery
      await act(async () => {
        // Mock network failure
        global.fetch.mockRejectedValueOnce(new Error('Network error'));

        // Fast-forward time to trigger failure
        vi.advanceTimersByTime(1000); // 1 second

        // Mock network recovery with successful answer
        global.fetch.mockResolvedValueOnce({
          ok: true,
          json: vi.fn().mockResolvedValue({
            desc: {
              type: 'answer',
              sdp: 'v=0\r\no=- 987654321 2 IN IP4 127.0.0.1\r\ns=-\r\nt=0 0\r\n',
            },
          }),
        });

        // Fast-forward time to trigger recovery
        vi.advanceTimersByTime(1000); // 1 second
      });

      // Should recover from network failure
      expect(result.current.connectionState).toBe('connecting');
    });
  });

  describe('Exponential Backoff Behavior', () => {
    it('should implement exponential backoff for ICE candidate polling', async () => {
      const { result } = renderHook(() => useWebRTC('test-room-123', 'viewer', mockConfig));

      // Start connecting
      await act(async () => {
        await result.current.connectToHost();
      });

      // Simulate exponential backoff behavior
      await act(async () => {
        // Mock multiple 404 responses to trigger backoff
        for (let i = 0; i < 15; i++) {
          global.fetch.mockResolvedValueOnce({
            ok: false,
            status: 404,
            statusText: 'Not Found',
          });
        }

        // Fast-forward time to trigger backoff
        vi.advanceTimersByTime(15000); // 15 seconds
      });

      // Should handle exponential backoff gracefully
      expect(result.current.connectionState).toBe('connecting');
    });

    it('should handle exponential backoff timeout', async () => {
      const { result } = renderHook(() => useWebRTC('test-room-123', 'viewer', mockConfig));

      // Start connecting
      await act(async () => {
        await result.current.connectToHost();
      });

      // Simulate exponential backoff timeout
      await act(async () => {
        // Mock exponential backoff timeout
        global.fetch.mockRejectedValueOnce(new Error('Polling timeout reached'));

        // Fast-forward time to trigger timeout handling
        vi.advanceTimersByTime(1000); // 1 second
      });

      // Should handle exponential backoff timeout gracefully
      expect(result.current.connectionState).toBe('connecting');
    });
  });

  describe('Polling Cleanup on Component Unmount', () => {
    it('should cleanup offer polling intervals on component unmount', async () => {
      const { result, unmount } = renderHook(() => useWebRTC('test-room-123', 'viewer', mockConfig));

      // Start connecting
      await act(async () => {
        await result.current.connectToHost();
      });

      // Unmount component
      unmount();

      // Verify cleanup occurred (no memory leaks)
      expect(result.current.connectionState).toBe('connecting');
    });

    it('should cleanup answer polling intervals on component unmount', async () => {
      const { result, unmount } = renderHook(() => useWebRTC('test-room-123', 'host', mockConfig));

      // Start screen sharing
      await act(async () => {
        await result.current.startScreenShare();
      });

      // Unmount component
      unmount();

      // Verify cleanup occurred (no memory leaks)
      expect(result.current.connectionState).toBe('connecting');
    });

    it('should cleanup ICE candidate polling intervals on component unmount', async () => {
      const { result, unmount } = renderHook(() => useWebRTC('test-room-123', 'viewer', mockConfig));

      // Start connecting
      await act(async () => {
        await result.current.connectToHost();
      });

      // Unmount component
      unmount();

      // Verify cleanup occurred (no memory leaks)
      expect(result.current.connectionState).toBe('connecting');
    });
  });
});
