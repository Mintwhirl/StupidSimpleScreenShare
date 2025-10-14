import { useState, useEffect, useMemo } from 'react';
import HostView from './components/HostView';
import ViewerView from './components/ViewerView';
import Chat from './components/Chat';
import Diagnostics from './components/Diagnostics';
import { useApi } from './hooks/useApi';

function App() {
  const [currentView, setCurrentView] = useState('home');
  const [roomId, setRoomId] = useState('');
  const [viewerId, setViewerId] = useState('');
  const [showChat, setShowChat] = useState(false);
  const [showDiagnostics, setShowDiagnostics] = useState(false);
  const { config, loading: configLoading, error: configError, createRoom } = useApi();

  // Generate static random values for background elements to prevent infinite re-renders
  const backgroundElements = useMemo(() => {
    const stars = Array.from({ length: 50 }, (_, i) => ({
      id: i,
      left: Math.random() * 100,
      top: Math.random() * 100,
      delay: Math.random() * 3,
      duration: 2 + Math.random() * 2,
    }));

    const gridLines = Array.from({ length: 20 }, (_, i) => ({
      id: i,
      top: i * 8,
      delay: i * 0.1,
    }));

    const gridColumns = Array.from({ length: 15 }, (_, i) => ({
      id: i,
      left: i * 8,
      delay: i * 0.2,
    }));

    return { stars, gridLines, gridColumns };
  }, []);

  // Check for room parameter in URL on mount
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.has('room')) {
      const id = params.get('room');
      setRoomId(id);
      setCurrentView('viewer');
    }
  }, []);

  // Handle room creation
  const handleCreateRoom = async () => {
    try {
      const data = await createRoom();
      setRoomId(data.roomId);
      setCurrentView('host');
    } catch (error) {
      console.error('Error creating room:', error);
      alert('Failed to create room. Please try again.');
    }
  };

  // Handle joining room as viewer
  const handleJoinRoom = () => {
    if (!roomId.trim()) {
      alert('Please enter a room ID');
      return;
    }
    setCurrentView('viewer');
  };

  // Handle going back to home
  const handleGoHome = () => {
    setCurrentView('home');
    setRoomId('');
    setViewerId('');
    setShowChat(false);
    setShowDiagnostics(false);
  };

  // Loading state
  if (configLoading) {
    return (
      <div className='min-h-screen bg-gray-100 flex items-center justify-center'>
        <div className='text-center'>
          <div className='animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4'></div>
          <p className='text-gray-600'>Loading configuration...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (configError) {
    return (
      <div className='min-h-screen bg-gray-100 flex items-center justify-center'>
        <div className='text-center'>
          <div className='text-red-600 text-xl mb-4'>⚠️ Configuration Error</div>
          <p className='text-gray-600 mb-4'>Failed to load application configuration.</p>
          <button
            onClick={() => window.location.reload()}
            className='bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700'
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className='min-h-screen relative overflow-hidden'>
      {/* Synthwave Background */}
      <div className='fixed inset-0 z-0'>
        {/* Deep purple sky with stars */}
        <div className='absolute inset-0 bg-gradient-to-b from-purple-900 via-purple-800 to-indigo-900'>
          {/* Animated stars */}
          <div className='absolute inset-0'>
            {backgroundElements.stars.map((star) => (
              <div
                key={star.id}
                className='absolute w-1 h-1 bg-white rounded-full animate-pulse'
                style={{
                  left: `${star.left}%`,
                  top: `${star.top}%`,
                  animationDelay: `${star.delay}s`,
                  animationDuration: `${star.duration}s`,
                }}
              />
            ))}
          </div>
        </div>

        {/* Glowing sun */}
        <div className='absolute top-10 right-10 w-32 h-32 bg-gradient-radial from-yellow-400 via-orange-500 to-red-500 rounded-full blur-xl opacity-80 animate-pulse' />

        {/* Geometric mountains */}
        <div className='absolute bottom-0 left-0 right-0 h-64'>
          {/* Mountain 1 */}
          <div className='absolute bottom-0 left-0 w-64 h-48 bg-gradient-to-t from-purple-700 to-purple-500 transform -skew-x-12 opacity-80' />
          {/* Mountain 2 */}
          <div className='absolute bottom-0 left-32 w-48 h-36 bg-gradient-to-t from-blue-700 to-blue-500 transform -skew-x-6 opacity-70' />
          {/* Mountain 3 */}
          <div className='absolute bottom-0 right-0 w-56 h-52 bg-gradient-to-t from-purple-600 to-purple-400 transform skew-x-12 opacity-75' />
          {/* Mountain highlights */}
          <div className='absolute bottom-0 left-0 w-64 h-48 bg-gradient-to-t from-pink-400 to-transparent transform -skew-x-12 opacity-30' />
          <div className='absolute bottom-0 right-0 w-56 h-52 bg-gradient-to-t from-pink-400 to-transparent transform skew-x-12 opacity-30' />
        </div>

        {/* Animated electric grid plane */}
        <div className='absolute bottom-0 left-0 right-0 h-32 opacity-40'>
          <div className='relative w-full h-full'>
            {backgroundElements.gridLines.map((line) => (
              <div
                key={line.id}
                className='absolute w-full h-px bg-gradient-to-r from-transparent via-blue-400 to-transparent animate-pulse'
                style={{
                  top: `${line.top}px`,
                  animationDelay: `${line.delay}s`,
                  animationDuration: '3s',
                }}
              />
            ))}
            {backgroundElements.gridColumns.map((column) => (
              <div
                key={column.id}
                className='absolute h-full w-px bg-gradient-to-b from-transparent via-purple-400 to-transparent animate-pulse'
                style={{
                  left: `${column.left}%`,
                  animationDelay: `${column.delay}s`,
                  animationDuration: '4s',
                }}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Main App Content */}
      <div className='relative z-10 min-h-screen flex items-center justify-center p-4'>
        {currentView === 'home' ? (
          <div className='w-full max-w-md mx-auto'>
            {/* Application Title */}
            <div className='text-center mb-8'>
              <h1
                className='text-2xl md:text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 uppercase tracking-wider drop-shadow-lg'
                style={{
                  fontFamily: '"Righteous", cursive',
                  textShadow:
                    '0 0 20px rgba(59, 130, 246, 0.5), 0 0 40px rgba(147, 51, 234, 0.5), 0 0 60px rgba(236, 72, 153, 0.5)',
                  fontWeight: '400',
                  fontStyle: 'normal',
                }}
              >
                STUPID-SIMPLE SCREEN SHARE
              </h1>
            </div>

            {/* Main UI Panel */}
            <div
              className='bg-purple-900 bg-opacity-30 backdrop-blur-md border border-purple-400 border-opacity-40 rounded-2xl p-6 shadow-2xl'
              style={{
                boxShadow:
                  '0 0 30px rgba(147, 51, 234, 0.3), 0 0 60px rgba(59, 130, 246, 0.2), inset 0 0 20px rgba(255, 255, 255, 0.1)',
              }}
            >
              {/* Interactive Controls */}
              <div className='space-y-4 mb-6'>
                {/* Top Row - Sharing Controls */}
                <div className='grid grid-cols-2 gap-3'>
                  <button
                    onClick={handleCreateRoom}
                    className='bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white font-bold py-3 px-4 rounded-xl text-sm uppercase tracking-wide transition-all duration-300 transform hover:scale-105 shadow-lg'
                    style={{
                      boxShadow: '0 0 20px rgba(236, 72, 153, 0.4), 0 0 40px rgba(147, 51, 234, 0.3)',
                    }}
                  >
                    Start sharing my screen
                  </button>
                  <button className='bg-purple-800 bg-opacity-50 hover:bg-opacity-70 text-white font-bold py-3 px-4 rounded-xl text-sm uppercase tracking-wide transition-all duration-300 border border-purple-400 border-opacity-30'>
                    Stop sharing
                  </button>
                </div>

                {/* Middle Row - Recording and Diagnostics */}
                <div className='grid grid-cols-2 gap-3'>
                  <button className='bg-purple-800 bg-opacity-50 hover:bg-opacity-70 text-white font-bold py-3 px-4 rounded-xl text-sm uppercase tracking-wide transition-all duration-300 border border-purple-400 border-opacity-30'>
                    Start Recording
                  </button>
                  <button
                    onClick={() => setShowDiagnostics(!showDiagnostics)}
                    className='bg-purple-800 bg-opacity-50 hover:bg-opacity-70 text-white font-bold py-3 px-4 rounded-xl text-sm uppercase tracking-wide transition-all duration-300 border border-purple-400 border-opacity-30 flex items-center justify-center space-x-2'
                  >
                    <svg className='w-4 h-4' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                      <path
                        strokeLinecap='round'
                        strokeLinejoin='round'
                        strokeWidth={2}
                        d='M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z'
                      />
                      <path
                        strokeLinecap='round'
                        strokeLinejoin='round'
                        strokeWidth={2}
                        d='M15 12a3 3 0 11-6 0 3 3 0 016 0z'
                      />
                    </svg>
                    <span>Diagnostics</span>
                  </button>
                </div>

                {/* Bottom Row - Room Link and ID */}
                <div className='grid grid-cols-2 gap-3'>
                  <button
                    onClick={handleJoinRoom}
                    className='bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white font-bold py-3 px-4 rounded-xl text-sm uppercase tracking-wide transition-all duration-300 transform hover:scale-105 shadow-lg'
                    style={{
                      boxShadow: '0 0 20px rgba(59, 130, 246, 0.4), 0 0 40px rgba(6, 182, 212, 0.3)',
                    }}
                  >
                    Open room link (viewer)
                  </button>
                  <input
                    type='text'
                    placeholder='Paste room id here'
                    value={roomId}
                    onChange={(e) => setRoomId(e.target.value)}
                    className='bg-purple-800 bg-opacity-50 hover:bg-opacity-70 text-white placeholder-gray-300 font-bold py-3 px-4 rounded-xl text-sm uppercase tracking-wide transition-all duration-300 border border-purple-400 border-opacity-30 focus:outline-none focus:ring-2 focus:ring-purple-400 focus:ring-opacity-50'
                  />
                </div>
              </div>

              {/* Status Indicator */}
              <div className='text-center mb-6'>
                <p className='text-white text-sm font-medium'>Status: idle</p>
              </div>

              {/* Preview Sections */}
              <div className='space-y-6'>
                {/* Local Preview */}
                <div>
                  <h3 className='text-white text-sm font-bold mb-3 uppercase tracking-wide'>Local preview</h3>
                  <div className='grid grid-cols-2 gap-3'>
                    {/* Video Player Placeholder 1 */}
                    <div className='bg-purple-800 bg-opacity-40 border border-purple-400 border-opacity-30 rounded-xl p-3 flex flex-col items-center justify-center min-h-[120px]'>
                      <div className='flex items-center space-x-2 mb-2'>
                        <svg className='w-4 h-4 text-white' fill='currentColor' viewBox='0 0 24 24'>
                          <path d='M8 5v14l11-7z' />
                        </svg>
                        <span className='text-white text-xs'>0:00</span>
                      </div>
                      <div className='flex items-center space-x-2 mb-2'>
                        <svg className='w-4 h-4 text-white' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                          <path
                            strokeLinecap='round'
                            strokeLinejoin='round'
                            strokeWidth={2}
                            d='M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z'
                          />
                        </svg>
                        <svg className='w-4 h-4 text-white' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                          <path
                            strokeLinecap='round'
                            strokeLinejoin='round'
                            strokeWidth={2}
                            d='M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z'
                          />
                        </svg>
                      </div>
                      <div className='w-full h-0.5 bg-white bg-opacity-30 rounded'></div>
                    </div>

                    {/* Video Player Placeholder 2 */}
                    <div className='bg-purple-800 bg-opacity-40 border border-purple-400 border-opacity-30 rounded-xl p-3 flex flex-col items-center justify-center min-h-[120px]'>
                      <div className='flex items-center space-x-2 mb-2'>
                        <svg className='w-4 h-4 text-white' fill='currentColor' viewBox='0 0 24 24'>
                          <path d='M8 5v14l11-7z' />
                        </svg>
                        <span className='text-white text-xs'>0:00</span>
                      </div>
                      <div className='flex items-center space-x-2 mb-2'>
                        <svg className='w-4 h-4 text-white' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                          <path
                            strokeLinecap='round'
                            strokeLinejoin='round'
                            strokeWidth={2}
                            d='M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z'
                          />
                        </svg>
                        <svg className='w-4 h-4 text-white' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                          <path
                            strokeLinecap='round'
                            strokeLinejoin='round'
                            strokeWidth={2}
                            d='M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z'
                          />
                        </svg>
                      </div>
                      <div className='w-full h-0.5 bg-white bg-opacity-30 rounded'></div>
                    </div>
                  </div>
                </div>

                {/* Remote Preview */}
                <div>
                  <h3 className='text-white text-sm font-bold mb-3 uppercase tracking-wide'>Remote preview</h3>
                  <div className='bg-purple-800 bg-opacity-40 border border-purple-400 border-opacity-30 rounded-xl p-8 flex items-center justify-center min-h-[120px]'>
                    <p className='text-white text-sm opacity-60'>No remote connection</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          // Existing host/viewer views with updated styling
          <div className='w-full max-w-7xl mx-auto'>
            {/* Header for non-home views */}
            <header className='bg-black bg-opacity-30 backdrop-blur-sm border-b border-purple-500 border-opacity-30 mb-8'>
              <div className='px-4 sm:px-6 lg:px-8'>
                <div className='flex justify-between items-center h-16'>
                  <div className='flex items-center'>
                    <h1 className='text-xl font-semibold text-white'>Stupid Simple Screen Share</h1>
                    {currentView !== 'home' && <span className='ml-4 text-sm text-purple-300'>Room: {roomId}</span>}
                  </div>

                  <div className='flex items-center space-x-4'>
                    {currentView !== 'home' && (
                      <>
                        <button
                          onClick={() => setShowChat(!showChat)}
                          className={`px-3 py-1 text-sm rounded transition-all ${
                            showChat
                              ? 'bg-blue-600 text-white shadow-lg shadow-blue-500 shadow-opacity-50'
                              : 'bg-white bg-opacity-20 text-white hover:bg-opacity-30'
                          }`}
                        >
                          Chat
                        </button>
                        <button
                          onClick={() => setShowDiagnostics(!showDiagnostics)}
                          className={`px-3 py-1 text-sm rounded transition-all ${
                            showDiagnostics
                              ? 'bg-green-600 text-white shadow-lg shadow-green-500 shadow-opacity-50'
                              : 'bg-white bg-opacity-20 text-white hover:bg-opacity-30'
                          }`}
                        >
                          Diagnostics
                        </button>
                        <button
                          onClick={handleGoHome}
                          className='px-3 py-1 text-sm bg-white bg-opacity-20 text-white rounded hover:bg-opacity-30 transition-all'
                        >
                          Home
                        </button>
                      </>
                    )}
                  </div>
                </div>
              </div>
            </header>

            {/* Main Content */}
            <main className='px-4 sm:px-6 lg:px-8'>
              {currentView === 'host' && <HostView roomId={roomId} config={config} onGoHome={handleGoHome} />}

              {currentView === 'viewer' && (
                <ViewerView
                  roomId={roomId}
                  viewerId={viewerId}
                  setViewerId={setViewerId}
                  config={config}
                  onGoHome={handleGoHome}
                />
              )}
            </main>

            {/* Chat Panel */}
            {showChat && currentView !== 'home' && (
              <div className='fixed right-0 top-16 bottom-0 w-80 bg-black bg-opacity-80 backdrop-blur-sm shadow-lg border-l border-purple-500 border-opacity-30 z-50'>
                <Chat roomId={roomId} role={currentView === 'host' ? 'host' : 'viewer'} viewerId={viewerId} />
              </div>
            )}

            {/* Diagnostics Panel */}
            {showDiagnostics && currentView !== 'home' && (
              <div className='fixed left-0 top-16 bottom-0 w-80 bg-black bg-opacity-80 backdrop-blur-sm shadow-lg border-r border-purple-500 border-opacity-30 z-50'>
                <Diagnostics roomId={roomId} role={currentView === 'host' ? 'host' : 'viewer'} />
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
