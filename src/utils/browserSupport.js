/**
 * Browser Support Detection
 * Detects WebRTC and other required browser capabilities
 */

/**
 * Check if WebRTC is supported
 * @returns {boolean} True if WebRTC is supported
 */
export function isWebRTCSupported() {
  return !!(window.RTCPeerConnection || window.webkitRTCPeerConnection || window.mozRTCPeerConnection);
}

/**
 * Check if screen sharing is supported
 * @returns {boolean} True if screen sharing is supported
 */
export function isScreenShareSupported() {
  return !!(navigator.mediaDevices && navigator.mediaDevices.getDisplayMedia);
}

/**
 * Check if clipboard API is supported
 * @returns {boolean} True if clipboard API is supported
 */
export function isClipboardSupported() {
  return !!(navigator.clipboard && navigator.clipboard.writeText);
}

/**
 * Get browser compatibility information
 * @returns {Object} Browser compatibility details
 */
export function getBrowserCompatibility() {
  return {
    webrtc: isWebRTCSupported(),
    screenShare: isScreenShareSupported(),
    clipboard: isClipboardSupported(),
    userAgent: navigator.userAgent,
    platform: navigator.platform,
  };
}

/**
 * Check if browser meets minimum requirements
 * @param {string} role - User role: 'host', 'viewer', or null (pre-role selection)
 * @returns {Object} Compatibility check result
 */
export function checkBrowserCompatibility(role = null) {
  const compatibility = getBrowserCompatibility();

  const issues = [];

  // WebRTC is required for both host and viewer
  if (!compatibility.webrtc) {
    issues.push('WebRTC is not supported');
  }

  // Screen sharing is ONLY required for hosts (not viewers)
  if (role === 'host' && !compatibility.screenShare) {
    issues.push('Screen sharing is not supported - hosting requires a desktop browser');
  }

  // Clipboard is optional (nice to have but not required)
  // Don't block users if clipboard API is missing

  return {
    compatible: issues.length === 0,
    issues,
    compatibility,
  };
}
