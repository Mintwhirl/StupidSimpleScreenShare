import { useState, useEffect, useRef, useCallback } from 'react';
import { getIceServers } from '../config/turn.js';

export function useWebRTC(roomId, role, config, _viewerId = null) {
  // State
  const [connectionState, setConnectionState] = useState('disconnected');
  const [remoteStream, setRemoteStream] = useState(null);
  const [localStream, setLocalStream] = useState(null);
  const [error, setError] = useState(null);
  const [_peerConnections, _setPeerConnections] = useState({});
  const [iceServers, setIceServers] = useState([]);

  // Refs
  const peerConnectionRef = useRef(null);
  const dataChannelRef = useRef(null);
  const answerIntervalRef = useRef(null);
  const candidateIntervalRef = useRef(null);

  // Initialize ICE servers
  useEffect(() => {
    // Use TURN server configuration by default for better connectivity
    const servers = getIceServers(config?.useTurn !== false); // Default to true unless explicitly disabled
    setIceServers(servers);
  }, [config]);

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
            candidate: {
              candidate: candidate.candidate,
              sdpMid: candidate.sdpMid,
              sdpMLineIndex: candidate.sdpMLineIndex,
            },
          }),
        });

        if (!response.ok) {
          throw new Error(`Failed to send ICE candidate: ${response.status}`);
        }
      } catch (err) {
        console.error('Error sending ICE candidate:', err);
        setError(`Failed to send ICE candidate: ${err.message}`);
      }
    },
    [roomId, role, config]
  );

  // Create peer connection
  const createPeerConnection = useCallback(() => {
    const pc = new RTCPeerConnection({
      iceServers,
    });

    // Handle ICE candidates
    pc.onicecandidate = (event) => {
      if (event.candidate) {
        sendICECandidate(event.candidate);
      }
    };

    // Handle connection state changes
    pc.onconnectionstatechange = () => {
      console.log('Connection state changed:', pc.connectionState);
      setConnectionState(pc.connectionState);
    };

    // Handle ICE connection state changes
    pc.oniceconnectionstatechange = () => {
      console.log('ICE connection state changed:', pc.iceConnectionState);
    };

    // Handle remote stream
    pc.ontrack = (event) => {
      console.log('Received remote stream:', event.streams[0]);
      setRemoteStream(event.streams[0]);
    };

    // Handle data channel
    pc.ondatachannel = (event) => {
      const channel = event.channel;
      dataChannelRef.current = channel;

      channel.onopen = () => {
        console.log('Data channel opened');
      };

      channel.onmessage = (event) => {
        console.log('Received data channel message:', event.data);
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
        console.error('Error sending offer:', err);
        setError(`Failed to send offer: ${err.message}`);
      }
    },
    [roomId, config]
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
        console.error('Error sending answer:', err);
        setError(`Failed to send answer: ${err.message}`);
      }
    },
    [roomId, config]
  );

  // Start polling for offers (viewer)
  const startOfferPolling = useCallback(async () => {
    if (answerIntervalRef.current) {
      clearInterval(answerIntervalRef.current);
    }

    let pollCount = 0;
    let pollInterval = 1000; // Start with 1 second

    const pollForOffer = async () => {
      try {
        const response = await fetch(`/api/offer?roomId=${roomId}`);

        if (response.ok) {
          const data = await response.json();
          if (data.desc) {
            // Clear interval once we get an offer
            clearInterval(answerIntervalRef.current);
            answerIntervalRef.current = null;

            // Handle the offer
            const pc = peerConnectionRef.current;
            if (pc) {
              await pc.setRemoteDescription(data.desc);

              // Create and send answer
              const answer = await pc.createAnswer();
              await pc.setLocalDescription(answer);
              await sendAnswer(answer);
            }
          }
        } else if (response.status === 404) {
          // Expected 404 - no offer yet, but reduce polling frequency after initial attempts
          pollCount++;
          if (pollCount > 10) {
            // After 10 seconds, reduce to polling every 5 seconds
            clearInterval(answerIntervalRef.current);
            pollInterval = 5000;
            answerIntervalRef.current = setInterval(pollForOffer, pollInterval);
          }
        } else {
          // Unexpected error
          console.error('Unexpected error polling for offers:', response.status);
        }
      } catch (err) {
        console.error('Error polling for offers:', err);
      }
    };

    answerIntervalRef.current = setInterval(pollForOffer, pollInterval);
  }, [roomId, sendAnswer]);

  // Start polling for answers (host)
  const startAnswerPolling = useCallback(async () => {
    if (answerIntervalRef.current) {
      clearInterval(answerIntervalRef.current);
    }

    let pollCount = 0;
    let pollInterval = 1000; // Start with 1 second

    const pollForAnswer = async () => {
      try {
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
          pollCount++;
          if (pollCount > 10) {
            // After 10 seconds, reduce to polling every 5 seconds
            clearInterval(answerIntervalRef.current);
            pollInterval = 5000;
            answerIntervalRef.current = setInterval(pollForAnswer, pollInterval);
          }
        } else {
          // Unexpected error
          console.error('Unexpected error polling for answers:', response.status);
        }
      } catch (err) {
        console.error('Error polling for answers:', err);
      }
    };

    answerIntervalRef.current = setInterval(pollForAnswer, pollInterval);
  }, [roomId]);

  // Start polling for ICE candidates
  const startCandidatePolling = useCallback(async () => {
    if (candidateIntervalRef.current) {
      clearInterval(candidateIntervalRef.current);
    }

    candidateIntervalRef.current = setInterval(async () => {
      try {
        const response = await fetch(`/api/candidate?roomId=${roomId}&role=${role}`);

        if (response.ok) {
          const data = await response.json();
          if (data.candidates && data.candidates.length > 0) {
            const pc = peerConnectionRef.current;
            if (pc) {
              for (const candidate of data.candidates) {
                await pc.addIceCandidate(candidate);
              }
            }
          }
        }
      } catch (err) {
        console.error('Error polling for ICE candidates:', err);
      }
    }, 1000);
  }, [roomId, role]);

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

      setLocalStream(stream);

      // Create peer connection
      const pc = createPeerConnection();
      peerConnectionRef.current = pc;

      // Add stream to peer connection
      stream.getTracks().forEach((track) => {
        pc.addTrack(track, stream);
      });

      // Create and send offer
      const offer = await pc.createOffer({
        offerToReceiveAudio: true,
        offerToReceiveVideo: true,
      });

      await pc.setLocalDescription(offer);
      await sendOffer(offer);

      // Start polling for answers
      startAnswerPolling();

      return stream;
    } catch (err) {
      console.error('Error starting screen share:', err);
      setError(`Failed to start screen sharing: ${err.message}`);
      setConnectionState('disconnected');
      throw err;
    }
  }, [role, createPeerConnection, sendOffer, startAnswerPolling]);

  // Connect to host (viewer)
  const connectToHost = useCallback(async () => {
    if (role !== 'viewer') {
      throw new Error('Only viewers can connect to host');
    }

    try {
      setError(null);
      setConnectionState('connecting');

      // Create peer connection
      const pc = createPeerConnection();
      peerConnectionRef.current = pc;

      // Start polling for offers
      startOfferPolling();

      // Start polling for ICE candidates
      startCandidatePolling();
    } catch (err) {
      console.error('Error connecting to host:', err);
      setError(`Failed to connect to host: ${err.message}`);
      setConnectionState('disconnected');
      throw err;
    }
  }, [role, createPeerConnection, startCandidatePolling, startOfferPolling]);

  // Stop screen sharing
  const stopScreenShare = useCallback(async () => {
    try {
      // Stop local stream
      if (localStream) {
        localStream.getTracks().forEach((track) => track.stop());
        setLocalStream(null);
      }

      // Close peer connection
      if (peerConnectionRef.current) {
        peerConnectionRef.current.close();
        peerConnectionRef.current = null;
      }

      // Clear intervals
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
    } catch (err) {
      console.error('Error stopping screen share:', err);
      setError(`Failed to stop screen sharing: ${err.message}`);
    }
  }, [localStream]);

  // Disconnect
  const disconnect = useCallback(async () => {
    await stopScreenShare();
  }, [stopScreenShare]);

  // Start polling for offers (viewer)

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (answerIntervalRef.current) {
        clearInterval(answerIntervalRef.current);
      }
      if (candidateIntervalRef.current) {
        clearInterval(candidateIntervalRef.current);
      }
      if (peerConnectionRef.current) {
        peerConnectionRef.current.close();
      }
      if (localStream) {
        localStream.getTracks().forEach((track) => track.stop());
      }
    };
  }, [localStream]);

  return {
    // State
    connectionState,
    remoteStream,
    localStream,
    error,
    peerConnections: _peerConnections,

    // Actions
    startScreenShare,
    stopScreenShare,
    connectToHost,
    disconnect,
  };
}
