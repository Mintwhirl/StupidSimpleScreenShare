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

describe('Error State Cleanup - REAL Logic Tests', () => {
  describe('Error State Cleanup on Component Unmount', () => {
    it('should cleanup error state on component unmount', async () => {
      const { result, unmount } = renderHook(() => useWebRTC('test-room-123', 'host', mockConfig));

      // Mock getDisplayMedia to fail
      mockGetDisplayMedia.mockRejectedValueOnce(new Error('Permission denied'));

      await act(async () => {
        await result.current.startScreenShare();
      });

      // Should be in failed state
      expect(result.current.connectionState).toBe('failed');
      expect(result.current.error).toContain('Permission denied');

      unmount();

      // Error state should be cleaned up
      expect(result.current.connectionState).toBe('disconnected');
      expect(result.current.error).toBeNull();
    });

    it('should cleanup error state on component unmount during network error', async () => {
      const { result, unmount } = renderHook(() => useWebRTC('test-room-123', 'host', mockConfig));

      // Mock fetch to fail
      global.fetch.mockRejectedValueOnce(new Error('Network error'));

      await act(async () => {
        await result.current.startScreenShare();
      });

      // Should be in failed state
      expect(result.current.connectionState).toBe('failed');
      expect(result.current.error).toContain('Failed to send offer');

      unmount();

      // Error state should be cleaned up
      expect(result.current.connectionState).toBe('disconnected');
      expect(result.current.error).toBeNull();
    });

    it('should cleanup error state on component unmount during WebRTC error', async () => {
      const { result, unmount } = renderHook(() => useWebRTC('test-room-123', 'host', mockConfig));

      // Mock createOffer to fail
      mockPeerConnection.createOffer.mockRejectedValueOnce(new Error('createOffer failed'));

      await act(async () => {
        await result.current.startScreenShare();
      });

      // Should be in failed state
      expect(result.current.connectionState).toBe('failed');
      expect(result.current.error).toContain('createOffer failed');

      unmount();

      // Error state should be cleaned up
      expect(result.current.connectionState).toBe('disconnected');
      expect(result.current.error).toBeNull();
    });
  });

  describe('Error State Cleanup on State Transitions', () => {
    it('should cleanup error state when transitioning from failed to connecting', async () => {
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

      // Retry the operation
      await act(async () => {
        await result.current.startScreenShare();
      });

      // Error state should be cleaned up
      expect(result.current.connectionState).toBe('connecting');
      expect(result.current.error).toBeNull();
    });

    it('should cleanup error state when transitioning from failed to disconnected', async () => {
      const { result } = renderHook(() => useWebRTC('test-room-123', 'host', mockConfig));

      // Mock getDisplayMedia to fail
      mockGetDisplayMedia.mockRejectedValueOnce(new Error('Permission denied'));

      await act(async () => {
        await result.current.startScreenShare();
      });

      // Should be in failed state
      expect(result.current.connectionState).toBe('failed');
      expect(result.current.error).toContain('Permission denied');

      // Stop screen sharing
      await act(async () => {
        await result.current.stopScreenShare();
      });

      // Error state should be cleaned up
      expect(result.current.connectionState).toBe('disconnected');
      expect(result.current.error).toBeNull();
    });

    it('should cleanup error state when transitioning from failed to connected', async () => {
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

      // Retry the operation
      await act(async () => {
        await result.current.startScreenShare();
      });

      // Simulate connection success
      await act(async () => {
        mockPeerConnection.connectionState = 'connected';
        if (mockPeerConnection.onconnectionstatechange) {
          mockPeerConnection.onconnectionstatechange();
        }
      });

      // Error state should be cleaned up
      expect(result.current.connectionState).toBe('connected');
      expect(result.current.error).toBeNull();
    });
  });

  describe('Error State Cleanup on User Actions', () => {
    it('should cleanup error state when user retries after error', async () => {
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

      // User retries
      await act(async () => {
        await result.current.startScreenShare();
      });

      // Error state should be cleaned up
      expect(result.current.connectionState).toBe('connecting');
      expect(result.current.error).toBeNull();
    });

    it('should cleanup error state when user stops after error', async () => {
      const { result } = renderHook(() => useWebRTC('test-room-123', 'host', mockConfig));

      // Mock getDisplayMedia to fail
      mockGetDisplayMedia.mockRejectedValueOnce(new Error('Permission denied'));

      await act(async () => {
        await result.current.startScreenShare();
      });

      // Should be in failed state
      expect(result.current.connectionState).toBe('failed');
      expect(result.current.error).toContain('Permission denied');

      // User stops screen sharing
      await act(async () => {
        await result.current.stopScreenShare();
      });

      // Error state should be cleaned up
      expect(result.current.connectionState).toBe('disconnected');
      expect(result.current.error).toBeNull();
    });

    it('should cleanup error state when user disconnects after error', async () => {
      const { result } = renderHook(() => useWebRTC('test-room-123', 'viewer', mockConfig));

      // Mock fetch to fail
      global.fetch.mockRejectedValueOnce(new Error('Network error'));

      await act(async () => {
        await result.current.connectToHost();
      });

      // Should be in failed state
      expect(result.current.connectionState).toBe('failed');
      expect(result.current.error).toContain('Network error');

      // User disconnects
      await act(async () => {
        await result.current.disconnect();
      });

      // Error state should be cleaned up
      expect(result.current.connectionState).toBe('disconnected');
      expect(result.current.error).toBeNull();
    });
  });

  describe('Error State Cleanup Performance', () => {
    it('should not create memory leaks with multiple error state cleanups', async () => {
      const { result, unmount } = renderHook(() => useWebRTC('test-room-123', 'host', mockConfig));

      // Create multiple error states and cleanups
      for (let i = 0; i < 5; i++) {
        // Mock getDisplayMedia to fail
        mockGetDisplayMedia.mockRejectedValueOnce(new Error('Permission denied'));

        await act(async () => {
          await result.current.startScreenShare();
        });

        // Should be in failed state
        expect(result.current.connectionState).toBe('failed');
        expect(result.current.error).toContain('Permission denied');

        // Stop screen sharing to cleanup error state
        await act(async () => {
          await result.current.stopScreenShare();
        });

        // Error state should be cleaned up
        expect(result.current.connectionState).toBe('disconnected');
        expect(result.current.error).toBeNull();
      }

      unmount();

      // Final cleanup should work
      expect(result.current.connectionState).toBe('disconnected');
      expect(result.current.error).toBeNull();
    });

    it('should handle rapid error state cleanups', async () => {
      const { result } = renderHook(() => useWebRTC('test-room-123', 'host', mockConfig));

      // Create rapid error states and cleanups
      for (let i = 0; i < 10; i++) {
        // Mock getDisplayMedia to fail
        mockGetDisplayMedia.mockRejectedValueOnce(new Error('Permission denied'));

        await act(async () => {
          await result.current.startScreenShare();
        });

        // Should be in failed state
        expect(result.current.connectionState).toBe('failed');
        expect(result.current.error).toContain('Permission denied');

        // Stop screen sharing to cleanup error state
        await act(async () => {
          await result.current.stopScreenShare();
        });

        // Error state should be cleaned up
        expect(result.current.connectionState).toBe('disconnected');
        expect(result.current.error).toBeNull();
      }
    });
  });

  describe('Error State Cleanup Edge Cases', () => {
    it('should handle cleanup when no error state exists', async () => {
      const { result, unmount } = renderHook(() => useWebRTC('test-room-123', 'host', mockConfig));

      // Don't create any error state
      expect(result.current.connectionState).toBe('disconnected');
      expect(result.current.error).toBeNull();

      unmount();

      // Should handle cleanup gracefully
      expect(result.current.connectionState).toBe('disconnected');
      expect(result.current.error).toBeNull();
    });

    it('should handle cleanup when error state is already cleaned up', async () => {
      const { result, unmount } = renderHook(() => useWebRTC('test-room-123', 'host', mockConfig));

      // Mock getDisplayMedia to fail
      mockGetDisplayMedia.mockRejectedValueOnce(new Error('Permission denied'));

      await act(async () => {
        await result.current.startScreenShare();
      });

      // Should be in failed state
      expect(result.current.connectionState).toBe('failed');
      expect(result.current.error).toContain('Permission denied');

      // Stop screen sharing to cleanup error state
      await act(async () => {
        await result.current.stopScreenShare();
      });

      // Error state should be cleaned up
      expect(result.current.connectionState).toBe('disconnected');
      expect(result.current.error).toBeNull();

      unmount();

      // Should handle cleanup gracefully when error state is already cleaned up
      expect(result.current.connectionState).toBe('disconnected');
      expect(result.current.error).toBeNull();
    });

    it('should handle cleanup when component unmounts during error state', async () => {
      const { result, unmount } = renderHook(() => useWebRTC('test-room-123', 'host', mockConfig));

      // Mock getDisplayMedia to fail
      mockGetDisplayMedia.mockRejectedValueOnce(new Error('Permission denied'));

      await act(async () => {
        await result.current.startScreenShare();
      });

      // Should be in failed state
      expect(result.current.connectionState).toBe('failed');
      expect(result.current.error).toContain('Permission denied');

      // Unmount while in error state
      unmount();

      // Error state should be cleaned up
      expect(result.current.connectionState).toBe('disconnected');
      expect(result.current.error).toBeNull();
    });

    it('should handle cleanup when component unmounts during error recovery', async () => {
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

      // Error state should be cleaned up
      expect(result.current.connectionState).toBe('disconnected');
      expect(result.current.error).toBeNull();
    });
  });

  describe('Error State Cleanup Specific Errors', () => {
    it('should cleanup permission denied error state', async () => {
      const { result, unmount } = renderHook(() => useWebRTC('test-room-123', 'host', mockConfig));

      // Mock getDisplayMedia to fail with permission denied
      mockGetDisplayMedia.mockRejectedValueOnce(new Error('Permission denied'));

      await act(async () => {
        await result.current.startScreenShare();
      });

      // Should be in failed state
      expect(result.current.connectionState).toBe('failed');
      expect(result.current.error).toContain('Permission denied');

      unmount();

      // Error state should be cleaned up
      expect(result.current.connectionState).toBe('disconnected');
      expect(result.current.error).toBeNull();
    });

    it('should cleanup network error state', async () => {
      const { result, unmount } = renderHook(() => useWebRTC('test-room-123', 'host', mockConfig));

      // Mock fetch to fail with network error
      global.fetch.mockRejectedValueOnce(new Error('Network error'));

      await act(async () => {
        await result.current.startScreenShare();
      });

      // Should be in failed state
      expect(result.current.connectionState).toBe('failed');
      expect(result.current.error).toContain('Failed to send offer');

      unmount();

      // Error state should be cleaned up
      expect(result.current.connectionState).toBe('disconnected');
      expect(result.current.error).toBeNull();
    });

    it('should cleanup WebRTC error state', async () => {
      const { result, unmount } = renderHook(() => useWebRTC('test-room-123', 'host', mockConfig));

      // Mock createOffer to fail
      mockPeerConnection.createOffer.mockRejectedValueOnce(new Error('createOffer failed'));

      await act(async () => {
        await result.current.startScreenShare();
      });

      // Should be in failed state
      expect(result.current.connectionState).toBe('failed');
      expect(result.current.error).toContain('createOffer failed');

      unmount();

      // Error state should be cleaned up
      expect(result.current.connectionState).toBe('disconnected');
      expect(result.current.error).toBeNull();
    });

    it('should cleanup timeout error state', async () => {
      const { result, unmount } = renderHook(() => useWebRTC('test-room-123', 'viewer', mockConfig));

      // Mock fetch to always return 404 (timeout)
      global.fetch.mockResolvedValue({
        ok: false,
        status: 404,
        json: vi.fn().mockResolvedValue({ error: 'Not found' }),
      });

      await act(async () => {
        await result.current.connectToHost();
      });

      // Should be in failed state after timeout
      expect(result.current.connectionState).toBe('failed');
      expect(result.current.error).toContain('Connection timeout');

      unmount();

      // Error state should be cleaned up
      expect(result.current.connectionState).toBe('disconnected');
      expect(result.current.error).toBeNull();
    });
  });
});
