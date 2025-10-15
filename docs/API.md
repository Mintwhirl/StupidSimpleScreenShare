# API Documentation

## Overview

RESTful API for **one-to-one** WebRTC screen sharing with Redis-based signaling and chat functionality.

## Base URL

- **Production**: `https://stupid-simple-screen-share.vercel.app/api`
- **Current Deployment**: `https://stupid-simple-screen-share-cs4audnd7.vercel.app/api`

## Authentication

Optional authentication via `AUTH_SECRET` environment variable:

```http
x-auth-secret: your-auth-secret-here
```

## Rate Limiting

- **API calls**: 2000 requests per hour per IP
- **Chat messages**: 60 messages per minute per room+sender
- **Room creation**: 50 rooms per hour per IP

## Endpoints

### Configuration

#### `GET /api/config`

Returns client configuration and feature flags.

### Room Management

#### `POST /api/create-room`

Creates a new screen sharing room.
**Response:**

```json
{
  "roomId": "abc123def456789012345678",
  "expiresIn": 3600
}
```

### WebRTC Signaling

#### `POST /api/offer`

Stores WebRTC SDP offer for a room.
**Body:**

```json
{
  "roomId": "abc123def456789012345678",
  "desc": {
    "type": "offer",
    "sdp": "v=0\r\no=- 123456789 2 IN IP4 127.0.0.1..."
  }
}
```

#### `GET /api/offer?roomId={roomId}`

Retrieves and deletes WebRTC SDP offer for a room.
**Response:**

```json
{
  "desc": {
    "type": "offer",
    "sdp": "v=0\r\no=- 123456789 2 IN IP4 127.0.0.1..."
  }
}
```

#### `POST /api/answer`

Stores WebRTC SDP answer for a room.
**Body:**

```json
{
  "roomId": "abc123def456789012345678",
  "desc": {
    "type": "answer",
    "sdp": "v=0\r\no=- 123456789 2 IN IP4 127.0.0.1..."
  }
}
```

#### `GET /api/answer?roomId={roomId}`

Retrieves and deletes WebRTC SDP answer for a room.

#### `POST /api/candidate`

Stores WebRTC ICE candidate for a room.
**Body:**

```json
{
  "roomId": "abc123def456789012345678",
  "role": "host",
  "viewerId": "viewer123",
  "candidate": {
    "candidate": "candidate:1 1 UDP 2130706431 192.168.1.100 54400 typ host",
    "sdpMid": "0",
    "sdpMLineIndex": 0
  }
}
```

#### `GET /api/candidate?roomId={roomId}&role={role}&viewerId={viewerId}`

Retrieves and deletes WebRTC ICE candidates for a room.

### Chat System

#### `POST /api/chat`

Sends a chat message to a room.
**Body:**

```json
{
  "roomId": "abc123def456789012345678",
  "message": "Hello, world!",
  "sender": "user123"
}
```

#### `GET /api/chat?roomId={roomId}&since={timestamp}`

Retrieves chat messages for a room since timestamp.

### Diagnostics

#### `GET /api/diagnostics?roomId={roomId}`

Returns room diagnostics and server health information.

### Viewer Management

#### `GET /api/viewers?roomId={roomId}`

Returns list of active viewers for a room.

## Error Responses

All endpoints return consistent error responses:

```json
{
  "error": "Error message",
  "message": "Detailed error description"
}
```

## WebRTC Flow

1. **Host**: Creates room → Starts screen share → Creates offer → Stores offer
2. **Viewer**: Joins room → Polls for offer → Creates answer → Stores answer
3. **Both**: Exchange ICE candidates for NAT traversal
4. **Connection**: WebRTC peer-to-peer connection established

## Data Models

- **Room ID**: 24-character hex string
- **Messages**: Max 500 characters, sender max 50 characters
- **TTL**: All data expires after 1 hour
- **Viewer ID**: Unique identifier for the single viewer per room

## Security

- Input validation on all endpoints
- Rate limiting with Redis
- CORS headers configured
- Optional authentication
- No persistent storage of screen content
