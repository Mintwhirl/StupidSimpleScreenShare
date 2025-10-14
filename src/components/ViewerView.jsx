import { useState, useEffect, useRef, useCallback } from 'react';
import VideoPlayer from './VideoPlayer';
import { useWebRTC } from '../hooks/useWebRTC';
import { useRoomContext } from '../contexts/RoomContext';
import { validateViewerId } from '../utils/validation';
import { CONNECTION_STATES, UI_TEXT, STATUS_COLORS, ERROR_MESSAGES, API_ENDPOINTS } from '../constants';

function ViewerView({ config, onGoHome }) {
  const { roomId, viewerId, updateViewerId, updateSenderSecret } = useRoomContext();
  const [error, setError] = useState(null);
  // Remove redundant state - derive everything from connectionState
  // Removed unused _roomIdError state (dead code)
  const [viewerIdError, setViewerIdError] = useState(null);
  // Remove local senderSecret state - use context instead

  const remoteVideoRef = useRef(null);

  // Validation functions (only for viewerId since roomId comes from context)
  const validateViewerIdInput = useCallback((value) => {
    const validation = validateViewerId(value);
    setViewerIdError(validation.valid ? null : validation.error);
    return validation.valid;
  }, []);

  const {
    connectToHost,
    disconnect,
    connectionState,
    remoteStream,
    error: webrtcError,
  } = useWebRTC(roomId, 'viewer', config, viewerId);

  // Derive all status from WebRTC state - single source of truth
  const connectionStatus = connectionState;
  const isConnected = connectionState === CONNECTION_STATES.CONNECTED;
  const isConnecting = connectionState === CONNECTION_STATES.CONNECTING;
  const hostStatus = connectionState; // Use connectionState directly

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
    } else if (connectionState === CONNECTION_STATES.CONNECTED) {
      // Clear errors when connection succeeds
      setError(null);
    }
  }, [webrtcError, connectionState]);

  // Validate room exists
  const validateRoom = useCallback(async (roomId) => {
    try {
      const response = await fetch(`${API_ENDPOINTS.DIAGNOSTICS}?roomId=${roomId}`);
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
    // Clear previous errors
    setError(null);
    setRoomIdError(null);
    setViewerIdError(null);

    // Validate inputs
    // RoomId comes from context, no need to validate here
    const isViewerIdValid = validateViewerIdInput(viewerId);

    if (!isViewerIdValid) {
      return; // Validation errors are already set by validation functions
    }

    try {
      setError(null);
      // State will be managed by WebRTC hook

      // Validate room exists first
      const roomExists = await validateRoom(roomId);
      if (!roomExists) {
        setError(ERROR_MESSAGES.ROOM_NOT_FOUND);
        return;
      }

      await connectToHost();

      // Register sender ID for chat if viewerId is provided
      if (viewerId && viewerId.trim()) {
        try {
          const response = await fetch(API_ENDPOINTS.REGISTER_SENDER, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ roomId, senderId: viewerId.trim() }),
          });

          if (response.ok) {
            const data = await response.json();
            updateSenderSecret(data.secret); // Store the secret in context
          }
        } catch (err) {
          console.warn('Failed to register sender ID:', err);
        }
      }

      // Don't set hostStatus to 'connected' here - let the WebRTC connection state handle it
    } catch (err) {
      console.error('Error connecting to host:', err);
      setError(ERROR_MESSAGES.CONNECTION_FAILED);
    }
  }, [roomId, connectToHost, validateRoom, viewerId, validateViewerIdInput, updateSenderSecret]);

  // Removed auto-connect logic - user must manually click "Connect to Host"

  // Handle disconnection
  const handleDisconnect = async () => {
    try {
      await disconnect();
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

  // Generate cryptographically secure viewer ID
  const generateViewerId = () => {
    // Use crypto.randomUUID() for cryptographically secure randomness
    const id = `viewer_${crypto.randomUUID().substring(0, 8)}`;
    updateViewerId(id);
    return id;
  };

  // Get connection status color
  const getStatusColor = () => {
    switch (connectionStatus) {
      case CONNECTION_STATES.CONNECTED:
        return STATUS_COLORS.SUCCESS;
      case CONNECTION_STATES.CONNECTING:
        return STATUS_COLORS.WARNING;
      case CONNECTION_STATES.DISCONNECTED:
        return STATUS_COLORS.ERROR;
      default:
        return STATUS_COLORS.DEFAULT;
    }
  };

  // Get connection status text
  const getStatusText = () => {
    switch (connectionStatus) {
      case CONNECTION_STATES.CONNECTED:
        return UI_TEXT.CONNECTED;
      case CONNECTION_STATES.CONNECTING:
        return UI_TEXT.CONNECTING;
      case CONNECTION_STATES.DISCONNECTED:
        return UI_TEXT.DISCONNECTED;
      default:
        return UI_TEXT.UNKNOWN;
    }
  };

  // Get host status color
  const getHostStatusColor = () => {
    switch (hostStatus) {
      case CONNECTION_STATES.CONNECTED:
        return STATUS_COLORS.SUCCESS;
      case CONNECTION_STATES.CONNECTING:
        return STATUS_COLORS.WARNING;
      case CONNECTION_STATES.DISCONNECTED:
        return STATUS_COLORS.ERROR;
      default:
        return STATUS_COLORS.DEFAULT;
    }
  };

  // Get host status text
  const getHostStatusText = () => {
    switch (hostStatus) {
      case CONNECTION_STATES.CONNECTED:
        return UI_TEXT.HOST_ONLINE;
      case CONNECTION_STATES.CONNECTING:
        return UI_TEXT.CONNECTING_TO_HOST;
      case CONNECTION_STATES.DISCONNECTED:
        return UI_TEXT.HOST_OFFLINE;
      default:
        return UI_TEXT.UNKNOWN;
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
              onChange={(e) => {
                updateViewerId(e.target.value);
                // Real-time validation
                if (e.target.value.trim()) {
                  validateViewerIdInput(e.target.value);
                } else {
                  setViewerIdError(null);
                }
              }}
              placeholder='Enter your name or leave blank for auto-generated ID'
              className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 ${
                viewerIdError ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-blue-500'
              }`}
            />
            {viewerIdError && <p className='text-red-500 text-sm mt-1'>{viewerIdError}</p>}
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
              {isConnecting ? UI_TEXT.CONNECTING : UI_TEXT.CONNECT_TO_HOST}
            </button>
          ) : (
            <div className='flex items-center space-x-4'>
              <button
                onClick={handleReconnect}
                className='px-6 py-3 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition-colors'
              >
                {UI_TEXT.RECONNECT}
              </button>
              <button
                onClick={handleDisconnect}
                className='px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors'
              >
                {UI_TEXT.DISCONNECT}
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
