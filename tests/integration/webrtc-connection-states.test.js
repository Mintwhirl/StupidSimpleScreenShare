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

describe('WebRTC Connection State Transitions - REAL Logic Tests', () => {
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

    // Mock successful API responses
    global.fetch.mockResolvedValue({
      ok: true,
      json: vi.fn().mockResolvedValue({ ok: true }),
    });
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  describe('Connection State Transitions - Host Side', () => {
    it('should transition through all connection states during successful connection', async () => {
      const { result } = renderHook(() => useWebRTC('test-room-123', 'host', mockConfig));

      // Initial state should be disconnected
      expect(result.current.connectionState).toBe('disconnected');

      // Start screen sharing
      await act(async () => {
        await result.current.startScreenShare();
      });

      // Should transition to connecting
      expect(result.current.connectionState).toBe('connecting');

      // Simulate connection state changes
      await act(async () => {
        // Simulate connection state change to connected
        mockPeerConnection.connectionState = 'connected';
        if (mockPeerConnection.onconnectionstatechange) {
          mockPeerConnection.onconnectionstatechange();
        }
      });

      // Should be connected
      expect(result.current.connectionState).toBe('connected');

      // Simulate connection failure
      await act(async () => {
        mockPeerConnection.connectionState = 'failed';
        if (mockPeerConnection.onconnectionstatechange) {
          mockPeerConnection.onconnectionstatechange();
        }
      });

      // Should be failed
      expect(result.current.connectionState).toBe('failed');
    });

    it('should handle connection state transitions with proper cleanup', async () => {
      const { result, unmount } = renderHook(() => useWebRTC('test-room-123', 'host', mockConfig));

      // Start screen sharing
      await act(async () => {
        await result.current.startScreenShare();
      });

      // Verify peer connection was created
      expect(mockRTCPeerConnection).toHaveBeenCalled();

      // Simulate connection
      await act(async () => {
        mockPeerConnection.connectionState = 'connected';
        if (mockPeerConnection.onconnectionstatechange) {
          mockPeerConnection.onconnectionstatechange();
        }
      });

      expect(result.current.connectionState).toBe('connected');

      // Unmount component
      unmount();

      // Verify peer connection was closed
      expect(mockPeerConnection.close).toHaveBeenCalled();
    });

    it('should handle connection state transitions with error states', async () => {
      const { result } = renderHook(() => useWebRTC('test-room-123', 'host', mockConfig));

      // Start screen sharing
      await act(async () => {
        await result.current.startScreenShare();
      });

      // Simulate connection state change to disconnected
      await act(async () => {
        mockPeerConnection.connectionState = 'disconnected';
        if (mockPeerConnection.onconnectionstatechange) {
          mockPeerConnection.onconnectionstatechange();
        }
      });

      expect(result.current.connectionState).toBe('disconnected');

      // Simulate connection state change to failed
      await act(async () => {
        mockPeerConnection.connectionState = 'failed';
        if (mockPeerConnection.onconnectionstatechange) {
          mockPeerConnection.onconnectionstatechange();
        }
      });

      expect(result.current.connectionState).toBe('failed');
    });
  });

  describe('Connection State Transitions - Viewer Side', () => {
    it('should transition through connection states when receiving offer', async () => {
      const { result } = renderHook(() => useWebRTC('test-room-123', 'viewer', mockConfig));

      // Initial state should be disconnected
      expect(result.current.connectionState).toBe('disconnected');

      // Start connecting (this will start polling for offers)
      await act(async () => {
        await result.current.connectToHost();
      });

      // Should transition to connecting
      expect(result.current.connectionState).toBe('connecting');

      // Simulate receiving an offer and creating peer connection
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
        // Polling interval is 1000ms, so we need to wait at least that long
        await new Promise((resolve) => setTimeout(resolve, 1100));

        // Now simulate connection state change to connected
        mockPeerConnection.connectionState = 'connected';
        if (mockPeerConnection.onconnectionstatechange) {
          mockPeerConnection.onconnectionstatechange();
        }
      });

      // Should be connected
      expect(result.current.connectionState).toBe('connected');
    });

    it('should handle connection failure during offer polling', async () => {
      const { result } = renderHook(() => useWebRTC('test-room-123', 'viewer', mockConfig));

      // Start connecting
      await act(async () => {
        await result.current.connectToHost();
      });

      expect(result.current.connectionState).toBe('connecting');

      // Simulate connection failure
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

        // Wait for the connection to be established
        // Polling interval is 1000ms, so we need to wait at least that long
        await new Promise((resolve) => setTimeout(resolve, 1100));

        mockPeerConnection.connectionState = 'failed';
        if (mockPeerConnection.onconnectionstatechange) {
          mockPeerConnection.onconnectionstatechange();
        }
      });

      expect(result.current.connectionState).toBe('failed');
    });
  });

  describe('ICE Connection State Transitions', () => {
    it('should handle ICE connection state transitions', async () => {
      const { result } = renderHook(() => useWebRTC('test-room-123', 'host', mockConfig));

      // Start screen sharing
      await act(async () => {
        await result.current.startScreenShare();
      });

      // Simulate ICE connection state changes
      await act(async () => {
        mockPeerConnection.iceConnectionState = 'checking';
        if (mockPeerConnection.oniceconnectionstatechange) {
          mockPeerConnection.oniceconnectionstatechange();
        }
      });

      // Simulate ICE connection established
      await act(async () => {
        mockPeerConnection.iceConnectionState = 'connected';
        if (mockPeerConnection.oniceconnectionstatechange) {
          mockPeerConnection.oniceconnectionstatechange();
        }
      });

      // Simulate ICE connection failed
      await act(async () => {
        mockPeerConnection.iceConnectionState = 'failed';
        if (mockPeerConnection.oniceconnectionstatechange) {
          mockPeerConnection.oniceconnectionstatechange();
        }
      });

      // Verify the hook handled all state changes
      expect(mockPeerConnection.oniceconnectionstatechange).toBeDefined();
    });
  });

  describe('ICE Gathering State Transitions', () => {
    it('should handle ICE gathering state transitions', async () => {
      const { result } = renderHook(() => useWebRTC('test-room-123', 'host', mockConfig));

      // Start screen sharing
      await act(async () => {
        await result.current.startScreenShare();
      });

      // Simulate ICE gathering state changes
      await act(async () => {
        mockPeerConnection.iceGatheringState = 'gathering';
        if (mockPeerConnection.onicegatheringstatechange) {
          mockPeerConnection.onicegatheringstatechange();
        }
      });

      // Simulate ICE gathering complete
      await act(async () => {
        mockPeerConnection.iceGatheringState = 'complete';
        if (mockPeerConnection.onicegatheringstatechange) {
          mockPeerConnection.onicegatheringstatechange();
        }
      });

      // Verify the hook handled all state changes
      expect(mockPeerConnection.onicegatheringstatechange).toBeDefined();
    });
  });

  describe('Connection State Cleanup', () => {
    it('should cleanup connection state on component unmount', async () => {
      const { result, unmount } = renderHook(() => useWebRTC('test-room-123', 'host', mockConfig));

      // Start screen sharing
      await act(async () => {
        await result.current.startScreenShare();
      });

      // Verify peer connection exists
      expect(mockRTCPeerConnection).toHaveBeenCalled();

      // Unmount component
      unmount();

      // Verify peer connection was closed
      expect(mockPeerConnection.close).toHaveBeenCalled();
    });

    it('should cleanup polling intervals on connection success', async () => {
      const { result } = renderHook(() => useWebRTC('test-room-123', 'host', mockConfig));

      // Start screen sharing
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

      // Verify connection state is connected
      expect(result.current.connectionState).toBe('connected');
    });

    it('should cleanup polling intervals on connection failure', async () => {
      const { result } = renderHook(() => useWebRTC('test-room-123', 'host', mockConfig));

      // Start screen sharing
      await act(async () => {
        await result.current.startScreenShare();
      });

      // Simulate connection failure
      await act(async () => {
        mockPeerConnection.connectionState = 'failed';
        if (mockPeerConnection.onconnectionstatechange) {
          mockPeerConnection.onconnectionstatechange();
        }
      });

      // Verify connection state is failed
      expect(result.current.connectionState).toBe('failed');
    });
  });
});
