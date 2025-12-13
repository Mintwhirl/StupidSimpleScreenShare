import { useState, useEffect, useRef } from 'react';
import { useSimpleWebRTC } from '../hooks/useSimpleWebRTC';
import { useRoomContext } from '../contexts/RoomContext';

function HostView({ _config, onGoHome }) {
  const { roomId } = useRoomContext();
  const [isSharing, setIsSharing] = useState(false);
  const [copyStatus, setCopyStatus] = useState(null);

  const {
    startScreenShare,
    disconnect,
    connectionState,
    error,
    _reset
  } = useSimpleWebRTC(roomId, 'host');

  // Update sharing state based on connection state
  useEffect(() => {
    setIsSharing(connectionState === 'connected');
  }, [connectionState]);

  // Handle screen share start
  const handleStartSharing = async () => {
    try {
      await startScreenShare();
    } catch (err) {
      console.error('Error starting screen share:', err);
    }
  };

  // Handle screen share stop
  const handleStopSharing = async () => {
    try {
      await disconnect();
    } catch (err) {
      console.error('Error stopping screen share:', err);
    }
  };

  // Handle share button click
  const handleShareToggle = () => {
    if (isSharing) {
      handleStopSharing();
    } else {
      handleStartSharing();
    }
  };

  const shareButtonText = isSharing ? 'Stop Sharing' : 'Start Sharing';

  // Copy room ID to clipboard
  const copyRoomId = () => {
    navigator.clipboard
      .writeText(roomId)
      .then(() => {
        setCopyStatus('success');
        setTimeout(() => setCopyStatus(null), 2000);
      })
      .catch((err) => {
        console.error('Failed to copy room ID:', err);
        setCopyStatus('error');
        setTimeout(() => setCopyStatus(null), 2000);
      });
  };

  const getStatusText = () => {
  switch (connectionState) {
    case 'idle':
      return 'Idle';
    case 'connecting':
      return 'Connecting...';
    case 'connected':
      return 'Sharing Active';
    case 'disconnected':
      return 'Disconnected';
    case 'failed':
      return 'Error';
    default:
      return 'Unknown';
  }
};

const getStatusColor = () => {
  switch (connectionState) {
    case 'idle':
      return 'text-gray-600';
    case 'connecting':
      return 'text-yellow-600';
    case 'connected':
      return 'text-green-600';
    case 'disconnected':
      return 'text-gray-500';
    case 'failed':
      return 'text-red-600';
    default:
      return 'text-gray-600';
  }
};

const shareDisabled = connectionState === 'connecting';
const isPreparingShare = !isSharing && shareDisabled;

  return (
    <div className='space-y-6'>
      {/* Header */}
      <div className='bg-white rounded-lg shadow-md p-6'>
        <div className='flex items-center justify-between'>
          <div>
            <h2 className='text-2xl font-bold text-gray-900 mb-2'>🖥️ Screen Sharing Room</h2>
            <p className='text-gray-600'>Share your screen with others. Viewers can join using the room ID below.</p>
          </div>
          <div className='text-right'>
            <div className={`text-sm font-medium ${getStatusColor()}`}>Status: {getStatusText()}</div>
            <div className='text-sm text-gray-500'>Viewers: {connectionState === 'connected' ? 1 : 0}</div>
          </div>
        </div>
      </div>

      {/* Accessible heading for tests and screen readers */}
      <h1 className='sr-only'>Host View</h1>

      {/* Room ID Section */}
      <div className='bg-white rounded-lg shadow-md p-6'>
        <h3 className='text-lg font-semibold text-gray-900 mb-4'>Room Information</h3>
        <div className='flex items-center space-x-4'>
          <div className='flex-1'>
            <label className='block text-sm font-medium text-gray-700 mb-2'>Room ID</label>
            <div className='flex items-center space-x-2'>
              <input
                type='text'
                value={roomId}
                readOnly
                className='flex-1 px-3 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-900 font-mono text-sm'
              />
              <button
                onClick={copyRoomId}
                className={`px-4 py-2 text-white rounded-lg transition-colors ${
                  copyStatus === 'success'
                    ? 'bg-green-600'
                    : copyStatus === 'error'
                      ? 'bg-red-600'
                      : 'bg-blue-600 hover:bg-blue-700'
                }`}
              >
                {copyStatus === 'success' ? 'Copied!' : copyStatus === 'error' ? 'Failed!' : 'Copy'}
              </button>
            </div>
          </div>
        </div>
        <p className='text-sm text-gray-500 mt-2'>Share this room ID with others so they can view your screen.</p>
      </div>

      {/* Screen Share Controls */}
      <div className='bg-white rounded-lg shadow-md p-6'>
        <h3 className='text-lg font-semibold text-gray-900 mb-4'>Screen Share Controls</h3>
        <div className='flex items-center justify-center space-x-4'>
          <button
            onClick={handleShareToggle}
            disabled={shareDisabled}
            className={`px-6 py-3 rounded-lg font-medium transition-colors ${
              isSharing ? 'bg-red-600 text-white hover:bg-red-700' : 'bg-green-600 text-white hover:bg-green-700'
            } ${shareDisabled ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            {isPreparingShare ? 'Connecting...' : shareButtonText}
          </button>

          {connectionState === 'connected' && (
            <div className='flex items-center space-x-2 text-green-600'>
              <div className='w-2 h-2 bg-green-600 rounded-full animate-pulse'></div>
              <span className='text-sm font-medium'>Sharing Active</span>
            </div>
          )}
        </div>

        {!isSharing && (
          <div className='mt-4 text-center'>
            <p className='text-sm text-gray-600'>Click "Start Sharing" to begin sharing your screen with viewers.</p>
          </div>
        )}
      </div>

      {/* Error Display */}
      {error && (
        <div className='bg-red-50 border border-red-200 rounded-lg p-4'>
          <div className='flex items-center'>
            <div className='text-red-600 mr-2'>⚠️</div>
            <div>
              <h4 className='text-red-800 font-medium'>Error</h4>
              <p className='text-red-700 text-sm mt-1'>{error}</p>
            </div>
          </div>
        </div>
      )}

      {/* Local Video Preview removed per design update */}

      {/* Instructions */}
      <div className='bg-blue-50 border border-blue-200 rounded-lg p-6'>
        <h3 className='text-lg font-semibold text-blue-900 mb-4'>📋 Instructions</h3>
        <div className='space-y-2 text-sm text-blue-800'>
          <p>• Click "Start Sharing" to begin screen sharing</p>
          <p>• Select the screen or application you want to share</p>
          <p>• Share the Room ID with viewers so they can join</p>
          <p>• Use the Chat feature to communicate with viewers</p>
          <p>• Click "Stop Sharing" when you're done</p>
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

export default HostView;
