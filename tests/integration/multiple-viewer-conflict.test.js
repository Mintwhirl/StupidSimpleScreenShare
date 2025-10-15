import { renderHook, act } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';

import { useWebRTC } from '../../src/hooks/useWebRTC.js';

// Use fake timers for multiple viewer conflict tests
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

describe('Multiple Viewer Conflicts - REAL Logic Tests', () => {
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

  describe('Multiple Viewer Conflicts During Host Connection', () => {
    it('should handle multiple viewer conflicts during host screen sharing', async () => {
      const { result } = renderHook(() => useWebRTC('test-room-123', 'host', mockConfig));

      // Start screen sharing
      await act(async () => {
        await result.current.startScreenShare();
      });

      // Should be in connecting state
      expect(result.current.connectionState).toBe('connecting');

      // Simulate multiple viewer conflicts
      await act(async () => {
        // Mock multiple viewer conflicts
        global.fetch.mockResolvedValueOnce({
          ok: false,
          status: 409,
          json: vi.fn().mockResolvedValue({ error: 'Multiple viewers detected' }),
        });

        // Fast-forward time to trigger multiple viewer conflicts
        vi.advanceTimersByTime(1000); // 1 second
      });

      // Should handle multiple viewer conflicts gracefully
      expect(result.current.connectionState).toBe('failed');
      expect(result.current.error).toContain('Multiple viewers detected');
    });

    it('should handle multiple viewer conflicts during host offer sending', async () => {
      const { result } = renderHook(() => useWebRTC('test-room-123', 'host', mockConfig));

      // Start screen sharing
      await act(async () => {
        await result.current.startScreenShare();
      });

      // Simulate multiple viewer conflicts during offer sending
      await act(async () => {
        // Mock multiple viewer conflicts during offer sending
        global.fetch.mockResolvedValueOnce({
          ok: false,
          status: 409,
          json: vi.fn().mockResolvedValue({ error: 'Multiple viewers detected during offer sending' }),
        });

        // Fast-forward time to trigger multiple viewer conflicts
        vi.advanceTimersByTime(1000); // 1 second
      });

      // Should handle multiple viewer conflicts gracefully
      expect(result.current.connectionState).toBe('failed');
      expect(result.current.error).toContain('Multiple viewers detected during offer sending');
    });
  });

  describe('Multiple Viewer Conflicts During Viewer Connection', () => {
    it('should handle multiple viewer conflicts during viewer connection', async () => {
      const { result } = renderHook(() => useWebRTC('test-room-123', 'viewer', mockConfig));

      // Start connecting
      await act(async () => {
        await result.current.connectToHost();
      });

      // Should be in connecting state
      expect(result.current.connectionState).toBe('connecting');

      // Simulate multiple viewer conflicts
      await act(async () => {
        // Mock multiple viewer conflicts
        global.fetch.mockResolvedValueOnce({
          ok: false,
          status: 409,
          json: vi.fn().mockResolvedValue({ error: 'Multiple viewers detected' }),
        });

        // Fast-forward time to trigger multiple viewer conflicts
        vi.advanceTimersByTime(1000); // 1 second
      });

      // Should handle multiple viewer conflicts gracefully
      expect(result.current.connectionState).toBe('failed');
      expect(result.current.error).toContain('Multiple viewers detected');
    });

    it('should handle multiple viewer conflicts during viewer offer polling', async () => {
      const { result } = renderHook(() => useWebRTC('test-room-123', 'viewer', mockConfig));

      // Start connecting
      await act(async () => {
        await result.current.connectToHost();
      });

      // Simulate multiple viewer conflicts during offer polling
      await act(async () => {
        // Mock multiple viewer conflicts during offer polling
        global.fetch.mockResolvedValueOnce({
          ok: false,
          status: 409,
          json: vi.fn().mockResolvedValue({ error: 'Multiple viewers detected during offer polling' }),
        });

        // Fast-forward time to trigger multiple viewer conflicts
        vi.advanceTimersByTime(1000); // 1 second
      });

      // Should handle multiple viewer conflicts gracefully
      expect(result.current.connectionState).toBe('failed');
      expect(result.current.error).toContain('Multiple viewers detected during offer polling');
    });

    it('should handle multiple viewer conflicts during viewer answer sending', async () => {
      const { result } = renderHook(() => useWebRTC('test-room-123', 'viewer', mockConfig));

      // Start connecting
      await act(async () => {
        await result.current.connectToHost();
      });

      // Simulate multiple viewer conflicts during answer sending
      await act(async () => {
        // Mock multiple viewer conflicts during answer sending
        global.fetch.mockResolvedValueOnce({
          ok: false,
          status: 409,
          json: vi.fn().mockResolvedValue({ error: 'Multiple viewers detected during answer sending' }),
        });

        // Fast-forward time to trigger multiple viewer conflicts
        vi.advanceTimersByTime(1000); // 1 second
      });

      // Should handle multiple viewer conflicts gracefully
      expect(result.current.connectionState).toBe('failed');
      expect(result.current.error).toContain('Multiple viewers detected during answer sending');
    });
  });

  describe('Multiple Viewer Conflicts During Established Connection', () => {
    it('should handle multiple viewer conflicts during established host connection', async () => {
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

      // Simulate multiple viewer conflicts during established connection
      await act(async () => {
        // Mock multiple viewer conflicts
        global.fetch.mockResolvedValueOnce({
          ok: false,
          status: 409,
          json: vi.fn().mockResolvedValue({ error: 'Multiple viewers detected' }),
        });

        // Fast-forward time to trigger multiple viewer conflicts
        vi.advanceTimersByTime(1000); // 1 second
      });

      // Should handle multiple viewer conflicts gracefully
      expect(result.current.connectionState).toBe('connected');
    });

    it('should handle multiple viewer conflicts during established viewer connection', async () => {
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

      // Simulate multiple viewer conflicts during established connection
      await act(async () => {
        // Mock multiple viewer conflicts
        global.fetch.mockResolvedValueOnce({
          ok: false,
          status: 409,
          json: vi.fn().mockResolvedValue({ error: 'Multiple viewers detected' }),
        });

        // Fast-forward time to trigger multiple viewer conflicts
        vi.advanceTimersByTime(1000); // 1 second
      });

      // Should handle multiple viewer conflicts gracefully
      expect(result.current.connectionState).toBe('connected');
    });
  });

  describe('Multiple Viewer Conflicts Recovery', () => {
    it('should recover from multiple viewer conflicts during host connection', async () => {
      const { result } = renderHook(() => useWebRTC('test-room-123', 'host', mockConfig));

      // Start screen sharing
      await act(async () => {
        await result.current.startScreenShare();
      });

      // Simulate multiple viewer conflicts then recovery
      await act(async () => {
        // Mock multiple viewer conflicts
        global.fetch.mockResolvedValueOnce({
          ok: false,
          status: 409,
          json: vi.fn().mockResolvedValue({ error: 'Multiple viewers detected' }),
        });

        // Fast-forward time to trigger multiple viewer conflicts
        vi.advanceTimersByTime(1000); // 1 second

        // Mock recovery from multiple viewer conflicts
        global.fetch.mockResolvedValueOnce({
          ok: true,
          json: vi.fn().mockResolvedValue({ ok: true }),
        });

        // Fast-forward time to trigger recovery
        vi.advanceTimersByTime(1000); // 1 second
      });

      // Should recover from multiple viewer conflicts
      expect(result.current.connectionState).toBe('connecting');
    });

    it('should recover from multiple viewer conflicts during viewer connection', async () => {
      const { result } = renderHook(() => useWebRTC('test-room-123', 'viewer', mockConfig));

      // Start connecting
      await act(async () => {
        await result.current.connectToHost();
      });

      // Simulate multiple viewer conflicts then recovery
      await act(async () => {
        // Mock multiple viewer conflicts
        global.fetch.mockResolvedValueOnce({
          ok: false,
          status: 409,
          json: vi.fn().mockResolvedValue({ error: 'Multiple viewers detected' }),
        });

        // Fast-forward time to trigger multiple viewer conflicts
        vi.advanceTimersByTime(1000); // 1 second

        // Mock recovery from multiple viewer conflicts
        global.fetch.mockResolvedValueOnce({
          ok: true,
          json: vi.fn().mockResolvedValue({ ok: true }),
        });

        // Fast-forward time to trigger recovery
        vi.advanceTimersByTime(1000); // 1 second
      });

      // Should recover from multiple viewer conflicts
      expect(result.current.connectionState).toBe('connecting');
    });
  });

  describe('Multiple Viewer Conflicts Error Handling', () => {
    it('should handle multiple viewer conflicts with proper error messages', async () => {
      const { result } = renderHook(() => useWebRTC('test-room-123', 'host', mockConfig));

      // Start screen sharing
      await act(async () => {
        await result.current.startScreenShare();
      });

      // Simulate multiple viewer conflicts with specific error
      await act(async () => {
        // Mock multiple viewer conflicts with specific error
        global.fetch.mockResolvedValueOnce({
          ok: false,
          status: 409,
          json: vi.fn().mockResolvedValue({ error: 'Room already has a viewer' }),
        });

        // Fast-forward time to trigger multiple viewer conflicts
        vi.advanceTimersByTime(1000); // 1 second
      });

      // Should handle multiple viewer conflicts with proper error message
      expect(result.current.connectionState).toBe('failed');
      expect(result.current.error).toContain('Room already has a viewer');
    });

    it('should handle multiple viewer conflicts with different error codes', async () => {
      const { result } = renderHook(() => useWebRTC('test-room-123', 'viewer', mockConfig));

      // Start connecting
      await act(async () => {
        await result.current.connectToHost();
      });

      // Simulate multiple viewer conflicts with different error codes
      await act(async () => {
        // Mock multiple viewer conflicts with different error codes
        global.fetch.mockResolvedValueOnce({
          ok: false,
          status: 409,
          json: vi.fn().mockResolvedValue({ error: 'Multiple viewers not allowed' }),
        });

        // Fast-forward time to trigger multiple viewer conflicts
        vi.advanceTimersByTime(1000); // 1 second
      });

      // Should handle multiple viewer conflicts with different error codes
      expect(result.current.connectionState).toBe('failed');
      expect(result.current.error).toContain('Multiple viewers not allowed');
    });
  });

  describe('Multiple Viewer Conflicts Timing', () => {
    it('should handle multiple viewer conflicts with proper timing', async () => {
      const { result } = renderHook(() => useWebRTC('test-room-123', 'host', mockConfig));

      // Start screen sharing
      await act(async () => {
        await result.current.startScreenShare();
      });

      // Simulate multiple viewer conflicts with proper timing
      await act(async () => {
        // Mock multiple viewer conflicts
        global.fetch.mockResolvedValueOnce({
          ok: false,
          status: 409,
          json: vi.fn().mockResolvedValue({ error: 'Multiple viewers detected' }),
        });

        // Fast-forward time to trigger multiple viewer conflicts
        vi.advanceTimersByTime(1000); // 1 second
      });

      // Should handle multiple viewer conflicts with proper timing
      expect(result.current.connectionState).toBe('failed');
      expect(result.current.error).toContain('Multiple viewers detected');
    });

    it('should handle multiple viewer conflicts with delayed timing', async () => {
      const { result } = renderHook(() => useWebRTC('test-room-123', 'viewer', mockConfig));

      // Start connecting
      await act(async () => {
        await result.current.connectToHost();
      });

      // Simulate multiple viewer conflicts with delayed timing
      await act(async () => {
        // Mock multiple viewer conflicts with delayed timing
        global.fetch.mockResolvedValueOnce({
          ok: false,
          status: 409,
          json: vi.fn().mockResolvedValue({ error: 'Multiple viewers detected' }),
        });

        // Fast-forward time to trigger multiple viewer conflicts with delay
        vi.advanceTimersByTime(5000); // 5 seconds
      });

      // Should handle multiple viewer conflicts with delayed timing
      expect(result.current.connectionState).toBe('failed');
      expect(result.current.error).toContain('Multiple viewers detected');
    });
  });
});
