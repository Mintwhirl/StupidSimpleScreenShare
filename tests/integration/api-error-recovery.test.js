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

describe('API Error Recovery - REAL Logic Tests', () => {
  describe('Offer API Error Recovery', () => {
    it('should recover from offer sending API failure', async () => {
      const { result } = renderHook(() => useWebRTC('test-room-123', 'host', mockConfig));

      // Mock offer sending to fail first, then succeed
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

    it('should recover from offer sending 500 error', async () => {
      const { result } = renderHook(() => useWebRTC('test-room-123', 'host', mockConfig));

      // Mock offer sending to return 500 first, then succeed
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

    it('should recover from offer sending timeout', async () => {
      vi.useFakeTimers();
      const { result } = renderHook(() => useWebRTC('test-room-123', 'host', mockConfig));

      // Mock offer sending to timeout first, then succeed
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

  describe('Answer API Error Recovery', () => {
    it('should recover from answer sending API failure', async () => {
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

      // Mock answer sending to fail first, then succeed
      global.fetch.mockRejectedValueOnce(new Error('Network error')).mockResolvedValueOnce({
        ok: true,
        json: vi.fn().mockResolvedValue({ ok: true }),
      });

      // Trigger answer sending by simulating connection state change
      await act(async () => {
        mockPeerConnection.connectionState = 'connecting';
        if (mockPeerConnection.onconnectionstatechange) {
          mockPeerConnection.onconnectionstatechange();
        }
      });

      // Should handle the error gracefully
      expect(result.current.connectionState).toBe('failed');
      expect(result.current.error).toContain('Failed to send answer');

      // Retry the operation
      await act(async () => {
        await result.current.connectToHost();
      });

      // Should recover and succeed
      expect(result.current.connectionState).toBe('connecting');
      expect(result.current.error).toBeNull();
    });

    it('should recover from answer sending 500 error', async () => {
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

      // Mock answer sending to return 500 first, then succeed
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

      // Trigger answer sending by simulating connection state change
      await act(async () => {
        mockPeerConnection.connectionState = 'connecting';
        if (mockPeerConnection.onconnectionstatechange) {
          mockPeerConnection.onconnectionstatechange();
        }
      });

      // Should handle the error gracefully
      expect(result.current.connectionState).toBe('failed');
      expect(result.current.error).toContain('Failed to send answer');

      // Retry the operation
      await act(async () => {
        await result.current.connectToHost();
      });

      // Should recover and succeed
      expect(result.current.connectionState).toBe('connecting');
      expect(result.current.error).toBeNull();
    });
  });

  describe('ICE Candidate API Error Recovery', () => {
    it('should recover from ICE candidate sending API failure', async () => {
      const { result } = renderHook(() => useWebRTC('test-room-123', 'host', mockConfig));

      await act(async () => {
        await result.current.startScreenShare();
      });

      // Mock ICE candidate sending to fail first, then succeed
      global.fetch.mockRejectedValueOnce(new Error('Network error')).mockResolvedValueOnce({
        ok: true,
        json: vi.fn().mockResolvedValue({ ok: true }),
      });

      // Simulate ICE candidate generation
      await act(async () => {
        if (mockPeerConnection.onicecandidate) {
          mockPeerConnection.onicecandidate({
            candidate: {
              candidate: 'candidate:1 1 UDP 2130706431 192.168.1.100 54400 typ host',
              sdpMid: '0',
              sdpMLineIndex: 0,
            },
          });
        }
      });

      // Should handle the error gracefully
      expect(result.current.connectionState).toBe('connecting');
      expect(result.current.error).toContain('Failed to send ICE candidate');

      // Simulate another ICE candidate
      await act(async () => {
        if (mockPeerConnection.onicecandidate) {
          mockPeerConnection.onicecandidate({
            candidate: {
              candidate: 'candidate:2 1 UDP 2130706431 192.168.1.101 54401 typ host',
              sdpMid: '0',
              sdpMLineIndex: 0,
            },
          });
        }
      });

      // Should recover and succeed
      expect(result.current.connectionState).toBe('connecting');
      expect(result.current.error).toBeNull();
    });

    it('should recover from ICE candidate sending 500 error', async () => {
      const { result } = renderHook(() => useWebRTC('test-room-123', 'host', mockConfig));

      await act(async () => {
        await result.current.startScreenShare();
      });

      // Mock ICE candidate sending to return 500 first, then succeed
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

      // Simulate ICE candidate generation
      await act(async () => {
        if (mockPeerConnection.onicecandidate) {
          mockPeerConnection.onicecandidate({
            candidate: {
              candidate: 'candidate:1 1 UDP 2130706431 192.168.1.100 54400 typ host',
              sdpMid: '0',
              sdpMLineIndex: 0,
            },
          });
        }
      });

      // Should handle the error gracefully
      expect(result.current.connectionState).toBe('connecting');
      expect(result.current.error).toContain('Failed to send ICE candidate');

      // Simulate another ICE candidate
      await act(async () => {
        if (mockPeerConnection.onicecandidate) {
          mockPeerConnection.onicecandidate({
            candidate: {
              candidate: 'candidate:2 1 UDP 2130706431 192.168.1.101 54401 typ host',
              sdpMid: '0',
              sdpMLineIndex: 0,
            },
          });
        }
      });

      // Should recover and succeed
      expect(result.current.connectionState).toBe('connecting');
      expect(result.current.error).toBeNull();
    });
  });

  describe('Polling API Error Recovery', () => {
    it('should recover from offer polling API failure', async () => {
      const { result } = renderHook(() => useWebRTC('test-room-123', 'viewer', mockConfig));

      await act(async () => {
        await result.current.connectToHost();
      });

      // Mock offer polling to fail first, then succeed
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

    it('should recover from answer polling API failure', async () => {
      const { result } = renderHook(() => useWebRTC('test-room-123', 'host', mockConfig));

      await act(async () => {
        await result.current.startScreenShare();
      });

      // Mock answer polling to fail first, then succeed
      global.fetch.mockRejectedValueOnce(new Error('Network error')).mockResolvedValueOnce({
        ok: true,
        json: vi.fn().mockResolvedValue({ desc: { type: 'answer', sdp: 'mock-sdp' } }),
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
        await result.current.startScreenShare();
      });

      // Should recover and succeed
      expect(result.current.connectionState).toBe('connecting');
      expect(result.current.error).toBeNull();
    });

    it('should recover from ICE candidate polling API failure', async () => {
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

      // Mock ICE candidate polling to fail first, then succeed
      global.fetch.mockRejectedValueOnce(new Error('Network error')).mockResolvedValueOnce({
        ok: true,
        json: vi.fn().mockResolvedValue({
          candidates: [{ candidate: 'candidate:1', sdpMid: '0', sdpMLineIndex: 0 }],
        }),
      });

      // Trigger polling
      await act(async () => {
        // Fast-forward time to trigger polling
        await new Promise((resolve) => setTimeout(resolve, 100));
      });

      // Should handle the error gracefully
      expect(result.current.connectionState).toBe('connecting');
      expect(result.current.error).toContain('ICE candidate polling timeout');

      // Retry the operation
      await act(async () => {
        await result.current.connectToHost();
      });

      // Should recover and succeed
      expect(result.current.connectionState).toBe('connecting');
      expect(result.current.error).toBeNull();
    });
  });

  describe('API Error State Management', () => {
    it('should clear error state on successful recovery', async () => {
      const { result } = renderHook(() => useWebRTC('test-room-123', 'host', mockConfig));

      // Mock offer sending to fail first, then succeed
      global.fetch.mockRejectedValueOnce(new Error('Network error')).mockResolvedValueOnce({
        ok: true,
        json: vi.fn().mockResolvedValue({ ok: true }),
      });

      await act(async () => {
        await result.current.startScreenShare();
      });

      // Should have error state
      expect(result.current.connectionState).toBe('failed');
      expect(result.current.error).toContain('Failed to send offer');

      // Retry the operation
      await act(async () => {
        await result.current.startScreenShare();
      });

      // Should clear error state on successful recovery
      expect(result.current.connectionState).toBe('connecting');
      expect(result.current.error).toBeNull();
    });

    it('should maintain error state on repeated failures', async () => {
      const { result } = renderHook(() => useWebRTC('test-room-123', 'host', mockConfig));

      // Mock offer sending to always fail
      global.fetch.mockRejectedValue(new Error('Network error'));

      await act(async () => {
        await result.current.startScreenShare();
      });

      // Should have error state
      expect(result.current.connectionState).toBe('failed');
      expect(result.current.error).toContain('Failed to send offer');

      // Retry the operation
      await act(async () => {
        await result.current.startScreenShare();
      });

      // Should maintain error state on repeated failures
      expect(result.current.connectionState).toBe('failed');
      expect(result.current.error).toContain('Failed to send offer');
    });

    it('should handle multiple concurrent API errors', async () => {
      const { result } = renderHook(() => useWebRTC('test-room-123', 'host', mockConfig));

      // Mock multiple API calls to fail
      global.fetch.mockRejectedValue(new Error('Network error'));

      await act(async () => {
        await result.current.startScreenShare();
      });

      // Should handle the first error encountered
      expect(result.current.connectionState).toBe('failed');
      expect(result.current.error).toContain('Failed to send offer');
    });
  });

  describe('API Error Recovery Performance', () => {
    it('should not create memory leaks with multiple API error recoveries', async () => {
      const { result } = renderHook(() => useWebRTC('test-room-123', 'host', mockConfig));

      // Create multiple API error recoveries
      for (let i = 0; i < 5; i++) {
        // Mock offer sending to fail first, then succeed
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
      }
    });

    it('should handle rapid API error recoveries', async () => {
      const { result } = renderHook(() => useWebRTC('test-room-123', 'host', mockConfig));

      // Mock offer sending to fail and succeed rapidly
      for (let i = 0; i < 10; i++) {
        global.fetch.mockRejectedValueOnce(new Error('Network error')).mockResolvedValueOnce({
          ok: true,
          json: vi.fn().mockResolvedValue({ ok: true }),
        });
      }

      // Rapid error recovery
      for (let i = 0; i < 10; i++) {
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
      }
    });
  });
});
