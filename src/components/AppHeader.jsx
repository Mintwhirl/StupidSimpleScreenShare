import { useRoomContext } from '../contexts/RoomContext';

/**
 * AppHeader Component
 *
 * Renders the application header for non-home views.
 * Extracted from App.jsx to improve component organization.
 */
function AppHeader({ currentView, showDiagnostics, onToggleDiagnostics, onGoHome }) {
  const { roomId } = useRoomContext();
  return (
    <header className='bg-black bg-opacity-30 backdrop-blur-sm border-b border-purple-500 border-opacity-30 mb-8'>
      <div className='px-4 sm:px-6 lg:px-8'>
        <div className='flex justify-between items-center h-16'>
          <div className='flex items-center'>
            <h1 className='text-xl font-semibold text-white'>Stupid Simple Screen Share</h1>
            {currentView !== 'home' && <span className='ml-4 text-sm text-purple-300'>Room: {roomId}</span>}
          </div>

          <div className='flex items-center space-x-2 sm:space-x-3'>
            {currentView !== 'home' && (
              <>
                <button
                  onClick={onToggleDiagnostics}
                  className={`px-3 py-1 text-xs sm:text-sm rounded-xl font-bold uppercase tracking-wide transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-pink-400/60 ${
                    showDiagnostics
                      ? 'bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white shadow-lg shadow-pink-500/30'
                      : 'bg-purple-900/30 border border-purple-400/40 text-white hover:bg-purple-800/40'
                  }`}
                >
                  Diagnostics
                </button>
                <button
                  onClick={onGoHome}
                  className='px-3 py-1 text-xs sm:text-sm rounded-xl font-bold uppercase tracking-wide transition-all duration-300 text-white bg-transparent border border-purple-400/40 hover:bg-purple-800/40 focus:outline-none focus:ring-2 focus:ring-pink-400/60'
                >
                  Home
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}

export default AppHeader;
