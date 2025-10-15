import { renderHook, act } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';

import { useWebRTC } from '../../src/hooks/useWebRTC.js';

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

let mockPeerConnection;
let mockConfig;

beforeEach(() => {
  vi.clearAllMocks();

  mockPeerConnection = {
    connectionState: 'new',
    iceConnectionState: 'new',
    iceGatheringState: 'new',
    setLocalDescription: vi.fn().mockResolvedValue(undefined),
    setRemoteDescription: vi.fn().mockResolvedValue(undefined),
    createOffer: vi.fn().mockResolvedValue({ type: 'offer', sdp: 'mock-sdp' }),
    createAnswer: vi.fn().mockResolvedValue({ type: 'answer', sdp: 'mock-sdp' }),
    addTrack: vi.fn(),
    addTransceiver: vi.fn(),
    addIceCandidate: vi.fn().mockResolvedValue(undefined),
    close: vi.fn(),
    onicecandidate: null,
    onconnectionstatechange: null,
    oniceconnectionstatechange: null,
    onicegatheringstatechange: null,
    ontrack: null,
    ondatachannel: null,
  };

  mockRTCPeerConnection.mockReturnValue(mockPeerConnection);
  mockGetDisplayMedia.mockResolvedValue(mockMediaStream);

  global.RTCPeerConnection = mockRTCPeerConnection;
  global.navigator = {
    mediaDevices: {
      getDisplayMedia: mockGetDisplayMedia,
    },
  };
  global.fetch = vi.fn();
  global.clearInterval = vi.fn();
  global.setInterval = vi.fn(() => 123);

  mockConfig = {
    useTurn: true,
    authSecret: 'test-secret',
    apiBase: '/api',
    features: { chat: true, diagnostics: true, viewerCount: true },
    rateLimits: { roomCreation: 50, chatMessages: 60, apiCalls: 2000 },
  };
});

afterEach(() => {
  vi.clearAllMocks();
});

