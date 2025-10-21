# Stupid Simple Screen Share

A production-ready browser-based **one-to-one** screen sharing application built with React, WebRTC, and a stunning synthwave design theme.

## Features

- **Browser-only P2P screen sharing** - No plugins, no downloads, no accounts required
- **One-to-one connections** - One host shares screen with one viewer
- **WebRTC with STUN/TURN support** - Direct peer-to-peer connections with relay fallback
- **Built-in text chat** - Real-time two-way communication
- **Ephemeral rooms** - Automatically expire after 1 hour for privacy
- **Synthwave theme** - Retro-futuristic design with animated background
- **Rate limiting** - Upstash-powered protection (50 rooms/hour, 60 chat msgs/min, 2000 API calls/hour)
- **325 comprehensive tests** - Unit and integration tests with 71.75% code coverage

## Architecture

```
[Host Browser]  <-- P2P WebRTC (encrypted SRTP) -->  [Viewer Browser]
       |                                                      |
       --- Signaling (HTTPS) --> [Vercel + Upstash] <--------
```

- **Frontend**: React 19 with Vite
- **Signaling**: Vercel Serverless Functions + Upstash Redis
- **Media**: Direct P2P between browsers (video never touches servers)
- **Deployment**: Vercel with automated CI/CD

## Quick Start

```bash
# Clone and install
git clone https://github.com/Mintwhirl/StupidSimpleScreenShare.git
cd StupidSimpleScreenShare
npm install

# Development
npm run dev

# Production
npm run build
vercel --prod
```

## Usage

### For Hosts

1. Click "Start sharing my screen" to create a room
2. Share the room ID with your viewer
3. Click "Start Sharing" and select your screen/application
4. Use built-in chat to communicate

### For Viewers

1. Enter the room ID provided by the host
2. The host's screen will appear automatically
3. Use built-in chat to communicate

## Environment Variables

```bash
# Required for production
AUTH_SECRET=your-secure-secret-key-here
UPSTASH_REDIS_REST_URL=your-upstash-redis-url
UPSTASH_REDIS_REST_TOKEN=your-upstash-redis-token
# Optional development helpers (never use in production)
ENABLE_DEV_REDIS_FALLBACK=true # Enables in-memory Redis stub when Upstash credentials are missing
DISABLE_RATE_LIMITING=true      # Disables rate limiting middleware entirely
```

## License

Creative Commons Attribution-NonCommercial-ShareAlike 4.0 International License

**Copyright © 2025 Mintwhirl Dev - Kevin Stewart**
