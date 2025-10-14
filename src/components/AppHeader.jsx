/**
 * AppHeader Component
 *
 * Renders the application header for non-home views.
 * Extracted from App.jsx to improve component organization.
 */
function AppHeader({ currentView, roomId, showChat, showDiagnostics, onToggleChat, onToggleDiagnostics, onGoHome }) {
  return (
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
                  onClick={onToggleChat}
                  className={`px-3 py-1 text-sm rounded transition-all ${
                    showChat
                      ? 'bg-blue-600 text-white shadow-lg shadow-blue-500 shadow-opacity-50'
                      : 'bg-white bg-opacity-20 text-white hover:bg-opacity-30'
                  }`}
                >
                  Chat
                </button>
                <button
                  onClick={onToggleDiagnostics}
                  className={`px-3 py-1 text-sm rounded transition-all ${
                    showDiagnostics
                      ? 'bg-green-600 text-white shadow-lg shadow-green-500 shadow-opacity-50'
                      : 'bg-white bg-opacity-20 text-white hover:bg-opacity-30'
                  }`}
                >
                  Diagnostics
                </button>
                <button
                  onClick={onGoHome}
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
  );
}

export default AppHeader;
