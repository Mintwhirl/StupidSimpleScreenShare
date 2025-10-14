/**
 * Logger Utility
 * Centralized logging with environment-aware levels
 */

const isDevelopment =
  import.meta.env.DEV ||
  import.meta.env.MODE === 'development' ||
  import.meta.env.MODE === 'test' ||
  window.location.hostname === 'localhost' ||
  window.location.hostname.includes('localhost');

// const isProduction = import.meta.env.PROD ||
//   import.meta.env.MODE === 'production';

/**
 * Log levels
 */
const LOG_LEVELS = {
  ERROR: 0,
  WARN: 1,
  INFO: 2,
  DEBUG: 3,
};

/**
 * Current log level based on environment
 */
const currentLogLevel = isDevelopment ? LOG_LEVELS.DEBUG : LOG_LEVELS.ERROR;

/**
 * Logger class
 */
class Logger {
  static error(message, ...args) {
    if (currentLogLevel >= LOG_LEVELS.ERROR) {
      console.error(`[ERROR] ${message}`, ...args);
    }
  }

  static warn(message, ...args) {
    if (currentLogLevel >= LOG_LEVELS.WARN) {
      console.warn(`[WARN] ${message}`, ...args);
    }
  }

  static info(message, ...args) {
    if (currentLogLevel >= LOG_LEVELS.INFO) {
      console.info(`[INFO] ${message}`, ...args);
    }
  }

  static debug(message, ...args) {
    if (currentLogLevel >= LOG_LEVELS.DEBUG) {
      console.debug(`[DEBUG] ${message}`, ...args);
    }
  }

  /**
   * Log WebRTC events (only in development)
   */
  static webrtc(event, data = {}) {
    if (isDevelopment) {
      console.debug(`[WebRTC] ${event}`, data);
    }
  }

  /**
   * Log API calls (only in development)
   */
  static api(method, endpoint, data = {}) {
    if (isDevelopment) {
      console.debug(`[API] ${method} ${endpoint}`, data);
    }
  }

  /**
   * Log user actions (only in development)
   */
  static user(action, data = {}) {
    if (isDevelopment) {
      console.debug(`[USER] ${action}`, data);
    }
  }
}

// Export the static class directly
export default Logger;
