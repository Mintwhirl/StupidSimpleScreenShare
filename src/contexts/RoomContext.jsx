import { createContext, useContext, useState, useCallback, useEffect } from 'react';
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
  const [roomId, setRoomId] = useState('');
  const [viewerId, setViewerId] = useState('');
  const [role, setRole] = useState('viewer'); // 'host' or 'viewer'
  const [senderSecret, setSenderSecret] = useState(null); // Secret for chat authentication
  const [diagnosticAlerts, setDiagnosticAlerts] = useState({});

  // UI state management (moved from App.jsx to eliminate prop drilling)
  const [showChat, setShowChat] = useState(false);
  const [showDiagnostics, setShowDiagnostics] = useState(false);
  const [currentView, setCurrentView] = useState('home'); // 'home', 'host', 'viewer'

  const updateRoomId = useCallback((newRoomId) => {
    setRoomId(newRoomId);
  }, []);

  // Check for room parameter in URL on mount (from useAppState)
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.has('room')) {
      const id = params.get('room');
      updateRoomId(id);
      setCurrentView('viewer');
    }
  }, [updateRoomId]);

  const updateViewerId = useCallback((newViewerId) => {
    setViewerId(newViewerId);
  }, []);

  const updateRole = useCallback((newRole) => {
    setRole(newRole);
  }, []);

  const updateSenderSecret = useCallback((newSecret) => {
    setSenderSecret(newSecret);
  }, []);

  const resetRoom = useCallback(() => {
    setRoomId('');
    setViewerId('');
    setRole('viewer');
    setSenderSecret(null);
    setDiagnosticAlerts({});
  }, []);

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

  // UI state actions (moved from App.jsx to eliminate prop drilling)
  const toggleChat = useCallback(() => {
    setShowChat((prev) => !prev);
  }, []);

  const toggleDiagnostics = useCallback(() => {
    setShowDiagnostics((prev) => !prev);
  }, []);

  const handleGoHome = useCallback(() => {
    trackEvent('navigation', { from: currentView, to: 'home' });
    trackPageView('home');
    setCurrentView('home');
    setRoomId('');
    setViewerId('');
    setShowChat(false);
    setShowDiagnostics(false);
  }, [currentView]);

  const handleNavigateToHost = useCallback(
    (newRoomId) => {
      if (newRoomId) {
        updateRoomId(newRoomId);
      }
      setCurrentView('host');
      setRole('host');
      trackPageView('host');
    },
    [updateRoomId]
  );

  const handleNavigateToViewer = useCallback(
    (newRoomId) => {
      if (newRoomId) {
        updateRoomId(newRoomId);
      }
      setCurrentView('viewer');
      setRole('viewer');
      trackPageView('viewer');
    },
    [updateRoomId]
  );

  const value = {
    // State
    roomId,
    viewerId,
    role,
    senderSecret,
    diagnosticAlerts,
    showChat,
    showDiagnostics,
    currentView,

    // Actions
    updateRoomId,
    updateViewerId,
    updateRole,
    updateSenderSecret,
    setDiagnosticAlert,
    resetDiagnosticAlerts,
    resetRoom,
    toggleChat,
    toggleDiagnostics,
    handleGoHome,
    handleNavigateToHost,
    handleNavigateToViewer,
  };

  return <RoomContext.Provider value={value}>{children}</RoomContext.Provider>;
};

export default RoomContext;
