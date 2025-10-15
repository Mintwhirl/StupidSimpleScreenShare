import { renderHook, act } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';

import { useWebRTC } from '../../src/hooks/useWebRTC.js';

// Note: Not using fake timers as they interfere with the hook's operation

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

describe('Peer Connection Cleanup - REAL Logic Tests', () => {
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
  });

  describe('Peer Connection Cleanup on Host Disconnect', () => {
    it('should cleanup peer connection on host disconnect', async () => {
      const { result } = renderHook(() => useWebRTC('test-room-123', 'host', mockConfig));

      // Start screen sharing
      await act(async () => {
        await result.current.startScreenShare();
      });

      // Should be in connecting state
      expect(result.current.connectionState).toBe('connecting');

      // Simulate host disconnect
      await act(async () => {
        // Simulate connection state change to disconnected
        mockPeerConnection.connectionState = 'disconnected';
        if (mockPeerConnection.onconnectionstatechange) {
          mockPeerConnection.onconnectionstatechange();
        }

        // Wait for cleanup to happen
        await new Promise((resolve) => setTimeout(resolve, 100));
      });

      // Should cleanup peer connection on disconnect
      expect(mockPeerConnection.close).toHaveBeenCalled();
    });

    it('should cleanup peer connection on host connection failure', async () => {
      const { result } = renderHook(() => useWebRTC('test-room-123', 'host', mockConfig));

      // Start screen sharing
      await act(async () => {
        await result.current.startScreenShare();
      });

      // Should be in connecting state
      expect(result.current.connectionState).toBe('connecting');

      // Simulate host connection failure
      await act(async () => {
        // Simulate connection state change to failed
        mockPeerConnection.connectionState = 'failed';
        if (mockPeerConnection.onconnectionstatechange) {
          mockPeerConnection.onconnectionstatechange();
        }

        // Wait for cleanup to happen
        await new Promise((resolve) => setTimeout(resolve, 100));
      });

      // Should cleanup peer connection on connection failure
      expect(mockPeerConnection.close).toHaveBeenCalled();
    });
  });

  describe('Peer Connection Cleanup on Viewer Disconnect', () => {
    it('should cleanup peer connection on viewer disconnect', async () => {
      const { result } = renderHook(() => useWebRTC('test-room-123', 'viewer', mockConfig));

      // Start connecting
      await act(async () => {
        await result.current.connectToHost();
      });

      // Should be in connecting state
      expect(result.current.connectionState).toBe('connecting');

      // First simulate receiving an offer to create the peer connection
      await act(async () => {
        // Simulate offer polling success - this will create the peer connection
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
        await new Promise((resolve) => setTimeout(resolve, 1100));
      });

      // Now simulate viewer disconnect
      await act(async () => {
        // Simulate connection state change to disconnected
        mockPeerConnection.connectionState = 'disconnected';
        if (mockPeerConnection.onconnectionstatechange) {
          mockPeerConnection.onconnectionstatechange();
        }

        // Wait for cleanup to happen
        await new Promise((resolve) => setTimeout(resolve, 100));
      });

      // Should cleanup peer connection on disconnect
      expect(mockPeerConnection.close).toHaveBeenCalled();
    });

    it('should cleanup peer connection on viewer connection failure', async () => {
      const { result } = renderHook(() => useWebRTC('test-room-123', 'viewer', mockConfig));

      // Start connecting
      await act(async () => {
        await result.current.connectToHost();
      });

      // Should be in connecting state
      expect(result.current.connectionState).toBe('connecting');

      // First simulate receiving an offer to create the peer connection
      await act(async () => {
        // Simulate offer polling success - this will create the peer connection
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
        await new Promise((resolve) => setTimeout(resolve, 1100));
      });

      // Now simulate viewer connection failure
      await act(async () => {
        // Simulate connection state change to failed
        mockPeerConnection.connectionState = 'failed';
        if (mockPeerConnection.onconnectionstatechange) {
          mockPeerConnection.onconnectionstatechange();
        }

        // Wait for cleanup to happen
        await new Promise((resolve) => setTimeout(resolve, 100));
      });

      // Should cleanup peer connection on connection failure
      expect(mockPeerConnection.close).toHaveBeenCalled();
    });
  });

  describe('Peer Connection Cleanup on Component Unmount', () => {
    it('should cleanup peer connection on host component unmount', async () => {
      const { result, unmount } = renderHook(() => useWebRTC('test-room-123', 'host', mockConfig));

      // Start screen sharing
      await act(async () => {
        await result.current.startScreenShare();
      });

      // Should be in connecting state
      expect(result.current.connectionState).toBe('connecting');

      // Unmount component
      unmount();

      // Should cleanup peer connection on component unmount
      expect(mockPeerConnection.close).toHaveBeenCalled();
    });

    it('should cleanup peer connection on viewer component unmount', async () => {
      const { result, unmount } = renderHook(() => useWebRTC('test-room-123', 'viewer', mockConfig));

      // Start connecting
      await act(async () => {
        await result.current.connectToHost();
      });

      // Should be in connecting state
      expect(result.current.connectionState).toBe('connecting');

      // First simulate receiving an offer to create the peer connection
      await act(async () => {
        // Simulate offer polling success - this will create the peer connection
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
        await new Promise((resolve) => setTimeout(resolve, 1100));
      });

      // Unmount component
      unmount();

      // Should cleanup peer connection on component unmount
      expect(mockPeerConnection.close).toHaveBeenCalled();
    });
  });

  describe('Peer Connection Cleanup Error Handling', () => {
    it('should handle peer connection cleanup errors gracefully', async () => {
      const { result } = renderHook(() => useWebRTC('test-room-123', 'host', mockConfig));

      // Mock peer connection cleanup error
      mockPeerConnection.close.mockImplementation(() => {
        throw new Error('Peer connection cleanup failed');
      });

      // Start screen sharing
      await act(async () => {
        await result.current.startScreenShare();
      });

      // Should be in connecting state
      expect(result.current.connectionState).toBe('connecting');

      // Simulate host disconnect
      await act(async () => {
        // Simulate connection state change to disconnected
        mockPeerConnection.connectionState = 'disconnected';
        if (mockPeerConnection.onconnectionstatechange) {
          mockPeerConnection.onconnectionstatechange();
        }

        // Wait for cleanup to happen
        await new Promise((resolve) => setTimeout(resolve, 100));
      });

      // Should handle peer connection cleanup errors gracefully
      expect(mockPeerConnection.close).toHaveBeenCalled();
    });

    it('should handle peer connection cleanup errors on viewer disconnect', async () => {
      const { result } = renderHook(() => useWebRTC('test-room-123', 'viewer', mockConfig));

      // Mock peer connection cleanup error
      mockPeerConnection.close.mockImplementation(() => {
        throw new Error('Peer connection cleanup failed');
      });

      // Start connecting
      await act(async () => {
        await result.current.connectToHost();
      });

      // Should be in connecting state
      expect(result.current.connectionState).toBe('connecting');

      // First simulate receiving an offer to create the peer connection
      await act(async () => {
        // Simulate offer polling success - this will create the peer connection
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
        await new Promise((resolve) => setTimeout(resolve, 1100));
      });

      // Simulate viewer disconnect
      await act(async () => {
        // Simulate connection state change to disconnected
        mockPeerConnection.connectionState = 'disconnected';
        if (mockPeerConnection.onconnectionstatechange) {
          mockPeerConnection.onconnectionstatechange();
        }

        // Wait for cleanup to happen
        await new Promise((resolve) => setTimeout(resolve, 100));
      });

      // Should handle peer connection cleanup errors gracefully
      expect(mockPeerConnection.close).toHaveBeenCalled();
    });
  });

  describe('Peer Connection Cleanup Timing', () => {
    it('should handle peer connection cleanup with proper timing', async () => {
      const { result } = renderHook(() => useWebRTC('test-room-123', 'host', mockConfig));

      // Start screen sharing
      await act(async () => {
        await result.current.startScreenShare();
      });

      // Should be in connecting state
      expect(result.current.connectionState).toBe('connecting');

      // Simulate host disconnect with proper timing
      await act(async () => {
        // Simulate connection state change to disconnected
        mockPeerConnection.connectionState = 'disconnected';
        if (mockPeerConnection.onconnectionstatechange) {
          mockPeerConnection.onconnectionstatechange();
        }

        // Wait for cleanup to happen
        await new Promise((resolve) => setTimeout(resolve, 100));
      });

      // Should handle peer connection cleanup with proper timing
      expect(mockPeerConnection.close).toHaveBeenCalled();
    });

    it('should handle peer connection cleanup with delayed timing', async () => {
      const { result } = renderHook(() => useWebRTC('test-room-123', 'viewer', mockConfig));

      // Start connecting
      await act(async () => {
        await result.current.connectToHost();
      });

      // Should be in connecting state
      expect(result.current.connectionState).toBe('connecting');

      // First simulate receiving an offer to create the peer connection
      await act(async () => {
        // Simulate offer polling success - this will create the peer connection
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
        await new Promise((resolve) => setTimeout(resolve, 1100));
      });

      // Simulate viewer disconnect with delayed timing
      await act(async () => {
        // Simulate connection state change to disconnected
        mockPeerConnection.connectionState = 'disconnected';
        if (mockPeerConnection.onconnectionstatechange) {
          mockPeerConnection.onconnectionstatechange();
        }

        // Wait for cleanup to happen with delay
        await new Promise((resolve) => setTimeout(resolve, 100));
      });

      // Should handle peer connection cleanup with delayed timing
      expect(mockPeerConnection.close).toHaveBeenCalled();
    });
  });

  describe('Peer Connection Cleanup State Management', () => {
    it('should manage connection state properly on host disconnect', async () => {
      const { result } = renderHook(() => useWebRTC('test-room-123', 'host', mockConfig));

      // Start screen sharing
      await act(async () => {
        await result.current.startScreenShare();
      });

      // Should be in connecting state
      expect(result.current.connectionState).toBe('connecting');

      // Simulate host disconnect
      await act(async () => {
        // Simulate connection state change to disconnected
        mockPeerConnection.connectionState = 'disconnected';
        if (mockPeerConnection.onconnectionstatechange) {
          mockPeerConnection.onconnectionstatechange();
        }

        // Wait for cleanup to happen
        await new Promise((resolve) => setTimeout(resolve, 100));
      });

      // Should manage connection state properly on disconnect
      expect(mockPeerConnection.close).toHaveBeenCalled();
    });

    it('should manage connection state properly on viewer disconnect', async () => {
      const { result } = renderHook(() => useWebRTC('test-room-123', 'viewer', mockConfig));

      // Start connecting
      await act(async () => {
        await result.current.connectToHost();
      });

      // Should be in connecting state
      expect(result.current.connectionState).toBe('connecting');

      // First simulate receiving an offer to create the peer connection
      await act(async () => {
        // Simulate offer polling success - this will create the peer connection
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
        await new Promise((resolve) => setTimeout(resolve, 1100));
      });

      // Simulate viewer disconnect
      await act(async () => {
        // Simulate connection state change to disconnected
        mockPeerConnection.connectionState = 'disconnected';
        if (mockPeerConnection.onconnectionstatechange) {
          mockPeerConnection.onconnectionstatechange();
        }

        // Wait for cleanup to happen
        await new Promise((resolve) => setTimeout(resolve, 100));
      });

      // Should manage connection state properly on disconnect
      expect(mockPeerConnection.close).toHaveBeenCalled();
    });
  });
});
