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

  const value = {
    // State
    roomId,
    viewerId,
    role,
    senderSecret,

    // Actions
    updateRoomId,
    updateViewerId,
    updateRole,
    updateSenderSecret,
    resetRoom,
  };

  return <RoomContext.Provider value={value}>{children}</RoomContext.Provider>;
};

export default RoomContext;
