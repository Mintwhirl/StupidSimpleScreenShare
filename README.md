# Stupid Simple Screen Share

A simple browser-based screen sharing application built with React, WebRTC, and Pusher for real-time signaling.

## Features

- **One-to-one screen sharing** - Host shares their screen with a single viewer
- **Real-time WebRTC streaming** - Direct peer-to-peer video connection
- **Pusher signaling** - Reliable real-time signaling via Pusher Channels
- **No downloads required** - Runs entirely in the browser
- **Synthwave UI** - Beautiful retro-futuristic design
- **Simple to use** - Just share a room ID to connect

## Architecture

```
[Host Browser]  <-- WebRTC P2P -->  [Viewer Browser]
       |                                |
       --- Pusher Signaling <-- [Pusher]
```

- **Frontend**: React 19 with Vite
- **Signaling**: Pusher Channels
- **Media**: Direct WebRTC connection between browsers
- **Deployment**: Vercel

## Quick Start

### 1. Clone and Install

```bash
git clone https://github.com/Mintwhirl/StupidSimpleScreenShare.git
cd StupidSimpleScreenShare
npm install
```

### 2. Set Up Pusher

1. Create a free account at [Pusher](https://dashboard.pusher.com/)
2. Create a new app with these settings:
   - Frontend: Vanilla JS
   - Backend: Node.js
   - Enable client events
3. Copy your credentials

### 3. Configure Environment

Copy `.env.example` to `.env`:

```bash
cp .env.example .env
```

Edit `.env` with your Pusher credentials:

```bash
PUSHER_APP_ID=your_app_id
PUSHER_KEY=your_key
PUSHER_SECRET=your_secret
PUSHER_CLUSTER=your_cluster
```

### 4. Run Locally

```bash
vercel dev
```

### 5. Deploy to Vercel

```bash
npm run build
vercel --prod
```

Set your environment variables in the Vercel dashboard under Settings > Environment Variables.

## Usage

### For Hosts

1. Open the app and click **Host**
2. Click **Start Sharing** and select your entire screen
3. Share the Room ID with your viewer
4. Your screen will appear on the viewer's device

### For Viewers

1. Open the app and click **View**
2. Enter the Room ID from the host
3. Click **Connect to Host**
4. The host's screen will appear automatically

### Browser Support

- **Host**: Chrome, Edge, Firefox (desktop)
- **Viewer**: Chrome, Safari, Firefox (desktop or mobile)
- Screen sharing requires HTTPS (automatic on Vercel)

## Environment Variables for Vercel

Required variables to configure in Vercel dashboard:
- `VITE_PUSHER_KEY`
- `VITE_PUSHER_CLUSTER`
- `PUSHER_APP_ID`
- `PUSHER_KEY`
- `PUSHER_SECRET`
- `PUSHER_CLUSTER`

Optional variables:
- `TURN_SERVER_URL`
- `TURN_USERNAME`
- `TURN_CREDENTIAL`

## Troubleshooting

### Connection Issues

1. **Check Pusher credentials** - Ensure they're correctly set in production
2. **Verify HTTPS** - WebRTC requires a secure connection
3. **Try different browsers** - Chrome/Firefox work best for hosting

### Screen Share Issues

1. **Grant permissions** - Allow screen sharing when prompted
2. **Select entire screen** - Don't select individual windows for best results
3. **Check browser support** - Screen sharing isn't supported on mobile browsers

## License

Creative Commons Attribution-NonCommercial-ShareAlike 4.0 International License

**Copyright © 2025 Mintwhirl Dev - Kevin Stewart**
