import { useRoomManagement } from '../hooks/useRoomManagement';
import { useRoomContext } from '../contexts/RoomContext';

/**
 * HomeView Component
 *
 * Renders the main home screen with room creation and joining functionality.
 * Extracted from App.jsx to improve component organization.
 */
function HomeView({ onNavigateToHost, onNavigateToViewer }) {
  const { roomId, updateRoomId, toggleDiagnostics } = useRoomContext();
  const { handleCreateRoom, handleJoinRoom } = useRoomManagement();

  // Handle room creation
  const handleCreateRoomClick = async () => {
    try {
      const data = await handleCreateRoom();
      updateRoomId(data.roomId);
      onNavigateToHost();
    } catch (error) {
      console.error('Room creation error:', error);
      alert(`Failed to create room: ${error.message}. Please try again.`);
    }
  };

  // Handle room joining
  const handleJoinRoomClick = () => {
    try {
      const validRoomId = handleJoinRoom(roomId);
      onNavigateToViewer(validRoomId);
    } catch (error) {
      alert(error.message);
    }
  };

  // Handle stop sharing
  const handleStopSharing = () => {
    // This will be implemented when we have the WebRTC connection
    // For now, just go back to home
    onNavigateToHost('');
  };

  // Handle start recording
  const handleStartRecording = () => {
    // This will be implemented when we add recording functionality
    alert('Recording functionality will be implemented soon!');
  };

  return (
    <div className='w-full max-w-md lg:max-w-lg xl:max-w-xl mx-auto'>
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
              onClick={handleCreateRoomClick}
              className='bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white font-bold py-3 px-4 rounded-xl text-sm uppercase tracking-wide transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-2xl focus:outline-none focus:ring-2 focus:ring-pink-400 focus:ring-opacity-50'
              style={{
                boxShadow: '0 0 20px rgba(236, 72, 153, 0.4), 0 0 40px rgba(147, 51, 234, 0.3)',
              }}
              aria-label='Start sharing your screen to create a new room'
              onMouseEnter={(e) => {
                e.target.style.boxShadow =
                  '0 0 30px rgba(236, 72, 153, 0.8), 0 0 60px rgba(147, 51, 234, 0.6), 0 0 90px rgba(236, 72, 153, 0.4)';
              }}
              onMouseLeave={(e) => {
                e.target.style.boxShadow = '0 0 20px rgba(236, 72, 153, 0.4), 0 0 40px rgba(147, 51, 234, 0.3)';
              }}
            >
              Start sharing my screen
            </button>
            <button
              onClick={handleStopSharing}
              className='bg-purple-800 bg-opacity-50 hover:bg-opacity-70 text-white font-bold py-3 px-4 rounded-xl text-sm uppercase tracking-wide transition-all duration-300 border border-purple-400 border-opacity-30 focus:outline-none focus:ring-2 focus:ring-purple-400 focus:ring-opacity-50'
              aria-label='Stop screen sharing and return to home'
            >
              Stop sharing
            </button>
          </div>

          {/* Middle Row - Recording and Diagnostics */}
          <div className='grid grid-cols-2 gap-3'>
            <button
              onClick={handleStartRecording}
              className='bg-purple-800 bg-opacity-50 hover:bg-opacity-70 text-white font-bold py-3 px-4 rounded-xl text-sm uppercase tracking-wide transition-all duration-300 border border-purple-400 border-opacity-30 focus:outline-none focus:ring-2 focus:ring-purple-400 focus:ring-opacity-50'
              aria-label='Start recording the screen sharing session'
            >
              Start Recording
            </button>
            <button
              onClick={toggleDiagnostics}
              className='bg-purple-800 bg-opacity-50 hover:bg-opacity-70 text-white font-bold py-3 px-4 rounded-xl text-sm uppercase tracking-wide transition-all duration-300 border border-purple-400 border-opacity-30 flex items-center justify-center space-x-2 focus:outline-none focus:ring-2 focus:ring-purple-400 focus:ring-opacity-50'
              aria-label='Toggle diagnostics panel to view connection information'
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
              onClick={handleJoinRoomClick}
              className='bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white font-bold py-3 px-4 rounded-xl text-sm uppercase tracking-wide transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-2xl focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-opacity-50'
              style={{
                boxShadow: '0 0 20px rgba(59, 130, 246, 0.4), 0 0 40px rgba(6, 182, 212, 0.3)',
              }}
              aria-label='Join a room as a viewer to watch screen sharing'
              onMouseEnter={(e) => {
                e.target.style.boxShadow =
                  '0 0 30px rgba(59, 130, 246, 0.8), 0 0 60px rgba(6, 182, 212, 0.6), 0 0 90px rgba(59, 130, 246, 0.4)';
              }}
              onMouseLeave={(e) => {
                e.target.style.boxShadow = '0 0 20px rgba(59, 130, 246, 0.4), 0 0 40px rgba(6, 182, 212, 0.3)';
              }}
            >
              Open room link (viewer)
            </button>
            <input
              type='text'
              placeholder='Paste room id here'
              value={roomId}
              onChange={(e) => updateRoomId(e.target.value)}
              className='bg-purple-800 bg-opacity-50 hover:bg-opacity-70 text-white placeholder-gray-300 font-bold py-3 px-4 rounded-xl text-sm uppercase tracking-wide transition-all duration-300 border border-purple-400 border-opacity-30 focus:outline-none focus:ring-2 focus:ring-purple-400 focus:ring-opacity-50'
              aria-label='Enter room ID to join a screen sharing session'
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
            <div className='grid grid-cols-1 sm:grid-cols-2 gap-3'>
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
  );
}

export default HomeView;
