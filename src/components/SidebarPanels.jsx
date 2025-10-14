import { Suspense, lazy } from 'react';
import { useRoomContext } from '../contexts/RoomContext';

// Lazy load components for code splitting
const Chat = lazy(() => import('./Chat'));
const Diagnostics = lazy(() => import('./Diagnostics'));

/**
 * SidebarPanels Component
 *
 * Renders the chat and diagnostics sidebar panels.
 * Extracted from App.jsx to improve component organization.
 */
function SidebarPanels({ currentView, showChat, showDiagnostics }) {
  const { roomId, viewerId } = useRoomContext();
  return (
    <>
      {/* Chat Panel */}
      {showChat && currentView !== 'home' && (
        <div className='fixed right-0 top-16 bottom-0 w-80 bg-black bg-opacity-80 backdrop-blur-sm shadow-lg border-l border-purple-500 border-opacity-30 z-50'>
          <Suspense fallback={<div className='text-center text-white p-4'>Loading chat...</div>}>
            <Chat roomId={roomId} role={currentView === 'host' ? 'host' : 'viewer'} viewerId={viewerId} />
          </Suspense>
        </div>
      )}

      {/* Diagnostics Panel */}
      {showDiagnostics && currentView !== 'home' && (
        <div className='fixed left-0 top-16 bottom-0 w-80 bg-black bg-opacity-80 backdrop-blur-sm shadow-lg border-r border-purple-500 border-opacity-30 z-50'>
          <Suspense fallback={<div className='text-center text-white p-4'>Loading diagnostics...</div>}>
            <Diagnostics roomId={roomId} role={currentView === 'host' ? 'host' : 'viewer'} />
          </Suspense>
        </div>
      )}
    </>
  );
}

export default SidebarPanels;
