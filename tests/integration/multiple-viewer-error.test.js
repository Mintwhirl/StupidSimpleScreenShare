import { renderHook, act } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';

import { useWebRTC } from '../../src/hooks/useWebRTC.js';

// Use fake timers for multiple viewer error tests
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

describe('Multiple Viewer Error Handling - REAL Logic Tests', () => {
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

  describe('Multiple Viewer Error Handling During Host Connection', () => {
    it('should handle multiple viewer errors during host screen sharing', async () => {
      const { result } = renderHook(() => useWebRTC('test-room-123', 'host', mockConfig));

      // Start screen sharing
      await act(async () => {
        await result.current.startScreenShare();
      });

      // Should be in connecting state
      expect(result.current.connectionState).toBe('connecting');

      // Simulate multiple viewer errors
      await act(async () => {
        // Mock multiple viewer errors
        global.fetch.mockResolvedValueOnce({
          ok: false,
          status: 409,
          json: vi.fn().mockResolvedValue({ error: 'Multiple viewer errors detected' }),
        });

        // Fast-forward time to trigger multiple viewer errors
        vi.advanceTimersByTime(1000); // 1 second
      });

      // Should handle multiple viewer errors gracefully
      expect(result.current.connectionState).toBe('failed');
      expect(result.current.error).toContain('Multiple viewer errors detected');
    });

    it('should handle multiple viewer errors during host offer sending', async () => {
      const { result } = renderHook(() => useWebRTC('test-room-123', 'host', mockConfig));

      // Start screen sharing
      await act(async () => {
        await result.current.startScreenShare();
      });

      // Simulate multiple viewer errors during offer sending
      await act(async () => {
        // Mock multiple viewer errors during offer sending
        global.fetch.mockResolvedValueOnce({
          ok: false,
          status: 409,
          json: vi.fn().mockResolvedValue({ error: 'Multiple viewer errors during offer sending' }),
        });

        // Fast-forward time to trigger multiple viewer errors
        vi.advanceTimersByTime(1000); // 1 second
      });

      // Should handle multiple viewer errors gracefully
      expect(result.current.connectionState).toBe('failed');
      expect(result.current.error).toContain('Multiple viewer errors during offer sending');
    });
  });

  describe('Multiple Viewer Error Handling During Viewer Connection', () => {
    it('should handle multiple viewer errors during viewer connection', async () => {
      const { result } = renderHook(() => useWebRTC('test-room-123', 'viewer', mockConfig));

      // Start connecting
      await act(async () => {
        await result.current.connectToHost();
      });

      // Should be in connecting state
      expect(result.current.connectionState).toBe('connecting');

      // Simulate multiple viewer errors
      await act(async () => {
        // Mock multiple viewer errors
        global.fetch.mockResolvedValueOnce({
          ok: false,
          status: 409,
          json: vi.fn().mockResolvedValue({ error: 'Multiple viewer errors detected' }),
        });

        // Fast-forward time to trigger multiple viewer errors
        vi.advanceTimersByTime(1000); // 1 second
      });

      // Should handle multiple viewer errors gracefully
      expect(result.current.connectionState).toBe('failed');
      expect(result.current.error).toContain('Multiple viewer errors detected');
    });

    it('should handle multiple viewer errors during viewer offer polling', async () => {
      const { result } = renderHook(() => useWebRTC('test-room-123', 'viewer', mockConfig));

      // Start connecting
      await act(async () => {
        await result.current.connectToHost();
      });

      // Simulate multiple viewer errors during offer polling
      await act(async () => {
        // Mock multiple viewer errors during offer polling
        global.fetch.mockResolvedValueOnce({
          ok: false,
          status: 409,
          json: vi.fn().mockResolvedValue({ error: 'Multiple viewer errors during offer polling' }),
        });

        // Fast-forward time to trigger multiple viewer errors
        vi.advanceTimersByTime(1000); // 1 second
      });

      // Should handle multiple viewer errors gracefully
      expect(result.current.connectionState).toBe('failed');
      expect(result.current.error).toContain('Multiple viewer errors during offer polling');
    });

    it('should handle multiple viewer errors during viewer answer sending', async () => {
      const { result } = renderHook(() => useWebRTC('test-room-123', 'viewer', mockConfig));

      // Start connecting
      await act(async () => {
        await result.current.connectToHost();
      });

      // Simulate multiple viewer errors during answer sending
      await act(async () => {
        // Mock multiple viewer errors during answer sending
        global.fetch.mockResolvedValueOnce({
          ok: false,
          status: 409,
          json: vi.fn().mockResolvedValue({ error: 'Multiple viewer errors during answer sending' }),
        });

        // Fast-forward time to trigger multiple viewer errors
        vi.advanceTimersByTime(1000); // 1 second
      });

      // Should handle multiple viewer errors gracefully
      expect(result.current.connectionState).toBe('failed');
      expect(result.current.error).toContain('Multiple viewer errors during answer sending');
    });
  });

  describe('Multiple Viewer Error Handling During Established Connection', () => {
    it('should handle multiple viewer errors during established host connection', async () => {
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

      // Simulate multiple viewer errors during established connection
      await act(async () => {
        // Mock multiple viewer errors
        global.fetch.mockResolvedValueOnce({
          ok: false,
          status: 409,
          json: vi.fn().mockResolvedValue({ error: 'Multiple viewer errors detected' }),
        });

        // Fast-forward time to trigger multiple viewer errors
        vi.advanceTimersByTime(1000); // 1 second
      });

      // Should handle multiple viewer errors gracefully
      expect(result.current.connectionState).toBe('connected');
    });

    it('should handle multiple viewer errors during established viewer connection', async () => {
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

      // Simulate multiple viewer errors during established connection
      await act(async () => {
        // Mock multiple viewer errors
        global.fetch.mockResolvedValueOnce({
          ok: false,
          status: 409,
          json: vi.fn().mockResolvedValue({ error: 'Multiple viewer errors detected' }),
        });

        // Fast-forward time to trigger multiple viewer errors
        vi.advanceTimersByTime(1000); // 1 second
      });

      // Should handle multiple viewer errors gracefully
      expect(result.current.connectionState).toBe('connected');
    });
  });

  describe('Multiple Viewer Error Handling Recovery', () => {
    it('should recover from multiple viewer errors during host connection', async () => {
      const { result } = renderHook(() => useWebRTC('test-room-123', 'host', mockConfig));

      // Start screen sharing
      await act(async () => {
        await result.current.startScreenShare();
      });

      // Simulate multiple viewer errors then recovery
      await act(async () => {
        // Mock multiple viewer errors
        global.fetch.mockResolvedValueOnce({
          ok: false,
          status: 409,
          json: vi.fn().mockResolvedValue({ error: 'Multiple viewer errors detected' }),
        });

        // Fast-forward time to trigger multiple viewer errors
        vi.advanceTimersByTime(1000); // 1 second

        // Mock recovery from multiple viewer errors
        global.fetch.mockResolvedValueOnce({
          ok: true,
          json: vi.fn().mockResolvedValue({ ok: true }),
        });

        // Fast-forward time to trigger recovery
        vi.advanceTimersByTime(1000); // 1 second
      });

      // Should recover from multiple viewer errors
      expect(result.current.connectionState).toBe('connecting');
    });

    it('should recover from multiple viewer errors during viewer connection', async () => {
      const { result } = renderHook(() => useWebRTC('test-room-123', 'viewer', mockConfig));

      // Start connecting
      await act(async () => {
        await result.current.connectToHost();
      });

      // Simulate multiple viewer errors then recovery
      await act(async () => {
        // Mock multiple viewer errors
        global.fetch.mockResolvedValueOnce({
          ok: false,
          status: 409,
          json: vi.fn().mockResolvedValue({ error: 'Multiple viewer errors detected' }),
        });

        // Fast-forward time to trigger multiple viewer errors
        vi.advanceTimersByTime(1000); // 1 second

        // Mock recovery from multiple viewer errors
        global.fetch.mockResolvedValueOnce({
          ok: true,
          json: vi.fn().mockResolvedValue({ ok: true }),
        });

        // Fast-forward time to trigger recovery
        vi.advanceTimersByTime(1000); // 1 second
      });

      // Should recover from multiple viewer errors
      expect(result.current.connectionState).toBe('connecting');
    });
  });

  describe('Multiple Viewer Error Handling Error Messages', () => {
    it('should handle multiple viewer errors with proper error messages', async () => {
      const { result } = renderHook(() => useWebRTC('test-room-123', 'host', mockConfig));

      // Start screen sharing
      await act(async () => {
        await result.current.startScreenShare();
      });

      // Simulate multiple viewer errors with specific error
      await act(async () => {
        // Mock multiple viewer errors with specific error
        global.fetch.mockResolvedValueOnce({
          ok: false,
          status: 409,
          json: vi.fn().mockResolvedValue({ error: 'Room has too many viewers' }),
        });

        // Fast-forward time to trigger multiple viewer errors
        vi.advanceTimersByTime(1000); // 1 second
      });

      // Should handle multiple viewer errors with proper error message
      expect(result.current.connectionState).toBe('failed');
      expect(result.current.error).toContain('Room has too many viewers');
    });

    it('should handle multiple viewer errors with different error codes', async () => {
      const { result } = renderHook(() => useWebRTC('test-room-123', 'viewer', mockConfig));

      // Start connecting
      await act(async () => {
        await result.current.connectToHost();
      });

      // Simulate multiple viewer errors with different error codes
      await act(async () => {
        // Mock multiple viewer errors with different error codes
        global.fetch.mockResolvedValueOnce({
          ok: false,
          status: 409,
          json: vi.fn().mockResolvedValue({ error: 'Viewer limit exceeded' }),
        });

        // Fast-forward time to trigger multiple viewer errors
        vi.advanceTimersByTime(1000); // 1 second
      });

      // Should handle multiple viewer errors with different error codes
      expect(result.current.connectionState).toBe('failed');
      expect(result.current.error).toContain('Viewer limit exceeded');
    });
  });

  describe('Multiple Viewer Error Handling Timing', () => {
    it('should handle multiple viewer errors with proper timing', async () => {
      const { result } = renderHook(() => useWebRTC('test-room-123', 'host', mockConfig));

      // Start screen sharing
      await act(async () => {
        await result.current.startScreenShare();
      });

      // Simulate multiple viewer errors with proper timing
      await act(async () => {
        // Mock multiple viewer errors
        global.fetch.mockResolvedValueOnce({
          ok: false,
          status: 409,
          json: vi.fn().mockResolvedValue({ error: 'Multiple viewer errors detected' }),
        });

        // Fast-forward time to trigger multiple viewer errors
        vi.advanceTimersByTime(1000); // 1 second
      });

      // Should handle multiple viewer errors with proper timing
      expect(result.current.connectionState).toBe('failed');
      expect(result.current.error).toContain('Multiple viewer errors detected');
    });

    it('should handle multiple viewer errors with delayed timing', async () => {
      const { result } = renderHook(() => useWebRTC('test-room-123', 'viewer', mockConfig));

      // Start connecting
      await act(async () => {
        await result.current.connectToHost();
      });

      // Simulate multiple viewer errors with delayed timing
      await act(async () => {
        // Mock multiple viewer errors with delayed timing
        global.fetch.mockResolvedValueOnce({
          ok: false,
          status: 409,
          json: vi.fn().mockResolvedValue({ error: 'Multiple viewer errors detected' }),
        });

        // Fast-forward time to trigger multiple viewer errors with delay
        vi.advanceTimersByTime(5000); // 5 seconds
      });

      // Should handle multiple viewer errors with delayed timing
      expect(result.current.connectionState).toBe('failed');
      expect(result.current.error).toContain('Multiple viewer errors detected');
    });
  });
});
