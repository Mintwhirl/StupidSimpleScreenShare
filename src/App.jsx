import { Suspense, lazy } from 'react';
import { useApi } from './hooks/useApi';
import useAppState from './hooks/useAppState';
import { RoomProvider } from './contexts/RoomContext';
import SynthwaveBackground from './components/SynthwaveBackground';
import HomeView from './components/HomeView';
import AppHeader from './components/AppHeader';
import SidebarPanels from './components/SidebarPanels';
import LoadingState from './components/LoadingState';
import ErrorState from './components/ErrorState';

// Lazy load components for code splitting
const HostView = lazy(() => import('./components/HostView'));
const ViewerView = lazy(() => import('./components/ViewerView'));

function App() {
  const { config, loading: configLoading, error: configError } = useApi();
  const {
    currentView,
    roomId,
    showChat,
    showDiagnostics,
    setRoomId,
    handleGoHome,
    handleNavigateToHost,
    handleNavigateToViewer,
    toggleChat,
    toggleDiagnostics,
  } = useAppState();

  // Loading state
  if (configLoading) {
    return <LoadingState />;
  }

  // Error state
  if (configError) {
    return <ErrorState />;
  }

  return (
    <RoomProvider>
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
    </RoomProvider>
  );
}

export default App;
