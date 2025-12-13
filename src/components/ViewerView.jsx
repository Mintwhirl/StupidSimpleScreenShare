import { useState, useEffect, useRef, useCallback } from 'react';
import VideoPlayer from './VideoPlayer';
import { useSimpleWebRTC } from '../hooks/useSimpleWebRTC';
import { useRoomContext } from '../contexts/RoomContext';

function ViewerView({ _config, onGoHome }) {
  const { roomId } = useRoomContext();
  const [error, setError] = useState(null);

  const remoteVideoRef = useRef(null);

  const {
    connectToHost,
    disconnect,
    connectionState,
    remoteStream,
    error: webrtcError,
    _reset
  } = useSimpleWebRTC(roomId, 'viewer');

  // Derive all status from WebRTC state - single source of truth
  const isConnected = connectionState === 'connected';
  const isConnecting = connectionState === 'connecting';

  // Handle remote stream
  useEffect(() => {
    if (remoteStream && remoteVideoRef.current) {
      try {
        remoteVideoRef.current.srcObject = remoteStream;
        // Safari often needs explicit play() call even with autoplay
        remoteVideoRef.current.play().catch(console.warn);
      } catch (e) {
        console.warn('[ViewerView] Failed to bind remote stream to video element:', e);
        setError('Unable to attach video stream. Please try reconnecting.');
      }
    }
  }, [remoteStream]);

  // Handle WebRTC errors and clear errors on success
  useEffect(() => {
    if (webrtcError) {
      setError(webrtcError);
    } else if (connectionState === 'connected') {
      setError(null);
    }
  }, [webrtcError, connectionState]);

  // Handle connection to host
  const handleConnect = useCallback(async () => {
    try {
      setError(null);
      await connectToHost();
    } catch (err) {
      console.error('[ViewerView] Error connecting to host:', err);
      setError(err.message || 'Failed to connect to host');
    }
  }, [connectToHost]);

  // Handle disconnection
  const handleDisconnect = useCallback(async () => {
    try {
      await disconnect();
      if (remoteVideoRef.current) {
        remoteVideoRef.current.srcObject = null;
      }
    } catch (err) {
      console.error('Error disconnecting:', err);
    }
  }, [disconnect]);

  // Handle reconnection
  const handleReconnect = useCallback(async () => {
    try {
      await handleDisconnect();
      setTimeout(async () => {
        try {
          await handleConnect();
        } catch (err) {
          console.error('Reconnection failed:', err);
          setError('Reconnection failed');
        }
      }, 1000);
    } catch (err) {
      console.error('Error during reconnection process:', err);
    }
  }, [handleDisconnect, handleConnect]);

  // Get connection status color
  const getStatusColor = () => {
    switch (connectionState) {
      case 'connected':
        return 'text-green-600';
      case 'connecting':
        return 'text-yellow-600';
      case 'disconnected':
        return 'text-red-600';
      case 'failed':
        return 'text-red-600';
      default:
        return 'text-gray-600';
    }
  };

  // Get connection status text
  const getStatusText = () => {
    switch (connectionState) {
      case 'connected':
        return 'Connected';
      case 'connecting':
        return 'Connecting';
      case 'disconnected':
        return 'Disconnected';
      case 'failed':
        return 'Error';
      default:
        return 'Idle';
    }
  };

  // Get host status text
  const getHostStatusText = () => {
    switch (connectionState) {
      case 'connected':
        return 'Host Online';
      case 'connecting':
        return 'Connecting to Host';
      case 'disconnected':
        return 'Host Offline';
      case 'failed':
        return 'Connection Failed';
      default:
        return 'Unknown';
    }
  };

  return (
    <div className='space-y-6'>
      {/* Accessible heading for tests and screen readers */}
      <h1 className='sr-only'>Viewer View</h1>
      {/* Header */}
      <div className='bg-white rounded-lg shadow-md p-6'>
        <div className='flex items-center justify-between'>
          <div>
            <h2 className='text-2xl font-bold text-gray-900 mb-2'>👀 Viewing Room</h2>
            <p className='text-gray-900'>
              Room ID: <span className='font-mono font-semibold bg-gray-100 px-2 py-1 rounded'>{roomId}</span>
            </p>
          </div>
          <div className='text-right'>
            <div className={`text-sm font-semibold ${getStatusColor()}`}>Connection: {getStatusText()}</div>
            <div className={`text-sm font-semibold ${getStatusColor()}`}>{getHostStatusText()}</div>
          </div>
        </div>
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

      {/* Error Display - Mobile Friendly */}
      {error && (
        <div className='bg-red-50 border-2 border-red-400 rounded-lg p-5 shadow-lg'>
          <div className='flex items-start'>
            <div className='text-red-600 text-2xl mr-3'>⚠️</div>
            <div className='flex-1'>
              <h4 className='text-red-800 font-bold text-lg mb-2'>Connection Error</h4>
              <p className='text-red-900 text-base leading-relaxed'>{error}</p>
              <div className='mt-4 space-y-2'>
                <p className='text-red-700 text-sm font-medium'>Common fixes:</p>
                <ul className='text-red-700 text-sm list-disc list-inside space-y-1'>
                  <li>Make sure the host has started sharing</li>
                  <li>Check the room ID is correct</li>
                  <li>Try connecting again</li>
                </ul>
              </div>
            </div>
          </div>
          <div className='mt-4 flex justify-center'>
            <button
              onClick={handleReconnect}
              className='text-base bg-red-600 text-white px-6 py-3 rounded-lg hover:bg-red-700 transition-colors font-medium shadow-md'
            >
              🔄 Try Connecting Again
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
              muted
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
