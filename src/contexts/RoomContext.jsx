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

  const updateRoomId = useCallback((newRoomId) => {
    setRoomId(newRoomId);
  }, []);

  const updateViewerId = useCallback((newViewerId) => {
    setViewerId(newViewerId);
  }, []);

  const updateRole = useCallback((newRole) => {
    setRole(newRole);
  }, []);

  const resetRoom = useCallback(() => {
    setRoomId('');
    setViewerId('');
    setRole('viewer');
  }, []);

  const value = {
    // State
    roomId,
    viewerId,
    role,

    // Actions
    updateRoomId,
    updateViewerId,
    updateRole,
    resetRoom,
  };

  return <RoomContext.Provider value={value}>{children}</RoomContext.Provider>;
};

export default RoomContext;
