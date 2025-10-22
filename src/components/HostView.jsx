import { useState, useEffect, useRef, useMemo } from 'react';
import VideoPlayer from './VideoPlayer';
import { useWebRTC } from '../hooks/useWebRTC';
import { useRoomContext } from '../contexts/RoomContext';
import { HOST_STATUS_LABELS, HOST_STATUS_COLORS, HOST_CONNECTION_STATUS, VIEWER_PEER_BADGES } from '../constants';

function HostView({ config, onGoHome }) {
  console.log('HostView: Component is rendering');
  const { roomId, updateSenderSecret, setDiagnosticAlert } = useRoomContext();
  console.log('HostView: roomId =', roomId, 'updateSenderSecret =', typeof updateSenderSecret);
  const [isSharing, setIsSharing] = useState(false);
  const [error, setError] = useState(null);
  const [shareButtonText, setShareButtonText] = useState('Start Sharing');
  const [copyStatus, setCopyStatus] = useState(null); // For copy feedback
  const shouldUseTurn = config?.useTurn !== false;

  const localVideoRef = useRef(null);
  const {
    startScreenShare,
    stopScreenShare,
    connectionState,
    connectionLifecycleStatus,
    peerConnections,
    error: webrtcError,
    errorState,
    hasTurnServer,
  } = useWebRTC(roomId, 'host', config, null, { onSenderSecret: updateSenderSecret });

  // Handle WebRTC errors
  useEffect(() => {
    if (webrtcError) {
      setError(webrtcError);
    }
  }, [webrtcError]);

  useEffect(() => {
    if (!setDiagnosticAlert) return;

    if (errorState?.type && ['network', 'permission'].includes(errorState.type)) {
      const message =
        errorState.type === 'network'
          ? `Network issue detected while sharing: ${errorState.message || 'Please verify your connection.'}`
          : `Screen sharing permission issue: ${errorState.message || 'Grant screen share access and retry.'}`;
      setDiagnosticAlert(errorState.type, message);
    } else {
      ['network', 'permission'].forEach((type) => setDiagnosticAlert(type, null));
    }
  }, [errorState, setDiagnosticAlert]);

  useEffect(() => {
    if (!setDiagnosticAlert) return;

    if (shouldUseTurn && !hasTurnServer) {
      setDiagnosticAlert(
        'turn',
        'TURN relays are not configured. Configure TURN credentials for reliable NAT traversal and better connectivity.'
      );
    } else {
      setDiagnosticAlert('turn', null);
    }
  }, [shouldUseTurn, hasTurnServer, setDiagnosticAlert]);

  // Handle screen share start
  const handleStartSharing = async () => {
    try {
      setError(null);
      setShareButtonText('Starting...');

      const stream = await startScreenShare();
      if (stream && localVideoRef.current) {
        localVideoRef.current.srcObject = stream;
        setIsSharing(true);
        setShareButtonText('Stop Sharing');
      }
    } catch (err) {
      console.error('Error starting screen share:', err);
      setError('Failed to start screen sharing. Please check your browser permissions.');
      setShareButtonText('Start Sharing');
    }
  };

  // Handle screen share stop
  const handleStopSharing = async () => {
    try {
      await stopScreenShare();
      if (localVideoRef.current) {
        localVideoRef.current.srcObject = null;
      }
      setIsSharing(false);
      setShareButtonText('Start Sharing');
    } catch (err) {
      console.error('Error stopping screen share:', err);
      setError('Failed to stop screen sharing.');
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

  const viewerCount = peerConnections.size;
  const viewerEntries = useMemo(() => Array.from(peerConnections.values()), [peerConnections]);

  const statusText = useMemo(() => {
    return HOST_STATUS_LABELS[connectionLifecycleStatus] || HOST_STATUS_LABELS[HOST_CONNECTION_STATUS.IDLE];
  }, [connectionLifecycleStatus]);

  const statusColor = useMemo(() => {
    return HOST_STATUS_COLORS[connectionLifecycleStatus] || HOST_STATUS_COLORS[HOST_CONNECTION_STATUS.IDLE];
  }, [connectionLifecycleStatus]);

  const shareDisabled =
    connectionState === 'connecting' ||
    connectionLifecycleStatus === HOST_CONNECTION_STATUS.REGISTERING ||
    connectionLifecycleStatus === HOST_CONNECTION_STATUS.ACQUIRING_MEDIA;

  const isPreparingShare = !isSharing && shareDisabled;
  const errorMessage = errorState?.message || error;
  const errorDetails = errorState?.details;

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
            <div className={`text-sm font-medium ${statusColor}`}>Status: {statusText}</div>
            <div className='text-sm text-gray-500'>Viewers: {viewerCount}</div>
            <div className='mt-2 flex flex-wrap gap-2 justify-end'>
              {viewerEntries.length === 0 ? (
                <span className='text-xs text-gray-400'>No viewer connections yet</span>
              ) : (
                viewerEntries.map((viewer) => {
                  const badge = VIEWER_PEER_BADGES[viewer.status] || {
                    label: 'Awaiting status',
                    className: 'bg-gray-100 text-gray-600',
                  };
                  return (
                    <span key={viewer.id} className={`px-2 py-1 text-xs font-medium rounded-full ${badge.className}`}>
                      {viewer.label || 'Viewer'} • {badge.label}
                    </span>
                  );
                })
              )}
            </div>
          </div>
        </div>
      </div>

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

          {isSharing && (
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
      {errorMessage && (
        <div className='bg-red-50 border border-red-200 rounded-lg p-4'>
          <div className='flex items-center'>
            <div className='text-red-600 mr-2'>⚠️</div>
            <div>
              <h4 className='text-red-800 font-medium'>Error</h4>
              <p className='text-red-700 text-sm mt-1'>{errorMessage}</p>
              {errorDetails && <p className='text-red-600 text-xs mt-2 border-t border-red-200 pt-2'>{errorDetails}</p>}
            </div>
          </div>
        </div>
      )}

      {/* Local Video Preview */}
      {isSharing && (
        <div className='bg-white rounded-lg shadow-md p-6'>
          <h3 className='text-lg font-semibold text-gray-900 mb-4'>Your Screen (Preview)</h3>
          <div className='relative'>
            <VideoPlayer
              ref={localVideoRef}
              className='w-full max-w-2xl mx-auto rounded-lg border border-gray-200'
              muted
              autoPlay
              playsInline
            />
            <div className='absolute top-2 right-2 bg-black bg-opacity-50 text-white px-2 py-1 rounded text-xs'>
              You are sharing this screen
            </div>
          </div>
        </div>
      )}

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
