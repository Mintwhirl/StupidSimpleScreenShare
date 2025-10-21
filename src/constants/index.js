import {
  getRoomMetaKey,
  getOfferKey,
  getAnswerKey,
  getCandidateKey,
  getChatKey,
  getSenderKey,
} from '../../shared/signaling/keys.js';

/**
 * Application Constants
 * Centralized constants to prevent magic strings and improve maintainability
 */

// Connection States
export const CONNECTION_STATES = {
  DISCONNECTED: 'disconnected',
  CONNECTING: 'connecting',
  CONNECTED: 'connected',
  FAILED: 'failed',
};

// User Roles
export const ROLES = {
  HOST: 'host',
  VIEWER: 'viewer',
};

// UI States
export const UI_STATES = {
  HOME: 'home',
  HOST: 'host',
  VIEWER: 'viewer',
};

// Copy Status
export const COPY_STATUS = {
  SUCCESS: 'success',
  ERROR: 'error',
};

// Error Messages
export const ERROR_MESSAGES = {
  ROOM_NOT_FOUND: 'Room not found. Please check the room ID and make sure the host has started sharing.',
  CONNECTION_FAILED: 'Failed to connect to host. Please check the room ID and try again.',
  SCREEN_SHARE_FAILED: 'Failed to start screen sharing. Please check your browser permissions.',
  INVALID_ROOM_ID: 'Room ID must be exactly 24 characters and contain only letters and numbers',
  INVALID_VIEWER_ID: 'Viewer ID can only contain letters, numbers, spaces, hyphens, and underscores',
  CONNECTION_TIMEOUT: 'Connection timeout. Please try again.',
};

// Success Messages
export const SUCCESS_MESSAGES = {
  ROOM_CREATED: 'Room created successfully',
  CONNECTION_ESTABLISHED: 'Connected to host',
  SCREEN_SHARING_STARTED: 'Screen sharing started',
};

// UI Text
export const UI_TEXT = {
  START_SHARING: 'Start Sharing',
  STOP_SHARING: 'Stop Sharing',
  CONNECT_TO_HOST: 'Connect to Host',
  DISCONNECT: 'Disconnect',
  RECONNECT: 'Reconnect',
  COPY: 'Copy',
  COPIED: 'Copied!',
  FAILED: 'Failed!',
  CONNECTING: 'Connecting...',
  CONNECTED: 'Connected',
  DISCONNECTED: 'Disconnected',
  HOST_ONLINE: 'Host Online',
  HOST_OFFLINE: 'Host Offline',
  CONNECTING_TO_HOST: 'Connecting to Host...',
  UNKNOWN: 'Unknown',
};

// Status Colors (Tailwind classes)
export const STATUS_COLORS = {
  SUCCESS: 'text-green-600',
  WARNING: 'text-yellow-600',
  ERROR: 'text-red-600',
  INFO: 'text-blue-600',
  DEFAULT: 'text-gray-600',
};

// Background Colors (Tailwind classes)
export const BACKGROUND_COLORS = {
  SUCCESS: 'bg-green-600',
  WARNING: 'bg-yellow-600',
  ERROR: 'bg-red-600',
  INFO: 'bg-blue-600',
  DEFAULT: 'bg-gray-600',
};

// Validation Rules
export const VALIDATION_RULES = {
  ROOM_ID_LENGTH: 24,
  VIEWER_ID_MIN_LENGTH: 3,
  VIEWER_ID_MAX_LENGTH: 50,
  MESSAGE_MAX_LENGTH: 500,
  SENDER_MAX_LENGTH: 50,
};

// Polling Intervals (milliseconds)
export const POLLING_INTERVALS = {
  DEFAULT: 1000,
  REDUCED: 5000,
  CANDIDATE_TIMEOUT: 120000, // 2 minutes
  OFFER_TIMEOUT: 60000, // 1 minute
  ANSWER_TIMEOUT: 60000, // 1 minute
};

// UI Delays (milliseconds)
export const UI_DELAYS = {
  COPY_FEEDBACK: 2000,
  RECONNECT_DELAY: 1000,
};

// Redis Keys
export const REDIS_KEYS = {
  ROOM_META: getRoomMetaKey,
  ROOM_OFFER: getOfferKey,
  ROOM_ANSWER: getAnswerKey,
  ROOM_CANDIDATES: getCandidateKey,
  ROOM_CHAT: getChatKey,
  ROOM_SENDER: getSenderKey,
};

// API Endpoints
export const API_ENDPOINTS = {
  CONFIG: '/api/config',
  CREATE_ROOM: '/api/create-room',
  OFFER: '/api/offer',
  ANSWER: '/api/answer',
  CANDIDATE: '/api/candidate',
  CHAT: '/api/chat',
  DIAGNOSTICS: '/api/diagnostics',
  VIEWERS: '/api/viewers',
  REGISTER_SENDER: '/api/register-sender',
};
