import { useState, useEffect, useRef, useCallback } from 'react';
import Pusher from 'pusher-js';
import { getIceServers } from '../config/turn.js';

// Simple WebRTC hook using Pusher for signaling
export function useSimpleWebRTC(roomId, role) {
  const [connectionState, setConnectionState] = useState('idle');
  const [remoteStream, setRemoteStream] = useState(null);
  const [localStream, setLocalStream] = useState(null);
  const [error, setError] = useState(null);

  const peerConnectionRef = useRef(null);
  const pusherRef = useRef(null);
  const channelRef = useRef(null);
  const localStreamRef = useRef(null);
  const bufferedIceCandidates = useRef([]);
  const isMountedRef = useRef(true);

  // Handler declarations to avoid "accessed before declaration"
  let createAndSendOffer, handleOffer, handleAnswer;

  // Initialize Pusher
  useEffect(() => {
    if (!roomId || !pusherRef.current) {
      const pusherKey = import.meta.env.VITE_PUSHER_KEY;
      const pusherCluster = import.meta.env.VITE_PUSHER_CLUSTER || 'us-east-1';

      pusherRef.current = new Pusher(pusherKey, {
        cluster: pusherCluster,
        authEndpoint: '/api/pusher-auth',
        forceTLS: true
      });
    }

    return () => {
      if (pusherRef.current) {
        pusherRef.current.disconnect();
        pusherRef.current = null;
      }
    };
  }, [roomId]);

  // Create peer connection
  const createPeerConnection = useCallback(() => {
    const pc = new RTCPeerConnection({
      iceServers: getIceServers(true)
    });

    // Handle ICE candidates
    pc.onicecandidate = (event) => {
      if (event.candidate && channelRef.current) {
        channelRef.current.trigger('client-ice', {
          candidate: event.candidate
        });
        console.log('ICE sent');
      }
    };

    // Handle connection state changes
    pc.onconnectionstatechange = () => {
      const state = pc.connectionState;
      setConnectionState(state);
      if (state === 'connected') {
        console.log('Connected');
      }
    };

    // Handle remote stream
    pc.ontrack = (event) => {
      console.log('Remote stream received');
      setRemoteStream(event.streams[0]);
    };

    // Set buffered ICE candidates when remote description is set
    const originalSetRemoteDescription = pc.setRemoteDescription.bind(pc);
    pc.setRemoteDescription = async (description) => {
      await originalSetRemoteDescription(description);
      console.log('Remote description set, flushing ICE candidates');

      // Add any buffered ICE candidates
      while (bufferedIceCandidates.current.length > 0) {
        const candidate = bufferedIceCandidates.current.shift();
        try {
          await pc.addIceCandidate(candidate);
          console.log('ICE added from buffer');
        } catch (err) {
          console.error('Error adding buffered ICE candidate:', err);
        }
      }
    };

    return pc;
  }, []);

  // Define handlers
  createAndSendOffer = useCallback(async () => {
    if (!peerConnectionRef.current || !channelRef.current) return;

    try {
      const offer = await peerConnectionRef.current.createOffer();
      await peerConnectionRef.current.setLocalDescription(offer);

      channelRef.current.trigger('client-offer', {
        offer: offer
      });
      console.log('Offer sent');
    } catch (err) {
      console.error('Error creating offer:', err);
      setError('Failed to create offer');
    }
  }, []);

  handleOffer = useCallback(async (offer) => {
    if (!peerConnectionRef.current) {
      peerConnectionRef.current = createPeerConnection();
    }

    try {
      await peerConnectionRef.current.setRemoteDescription(offer);
      const answer = await peerConnectionRef.current.createAnswer();
      await peerConnectionRef.current.setLocalDescription(answer);

      if (channelRef.current) {
        channelRef.current.trigger('client-answer', {
          answer: answer
        });
        console.log('Answer sent');
      }
    } catch (err) {
      console.error('Error handling offer:', err);
      setError('Failed to handle offer');
    }
  }, [createPeerConnection]);

  handleAnswer = useCallback(async (answer) => {
    if (!peerConnectionRef.current) return;

    try {
      await peerConnectionRef.current.setRemoteDescription(answer);
      console.log('Answer received');
    } catch (err) {
      console.error('Error handling answer:', err);
      setError('Failed to handle answer');
    }
  }, []);

  reset = useCallback(() => {
    console.log('Reset triggered');
    // Stop local stream
    if (localStreamRef.current) {
      localStreamRef.current.getTracks().forEach(track => track.stop());
      localStreamRef.current = null;
    }
    setLocalStream(null);
    setRemoteStream(null);
    setError(null);
    setConnectionState('idle');
    bufferedIceCandidates.current = [];

    // Close peer connection
    if (peerConnectionRef.current) {
      peerConnectionRef.current.close();
      peerConnectionRef.current = null;
    }

    // Unsubscribe from channel
    if (channelRef.current) {
      channelRef.current.unbind_all();
      pusherRef.current.unsubscribe(`presence-screenshare-${roomId}`);
      channelRef.current = null;
    }
  }, [roomId]);

  // Subscribe to room channel
  const subscribeToChannel = useCallback(() => {
    if (!pusherRef.current || !roomId) return;

    const channelName = `presence-screenshare-${roomId}`;
    channelRef.current = pusherRef.current.subscribe(channelName);

    channelRef.current.bind('pusher:subscription_succeeded', () => {
      console.log('Pusher subscribed');
      console.log('Channel:', channelName);
    });

    channelRef.current.bind('pusher:subscription_error', (err) => {
      console.error('Failed to subscribe to Pusher channel:', err);
      setError('Failed to connect to signaling server');
    });

    // Client events for signaling
    channelRef.current.bind('client-viewer-ready', () => {
      console.log('Viewer ready received');
      if (role === 'host' && peerConnectionRef.current) {
        // Host creates offer when viewer is ready
        createAndSendOffer();
      }
    });

    channelRef.current.bind('client-offer', async (data) => {
      console.log('Offer received');
      if (role === 'viewer') {
        await handleOffer(data.offer);
      }
    });

    channelRef.current.bind('client-answer', async (data) => {
      console.log('Answer received');
      if (role === 'host') {
        await handleAnswer(data.answer);
      }
    });

    channelRef.current.bind('client-ice', async (data) => {
      console.log('ICE received');
      if (peerConnectionRef.current) {
        try {
          if (peerConnectionRef.current.remoteDescription) {
            await peerConnectionRef.current.addIceCandidate(data.candidate);
          } else {
            // Buffer ICE candidates until remote description is set
            bufferedIceCandidates.current.push(data.candidate);
          }
        } catch (err) {
          console.error('Error adding ICE candidate:', err);
        }
      }
    });

    channelRef.current.bind('client-reset', () => {
      console.log('Reset event received');
      reset();
    });
  }, [roomId, role, createAndSendOffer, handleOffer, handleAnswer, reset]);

  // Start screen sharing (host)
  const startScreenShare = useCallback(async () => {
    if (role !== 'host') return;

    try {
      setError(null);
      setConnectionState('connecting');

      // Subscribe to channel
      subscribeToChannel();

      // Get screen share stream (video only)
      const stream = await navigator.mediaDevices.getDisplayMedia({
        video: true,
        audio: false
      });

      setLocalStream(stream);
      localStreamRef.current = stream;

      // Create peer connection
      peerConnectionRef.current = createPeerConnection();

      // Add tracks to peer connection
      stream.getTracks().forEach(track => {
        peerConnectionRef.current.addTrack(track, stream);
      });
    } catch (err) {
      console.error('Error starting screen share:', err);
      setError(err.message || 'Failed to start screen sharing');
      setConnectionState('failed');
    }
  }, [role, createPeerConnection, subscribeToChannel]);

  // Connect to host (viewer)
  const connectToHost = useCallback(async () => {
    if (role !== 'viewer') return;

    try {
      setError(null);
      setConnectionState('connecting');

      // Subscribe to channel
      subscribeToChannel();

      // Signal that viewer is ready
      if (channelRef.current) {
        channelRef.current.trigger('client-viewer-ready', {
          timestamp: Date.now()
        });
      }

      // Create peer connection in advance
      peerConnectionRef.current = createPeerConnection();
    } catch (err) {
      console.error('Error connecting to host:', err);
      setError(err.message || 'Failed to connect to host');
      setConnectionState('failed');
    }
  }, [role, createPeerConnection, subscribeToChannel]);

  // Disconnect
  const disconnect = useCallback(async () => {
    // Send reset signal to other party
    if (channelRef.current) {
      channelRef.current.trigger('client-reset', {});
    }
    reset();
  }, [reset]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      isMountedRef.current = false;
      reset();
    };
  }, [reset]);

  return {
    connectionState,
    remoteStream,
    localStream,
    error,
    startScreenShare,
    connectToHost,
    disconnect,
    reset
  };
}