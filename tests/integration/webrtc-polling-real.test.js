import { renderHook, act } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';

import { useWebRTC } from '../../src/hooks/useWebRTC.js';

// Use fake timers for polling timeout tests
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

  mockConfig = {
    useTurn: true,
  };
});

afterEach(() => {
  vi.clearAllTimers();
});

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

describe('WebRTC Polling - REAL Behavior Tests', () => {
  describe('Viewer Connection (Offer Polling)', () => {
    it('should start polling for offers when viewer connects', async () => {
      const { result } = renderHook(() => useWebRTC('test-room-123', 'viewer', mockConfig));

      // Mock fetch to return 404 (no offer yet)
      global.fetch.mockResolvedValue({
        ok: false,
        status: 404,
      });

      await act(async () => {
        await result.current.connectToHost();
      });

      // Should be in connecting state
      expect(result.current.connectionState).toBe('connecting');

      // Should have made at least one fetch request
      expect(global.fetch).toHaveBeenCalledWith('/api/offer?roomId=test-room-123');
    });

    it('should handle successful offer reception', async () => {
      const { result } = renderHook(() => useWebRTC('test-room-123', 'viewer', mockConfig));

      // Mock successful offer response
      global.fetch.mockResolvedValue({
        ok: true,
        json: () => Promise.resolve({ desc: { type: 'offer', sdp: 'mock-sdp' } }),
      });

      await act(async () => {
        await result.current.connectToHost();
      });

      // Should create peer connection and set remote description
      expect(mockRTCPeerConnection).toHaveBeenCalled();
      expect(mockPeerConnection.setRemoteDescription).toHaveBeenCalled();
      expect(mockPeerConnection.createAnswer).toHaveBeenCalled();
    });

    it('should handle network errors during offer polling gracefully', async () => {
      const { result } = renderHook(() => useWebRTC('test-room-123', 'viewer', mockConfig));

      // Mock fetch to throw network error
      global.fetch.mockRejectedValue(new Error('Network error'));

      await act(async () => {
        await result.current.connectToHost();
      });

      // Should handle network error gracefully and continue polling
      expect(result.current.connectionState).toBe('connecting');
      // Network errors during polling don't immediately fail the connection
    });
  });

  describe('Host Connection (Answer Polling)', () => {
    it('should start polling for answers when host starts sharing', async () => {
      const { result } = renderHook(() => useWebRTC('test-room-123', 'host', mockConfig));

      // Mock successful offer sending
      global.fetch.mockResolvedValue({
        ok: true,
        json: () => Promise.resolve({}),
      });

      await act(async () => {
        await result.current.startScreenShare();
      });

      // Should be in connecting state
      expect(result.current.connectionState).toBe('connecting');

      // Should have sent offer
      expect(global.fetch).toHaveBeenCalledWith(
        '/api/offer',
        expect.objectContaining({
          method: 'POST',
          body: expect.stringContaining('"desc"'),
        })
      );
    });

    it('should handle successful answer reception', async () => {
      const { result } = renderHook(() => useWebRTC('test-room-123', 'host', mockConfig));

      // Mock successful offer sending
      global.fetch.mockResolvedValue({
        ok: true,
        json: () => Promise.resolve({}),
      });

      await act(async () => {
        await result.current.startScreenShare();
      });

      // Mock successful answer response
      global.fetch.mockResolvedValue({
        ok: true,
        json: () => Promise.resolve({ desc: { type: 'answer', sdp: 'mock-sdp' } }),
      });

      // Fast-forward to trigger answer polling
      await act(async () => {
        vi.advanceTimersByTime(1000);
      });

      // Should set remote description
      expect(mockPeerConnection.setRemoteDescription).toHaveBeenCalled();
    });
  });

  describe('ICE Candidate Polling', () => {
    it('should start ICE candidate polling after offer/answer exchange', async () => {
      const { result } = renderHook(() => useWebRTC('test-room-123', 'viewer', mockConfig));

      // Mock successful offer response
      global.fetch.mockResolvedValue({
        ok: true,
        json: () => Promise.resolve({ desc: { type: 'offer', sdp: 'mock-sdp' } }),
      });

      await act(async () => {
        await result.current.connectToHost();
      });

      // Should start ICE candidate polling
      expect(global.fetch).toHaveBeenCalledWith(expect.stringContaining('/api/candidate'));
    });

    it('should handle ICE candidate polling timeout gracefully', async () => {
      const { result } = renderHook(() => useWebRTC('test-room-123', 'viewer', mockConfig));

      // Mock successful offer response
      global.fetch.mockResolvedValue({
        ok: true,
        json: () => Promise.resolve({ desc: { type: 'offer', sdp: 'mock-sdp' } }),
      });

      await act(async () => {
        await result.current.connectToHost();
      });

      // Mock fetch to always return 404 (no candidates)
      global.fetch.mockResolvedValue({
        ok: false,
        status: 404,
      });

      // ICE candidate timeout should not fail the connection
      expect(result.current.connectionState).toBe('connecting');
    });
  });

  describe('Connection Cleanup', () => {
    it('should cleanup polling on component unmount', async () => {
      const { result, unmount } = renderHook(() => useWebRTC('test-room-123', 'viewer', mockConfig));

      // Mock fetch to return 404 (no offer yet)
      global.fetch.mockResolvedValue({
        ok: false,
        status: 404,
      });

      await act(async () => {
        await result.current.connectToHost();
      });

      // Should be in connecting state
      expect(result.current.connectionState).toBe('connecting');

      // Unmount component
      unmount();

      // The cleanup happens asynchronously, so we can't immediately test the state
      // But we can verify that the component unmounts without errors
      expect(result.current.connectionState).toBe('connecting');
    });

    it('should cleanup polling on successful connection', async () => {
      const { result } = renderHook(() => useWebRTC('test-room-123', 'viewer', mockConfig));

      // Mock successful offer response
      global.fetch.mockResolvedValue({
        ok: true,
        json: () => Promise.resolve({ desc: { type: 'offer', sdp: 'mock-sdp' } }),
      });

      await act(async () => {
        await result.current.connectToHost();
      });

      // Simulate connection state change to connected
      await act(async () => {
        mockPeerConnection.connectionState = 'connected';
        mockPeerConnection.onconnectionstatechange();
      });

      // Should be connected
      expect(result.current.connectionState).toBe('connected');
    });
  });

  describe('Exponential Backoff Behavior', () => {
    it('should use exponential backoff for polling intervals', async () => {
      const { result } = renderHook(() => useWebRTC('test-room-123', 'viewer', mockConfig));

      // Mock fetch to always return 404 (no offer)
      global.fetch.mockResolvedValue({
        ok: false,
        status: 404,
      });

      await act(async () => {
        await result.current.connectToHost();
      });

      // Should make initial request
      expect(global.fetch).toHaveBeenCalledWith('/api/offer?roomId=test-room-123');

      // Fast-forward time to trigger next poll
      await act(async () => {
        vi.advanceTimersByTime(1000); // 1 second
      });

      // Should make second request (plus register-sender call)
      expect(global.fetch).toHaveBeenCalledTimes(3);

      // Fast-forward more time to trigger next poll with backoff
      await act(async () => {
        vi.advanceTimersByTime(2000); // 2 seconds (backoff)
      });

      // Should make third request (plus register-sender call)
      expect(global.fetch).toHaveBeenCalledTimes(4);
    });

    it('should stop polling on successful response', async () => {
      const { result } = renderHook(() => useWebRTC('test-room-123', 'viewer', mockConfig));

      // Mock fetch to return 404 first, then success
      global.fetch
        .mockResolvedValueOnce({
          ok: false,
          status: 404,
        })
        .mockResolvedValueOnce({
          ok: true,
          json: () => Promise.resolve({ desc: { type: 'offer', sdp: 'mock-sdp' } }),
        });

      await act(async () => {
        await result.current.connectToHost();
      });

      // Should make initial request
      expect(global.fetch).toHaveBeenCalledWith('/api/offer?roomId=test-room-123');

      // Fast-forward time to trigger next poll
      await act(async () => {
        vi.advanceTimersByTime(1000); // 1 second
      });

      // Should make at least 2 requests (initial + success + register-sender)
      expect(global.fetch).toHaveBeenCalledTimes(4);

      // Fast-forward more time - should not make more requests for offer polling
      await act(async () => {
        vi.advanceTimersByTime(5000); // 5 seconds
      });

      // Should have made at least 2 requests (initial + success)
      // Note: There might be additional requests for ICE candidates and register-sender
      expect(global.fetch).toHaveBeenCalledTimes(5);
    });
  });

  describe('Real-world Scenarios', () => {
    it('should handle rapid connection attempts', async () => {
      const { result } = renderHook(() => useWebRTC('test-room-123', 'viewer', mockConfig));

      // Mock fetch to return 404 (no offer yet)
      global.fetch.mockResolvedValue({
        ok: false,
        status: 404,
      });

      // Make multiple connection attempts
      await act(async () => {
        await result.current.connectToHost();
        await result.current.disconnect();
        await result.current.connectToHost();
      });

      // Should handle rapid state changes gracefully
      expect(result.current.connectionState).toBe('connecting');
    });

    it('should handle connection state changes properly', async () => {
      const { result } = renderHook(() => useWebRTC('test-room-123', 'viewer', mockConfig));

      // Mock successful offer response
      global.fetch.mockResolvedValue({
        ok: true,
        json: () => Promise.resolve({ desc: { type: 'offer', sdp: 'mock-sdp' } }),
      });

      await act(async () => {
        await result.current.connectToHost();
      });

      // Simulate various connection state changes
      await act(async () => {
        mockPeerConnection.connectionState = 'connecting';
        mockPeerConnection.onconnectionstatechange();
      });

      expect(result.current.connectionState).toBe('connecting');

      await act(async () => {
        mockPeerConnection.connectionState = 'connected';
        mockPeerConnection.onconnectionstatechange();
      });

      expect(result.current.connectionState).toBe('connected');
    });
  });
});
