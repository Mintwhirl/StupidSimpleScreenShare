import { useState, useEffect, useRef, useCallback } from 'react';
import Pusher from 'pusher-js';
import { getIceServers } from '../config/turn.js';

// Single shared channel for all users
const CHANNEL_NAME = 'presence-screenshare';

// Simple WebRTC hook using Pusher for signaling
export function useSimpleWebRTC(role) {
  const [connectionState, setConnectionState] = useState('idle');
  const [remoteStream, setRemoteStream] = useState(null);
  const [localStream, setLocalStream] = useState(null);
  const [error, setError] = useState(null);
  const [signalingState, setSignalingState] = useState('disconnected');

  const peerConnectionRef = useRef(null);
  const pusherRef = useRef(null);
  const channelRef = useRef(null);
  const localStreamRef = useRef(null);
  const bufferedIceCandidates = useRef([]);
  const isMountedRef = useRef(true);

  // Initialize Pusher
  useEffect(() => {
    if (!pusherRef.current) {
      const pusherKey = import.meta.env.VITE_PUSHER_KEY;
      const pusherCluster = import.meta.env.VITE_PUSHER_CLUSTER;

      if (!pusherKey || !pusherCluster) {
        console.error('Missing Pusher configuration');
        setSignalingState('error');
        setError('Missing signaling server configuration');
        return;
      }

      console.log('Pusher config:', {
        key: pusherKey ? 'present' : 'missing',
        cluster: pusherCluster,
        authEndpoint: '/api/pusher-auth',
      });

      pusherRef.current = new Pusher(pusherKey, {
        cluster: pusherCluster,
        authEndpoint: '/api/pusher-auth',
        forceTLS: true,
        authTransport: 'ajax',
      });

      // Monitor Pusher connection state
      pusherRef.current.connection.bind('connected', () => {
        console.log('Pusher connected');
        setSignalingState('connected');
      });

      pusherRef.current.connection.bind('disconnected', () => {
        console.log('Pusher disconnected');
        setSignalingState('disconnected');
      });

      pusherRef.current.connection.bind('error', (err) => {
        console.error('Pusher connection error:', err);
        setSignalingState('error');
        setError('Signaling connection failed');
      });
    }

    return () => {
      if (pusherRef.current) {
        pusherRef.current.disconnect();
        pusherRef.current = null;
      }
    };
  }, []);

  // Create peer connection
  const createPeerConnection = useCallback(() => {
    const pc = new RTCPeerConnection({
      iceServers: getIceServers(true),
    });

    // Handle ICE candidates
    pc.onicecandidate = (event) => {
      if (event.candidate && channelRef.current) {
        channelRef.current.trigger('client-ice', {
          candidate: event.candidate,
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
  const createAndSendOffer = useCallback(async () => {
    if (!peerConnectionRef.current || !channelRef.current) return;

    try {
      const offer = await peerConnectionRef.current.createOffer();
      await peerConnectionRef.current.setLocalDescription(offer);

      channelRef.current.trigger('client-offer', {
        offer: offer,
      });
      console.log('Offer sent');
    } catch (err) {
      console.error('Error creating offer:', err);
      setError('Failed to create offer');
    }
  }, []);

  const handleOffer = useCallback(
    async (offer) => {
      if (!peerConnectionRef.current) {
        peerConnectionRef.current = createPeerConnection();
      }

      try {
        await peerConnectionRef.current.setRemoteDescription(offer);
        const answer = await peerConnectionRef.current.createAnswer();
        await peerConnectionRef.current.setLocalDescription(answer);

        if (channelRef.current) {
          channelRef.current.trigger('client-answer', {
            answer: answer,
          });
          console.log('Answer sent');
        }
      } catch (err) {
        console.error('Error handling offer:', err);
        setError('Failed to handle offer');
      }
    },
    [createPeerConnection]
  );

  const handleAnswer = useCallback(async (answer) => {
    if (!peerConnectionRef.current) return;

    try {
      await peerConnectionRef.current.setRemoteDescription(answer);
      console.log('Answer received');
    } catch (err) {
      console.error('Error handling answer:', err);
      setError('Failed to handle answer');
    }
  }, []);

  const reset = useCallback(() => {
    console.log('Reset triggered');
    // Stop local stream
    if (localStreamRef.current) {
      localStreamRef.current.getTracks().forEach((track) => track.stop());
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
      pusherRef.current.unsubscribe(CHANNEL_NAME);
      channelRef.current = null;
    }
  }, []);

  // Subscribe to channel
  const subscribeToChannel = useCallback(() => {
    if (!pusherRef.current || channelRef.current) return;

    console.log('Subscribing to channel:', CHANNEL_NAME);
    console.log('Auth endpoint:', '/api/pusher-auth');

    channelRef.current = pusherRef.current.subscribe(CHANNEL_NAME);

    channelRef.current.bind('pusher:subscription_succeeded', () => {
      console.log('Pusher subscribed');
      console.log('Channel:', CHANNEL_NAME);
    });

    channelRef.current.bind('pusher:subscription_error', (err) => {
      console.error('Pusher subscribe error details:');
      console.error('Error object:', JSON.stringify(err, null, 2));
      console.error('Error type:', typeof err);
      console.error('Error keys:', Object.keys(err || {}));
      console.error('Channel name:', CHANNEL_NAME);
      console.error('Auth endpoint:', '/api/pusher-auth');

      let errorMessage = 'Failed to connect to signaling server';
      if (err && err.error) {
        errorMessage = `Signaling error: ${err.error}`;
      } else if (err && typeof err === 'string') {
        errorMessage = `Signaling error: ${err}`;
      }

      setSignalingState('error');
      setError(errorMessage);
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
  }, [role, createAndSendOffer, handleOffer, handleAnswer, reset]);

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
        audio: false,
      });

      setLocalStream(stream);
      localStreamRef.current = stream;

      // Create peer connection
      peerConnectionRef.current = createPeerConnection();

      // Add tracks to peer connection
      stream.getTracks().forEach((track) => {
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
          timestamp: Date.now(),
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
    signalingState,
    startScreenShare,
    connectToHost,
    disconnect,
    reset,
  };
}
