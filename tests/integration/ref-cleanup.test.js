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
let mockVideoRef;

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

  mockVideoRef = {
    current: {
      srcObject: null,
      play: vi.fn().mockResolvedValue(undefined),
      pause: vi.fn(),
      load: vi.fn(),
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      setAttribute: vi.fn(),
      removeAttribute: vi.fn(),
    },
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

  // Default mock for fetch to return success
  global.fetch.mockResolvedValue({
    ok: true,
    json: vi.fn().mockResolvedValue({ ok: true }),
  });
});

afterEach(() => {
  vi.clearAllMocks();
});

describe('Ref Cleanup - REAL Logic Tests', () => {
  describe('Video Ref Cleanup', () => {
    it('should cleanup video ref on component unmount', async () => {
      const { result, unmount } = renderHook(() => useWebRTC('test-room-123', 'viewer', mockConfig));

      await act(async () => {
        await result.current.connectToHost();
      });

      // Simulate offer received to create PC and bind video ref
      global.fetch.mockResolvedValueOnce({
        ok: true,
        json: vi.fn().mockResolvedValue({ desc: { type: 'offer', sdp: 'mock-sdp' } }),
      });

      await act(async () => {
        // Fast-forward time to trigger offer processing
        await new Promise((resolve) => setTimeout(resolve, 100));
      });

      // Simulate track received and video ref binding
      await act(async () => {
        if (mockPeerConnection.ontrack) {
          mockPeerConnection.ontrack({
            track: { kind: 'video' },
            streams: [mockMediaStream],
          });
        }
      });

      unmount();

      // Verify video ref was cleaned up
      expect(mockVideoRef.current.srcObject).toBeNull();
      expect(mockVideoRef.current.pause).toHaveBeenCalled();
      expect(mockVideoRef.current.load).toHaveBeenCalled();
    });

    it('should cleanup video ref on connection success', async () => {
      const { result } = renderHook(() => useWebRTC('test-room-123', 'viewer', mockConfig));

      await act(async () => {
        await result.current.connectToHost();
      });

      // Simulate offer received to create PC and bind video ref
      global.fetch.mockResolvedValueOnce({
        ok: true,
        json: vi.fn().mockResolvedValue({ desc: { type: 'offer', sdp: 'mock-sdp' } }),
      });

      await act(async () => {
        // Fast-forward time to trigger offer processing
        await new Promise((resolve) => setTimeout(resolve, 100));
      });

      // Simulate track received and video ref binding
      await act(async () => {
        if (mockPeerConnection.ontrack) {
          mockPeerConnection.ontrack({
            track: { kind: 'video' },
            streams: [mockMediaStream],
          });
        }
      });

      // Simulate connection state change to connected
      await act(async () => {
        const pc = mockPeerConnection;
        pc.connectionState = 'connected';
        if (pc.onconnectionstatechange) {
          pc.onconnectionstatechange();
        }
      });

      // Verify video ref was cleaned up on connection success
      expect(mockVideoRef.current.srcObject).toBeNull();
      expect(mockVideoRef.current.pause).toHaveBeenCalled();
      expect(mockVideoRef.current.load).toHaveBeenCalled();
    });

    it('should cleanup video ref on connection failure', async () => {
      const { result } = renderHook(() => useWebRTC('test-room-123', 'viewer', mockConfig));

      await act(async () => {
        await result.current.connectToHost();
      });

      // Simulate offer received to create PC and bind video ref
      global.fetch.mockResolvedValueOnce({
        ok: true,
        json: vi.fn().mockResolvedValue({ desc: { type: 'offer', sdp: 'mock-sdp' } }),
      });

      await act(async () => {
        // Fast-forward time to trigger offer processing
        await new Promise((resolve) => setTimeout(resolve, 100));
      });

      // Simulate track received and video ref binding
      await act(async () => {
        if (mockPeerConnection.ontrack) {
          mockPeerConnection.ontrack({
            track: { kind: 'video' },
            streams: [mockMediaStream],
          });
        }
      });

      // Simulate connection failure
      global.fetch.mockRejectedValueOnce(new Error('Network error'));

      await act(async () => {
        // Fast-forward time to trigger error handling
        await new Promise((resolve) => setTimeout(resolve, 100));
      });

      // Verify video ref was cleaned up on connection failure
      expect(mockVideoRef.current.srcObject).toBeNull();
      expect(mockVideoRef.current.pause).toHaveBeenCalled();
      expect(mockVideoRef.current.load).toHaveBeenCalled();
    });

    it('should cleanup video ref on connection timeout', async () => {
      const { result } = renderHook(() => useWebRTC('test-room-123', 'viewer', mockConfig));

      await act(async () => {
        await result.current.connectToHost();
      });

      // Simulate offer received to create PC and bind video ref
      global.fetch.mockResolvedValueOnce({
        ok: true,
        json: vi.fn().mockResolvedValue({ desc: { type: 'offer', sdp: 'mock-sdp' } }),
      });

      await act(async () => {
        // Fast-forward time to trigger offer processing
        await new Promise((resolve) => setTimeout(resolve, 100));
      });

      // Simulate track received and video ref binding
      await act(async () => {
        if (mockPeerConnection.ontrack) {
          mockPeerConnection.ontrack({
            track: { kind: 'video' },
            streams: [mockMediaStream],
          });
        }
      });

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
        await new Promise((resolve) => setTimeout(resolve, 100));
      });

      // Verify video ref was cleaned up on connection timeout
      expect(mockVideoRef.current.srcObject).toBeNull();
      expect(mockVideoRef.current.pause).toHaveBeenCalled();
      expect(mockVideoRef.current.load).toHaveBeenCalled();
    });
  });

  describe('Stream Ref Cleanup', () => {
    it('should cleanup stream ref on component unmount', async () => {
      const { result, unmount } = renderHook(() => useWebRTC('test-room-123', 'host', mockConfig));

      await act(async () => {
        await result.current.startScreenShare();
      });

      // Verify stream was created and bound
      expect(mockPeerConnection.addTrack).toHaveBeenCalled();

      unmount();

      // Verify stream tracks were stopped
      expect(mockMediaStream.getTracks()[0].stop).toHaveBeenCalled();
      expect(mockMediaStream.getTracks()[1].stop).toHaveBeenCalled();
    });

    it('should cleanup stream ref on connection success', async () => {
      const { result } = renderHook(() => useWebRTC('test-room-123', 'host', mockConfig));

      await act(async () => {
        await result.current.startScreenShare();
      });

      // Verify stream was created and bound
      expect(mockPeerConnection.addTrack).toHaveBeenCalled();

      // Simulate connection state change to connected
      await act(async () => {
        const pc = mockPeerConnection;
        pc.connectionState = 'connected';
        if (pc.onconnectionstatechange) {
          pc.onconnectionstatechange();
        }
      });

      // Verify stream tracks were stopped on connection success
      expect(mockMediaStream.getTracks()[0].stop).toHaveBeenCalled();
      expect(mockMediaStream.getTracks()[1].stop).toHaveBeenCalled();
    });

    it('should cleanup stream ref on connection failure', async () => {
      const { result } = renderHook(() => useWebRTC('test-room-123', 'host', mockConfig));

      await act(async () => {
        await result.current.startScreenShare();
      });

      // Verify stream was created and bound
      expect(mockPeerConnection.addTrack).toHaveBeenCalled();

      // Simulate connection failure
      global.fetch.mockRejectedValueOnce(new Error('Network error'));

      await act(async () => {
        // Fast-forward time to trigger error handling
        await new Promise((resolve) => setTimeout(resolve, 100));
      });

      // Verify stream tracks were stopped on connection failure
      expect(mockMediaStream.getTracks()[0].stop).toHaveBeenCalled();
      expect(mockMediaStream.getTracks()[1].stop).toHaveBeenCalled();
    });

    it('should cleanup stream ref on connection timeout', async () => {
      const { result } = renderHook(() => useWebRTC('test-room-123', 'host', mockConfig));

      await act(async () => {
        await result.current.startScreenShare();
      });

      // Verify stream was created and bound
      expect(mockPeerConnection.addTrack).toHaveBeenCalled();

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
        await new Promise((resolve) => setTimeout(resolve, 100));
      });

      // Verify stream tracks were stopped on connection timeout
      expect(mockMediaStream.getTracks()[0].stop).toHaveBeenCalled();
      expect(mockMediaStream.getTracks()[1].stop).toHaveBeenCalled();
    });
  });

  describe('Ref Cleanup Edge Cases', () => {
    it('should handle cleanup when no refs are set', async () => {
      const { result, unmount } = renderHook(() => useWebRTC('test-room-123', 'viewer', mockConfig));

      // Don't start connection, so no refs should be set
      expect(mockVideoRef.current.srcObject).toBeNull();

      unmount();

      // Should not call cleanup methods when no refs were set
      expect(mockVideoRef.current.pause).not.toHaveBeenCalled();
      expect(mockVideoRef.current.load).not.toHaveBeenCalled();
    });

    it('should handle cleanup when refs are already cleared', async () => {
      const { result, unmount } = renderHook(() => useWebRTC('test-room-123', 'viewer', mockConfig));

      await act(async () => {
        await result.current.connectToHost();
      });

      // Simulate offer received to create PC and bind video ref
      global.fetch.mockResolvedValueOnce({
        ok: true,
        json: vi.fn().mockResolvedValue({ desc: { type: 'offer', sdp: 'mock-sdp' } }),
      });

      await act(async () => {
        // Fast-forward time to trigger offer processing
        await new Promise((resolve) => setTimeout(resolve, 100));
      });

      // Simulate track received and video ref binding
      await act(async () => {
        if (mockPeerConnection.ontrack) {
          mockPeerConnection.ontrack({
            track: { kind: 'video' },
            streams: [mockMediaStream],
          });
        }
      });

      // Simulate connection success to clear refs
      await act(async () => {
        const pc = mockPeerConnection;
        pc.connectionState = 'connected';
        if (pc.onconnectionstatechange) {
          pc.onconnectionstatechange();
        }
      });

      // Verify video ref was cleaned up on connection success
      expect(mockVideoRef.current.srcObject).toBeNull();
      expect(mockVideoRef.current.pause).toHaveBeenCalled();
      expect(mockVideoRef.current.load).toHaveBeenCalled();

      // Clear the mock calls
      vi.clearAllMocks();

      unmount();

      // Should not call cleanup methods again since refs were already cleared
      expect(mockVideoRef.current.pause).not.toHaveBeenCalled();
      expect(mockVideoRef.current.load).not.toHaveBeenCalled();
    });

    it('should handle cleanup when component unmounts during connection', async () => {
      const { result, unmount } = renderHook(() => useWebRTC('test-room-123', 'viewer', mockConfig));

      await act(async () => {
        await result.current.connectToHost();
      });

      // Simulate offer received to create PC and bind video ref
      global.fetch.mockResolvedValueOnce({
        ok: true,
        json: vi.fn().mockResolvedValue({ desc: { type: 'offer', sdp: 'mock-sdp' } }),
      });

      await act(async () => {
        // Fast-forward time to trigger offer processing
        await new Promise((resolve) => setTimeout(resolve, 100));
      });

      // Simulate track received and video ref binding
      await act(async () => {
        if (mockPeerConnection.ontrack) {
          mockPeerConnection.ontrack({
            track: { kind: 'video' },
            streams: [mockMediaStream],
          });
        }
      });

      // Unmount while still connecting
      unmount();

      // Verify video ref was cleaned up
      expect(mockVideoRef.current.srcObject).toBeNull();
      expect(mockVideoRef.current.pause).toHaveBeenCalled();
      expect(mockVideoRef.current.load).toHaveBeenCalled();
    });

    it('should handle cleanup when component unmounts during error state', async () => {
      const { result, unmount } = renderHook(() => useWebRTC('test-room-123', 'viewer', mockConfig));

      await act(async () => {
        await result.current.connectToHost();
      });

      // Simulate offer received to create PC and bind video ref
      global.fetch.mockResolvedValueOnce({
        ok: true,
        json: vi.fn().mockResolvedValue({ desc: { type: 'offer', sdp: 'mock-sdp' } }),
      });

      await act(async () => {
        // Fast-forward time to trigger offer processing
        await new Promise((resolve) => setTimeout(resolve, 100));
      });

      // Simulate track received and video ref binding
      await act(async () => {
        if (mockPeerConnection.ontrack) {
          mockPeerConnection.ontrack({
            track: { kind: 'video' },
            streams: [mockMediaStream],
          });
        }
      });

      // Simulate connection failure
      global.fetch.mockRejectedValueOnce(new Error('Network error'));

      await act(async () => {
        // Fast-forward time to trigger error handling
        await new Promise((resolve) => setTimeout(resolve, 100));
      });

      // Verify video ref was cleaned up on connection failure
      expect(mockVideoRef.current.srcObject).toBeNull();
      expect(mockVideoRef.current.pause).toHaveBeenCalled();
      expect(mockVideoRef.current.load).toHaveBeenCalled();

      // Clear the mock calls
      vi.clearAllMocks();

      unmount();

      // Should not call cleanup methods again since refs were already cleared
      expect(mockVideoRef.current.pause).not.toHaveBeenCalled();
      expect(mockVideoRef.current.load).not.toHaveBeenCalled();
    });
  });

  describe('Ref Cleanup Performance', () => {
    it('should not create memory leaks with multiple ref creations and cleanups', async () => {
      const { result, unmount } = renderHook(() => useWebRTC('test-room-123', 'host', mockConfig));

      // Create multiple connections and disconnections
      const pc = mockPeerConnection;
      for (let i = 0; i < 5; i++) {
        await act(async () => {
          await result.current.startScreenShare();
        });

        // Simulate connection success
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

      // Verify stream tracks were properly cleaned up
      // Each connection creates 2 tracks, so 5 connections = 10 track stops
      expect(mockMediaStream.getTracks()[0].stop).toHaveBeenCalledTimes(5);
      expect(mockMediaStream.getTracks()[1].stop).toHaveBeenCalledTimes(5);
    });

    it('should handle rapid connection state changes without ref leaks', async () => {
      const { result, unmount } = renderHook(() => useWebRTC('test-room-123', 'host', mockConfig));

      await act(async () => {
        await result.current.startScreenShare();
      });

      // Verify stream was created and bound
      expect(mockPeerConnection.addTrack).toHaveBeenCalled();

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

      // Verify stream tracks were cleaned up properly
      expect(mockMediaStream.getTracks()[0].stop).toHaveBeenCalled();
      expect(mockMediaStream.getTracks()[1].stop).toHaveBeenCalled();
    });
  });

  describe('Ref Cleanup Specific Refs', () => {
    it('should cleanup video ref specifically', async () => {
      const { result, unmount } = renderHook(() => useWebRTC('test-room-123', 'viewer', mockConfig));

      await act(async () => {
        await result.current.connectToHost();
      });

      // Simulate offer received to create PC and bind video ref
      global.fetch.mockResolvedValueOnce({
        ok: true,
        json: vi.fn().mockResolvedValue({ desc: { type: 'offer', sdp: 'mock-sdp' } }),
      });

      await act(async () => {
        // Fast-forward time to trigger offer processing
        await new Promise((resolve) => setTimeout(resolve, 100));
      });

      // Simulate track received and video ref binding
      await act(async () => {
        if (mockPeerConnection.ontrack) {
          mockPeerConnection.ontrack({
            track: { kind: 'video' },
            streams: [mockMediaStream],
          });
        }
      });

      unmount();

      // Verify video ref was cleaned up specifically
      expect(mockVideoRef.current.srcObject).toBeNull();
      expect(mockVideoRef.current.pause).toHaveBeenCalled();
      expect(mockVideoRef.current.load).toHaveBeenCalled();
    });

    it('should cleanup stream ref specifically', async () => {
      const { result, unmount } = renderHook(() => useWebRTC('test-room-123', 'host', mockConfig));

      await act(async () => {
        await result.current.startScreenShare();
      });

      // Verify stream was created and bound
      expect(mockPeerConnection.addTrack).toHaveBeenCalled();

      unmount();

      // Verify stream tracks were stopped specifically
      expect(mockMediaStream.getTracks()[0].stop).toHaveBeenCalled();
      expect(mockMediaStream.getTracks()[1].stop).toHaveBeenCalled();
    });

    it('should cleanup peer connection ref specifically', async () => {
      const { result, unmount } = renderHook(() => useWebRTC('test-room-123', 'host', mockConfig));

      await act(async () => {
        await result.current.startScreenShare();
      });

      // Verify peer connection was created
      expect(mockRTCPeerConnection).toHaveBeenCalled();

      unmount();

      // Verify peer connection was closed specifically
      expect(mockPeerConnection.close).toHaveBeenCalled();
    });
  });
});
