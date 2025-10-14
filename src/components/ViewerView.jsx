import { useState, useEffect, useRef, useCallback } from 'react';
import VideoPlayer from './VideoPlayer';
import { useWebRTC } from '../hooks/useWebRTC';

function ViewerView({ roomId, viewerId, setViewerId, config, onGoHome }) {
  const [error, setError] = useState(null);
  const [isConnecting, setIsConnecting] = useState(false);
  const [hostStatus, setHostStatus] = useState('unknown');

  const remoteVideoRef = useRef(null);
  const {
    connectToHost,
    disconnect,
    connectionState,
    remoteStream,
    error: webrtcError,
  } = useWebRTC(roomId, 'viewer', config, viewerId);

  // Derive connection status from WebRTC state
  const connectionStatus = connectionState;
  const isConnected = connectionState === 'connected';

  // Handle remote stream
  useEffect(() => {
    if (remoteStream && remoteVideoRef.current) {
      remoteVideoRef.current.srcObject = remoteStream;
    }
  }, [remoteStream]);

  // Handle WebRTC errors and clear errors on success
  useEffect(() => {
    if (webrtcError) {
      setError(webrtcError);
      setIsConnecting(false);
      setHostStatus('disconnected');
    } else if (connectionState === 'connected') {
      // Clear errors when connection succeeds
      setError(null);
      setIsConnecting(false);
      setHostStatus('connected');
    } else if (connectionState === 'connecting') {
      setHostStatus('connecting');
    } else if (connectionState === 'disconnected' || connectionState === 'failed') {
      setHostStatus('disconnected');
    }
  }, [webrtcError, connectionState]);

  // Validate room exists
  const validateRoom = useCallback(async (roomId) => {
    try {
      const response = await fetch(`/api/diagnostics?roomId=${roomId}`);
      if (response.ok) {
        const data = await response.json();
        return data.room?.exists === true;
      }
      return false;
    } catch (err) {
      console.error('Error validating room:', err);
      return false;
    }
  }, []);

  // Handle connection to host
  const handleConnect = useCallback(async () => {
    if (!roomId.trim()) {
      setError('Please enter a room ID');
      return;
    }

    try {
      setError(null);
      setIsConnecting(true);
      setHostStatus('connecting');

      // Validate room exists first
      const roomExists = await validateRoom(roomId);
      if (!roomExists) {
        setError('Room not found. Please check the room ID and make sure the host has started sharing.');
        setHostStatus('disconnected');
        return;
      }

      await connectToHost();

      // Register sender ID for chat if viewerId is provided
      if (viewerId && viewerId.trim()) {
        try {
          await fetch('/api/register-sender', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ roomId, senderId: viewerId.trim() }),
          });
        } catch (err) {
          console.warn('Failed to register sender ID:', err);
        }
      }

      // Don't set hostStatus to 'connected' here - let the WebRTC connection state handle it
    } catch (err) {
      console.error('Error connecting to host:', err);
      setError('Failed to connect to host. Please check the room ID and try again.');
      setHostStatus('disconnected');
    } finally {
      setIsConnecting(false);
    }
  }, [roomId, connectToHost, validateRoom, viewerId]);

  // Removed auto-connect logic - user must manually click "Connect to Host"

  // Handle disconnection
  const handleDisconnect = async () => {
    try {
      await disconnect();
      setHostStatus('disconnected');
      if (remoteVideoRef.current) {
        remoteVideoRef.current.srcObject = null;
      }
    } catch (err) {
      console.error('Error disconnecting:', err);
    }
  };

  // Handle reconnection
  const handleReconnect = () => {
    handleDisconnect().then(() => {
      setTimeout(handleConnect, 1000);
    });
  };

  // Generate viewer ID if not provided
  const generateViewerId = () => {
    const id = `viewer_${Math.random().toString(36).substring(2, 8)}`;
    setViewerId(id);
    return id;
  };

  // Get connection status color
  const getStatusColor = () => {
    switch (connectionStatus) {
      case 'connected':
        return 'text-green-600';
      case 'connecting':
        return 'text-yellow-600';
      case 'disconnected':
        return 'text-red-600';
      default:
        return 'text-gray-600';
    }
  };

  // Get connection status text
  const getStatusText = () => {
    switch (connectionStatus) {
      case 'connected':
        return 'Connected';
      case 'connecting':
        return 'Connecting...';
      case 'disconnected':
        return 'Disconnected';
      default:
        return 'Unknown';
    }
  };

  // Get host status color
  const getHostStatusColor = () => {
    switch (hostStatus) {
      case 'connected':
        return 'text-green-600';
      case 'connecting':
        return 'text-yellow-600';
      case 'disconnected':
        return 'text-red-600';
      default:
        return 'text-gray-600';
    }
  };

  // Get host status text
  const getHostStatusText = () => {
    switch (hostStatus) {
      case 'connected':
        return 'Host Online';
      case 'connecting':
        return 'Connecting to Host...';
      case 'disconnected':
        return 'Host Offline';
      default:
        return 'Unknown';
    }
  };

  return (
    <div className='space-y-6'>
      {/* Header */}
      <div className='bg-white rounded-lg shadow-md p-6'>
        <div className='flex items-center justify-between'>
          <div>
            <h2 className='text-2xl font-bold text-gray-900 mb-2'>👀 Viewing Room</h2>
            <p className='text-gray-600'>
              Connected to room: <span className='font-mono font-medium'>{roomId}</span>
            </p>
          </div>
          <div className='text-right'>
            <div className={`text-sm font-medium ${getStatusColor()}`}>Connection: {getStatusText()}</div>
            <div className={`text-sm font-medium ${getHostStatusColor()}`}>{getHostStatusText()}</div>
          </div>
        </div>
      </div>

      {/* Viewer ID Section */}
      <div className='bg-white rounded-lg shadow-md p-6'>
        <h3 className='text-lg font-semibold text-gray-900 mb-4'>Your Viewer ID</h3>
        <div className='flex items-center space-x-4'>
          <div className='flex-1'>
            <input
              type='text'
              value={viewerId || ''}
              onChange={(e) => setViewerId(e.target.value)}
              placeholder='Enter your name or leave blank for auto-generated ID'
              className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500'
            />
          </div>
          <button
            onClick={generateViewerId}
            className='px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors'
          >
            Generate ID
          </button>
        </div>
        <p className='text-sm text-gray-500 mt-2'>This ID helps identify you in the chat and diagnostics.</p>
      </div>

      {/* Connection Controls */}
      <div className='bg-white rounded-lg shadow-md p-6'>
        <h3 className='text-lg font-semibold text-gray-900 mb-4'>Connection Controls</h3>
        <div className='flex items-center justify-center space-x-4'>
          {!isConnected ? (
            <button
              onClick={handleConnect}
              disabled={isConnecting}
              className={`px-6 py-3 rounded-lg font-medium transition-colors ${
                isConnecting
                  ? 'bg-gray-400 text-white cursor-not-allowed'
                  : 'bg-green-600 text-white hover:bg-green-700'
              }`}
            >
              {isConnecting ? 'Connecting...' : 'Connect to Host'}
            </button>
          ) : (
            <div className='flex items-center space-x-4'>
              <button
                onClick={handleReconnect}
                className='px-6 py-3 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition-colors'
              >
                Reconnect
              </button>
              <button
                onClick={handleDisconnect}
                className='px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors'
              >
                Disconnect
              </button>
            </div>
          )}
        </div>

        {isConnected && (
          <div className='mt-4 text-center'>
            <div className='flex items-center justify-center space-x-2 text-green-600'>
              <div className='w-2 h-2 bg-green-600 rounded-full animate-pulse'></div>
              <span className='text-sm font-medium'>Connected to Host</span>
            </div>
          </div>
        )}
      </div>

      {/* Error Display */}
      {error && (
        <div className='bg-red-50 border border-red-200 rounded-lg p-4'>
          <div className='flex items-center'>
            <div className='text-red-600 mr-2'>⚠️</div>
            <div>
              <h4 className='text-red-800 font-medium'>Connection Error</h4>
              <p className='text-red-700 text-sm mt-1'>{error}</p>
            </div>
          </div>
          <div className='mt-3'>
            <button
              onClick={handleReconnect}
              className='text-sm bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700 transition-colors'
            >
              Try Again
            </button>
          </div>
        </div>
      )}

      {/* Remote Video Display */}
      {isConnected && (
        <div className='bg-white rounded-lg shadow-md p-6'>
          <h3 className='text-lg font-semibold text-gray-900 mb-4'>Host's Screen</h3>
          <div className='relative'>
            <VideoPlayer
              ref={remoteVideoRef}
              className='w-full max-w-4xl mx-auto rounded-lg border border-gray-200 bg-black'
              autoPlay
              playsInline
            />
            {!remoteStream && (
              <div className='absolute inset-0 flex items-center justify-center bg-gray-100 rounded-lg'>
                <div className='text-center'>
                  <div className='animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4'></div>
                  <p className='text-gray-600'>Waiting for host to start sharing...</p>
                </div>
              </div>
            )}
            {remoteStream && (
              <div className='absolute top-2 right-2 bg-black bg-opacity-50 text-white px-2 py-1 rounded text-xs'>
                Live
              </div>
            )}
          </div>
        </div>
      )}

      {/* Waiting State */}
      {!isConnected && !isConnecting && (
        <div className='bg-white rounded-lg shadow-md p-6'>
          <div className='text-center py-12'>
            <div className='text-6xl mb-4'>📺</div>
            <h3 className='text-xl font-semibold text-gray-900 mb-2'>Ready to View</h3>
            <p className='text-gray-600 mb-6'>
              Use the "Connect to Host" button above to start viewing the shared screen.
            </p>
          </div>
        </div>
      )}

      {/* Instructions */}
      <div className='bg-blue-50 border border-blue-200 rounded-lg p-6'>
        <h3 className='text-lg font-semibold text-blue-900 mb-4'>📋 Instructions</h3>
        <div className='space-y-2 text-sm text-blue-800'>
          <p>• Make sure the host has started sharing their screen</p>
          <p>• Click "Connect to Host" to join the viewing session</p>
          <p>• Use the Chat feature to communicate with the host</p>
          <p>• The screen will appear automatically when the host starts sharing</p>
          <p>• Click "Disconnect" when you're done viewing</p>
        </div>
      </div>

      {/* Actions */}
      <div className='flex justify-center space-x-4'>
        <button
          onClick={onGoHome}
          className='px-6 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors'
        >
          Back to Home
        </button>
      </div>
    </div>
  );
}

export default ViewerView;
