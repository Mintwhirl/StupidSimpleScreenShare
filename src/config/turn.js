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
  // Free TURN server for testing (may have limitations)
  {
    urls: 'turn:openrelay.metered.ca:80',
    username: 'openrelayproject',
    credential: 'openrelayproject',
  },
  {
    urls: 'turn:openrelay.metered.ca:443',
    username: 'openrelayproject',
    credential: 'openrelayproject',
  },
  {
    urls: 'turn:openrelay.metered.ca:443?transport=tcp',
    username: 'openrelayproject',
    credential: 'openrelayproject',
  },
  // Production TURN servers (if configured)
  ...(process.env.TURN_SERVERS ? JSON.parse(process.env.TURN_SERVERS) : []),
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
  return TURN_SERVERS.length > 0 && process.env.TURN_USERNAME && process.env.TURN_PASSWORD;
}

/**
 * Get connection quality based on ICE gathering state
 * @param {RTCPeerConnection} peerConnection - The peer connection to check
 * @returns {string} Connection quality ('excellent', 'good', 'poor', 'unknown')
 */
export function getConnectionQuality(peerConnection) {
  if (!peerConnection) return 'unknown';

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
 * @param {string} transportPolicy - ICE transport policy ('all' or 'relay')
 */
export function configureWebRTC(peerConnection, useTurn = false, transportPolicy = null) {
  if (!peerConnection) return;

  // Get transport policy from environment or use default
  const iceTransportPolicy = transportPolicy || process.env.ICE_TRANSPORT_POLICY || (useTurn ? 'all' : 'all');

  // Set ICE servers
  peerConnection.setConfiguration({
    iceServers: getIceServers(useTurn),
    iceCandidatePoolSize: 10,
    iceTransportPolicy,
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
