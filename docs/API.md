# Stupid Simple Screen Share - API Documentation

## Overview

The Stupid Simple Screen Share application provides a RESTful API for managing screen sharing sessions, WebRTC signaling, and chat functionality. All endpoints are serverless functions deployed on Vercel.

## Base URL

- **Production**: `https://your-domain.vercel.app/api`
- **Development**: `http://localhost:3000/api`

## Authentication

Most endpoints require authentication via the `AUTH_SECRET` environment variable. Include the secret in the request headers:

```http
x-auth-secret: your-auth-secret-here
```

## Rate Limiting

- **API calls**: 100 requests per hour per IP
- **Chat messages**: 10 messages per minute per user
- **Room creation**: 50 rooms per hour per IP

## Endpoints

### 1. Configuration

#### `GET /api/config`

Retrieves client configuration including authentication secrets and feature flags.

**Response:**

```json
{
  "success": true,
  "config": {
    "authSecret": "your-auth-secret",
    "apiBase": "/api",
    "features": {
      "chat": true,
      "diagnostics": true,
      "viewerCount": true
    },
    "rateLimits": {
      "chat": 10,
      "api": 100
    }
  },
  "timestamp": "2024-01-01T00:00:00.000Z"
}
```

### 2. Room Management

#### `POST /api/create-room`

Creates a new screen sharing room.

**Headers:**

```http
Content-Type: application/json
x-auth-secret: your-auth-secret
```

**Response:**

```json
{
  "success": true,
  "roomId": "abc123def456789012345678",
  "message": "Room created successfully",
  "expiresAt": "2024-01-01T01:00:00.000Z"
}
```

**Error Responses:**

- `401 Unauthorized`: Invalid or missing auth secret
- `429 Too Many Requests`: Rate limit exceeded
- `500 Internal Server Error`: Server error

### 3. WebRTC Signaling

#### `POST /api/offer`

Stores a WebRTC SDP offer for a room.

**Headers:**

```http
Content-Type: application/json
x-auth-secret: your-auth-secret
```

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

**Response:**

```json
{
  "success": true,
  "message": "Offer stored successfully"
}
```

#### `GET /api/offer`

Retrieves the latest WebRTC SDP offer for a room.

**Query Parameters:**

- `roomId` (required): The room ID

**Response:**

```json
{
  "success": true,
  "desc": {
    "type": "offer",
    "sdp": "v=0\r\no=- 123456789 2 IN IP4 127.0.0.1..."
  }
}
```

#### `POST /api/answer`

Stores a WebRTC SDP answer for a room.

**Headers:**

```http
Content-Type: application/json
x-auth-secret: your-auth-secret
```

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

**Response:**

```json
{
  "success": true,
  "message": "Answer stored successfully"
}
```

#### `GET /api/answer`

Retrieves the latest WebRTC SDP answer for a room.

**Query Parameters:**

- `roomId` (required): The room ID

**Response:**

```json
{
  "success": true,
  "desc": {
    "type": "answer",
    "sdp": "v=0\r\no=- 123456789 2 IN IP4 127.0.0.1..."
  }
}
```

#### `POST /api/candidate`

Stores a WebRTC ICE candidate for a room.

**Headers:**

```http
Content-Type: application/json
x-auth-secret: your-auth-secret
```

**Body:**

```json
{
  "roomId": "abc123def456789012345678",
  "role": "host",
  "candidate": {
    "candidate": "candidate:1 1 UDP 2130706431 192.168.1.100 54400 typ host",
    "sdpMid": "0",
    "sdpMLineIndex": 0
  }
}
```

**Response:**

```json
{
  "success": true,
  "message": "ICE candidate stored successfully"
}
```

#### `GET /api/candidate`

Retrieves WebRTC ICE candidates for a room.

**Query Parameters:**

- `roomId` (required): The room ID
- `role` (required): Either "host" or "viewer"

**Response:**

```json
{
  "success": true,
  "candidates": [
    {
      "candidate": "candidate:1 1 UDP 2130706431 192.168.1.100 54400 typ host",
      "sdpMid": "0",
      "sdpMLineIndex": 0
    }
  ]
}
```

### 4. Chat System

#### `POST /api/chat`

Sends a chat message to a room.

**Headers:**

```http
Content-Type: application/json
x-auth-secret: your-auth-secret
```

**Body:**

```json
{
  "roomId": "abc123def456789012345678",
  "message": "Hello, world!",
  "sender": "user123"
}
```

**Response:**

```json
{
  "success": true,
  "message": "Message sent successfully"
}
```

#### `GET /api/chat`

Retrieves chat messages for a room.

**Query Parameters:**

- `roomId` (required): The room ID
- `since` (optional): Timestamp to get messages after (default: 0)

**Response:**

```json
{
  "success": true,
  "messages": [
    {
      "id": 1,
      "message": "Hello, world!",
      "sender": "user123",
      "timestamp": 1704067200000
    }
  ]
}
```

### 5. Diagnostics

#### `GET /api/diagnostics`

Retrieves diagnostic information for a room.

**Query Parameters:**

- `roomId` (required): The room ID

**Response:**