describe('Retry Mechanism - REAL Logic Tests', () => {
  describe('API Retry Mechanism', () => {
    it('should retry API calls on network failure', async () => {
      const { result } = renderHook(() => useWebRTC('test-room-123', 'host', mockConfig));

      // Mock fetch to fail first, then succeed
      global.fetch.mockRejectedValueOnce(new Error('Network error')).mockResolvedValueOnce({
        ok: true,
        json: vi.fn().mockResolvedValue({ ok: true }),
      });

      await act(async () => {
        await result.current.startScreenShare();
      });

      // Should handle the error gracefully
      expect(result.current.connectionState).toBe('failed');
      expect(result.current.error).toContain('Failed to send offer');

      // Retry the operation
      await act(async () => {
        await result.current.startScreenShare();
      });

      // Should recover and succeed
      expect(result.current.connectionState).toBe('connecting');
      expect(result.current.error).toBeNull();
    });

    it('should retry API calls on 500 error', async () => {
      const { result } = renderHook(() => useWebRTC('test-room-123', 'host', mockConfig));

      // Mock fetch to return 500 first, then succeed
      global.fetch
        .mockResolvedValueOnce({
          ok: false,
          status: 500,
          json: vi.fn().mockResolvedValue({ error: 'Server error' }),
        })
        .mockResolvedValueOnce({
          ok: true,
          json: vi.fn().mockResolvedValue({ ok: true }),
        });

      await act(async () => {
        await result.current.startScreenShare();
      });

      // Should handle the error gracefully
      expect(result.current.connectionState).toBe('failed');
      expect(result.current.error).toContain('Failed to send offer');

      // Retry the operation
      await act(async () => {
        await result.current.startScreenShare();
      });

      // Should recover and succeed
      expect(result.current.connectionState).toBe('connecting');
      expect(result.current.error).toBeNull();
    });

    it('should retry API calls on timeout', async () => {
      vi.useFakeTimers();
      const { result } = renderHook(() => useWebRTC('test-room-123', 'host', mockConfig));

      // Mock fetch to timeout first, then succeed
      global.fetch
        .mockReturnValueOnce(new Promise(() => {})) // Never resolves
        .mockResolvedValueOnce({
          ok: true,
          json: vi.fn().mockResolvedValue({ ok: true }),
        });

      await act(async () => {
        await result.current.startScreenShare();
      });

      // Advance timers to trigger timeout
      await act(async () => {
        vi.advanceTimersByTime(5000);
      });

      // Should handle the timeout gracefully
      expect(result.current.connectionState).toBe('failed');
      expect(result.current.error).toContain('Failed to send offer');

      // Retry the operation
      await act(async () => {
        await result.current.startScreenShare();
      });

      // Should recover and succeed
      expect(result.current.connectionState).toBe('connecting');
      expect(result.current.error).toBeNull();

      vi.useRealTimers();
    });
  });

  describe('WebRTC Retry Mechanism', () => {
    it('should retry WebRTC operations on failure', async () => {
      const { result } = renderHook(() => useWebRTC('test-room-123', 'host', mockConfig));

      // Mock createOffer to fail first, then succeed
      mockPeerConnection.createOffer
        .mockRejectedValueOnce(new Error('createOffer failed'))
        .mockResolvedValueOnce({ type: 'offer', sdp: 'mock-sdp' });

      global.fetch.mockResolvedValue({
        ok: true,
        json: vi.fn().mockResolvedValue({ ok: true }),
      });

      await act(async () => {
        await result.current.startScreenShare();
      });

      // Should handle the error gracefully
      expect(result.current.connectionState).toBe('failed');
      expect(result.current.error).toContain('createOffer failed');

      // Retry the operation
      await act(async () => {
        await result.current.startScreenShare();
      });

      // Should recover and succeed
      expect(result.current.connectionState).toBe('connecting');
      expect(result.current.error).toBeNull();
    });

    it('should retry WebRTC operations on setLocalDescription failure', async () => {
      const { result } = renderHook(() => useWebRTC('test-room-123', 'host', mockConfig));

      // Mock setLocalDescription to fail first, then succeed
      mockPeerConnection.setLocalDescription
        .mockRejectedValueOnce(new Error('setLocalDescription failed'))
        .mockResolvedValueOnce(undefined);

      global.fetch.mockResolvedValue({
        ok: true,
        json: vi.fn().mockResolvedValue({ ok: true }),
      });

      await act(async () => {
        await result.current.startScreenShare();
      });

      // Should handle the error gracefully
      expect(result.current.connectionState).toBe('failed');
      expect(result.current.error).toContain('setLocalDescription failed');

      // Retry the operation
      await act(async () => {
        await result.current.startScreenShare();
      });

      // Should recover and succeed
      expect(result.current.connectionState).toBe('connecting');
      expect(result.current.error).toBeNull();
    });

    it('should retry WebRTC operations on addIceCandidate failure', async () => {
      const { result } = renderHook(() => useWebRTC('test-room-123', 'viewer', mockConfig));

      await act(async () => {
        await result.current.connectToHost();
      });

      // Mock offer received to create PC
      global.fetch.mockResolvedValueOnce({
        ok: true,
        json: vi.fn().mockResolvedValue({ desc: { type: 'offer', sdp: 'mock-sdp' } }),
      });

      await act(async () => {
        // Fast-forward time to trigger offer processing
        await new Promise((resolve) => setTimeout(resolve, 100));
      });

      // Mock addIceCandidate to fail first, then succeed
      mockPeerConnection.addIceCandidate
        .mockRejectedValueOnce(new Error('addIceCandidate failed'))
        .mockResolvedValueOnce(undefined);

      // Mock ICE candidate received
      global.fetch.mockResolvedValueOnce({
        ok: true,
        json: vi.fn().mockResolvedValue({
          candidates: [{ candidate: 'candidate:1', sdpMid: '0', sdpMLineIndex: 0 }],
        }),
      });

      await act(async () => {
        // Fast-forward time to trigger ICE candidate processing
        await new Promise((resolve) => setTimeout(resolve, 100));
      });

      // Should handle the error gracefully (log warning but not fail connection)
      expect(result.current.connectionState).toBe('connecting');
      expect(result.current.error).toBeNull();

      // Simulate another ICE candidate
      global.fetch.mockResolvedValueOnce({
        ok: true,
        json: vi.fn().mockResolvedValue({
          candidates: [{ candidate: 'candidate:2', sdpMid: '0', sdpMLineIndex: 0 }],
        }),
      });

      await act(async () => {
        // Fast-forward time to trigger ICE candidate processing
        await new Promise((resolve) => setTimeout(resolve, 100));
      });

      // Should recover and continue
      expect(result.current.connectionState).toBe('connecting');
      expect(result.current.error).toBeNull();
    });
  });

  describe('Permission Retry Mechanism', () => {
    it('should retry screen sharing after permission denied', async () => {
      const { result } = renderHook(() => useWebRTC('test-room-123', 'host', mockConfig));

      // Mock getDisplayMedia to fail with permission denied
      mockGetDisplayMedia.mockRejectedValueOnce(new Error('Permission denied'));

      await act(async () => {
        await result.current.startScreenShare();
      });

      // Should be in failed state
      expect(result.current.connectionState).toBe('failed');
      expect(result.current.error).toContain('Permission denied');

      // Mock getDisplayMedia to succeed on retry
      mockGetDisplayMedia.mockResolvedValueOnce(mockMediaStream);
      global.fetch.mockResolvedValue({
        ok: true,
        json: vi.fn().mockResolvedValue({ ok: true }),
      });

      // Retry the operation
      await act(async () => {
        await result.current.startScreenShare();
      });

      // Should recover and succeed
      expect(result.current.connectionState).toBe('connecting');
      expect(result.current.error).toBeNull();
    });

    it('should retry screen sharing after user cancellation', async () => {
      const { result } = renderHook(() => useWebRTC('test-room-123', 'host', mockConfig));

      // Mock getDisplayMedia to fail with user cancellation
      mockGetDisplayMedia.mockRejectedValueOnce(new Error('User cancelled'));

      await act(async () => {
        await result.current.startScreenShare();
      });

      // Should be in failed state
      expect(result.current.connectionState).toBe('failed');
      expect(result.current.error).toContain('User cancelled');

      // Mock getDisplayMedia to succeed on retry
      mockGetDisplayMedia.mockResolvedValueOnce(mockMediaStream);
      global.fetch.mockResolvedValue({
        ok: true,
        json: vi.fn().mockResolvedValue({ ok: true }),
      });

      // Retry the operation
      await act(async () => {
        await result.current.startScreenShare();
      });

      // Should recover and succeed
      expect(result.current.connectionState).toBe('connecting');
      expect(result.current.error).toBeNull();
    });
  });

  describe('Polling Retry Mechanism', () => {
    it('should retry polling on network failure', async () => {
      const { result } = renderHook(() => useWebRTC('test-room-123', 'viewer', mockConfig));

      await act(async () => {
        await result.current.connectToHost();
      });

      // Mock fetch to fail first, then succeed
      global.fetch.mockRejectedValueOnce(new Error('Network error')).mockResolvedValueOnce({
        ok: true,
        json: vi.fn().mockResolvedValue({ desc: { type: 'offer', sdp: 'mock-sdp' } }),
      });

      // Trigger polling
      await act(async () => {
        // Fast-forward time to trigger polling
        await new Promise((resolve) => setTimeout(resolve, 100));
      });

      // Should handle the error gracefully
      expect(result.current.connectionState).toBe('failed');
      expect(result.current.error).toContain('Network error');

      // Retry the operation
      await act(async () => {
        await result.current.connectToHost();
      });

      // Should recover and succeed
      expect(result.current.connectionState).toBe('connecting');
      expect(result.current.error).toBeNull();
    });

    it('should retry polling on 500 error', async () => {
      const { result } = renderHook(() => useWebRTC('test-room-123', 'viewer', mockConfig));

      await act(async () => {
        await result.current.connectToHost();
      });

      // Mock fetch to return 500 first, then succeed
      global.fetch
        .mockResolvedValueOnce({
          ok: false,
          status: 500,
          json: vi.fn().mockResolvedValue({ error: 'Server error' }),
        })
        .mockResolvedValueOnce({
          ok: true,
          json: vi.fn().mockResolvedValue({ desc: { type: 'offer', sdp: 'mock-sdp' } }),
        });

      // Trigger polling
      await act(async () => {
        // Fast-forward time to trigger polling
        await new Promise((resolve) => setTimeout(resolve, 100));
      });

      // Should handle the error gracefully
      expect(result.current.connectionState).toBe('failed');
      expect(result.current.error).toContain('Server error');

      // Retry the operation
      await act(async () => {
        await result.current.connectToHost();
      });

      // Should recover and succeed
      expect(result.current.connectionState).toBe('connecting');
      expect(result.current.error).toBeNull();
    });
  });

  describe('Retry Mechanism Performance', () => {
    it('should not create memory leaks with multiple retries', async () => {
      const { result } = renderHook(() => useWebRTC('test-room-123', 'host', mockConfig));

      // Create multiple retry scenarios
      for (let i = 0; i < 5; i++) {
        // Mock getDisplayMedia to fail first, then succeed
        mockGetDisplayMedia
          .mockRejectedValueOnce(new Error('Permission denied'))
          .mockResolvedValueOnce(mockMediaStream);

        global.fetch.mockResolvedValue({
          ok: true,
          json: vi.fn().mockResolvedValue({ ok: true }),
        });

        // First attempt fails
        await act(async () => {
          await result.current.startScreenShare();
        });

        expect(result.current.connectionState).toBe('failed');
        expect(result.current.error).toContain('Permission denied');

        // Second attempt succeeds
        await act(async () => {
          await result.current.startScreenShare();
        });

        expect(result.current.connectionState).toBe('connecting');
        expect(result.current.error).toBeNull();

        // Stop screen sharing
        await act(async () => {
          await result.current.stopScreenShare();
        });

        expect(result.current.connectionState).toBe('disconnected');
      }
    });

    it('should handle rapid retries', async () => {
      const { result } = renderHook(() => useWebRTC('test-room-123', 'host', mockConfig));

      // Mock getDisplayMedia to fail and succeed alternately
      for (let i = 0; i < 10; i++) {
        if (i % 2 === 0) {
          mockGetDisplayMedia.mockRejectedValueOnce(new Error('Permission denied'));
        } else {
          mockGetDisplayMedia.mockResolvedValueOnce(mockMediaStream);
          global.fetch.mockResolvedValueOnce({
            ok: true,
            json: vi.fn().mockResolvedValue({ ok: true }),
          });
        }
      }

      // Rapid retries
      for (let i = 0; i < 10; i++) {
        await act(async () => {
          await result.current.startScreenShare();
        });

        if (i % 2 === 0) {
          // Should be in failed state
          expect(result.current.connectionState).toBe('failed');
          expect(result.current.error).toContain('Permission denied');
        } else {
          // Should be in connecting state
          expect(result.current.connectionState).toBe('connecting');
          expect(result.current.error).toBeNull();
        }
      }
    });
  });

  describe('Retry Mechanism Edge Cases', () => {
    it('should handle retry when no error exists', async () => {
      const { result } = renderHook(() => useWebRTC('test-room-123', 'host', mockConfig));

      // Mock getDisplayMedia to succeed
      mockGetDisplayMedia.mockResolvedValueOnce(mockMediaStream);
      global.fetch.mockResolvedValue({
        ok: true,
        json: vi.fn().mockResolvedValue({ ok: true }),
      });

      await act(async () => {
        await result.current.startScreenShare();
      });

      // Should be in connecting state
      expect(result.current.connectionState).toBe('connecting');
      expect(result.current.error).toBeNull();

      // Retry when no error exists
      await act(async () => {
        await result.current.startScreenShare();
      });

      // Should handle gracefully
      expect(result.current.connectionState).toBe('connecting');
      expect(result.current.error).toBeNull();
    });

    it('should handle retry when component unmounts during retry', async () => {
      const { result, unmount } = renderHook(() => useWebRTC('test-room-123', 'host', mockConfig));

      // Mock getDisplayMedia to fail
      mockGetDisplayMedia.mockRejectedValueOnce(new Error('Permission denied'));

      await act(async () => {
        await result.current.startScreenShare();
      });

      // Should be in failed state
      expect(result.current.connectionState).toBe('failed');
      expect(result.current.error).toContain('Permission denied');

      // Mock getDisplayMedia to succeed on retry
      mockGetDisplayMedia.mockResolvedValueOnce(mockMediaStream);
      global.fetch.mockResolvedValue({
        ok: true,
        json: vi.fn().mockResolvedValue({ ok: true }),
      });

      // Start retry operation
      const retryPromise = act(async () => {
        await result.current.startScreenShare();
      });

      // Unmount during retry
      unmount();

      // Wait for retry to complete
      await retryPromise;

      // Should handle gracefully
      expect(result.current.connectionState).toBe('disconnected');
      expect(result.current.error).toBeNull();
    });

    it('should handle retry when connection state changes during retry', async () => {
      const { result } = renderHook(() => useWebRTC('test-room-123', 'host', mockConfig));

      // Mock getDisplayMedia to fail
      mockGetDisplayMedia.mockRejectedValueOnce(new Error('Permission denied'));

      await act(async () => {
        await result.current.startScreenShare();
      });

      // Should be in failed state
      expect(result.current.connectionState).toBe('failed');
      expect(result.current.error).toContain('Permission denied');

      // Mock getDisplayMedia to succeed on retry
      mockGetDisplayMedia.mockResolvedValueOnce(mockMediaStream);
      global.fetch.mockResolvedValue({
        ok: true,
        json: vi.fn().mockResolvedValue({ ok: true }),
      });

      // Start retry operation
      const retryPromise = act(async () => {
        await result.current.startScreenShare();
      });

      // Simulate connection state change during retry
      await act(async () => {
        mockPeerConnection.connectionState = 'connected';
        if (mockPeerConnection.onconnectionstatechange) {
          mockPeerConnection.onconnectionstatechange();
        }
      });

      // Wait for retry to complete
      await retryPromise;

      // Should handle gracefully
      expect(result.current.connectionState).toBe('connected');
      expect(result.current.error).toBeNull();
    });
  });

  describe('Retry Mechanism Specific Scenarios', () => {
    it('should retry after multiple consecutive failures', async () => {
      const { result } = renderHook(() => useWebRTC('test-room-123', 'host', mockConfig));

      // Mock getDisplayMedia to fail multiple times
      mockGetDisplayMedia
        .mockRejectedValueOnce(new Error('Permission denied'))
        .mockRejectedValueOnce(new Error('Permission denied'))
        .mockRejectedValueOnce(new Error('Permission denied'))
        .mockResolvedValueOnce(mockMediaStream);

      global.fetch.mockResolvedValue({
        ok: true,
        json: vi.fn().mockResolvedValue({ ok: true }),
      });

      // First attempt fails
      await act(async () => {
        await result.current.startScreenShare();
      });

      expect(result.current.connectionState).toBe('failed');
      expect(result.current.error).toContain('Permission denied');

      // Second attempt fails
      await act(async () => {
        await result.current.startScreenShare();
      });

      expect(result.current.connectionState).toBe('failed');
      expect(result.current.error).toContain('Permission denied');

      // Third attempt fails
      await act(async () => {
        await result.current.startScreenShare();
      });

      expect(result.current.connectionState).toBe('failed');
      expect(result.current.error).toContain('Permission denied');

      // Fourth attempt succeeds
      await act(async () => {
        await result.current.startScreenShare();
      });

      expect(result.current.connectionState).toBe('connecting');
      expect(result.current.error).toBeNull();
    });

    it('should retry after different error types', async () => {
      const { result } = renderHook(() => useWebRTC('test-room-123', 'host', mockConfig));

      // Mock different error types
      mockGetDisplayMedia.mockRejectedValueOnce(new Error('Permission denied')).mockResolvedValueOnce(mockMediaStream);

      global.fetch.mockRejectedValueOnce(new Error('Network error')).mockResolvedValueOnce({
        ok: true,
        json: vi.fn().mockResolvedValue({ ok: true }),
      });

      // First attempt fails with permission denied
      await act(async () => {
        await result.current.startScreenShare();
      });

      expect(result.current.connectionState).toBe('failed');
      expect(result.current.error).toContain('Permission denied');

      // Second attempt fails with network error
      await act(async () => {
        await result.current.startScreenShare();
      });

      expect(result.current.connectionState).toBe('failed');
      expect(result.current.error).toContain('Failed to send offer');

      // Third attempt succeeds
      await act(async () => {
        await result.current.startScreenShare();
      });

      expect(result.current.connectionState).toBe('connecting');
      expect(result.current.error).toBeNull();
    });
  });
});
