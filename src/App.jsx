import { Suspense, lazy, useEffect, useState } from 'react';
import { useApi } from './hooks/useApi';
import { RoomProvider, useRoomContext } from './contexts/RoomContext';
import { checkBrowserCompatibility } from './utils/browserSupport';
import SynthwaveBackground from './components/SynthwaveBackground';
import HomeView from './components/HomeView';
import AppHeader from './components/AppHeader';
import SidebarPanels from './components/SidebarPanels';
import LoadingState from './components/LoadingState';
import ErrorState from './components/ErrorState';

// Lazy load components for code splitting
const HostView = lazy(() => import('./components/HostView'));
const ViewerView = lazy(() => import('./components/ViewerView'));

function AppContent() {
  const { config, loading: configLoading, error: configError } = useApi();
  const [browserCompatible, setBrowserCompatible] = useState(true);
  const [browserIssues, setBrowserIssues] = useState([]);

  // Check browser compatibility on mount
  useEffect(() => {
    const compatibility = checkBrowserCompatibility();
    setBrowserCompatible(compatibility.compatible);
    setBrowserIssues(compatibility.issues);
  }, []);

  // Get all state from context (eliminates prop drilling)
  const {
    currentView,
    showChat,
    showDiagnostics,
    handleGoHome,
    handleNavigateToHost,
    handleNavigateToViewer,
    toggleChat,
    toggleDiagnostics,
  } = useRoomContext();

  // Browser compatibility check
  if (!browserCompatible) {
    return (
      <div className='min-h-screen flex items-center justify-center bg-gray-900 text-white'>
        <div className='text-center p-8'>
          <div className='text-6xl mb-4'>⚠️</div>
          <h1 className='text-2xl font-bold mb-4'>Unsupported Browser</h1>
          <p className='text-gray-300 mb-4'>Your browser doesn't support the required features:</p>
          <ul className='text-left text-gray-400 mb-6'>
            {browserIssues.map((issue, index) => (
              <li key={index}>• {issue}</li>
            ))}
          </ul>
          <p className='text-gray-300'>Please use a modern browser like Chrome, Firefox, or Safari.</p>
        </div>
      </div>
    );
  }

  // Loading state
  if (configLoading) {
    return <LoadingState />;
  }

  // Error state
  if (configError) {
    return <ErrorState />;
  }

  return (
    <div className='min-h-screen relative overflow-hidden'>
      {/* Synthwave Background */}
      <SynthwaveBackground />

      {/* Main App Content */}
      <div className='relative z-10 min-h-screen flex items-center justify-center p-4'>
        {currentView === 'home' ? (
          <HomeView
            roomId={roomId}
            setRoomId={setRoomId}
            onNavigateToHost={handleNavigateToHost}
            onNavigateToViewer={handleNavigateToViewer}
            showDiagnostics={showDiagnostics}
            setShowDiagnostics={toggleDiagnostics}
          />
        ) : (
          <div className='w-full max-w-7xl mx-auto'>
            {/* Header for non-home views */}
            <AppHeader
              currentView={currentView}
              showChat={showChat}
              showDiagnostics={showDiagnostics}
              onToggleChat={toggleChat}
              onToggleDiagnostics={toggleDiagnostics}
              onGoHome={handleGoHome}
            />

            {/* Main Content */}
            <main className='px-4 sm:px-6 lg:px-8'>
              <Suspense fallback={<div className='text-center text-white'>Loading...</div>}>
                {currentView === 'host' && <HostView config={config} onGoHome={handleGoHome} />}

                {currentView === 'viewer' && <ViewerView config={config} onGoHome={handleGoHome} />}
              </Suspense>
            </main>

            {/* Sidebar Panels */}
            <SidebarPanels currentView={currentView} showChat={showChat} showDiagnostics={showDiagnostics} />
          </div>
        )}
      </div>

      {/* Copyright Notice */}
      <footer className='fixed bottom-0 left-0 right-0 z-0 pointer-events-none'>
        <div className='text-center py-2'>
          <p className='text-purple-400 text-sm opacity-60 font-mono'>© 2025 Mintwhirl Dev - Kevin Stewart</p>
        </div>
      </footer>
    </div>
  );
}

function App() {
  return (
    <RoomProvider>
      <AppContent />
    </RoomProvider>
  );
}

export default App;
