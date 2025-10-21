const REQUIRED_ROOM_MESSAGE = 'roomId is required to build signaling keys';
const REQUIRED_ROLE_MESSAGE = 'role is required to build signaling keys';

function assertRoomId(roomId) {
  if (!roomId || typeof roomId !== 'string') {
    throw new Error(REQUIRED_ROOM_MESSAGE);
  }
  return roomId.trim();
}

function assertRole(role) {
  if (!role || typeof role !== 'string') {
    throw new Error(REQUIRED_ROLE_MESSAGE);
  }
  return role.trim();
}

export function getRoomMetaKey(roomId) {
  const id = assertRoomId(roomId);
  return `room:${id}:meta`;
}

export function getOfferKey(roomId) {
  const id = assertRoomId(roomId);
  return `room:${id}:offer`;
}

export function getAnswerKey(roomId) {
  const id = assertRoomId(roomId);
  return `room:${id}:answer`;
}

export function getDescriptorKey(roomId, type) {
  const normalizedType = (type || '').trim();
  if (!normalizedType) {
    throw new Error('Descriptor type is required');
  }
  if (!['offer', 'answer'].includes(normalizedType)) {
    throw new Error(`Unsupported descriptor type: ${normalizedType}`);
  }
  return normalizedType === 'offer' ? getOfferKey(roomId) : getAnswerKey(roomId);
}

export function getCandidateKey(roomId, role, viewerId = null) {
  const id = assertRoomId(roomId);
  const normalizedRole = assertRole(role);
  const base = `room:${id}:${normalizedRole}`;

  if (normalizedRole === 'viewer' && viewerId) {
    return `${base}:${String(viewerId).trim()}:candidates`;
  }

  return `${base}:candidates`;
}

export function getSenderKey(roomId, senderId) {
  const id = assertRoomId(roomId);
  const normalizedSender = String(senderId ?? '').trim();
  if (!normalizedSender) {
    throw new Error('senderId is required to build signaling keys');
  }
  return `room:${id}:sender:${normalizedSender}`;
}

export function getChatKey(roomId) {
  const id = assertRoomId(roomId);
  return `room:${id}:chat`;
}

export function resolveSenderId(role, viewerId) {
  const normalizedRole = assertRole(role);
  if (normalizedRole === 'viewer' && viewerId) {
    return String(viewerId).trim();
  }
  return normalizedRole;
}

export default {
  getRoomMetaKey,
  getOfferKey,
  getAnswerKey,
  getDescriptorKey,
  getCandidateKey,
  getSenderKey,
  getChatKey,
  resolveSenderId,
};