```json
{
  "success": true,
  "diagnostics": {
    "roomId": "abc123def456789012345678",
    "createdAt": "2024-01-01T00:00:00.000Z",
    "lastActivity": "2024-01-01T00:30:00.000Z",
    "participants": {
      "host": {
        "connected": true,
        "lastSeen": "2024-01-01T00:30:00.000Z"
      },
      "viewers": [
        {
          "id": "viewer1",
          "connected": true,
          "lastSeen": "2024-01-01T00:29:00.000Z"
        }
      ]
    },
    "messageCount": 15,
    "connectionQuality": "excellent"
  }
}
```

### 6. Viewer Management

#### `GET /api/viewers`

Retrieves the list of viewers for a room.

**Query Parameters:**

- `roomId` (required): The room ID

**Response:**

```json
{
  "success": true,
  "viewers": [
    {
      "id": "viewer1",
      "name": "John Doe",
      "joinedAt": "2024-01-01T00:15:00.000Z",
      "lastSeen": "2024-01-01T00:30:00.000Z",
      "connected": true
    }
  ],
  "count": 1
}
```

## Error Handling

All endpoints return consistent error responses:

```json
{
  "success": false,
  "error": "Error message",
  "code": "ERROR_CODE",
  "timestamp": "2024-01-01T00:00:00.000Z"
}
```

### Common Error Codes

- `INVALID_ROOM_ID`: Room ID format is invalid
- `ROOM_NOT_FOUND`: Room does not exist
- `UNAUTHORIZED`: Invalid or missing authentication
- `RATE_LIMITED`: Rate limit exceeded
- `VALIDATION_ERROR`: Request validation failed
- `INTERNAL_ERROR`: Server error

## WebRTC Flow

### Host Flow

1. **Create Room**: `POST /api/create-room`
2. **Start Screen Share**: Begin screen capture
3. **Create Offer**: Generate WebRTC offer
4. **Store Offer**: `POST /api/offer`
5. **Poll for Answer**: `GET /api/answer` (polling)
6. **Exchange ICE Candidates**: `POST /api/candidate` and `GET /api/candidate`

### Viewer Flow

1. **Join Room**: Use room ID from host
2. **Get Offer**: `GET /api/offer` (polling)
3. **Create Answer**: Generate WebRTC answer
4. **Store Answer**: `POST /api/answer`
5. **Exchange ICE Candidates**: `POST /api/candidate` and `GET /api/candidate`

## Data Models

### Room

```typescript
interface Room {
  id: string; // 24-character hex string
  createdAt: Date; // ISO timestamp
  expiresAt: Date; // ISO timestamp (1 hour TTL)
  hostConnected: boolean;
  viewerCount: number;
}
```

### Message

```typescript
interface Message {
  id: number; // Auto-incrementing
  roomId: string; // 24-character hex string
  message: string; // 1-500 characters
  sender: string; // 5-50 characters
  timestamp: number; // Unix timestamp
}
```

### WebRTC Descriptor

```typescript
interface RTCDescriptor {
  type: 'offer' | 'answer';
  sdp: string; // Session Description Protocol
}
```

### ICE Candidate

```typescript
interface ICECandidate {
  candidate: string; // ICE candidate string
  sdpMid?: string; // SDP media stream ID
  sdpMLineIndex?: number; // SDP media line index
}
```

## Rate Limiting Details

### Implementation

- Uses Upstash Redis for distributed rate limiting
- Sliding window algorithm
- Per-IP and per-user limits

### Limits

- **API**: 100 requests/hour per IP
- **Chat**: 10 messages/minute per user
- **Room Creation**: 50 rooms/hour per IP

### Headers

Rate limit information is included in response headers:

```http
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 95
X-RateLimit-Reset: 1704070800
```

## Security Considerations

### Authentication

- All sensitive endpoints require `AUTH_SECRET`
- Secrets are never exposed to client-side code
- Environment variables are used for configuration

### Input Validation

- All inputs are validated and sanitized
- Room IDs must be exactly 24 hex characters
- Messages are limited to 500 characters
- Sender names are limited to 50 characters

### Data Privacy

- No persistent storage of screen content
- Ephemeral data with automatic expiration
- Redis TTL ensures data cleanup

## Development

### Local Development

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Run tests
npm test

# Run E2E tests
npm run test:e2e
```

### Environment Variables

```bash
# Required
AUTH_SECRET=your-secret-key-here

# Optional
REDIS_URL=your-redis-url
TURN_USERNAME=your-turn-username
TURN_PASSWORD=your-turn-password
```

## Deployment

### Vercel

The application is deployed on Vercel with serverless functions:

```bash
# Deploy to production
vercel --prod

# Deploy to preview
vercel
```

### Environment Setup

1. Set `AUTH_SECRET` in Vercel environment variables
2. Configure Redis (Upstash recommended)
3. Set up TURN servers (optional)

## Monitoring

### Health Check

```http
GET /api/health
```

**Response:**

```json
{
  "status": "healthy",
  "timestamp": "2024-01-01T00:00:00.000Z",
  "version": "1.0.0"
}
```

### Metrics

- Request count and latency
- Error rates
- Room creation and usage
- Chat message volume

## Support

For issues or questions:

1. Check the [GitHub repository](https://github.com/your-repo)
2. Review the [troubleshooting guide](TROUBLESHOOTING.md)
3. Open an issue with detailed information

## Changelog

### v1.0.0

- Initial release
- WebRTC screen sharing
- Chat functionality
- Room management
- Rate limiting
- Comprehensive testing
