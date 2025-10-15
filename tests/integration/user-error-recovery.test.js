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

describe('User Error Recovery Actions - REAL Logic Tests', () => {
  describe('Host Error Recovery Actions', () => {
    it('should allow user to retry screen sharing after permission denied', async () => {
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

      // User retries screen sharing
      await act(async () => {
        await result.current.startScreenShare();
      });

      // Should recover and succeed
      expect(result.current.connectionState).toBe('connecting');
      expect(result.current.error).toBeNull();
    });

    it('should allow user to retry screen sharing after network error', async () => {
      const { result } = renderHook(() => useWebRTC('test-room-123', 'host', mockConfig));

      // Mock fetch to fail with network error
      global.fetch.mockRejectedValueOnce(new Error('Network error'));

      await act(async () => {
        await result.current.startScreenShare();
      });

      // Should be in failed state
      expect(result.current.connectionState).toBe('failed');
      expect(result.current.error).toContain('Failed to send offer');

      // Mock fetch to succeed on retry
      global.fetch.mockResolvedValue({
        ok: true,
        json: vi.fn().mockResolvedValue({ ok: true }),
      });

      // User retries screen sharing
      await act(async () => {
        await result.current.startScreenShare();
      });

      // Should recover and succeed
      expect(result.current.connectionState).toBe('connecting');
      expect(result.current.error).toBeNull();
    });

    it('should allow user to retry screen sharing after WebRTC error', async () => {
      const { result } = renderHook(() => useWebRTC('test-room-123', 'host', mockConfig));

      // Mock createOffer to fail
      mockPeerConnection.createOffer.mockRejectedValueOnce(new Error('createOffer failed'));

      await act(async () => {
        await result.current.startScreenShare();
      });

      // Should be in failed state
      expect(result.current.connectionState).toBe('failed');
      expect(result.current.error).toContain('createOffer failed');

      // Mock createOffer to succeed on retry
      mockPeerConnection.createOffer.mockResolvedValueOnce({ type: 'offer', sdp: 'mock-sdp' });
      global.fetch.mockResolvedValue({
        ok: true,
        json: vi.fn().mockResolvedValue({ ok: true }),
      });

      // User retries screen sharing
      await act(async () => {
        await result.current.startScreenShare();
      });

      // Should recover and succeed
      expect(result.current.connectionState).toBe('connecting');
      expect(result.current.error).toBeNull();
    });

    it('should allow user to stop and restart screen sharing', async () => {
      const { result } = renderHook(() => useWebRTC('test-room-123', 'host', mockConfig));

      // Start screen sharing successfully
      global.fetch.mockResolvedValue({
        ok: true,
        json: vi.fn().mockResolvedValue({ ok: true }),
      });

      await act(async () => {
        await result.current.startScreenShare();
      });

      // Should be in connecting state
      expect(result.current.connectionState).toBe('connecting');

      // User stops screen sharing
      await act(async () => {
        await result.current.stopScreenShare();
      });

      // Should be in disconnected state
      expect(result.current.connectionState).toBe('disconnected');

      // User restarts screen sharing
      await act(async () => {
        await result.current.startScreenShare();
      });

      // Should be in connecting state again
      expect(result.current.connectionState).toBe('connecting');
    });
  });

  describe('Viewer Error Recovery Actions', () => {
    it('should allow user to retry connection after network error', async () => {
      const { result } = renderHook(() => useWebRTC('test-room-123', 'viewer', mockConfig));

      // Mock fetch to fail with network error
      global.fetch.mockRejectedValueOnce(new Error('Network error'));

      await act(async () => {
        await result.current.connectToHost();
      });

      // Should be in failed state
      expect(result.current.connectionState).toBe('failed');
      expect(result.current.error).toContain('Network error');

      // Mock fetch to succeed on retry
      global.fetch.mockResolvedValue({
        ok: true,
        json: vi.fn().mockResolvedValue({ desc: { type: 'offer', sdp: 'mock-sdp' } }),
      });

      // User retries connection
      await act(async () => {
        await result.current.connectToHost();
      });

      // Should recover and succeed
      expect(result.current.connectionState).toBe('connecting');
      expect(result.current.error).toBeNull();
    });

    it('should allow user to retry connection after room not found', async () => {
      const { result } = renderHook(() => useWebRTC('test-room-123', 'viewer', mockConfig));

      // Mock fetch to return room not found
      global.fetch.mockResolvedValueOnce({
        ok: false,
        status: 404,
        json: vi.fn().mockResolvedValue({ error: 'Room not found' }),
      });

      await act(async () => {
        await result.current.connectToHost();
      });

      // Should be in failed state
      expect(result.current.connectionState).toBe('failed');
      expect(result.current.error).toContain('Room not found');

      // Mock fetch to succeed on retry
      global.fetch.mockResolvedValue({
        ok: true,
        json: vi.fn().mockResolvedValue({ desc: { type: 'offer', sdp: 'mock-sdp' } }),
      });

      // User retries connection
      await act(async () => {
        await result.current.connectToHost();
      });

      // Should recover and succeed
      expect(result.current.connectionState).toBe('connecting');
      expect(result.current.error).toBeNull();
    });

    it('should allow user to retry connection after WebRTC error', async () => {
      const { result } = renderHook(() => useWebRTC('test-room-123', 'viewer', mockConfig));

      // Mock createAnswer to fail
      mockPeerConnection.createAnswer.mockRejectedValueOnce(new Error('createAnswer failed'));

      // Mock offer received to trigger createAnswer
      global.fetch.mockResolvedValueOnce({
        ok: true,
        json: vi.fn().mockResolvedValue({ desc: { type: 'offer', sdp: 'mock-sdp' } }),
      });

      await act(async () => {
        await result.current.connectToHost();
      });

      // Should be in failed state
      expect(result.current.connectionState).toBe('failed');
      expect(result.current.error).toContain('createAnswer failed');

      // Mock createAnswer to succeed on retry
      mockPeerConnection.createAnswer.mockResolvedValueOnce({ type: 'answer', sdp: 'mock-sdp' });
      global.fetch.mockResolvedValue({
        ok: true,
        json: vi.fn().mockResolvedValue({ desc: { type: 'offer', sdp: 'mock-sdp' } }),
      });

      // User retries connection
      await act(async () => {
        await result.current.connectToHost();
      });

      // Should recover and succeed
      expect(result.current.connectionState).toBe('connecting');
      expect(result.current.error).toBeNull();
    });

    it('should allow user to disconnect and reconnect', async () => {
      const { result } = renderHook(() => useWebRTC('test-room-123', 'viewer', mockConfig));

      // Start connection successfully
      global.fetch.mockResolvedValue({
        ok: true,
        json: vi.fn().mockResolvedValue({ desc: { type: 'offer', sdp: 'mock-sdp' } }),
      });

      await act(async () => {
        await result.current.connectToHost();
      });

      // Should be in connecting state
      expect(result.current.connectionState).toBe('connecting');

      // User disconnects
      await act(async () => {
        await result.current.disconnect();
      });

      // Should be in disconnected state
      expect(result.current.connectionState).toBe('disconnected');

      // User reconnects
      await act(async () => {
        await result.current.connectToHost();
      });

      // Should be in connecting state again
      expect(result.current.connectionState).toBe('connecting');
    });
  });

  describe('Error State Management', () => {
    it('should clear error state when user takes recovery action', async () => {
      const { result } = renderHook(() => useWebRTC('test-room-123', 'host', mockConfig));

      // Mock getDisplayMedia to fail
      mockGetDisplayMedia.mockRejectedValueOnce(new Error('Permission denied'));

      await act(async () => {
        await result.current.startScreenShare();
      });

      // Should have error state
      expect(result.current.connectionState).toBe('failed');
      expect(result.current.error).toContain('Permission denied');

      // Mock getDisplayMedia to succeed on retry
      mockGetDisplayMedia.mockResolvedValueOnce(mockMediaStream);
      global.fetch.mockResolvedValue({
        ok: true,
        json: vi.fn().mockResolvedValue({ ok: true }),
      });

      // User takes recovery action
      await act(async () => {
        await result.current.startScreenShare();
      });

      // Should clear error state
      expect(result.current.connectionState).toBe('connecting');
      expect(result.current.error).toBeNull();
    });

    it('should maintain error state when user action fails again', async () => {
      const { result } = renderHook(() => useWebRTC('test-room-123', 'host', mockConfig));

      // Mock getDisplayMedia to always fail
      mockGetDisplayMedia.mockRejectedValue(new Error('Permission denied'));

      await act(async () => {
        await result.current.startScreenShare();
      });

      // Should have error state
      expect(result.current.connectionState).toBe('failed');
      expect(result.current.error).toContain('Permission denied');

      // User retries but it fails again
      await act(async () => {
        await result.current.startScreenShare();
      });

      // Should maintain error state
      expect(result.current.connectionState).toBe('failed');
      expect(result.current.error).toContain('Permission denied');
    });

    it('should handle multiple error types in sequence', async () => {
      const { result } = renderHook(() => useWebRTC('test-room-123', 'host', mockConfig));

      // First error: permission denied
      mockGetDisplayMedia.mockRejectedValueOnce(new Error('Permission denied'));

      await act(async () => {
        await result.current.startScreenShare();
      });

      expect(result.current.connectionState).toBe('failed');
      expect(result.current.error).toContain('Permission denied');

      // Second error: network error
      mockGetDisplayMedia.mockResolvedValueOnce(mockMediaStream);
      global.fetch.mockRejectedValueOnce(new Error('Network error'));

      await act(async () => {
        await result.current.startScreenShare();
      });

      expect(result.current.connectionState).toBe('failed');
      expect(result.current.error).toContain('Failed to send offer');

      // Third error: WebRTC error
      global.fetch.mockResolvedValueOnce({
        ok: true,
        json: vi.fn().mockResolvedValue({ ok: true }),
      });
      mockPeerConnection.createOffer.mockRejectedValueOnce(new Error('createOffer failed'));

      await act(async () => {
        await result.current.startScreenShare();
      });

      expect(result.current.connectionState).toBe('failed');
      expect(result.current.error).toContain('createOffer failed');
    });
  });

  describe('User Error Recovery Performance', () => {
    it('should handle rapid user error recovery actions', async () => {
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

      // Rapid error recovery actions
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

    it('should not create memory leaks with multiple error recovery actions', async () => {
      const { result } = renderHook(() => useWebRTC('test-room-123', 'host', mockConfig));

      // Create multiple error recovery scenarios
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
  });

  describe('User Error Recovery Edge Cases', () => {
    it('should handle user action during error state', async () => {
      const { result } = renderHook(() => useWebRTC('test-room-123', 'host', mockConfig));

      // Mock getDisplayMedia to fail
      mockGetDisplayMedia.mockRejectedValueOnce(new Error('Permission denied'));

      await act(async () => {
        await result.current.startScreenShare();
      });

      // Should be in failed state
      expect(result.current.connectionState).toBe('failed');
      expect(result.current.error).toContain('Permission denied');

      // User tries to stop screen sharing during error state
      await act(async () => {
        await result.current.stopScreenShare();
      });

      // Should handle gracefully
      expect(result.current.connectionState).toBe('disconnected');
      expect(result.current.error).toBeNull();
    });

    it('should handle user action during connecting state', async () => {
      const { result } = renderHook(() => useWebRTC('test-room-123', 'host', mockConfig));

      // Start screen sharing successfully
      global.fetch.mockResolvedValue({
        ok: true,
        json: vi.fn().mockResolvedValue({ ok: true }),
      });

      await act(async () => {
        await result.current.startScreenShare();
      });

      // Should be in connecting state
      expect(result.current.connectionState).toBe('connecting');

      // User tries to start screen sharing again during connecting state
      await act(async () => {
        await result.current.startScreenShare();
      });

      // Should handle gracefully (may or may not change state)
      expect(result.current.connectionState).toBe('connecting');
    });

    it('should handle user action during connected state', async () => {
      const { result } = renderHook(() => useWebRTC('test-room-123', 'host', mockConfig));

      // Start screen sharing successfully
      global.fetch.mockResolvedValue({
        ok: true,
        json: vi.fn().mockResolvedValue({ ok: true }),
      });

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

      // Should be in connected state
      expect(result.current.connectionState).toBe('connected');

      // User tries to start screen sharing again during connected state
      await act(async () => {
        await result.current.startScreenShare();
      });

      // Should handle gracefully (may or may not change state)
      expect(result.current.connectionState).toBe('connected');
    });
  });
});
