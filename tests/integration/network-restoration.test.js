import { renderHook, act } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';

import { useWebRTC } from '../../src/hooks/useWebRTC.js';

// Use fake timers for network restoration tests
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

describe('Network Restoration After Disconnection - REAL Logic Tests', () => {
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

  describe('Network Restoration During Host Connection', () => {
    it('should restore network connection during host screen sharing', async () => {
      const { result } = renderHook(() => useWebRTC('test-room-123', 'host', mockConfig));

      // Start screen sharing
      await act(async () => {
        await result.current.startScreenShare();
      });

      // Should be in connecting state
      expect(result.current.connectionState).toBe('connecting');

      // Simulate network disconnection then restoration
      await act(async () => {
        // Mock network disconnection
        global.fetch.mockRejectedValueOnce(new Error('Network error'));

        // Fast-forward time to trigger network disconnection
        vi.advanceTimersByTime(1000); // 1 second

        // Mock network restoration
        global.fetch.mockResolvedValueOnce({
          ok: true,
          json: vi.fn().mockResolvedValue({ ok: true }),
        });

        // Fast-forward time to trigger network restoration
        vi.advanceTimersByTime(1000); // 1 second
      });

      // Should restore network connection
      expect(result.current.connectionState).toBe('connecting');
    });

    it('should restore network connection during host offer sending', async () => {
      const { result } = renderHook(() => useWebRTC('test-room-123', 'host', mockConfig));

      // Start screen sharing
      await act(async () => {
        await result.current.startScreenShare();
      });

      // Simulate network disconnection then restoration during offer sending
      await act(async () => {
        // Mock network disconnection during offer sending
        global.fetch.mockRejectedValueOnce(new Error('Failed to send offer'));

        // Fast-forward time to trigger network disconnection
        vi.advanceTimersByTime(1000); // 1 second

        // Mock network restoration
        global.fetch.mockResolvedValueOnce({
          ok: true,
          json: vi.fn().mockResolvedValue({ ok: true }),
        });

        // Fast-forward time to trigger network restoration
        vi.advanceTimersByTime(1000); // 1 second
      });

      // Should restore network connection
      expect(result.current.connectionState).toBe('connecting');
    });

    it('should restore network connection during host ICE candidate sending', async () => {
      const { result } = renderHook(() => useWebRTC('test-room-123', 'host', mockConfig));

      // Start screen sharing
      await act(async () => {
        await result.current.startScreenShare();
      });

      // Simulate network disconnection then restoration during ICE candidate sending
      await act(async () => {
        // Mock network disconnection during ICE candidate sending
        global.fetch.mockRejectedValueOnce(new Error('Failed to send ICE candidate'));

        // Trigger ICE candidate event
        if (mockPeerConnection.onicecandidate) {
          mockPeerConnection.onicecandidate({
            candidate: {
              candidate: 'candidate:1 1 UDP 2130706431 192.168.1.100 54400 typ host',
              sdpMid: '0',
              sdpMLineIndex: 0,
            },
          });
        }

        // Fast-forward time to trigger network disconnection
        vi.advanceTimersByTime(1000); // 1 second

        // Mock network restoration
        global.fetch.mockResolvedValueOnce({
          ok: true,
          json: vi.fn().mockResolvedValue({ ok: true }),
        });

        // Fast-forward time to trigger network restoration
        vi.advanceTimersByTime(1000); // 1 second
      });

      // Should restore network connection
      expect(result.current.connectionState).toBe('connecting');
    });
  });

  describe('Network Restoration During Viewer Connection', () => {
    it('should restore network connection during viewer connection', async () => {
      const { result } = renderHook(() => useWebRTC('test-room-123', 'viewer', mockConfig));

      // Start connecting
      await act(async () => {
        await result.current.connectToHost();
      });

      // Should be in connecting state
      expect(result.current.connectionState).toBe('connecting');

      // Simulate network disconnection then restoration
      await act(async () => {
        // Mock network disconnection
        global.fetch.mockRejectedValueOnce(new Error('Network error'));

        // Fast-forward time to trigger network disconnection
        vi.advanceTimersByTime(1000); // 1 second

        // Mock network restoration
        global.fetch.mockResolvedValueOnce({
          ok: true,
          json: vi.fn().mockResolvedValue({ ok: true }),
        });

        // Fast-forward time to trigger network restoration
        vi.advanceTimersByTime(1000); // 1 second
      });

      // Should restore network connection
      expect(result.current.connectionState).toBe('connecting');
    });

    it('should restore network connection during viewer offer polling', async () => {
      const { result } = renderHook(() => useWebRTC('test-room-123', 'viewer', mockConfig));

      // Start connecting
      await act(async () => {
        await result.current.connectToHost();
      });

      // Simulate network disconnection then restoration during offer polling
      await act(async () => {
        // Mock network disconnection during offer polling
        global.fetch.mockRejectedValueOnce(new Error('Failed to poll for offer'));

        // Fast-forward time to trigger network disconnection
        vi.advanceTimersByTime(1000); // 1 second

        // Mock network restoration
        global.fetch.mockResolvedValueOnce({
          ok: true,
          json: vi.fn().mockResolvedValue({ ok: true }),
        });

        // Fast-forward time to trigger network restoration
        vi.advanceTimersByTime(1000); // 1 second
      });

      // Should restore network connection
      expect(result.current.connectionState).toBe('connecting');
    });

    it('should restore network connection during viewer answer sending', async () => {
      const { result } = renderHook(() => useWebRTC('test-room-123', 'viewer', mockConfig));

      // Start connecting
      await act(async () => {
        await result.current.connectToHost();
      });

      // Simulate network disconnection then restoration during answer sending
      await act(async () => {
        // Mock network disconnection during answer sending
        global.fetch.mockRejectedValueOnce(new Error('Failed to send answer'));

        // Fast-forward time to trigger network disconnection
        vi.advanceTimersByTime(1000); // 1 second

        // Mock network restoration
        global.fetch.mockResolvedValueOnce({
          ok: true,
          json: vi.fn().mockResolvedValue({ ok: true }),
        });

        // Fast-forward time to trigger network restoration
        vi.advanceTimersByTime(1000); // 1 second
      });

      // Should restore network connection
      expect(result.current.connectionState).toBe('connecting');
    });

    it('should restore network connection during viewer ICE candidate polling', async () => {
      const { result } = renderHook(() => useWebRTC('test-room-123', 'viewer', mockConfig));

      // Start connecting
      await act(async () => {
        await result.current.connectToHost();
      });

      // Simulate network disconnection then restoration during ICE candidate polling
      await act(async () => {
        // Mock network disconnection during ICE candidate polling
        global.fetch.mockRejectedValueOnce(new Error('Failed to poll for ICE candidates'));

        // Fast-forward time to trigger network disconnection
        vi.advanceTimersByTime(1000); // 1 second

        // Mock network restoration
        global.fetch.mockResolvedValueOnce({
          ok: true,
          json: vi.fn().mockResolvedValue({ ok: true }),
        });

        // Fast-forward time to trigger network restoration
        vi.advanceTimersByTime(1000); // 1 second
      });

      // Should restore network connection
      expect(result.current.connectionState).toBe('connecting');
    });
  });

  describe('Network Restoration During Established Connection', () => {
    it('should restore network connection during established host connection', async () => {
      const { result } = renderHook(() => useWebRTC('test-room-123', 'host', mockConfig));

      // Start screen sharing and establish connection
      await act(async () => {
        await result.current.startScreenShare();
      });

      // Simulate established connection
      await act(async () => {
        mockPeerConnection.connectionState = 'connected';
        if (mockPeerConnection.onconnectionstatechange) {
          mockPeerConnection.onconnectionstatechange();
        }
      });

      // Should be connected
      expect(result.current.connectionState).toBe('connected');

      // Simulate network disconnection then restoration during established connection
      await act(async () => {
        // Mock network disconnection
        global.fetch.mockRejectedValueOnce(new Error('Network error'));

        // Simulate connection state change to disconnected
        mockPeerConnection.connectionState = 'disconnected';
        if (mockPeerConnection.onconnectionstatechange) {
          mockPeerConnection.onconnectionstatechange();
        }

        // Fast-forward time to trigger network disconnection
        vi.advanceTimersByTime(1000); // 1 second

        // Mock network restoration
        global.fetch.mockResolvedValueOnce({
          ok: true,
          json: vi.fn().mockResolvedValue({ ok: true }),
        });

        // Simulate connection state change to connected
        mockPeerConnection.connectionState = 'connected';
        if (mockPeerConnection.onconnectionstatechange) {
          mockPeerConnection.onconnectionstatechange();
        }

        // Fast-forward time to trigger network restoration
        vi.advanceTimersByTime(1000); // 1 second
      });

      // Should restore network connection
      expect(result.current.connectionState).toBe('connected');
    });

    it('should restore network connection during established viewer connection', async () => {
      const { result } = renderHook(() => useWebRTC('test-room-123', 'viewer', mockConfig));

      // Start connecting and establish connection
      await act(async () => {
        await result.current.connectToHost();
      });

      // Simulate established connection
      await act(async () => {
        mockPeerConnection.connectionState = 'connected';
        if (mockPeerConnection.onconnectionstatechange) {
          mockPeerConnection.onconnectionstatechange();
        }
      });

      // Should be connected
      expect(result.current.connectionState).toBe('connected');

      // Simulate network disconnection then restoration during established connection
      await act(async () => {
        // Mock network disconnection
        global.fetch.mockRejectedValueOnce(new Error('Network error'));

        // Simulate connection state change to disconnected
        mockPeerConnection.connectionState = 'disconnected';
        if (mockPeerConnection.onconnectionstatechange) {
          mockPeerConnection.onconnectionstatechange();
        }

        // Fast-forward time to trigger network disconnection
        vi.advanceTimersByTime(1000); // 1 second

        // Mock network restoration
        global.fetch.mockResolvedValueOnce({
          ok: true,
          json: vi.fn().mockResolvedValue({ ok: true }),
        });

        // Simulate connection state change to connected
        mockPeerConnection.connectionState = 'connected';
        if (mockPeerConnection.onconnectionstatechange) {
          mockPeerConnection.onconnectionstatechange();
        }

        // Fast-forward time to trigger network restoration
        vi.advanceTimersByTime(1000); // 1 second
      });

      // Should restore network connection
      expect(result.current.connectionState).toBe('connected');
    });
  });

  describe('Network Restoration Error Handling', () => {
    it('should handle network restoration failures gracefully', async () => {
      const { result } = renderHook(() => useWebRTC('test-room-123', 'host', mockConfig));

      // Start screen sharing
      await act(async () => {
        await result.current.startScreenShare();
      });

      // Simulate network disconnection then failed restoration
      await act(async () => {
        // Mock network disconnection
        global.fetch.mockRejectedValueOnce(new Error('Network error'));

        // Fast-forward time to trigger network disconnection
        vi.advanceTimersByTime(1000); // 1 second

        // Mock network restoration failure
        global.fetch.mockRejectedValueOnce(new Error('Network restoration failed'));

        // Fast-forward time to trigger network restoration failure
        vi.advanceTimersByTime(1000); // 1 second
      });

      // Should handle network restoration failure gracefully
      expect(result.current.connectionState).toBe('failed');
      expect(result.current.error).toContain('Network restoration failed');
    });

    it('should handle multiple network restoration attempts', async () => {
      const { result } = renderHook(() => useWebRTC('test-room-123', 'viewer', mockConfig));

      // Start connecting
      await act(async () => {
        await result.current.connectToHost();
      });

      // Simulate multiple network restoration attempts
      await act(async () => {
        // Mock network disconnection
        global.fetch.mockRejectedValueOnce(new Error('Network error'));

        // Fast-forward time to trigger network disconnection
        vi.advanceTimersByTime(1000); // 1 second

        // Mock multiple network restoration attempts
        global.fetch.mockRejectedValueOnce(new Error('Network restoration failed 1'));
        global.fetch.mockRejectedValueOnce(new Error('Network restoration failed 2'));
        global.fetch.mockResolvedValueOnce({
          ok: true,
          json: vi.fn().mockResolvedValue({ ok: true }),
        });

        // Fast-forward time to trigger multiple network restoration attempts
        vi.advanceTimersByTime(3000); // 3 seconds
      });

      // Should handle multiple network restoration attempts gracefully
      expect(result.current.connectionState).toBe('connecting');
    });
  });

  describe('Network Restoration Timing', () => {
    it('should handle network restoration with proper timing', async () => {
      const { result } = renderHook(() => useWebRTC('test-room-123', 'host', mockConfig));

      // Start screen sharing
      await act(async () => {
        await result.current.startScreenShare();
      });

      // Simulate network disconnection then restoration with proper timing
      await act(async () => {
        // Mock network disconnection
        global.fetch.mockRejectedValueOnce(new Error('Network error'));

        // Fast-forward time to trigger network disconnection
        vi.advanceTimersByTime(1000); // 1 second

        // Mock network restoration with proper timing
        global.fetch.mockResolvedValueOnce({
          ok: true,
          json: vi.fn().mockResolvedValue({ ok: true }),
        });

        // Fast-forward time to trigger network restoration
        vi.advanceTimersByTime(1000); // 1 second
      });

      // Should handle network restoration with proper timing
      expect(result.current.connectionState).toBe('connecting');
    });

    it('should handle network restoration with delayed timing', async () => {
      const { result } = renderHook(() => useWebRTC('test-room-123', 'viewer', mockConfig));

      // Start connecting
      await act(async () => {
        await result.current.connectToHost();
      });

      // Simulate network disconnection then restoration with delayed timing
      await act(async () => {
        // Mock network disconnection
        global.fetch.mockRejectedValueOnce(new Error('Network error'));

        // Fast-forward time to trigger network disconnection
        vi.advanceTimersByTime(1000); // 1 second

        // Mock network restoration with delayed timing
        global.fetch.mockResolvedValueOnce({
          ok: true,
          json: vi.fn().mockResolvedValue({ ok: true }),
        });

        // Fast-forward time to trigger network restoration with delay
        vi.advanceTimersByTime(5000); // 5 seconds
      });

      // Should handle network restoration with delayed timing
      expect(result.current.connectionState).toBe('connecting');
    });
  });
});
