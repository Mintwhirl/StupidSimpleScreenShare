/**
 * TURN Server Configuration
 * Provides STUN and TURN servers for WebRTC connections
 */

// Default STUN servers (free, no authentication required)
const DEFAULT_STUN_SERVERS = [
  { urls: 'stun:stun.l.google.com:19302' },
  { urls: 'stun:stun1.l.google.com:19302' },
  { urls: 'stun:stun2.l.google.com:19302' },
  { urls: 'stun:stun3.l.google.com:19302' },
  { urls: 'stun:stun4.l.google.com:19302' },
];

// TURN servers (require authentication and may have costs)
const TURN_SERVERS = [
  // Example TURN server configuration
  // Replace with your actual TURN server credentials
  {
    urls: 'turn:your-turn-server.com:3478',
    username: process.env.TURN_USERNAME || 'your-username',
    credential: process.env.TURN_PASSWORD || 'your-password',
  },
  // Add more TURN servers as needed
];

/**
 * Get ICE servers configuration for WebRTC
 * @param {boolean} includeTurn - Whether to include TURN servers
 * @returns {Array} Array of ICE server configurations
 */
export function getIceServers(includeTurn = false) {
  const iceServers = [...DEFAULT_STUN_SERVERS];
  
  if (includeTurn && TURN_SERVERS.length > 0) {
    iceServers.push(...TURN_SERVERS);
  }
  
  return iceServers;
}

/**
 * Get STUN servers only (for basic connectivity)
 * @returns {Array} Array of STUN server configurations
 */
export function getStunServers() {
  return DEFAULT_STUN_SERVERS;
}

/**
 * Check if TURN servers are configured
 * @returns {boolean} True if TURN servers are available
 */
export function hasTurnServers() {
  return TURN_SERVERS.length > 0 && 
         process.env.TURN_USERNAME && 
         process.env.TURN_PASSWORD;
}

/**
 * Get connection quality based on ICE gathering state
 * @param {RTCPeerConnection} peerConnection - The peer connection to check
 * @returns {string} Connection quality ('excellent', 'good', 'poor', 'unknown')
 */
export function getConnectionQuality(peerConnection) {
  if (!peerConnection) return 'unknown';
  
  const stats = peerConnection.getStats();
  // This is a simplified implementation
  // In a real app, you'd analyze the stats for connection quality
  
  switch (peerConnection.connectionState) {
    case 'connected':
      return 'excellent';
    case 'connecting':
      return 'good';
    case 'disconnected':
    case 'failed':
      return 'poor';
    default:
      return 'unknown';
  }
}

/**
 * Configure WebRTC with optimal settings
 * @param {RTCPeerConnection} peerConnection - The peer connection to configure
 * @param {boolean} useTurn - Whether to use TURN servers
 */
export function configureWebRTC(peerConnection, useTurn = false) {
  if (!peerConnection) return;
  
  // Set ICE servers
  peerConnection.setConfiguration({
    iceServers: getIceServers(useTurn),
    iceCandidatePoolSize: 10,
    iceTransportPolicy: useTurn ? 'all' : 'all',
    bundlePolicy: 'max-bundle',
    rtcpMuxPolicy: 'require',
  });
  
  // Configure ICE gathering
  peerConnection.addEventListener('icegatheringstatechange', () => {
    console.log('ICE gathering state:', peerConnection.iceGatheringState);
  });
  
  peerConnection.addEventListener('iceconnectionstatechange', () => {
    console.log('ICE connection state:', peerConnection.iceConnectionState);
  });
}

export default {
  getIceServers,
  getStunServers,
  hasTurnServers,
  getConnectionQuality,
  configureWebRTC,
};
