import { useState, useEffect, useRef, useCallback } from 'react';
import { getIceServers } from '../config/turn.js';
import logger from '../utils/logger';
import { createExponentialBackoffPolling } from '../utils/polling';
import { HOST_CONNECTION_STATUS, VIEWER_CONNECTION_STATUS, VIEWER_PEER_STATUS } from '../constants';

export function useWebRTC(roomId, role, config, _viewerId = null, options = {}) {
  const { onSenderSecret } = options || {};
  // State
  const [connectionState, setConnectionState] = useState('disconnected');
  const [remoteStream, setRemoteStream] = useState(null);
  const [localStream, setLocalStream] = useState(null);
  const [error, setError] = useState(null);
  const [iceServers, setIceServers] = useState([]);
  const [senderSecret, setSenderSecret] = useState(null);
  const [lifecycleStatus, setLifecycleStatus] = useState(
    role === 'host' ? HOST_CONNECTION_STATUS.IDLE : VIEWER_CONNECTION_STATUS.READY
  );

  // Multi-viewer support: Map of viewerId to peer connections
  const [peerConnections, setPeerConnections] = useState(new Map());
  const [viewerCount, setViewerCount] = useState(0);
  const [hasTurnServer, setHasTurnServer] = useState(false);

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

  const PRIMARY_VIEWER_KEY = 'viewer-primary';
  const HOST_PEER_KEY = 'host-peer';

  // Initialize ICE servers and detect TURN support
  useEffect(() => {
    const includeTurn = config?.useTurn !== false;
    const servers = getIceServers(includeTurn); // Default to true unless explicitly disabled
    setIceServers(servers);

    const hasTurn = servers.some((server) => {
      const urls = Array.isArray(server.urls) ? server.urls : [server.urls];
      return urls.some((url) => typeof url === 'string' && url.startsWith('turn:'));
    });

    setHasTurnServer(hasTurn);
  }, [config]);

  useEffect(() => {
    setViewerCount(peerConnections.size);
  }, [peerConnections]);

  const updatePeerConnection = useCallback((id, updates) => {
    if (!id) return;
    setPeerConnections((prev) => {
      const next = new Map(prev);
      const existing = next.get(id) || { id };
      next.set(id, { ...existing, ...updates, id, updatedAt: Date.now() });
      return next;
    });
  }, []);

  const removePeerConnection = useCallback((id) => {
    if (!id) return;
    setPeerConnections((prev) => {
      if (!prev.has(id)) return prev;
      const next = new Map(prev);
      next.delete(id);
      return next;
    });
  }, []);

  // Helper function to set granular error state
  const setGranularError = useCallback((type, code, message, details = null) => {
    setErrorState({ type, code, message, details });
    setError(message);
    logger.error(`WebRTC Error [${type}]: ${message}`, { code, details });
  }, []);

  // Register sender and get secret for authentication
  const registerSender = useCallback(async () => {
    if (!roomId || !role) return null;

    if (senderSecret) {
      return senderSecret;
    }

    try {
      const senderId = role === 'viewer' && _viewerId ? _viewerId : role;
      const response = await fetch('/api/register-sender', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(config?.authSecret && { 'x-auth-secret': config.authSecret }),
        },
        body: JSON.stringify({
          roomId,
          senderId,
        }),
      });

      if (!response || typeof response.ok !== 'boolean') {
        throw new Error('Failed to register sender: invalid response');
      }

      if (!response.ok) {
        throw new Error(`Failed to register sender: ${response.status}`);
      }

      const data = await response.json();
      if (data.secret) {
        setSenderSecret(data.secret);
        if (typeof onSenderSecret === 'function') {
          onSenderSecret(data.secret);
        }
      }
      return data.secret;
    } catch (err) {
      logger.error('Error registering sender:', err);
      // Don't throw - this is optional authentication
      return null;
    }
  }, [roomId, role, _viewerId, config, senderSecret, onSenderSecret]);

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
            ...(senderSecret && { 'x-sender-secret': senderSecret }),
          },
          body: JSON.stringify({
            roomId,
            role,
            viewerId: _viewerId, // Include viewer ID for proper identification
            candidate: candidate, // Send RTCIceCandidate directly
          }),
        });

        if (!response || typeof response.ok !== 'boolean') {
          throw new Error('Failed to send ICE candidate: invalid response');
        }

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
    [roomId, role, config, _viewerId, setGranularError, senderSecret] // Added senderSecret to dependency array
  );

  // Create peer connection
  const createPeerConnection = useCallback(() => {
    // Ensure iceServers is not empty
    const servers = iceServers.length > 0 ? iceServers : getIceServers(true);
    const pc = new RTCPeerConnection({
      iceServers: servers,
    });
    const listenerEntries = [];

    const attachListener = (eventName, handler) => {
      if (typeof pc.addEventListener === 'function') {
        try {
          pc.addEventListener(eventName, handler);
          listenerEntries.push([eventName, handler]);
        } catch (err) {
          logger.warn(`Failed to attach ${eventName} listener via addEventListener`, err);
        }
      }

      const propName = `on${eventName}`;
      if (propName in pc) {
        pc[propName] = handler;
      }
    };

    // Handle ICE candidates
    attachListener('icecandidate', (event) => {
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
    });

    // Handle ICE gathering state changes
    attachListener('icegatheringstatechange', () => {
      logger.webrtc('ICE gathering state changed', { state: pc.iceGatheringState });
      // ICE gathering completing is normal - don't set an error
      // Candidates are sent via onicecandidate as they're generated
    });

    // Handle connection state changes
    attachListener('connectionstatechange', () => {
      logger.webrtc('Connection state changed', { state: pc.connectionState });
      setConnectionState(pc.connectionState);

      if (role === 'host') {
        switch (pc.connectionState) {
          case 'connecting':
            updatePeerConnection(PRIMARY_VIEWER_KEY, { status: VIEWER_PEER_STATUS.CONNECTING });
            setLifecycleStatus(HOST_CONNECTION_STATUS.WAITING_FOR_VIEWER);
            break;
          case 'connected':
            updatePeerConnection(PRIMARY_VIEWER_KEY, { status: VIEWER_PEER_STATUS.CONNECTED });
            setLifecycleStatus(HOST_CONNECTION_STATUS.CONNECTED);
            break;
          case 'disconnected':
            updatePeerConnection(PRIMARY_VIEWER_KEY, { status: VIEWER_PEER_STATUS.DISCONNECTED });
            setLifecycleStatus(HOST_CONNECTION_STATUS.DISCONNECTED);
            break;
          case 'failed':
            updatePeerConnection(PRIMARY_VIEWER_KEY, { status: VIEWER_PEER_STATUS.FAILED });
            setLifecycleStatus(HOST_CONNECTION_STATUS.ERROR);
            break;
          case 'closed':
            removePeerConnection(PRIMARY_VIEWER_KEY);
            setLifecycleStatus(HOST_CONNECTION_STATUS.DISCONNECTED);
            break;
          default:
            break;
        }
      } else if (role === 'viewer') {
        switch (pc.connectionState) {
          case 'connecting':
            updatePeerConnection(HOST_PEER_KEY, { status: VIEWER_PEER_STATUS.CONNECTING });
            setLifecycleStatus(VIEWER_CONNECTION_STATUS.ANSWERING);
            break;
          case 'connected':
            updatePeerConnection(HOST_PEER_KEY, { status: VIEWER_PEER_STATUS.CONNECTED });
            setLifecycleStatus(VIEWER_CONNECTION_STATUS.CONNECTED);
            break;
          case 'disconnected':
            updatePeerConnection(HOST_PEER_KEY, { status: VIEWER_PEER_STATUS.DISCONNECTED });
            setLifecycleStatus(VIEWER_CONNECTION_STATUS.DISCONNECTED);
            break;
          case 'failed':
            updatePeerConnection(HOST_PEER_KEY, { status: VIEWER_PEER_STATUS.FAILED });
            setLifecycleStatus(VIEWER_CONNECTION_STATUS.ERROR);
            break;
          case 'closed':
            removePeerConnection(HOST_PEER_KEY);
            setLifecycleStatus(VIEWER_CONNECTION_STATUS.DISCONNECTED);
            break;
          default:
            break;
        }
      }

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
              pc.__listenerCleanup?.();
              pc.close();
              peerConnectionRef.current = null;
            } catch (err) {
              logger.error('Error during peer connection cleanup:', err);
            }
          }
        }, 0);
      }
    });

    // Handle ICE connection state changes
    attachListener('iceconnectionstatechange', () => {
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
              pc.__listenerCleanup?.();
              pc.close();
              peerConnectionRef.current = null;
            } catch (err) {
              logger.error('Error during peer connection cleanup on ICE failure:', err);
            }
          }
        }, 0);
      }
    });

    // Handle remote stream
    attachListener('track', (event) => {
      logger.webrtc('Received remote stream', { stream: event.streams[0] });
      setRemoteStream(event.streams[0]);
    });

    // Handle data channel
    attachListener('datachannel', (event) => {
      const channel = event.channel;
      dataChannelRef.current = channel;

      channel.onopen = () => {
        logger.webrtc('Data channel opened');
      };

      channel.onmessage = (event) => {
        logger.webrtc('Received data channel message', { data: event.data });
      };
    });

    pc.__listenerCleanup = () => {
      if (typeof pc.removeEventListener !== 'function') {
        return;
      }
      while (listenerEntries.length > 0) {
        const [eventName, handler] = listenerEntries.pop();
        try {
          pc.removeEventListener(eventName, handler);
        } catch (err) {
          logger.warn(`Failed to remove ${eventName} listener during cleanup`, err);
        }
      }
    };

    return pc;
  }, [iceServers, sendICECandidate, setGranularError]);

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
            ...(senderSecret && { 'x-sender-secret': senderSecret }),
          },
          body: JSON.stringify({
            roomId,
            desc: offer,
            role, // Include role for authentication
          }),
        });

        if (!response || typeof response.ok !== 'boolean') {
          throw new Error('Failed to send offer: invalid response');
        }

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
    [roomId, config, setGranularError, senderSecret, role]
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
            ...(senderSecret && { 'x-sender-secret': senderSecret }),
          },
          body: JSON.stringify({
            roomId,
            desc: answer,
            role, // Include role for authentication
          }),
        });

        if (!response || typeof response.ok !== 'boolean') {
          throw new Error('Failed to send answer: invalid response');
        }

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
    [roomId, config, setGranularError, senderSecret, role]
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

        if (!response || typeof response.ok !== 'boolean') {
          logger.error('Invalid response polling for ICE candidates');
          return false;
        }

        if (response.ok) {
          const data = await response.json();
          if (data.candidates && data.candidates.length > 0) {
            const pc = peerConnectionRef.current;
            if (pc) {
              // Check if remote description is set before adding candidates
              if (!pc.remoteDescription) {
                logger.warn('Cannot add ICE candidates yet - remote description not set. Will retry.');
                return false; // Continue polling until remote description is set
              }

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
      // ICE candidate timeout is expected if no remote peer connects
      logger.warn('ICE candidate polling timeout - no remote peer connected yet', err);
      // Don't set error state - this is expected when starting without a viewer
      // The connection will retry when a viewer actually connects
    }
  }, [roomId, role, _viewerId, setGranularError]);

  // Start polling for offers (viewer)
  const startOfferPolling = useCallback(async () => {
    // Clear any existing interval
    if (offerIntervalRef.current) {
      clearInterval(offerIntervalRef.current);
      offerIntervalRef.current = null;
    }

    // The polling function that will be repeatedly called
    const pollFn = async () => {
      try {
        const response = await fetch(`/api/offer?roomId=${roomId}`);

        if (!response || typeof response.ok !== 'boolean') {
          logger.error('Invalid response polling for offer');
          return false;
        }

        if (response.ok) {
          const data = await response.json();
          if (data.desc) {
            // SUCCESS: We got the offer
            const pc = createPeerConnection();
            peerConnectionRef.current = pc;

            setLifecycleStatus(VIEWER_CONNECTION_STATUS.ANSWERING);
            updatePeerConnection(HOST_PEER_KEY, {
              status: VIEWER_PEER_STATUS.ANSWERING,
            });

            await pc.setRemoteDescription(data.desc);
            const answer = await pc.createAnswer();
            await pc.setLocalDescription(answer);
            await sendAnswer(answer);

            startCandidatePolling(); // Start polling for candidates now
            return true; // Signal to the poller to stop
          }
        }
        // If response is 404 or not OK, we continue polling
        return false; // Signal to the poller to continue
      } catch (err) {
        logger.error('Network error while polling for offer:', err);
        return false; // Signal to continue polling even on network errors
      }
    };

    // Create and run the poller
    const polling = createExponentialBackoffPolling(pollFn, {
      maxPolls: 15, // ~60 seconds total timeout with backoff
    });

    try {
      await polling();
    } catch (err) {
      // This block runs only if the polling times out completely
      logger.error('Offer polling timed out.', err);
      if (isMountedRef.current) {
        setGranularError(
          'timeout',
          'OFFER_POLLING_TIMEOUT',
          'Connection timeout: No offer received from host. Make sure the host has started sharing.',
          err.message
        );
        setConnectionState('failed');
        setLifecycleStatus(VIEWER_CONNECTION_STATUS.ERROR);
        updatePeerConnection(HOST_PEER_KEY, { status: VIEWER_PEER_STATUS.FAILED });
      }
    }
  }, [roomId, sendAnswer, createPeerConnection, startCandidatePolling, setGranularError, updatePeerConnection]);

  // Start polling for answers (host)
  const startAnswerPolling = useCallback(async () => {
    // Clear any existing interval
    if (answerIntervalRef.current) {
      clearInterval(answerIntervalRef.current);
      answerIntervalRef.current = null;
    }

    const pollFn = async () => {
      try {
        const response = await fetch(`/api/answer?roomId=${roomId}`);
        if (!response || typeof response.ok !== 'boolean') {
          logger.error('Invalid response polling for answer');
          return false;
        }

        if (response.ok) {
          const data = await response.json();
          if (data.desc) {
            // SUCCESS: We got the answer
            const pc = peerConnectionRef.current;
            if (pc) {
              await pc.setRemoteDescription(data.desc);
            }
            updatePeerConnection(PRIMARY_VIEWER_KEY, {
              status: VIEWER_PEER_STATUS.ANSWER_RECEIVED,
            });
            setLifecycleStatus(HOST_CONNECTION_STATUS.ANSWER_RECEIVED);
            return true; // Stop polling
          }
        }
        return false; // Continue polling
      } catch (err) {
        logger.error('Network error while polling for answer:', err);
        return false; // Continue polling
      }
    };

    const polling = createExponentialBackoffPolling(pollFn, {
      maxPolls: 15,
    });

    try {
      await polling();
    } catch (err) {
      // Answer timeout is expected if no viewer connects - don't show as error
      logger.warn('Answer polling timed out - no viewer connected yet', err);
      // Don't set error state or change connection state
      // The host can continue sharing and wait for viewers
    }
  }, [roomId, updatePeerConnection]);

  // Fixed: Added _viewerId to dependency array

  // Start screen sharing (host)
  const startScreenShare = useCallback(async () => {
    if (role !== 'host') {
      throw new Error('Only hosts can start screen sharing');
    }

    try {
      setError(null);
      setConnectionState('connecting');
      setLifecycleStatus(HOST_CONNECTION_STATUS.REGISTERING);

      // Register sender and get secret for authentication
      const secret = await registerSender();
      if (!secret) {
        logger.warn('Host sender registration did not return a secret');
      }

      setLifecycleStatus(HOST_CONNECTION_STATUS.ACQUIRING_MEDIA);

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

      // Track viewer placeholder until answer arrives
      updatePeerConnection(PRIMARY_VIEWER_KEY, {
        label: 'Viewer 1',
        status: VIEWER_PEER_STATUS.WAITING_FOR_ANSWER,
      });

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
      setLifecycleStatus(HOST_CONNECTION_STATUS.WAITING_FOR_VIEWER);

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
      setLifecycleStatus(HOST_CONNECTION_STATUS.ERROR);
      updatePeerConnection(PRIMARY_VIEWER_KEY, { status: VIEWER_PEER_STATUS.FAILED });

      // Cleanup any resources that were created
      if (localStreamRef.current) {
        localStreamRef.current.getTracks().forEach((track) => track.stop());
        localStreamRef.current = null;
        setLocalStream(null);
      }

      if (peerConnectionRef.current) {
        try {
          const pc = peerConnectionRef.current;
          pc.__listenerCleanup?.();
          pc.close();
          peerConnectionRef.current = null;
        } catch (cleanupErr) {
          logger.error('Error during peer connection cleanup:', cleanupErr);
        }
      }

      // Set granular error based on error type
      if (err.name === 'NotAllowedError' || err.message.includes('Permission denied')) {
        setGranularError(
          'permission',
          'PERMISSION_DENIED',
          'Screen sharing permission was denied. Please allow permission and try again.',
          err.message
        );
      } else if (err.name === 'NotFoundError') {
        setGranularError(
          'permission',
          'NO_DISPLAY_AVAILABLE',
          'No display available for screen sharing. Please ensure you have a screen to share.',
          err.message
        );
      } else if (err.name === 'AbortError') {
        setGranularError(
          'permission',
          'SHARING_CANCELLED',
          'Screen sharing was cancelled. Please try again.',
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
  }, [
    role,
    createPeerConnection,
    sendOffer,
    startAnswerPolling,
    startCandidatePolling,
    setGranularError,
    localStreamRef,
    registerSender,
    updatePeerConnection,
  ]);

  // Connect to host (viewer)
  const connectToHost = useCallback(async () => {
    if (role !== 'viewer') {
      throw new Error('Only viewers can connect to host');
    }

    try {
      setError(null);
      setConnectionState('connecting');
      setLifecycleStatus(VIEWER_CONNECTION_STATUS.REGISTERING);

      // Register sender and get secret for authentication
      const secret = await registerSender();
      if (!secret) {
        logger.warn('Viewer sender registration did not return a secret');
      }

      setLifecycleStatus(VIEWER_CONNECTION_STATUS.WAITING_FOR_OFFER);
      updatePeerConnection(HOST_PEER_KEY, {
        label: 'Host',
        status: VIEWER_PEER_STATUS.WAITING_FOR_OFFER,
      });

      // Don't create peer connection yet - wait for offer from host
      // Start polling for offers (ICE candidate polling will start when peer connection is created)
      startOfferPolling();
    } catch (err) {
      logger.error('Error connecting to host:', err);
      setConnectionState('failed');
      setLifecycleStatus(VIEWER_CONNECTION_STATUS.ERROR);
      updatePeerConnection(HOST_PEER_KEY, { status: VIEWER_PEER_STATUS.FAILED });

      // Cleanup any resources that were created
      if (peerConnectionRef.current) {
        try {
          const pc = peerConnectionRef.current;
          pc.__listenerCleanup?.();
          pc.close();
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
  }, [role, startOfferPolling, setGranularError, registerSender]);

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
          const pc = peerConnectionRef.current;
          pc.__listenerCleanup?.();
          pc.close();
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
      if (role === 'host') {
        removePeerConnection(PRIMARY_VIEWER_KEY);
        setLifecycleStatus(HOST_CONNECTION_STATUS.DISCONNECTED);
      } else {
        removePeerConnection(HOST_PEER_KEY);
        setLifecycleStatus(VIEWER_CONNECTION_STATUS.DISCONNECTED);
      }
    } catch (err) {
      logger.error('Error stopping screen share:', err);
      setError(`Failed to stop screen sharing: ${err.message}`);
      setLifecycleStatus(role === 'host' ? HOST_CONNECTION_STATUS.ERROR : VIEWER_CONNECTION_STATUS.ERROR);
    }
  }, [localStream, remoteStream, role, removePeerConnection]);

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
          const pc = peerConnectionRef.current;
          pc.__listenerCleanup?.();
          pc.close();
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
    connectionLifecycleStatus: lifecycleStatus,
    hasTurnServer,

    // Actions
    startScreenShare,
    stopScreenShare,
    connectToHost,
    disconnect,
  };
}
