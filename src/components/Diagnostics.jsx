import { useState, useEffect } from 'react';

function Diagnostics({ roomId, role }) {
  const [diagnostics, setDiagnostics] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [autoRefresh, setAutoRefresh] = useState(true);
  const [refreshInterval, setRefreshInterval] = useState(5000);

  // Fetch diagnostics data
  const fetchDiagnostics = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch(`/api/diagnostics?roomId=${roomId}&role=${role}`);

      if (!response.ok) {
        throw new Error(`Failed to fetch diagnostics: ${response.status}`);
      }

      const data = await response.json();
      setDiagnostics(data);
    } catch (err) {
      console.error('Error fetching diagnostics:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Auto-refresh diagnostics
  useEffect(() => {
    if (autoRefresh && roomId) {
      fetchDiagnostics();
      const interval = setInterval(fetchDiagnostics, refreshInterval);
      return () => clearInterval(interval);
    }
  }, [autoRefresh, refreshInterval, roomId, role]);

  // Manual refresh
  const handleRefresh = () => {
    fetchDiagnostics();
  };

  // Format bytes
  const formatBytes = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return `${parseFloat((bytes / k ** i).toFixed(2))} ${sizes[i]}`;
  };

  // Format timestamp
  const formatTimestamp = (timestamp) => {
    return new Date(timestamp).toLocaleString();
  };

  // Get connection status color
  const getStatusColor = (status) => {
    switch (status) {
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

  return (
    <div className='flex flex-col h-full bg-white'>
      {/* Header */}
      <div className='flex-shrink-0 bg-green-600 text-white p-4'>
        <div className='flex items-center justify-between'>
          <h3 className='text-lg font-semibold'>🔧 Diagnostics</h3>
          <div className='flex items-center space-x-2'>
            <button
              onClick={handleRefresh}
              disabled={loading}
              className='px-3 py-1 text-sm bg-green-700 rounded hover:bg-green-800 disabled:opacity-50'
            >
              {loading ? 'Loading...' : 'Refresh'}
            </button>
          </div>
        </div>
        <p className='text-green-100 text-sm mt-1'>
          Room: {roomId} | Role: {role}
        </p>
      </div>

      {/* Controls */}
      <div className='flex-shrink-0 bg-gray-50 border-b p-3'>
        <div className='flex items-center justify-between'>
          <label className='flex items-center space-x-2'>
            <input
              type='checkbox'
              checked={autoRefresh}
              onChange={(e) => setAutoRefresh(e.target.checked)}
              className='rounded'
            />
            <span className='text-sm text-gray-700'>Auto-refresh</span>
          </label>
          <select
            value={refreshInterval}
            onChange={(e) => setRefreshInterval(Number(e.target.value))}
            className='text-sm border border-gray-300 rounded px-2 py-1'
          >
            <option value={1000}>1s</option>
            <option value={5000}>5s</option>
            <option value={10000}>10s</option>
            <option value={30000}>30s</option>
          </select>
        </div>
      </div>

      {/* Content */}
      <div className='flex-1 overflow-y-auto p-4'>
        {loading && !diagnostics && (
          <div className='text-center text-gray-500 py-8'>
            <div className='animate-spin rounded-full h-8 w-8 border-b-2 border-green-600 mx-auto mb-2'></div>
            Loading diagnostics...
          </div>
        )}

        {error && (
          <div className='bg-red-50 border border-red-200 rounded-lg p-3 mb-4'>
            <div className='text-red-600 text-sm'>⚠️ {error}</div>
          </div>
        )}

        {diagnostics && (
          <div className='space-y-4'>
            {/* Connection Status */}
            <div className='bg-white border border-gray-200 rounded-lg p-4'>
              <h4 className='font-semibold text-gray-900 mb-3'>Connection Status</h4>
              <div className='grid grid-cols-2 gap-4 text-sm'>
                <div>
                  <span className='text-gray-600'>Status:</span>
                  <span className={`ml-2 font-medium ${getStatusColor(diagnostics.connectionStatus)}`}>
                    {diagnostics.connectionStatus}
                  </span>
                </div>
                <div>
                  <span className='text-gray-600'>Role:</span>
                  <span className='ml-2 font-medium'>{diagnostics.role}</span>
                </div>
                <div>
                  <span className='text-gray-600'>Room ID:</span>
                  <span className='ml-2 font-mono text-xs'>{diagnostics.roomId}</span>
                </div>
                <div>
                  <span className='text-gray-600'>Last Updated:</span>
                  <span className='ml-2 text-xs'>{formatTimestamp(diagnostics.timestamp)}</span>
                </div>
              </div>
            </div>

            {/* WebRTC Stats */}
            {diagnostics.webrtc && (
              <div className='bg-white border border-gray-200 rounded-lg p-4'>
                <h4 className='font-semibold text-gray-900 mb-3'>WebRTC Statistics</h4>
                <div className='space-y-2 text-sm'>
                  <div className='grid grid-cols-2 gap-4'>
                    <div>
                      <span className='text-gray-600'>ICE Connection State:</span>
                      <span className={`ml-2 font-medium ${getStatusColor(diagnostics.webrtc.iceConnectionState)}`}>
                        {diagnostics.webrtc.iceConnectionState}
                      </span>
                    </div>
                    <div>
                      <span className='text-gray-600'>Signaling State:</span>
                      <span className='ml-2 font-medium'>{diagnostics.webrtc.signalingState}</span>
                    </div>
                  </div>

                  {diagnostics.webrtc.stats && (
                    <div className='mt-3'>
                      <h5 className='font-medium text-gray-800 mb-2'>Connection Stats</h5>
                      <div className='grid grid-cols-2 gap-4 text-xs'>
                        <div>
                          <span className='text-gray-600'>Bytes Sent:</span>
                          <span className='ml-2 font-mono'>{formatBytes(diagnostics.webrtc.stats.bytesSent || 0)}</span>
                        </div>
                        <div>
                          <span className='text-gray-600'>Bytes Received:</span>
                          <span className='ml-2 font-mono'>
                            {formatBytes(diagnostics.webrtc.stats.bytesReceived || 0)}
                          </span>
                        </div>
                        <div>
                          <span className='text-gray-600'>Packets Sent:</span>
                          <span className='ml-2 font-mono'>{diagnostics.webrtc.stats.packetsSent || 0}</span>
                        </div>
                        <div>
                          <span className='text-gray-600'>Packets Received:</span>
                          <span className='ml-2 font-mono'>{diagnostics.webrtc.stats.packetsReceived || 0}</span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Browser Info */}
            <div className='bg-white border border-gray-200 rounded-lg p-4'>
              <h4 className='font-semibold text-gray-900 mb-3'>Browser Information</h4>
              <div className='grid grid-cols-2 gap-4 text-sm'>
                <div>
                  <span className='text-gray-600'>User Agent:</span>
                  <span className='ml-2 text-xs font-mono'>{diagnostics.browser?.userAgent}</span>
                </div>
                <div>
                  <span className='text-gray-600'>Platform:</span>
                  <span className='ml-2'>{diagnostics.browser?.platform}</span>
                </div>
                <div>
                  <span className='text-gray-600'>WebRTC Support:</span>
                  <span
                    className={`ml-2 font-medium ${
                      diagnostics.browser?.webrtcSupport ? 'text-green-600' : 'text-red-600'
                    }`}
                  >
                    {diagnostics.browser?.webrtcSupport ? 'Yes' : 'No'}
                  </span>
                </div>
                <div>
                  <span className='text-gray-600'>Screen Share Support:</span>
                  <span
                    className={`ml-2 font-medium ${
                      diagnostics.browser?.screenShareSupport ? 'text-green-600' : 'text-red-600'
                    }`}
                  >
                    {diagnostics.browser?.screenShareSupport ? 'Yes' : 'No'}
                  </span>
                </div>
              </div>
            </div>

            {/* Network Info */}
            {diagnostics.network && (
              <div className='bg-white border border-gray-200 rounded-lg p-4'>
                <h4 className='font-semibold text-gray-900 mb-3'>Network Information</h4>
                <div className='space-y-2 text-sm'>
                  <div className='grid grid-cols-2 gap-4'>
                    <div>
                      <span className='text-gray-600'>Connection Type:</span>
                      <span className='ml-2'>{diagnostics.network.connectionType || 'Unknown'}</span>
                    </div>
                    <div>
                      <span className='text-gray-600'>Effective Type:</span>
                      <span className='ml-2'>{diagnostics.network.effectiveType || 'Unknown'}</span>
                    </div>
                  </div>
                  <div className='grid grid-cols-2 gap-4'>
                    <div>
                      <span className='text-gray-600'>Downlink:</span>
                      <span className='ml-2'>{diagnostics.network.downlink || 'Unknown'} Mbps</span>
                    </div>
                    <div>
                      <span className='text-gray-600'>RTT:</span>
                      <span className='ml-2'>{diagnostics.network.rtt || 'Unknown'} ms</span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Errors */}
            {diagnostics.errors && diagnostics.errors.length > 0 && (
              <div className='bg-red-50 border border-red-200 rounded-lg p-4'>
                <h4 className='font-semibold text-red-900 mb-3'>Recent Errors</h4>
                <div className='space-y-2'>
                  {diagnostics.errors.map((error, index) => (
                    <div key={index} className='text-sm text-red-800'>
                      <div className='font-medium'>{error.message}</div>
                      <div className='text-xs text-red-600 mt-1'>{formatTimestamp(error.timestamp)}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {!diagnostics && !loading && !error && (
          <div className='text-center text-gray-500 py-8'>
            <div className='text-4xl mb-2'>🔧</div>
            <p>No diagnostics data available</p>
            <p className='text-sm'>Click refresh to load diagnostics</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default Diagnostics;
