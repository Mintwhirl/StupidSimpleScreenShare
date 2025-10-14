import React, { useState, useEffect } from 'react';
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
  const { config, loading: configLoading, error: configError } = useApi();

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
      const response = await fetch('/api/create-room', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(config?.authSecret && { 'x-auth-secret': config.authSecret }),
        },
      });

      if (!response.ok) {
        throw new Error(`Failed to create room: ${response.status}`);
      }

      const data = await response.json();
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
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading configuration...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (configError) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-600 text-xl mb-4">⚠️ Configuration Error</div>
          <p className="text-gray-600 mb-4">Failed to load application configuration.</p>
          <button
            onClick={() => window.location.reload()}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <h1 className="text-xl font-semibold text-gray-900">
                Stupid Simple Screen Share
              </h1>
              {currentView !== 'home' && (
                <span className="ml-4 text-sm text-gray-500">
                  Room: {roomId}
                </span>
              )}
            </div>
            
            <div className="flex items-center space-x-4">
              {currentView !== 'home' && (
                <>
                  <button
                    onClick={() => setShowChat(!showChat)}
                    className={`px-3 py-1 text-sm rounded ${
                      showChat
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                    }`}
                  >
                    Chat
                  </button>
                  <button
                    onClick={() => setShowDiagnostics(!showDiagnostics)}
                    className={`px-3 py-1 text-sm rounded ${
                      showDiagnostics
                        ? 'bg-green-600 text-white'
                        : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                    }`}
                  >
                    Diagnostics
                  </button>
                  <button
                    onClick={handleGoHome}
                    className="px-3 py-1 text-sm bg-gray-200 text-gray-700 rounded hover:bg-gray-300"
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
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {currentView === 'home' && (
          <div className="text-center">
            <h2 className="text-3xl font-bold text-gray-900 mb-8">
              Share Your Screen Instantly
            </h2>
            
            <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
              {/* Host Section */}
              <div className="bg-white rounded-lg shadow-md p-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-4">
                  🖥️ Share Your Screen
                </h3>
                <p className="text-gray-600 mb-6">
                  Create a room and share your screen with others. Perfect for presentations, 
                  demos, or remote collaboration.
                </p>
                <button
                  onClick={handleCreateRoom}
                  className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Create Room
                </button>
              </div>

              {/* Viewer Section */}
              <div className="bg-white rounded-lg shadow-md p-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-4">
                  👀 Join a Room
                </h3>
                <p className="text-gray-600 mb-6">
                  Enter a room ID to view someone's screen. No downloads or installations required.
                </p>
                <div className="space-y-4">
                  <input
                    type="text"
                    placeholder="Enter Room ID"
                    value={roomId}
                    onChange={(e) => setRoomId(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <button
                    onClick={handleJoinRoom}
                    className="w-full bg-green-600 text-white py-3 px-4 rounded-lg hover:bg-green-700 transition-colors"
                  >
                    Join Room
                  </button>
                </div>
              </div>
            </div>

            {/* Features */}
            <div className="mt-12 grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
              <div className="text-center">
                <div className="text-2xl mb-2">⚡</div>
                <h4 className="font-semibold text-gray-900 mb-2">Instant Setup</h4>
                <p className="text-gray-600 text-sm">
                  No downloads, no installations. Works in any modern browser.
                </p>
              </div>
              <div className="text-center">
                <div className="text-2xl mb-2">🔒</div>
                <h4 className="font-semibold text-gray-900 mb-2">Secure</h4>
                <p className="text-gray-600 text-sm">
                  Peer-to-peer connections with optional authentication.
                </p>
              </div>
              <div className="text-center">
                <div className="text-2xl mb-2">💬</div>
                <h4 className="font-semibold text-gray-900 mb-2">Built-in Chat</h4>
                <p className="text-gray-600 text-sm">
                  Communicate with participants while screen sharing.
                </p>
              </div>
            </div>
          </div>
        )}

        {currentView === 'host' && (
          <HostView
            roomId={roomId}
            config={config}
            onGoHome={handleGoHome}
          />
        )}

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
        <div className="fixed right-0 top-16 bottom-0 w-80 bg-white shadow-lg border-l z-50">
          <Chat
            roomId={roomId}
            role={currentView === 'host' ? 'host' : 'viewer'}
            viewerId={viewerId}
          />
        </div>
      )}

      {/* Diagnostics Panel */}
      {showDiagnostics && currentView !== 'home' && (
        <div className="fixed left-0 top-16 bottom-0 w-80 bg-white shadow-lg border-r z-50">
          <Diagnostics
            roomId={roomId}
            role={currentView === 'host' ? 'host' : 'viewer'}
          />
        </div>
      )}
    </div>
  );
}

export default App;
