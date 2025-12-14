import { useRoomContext } from '../contexts/RoomContext';

/**
 * HomeView Component
 *
 * Renders the main home screen with Host/View buttons.
 * Extracted from App.jsx to improve component organization.
 */
function HomeView() {
  const { handleNavigateToHost, handleNavigateToViewer } = useRoomContext();

  // Handle navigation
  const handleHostClick = () => {
    handleNavigateToHost();
  };

  const handleViewClick = () => {
    handleNavigateToViewer();
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
              onClick={handleHostClick}
              className='bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white font-bold py-3 px-4 rounded-xl text-sm uppercase tracking-wide transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-2xl focus:outline-none focus:ring-2 focus:ring-pink-400 focus:ring-opacity-50'
              style={{
                boxShadow: '0 0 20px rgba(236, 72, 153, 0.4), 0 0 40px rgba(147, 51, 234, 0.3)',
              }}
              aria-label='Start hosting screen share'
              onMouseEnter={(e) => {
                e.target.style.boxShadow =
                  '0 0 30px rgba(236, 72, 153, 0.8), 0 0 60px rgba(147, 51, 234, 0.6), 0 0 90px rgba(236, 72, 153, 0.4)';
              }}
              onMouseLeave={(e) => {
                e.target.style.boxShadow = '0 0 20px rgba(236, 72, 153, 0.4), 0 0 40px rgba(147, 51, 234, 0.3)';
              }}
            >
              Host
            </button>
            <button
              onClick={handleViewClick}
              className='bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white font-bold py-3 px-4 rounded-xl text-sm uppercase tracking-wide transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-2xl focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-opacity-50'
              style={{
                boxShadow: '0 0 20px rgba(59, 130, 246, 0.4), 0 0 40px rgba(6, 182, 212, 0.3)',
              }}
              aria-label='View screen share'
              onMouseEnter={(e) => {
                e.target.style.boxShadow =
                  '0 0 30px rgba(59, 130, 246, 0.8), 0 0 60px rgba(6, 182, 212, 0.6), 0 0 90px rgba(59, 130, 246, 0.4)';
              }}
              onMouseLeave={(e) => {
                e.target.style.boxShadow = '0 0 20px rgba(59, 130, 246, 0.4), 0 0 40px rgba(6, 182, 212, 0.3)';
              }}
            >
              View
            </button>
          </div>

          {/* How It Works */}
          <div className='bg-purple-900 bg-opacity-20 border border-purple-400 border-opacity-30 rounded-2xl p-5'>
            <h3 className='text-white text-sm font-bold mb-3 uppercase tracking-wide'>How it works</h3>
            <p className='font-semibold'>
              Either person can host or view. Works with Chrome, Brave, Edge, Firefox, or Safari on Windows/macOS.
            </p>
            <div>
              <p className='font-semibold text-cyan-300'>Host:</p>
              <p>Click Host - choose your entire screen - keep this tab open.</p>
            </div>
            <div>
              <p className='font-semibold text-pink-300'>Viewer:</p>
              <p>Click View - you should see the host within ~10 seconds.</p>
            </div>
            <div className='mt-3 pt-3 border-t border-purple-400 border-opacity-30'>
              <p className='text-xs opacity-75'>
                <span className='font-semibold'>Compatibility note:</span> Screen capture permission prompts vary by
                browser/OS. If you don't see video, try a different browser or disable strict tracking features.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default HomeView;
