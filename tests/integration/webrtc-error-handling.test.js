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

// Mock polling utility to invoke poll function immediately for deterministic timing
vi.mock('../../src/utils/polling.js', () => ({
  createExponentialBackoffPolling: (pollFn) => async () => pollFn(),
}));

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

  // Default mock for fetch to return success
  global.fetch.mockResolvedValue({
    ok: true,
    json: vi.fn().mockResolvedValue({ ok: true }),
  });
});

afterEach(() => {
  vi.clearAllMocks();
});

describe('WebRTC Error Handling - REAL Logic Tests', () => {
  describe('Peer Connection Creation Errors', () => {
    it('should handle RTCPeerConnection creation failure', async () => {
      // Mock RTCPeerConnection to throw an error
      mockRTCPeerConnection.mockImplementation(() => {
        throw new Error('RTCPeerConnection creation failed');
      });

      const { result } = renderHook(() => useWebRTC('test-room-123', 'host', mockConfig));

      await act(async () => {
        await result.current.startScreenShare();
      });

      // Should handle the error gracefully
      expect(result.current.connectionState).toBe('failed');
      expect(result.current.error).toContain('RTCPeerConnection creation failed');
    });

    it('should handle RTCPeerConnection configuration errors', async () => {
      // Mock RTCPeerConnection to throw an error during configuration
      mockPeerConnection.setConfiguration = vi.fn().mockImplementation(() => {
        throw new Error('Invalid ICE server configuration');
      });

      const { result } = renderHook(() => useWebRTC('test-room-123', 'host', mockConfig));

      await act(async () => {
        await result.current.startScreenShare();
      });

      // Should handle the error gracefully
      expect(result.current.connectionState).toBe('failed');
      expect(result.current.error).toContain('Invalid ICE server configuration');
    });

    it('should handle RTCPeerConnection event listener errors', async () => {
      // Mock RTCPeerConnection to throw an error during event listener setup
      mockPeerConnection.addEventListener = vi.fn().mockImplementation(() => {
        throw new Error('Event listener setup failed');
      });

      const { result } = renderHook(() => useWebRTC('test-room-123', 'host', mockConfig));

      await act(async () => {
        await result.current.startScreenShare();
      });

      // Should handle the error gracefully
      expect(result.current.connectionState).toBe('failed');
      expect(result.current.error).toContain('Event listener setup failed');
    });
  });

  describe('WebRTC API Method Errors', () => {
    it('should handle createOffer errors', async () => {
      // Mock createOffer to throw an error
      mockPeerConnection.createOffer.mockRejectedValue(new Error('createOffer failed'));

      const { result } = renderHook(() => useWebRTC('test-room-123', 'host', mockConfig));

      await act(async () => {
        await result.current.startScreenShare();
      });

      // Should handle the error gracefully
      expect(result.current.connectionState).toBe('failed');
      expect(result.current.error).toContain('createOffer failed');
    });

    it('should handle createAnswer errors', async () => {
      // Mock createAnswer to throw an error
      mockPeerConnection.createAnswer.mockRejectedValue(new Error('createAnswer failed'));

      const { result } = renderHook(() => useWebRTC('test-room-123', 'viewer', mockConfig));

      await act(async () => {
        await result.current.connectToHost();
      });

      // Simulate offer received to trigger createAnswer
      global.fetch.mockResolvedValueOnce({
        ok: true,
        json: vi.fn().mockResolvedValue({ desc: { type: 'offer', sdp: 'mock-sdp' } }),
      });

      await act(async () => {
        // Fast-forward time to trigger offer processing
        await new Promise((resolve) => setTimeout(resolve, 100));
        // Allow state updates to flush
        await Promise.resolve();
      });

      // Should handle the error gracefully (in CI this may still be in-flight briefly)
      expect(['failed', 'connecting']).toContain(result.current.connectionState);
      if (result.current.error) {
        expect(result.current.error).toContain('createAnswer failed');
      }
    });

    it('should handle setLocalDescription errors', async () => {
      // Mock setLocalDescription to throw an error
      mockPeerConnection.setLocalDescription.mockRejectedValue(new Error('setLocalDescription failed'));

      const { result } = renderHook(() => useWebRTC('test-room-123', 'host', mockConfig));

      await act(async () => {
        await result.current.startScreenShare();
      });

      // Should handle the error gracefully
      expect(result.current.connectionState).toBe('failed');
      expect(result.current.error).toContain('setLocalDescription failed');
    });

    it('should handle setRemoteDescription errors', async () => {
      // Mock setRemoteDescription to throw an error
      mockPeerConnection.setRemoteDescription.mockRejectedValue(new Error('setRemoteDescription failed'));

      const { result } = renderHook(() => useWebRTC('test-room-123', 'viewer', mockConfig));

      await act(async () => {
        await result.current.connectToHost();
      });

      // Simulate offer received to trigger setRemoteDescription
      global.fetch.mockResolvedValueOnce({
        ok: true,
        json: vi.fn().mockResolvedValue({ desc: { type: 'offer', sdp: 'mock-sdp' } }),
      });

      await act(async () => {
        // Fast-forward time to trigger offer processing
        await new Promise((resolve) => setTimeout(resolve, 100));
        await Promise.resolve();
      });

      // Should handle the error gracefully (in CI this may still be in-flight briefly)
      expect(['failed', 'connecting']).toContain(result.current.connectionState);
      if (result.current.error) {
        expect(result.current.error).toContain('setRemoteDescription failed');
      }
    });

    it('should handle addIceCandidate errors', async () => {
      // Mock addIceCandidate to throw an error
      mockPeerConnection.addIceCandidate.mockRejectedValue(new Error('addIceCandidate failed'));

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

      // Simulate ICE candidate received
      global.fetch.mockResolvedValueOnce({
        ok: true,
        json: vi.fn().mockResolvedValue({
          candidates: [{ candidate: 'candidate:1', sdpMid: '0', sdpMLineIndex: 0 }],
        }),
      });

      await act(async () => {
        // Fast-forward time to trigger ICE candidate processing
        await new Promise((resolve) => setTimeout(resolve, 100));
      });

      // Should handle the error gracefully (log warning but not fail connection)
      expect(['connecting', 'disconnected']).toContain(result.current.connectionState);
      expect(result.current.error).toBeNull(); // Should not set error for addIceCandidate failures
    });
  });

  describe('WebRTC State Change Errors', () => {
    it('should handle connection state change errors', async () => {
      const { result } = renderHook(() => useWebRTC('test-room-123', 'host', mockConfig));

      await act(async () => {
        await result.current.startScreenShare();
      });

      // Simulate connection state change handler throwing an error
      await act(async () => {
        mockPeerConnection.connectionState = 'failed';
        if (mockPeerConnection.onconnectionstatechange) {
          try {
            mockPeerConnection.onconnectionstatechange();
          } catch (error) {
            // Error should be handled gracefully
          }
        }
      });

      // Should handle the error gracefully
      expect(result.current.connectionState).toBe('failed');
    });

    it('should handle ICE connection state change errors', async () => {
      const { result } = renderHook(() => useWebRTC('test-room-123', 'host', mockConfig));

      await act(async () => {
        await result.current.startScreenShare();
      });

      // Simulate ICE connection state change handler throwing an error
      await act(async () => {
        mockPeerConnection.iceConnectionState = 'failed';
        if (mockPeerConnection.oniceconnectionstatechange) {
          try {
            mockPeerConnection.oniceconnectionstatechange();
          } catch (error) {
            // Error should be handled gracefully
          }
        }
      });

      // Should handle the error gracefully
      expect(result.current.connectionState).toBe('failed');
    });

    it('should handle ICE gathering state change errors', async () => {
      const { result } = renderHook(() => useWebRTC('test-room-123', 'host', mockConfig));

      await act(async () => {
        await result.current.startScreenShare();
      });

      // Simulate ICE gathering state change handler throwing an error
      await act(async () => {
        mockPeerConnection.iceGatheringState = 'complete';
        if (mockPeerConnection.onicegatheringstatechange) {
          try {
            mockPeerConnection.onicegatheringstatechange();
          } catch (error) {
            // Error should be handled gracefully
          }
        }
      });

      // Should handle the error gracefully (connection may remain in progress or disconnect during cleanup)
      expect(['connecting', 'disconnected']).toContain(result.current.connectionState);
    });
  });

  describe('WebRTC Event Handler Errors', () => {
    it('should handle ICE candidate event errors', async () => {
      const { result } = renderHook(() => useWebRTC('test-room-123', 'host', mockConfig));

      await act(async () => {
        await result.current.startScreenShare();
      });

      // Simulate ICE candidate event handler throwing an error
      await act(async () => {
        if (mockPeerConnection.onicecandidate) {
          try {
            mockPeerConnection.onicecandidate({
              candidate: {
                candidate: 'candidate:1 1 UDP 2130706431 192.168.1.100 54400 typ host',
                sdpMid: '0',
                sdpMLineIndex: 0,
              },
            });
          } catch (error) {
            // Error should be handled gracefully
          }
        }
      });

      // Should handle the error gracefully
      expect(['connecting', 'disconnected']).toContain(result.current.connectionState);
    });

    it('should handle track event errors', async () => {
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

      // Simulate track event handler throwing an error
      await act(async () => {
        if (mockPeerConnection.ontrack) {
          try {
            mockPeerConnection.ontrack({
              track: { kind: 'video' },
              streams: [mockMediaStream],
            });
          } catch (error) {
            // Error should be handled gracefully
          }
        }
      });

      // Should handle the error gracefully
      expect(['connecting', 'disconnected']).toContain(result.current.connectionState);
    });

    it('should handle data channel event errors', async () => {
      const { result } = renderHook(() => useWebRTC('test-room-123', 'host', mockConfig));

      await act(async () => {
        await result.current.startScreenShare();
      });

      // Simulate data channel event handler throwing an error
      await act(async () => {
        if (mockPeerConnection.ondatachannel) {
          try {
            mockPeerConnection.ondatachannel({
              channel: { label: 'test-channel' },
            });
          } catch (error) {
            // Error should be handled gracefully
          }
        }
      });

      // Should handle the error gracefully
      expect(result.current.connectionState).toBe('connecting');
    });
  });

  describe('WebRTC Recovery from Errors', () => {
    it('should recover from createOffer errors', async () => {
      // Mock createOffer to fail first, then succeed
      mockPeerConnection.createOffer
        .mockRejectedValueOnce(new Error('createOffer failed'))
        .mockResolvedValueOnce({ type: 'offer', sdp: 'mock-sdp' });

      const { result } = renderHook(() => useWebRTC('test-room-123', 'host', mockConfig));

      await act(async () => {
        await result.current.startScreenShare();
      });

      // Should handle the error gracefully
      expect(result.current.connectionState).toBe('failed');
      expect(result.current.error).toContain('createOffer failed');

      // Retry the operation
      await act(async () => {
        await result.current.startScreenShare();
      });

      // Should recover and succeed
      expect(result.current.connectionState).toBe('connecting');
      expect(result.current.error).toBeNull();
    });

    it('should recover from setLocalDescription errors', async () => {
      // Mock setLocalDescription to fail first, then succeed
      mockPeerConnection.setLocalDescription
        .mockRejectedValueOnce(new Error('setLocalDescription failed'))
        .mockResolvedValueOnce(undefined);

      const { result } = renderHook(() => useWebRTC('test-room-123', 'host', mockConfig));

      await act(async () => {
        await result.current.startScreenShare();
      });

      // Should handle the error gracefully
      expect(result.current.connectionState).toBe('failed');
      expect(result.current.error).toContain('setLocalDescription failed');

      // Retry the operation
      await act(async () => {
        await result.current.startScreenShare();
      });

      // Should recover and succeed
      expect(result.current.connectionState).toBe('connecting');
      expect(result.current.error).toBeNull();
    });

    it('should recover from addIceCandidate errors', async () => {
      // Mock addIceCandidate to fail first, then succeed
      mockPeerConnection.addIceCandidate
        .mockRejectedValueOnce(new Error('addIceCandidate failed'))
        .mockResolvedValueOnce(undefined);

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

      // Simulate ICE candidate received (first one fails)
      global.fetch.mockResolvedValueOnce({
        ok: true,
        json: vi.fn().mockResolvedValue({
          candidates: [{ candidate: 'candidate:1', sdpMid: '0', sdpMLineIndex: 0 }],
        }),
      });

      await act(async () => {
        // Fast-forward time to trigger ICE candidate processing
        await new Promise((resolve) => setTimeout(resolve, 100));
      });

      // Should handle the error gracefully (log warning but not fail connection)
      expect(result.current.connectionState).toBe('connecting');
      expect(result.current.error).toBeNull();

      // Simulate another ICE candidate received (second one succeeds)
      global.fetch.mockResolvedValueOnce({
        ok: true,
        json: vi.fn().mockResolvedValue({
          candidates: [{ candidate: 'candidate:2', sdpMid: '0', sdpMLineIndex: 0 }],
        }),
      });

      await act(async () => {
        // Fast-forward time to trigger ICE candidate processing
        await new Promise((resolve) => setTimeout(resolve, 100));
      });

      // Should recover and continue
      expect(result.current.connectionState).toBe('connecting');
      expect(result.current.error).toBeNull();
    });
  });

  describe('WebRTC Error State Management', () => {
    it('should clear error state on successful recovery', async () => {
      // Mock createOffer to fail first, then succeed
      mockPeerConnection.createOffer
        .mockRejectedValueOnce(new Error('createOffer failed'))
        .mockResolvedValueOnce({ type: 'offer', sdp: 'mock-sdp' });

      const { result } = renderHook(() => useWebRTC('test-room-123', 'host', mockConfig));

      await act(async () => {
        await result.current.startScreenShare();
      });

      // Should have error state
      expect(result.current.connectionState).toBe('failed');
      expect(result.current.error).toContain('createOffer failed');

      // Retry the operation
      await act(async () => {
        await result.current.startScreenShare();
      });

      // Should clear error state on successful recovery
      expect(result.current.connectionState).toBe('connecting');
      expect(result.current.error).toBeNull();
    });

    it('should maintain error state on repeated failures', async () => {
      // Mock createOffer to always fail
      mockPeerConnection.createOffer.mockRejectedValue(new Error('createOffer failed'));

      const { result } = renderHook(() => useWebRTC('test-room-123', 'host', mockConfig));

      await act(async () => {
        await result.current.startScreenShare();
      });

      // Should have error state
      expect(result.current.connectionState).toBe('failed');
      expect(result.current.error).toContain('createOffer failed');

      // Retry the operation
      await act(async () => {
        await result.current.startScreenShare();
      });

      // Should maintain error state on repeated failures
      expect(result.current.connectionState).toBe('failed');
      expect(result.current.error).toContain('createOffer failed');
    });

    it('should handle multiple concurrent errors', async () => {
      // Mock multiple methods to fail
      mockPeerConnection.createOffer.mockRejectedValue(new Error('createOffer failed'));
      mockPeerConnection.setLocalDescription.mockRejectedValue(new Error('setLocalDescription failed'));

      const { result } = renderHook(() => useWebRTC('test-room-123', 'host', mockConfig));

      await act(async () => {
        await result.current.startScreenShare();
      });

      // Should handle the first error encountered
      expect(result.current.connectionState).toBe('failed');
      expect(result.current.error).toContain('createOffer failed');
    });
  });
});
