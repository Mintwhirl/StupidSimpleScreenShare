import { useApi } from './useApi';

/**
 * useRoomManagement Hook
 *
 * Handles room creation and joining logic.
 * Separates room management concerns from the main App component.
 */
function useRoomManagement() {
  const { createRoom } = useApi();

  // Handle room creation
  const handleCreateRoom = async () => {
    try {
      const data = await createRoom();
      return data;
    } catch (error) {
      console.error('Error creating room:', error);
      throw error;
    }
  };

  // Handle joining room as viewer
  const handleJoinRoom = (roomId) => {
    if (!roomId.trim()) {
      throw new Error('Please enter a room ID');
    }

    return roomId.trim();
  };

  return {
    handleCreateRoom,
    handleJoinRoom,
  };
}

export default useRoomManagement;
export { useRoomManagement };
