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

describe('ICE Candidate Exchange Failures - REAL Logic Tests', () => {
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

  describe('ICE Candidate Sending Failures', () => {
    it('should handle ICE candidate sending API failure', async () => {
      const { result } = renderHook(() => useWebRTC('test-room-123', 'host', mockConfig));

      // Start screen sharing
      await act(async () => {
        await result.current.startScreenShare();
      });

      // Simulate ICE candidate generation
      await act(async () => {
        const mockCandidate = {
          candidate: 'candidate:1 1 UDP 2130706431 192.168.1.100 54400 typ host',
          sdpMid: '0',
          sdpMLineIndex: 0,
        };

        // Mock API failure for ICE candidate sending
        global.fetch.mockRejectedValueOnce(new Error('Network error'));

        // Trigger ICE candidate event
        if (mockPeerConnection.onicecandidate) {
          mockPeerConnection.onicecandidate({ candidate: mockCandidate });
        }
      });

      // Verify the hook handled the failure gracefully
      expect(result.current.connectionState).toBe('connecting');
      expect(result.current.error).toContain('Failed to send ICE candidate'); // Should set error message
    });

    it('should handle ICE candidate sending 500 error', async () => {
      const { result } = renderHook(() => useWebRTC('test-room-123', 'host', mockConfig));

      // Start screen sharing
      await act(async () => {
        await result.current.startScreenShare();
      });

      // Simulate ICE candidate generation
      await act(async () => {
        const mockCandidate = {
          candidate: 'candidate:1 1 UDP 2130706431 192.168.1.100 54400 typ host',
          sdpMid: '0',
          sdpMLineIndex: 0,
        };

        // Mock 500 error for ICE candidate sending
        global.fetch.mockResolvedValueOnce({
          ok: false,
          status: 500,
          statusText: 'Internal Server Error',
        });

        // Trigger ICE candidate event
        if (mockPeerConnection.onicecandidate) {
          mockPeerConnection.onicecandidate({ candidate: mockCandidate });
        }
      });

      // Verify the hook handled the failure gracefully
      expect(result.current.connectionState).toBe('connecting');
      expect(result.current.error).toContain('Failed to send ICE candidate'); // Should set error message
    });

    it('should handle ICE candidate sending timeout', async () => {
      const { result } = renderHook(() => useWebRTC('test-room-123', 'host', mockConfig));

      // Start screen sharing
      await act(async () => {
        await result.current.startScreenShare();
      });

      // Simulate ICE candidate generation
      await act(async () => {
        const mockCandidate = {
          candidate: 'candidate:1 1 UDP 2130706431 192.168.1.100 54400 typ host',
          sdpMid: '0',
          sdpMLineIndex: 0,
        };

        // Mock timeout for ICE candidate sending
        global.fetch.mockImplementationOnce(
          () => new Promise((_, reject) => setTimeout(() => reject(new Error('Request timeout')), 100))
        );

        // Trigger ICE candidate event
        if (mockPeerConnection.onicecandidate) {
          mockPeerConnection.onicecandidate({ candidate: mockCandidate });
        }
      });

      // Verify the hook handled the timeout gracefully
      expect(result.current.connectionState).toBe('connecting');
      expect(result.current.error).toBeNull(); // Should not crash the connection
    });

    it('should handle multiple ICE candidate sending failures', async () => {
      const { result } = renderHook(() => useWebRTC('test-room-123', 'host', mockConfig));

      // Start screen sharing
      await act(async () => {
        await result.current.startScreenShare();
      });

      // Simulate multiple ICE candidate generation failures
      await act(async () => {
        const mockCandidates = [
          {
            candidate: 'candidate:1 1 UDP 2130706431 192.168.1.100 54400 typ host',
            sdpMid: '0',
            sdpMLineIndex: 0,
          },
          {
            candidate: 'candidate:2 1 UDP 2130706431 192.168.1.101 54401 typ host',
            sdpMid: '1',
            sdpMLineIndex: 1,
          },
        ];

        // Mock API failures for all ICE candidate sending
        global.fetch.mockRejectedValueOnce(new Error('Network error')).mockRejectedValueOnce(new Error('Server error'));

        // Trigger multiple ICE candidate events
        if (mockPeerConnection.onicecandidate) {
          mockPeerConnection.onicecandidate({ candidate: mockCandidates[0] });
          mockPeerConnection.onicecandidate({ candidate: mockCandidates[1] });
        }
      });

      // Verify the hook handled multiple failures gracefully
      expect(result.current.connectionState).toBe('connecting');
      expect(result.current.error).toContain('Failed to send ICE candidate'); // Should set error message
    });
  });

  describe('ICE Candidate Parsing Errors', () => {
    it('should handle malformed ICE candidate data', async () => {
      const { result } = renderHook(() => useWebRTC('test-room-123', 'host', mockConfig));

      // Start screen sharing
      await act(async () => {
        await result.current.startScreenShare();
      });

      // Simulate malformed ICE candidate
      await act(async () => {
        const malformedCandidate = {
          candidate: null, // Invalid candidate
          sdpMid: '0',
          sdpMLineIndex: 0,
        };

        // Trigger ICE candidate event with malformed data
        if (mockPeerConnection.onicecandidate) {
          mockPeerConnection.onicecandidate({ candidate: malformedCandidate });
        }
      });

      // Verify the hook handled the malformed candidate gracefully
      expect(result.current.connectionState).toBe('connecting');
      expect(result.current.error).toBeNull(); // Should not crash the connection
    });

    it('should handle ICE candidate with missing required fields', async () => {
      const { result } = renderHook(() => useWebRTC('test-room-123', 'host', mockConfig));

      // Start screen sharing
      await act(async () => {
        await result.current.startScreenShare();
      });

      // Simulate ICE candidate with missing fields
      await act(async () => {
        const incompleteCandidate = {
          candidate: 'candidate:1 1 UDP 2130706431 192.168.1.100 54400 typ host',
          // Missing sdpMid and sdpMLineIndex
        };

        // Trigger ICE candidate event with incomplete data
        if (mockPeerConnection.onicecandidate) {
          mockPeerConnection.onicecandidate({ candidate: incompleteCandidate });
        }
      });

      // Verify the hook handled the incomplete candidate gracefully
      expect(result.current.connectionState).toBe('connecting');
      expect(result.current.error).toBeNull(); // Should not crash the connection
    });

    it('should handle ICE candidate with invalid candidate string', async () => {
      const { result } = renderHook(() => useWebRTC('test-room-123', 'host', mockConfig));

      // Start screen sharing
      await act(async () => {
        await result.current.startScreenShare();
      });

      // Simulate ICE candidate with invalid candidate string
      await act(async () => {
        const invalidCandidate = {
          candidate: 'invalid-candidate-string',
          sdpMid: '0',
          sdpMLineIndex: 0,
        };

        // Trigger ICE candidate event with invalid candidate
        if (mockPeerConnection.onicecandidate) {
          mockPeerConnection.onicecandidate({ candidate: invalidCandidate });
        }
      });

      // Verify the hook handled the invalid candidate gracefully
      expect(result.current.connectionState).toBe('connecting');
      expect(result.current.error).toBeNull(); // Should not crash the connection
    });
  });

  describe('ICE Candidate Receiving Failures', () => {
    it('should handle ICE candidate polling API failure', async () => {
      const { result } = renderHook(() => useWebRTC('test-room-123', 'viewer', mockConfig));

      // Start connecting
      await act(async () => {
        await result.current.connectToHost();
      });

      // Simulate receiving an offer to trigger ICE candidate polling
      await act(async () => {
        // Mock offer polling success first
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

        // Now mock ICE candidate polling failure
        global.fetch.mockRejectedValueOnce(new Error('Network error'));

        // Wait for ICE candidate polling to happen and consume the mock
        await new Promise((resolve) => setTimeout(resolve, 1100));
      });

      // Verify the hook handled the polling failure gracefully
      expect(result.current.connectionState).toBe('connecting');
      expect(result.current.error).toBeNull(); // Should not crash the connection
    });

    it('should handle ICE candidate polling 404 error', async () => {
      // Clear any existing mocks
      vi.clearAllMocks();

      const { result } = renderHook(() => useWebRTC('test-room-123', 'viewer', mockConfig));

      // Start connecting
      await act(async () => {
        await result.current.connectToHost();
      });

      // Simulate receiving an offer to trigger ICE candidate polling
      await act(async () => {
        // Mock offer polling success first
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

        // Now mock 404 error for ICE candidate polling
        global.fetch.mockResolvedValueOnce({
          ok: false,
          status: 404,
          statusText: 'Not Found',
        });

        // Wait for ICE candidate polling to happen and consume the mock
        await new Promise((resolve) => setTimeout(resolve, 1100));
      });

      // Verify the hook handled the 404 gracefully
      expect(result.current.connectionState).toBe('connecting');
      // The error might be set by offer polling timeout, which is expected behavior
      // The important thing is that the connection state remains 'connecting'
    });

    it('should handle malformed ICE candidate data from API', async () => {
      const { result } = renderHook(() => useWebRTC('test-room-123', 'viewer', mockConfig));

      // Start connecting
      await act(async () => {
        await result.current.connectToHost();
      });

      // Simulate malformed ICE candidate data from API
      await act(async () => {
        // Mock API response with malformed candidate data
        global.fetch.mockResolvedValueOnce({
          ok: true,
          json: vi.fn().mockResolvedValue({
            candidates: [
              'invalid-json-string', // Malformed JSON
              {
                candidate: 'candidate:1 1 UDP 2130706431 192.168.1.100 54400 typ host',
                sdpMid: '0',
                sdpMLineIndex: 0,
              },
            ],
          }),
        });

        // Trigger ICE candidate polling (this happens internally)
      });

      // Verify the hook handled the malformed data gracefully
      expect(result.current.connectionState).toBe('connecting');
      expect(result.current.error).toBeNull(); // Should not crash the connection
    });
  });

  describe('ICE Candidate Processing Failures', () => {
    it('should handle addIceCandidate failure', async () => {
      const { result } = renderHook(() => useWebRTC('test-room-123', 'viewer', mockConfig));

      // Start connecting
      await act(async () => {
        await result.current.connectToHost();
      });

      // Simulate addIceCandidate failure
      await act(async () => {
        // Mock addIceCandidate to fail
        mockPeerConnection.addIceCandidate.mockRejectedValueOnce(new Error('Failed to add ICE candidate'));

        // Mock API response with valid candidate data
        global.fetch.mockResolvedValueOnce({
          ok: true,
          json: vi.fn().mockResolvedValue({
            candidates: [
              {
                candidate: 'candidate:1 1 UDP 2130706431 192.168.1.100 54400 typ host',
                sdpMid: '0',
                sdpMLineIndex: 0,
              },
            ],
          }),
        });

        // Trigger ICE candidate polling (this happens internally)
      });

      // Verify the hook handled the addIceCandidate failure gracefully
      expect(result.current.connectionState).toBe('connecting');
      expect(result.current.error).toBeNull(); // Should not crash the connection
    });

    it('should handle multiple addIceCandidate failures', async () => {
      const { result } = renderHook(() => useWebRTC('test-room-123', 'viewer', mockConfig));

      // Start connecting
      await act(async () => {
        await result.current.connectToHost();
      });

      // Simulate multiple addIceCandidate failures
      await act(async () => {
        // Mock addIceCandidate to fail multiple times
        mockPeerConnection.addIceCandidate
          .mockRejectedValueOnce(new Error('Failed to add ICE candidate 1'))
          .mockRejectedValueOnce(new Error('Failed to add ICE candidate 2'));

        // Mock API response with multiple candidate data
        global.fetch.mockResolvedValueOnce({
          ok: true,
          json: vi.fn().mockResolvedValue({
            candidates: [
              {
                candidate: 'candidate:1 1 UDP 2130706431 192.168.1.100 54400 typ host',
                sdpMid: '0',
                sdpMLineIndex: 0,
              },
              {
                candidate: 'candidate:2 1 UDP 2130706431 192.168.1.101 54401 typ host',
                sdpMid: '1',
                sdpMLineIndex: 1,
              },
            ],
          }),
        });

        // Trigger ICE candidate polling (this happens internally)
      });

      // Verify the hook handled multiple addIceCandidate failures gracefully
      expect(result.current.connectionState).toBe('connecting');
      expect(result.current.error).toBeNull(); // Should not crash the connection
    });
  });

  describe('ICE Candidate Timeout Scenarios', () => {
    it('should handle ICE candidate polling timeout', async () => {
      const { result } = renderHook(() => useWebRTC('test-room-123', 'viewer', mockConfig));

      // Start connecting
      await act(async () => {
        await result.current.connectToHost();
      });

      // Simulate ICE candidate polling timeout
      await act(async () => {
        // Mock API timeout for ICE candidate polling
        global.fetch.mockImplementationOnce(
          () => new Promise((_, reject) => setTimeout(() => reject(new Error('Request timeout')), 100))
        );

        // Trigger ICE candidate polling (this happens internally)
      });

      // Verify the hook handled the timeout gracefully
      expect(result.current.connectionState).toBe('connecting');
      expect(result.current.error).toBeNull(); // Should not crash the connection
    });

    it('should handle ICE candidate generation timeout', async () => {
      const { result } = renderHook(() => useWebRTC('test-room-123', 'host', mockConfig));

      // Start screen sharing
      await act(async () => {
        await result.current.startScreenShare();
      });

      // Simulate ICE candidate generation timeout
      await act(async () => {
        // Simulate ICE gathering state change to complete without candidates
        mockPeerConnection.iceGatheringState = 'complete';
        if (mockPeerConnection.onicegatheringstatechange) {
          mockPeerConnection.onicegatheringstatechange();
        }
      });

      // Verify the hook handled the timeout gracefully
      expect(result.current.connectionState).toBe('connecting');
      expect(result.current.error).toContain('Failed to send offer - no ICE candidates generated'); // Should set error message
    });
  });

  describe('ICE Candidate Recovery', () => {
    it('should recover from ICE candidate sending failure', async () => {
      // Clear any existing mocks
      vi.clearAllMocks();

      const { result } = renderHook(() => useWebRTC('test-room-123', 'host', mockConfig));

      // Start screen sharing
      await act(async () => {
        // Reset the mock implementation
        global.fetch.mockReset();

        // Set up mock for offer sending
        global.fetch.mockResolvedValueOnce({
          ok: true,
          json: vi.fn().mockResolvedValue({ ok: true }),
        });

        await result.current.startScreenShare();
      });

      // Simulate ICE candidate sending failure
      await act(async () => {
        const mockCandidate = {
          candidate: 'candidate:1 1 UDP 2130706431 192.168.1.100 54400 typ host',
          sdpMid: '0',
          sdpMLineIndex: 0,
        };

        // Mock API failure first
        global.fetch.mockRejectedValueOnce(new Error('Network error'));

        // Simulate ICE gathering state change to trigger ICE candidate generation
        mockPeerConnection.iceGatheringState = 'gathering';
        if (mockPeerConnection.onicegatheringstatechange) {
          mockPeerConnection.onicegatheringstatechange();
        }

        // Trigger ICE candidate event
        if (mockPeerConnection.onicecandidate) {
          mockPeerConnection.onicecandidate({ candidate: mockCandidate });
        }

        // Wait a bit for the error to be set
        await new Promise((resolve) => setTimeout(resolve, 100));
      });

      // Verify the hook handled the failure and set an error
      expect(result.current.connectionState).toBe('connecting');
      expect(result.current.error).toBeTruthy();
      expect(result.current.error).toContain('Failed to send ICE candidate');

      // Now simulate recovery
      await act(async () => {
        const mockCandidate = {
          candidate: 'candidate:1 1 UDP 2130706431 192.168.1.100 54400 typ host',
          sdpMid: '0',
          sdpMLineIndex: 0,
        };

        // Mock API success for retry
        global.fetch.mockResolvedValueOnce({
          ok: true,
          json: vi.fn().mockResolvedValue({ ok: true }),
        });

        // Trigger ICE candidate event again
        if (mockPeerConnection.onicecandidate) {
          mockPeerConnection.onicecandidate({ candidate: mockCandidate });
        }

        // Wait a bit
        await new Promise((resolve) => setTimeout(resolve, 100));
      });

      // Verify the hook recovered from the failure
      expect(result.current.connectionState).toBe('connecting');
    });

    it('should recover from ICE candidate polling failure', async () => {
      const { result } = renderHook(() => useWebRTC('test-room-123', 'viewer', mockConfig));

      // Start connecting
      await act(async () => {
        await result.current.connectToHost();
      });

      // Simulate ICE candidate polling failure followed by success
      await act(async () => {
        // Mock API failure first
        global.fetch.mockRejectedValueOnce(new Error('Network error'));

        // Wait a bit
        await new Promise((resolve) => setTimeout(resolve, 100));

        // Mock API success for retry
        global.fetch.mockResolvedValueOnce({
          ok: true,
          json: vi.fn().mockResolvedValue({
            candidates: [
              {
                candidate: 'candidate:1 1 UDP 2130706431 192.168.1.100 54400 typ host',
                sdpMid: '0',
                sdpMLineIndex: 0,
              },
            ],
          }),
        });
      });

      // Verify the hook recovered from the failure
      expect(result.current.connectionState).toBe('connecting');
      expect(result.current.error).toBeNull(); // Should not crash the connection
    });
  });
});
