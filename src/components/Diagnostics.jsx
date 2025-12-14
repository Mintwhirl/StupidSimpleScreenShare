import { useRoomContext } from '../contexts/RoomContext';
import { useState, useEffect } from 'react';
import { useSimpleWebRTC } from '../hooks/useSimpleWebRTC';

function Diagnostics({ role: propRole }) {
  const { currentView } = useRoomContext();
  const role = propRole || (currentView === 'host' ? 'host' : 'viewer');
  const { connectionState, signalingState } = useSimpleWebRTC(role);
  const [lastEvent, setLastEvent] = useState({ time: Date.now(), event: 'Initialized' });

  // Detect browser capabilities
  const getBrowserInfo = () => {
    const ua = navigator.userAgent;
    let browserName = 'Unknown';
    let browserVersion = '';

    if (ua.indexOf('Firefox') > -1) {
      browserName = 'Firefox';
      browserVersion = ua.match(/Firefox\/(\d+)/)?.[1] || '';
    } else if (ua.indexOf('Chrome') > -1 && ua.indexOf('Edg') === -1) {
      browserName = 'Chrome';
      browserVersion = ua.match(/Chrome\/(\d+)/)?.[1] || '';
    } else if (ua.indexOf('Safari') > -1 && ua.indexOf('Chrome') === -1) {
      browserName = 'Safari';
      browserVersion = ua.match(/Version\/(\d+)/)?.[1] || '';
    } else if (ua.indexOf('Edg') > -1) {
      browserName = 'Edge';
      browserVersion = ua.match(/Edg\/(\d+)/)?.[1] || '';
    } else if (ua.indexOf('Brave') > -1) {
      browserName = 'Brave';
      browserVersion = ua.match(/Brave\/(\d+)/)?.[1] || '';
    }

    return `${browserName} ${browserVersion}`.trim();
  };

  // Update last event when connection states change
  useEffect(() => {
    if (signalingState !== 'disconnected') {
      setLastEvent({ time: Date.now(), event: `Signaling: ${signalingState}` });
    }
    if (connectionState !== 'idle') {
      setLastEvent({ time: Date.now(), event: `WebRTC: ${connectionState}` });
    }
  }, [signalingState, connectionState]);

  const formatTime = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString();
  };

  return (
    <div className='h-full overflow-y-auto p-4 text-white text-sm'>
      <h3 className='text-lg font-bold mb-4'>🔧 Diagnostics</h3>

      <div className='space-y-4'>
        {/* Connection Status */}
        <div className='bg-purple-900 bg-opacity-30 rounded-lg p-3'>
          <h4 className='font-semibold mb-2 text-cyan-300'>Connection Status</h4>
          <div className='space-y-1 text-xs'>
            <p>
              Signaling:
              <span
                className={`ml-1 ${
                  signalingState === 'connected'
                    ? 'text-green-400'
                    : signalingState === 'error'
                      ? 'text-red-400'
                      : 'text-yellow-400'
                }`}
              >
                {signalingState}
              </span>
            </p>
            <p>
              WebRTC:
              <span
                className={`ml-1 ${
                  connectionState === 'connected'
                    ? 'text-green-400'
                    : connectionState === 'failed'
                      ? 'text-red-400'
                      : connectionState === 'connecting'
                        ? 'text-yellow-400'
                        : 'text-gray-400'
                }`}
              >
                {connectionState}
              </span>
            </p>
            <p className='text-xs opacity-75 mt-1'>
              Last event: {formatTime(lastEvent.time)} - {lastEvent.event}
            </p>
          </div>
        </div>

        {/* Browser Info */}
        <div className='bg-purple-900 bg-opacity-30 rounded-lg p-3'>
          <h4 className='font-semibold mb-2 text-cyan-300'>Browser Support</h4>
          <div className='space-y-1 text-xs'>
            <p>{getBrowserInfo()}</p>
            <p>
              WebRTC:
              <span className={window.RTCPeerConnection ? 'text-green-400 ml-1' : 'text-red-400 ml-1'}>
                {window.RTCPeerConnection ? '✓' : '✗'}
              </span>
            </p>
            <p>
              Screen Capture:
              <span className={navigator.mediaDevices?.getDisplayMedia ? 'text-green-400 ml-1' : 'text-red-400 ml-1'}>
                {navigator.mediaDevices?.getDisplayMedia ? '✓' : '✗'}
              </span>
            </p>
          </div>
        </div>

        {/* Tips */}
        <div className='bg-purple-900 bg-opacity-30 rounded-lg p-3'>
          <h4 className='font-semibold mb-2 text-yellow-300'>Quick Tips</h4>
          <ul className='space-y-1 text-xs'>
            <li>• Signaling connects to the server</li>
            <li>• WebRTC connects peer-to-peer</li>
            <li>• Both must be green for video</li>
            <li>• Allow screen capture when prompted</li>
          </ul>
        </div>
      </div>
    </div>
  );
}

export default Diagnostics;
