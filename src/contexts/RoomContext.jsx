import { createContext, useContext, useState, useCallback } from 'react';

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

  // UI state management (moved from App.jsx to eliminate prop drilling)
  const [showChat, setShowChat] = useState(false);
  const [showDiagnostics, setShowDiagnostics] = useState(false);
  const [currentView, setCurrentView] = useState('home'); // 'home', 'host', 'viewer'

  const updateRoomId = useCallback((newRoomId) => {
    setRoomId(newRoomId);
  }, []);

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
  }, []);

  // UI state actions (moved from App.jsx to eliminate prop drilling)
  const toggleChat = useCallback(() => {
    setShowChat((prev) => !prev);
  }, []);

  const toggleDiagnostics = useCallback(() => {
    setShowDiagnostics((prev) => !prev);
  }, []);

  const handleGoHome = useCallback(() => {
    setCurrentView('home');
    setShowChat(false);
    setShowDiagnostics(false);
  }, []);

  const handleNavigateToHost = useCallback(() => {
    setCurrentView('host');
    setRole('host');
  }, []);

  const handleNavigateToViewer = useCallback(() => {
    setCurrentView('viewer');
    setRole('viewer');
  }, []);

  const value = {
    // State
    roomId,
    viewerId,
    role,
    senderSecret,
    showChat,
    showDiagnostics,
    currentView,

    // Actions
    updateRoomId,
    updateViewerId,
    updateRole,
    updateSenderSecret,
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
