import { useState, useEffect, useRef, useCallback } from 'react';
import { getIceServers } from '../config/turn.js';
import logger from '../utils/logger';
import { createExponentialBackoffPolling } from '../utils/polling';

export function useWebRTC(roomId, role, config, _viewerId = null) {
  // State
  const [connectionState, setConnectionState] = useState('disconnected');
  const [remoteStream, setRemoteStream] = useState(null);
  const [localStream, setLocalStream] = useState(null);
  const [error, setError] = useState(null);
  const [iceServers, setIceServers] = useState([]);

  // Multi-viewer support: Map of viewerId to peer connections
  const [peerConnections, _setPeerConnections] = useState(new Map());
  const [viewerCount, _setViewerCount] = useState(0);

  // Granular error state for better user feedback
  const [errorState, setErrorState] = useState({
    type: null, // 'permission', 'network', 'webrtc', 'timeout', 'unknown'
    code: null, // Specific error code
    message: null, // User-friendly message
    details: null, // Technical details for debugging
  });

  // Refs
  const peerConnectionRef = useRef(null);
  const dataChannelRef = useRef(null);
  const offerIntervalRef = useRef(null);
  const answerIntervalRef = useRef(null);
  const candidateIntervalRef = useRef(null);
  const isMountedRef = useRef(true);
  const localStreamRef = useRef(null);

  // Initialize ICE servers
  useEffect(() => {
    // Use TURN server configuration by default for better connectivity
    const servers = getIceServers(config?.useTurn !== false); // Default to true unless explicitly disabled
    setIceServers(servers);
  }, [config]);

  // Helper function to set granular error state
  const setGranularError = useCallback((type, code, message, details = null) => {
    setErrorState({ type, code, message, details });
    setError(message);
    logger.error(`WebRTC Error [${type}]: ${message}`, { code, details });
  }, []);

  // Send ICE candidate
  const sendICECandidate = useCallback(
    async (candidate) => {
      if (!roomId || !role) return;

      try {
        const response = await fetch('/api/candidate', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            ...(config?.authSecret && { 'x-auth-secret': config.authSecret }),
          },
          body: JSON.stringify({
            roomId,
            role,
            viewerId: _viewerId, // Include viewer ID for proper identification
            candidate: candidate, // Send RTCIceCandidate directly
          }),
        });

        if (!response.ok) {
          throw new Error(`Failed to send ICE candidate: ${response.status}`);
        }
      } catch (err) {
        logger.error('Error sending ICE candidate:', err);
        setGranularError(
          'network',
          'SEND_ICE_CANDIDATE_FAILED',
          'Failed to send ICE candidate to server. Please check your connection and try again.',
          err.message
        );
        // Don't throw for ICE candidate failures - they're not critical
        // Just log the error and continue
      }
    },
    [roomId, role, config, _viewerId, setGranularError] // Fixed: Added _viewerId and setGranularError to dependency array
  );

  // Create peer connection
  const createPeerConnection = useCallback(() => {
    // Ensure iceServers is not empty
    const servers = iceServers.length > 0 ? iceServers : getIceServers(true);
    const pc = new RTCPeerConnection({
      iceServers: servers,
    });

    // Handle ICE candidates
    pc.onicecandidate = (event) => {
      if (event.candidate) {
        try {
          // Validate candidate before sending
          if (
            event.candidate.candidate &&
            event.candidate.sdpMid !== undefined &&
            event.candidate.sdpMLineIndex !== undefined
          ) {
            sendICECandidate(event.candidate);
          } else {
            logger.warn('Invalid ICE candidate received, skipping:', event.candidate);
          }
        } catch (err) {
          logger.error('Error handling ICE candidate:', err);
          // Don't crash the connection for ICE candidate errors
        }
      }
    };

    // Handle ICE gathering state changes
    pc.onicegatheringstatechange = () => {
      logger.webrtc('ICE gathering state changed', { state: pc.iceGatheringState });

      // Check if ICE gathering completed without generating candidates
      if (pc.iceGatheringState === 'complete') {
        // This could indicate a problem with NAT traversal or network connectivity
        // Set an error to inform the user
        setGranularError(
          'webrtc',
          'ICE_GATHERING_TIMEOUT',
          'Failed to send offer - no ICE candidates generated for network connection',
          'ICE gathering completed without generating any candidates'
        );
      }
    };

    // Handle connection state changes
    pc.onconnectionstatechange = () => {
      logger.webrtc('Connection state changed', { state: pc.connectionState });
      setConnectionState(pc.connectionState);

      // Clear error state on successful connection
      if (pc.connectionState === 'connected') {
        setError(null);
        setErrorState({ type: null, code: null, message: null, details: null });
      }

      // Clear polling intervals when connected or failed
      if (pc.connectionState === 'connected' || pc.connectionState === 'failed') {
        if (offerIntervalRef.current) {
          clearInterval(offerIntervalRef.current);
          offerIntervalRef.current = null;
        }
        if (answerIntervalRef.current) {
          clearInterval(answerIntervalRef.current);
          answerIntervalRef.current = null;
        }
        if (candidateIntervalRef.current) {
          clearInterval(candidateIntervalRef.current);
          candidateIntervalRef.current = null;
        }
      }

      // Cleanup peer connection on disconnect or failure
      if (pc.connectionState === 'disconnected' || pc.connectionState === 'failed' || pc.connectionState === 'closed') {
        // Use setTimeout to avoid cleanup during state change
        setTimeout(() => {
          if (peerConnectionRef.current === pc) {
            try {
              pc.close();
              peerConnectionRef.current = null;
            } catch (err) {
              logger.error('Error during peer connection cleanup:', err);
            }
          }
        }, 0);
      }
    };

    // Handle ICE connection state changes
    pc.oniceconnectionstatechange = () => {
      logger.webrtc('ICE connection state changed', { state: pc.iceConnectionState });

      // Handle ICE connection failures
      if (pc.iceConnectionState === 'failed') {
        setConnectionState('failed');
        setGranularError(
          'webrtc',
          'ICE_CONNECTION_FAILED',
          'Connection failed - unable to establish network connection',
          `ICE connection state: ${pc.iceConnectionState}`
        );

        // Cleanup peer connection on ICE failure
        setTimeout(() => {
          if (peerConnectionRef.current === pc) {
            try {
              pc.close();
              peerConnectionRef.current = null;
            } catch (err) {
              logger.error('Error during peer connection cleanup on ICE failure:', err);
            }
          }
        }, 0);
      }
    };

    // Handle remote stream
    pc.ontrack = (event) => {
      logger.webrtc('Received remote stream', { stream: event.streams[0] });
      setRemoteStream(event.streams[0]);
    };

    // Handle data channel
    pc.ondatachannel = (event) => {
      const channel = event.channel;
      dataChannelRef.current = channel;

      channel.onopen = () => {
        logger.webrtc('Data channel opened');
      };

      channel.onmessage = (event) => {
        logger.webrtc('Received data channel message', { data: event.data });
      };
    };

    return pc;
  }, [iceServers, sendICECandidate]);

  // Send offer
  const sendOffer = useCallback(
    async (offer) => {
      if (!roomId) return;

      try {
        const response = await fetch('/api/offer', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            ...(config?.authSecret && { 'x-auth-secret': config.authSecret }),
          },
          body: JSON.stringify({
            roomId,
            desc: offer,
          }),
        });

        if (!response.ok) {
          throw new Error(`Failed to send offer: ${response.status}`);
        }
      } catch (err) {
        logger.error('Error sending offer:', err);
        setGranularError(
          'network',
          'SEND_OFFER_FAILED',
          'Failed to send offer to server. Please check your connection and try again.',
          err.message
        );
        throw err; // Re-throw the error so startScreenShare can handle it
      }
    },
    [roomId, config, setGranularError]
  );

  // Send answer
  const sendAnswer = useCallback(
    async (answer) => {
      if (!roomId) return;

      try {
        const response = await fetch('/api/answer', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            ...(config?.authSecret && { 'x-auth-secret': config.authSecret }),
          },
          body: JSON.stringify({
            roomId,
            desc: answer,
          }),
        });

        if (!response.ok) {
          throw new Error(`Failed to send answer: ${response.status}`);
        }
      } catch (err) {
        logger.error('Error sending answer:', err);
        setGranularError(
          'network',
          'SEND_ANSWER_FAILED',
          'Failed to send answer to server. Please check your connection and try again.',
          err.message
        );
        throw err; // Re-throw the error so the caller can handle it
      }
    },
    [roomId, config, setGranularError]
  );

  // Start polling for ICE candidates with exponential backoff
  const startCandidatePolling = useCallback(async () => {
    if (candidateIntervalRef.current) {
      clearInterval(candidateIntervalRef.current);
    }

    const pollFn = async () => {
      try {
        const response = await fetch(
          `/api/candidate?roomId=${roomId}&role=${role}${_viewerId ? `&viewerId=${_viewerId}` : ''}`
        );

        if (response.ok) {
          const data = await response.json();
          if (data.candidates && data.candidates.length > 0) {
            const pc = peerConnectionRef.current;
            if (pc) {
              for (const candidate of data.candidates) {
                try {
                  // Validate candidate before adding
                  if (
                    candidate &&
                    typeof candidate === 'object' &&
                    candidate.candidate &&
                    candidate.sdpMid !== undefined &&
                    candidate.sdpMLineIndex !== undefined
                  ) {
                    await pc.addIceCandidate(candidate);
                    logger.webrtc('Added ICE candidate', { candidate });
                  } else {
                    logger.warn('Invalid ICE candidate received, skipping:', candidate);
                  }
                } catch (err) {
                  logger.error('Error adding ICE candidate:', err);
                  // Continue with other candidates
                }
              }
            }
            return true; // Success, stop polling
          }
        } else if (response.status === 404) {
          // No candidates yet, continue polling
          return false;
        } else {
          logger.error('Error polling for ICE candidates:', response.status);
          return true; // Error, stop polling
        }
        return false;
      } catch (err) {
        // Handle network errors gracefully - don't crash the connection
        logger.error('Network error polling for ICE candidates:', err);
        return false; // Continue polling despite error
      }
    };

    const polling = createExponentialBackoffPolling(pollFn, {
      initialInterval: 1000,
      maxInterval: 5000,
      maxPolls: 30, // 30 seconds timeout for ICE candidates
    });

    try {
      await polling();
    } catch (err) {
      logger.error('ICE candidate polling timeout:', err);
      if (isMountedRef.current) {
        setGranularError(
          'timeout',
          'ICE_CANDIDATE_POLLING_TIMEOUT',
          'ICE candidate polling timeout - connection may be unstable',
          err.message
        );
      }
      // Don't throw the error - ICE candidate polling timeout is not critical
      // The connection can still work without ICE candidates
    }
  }, [roomId, role, _viewerId]);

  // Start polling for offers (viewer)
  const startOfferPolling = useCallback(async () => {
    if (offerIntervalRef.current) {
      clearInterval(offerIntervalRef.current);
    }

    let pollCount = 0;
    let pollInterval = 1000; // Start with 1 second
    const maxPolls = 60; // 60 seconds timeout

    const pollForOffer = async () => {
      try {
        pollCount++;

        // Timeout after maxPolls attempts
        if (pollCount > maxPolls) {
          clearInterval(offerIntervalRef.current);
          offerIntervalRef.current = null;
          if (isMountedRef.current) {
            setGranularError(
              'timeout',
              'OFFER_POLLING_TIMEOUT',
              'Connection timeout: No offer received from host. Make sure the host has started sharing.',
              `Polled ${maxPolls} times without receiving offer`
            );
            setConnectionState('failed');
          }
          return;
        }

        const response = await fetch(`/api/offer?roomId=${roomId}`);

        if (response.ok) {
          const data = await response.json();
          if (data.desc) {
            // Clear interval once we get an offer
            clearInterval(offerIntervalRef.current);
            offerIntervalRef.current = null;

            // Create peer connection when we receive an offer
            const pc = createPeerConnection();
            peerConnectionRef.current = pc;

            // Handle the offer
            await pc.setRemoteDescription(data.desc);

            // Create and send answer
            const answer = await pc.createAnswer();
            await pc.setLocalDescription(answer);
            await sendAnswer(answer);

            // Start ICE candidate polling now that we have a peer connection
            startCandidatePolling();
          }
        } else if (response.status === 404) {
          // Expected 404 - no offer yet, but reduce polling frequency after initial attempts
          if (pollCount > 10) {
            // After 10 seconds, reduce to polling every 5 seconds
            clearInterval(offerIntervalRef.current);
            pollInterval = 5000;
            offerIntervalRef.current = setInterval(pollForOffer, pollInterval);
          }
        } else {
          // Unexpected error
          logger.error('Unexpected error polling for offers:', response.status);
          clearInterval(offerIntervalRef.current);
          offerIntervalRef.current = null;
          if (isMountedRef.current) {
            setGranularError(
              'network',
              'SERVER_ERROR',
              `Server error while polling for offers: ${response.status}`,
              `HTTP ${response.status}`
            );
            setConnectionState('failed');
          }
        }
      } catch (err) {
        logger.error('Error polling for offers:', err);
        // Don't stop polling on network errors - continue trying
        // The connection can recover when network is restored
        if (isMountedRef.current) {
          setGranularError(
            'network',
            'NETWORK_ERROR',
            'Network error while polling for offers. Please check your connection.',
            err.message
          );
          // Don't set connection state to 'failed' - keep trying
        }
      }
    };

    offerIntervalRef.current = setInterval(pollForOffer, pollInterval);
  }, [roomId, sendAnswer, createPeerConnection, startCandidatePolling]);

  // Start polling for answers (host)
  const startAnswerPolling = useCallback(async () => {
    if (answerIntervalRef.current) {
      clearInterval(answerIntervalRef.current);
    }

    let pollCount = 0;
    let pollInterval = 1000; // Start with 1 second
    const maxPolls = 60; // 60 seconds timeout

    const pollForAnswer = async () => {
      try {
        pollCount++;

        // Timeout after maxPolls attempts
        if (pollCount > maxPolls) {
          clearInterval(answerIntervalRef.current);
          answerIntervalRef.current = null;
          if (isMountedRef.current) {
            setGranularError(
              'timeout',
              'ANSWER_POLLING_TIMEOUT',
              'Connection timeout: No answer received from viewer. Make sure the viewer has connected.',
              `Polled ${maxPolls} times without receiving answer`
            );
            setConnectionState('failed');
          }
          return;
        }

        const response = await fetch(`/api/answer?roomId=${roomId}`);

        if (response.ok) {
          const data = await response.json();
          if (data.desc) {
            // Clear interval once we get an answer
            clearInterval(answerIntervalRef.current);
            answerIntervalRef.current = null;

            // Handle the answer
            const pc = peerConnectionRef.current;
            if (pc) {
              await pc.setRemoteDescription(data.desc);
            }
          }
        } else if (response.status === 404) {
          // Expected 404 - no answer yet, but reduce polling frequency after initial attempts
          if (pollCount > 10) {
            // After 10 seconds, reduce to polling every 5 seconds
            clearInterval(answerIntervalRef.current);
            pollInterval = 5000;
            answerIntervalRef.current = setInterval(pollForAnswer, pollInterval);
          }
        } else {
          // Unexpected error
          logger.error('Unexpected error polling for answers:', response.status);
          clearInterval(answerIntervalRef.current);
          answerIntervalRef.current = null;
          if (isMountedRef.current) {
            setGranularError(
              'network',
              'SERVER_ERROR',
              `Server error while polling for answers: ${response.status}`,
              `HTTP ${response.status}`
            );
            setConnectionState('failed');
          }
        }
      } catch (err) {
        logger.error('Error polling for answers:', err);
        // Don't stop polling on network errors - continue trying
        // The connection can recover when network is restored
        if (isMountedRef.current) {
          setGranularError(
            'network',
            'NETWORK_ERROR',
            'Network error while polling for answers. Please check your connection.',
            err.message
          );
          // Don't set connection state to 'failed' - keep trying
        }
      }
    };

    answerIntervalRef.current = setInterval(pollForAnswer, pollInterval);

    // Return a promise that resolves immediately
    return Promise.resolve();
  }, [roomId]);

  // Fixed: Added _viewerId to dependency array

  // Start screen sharing (host)
  const startScreenShare = useCallback(async () => {
    if (role !== 'host') {
      throw new Error('Only hosts can start screen sharing');
    }

    try {
      setError(null);
      setConnectionState('connecting');

      // Get screen share stream
      const stream = await navigator.mediaDevices.getDisplayMedia({
        video: true,
        audio: true,
      });

      // Check what permissions were actually granted
      const videoTracks = stream.getVideoTracks();
      const audioTracks = stream.getAudioTracks();

      if (videoTracks.length === 0) {
        setGranularError(
          'permission',
          'VIDEO_DENIED',
          'Video permission is required to share your screen. Please allow video access and try again.',
          'User denied video permission in getDisplayMedia'
        );
        throw new Error('Video permission denied - cannot share screen without video');
      }

      if (audioTracks.length === 0) {
        logger.warn('Audio permission denied - screen sharing will be video-only');
        // Don't throw error for audio - video-only is acceptable
      }

      setLocalStream(stream);
      localStreamRef.current = stream;

      // Create peer connection
      const pc = createPeerConnection();
      peerConnectionRef.current = pc;

      // Add transceivers to peer connection (modern WebRTC approach)
      stream.getTracks().forEach((track) => {
        pc.addTransceiver(track, {
          streams: [stream],
          direction: 'sendonly', // Host sends media to viewers
        });
      });

      // Create and send offer
      const offer = await pc.createOffer({
        offerToReceiveAudio: true,
        offerToReceiveVideo: true,
      });

      await pc.setLocalDescription(offer);
      await sendOffer(offer);

      // Keep connection state as 'connecting' after successful offer sending
      // The connection state will be updated by the peer connection event handlers

      // Start polling for answers (don't await - let it run in background)
      startAnswerPolling().catch((err) => {
        logger.error('Answer polling failed:', err);
      });

      // Start polling for ICE candidates (don't await - let it run in background)
      startCandidatePolling().catch((err) => {
        logger.error('ICE candidate polling failed:', err);
      });

      return stream;
    } catch (err) {
      logger.error('Error starting screen share:', err);
      setConnectionState('failed');

      // Cleanup any resources that were created
      if (localStreamRef.current) {
        localStreamRef.current.getTracks().forEach((track) => track.stop());
        localStreamRef.current = null;
        setLocalStream(null);
      }

      if (peerConnectionRef.current) {
        try {
          peerConnectionRef.current.close();
          peerConnectionRef.current = null;
        } catch (cleanupErr) {
          logger.error('Error during peer connection cleanup:', cleanupErr);
        }
      }

      // Set granular error based on error type
      if (err.message.includes('Permission denied') || err.message.includes('NotAllowedError')) {
        setGranularError(
          'permission',
          'PERMISSION_DENIED',
          'Screen sharing permission denied. Please allow screen sharing and try again.',
          err.message
        );
      } else if (err.message.includes('createOffer')) {
        setGranularError(
          'webrtc',
          'CREATE_OFFER_FAILED',
          'Failed to create WebRTC offer. Please try again.',
          err.message
        );
      } else if (err.message.includes('setLocalDescription')) {
        setGranularError(
          'webrtc',
          'SET_LOCAL_DESCRIPTION_FAILED',
          'Failed to set local description. Please try again.',
          err.message
        );
      } else if (err.message.includes('Failed to send offer')) {
        setGranularError(
          'network',
          'SEND_OFFER_FAILED',
          'Failed to send offer to server. Please check your connection and try again.',
          err.message
        );
      } else {
        setGranularError('unknown', 'UNKNOWN_ERROR', 'An unexpected error occurred. Please try again.', err.message);
      }

      throw err;
    }
  }, [role, createPeerConnection, sendOffer, startAnswerPolling, startCandidatePolling, setGranularError]);

  // Connect to host (viewer)
  const connectToHost = useCallback(async () => {
    if (role !== 'viewer') {
      throw new Error('Only viewers can connect to host');
    }

    try {
      setError(null);
      setConnectionState('connecting');

      // Don't create peer connection yet - wait for offer from host
      // Start polling for offers (ICE candidate polling will start when peer connection is created)
      startOfferPolling();
    } catch (err) {
      logger.error('Error connecting to host:', err);
      setConnectionState('failed');

      // Cleanup any resources that were created
      if (peerConnectionRef.current) {
        try {
          peerConnectionRef.current.close();
          peerConnectionRef.current = null;
        } catch (cleanupErr) {
          logger.error('Error during peer connection cleanup:', cleanupErr);
        }
      }

      // Set granular error based on error type
      if (err.message.includes('Network error') || err.message.includes('fetch')) {
        setGranularError(
          'network',
          'NETWORK_ERROR',
          'Network connection failed. Please check your connection and try again.',
          err.message
        );
      } else if (err.message.includes('Room not found') || err.message.includes('404')) {
        setGranularError(
          'network',
          'ROOM_NOT_FOUND',
          'Room not found. Please check the room ID and try again.',
          err.message
        );
      } else {
        setGranularError('unknown', 'UNKNOWN_ERROR', 'An unexpected error occurred. Please try again.', err.message);
      }

      throw err;
    }
  }, [role, startOfferPolling]);

  // Stop screen sharing
  const stopScreenShare = useCallback(async () => {
    try {
      // Stop local stream
      if (localStream) {
        localStream.getTracks().forEach((track) => track.stop());
        setLocalStream(null);
        localStreamRef.current = null;
      }

      // Stop remote stream tracks if they exist
      if (remoteStream) {
        remoteStream.getTracks().forEach((track) => track.stop());
        setRemoteStream(null);
      }

      // Close peer connection
      if (peerConnectionRef.current) {
        try {
          peerConnectionRef.current.close();
          peerConnectionRef.current = null;
        } catch (err) {
          logger.error('Error closing peer connection:', err);
        }
      }

      // Clear intervals
      if (offerIntervalRef.current) {
        clearInterval(offerIntervalRef.current);
        offerIntervalRef.current = null;
      }

      if (answerIntervalRef.current) {
        clearInterval(answerIntervalRef.current);
        answerIntervalRef.current = null;
      }

      if (candidateIntervalRef.current) {
        clearInterval(candidateIntervalRef.current);
        candidateIntervalRef.current = null;
      }

      setConnectionState('disconnected');
      setRemoteStream(null);
      setError(null);
      setErrorState({ type: null, code: null, message: null, details: null });
    } catch (err) {
      logger.error('Error stopping screen share:', err);
      setError(`Failed to stop screen sharing: ${err.message}`);
    }
  }, [localStream, remoteStream]);

  // Disconnect
  const disconnect = useCallback(async () => {
    await stopScreenShare();
  }, [stopScreenShare]);

  // Start polling for offers (viewer)

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      isMountedRef.current = false; // Mark component as unmounted

      if (offerIntervalRef.current) {
        clearInterval(offerIntervalRef.current);
        offerIntervalRef.current = null;
      }
      if (answerIntervalRef.current) {
        clearInterval(answerIntervalRef.current);
        answerIntervalRef.current = null;
      }
      if (candidateIntervalRef.current) {
        clearInterval(candidateIntervalRef.current);
        candidateIntervalRef.current = null;
      }
      if (peerConnectionRef.current) {
        try {
          peerConnectionRef.current.close();
          peerConnectionRef.current = null;
        } catch (err) {
          logger.error('Error during peer connection cleanup on unmount:', err);
        }
      }

      // Stop local stream tracks on unmount
      const stream = localStreamRef.current;
      if (stream) {
        stream.getTracks().forEach((track) => track.stop());
        localStreamRef.current = null;
      }

      // Stop remote stream tracks on unmount
      if (remoteStream) {
        remoteStream.getTracks().forEach((track) => track.stop());
      }

      // Clear error states on unmount
      setError(null);
      setErrorState({ type: null, code: null, message: null, details: null });
      setConnectionState('disconnected');
    };
  }, [remoteStream]); // Include remoteStream in dependency array

  return {
    // State
    connectionState,
    remoteStream,
    localStream,
    error,
    errorState, // Granular error state for better UI feedback
    peerConnections, // Multi-viewer support
    viewerCount, // Number of connected viewers

    // Actions
    startScreenShare,
    stopScreenShare,
    connectToHost,
    disconnect,
  };
}
