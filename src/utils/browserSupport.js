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
 * @returns {Object} Compatibility check result
 */
export function checkBrowserCompatibility() {
  const compatibility = getBrowserCompatibility();

  const issues = [];
  if (!compatibility.webrtc) {
    issues.push('WebRTC is not supported');
  }
  if (!compatibility.screenShare) {
    issues.push('Screen sharing is not supported');
  }
  if (!compatibility.clipboard) {
    issues.push('Clipboard API is not supported');
  }

  return {
    compatible: issues.length === 0,
    issues,
    compatibility,
  };
}
