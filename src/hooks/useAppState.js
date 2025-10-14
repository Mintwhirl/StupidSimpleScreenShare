import { useState, useEffect } from 'react';
import { trackEvent, trackPageView } from '../utils/analytics';

/**
 * useAppState Hook
 *
 * Manages the main application state including:
 * - Current view (home, host, viewer)
 * - Room ID and viewer ID
 * - UI panel visibility (chat, diagnostics)
 * - Navigation handlers
 */
function useAppState() {
  const [currentView, setCurrentView] = useState('home');
  const [roomId, setRoomId] = useState('');
  const [viewerId, setViewerId] = useState('');
  const [showChat, setShowChat] = useState(false);
  const [showDiagnostics, setShowDiagnostics] = useState(false);

  // Check for room parameter in URL on mount
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.has('room')) {
      const id = params.get('room');
      setRoomId(id);
      setCurrentView('viewer');
    }
  }, []);

  // Handle going back to home
  const handleGoHome = () => {
    trackEvent('navigation', { from: currentView, to: 'home' });
    trackPageView('home');
    setCurrentView('home');
    setRoomId('');
    setViewerId('');
    setShowChat(false);
    setShowDiagnostics(false);
  };

  // Handle navigation to host view
  const handleNavigateToHost = (newRoomId) => {
    setRoomId(newRoomId);
    setCurrentView('host');
    trackPageView('host');
  };

  // Handle navigation to viewer view
  const handleNavigateToViewer = (newRoomId) => {
    setRoomId(newRoomId);
    setCurrentView('viewer');
    trackPageView('viewer');
  };

  // Toggle chat panel
  const toggleChat = () => {
    setShowChat(!showChat);
  };

  // Toggle diagnostics panel
  const toggleDiagnostics = () => {
    setShowDiagnostics(!showDiagnostics);
  };

  return {
    // State
    currentView,
    roomId,
    viewerId,
    showChat,
    showDiagnostics,

    // Setters
    setRoomId,
    setViewerId,

    // Handlers
    handleGoHome,
    handleNavigateToHost,
    handleNavigateToViewer,
    toggleChat,
    toggleDiagnostics,
  };
}

export default useAppState;
