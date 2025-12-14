import { Suspense, lazy } from 'react';

// Lazy load components for code splitting
const Diagnostics = lazy(() => import('./Diagnostics'));

/**
 * SidebarPanels Component
 *
 * Renders the diagnostics sidebar panel.
 * Extracted from App.jsx to improve component organization.
 */
function SidebarPanels({ currentView, showDiagnostics }) {
  return (
    <>
      {/* Diagnostics Panel */}
      {showDiagnostics && currentView !== 'home' && (
        <div className='fixed left-0 top-16 bottom-0 w-80 bg-black bg-opacity-80 backdrop-blur-sm shadow-lg border-r border-purple-500 border-opacity-30 z-50'>
          <Suspense fallback={<div className='text-center text-white p-4'>Loading diagnostics...</div>}>
            <Diagnostics role={currentView === 'host' ? 'host' : 'viewer'} />
          </Suspense>
        </div>
      )}
    </>
  );
}

export default SidebarPanels;
