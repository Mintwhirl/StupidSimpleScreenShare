import { useApi } from './useApi';
import { useAnalytics } from './useAnalytics';

/**
 * useRoomManagement Hook
 *
 * Handles room creation and joining logic with proper analytics tracking.
 * Separates room management concerns from the main App component.
 */
function useRoomManagement() {
  const { createRoom } = useApi();
  const { trackRoomCreation, trackRoomJoining } = useAnalytics();

  // Handle room creation
  const handleCreateRoom = async () => {
    const startTime = performance.now();
    trackRoomCreation.attempt();

    try {
      const data = await createRoom();
      const endTime = performance.now();
      const duration = endTime - startTime;

      trackRoomCreation.success(data.roomId, duration);
      return data;
    } catch (error) {
      console.error('Error creating room:', error);
      trackRoomCreation.error(error);
      throw error;
    }
  };

  // Handle joining room as viewer
  const handleJoinRoom = (roomId) => {
    if (!roomId.trim()) {
      trackRoomJoining.error('no_room_id');
      throw new Error('Please enter a room ID');
    }

    trackRoomJoining.attempt();
    trackRoomJoining.success(roomId.trim());
    return roomId.trim();
  };

  return {
    handleCreateRoom,
    handleJoinRoom,
  };
}

export default useRoomManagement;
export { useRoomManagement };
