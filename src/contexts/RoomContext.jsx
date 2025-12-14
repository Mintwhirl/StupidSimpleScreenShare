import { createContext, useContext, useState, useCallback } from 'react';
import { trackEvent, trackPageView } from '../utils/analytics';

const RoomContext = createContext();

export const useRoomContext = () => {
  const context = useContext(RoomContext);
  if (!context) {
    throw new Error('useRoomContext must be used within a RoomProvider');
  }
  return context;
};

export const RoomProvider = ({ children }) => {
  const [diagnosticAlerts, setDiagnosticAlerts] = useState({});

  // UI state management
  const [showDiagnostics, setShowDiagnostics] = useState(false);
  const [currentView, setCurrentView] = useState('home'); // 'home', 'host', 'viewer'

  const setDiagnosticAlert = useCallback((type, message) => {
    if (!type) return;
    setDiagnosticAlerts((prev) => {
      const next = { ...prev };
      if (!message) {
        if (next[type]) {
          delete next[type];
        }
        return next;
      }
      next[type] = { type, message, timestamp: Date.now() };
      return next;
    });
  }, []);

  const resetDiagnosticAlerts = useCallback(() => {
    setDiagnosticAlerts({});
  }, []);

  // UI state actions
  const toggleDiagnostics = useCallback(() => {
    setShowDiagnostics((prev) => !prev);
  }, []);

  const handleGoHome = useCallback(() => {
    trackEvent('navigation', { from: currentView, to: 'home' });
    trackPageView('home');
    setCurrentView('home');
    setShowDiagnostics(false);
  }, [currentView]);

  const handleNavigateToHost = useCallback(() => {
    setCurrentView('host');
    trackPageView('host');
  }, []);

  const handleNavigateToViewer = useCallback(() => {
    setCurrentView('viewer');
    trackPageView('viewer');
  }, []);

  const value = {
    // State
    diagnosticAlerts,
    showDiagnostics,
    currentView,

    // Actions
    setDiagnosticAlert,
    resetDiagnosticAlerts,
    toggleDiagnostics,
    handleGoHome,
    handleNavigateToHost,
    handleNavigateToViewer,
  };

  return <RoomContext.Provider value={value}>{children}</RoomContext.Provider>;
};

export default RoomContext;
