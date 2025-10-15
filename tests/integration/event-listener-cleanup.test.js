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
let eventListeners = {};

beforeEach(() => {
  vi.clearAllMocks();
  eventListeners = {};

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
    addEventListener: vi.fn((event, handler) => {
      if (!eventListeners[event]) {
        eventListeners[event] = [];
      }
      eventListeners[event].push(handler);
    }),
    removeEventListener: vi.fn((event, handler) => {
      if (eventListeners[event]) {
        const index = eventListeners[event].indexOf(handler);
        if (index > -1) {
          eventListeners[event].splice(index, 1);
        }
      }
    }),
    // Legacy event handler properties for testing
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

  // Default mock for fetch to return success
  global.fetch.mockResolvedValue({
    ok: true,
    json: vi.fn().mockResolvedValue({ ok: true }),
  });
});

afterEach(() => {
  vi.clearAllMocks();
  eventListeners = {};
});

describe('Event Listener Cleanup - REAL Logic Tests', () => {
  describe('WebRTC Event Listener Cleanup', () => {
    it('should cleanup WebRTC event listeners on component unmount', async () => {
      const { result, unmount } = renderHook(() => useWebRTC('test-room-123', 'host', mockConfig));

      await act(async () => {
        await result.current.startScreenShare();
      });

      // Verify event listeners were added
      expect(mockPeerConnection.addEventListener).toHaveBeenCalledWith('icecandidate', expect.any(Function));
      expect(mockPeerConnection.addEventListener).toHaveBeenCalledWith('connectionstatechange', expect.any(Function));
      expect(mockPeerConnection.addEventListener).toHaveBeenCalledWith(
        'iceconnectionstatechange',
        expect.any(Function)
      );
      expect(mockPeerConnection.addEventListener).toHaveBeenCalledWith('icegatheringstatechange', expect.any(Function));
      expect(mockPeerConnection.addEventListener).toHaveBeenCalledWith('track', expect.any(Function));
      expect(mockPeerConnection.addEventListener).toHaveBeenCalledWith('datachannel', expect.any(Function));

      unmount();

      // Verify event listeners were removed
      expect(mockPeerConnection.removeEventListener).toHaveBeenCalledWith('icecandidate', expect.any(Function));
      expect(mockPeerConnection.removeEventListener).toHaveBeenCalledWith(
        'connectionstatechange',
        expect.any(Function)
      );
      expect(mockPeerConnection.removeEventListener).toHaveBeenCalledWith(
        'iceconnectionstatechange',
        expect.any(Function)
      );
      expect(mockPeerConnection.removeEventListener).toHaveBeenCalledWith(
        'icegatheringstatechange',
        expect.any(Function)
      );
      expect(mockPeerConnection.removeEventListener).toHaveBeenCalledWith('track', expect.any(Function));
      expect(mockPeerConnection.removeEventListener).toHaveBeenCalledWith('datachannel', expect.any(Function));
    });

    it('should cleanup WebRTC event listeners on connection success', async () => {
      const { result } = renderHook(() => useWebRTC('test-room-123', 'host', mockConfig));

      await act(async () => {
        await result.current.startScreenShare();
      });

      // Verify event listeners were added
      expect(mockPeerConnection.addEventListener).toHaveBeenCalledWith('icecandidate', expect.any(Function));
      expect(mockPeerConnection.addEventListener).toHaveBeenCalledWith('connectionstatechange', expect.any(Function));
      expect(mockPeerConnection.addEventListener).toHaveBeenCalledWith(
        'iceconnectionstatechange',
        expect.any(Function)
      );
      expect(mockPeerConnection.addEventListener).toHaveBeenCalledWith('icegatheringstatechange', expect.any(Function));
      expect(mockPeerConnection.addEventListener).toHaveBeenCalledWith('track', expect.any(Function));
      expect(mockPeerConnection.addEventListener).toHaveBeenCalledWith('datachannel', expect.any(Function));

      // Simulate connection state change to connected
      await act(async () => {
        mockPeerConnection.connectionState = 'connected';
        if (mockPeerConnection.onconnectionstatechange) {
          mockPeerConnection.onconnectionstatechange();
        }
      });

      // Verify event listeners were removed on connection success
      expect(mockPeerConnection.removeEventListener).toHaveBeenCalledWith('icecandidate', expect.any(Function));
      expect(mockPeerConnection.removeEventListener).toHaveBeenCalledWith(
        'connectionstatechange',
        expect.any(Function)
      );
      expect(mockPeerConnection.removeEventListener).toHaveBeenCalledWith(
        'iceconnectionstatechange',
        expect.any(Function)
      );
      expect(mockPeerConnection.removeEventListener).toHaveBeenCalledWith(
        'icegatheringstatechange',
        expect.any(Function)
      );
      expect(mockPeerConnection.removeEventListener).toHaveBeenCalledWith('track', expect.any(Function));
      expect(mockPeerConnection.removeEventListener).toHaveBeenCalledWith('datachannel', expect.any(Function));
    });

    it('should cleanup WebRTC event listeners on connection failure', async () => {
      const { result } = renderHook(() => useWebRTC('test-room-123', 'host', mockConfig));

      await act(async () => {
        await result.current.startScreenShare();
      });

      // Verify event listeners were added
      expect(mockPeerConnection.addEventListener).toHaveBeenCalledWith('icecandidate', expect.any(Function));
      expect(mockPeerConnection.addEventListener).toHaveBeenCalledWith('connectionstatechange', expect.any(Function));
      expect(mockPeerConnection.addEventListener).toHaveBeenCalledWith(
        'iceconnectionstatechange',
        expect.any(Function)
      );
      expect(mockPeerConnection.addEventListener).toHaveBeenCalledWith('icegatheringstatechange', expect.any(Function));
      expect(mockPeerConnection.addEventListener).toHaveBeenCalledWith('track', expect.any(Function));
      expect(mockPeerConnection.addEventListener).toHaveBeenCalledWith('datachannel', expect.any(Function));

      // Simulate connection failure
      global.fetch.mockRejectedValueOnce(new Error('Network error'));

      await act(async () => {
        // Fast-forward time to trigger error handling
        await new Promise((resolve) => setTimeout(resolve, 100));
      });

      // Verify event listeners were removed on connection failure
      expect(mockPeerConnection.removeEventListener).toHaveBeenCalledWith('icecandidate', expect.any(Function));
      expect(mockPeerConnection.removeEventListener).toHaveBeenCalledWith(
        'connectionstatechange',
        expect.any(Function)
      );
      expect(mockPeerConnection.removeEventListener).toHaveBeenCalledWith(
        'iceconnectionstatechange',
        expect.any(Function)
      );
      expect(mockPeerConnection.removeEventListener).toHaveBeenCalledWith(
        'icegatheringstatechange',
        expect.any(Function)
      );
      expect(mockPeerConnection.removeEventListener).toHaveBeenCalledWith('track', expect.any(Function));
      expect(mockPeerConnection.removeEventListener).toHaveBeenCalledWith('datachannel', expect.any(Function));
    });

    it('should cleanup WebRTC event listeners on connection timeout', async () => {
      const { result } = renderHook(() => useWebRTC('test-room-123', 'host', mockConfig));

      await act(async () => {
        await result.current.startScreenShare();
      });

      // Verify event listeners were added
      expect(mockPeerConnection.addEventListener).toHaveBeenCalledWith('icecandidate', expect.any(Function));
      expect(mockPeerConnection.addEventListener).toHaveBeenCalledWith('connectionstatechange', expect.any(Function));
      expect(mockPeerConnection.addEventListener).toHaveBeenCalledWith(
        'iceconnectionstatechange',
        expect.any(Function)
      );
      expect(mockPeerConnection.addEventListener).toHaveBeenCalledWith('icegatheringstatechange', expect.any(Function));
      expect(mockPeerConnection.addEventListener).toHaveBeenCalledWith('track', expect.any(Function));
      expect(mockPeerConnection.addEventListener).toHaveBeenCalledWith('datachannel', expect.any(Function));

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

      // Verify event listeners were removed on connection timeout
      expect(mockPeerConnection.removeEventListener).toHaveBeenCalledWith('icecandidate', expect.any(Function));
      expect(mockPeerConnection.removeEventListener).toHaveBeenCalledWith(
        'connectionstatechange',
        expect.any(Function)
      );
      expect(mockPeerConnection.removeEventListener).toHaveBeenCalledWith(
        'iceconnectionstatechange',
        expect.any(Function)
      );
      expect(mockPeerConnection.removeEventListener).toHaveBeenCalledWith(
        'icegatheringstatechange',
        expect.any(Function)
      );
      expect(mockPeerConnection.removeEventListener).toHaveBeenCalledWith('track', expect.any(Function));
      expect(mockPeerConnection.removeEventListener).toHaveBeenCalledWith('datachannel', expect.any(Function));
    });
  });

  describe('Viewer Event Listener Cleanup', () => {
    it('should cleanup WebRTC event listeners on viewer component unmount', async () => {
      const { result, unmount } = renderHook(() => useWebRTC('test-room-123', 'viewer', mockConfig));

      await act(async () => {
        await result.current.connectToHost();
      });

      // Simulate offer received to create PC
      global.fetch.mockResolvedValueOnce({
        ok: true,
        json: vi.fn().mockResolvedValue({ desc: { type: 'offer', sdp: 'mock-sdp' } }),
      });

      await act(async () => {
        // Fast-forward time to trigger offer processing
        await new Promise((resolve) => setTimeout(resolve, 100));
      });

      // Verify event listeners were added
      expect(mockPeerConnection.addEventListener).toHaveBeenCalledWith('icecandidate', expect.any(Function));
      expect(mockPeerConnection.addEventListener).toHaveBeenCalledWith('connectionstatechange', expect.any(Function));
      expect(mockPeerConnection.addEventListener).toHaveBeenCalledWith(
        'iceconnectionstatechange',
        expect.any(Function)
      );
      expect(mockPeerConnection.addEventListener).toHaveBeenCalledWith('icegatheringstatechange', expect.any(Function));
      expect(mockPeerConnection.addEventListener).toHaveBeenCalledWith('track', expect.any(Function));
      expect(mockPeerConnection.addEventListener).toHaveBeenCalledWith('datachannel', expect.any(Function));

      unmount();

      // Verify event listeners were removed
      expect(mockPeerConnection.removeEventListener).toHaveBeenCalledWith('icecandidate', expect.any(Function));
      expect(mockPeerConnection.removeEventListener).toHaveBeenCalledWith(
        'connectionstatechange',
        expect.any(Function)
      );
      expect(mockPeerConnection.removeEventListener).toHaveBeenCalledWith(
        'iceconnectionstatechange',
        expect.any(Function)
      );
      expect(mockPeerConnection.removeEventListener).toHaveBeenCalledWith(
        'icegatheringstatechange',
        expect.any(Function)
      );
      expect(mockPeerConnection.removeEventListener).toHaveBeenCalledWith('track', expect.any(Function));
      expect(mockPeerConnection.removeEventListener).toHaveBeenCalledWith('datachannel', expect.any(Function));
    });

    it('should cleanup WebRTC event listeners on viewer connection success', async () => {
      const { result } = renderHook(() => useWebRTC('test-room-123', 'viewer', mockConfig));

      await act(async () => {
        await result.current.connectToHost();
      });

      // Simulate offer received to create PC
      global.fetch.mockResolvedValueOnce({
        ok: true,
        json: vi.fn().mockResolvedValue({ desc: { type: 'offer', sdp: 'mock-sdp' } }),
      });

      await act(async () => {
        // Fast-forward time to trigger offer processing
        await new Promise((resolve) => setTimeout(resolve, 100));
      });

      // Verify event listeners were added
      expect(mockPeerConnection.addEventListener).toHaveBeenCalledWith('icecandidate', expect.any(Function));
      expect(mockPeerConnection.addEventListener).toHaveBeenCalledWith('connectionstatechange', expect.any(Function));
      expect(mockPeerConnection.addEventListener).toHaveBeenCalledWith(
        'iceconnectionstatechange',
        expect.any(Function)
      );
      expect(mockPeerConnection.addEventListener).toHaveBeenCalledWith('icegatheringstatechange', expect.any(Function));
      expect(mockPeerConnection.addEventListener).toHaveBeenCalledWith('track', expect.any(Function));
      expect(mockPeerConnection.addEventListener).toHaveBeenCalledWith('datachannel', expect.any(Function));

      // Simulate connection state change to connected
      await act(async () => {
        mockPeerConnection.connectionState = 'connected';
        if (mockPeerConnection.onconnectionstatechange) {
          mockPeerConnection.onconnectionstatechange();
        }
      });

      // Verify event listeners were removed on connection success
      expect(mockPeerConnection.removeEventListener).toHaveBeenCalledWith('icecandidate', expect.any(Function));
      expect(mockPeerConnection.removeEventListener).toHaveBeenCalledWith(
        'connectionstatechange',
        expect.any(Function)
      );
      expect(mockPeerConnection.removeEventListener).toHaveBeenCalledWith(
        'iceconnectionstatechange',
        expect.any(Function)
      );
      expect(mockPeerConnection.removeEventListener).toHaveBeenCalledWith(
        'icegatheringstatechange',
        expect.any(Function)
      );
      expect(mockPeerConnection.removeEventListener).toHaveBeenCalledWith('track', expect.any(Function));
      expect(mockPeerConnection.removeEventListener).toHaveBeenCalledWith('datachannel', expect.any(Function));
    });

    it('should cleanup WebRTC event listeners on viewer connection failure', async () => {
      const { result } = renderHook(() => useWebRTC('test-room-123', 'viewer', mockConfig));

      await act(async () => {
        await result.current.connectToHost();
      });

      // Simulate offer received to create PC
      global.fetch.mockResolvedValueOnce({
        ok: true,
        json: vi.fn().mockResolvedValue({ desc: { type: 'offer', sdp: 'mock-sdp' } }),
      });

      await act(async () => {
        // Fast-forward time to trigger offer processing
        await new Promise((resolve) => setTimeout(resolve, 100));
      });

      // Verify event listeners were added
      expect(mockPeerConnection.addEventListener).toHaveBeenCalledWith('icecandidate', expect.any(Function));
      expect(mockPeerConnection.addEventListener).toHaveBeenCalledWith('connectionstatechange', expect.any(Function));
      expect(mockPeerConnection.addEventListener).toHaveBeenCalledWith(
        'iceconnectionstatechange',
        expect.any(Function)
      );
      expect(mockPeerConnection.addEventListener).toHaveBeenCalledWith('icegatheringstatechange', expect.any(Function));
      expect(mockPeerConnection.addEventListener).toHaveBeenCalledWith('track', expect.any(Function));
      expect(mockPeerConnection.addEventListener).toHaveBeenCalledWith('datachannel', expect.any(Function));

      // Simulate connection failure
      global.fetch.mockRejectedValueOnce(new Error('Network error'));

      await act(async () => {
        // Fast-forward time to trigger error handling
        await new Promise((resolve) => setTimeout(resolve, 100));
      });

      // Verify event listeners were removed on connection failure
      expect(mockPeerConnection.removeEventListener).toHaveBeenCalledWith('icecandidate', expect.any(Function));
      expect(mockPeerConnection.removeEventListener).toHaveBeenCalledWith(
        'connectionstatechange',
        expect.any(Function)
      );
      expect(mockPeerConnection.removeEventListener).toHaveBeenCalledWith(
        'iceconnectionstatechange',
        expect.any(Function)
      );
      expect(mockPeerConnection.removeEventListener).toHaveBeenCalledWith(
        'icegatheringstatechange',
        expect.any(Function)
      );
      expect(mockPeerConnection.removeEventListener).toHaveBeenCalledWith('track', expect.any(Function));
      expect(mockPeerConnection.removeEventListener).toHaveBeenCalledWith('datachannel', expect.any(Function));
    });
  });

  describe('Event Listener Cleanup Edge Cases', () => {
    it('should handle cleanup when no event listeners are set', async () => {
      const { result, unmount } = renderHook(() => useWebRTC('test-room-123', 'viewer', mockConfig));

      // Don't start connection, so no event listeners should be set
      expect(mockPeerConnection.addEventListener).not.toHaveBeenCalled();

      unmount();

      // Should not call removeEventListener when no listeners were set
      expect(mockPeerConnection.removeEventListener).not.toHaveBeenCalled();
    });

    it('should handle cleanup when event listeners are already cleared', async () => {
      const { result, unmount } = renderHook(() => useWebRTC('test-room-123', 'host', mockConfig));

      await act(async () => {
        await result.current.startScreenShare();
      });

      // Verify event listeners were added
      expect(mockPeerConnection.addEventListener).toHaveBeenCalledWith('icecandidate', expect.any(Function));
      expect(mockPeerConnection.addEventListener).toHaveBeenCalledWith('connectionstatechange', expect.any(Function));
      expect(mockPeerConnection.addEventListener).toHaveBeenCalledWith(
        'iceconnectionstatechange',
        expect.any(Function)
      );
      expect(mockPeerConnection.addEventListener).toHaveBeenCalledWith('icegatheringstatechange', expect.any(Function));
      expect(mockPeerConnection.addEventListener).toHaveBeenCalledWith('track', expect.any(Function));
      expect(mockPeerConnection.addEventListener).toHaveBeenCalledWith('datachannel', expect.any(Function));

      // Simulate connection success to clear event listeners
      await act(async () => {
        mockPeerConnection.connectionState = 'connected';
        if (mockPeerConnection.onconnectionstatechange) {
          mockPeerConnection.onconnectionstatechange();
        }
      });

      // Verify event listeners were removed on connection success
      expect(mockPeerConnection.removeEventListener).toHaveBeenCalledWith('icecandidate', expect.any(Function));
      expect(mockPeerConnection.removeEventListener).toHaveBeenCalledWith(
        'connectionstatechange',
        expect.any(Function)
      );
      expect(mockPeerConnection.removeEventListener).toHaveBeenCalledWith(
        'iceconnectionstatechange',
        expect.any(Function)
      );
      expect(mockPeerConnection.removeEventListener).toHaveBeenCalledWith(
        'icegatheringstatechange',
        expect.any(Function)
      );
      expect(mockPeerConnection.removeEventListener).toHaveBeenCalledWith('track', expect.any(Function));
      expect(mockPeerConnection.removeEventListener).toHaveBeenCalledWith('datachannel', expect.any(Function));

      // Clear the mock calls
      vi.clearAllMocks();

      unmount();

      // Should not call removeEventListener again since listeners were already cleared
      expect(mockPeerConnection.removeEventListener).not.toHaveBeenCalled();
    });

    it('should handle cleanup when component unmounts during connection', async () => {
      const { result, unmount } = renderHook(() => useWebRTC('test-room-123', 'host', mockConfig));

      await act(async () => {
        await result.current.startScreenShare();
      });

      // Verify event listeners were added
      expect(mockPeerConnection.addEventListener).toHaveBeenCalledWith('icecandidate', expect.any(Function));
      expect(mockPeerConnection.addEventListener).toHaveBeenCalledWith('connectionstatechange', expect.any(Function));
      expect(mockPeerConnection.addEventListener).toHaveBeenCalledWith(
        'iceconnectionstatechange',
        expect.any(Function)
      );
      expect(mockPeerConnection.addEventListener).toHaveBeenCalledWith('icegatheringstatechange', expect.any(Function));
      expect(mockPeerConnection.addEventListener).toHaveBeenCalledWith('track', expect.any(Function));
      expect(mockPeerConnection.addEventListener).toHaveBeenCalledWith('datachannel', expect.any(Function));

      // Unmount while still connecting
      unmount();

      // Verify event listeners were removed
      expect(mockPeerConnection.removeEventListener).toHaveBeenCalledWith('icecandidate', expect.any(Function));
      expect(mockPeerConnection.removeEventListener).toHaveBeenCalledWith(
        'connectionstatechange',
        expect.any(Function)
      );
      expect(mockPeerConnection.removeEventListener).toHaveBeenCalledWith(
        'iceconnectionstatechange',
        expect.any(Function)
      );
      expect(mockPeerConnection.removeEventListener).toHaveBeenCalledWith(
        'icegatheringstatechange',
        expect.any(Function)
      );
      expect(mockPeerConnection.removeEventListener).toHaveBeenCalledWith('track', expect.any(Function));
      expect(mockPeerConnection.removeEventListener).toHaveBeenCalledWith('datachannel', expect.any(Function));
    });

    it('should handle cleanup when component unmounts during error state', async () => {
      const { result, unmount } = renderHook(() => useWebRTC('test-room-123', 'host', mockConfig));

      await act(async () => {
        await result.current.startScreenShare();
      });

      // Verify event listeners were added
      expect(mockPeerConnection.addEventListener).toHaveBeenCalledWith('icecandidate', expect.any(Function));
      expect(mockPeerConnection.addEventListener).toHaveBeenCalledWith('connectionstatechange', expect.any(Function));
      expect(mockPeerConnection.addEventListener).toHaveBeenCalledWith(
        'iceconnectionstatechange',
        expect.any(Function)
      );
      expect(mockPeerConnection.addEventListener).toHaveBeenCalledWith('icegatheringstatechange', expect.any(Function));
      expect(mockPeerConnection.addEventListener).toHaveBeenCalledWith('track', expect.any(Function));
      expect(mockPeerConnection.addEventListener).toHaveBeenCalledWith('datachannel', expect.any(Function));

      // Simulate connection failure
      global.fetch.mockRejectedValueOnce(new Error('Network error'));

      await act(async () => {
        // Fast-forward time to trigger error handling
        await new Promise((resolve) => setTimeout(resolve, 100));
      });

      // Verify event listeners were removed on connection failure
      expect(mockPeerConnection.removeEventListener).toHaveBeenCalledWith('icecandidate', expect.any(Function));
      expect(mockPeerConnection.removeEventListener).toHaveBeenCalledWith(
        'connectionstatechange',
        expect.any(Function)
      );
      expect(mockPeerConnection.removeEventListener).toHaveBeenCalledWith(
        'iceconnectionstatechange',
        expect.any(Function)
      );
      expect(mockPeerConnection.removeEventListener).toHaveBeenCalledWith(
        'icegatheringstatechange',
        expect.any(Function)
      );
      expect(mockPeerConnection.removeEventListener).toHaveBeenCalledWith('track', expect.any(Function));
      expect(mockPeerConnection.removeEventListener).toHaveBeenCalledWith('datachannel', expect.any(Function));

      // Clear the mock calls
      vi.clearAllMocks();

      unmount();

      // Should not call removeEventListener again since listeners were already cleared
      expect(mockPeerConnection.removeEventListener).not.toHaveBeenCalled();
    });
  });

  describe('Event Listener Cleanup Performance', () => {
    it('should not create memory leaks with multiple event listener creations and cleanups', async () => {
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

      // Verify event listeners were properly cleaned up
      // Each connection creates 6 event listeners, so 5 connections = 30 listeners
      expect(mockPeerConnection.addEventListener).toHaveBeenCalledTimes(30);
      expect(mockPeerConnection.removeEventListener).toHaveBeenCalledTimes(30);
    });

    it('should handle rapid connection state changes without event listener leaks', async () => {
      const { result, unmount } = renderHook(() => useWebRTC('test-room-123', 'host', mockConfig));

      await act(async () => {
        await result.current.startScreenShare();
      });

      // Verify event listeners were added
      expect(mockPeerConnection.addEventListener).toHaveBeenCalledTimes(6);

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

      // Verify event listeners were cleaned up properly
      expect(mockPeerConnection.removeEventListener).toHaveBeenCalledTimes(6);
    });
  });

  describe('Event Listener Cleanup Specific Events', () => {
    it('should cleanup icecandidate event listener specifically', async () => {
      const { result, unmount } = renderHook(() => useWebRTC('test-room-123', 'host', mockConfig));

      await act(async () => {
        await result.current.startScreenShare();
      });

      // Verify icecandidate event listener was added
      expect(mockPeerConnection.addEventListener).toHaveBeenCalledWith('icecandidate', expect.any(Function));

      unmount();

      // Verify icecandidate event listener was removed
      expect(mockPeerConnection.removeEventListener).toHaveBeenCalledWith('icecandidate', expect.any(Function));
    });

    it('should cleanup connectionstatechange event listener specifically', async () => {
      const { result, unmount } = renderHook(() => useWebRTC('test-room-123', 'host', mockConfig));

      await act(async () => {
        await result.current.startScreenShare();
      });

      // Verify connectionstatechange event listener was added
      expect(mockPeerConnection.addEventListener).toHaveBeenCalledWith('connectionstatechange', expect.any(Function));

      unmount();

      // Verify connectionstatechange event listener was removed
      expect(mockPeerConnection.removeEventListener).toHaveBeenCalledWith(
        'connectionstatechange',
        expect.any(Function)
      );
    });

    it('should cleanup iceconnectionstatechange event listener specifically', async () => {
      const { result, unmount } = renderHook(() => useWebRTC('test-room-123', 'host', mockConfig));

      await act(async () => {
        await result.current.startScreenShare();
      });

      // Verify iceconnectionstatechange event listener was added
      expect(mockPeerConnection.addEventListener).toHaveBeenCalledWith(
        'iceconnectionstatechange',
        expect.any(Function)
      );

      unmount();

      // Verify iceconnectionstatechange event listener was removed
      expect(mockPeerConnection.removeEventListener).toHaveBeenCalledWith(
        'iceconnectionstatechange',
        expect.any(Function)
      );
    });

    it('should cleanup icegatheringstatechange event listener specifically', async () => {
      const { result, unmount } = renderHook(() => useWebRTC('test-room-123', 'host', mockConfig));

      await act(async () => {
        await result.current.startScreenShare();
      });

      // Verify icegatheringstatechange event listener was added
      expect(mockPeerConnection.addEventListener).toHaveBeenCalledWith('icegatheringstatechange', expect.any(Function));

      unmount();

      // Verify icegatheringstatechange event listener was removed
      expect(mockPeerConnection.removeEventListener).toHaveBeenCalledWith(
        'icegatheringstatechange',
        expect.any(Function)
      );
    });

    it('should cleanup track event listener specifically', async () => {
      const { result, unmount } = renderHook(() => useWebRTC('test-room-123', 'host', mockConfig));

      await act(async () => {
        await result.current.startScreenShare();
      });

      // Verify track event listener was added
      expect(mockPeerConnection.addEventListener).toHaveBeenCalledWith('track', expect.any(Function));

      unmount();

      // Verify track event listener was removed
      expect(mockPeerConnection.removeEventListener).toHaveBeenCalledWith('track', expect.any(Function));
    });

    it('should cleanup datachannel event listener specifically', async () => {
      const { result, unmount } = renderHook(() => useWebRTC('test-room-123', 'host', mockConfig));

      await act(async () => {
        await result.current.startScreenShare();
      });

      // Verify datachannel event listener was added
      expect(mockPeerConnection.addEventListener).toHaveBeenCalledWith('datachannel', expect.any(Function));

      unmount();

      // Verify datachannel event listener was removed
      expect(mockPeerConnection.removeEventListener).toHaveBeenCalledWith('datachannel', expect.any(Function));
    });
  });
});
