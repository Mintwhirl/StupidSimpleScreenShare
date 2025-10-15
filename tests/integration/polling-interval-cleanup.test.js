import { renderHook, act } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';

import { useWebRTC } from '../../src/hooks/useWebRTC.js';

// Use fake timers for precise control over intervals
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

let mockPeerConnection;
let mockConfig;
let intervalIds = [];

beforeEach(() => {
  vi.clearAllMocks();
  intervalIds = [];

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
  global.setInterval = vi.fn((callback, delay) => {
    const id = Math.random() * 1000;
    intervalIds.push(id);
    return id;
  });

  mockConfig = {
    useTurn: true,
    authSecret: 'test-secret',
    apiBase: '/api',
    features: { chat: true, diagnostics: true, viewerCount: true },
    rateLimits: { roomCreation: 50, chatMessages: 60, apiCalls: 2000 },
  };

  // Default mock for fetch to return success
  global.fetch.mockResolvedValue({
    ok: true,
    json: vi.fn().mockResolvedValue({ ok: true }),
  });
});

afterEach(() => {
  vi.clearAllMocks();
  vi.clearAllTimers();
  intervalIds = [];
});

describe('Polling Interval Cleanup - REAL Logic Tests', () => {
  describe('Offer Polling Interval Cleanup', () => {
    it('should cleanup offer polling interval on component unmount', async () => {
      const { result, unmount } = renderHook(() => useWebRTC('test-room-123', 'viewer', mockConfig));

      await act(async () => {
        await result.current.connectToHost();
      });

      // Verify interval was set
      expect(global.setInterval).toHaveBeenCalled();
      const intervalId = intervalIds[0];

      unmount();

      // Verify interval was cleared
      expect(global.clearInterval).toHaveBeenCalledWith(intervalId);
    });

    it('should cleanup offer polling interval on connection success', async () => {
      const { result } = renderHook(() => useWebRTC('test-room-123', 'viewer', mockConfig));

      await act(async () => {
        await result.current.connectToHost();
      });

      // Verify interval was set
      expect(global.setInterval).toHaveBeenCalled();
      const intervalId = intervalIds[0];

      // Simulate offer received and connection success
      global.fetch.mockResolvedValueOnce({
        ok: true,
        json: vi.fn().mockResolvedValue({ desc: { type: 'offer', sdp: 'mock-sdp' } }),
      });

      await act(async () => {
        // Fast-forward time to trigger offer processing
        vi.advanceTimersByTime(1000);
      });

      // Simulate connection state change to connected
      await act(async () => {
        const pc = mockPeerConnection;
        pc.connectionState = 'connected';
        if (pc.onconnectionstatechange) {
          pc.onconnectionstatechange();
        }
      });

      // Verify interval was cleared on connection success
      expect(global.clearInterval).toHaveBeenCalledWith(intervalId);
    });

    it('should cleanup offer polling interval on connection failure', async () => {
      const { result } = renderHook(() => useWebRTC('test-room-123', 'viewer', mockConfig));

      await act(async () => {
        await result.current.connectToHost();
      });

      // Verify interval was set
      expect(global.setInterval).toHaveBeenCalled();
      const intervalId = intervalIds[0];

      // Simulate connection failure
      global.fetch.mockRejectedValueOnce(new Error('Network error'));

      await act(async () => {
        // Fast-forward time to trigger error handling
        vi.advanceTimersByTime(1000);
      });

      // Verify interval was cleared on connection failure
      expect(global.clearInterval).toHaveBeenCalledWith(intervalId);
    });

    it('should cleanup offer polling interval on timeout', async () => {
      const { result } = renderHook(() => useWebRTC('test-room-123', 'viewer', mockConfig));

      await act(async () => {
        await result.current.connectToHost();
      });

      // Verify interval was set
      expect(global.setInterval).toHaveBeenCalled();
      const intervalId = intervalIds[0];

      // Simulate timeout (60 consecutive 404 responses)
      for (let i = 0; i < 60; i++) {
        global.fetch.mockResolvedValueOnce({
          ok: false,
          status: 404,
          statusText: 'Not Found',
        });
      }

      await act(async () => {
        // Fast-forward time to trigger timeout
        vi.advanceTimersByTime(60000);
      });

      // Verify interval was cleared on timeout
      expect(global.clearInterval).toHaveBeenCalledWith(intervalId);
    });
  });

  describe('Answer Polling Interval Cleanup', () => {
    it('should cleanup answer polling interval on component unmount', async () => {
      const { result, unmount } = renderHook(() => useWebRTC('test-room-123', 'host', mockConfig));

      await act(async () => {
        await result.current.startScreenShare();
      });

      // Verify interval was set
      expect(global.setInterval).toHaveBeenCalled();
      const intervalId = intervalIds[0];

      unmount();

      // Verify interval was cleared
      expect(global.clearInterval).toHaveBeenCalledWith(intervalId);
    });

    it('should cleanup answer polling interval on connection success', async () => {
      const { result } = renderHook(() => useWebRTC('test-room-123', 'host', mockConfig));

      await act(async () => {
        await result.current.startScreenShare();
      });

      // Verify interval was set
      expect(global.setInterval).toHaveBeenCalled();
      const intervalId = intervalIds[0];

      // Simulate answer received and connection success
      global.fetch.mockResolvedValueOnce({
        ok: true,
        json: vi.fn().mockResolvedValue({ desc: { type: 'answer', sdp: 'mock-sdp' } }),
      });

      await act(async () => {
        // Fast-forward time to trigger answer processing
        vi.advanceTimersByTime(1000);
      });

      // Simulate connection state change to connected
      await act(async () => {
        const pc = mockPeerConnection;
        pc.connectionState = 'connected';
        if (pc.onconnectionstatechange) {
          pc.onconnectionstatechange();
        }
      });

      // Verify interval was cleared on connection success
      expect(global.clearInterval).toHaveBeenCalledWith(intervalId);
    });

    it('should cleanup answer polling interval on connection failure', async () => {
      const { result } = renderHook(() => useWebRTC('test-room-123', 'host', mockConfig));

      await act(async () => {
        await result.current.startScreenShare();
      });

      // Verify interval was set
      expect(global.setInterval).toHaveBeenCalled();
      const intervalId = intervalIds[0];

      // Simulate connection failure
      global.fetch.mockRejectedValueOnce(new Error('Network error'));

      await act(async () => {
        // Fast-forward time to trigger error handling
        vi.advanceTimersByTime(1000);
      });

      // Verify interval was cleared on connection failure
      expect(global.clearInterval).toHaveBeenCalledWith(intervalId);
    });

    it('should cleanup answer polling interval on timeout', async () => {
      const { result } = renderHook(() => useWebRTC('test-room-123', 'host', mockConfig));

      await act(async () => {
        await result.current.startScreenShare();
      });

      // Verify interval was set
      expect(global.setInterval).toHaveBeenCalled();
      const intervalId = intervalIds[0];

      // Simulate timeout (60 consecutive 404 responses)
      for (let i = 0; i < 60; i++) {
        global.fetch.mockResolvedValueOnce({
          ok: false,
          status: 404,
          statusText: 'Not Found',
        });
      }

      await act(async () => {
        // Fast-forward time to trigger timeout
        vi.advanceTimersByTime(60000);
      });

      // Verify interval was cleared on timeout
      expect(global.clearInterval).toHaveBeenCalledWith(intervalId);
    });
  });

  describe('ICE Candidate Polling Interval Cleanup', () => {
    it('should cleanup ICE candidate polling interval on component unmount', async () => {
      const { result, unmount } = renderHook(() => useWebRTC('test-room-123', 'viewer', mockConfig));

      await act(async () => {
        await result.current.connectToHost();
      });

      // Simulate offer received to create PC and start ICE candidate polling
      global.fetch.mockResolvedValueOnce({
        ok: true,
        json: vi.fn().mockResolvedValue({ desc: { type: 'offer', sdp: 'mock-sdp' } }),
      });

      await act(async () => {
        // Fast-forward time to trigger offer processing and ICE candidate polling
        vi.advanceTimersByTime(1000);
      });

      // Verify intervals were set (offer polling + ICE candidate polling)
      expect(global.setInterval).toHaveBeenCalledTimes(2);
      const iceCandidateIntervalId = intervalIds[1];

      unmount();

      // Verify ICE candidate polling interval was cleared
      expect(global.clearInterval).toHaveBeenCalledWith(iceCandidateIntervalId);
    });

    it('should cleanup ICE candidate polling interval on connection success', async () => {
      const { result } = renderHook(() => useWebRTC('test-room-123', 'viewer', mockConfig));

      await act(async () => {
        await result.current.connectToHost();
      });

      // Simulate offer received to create PC and start ICE candidate polling
      global.fetch.mockResolvedValueOnce({
        ok: true,
        json: vi.fn().mockResolvedValue({ desc: { type: 'offer', sdp: 'mock-sdp' } }),
      });

      await act(async () => {
        // Fast-forward time to trigger offer processing and ICE candidate polling
        vi.advanceTimersByTime(1000);
      });

      // Verify intervals were set (offer polling + ICE candidate polling)
      expect(global.setInterval).toHaveBeenCalledTimes(2);
      const iceCandidateIntervalId = intervalIds[1];

      // Simulate connection state change to connected
      await act(async () => {
        const pc = mockPeerConnection;
        pc.connectionState = 'connected';
        if (pc.onconnectionstatechange) {
          pc.onconnectionstatechange();
        }
      });

      // Verify ICE candidate polling interval was cleared on connection success
      expect(global.clearInterval).toHaveBeenCalledWith(iceCandidateIntervalId);
    });

    it('should cleanup ICE candidate polling interval on connection failure', async () => {
      const { result } = renderHook(() => useWebRTC('test-room-123', 'viewer', mockConfig));

      await act(async () => {
        await result.current.connectToHost();
      });

      // Simulate offer received to create PC and start ICE candidate polling
      global.fetch.mockResolvedValueOnce({
        ok: true,
        json: vi.fn().mockResolvedValue({ desc: { type: 'offer', sdp: 'mock-sdp' } }),
      });

      await act(async () => {
        // Fast-forward time to trigger offer processing and ICE candidate polling
        vi.advanceTimersByTime(1000);
      });

      // Verify intervals were set (offer polling + ICE candidate polling)
      expect(global.setInterval).toHaveBeenCalledTimes(2);
      const iceCandidateIntervalId = intervalIds[1];

      // Simulate connection failure
      global.fetch.mockRejectedValueOnce(new Error('Network error'));

      await act(async () => {
        // Fast-forward time to trigger error handling
        vi.advanceTimersByTime(1000);
      });

      // Verify ICE candidate polling interval was cleared on connection failure
      expect(global.clearInterval).toHaveBeenCalledWith(iceCandidateIntervalId);
    });

    it('should cleanup ICE candidate polling interval on timeout', async () => {
      const { result } = renderHook(() => useWebRTC('test-room-123', 'viewer', mockConfig));

      await act(async () => {
        await result.current.connectToHost();
      });

      // Simulate offer received to create PC and start ICE candidate polling
      global.fetch.mockResolvedValueOnce({
        ok: true,
        json: vi.fn().mockResolvedValue({ desc: { type: 'offer', sdp: 'mock-sdp' } }),
      });

      await act(async () => {
        // Fast-forward time to trigger offer processing and ICE candidate polling
        vi.advanceTimersByTime(1000);
      });

      // Verify intervals were set (offer polling + ICE candidate polling)
      expect(global.setInterval).toHaveBeenCalledTimes(2);
      const iceCandidateIntervalId = intervalIds[1];

      // Simulate timeout (30 consecutive 404 responses for ICE candidates)
      for (let i = 0; i < 30; i++) {
        global.fetch.mockResolvedValueOnce({
          ok: false,
          status: 404,
          statusText: 'Not Found',
        });
      }

      await act(async () => {
        // Fast-forward time to trigger timeout
        vi.advanceTimersByTime(30000);
      });

      // Verify ICE candidate polling interval was cleared on timeout
      expect(global.clearInterval).toHaveBeenCalledWith(iceCandidateIntervalId);
    });
  });

  describe('Multiple Polling Interval Cleanup', () => {
    it('should cleanup all polling intervals on component unmount', async () => {
      const { result, unmount } = renderHook(() => useWebRTC('test-room-123', 'viewer', mockConfig));

      await act(async () => {
        await result.current.connectToHost();
      });

      // Simulate offer received to create PC and start ICE candidate polling
      global.fetch.mockResolvedValueOnce({
        ok: true,
        json: vi.fn().mockResolvedValue({ desc: { type: 'offer', sdp: 'mock-sdp' } }),
      });

      await act(async () => {
        // Fast-forward time to trigger offer processing and ICE candidate polling
        vi.advanceTimersByTime(1000);
      });

      // Verify intervals were set (offer polling + ICE candidate polling)
      expect(global.setInterval).toHaveBeenCalledTimes(2);
      const offerIntervalId = intervalIds[0];
      const iceCandidateIntervalId = intervalIds[1];

      unmount();

      // Verify all intervals were cleared
      expect(global.clearInterval).toHaveBeenCalledWith(offerIntervalId);
      expect(global.clearInterval).toHaveBeenCalledWith(iceCandidateIntervalId);
    });

    it('should cleanup all polling intervals on connection success', async () => {
      const { result } = renderHook(() => useWebRTC('test-room-123', 'viewer', mockConfig));

      await act(async () => {
        await result.current.connectToHost();
      });

      // Simulate offer received to create PC and start ICE candidate polling
      global.fetch.mockResolvedValueOnce({
        ok: true,
        json: vi.fn().mockResolvedValue({ desc: { type: 'offer', sdp: 'mock-sdp' } }),
      });

      await act(async () => {
        // Fast-forward time to trigger offer processing and ICE candidate polling
        vi.advanceTimersByTime(1000);
      });

      // Verify intervals were set (offer polling + ICE candidate polling)
      expect(global.setInterval).toHaveBeenCalledTimes(2);
      const offerIntervalId = intervalIds[0];
      const iceCandidateIntervalId = intervalIds[1];

      // Simulate connection state change to connected
      await act(async () => {
        const pc = mockPeerConnection;
        pc.connectionState = 'connected';
        if (pc.onconnectionstatechange) {
          pc.onconnectionstatechange();
        }
      });

      // Verify all intervals were cleared on connection success
      expect(global.clearInterval).toHaveBeenCalledWith(offerIntervalId);
      expect(global.clearInterval).toHaveBeenCalledWith(iceCandidateIntervalId);
    });

    it('should cleanup all polling intervals on connection failure', async () => {
      const { result } = renderHook(() => useWebRTC('test-room-123', 'viewer', mockConfig));

      await act(async () => {
        await result.current.connectToHost();
      });

      // Simulate offer received to create PC and start ICE candidate polling
      global.fetch.mockResolvedValueOnce({
        ok: true,
        json: vi.fn().mockResolvedValue({ desc: { type: 'offer', sdp: 'mock-sdp' } }),
      });

      await act(async () => {
        // Fast-forward time to trigger offer processing and ICE candidate polling
        vi.advanceTimersByTime(1000);
      });

      // Verify intervals were set (offer polling + ICE candidate polling)
      expect(global.setInterval).toHaveBeenCalledTimes(2);
      const offerIntervalId = intervalIds[0];
      const iceCandidateIntervalId = intervalIds[1];

      // Simulate connection failure
      global.fetch.mockRejectedValueOnce(new Error('Network error'));

      await act(async () => {
        // Fast-forward time to trigger error handling
        vi.advanceTimersByTime(1000);
      });

      // Verify all intervals were cleared on connection failure
      expect(global.clearInterval).toHaveBeenCalledWith(offerIntervalId);
      expect(global.clearInterval).toHaveBeenCalledWith(iceCandidateIntervalId);
    });
  });

  describe('Polling Interval Cleanup Edge Cases', () => {
    it('should handle cleanup when no intervals are set', async () => {
      const { result, unmount } = renderHook(() => useWebRTC('test-room-123', 'viewer', mockConfig));

      // Don't start connection, so no intervals should be set
      expect(global.setInterval).not.toHaveBeenCalled();

      unmount();

      // Should not call clearInterval when no intervals were set
      expect(global.clearInterval).not.toHaveBeenCalled();
    });

    it('should handle cleanup when intervals are already cleared', async () => {
      const { result, unmount } = renderHook(() => useWebRTC('test-room-123', 'viewer', mockConfig));

      await act(async () => {
        await result.current.connectToHost();
      });

      // Verify interval was set
      expect(global.setInterval).toHaveBeenCalled();
      const intervalId = intervalIds[0];

      // Simulate connection success to clear interval
      global.fetch.mockResolvedValueOnce({
        ok: true,
        json: vi.fn().mockResolvedValue({ desc: { type: 'offer', sdp: 'mock-sdp' } }),
      });

      await act(async () => {
        // Fast-forward time to trigger offer processing
        vi.advanceTimersByTime(1000);
      });

      // Simulate connection state change to connected
      await act(async () => {
        const pc = mockPeerConnection;
        pc.connectionState = 'connected';
        if (pc.onconnectionstatechange) {
          pc.onconnectionstatechange();
        }
      });

      // Verify interval was cleared on connection success
      expect(global.clearInterval).toHaveBeenCalledWith(intervalId);

      // Clear the mock calls
      vi.clearAllMocks();

      unmount();

      // Should not call clearInterval again since interval was already cleared
      expect(global.clearInterval).not.toHaveBeenCalled();
    });

    it('should handle cleanup when component unmounts during connection', async () => {
      const { result, unmount } = renderHook(() => useWebRTC('test-room-123', 'viewer', mockConfig));

      await act(async () => {
        await result.current.connectToHost();
      });

      // Verify interval was set
      expect(global.setInterval).toHaveBeenCalled();
      const intervalId = intervalIds[0];

      // Unmount while still connecting
      unmount();

      // Verify interval was cleared
      expect(global.clearInterval).toHaveBeenCalledWith(intervalId);
    });

    it('should handle cleanup when component unmounts during error state', async () => {
      const { result, unmount } = renderHook(() => useWebRTC('test-room-123', 'viewer', mockConfig));

      await act(async () => {
        await result.current.connectToHost();
      });

      // Verify interval was set
      expect(global.setInterval).toHaveBeenCalled();
      const intervalId = intervalIds[0];

      // Simulate connection failure
      global.fetch.mockRejectedValueOnce(new Error('Network error'));

      await act(async () => {
        // Fast-forward time to trigger error handling
        vi.advanceTimersByTime(1000);
      });

      // Verify interval was cleared on connection failure
      expect(global.clearInterval).toHaveBeenCalledWith(intervalId);

      // Clear the mock calls
      vi.clearAllMocks();

      unmount();

      // Should not call clearInterval again since interval was already cleared
      expect(global.clearInterval).not.toHaveBeenCalled();
    });
  });

  describe('Polling Interval Cleanup Performance', () => {
    it('should not create memory leaks with multiple interval creations and cleanups', async () => {
      const { result, unmount } = renderHook(() => useWebRTC('test-room-123', 'viewer', mockConfig));

      // Create multiple connections and disconnections
      const pc = mockPeerConnection;
      for (let i = 0; i < 5; i++) {
        await act(async () => {
          await result.current.connectToHost();
        });

        // Simulate connection success
        global.fetch.mockResolvedValueOnce({
          ok: true,
          json: vi.fn().mockResolvedValue({ desc: { type: 'offer', sdp: 'mock-sdp' } }),
        });

        await act(async () => {
          // Fast-forward time to trigger offer processing
          vi.advanceTimersByTime(1000);
        });

        // Simulate connection state change to connected
        await act(async () => {
          pc.connectionState = 'connected';
          if (pc.onconnectionstatechange) {
            pc.onconnectionstatechange();
          }
        });

        // Simulate disconnection
        await act(async () => {
          pc.connectionState = 'disconnected';
          if (pc.onconnectionstatechange) {
            pc.onconnectionstatechange();
          }
        });
      }

      unmount();

      // Verify all intervals were properly cleaned up
      // Each connection creates 1 interval (offer polling), so 5 connections = 5 intervals
      expect(global.setInterval).toHaveBeenCalledTimes(5);
      expect(global.clearInterval).toHaveBeenCalledTimes(5);
    });

    it('should handle rapid connection state changes without interval leaks', async () => {
      const { result, unmount } = renderHook(() => useWebRTC('test-room-123', 'viewer', mockConfig));

      await act(async () => {
        await result.current.connectToHost();
      });

      // Verify interval was set
      expect(global.setInterval).toHaveBeenCalledTimes(1);
      const intervalId = intervalIds[0];

      // Simulate rapid connection state changes
      const pc2 = mockPeerConnection;
      for (let i = 0; i < 10; i++) {
        await act(async () => {
          pc2.connectionState = 'connecting';
          if (pc2.onconnectionstatechange) {
            pc2.onconnectionstatechange();
          }
        });

        await act(async () => {
          pc2.connectionState = 'connected';
          if (pc2.onconnectionstatechange) {
            pc2.onconnectionstatechange();
          }
        });

        await act(async () => {
          pc2.connectionState = 'disconnected';
          if (pc2.onconnectionstatechange) {
            pc2.onconnectionstatechange();
          }
        });
      }

      unmount();

      // Verify interval was cleaned up properly
      expect(global.clearInterval).toHaveBeenCalledWith(intervalId);
    });
  });
});
