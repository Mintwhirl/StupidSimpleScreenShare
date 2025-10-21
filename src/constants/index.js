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

export const HOST_CONNECTION_STATUS = {
  IDLE: 'idle',
  REGISTERING: 'registering-sender',
  ACQUIRING_MEDIA: 'acquiring-media',
  WAITING_FOR_VIEWER: 'waiting-for-viewer-answer',
  ANSWER_RECEIVED: 'viewer-answer-received',
  CONNECTED: 'viewer-connected',
  DISCONNECTED: 'viewer-disconnected',
  ERROR: 'error',
};

export const VIEWER_CONNECTION_STATUS = {
  READY: 'ready-for-connection',
  REGISTERING: 'registering-sender',
  WAITING_FOR_OFFER: 'waiting-for-host-offer',
  ANSWERING: 'answering-offer',
  CONNECTED: 'connected-to-host',
  DISCONNECTED: 'viewer-disconnected',
  ERROR: 'error',
};

export const VIEWER_PEER_STATUS = {
  WAITING_FOR_OFFER: 'waiting-for-offer',
  WAITING_FOR_ANSWER: 'waiting-for-answer',
  ANSWERING: 'answering',
  ANSWER_RECEIVED: 'answer-received',
  CONNECTING: 'connecting',
  CONNECTED: 'connected',
  DISCONNECTED: 'disconnected',
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

export const HOST_STATUS_LABELS = {
  [HOST_CONNECTION_STATUS.IDLE]: 'Ready to share',
  [HOST_CONNECTION_STATUS.REGISTERING]: 'Registering host with signaling server',
  [HOST_CONNECTION_STATUS.ACQUIRING_MEDIA]: 'Awaiting screen share permission',
  [HOST_CONNECTION_STATUS.WAITING_FOR_VIEWER]: 'Waiting for viewer offer',
  [HOST_CONNECTION_STATUS.ANSWER_RECEIVED]: 'Viewer answered offer',
  [HOST_CONNECTION_STATUS.CONNECTED]: 'Viewer connected',
  [HOST_CONNECTION_STATUS.DISCONNECTED]: 'Viewer disconnected',
  [HOST_CONNECTION_STATUS.ERROR]: 'Connection error',
};

export const HOST_STATUS_COLORS = {
  [HOST_CONNECTION_STATUS.IDLE]: STATUS_COLORS.INFO,
  [HOST_CONNECTION_STATUS.REGISTERING]: STATUS_COLORS.WARNING,
  [HOST_CONNECTION_STATUS.ACQUIRING_MEDIA]: STATUS_COLORS.WARNING,
  [HOST_CONNECTION_STATUS.WAITING_FOR_VIEWER]: STATUS_COLORS.WARNING,
  [HOST_CONNECTION_STATUS.ANSWER_RECEIVED]: STATUS_COLORS.INFO,
  [HOST_CONNECTION_STATUS.CONNECTED]: STATUS_COLORS.SUCCESS,
  [HOST_CONNECTION_STATUS.DISCONNECTED]: STATUS_COLORS.DEFAULT,
  [HOST_CONNECTION_STATUS.ERROR]: STATUS_COLORS.ERROR,
};

export const VIEWER_STATUS_LABELS = {
  [VIEWER_CONNECTION_STATUS.READY]: 'Ready to connect',
  [VIEWER_CONNECTION_STATUS.REGISTERING]: 'Registering with signaling server',
  [VIEWER_CONNECTION_STATUS.WAITING_FOR_OFFER]: 'Waiting for host offer',
  [VIEWER_CONNECTION_STATUS.ANSWERING]: 'Answering host offer',
  [VIEWER_CONNECTION_STATUS.CONNECTED]: 'Viewing host stream',
  [VIEWER_CONNECTION_STATUS.DISCONNECTED]: 'Disconnected from host',
  [VIEWER_CONNECTION_STATUS.ERROR]: 'Connection error',
};

export const VIEWER_STATUS_COLORS = {
  [VIEWER_CONNECTION_STATUS.READY]: STATUS_COLORS.INFO,
  [VIEWER_CONNECTION_STATUS.REGISTERING]: STATUS_COLORS.WARNING,
  [VIEWER_CONNECTION_STATUS.WAITING_FOR_OFFER]: STATUS_COLORS.WARNING,
  [VIEWER_CONNECTION_STATUS.ANSWERING]: STATUS_COLORS.INFO,
  [VIEWER_CONNECTION_STATUS.CONNECTED]: STATUS_COLORS.SUCCESS,
  [VIEWER_CONNECTION_STATUS.DISCONNECTED]: STATUS_COLORS.DEFAULT,
  [VIEWER_CONNECTION_STATUS.ERROR]: STATUS_COLORS.ERROR,
};

export const VIEWER_PEER_BADGES = {
  [VIEWER_PEER_STATUS.WAITING_FOR_OFFER]: {
    label: 'Waiting for host offer',
    className: 'bg-yellow-100 text-yellow-800',
  },
  [VIEWER_PEER_STATUS.WAITING_FOR_ANSWER]: {
    label: 'Waiting for viewer answer',
    className: 'bg-yellow-100 text-yellow-800',
  },
  [VIEWER_PEER_STATUS.ANSWERING]: {
    label: 'Answering signaling request',
    className: 'bg-blue-100 text-blue-800',
  },
  [VIEWER_PEER_STATUS.ANSWER_RECEIVED]: {
    label: 'Viewer answer received',
    className: 'bg-blue-100 text-blue-800',
  },
  [VIEWER_PEER_STATUS.CONNECTING]: {
    label: 'Negotiating connection',
    className: 'bg-indigo-100 text-indigo-800',
  },
  [VIEWER_PEER_STATUS.CONNECTED]: {
    label: 'Viewer connected',
    className: 'bg-green-100 text-green-800',
  },
  [VIEWER_PEER_STATUS.DISCONNECTED]: {
    label: 'Viewer disconnected',
    className: 'bg-gray-100 text-gray-800',
  },
  [VIEWER_PEER_STATUS.FAILED]: {
    label: 'Connection failed',
    className: 'bg-red-100 text-red-800',
  },
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
  ROOM_META: (roomId) => `room:${roomId}:meta`,
  ROOM_OFFER: (roomId) => `room:${roomId}:offer`,
  ROOM_ANSWER: (roomId) => `room:${roomId}:answer`,
  ROOM_CANDIDATES: (roomId, role, viewerId) =>
    role === ROLES.VIEWER && viewerId
      ? `room:${roomId}:${role}:${viewerId}:candidates`
      : `room:${roomId}:${role}:candidates`,
  ROOM_CHAT: (roomId) => `room:${roomId}:chat`,
  ROOM_SENDER: (roomId, senderId) => `room:${roomId}:sender:${senderId}`,
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
