# Stupid Simple Screen Share

A production-ready browser-based screen sharing application using WebRTC peer-to-peer connections.

## Features

### Core Functionality
- Browser-only P2P screen sharing - No plugins, no downloads, no accounts required
- WebRTC with STUN support - Direct peer-to-peer connections for optimal performance
- Ephemeral rooms - Automatically expire after 30 minutes for privacy
- Real-time connection quality monitoring - RTT, packet loss, and connection state indicators

### Advanced Features
- Screen recording - Record your screen share with MediaRecorder API (VP9/VP8/WebM)
- Multi-viewer support - Multiple viewers can watch a single host simultaneously
- Live viewer count - See how many people are watching in real-time
- Built-in text chat - Communicate without needing external tools
- Network diagnostics - Comprehensive testing tool for troubleshooting connections
- Auto-reconnection - Viewers automatically reconnect on temporary network issues

### Security & Quality
- Comprehensive input validation - All user inputs sanitized and validated
- Enterprise-grade error handling - Graceful failures with user-friendly messages
- Security hardening - XSS prevention, length limits, cryptographically secure IDs
- Accessibility - Full ARIA labels, keyboard navigation, screen reader support
- Rate limiting - Upstash-powered rate limiting (10 rooms/hour, 60 chat msgs/min, 1000 API calls/min)

## Architecture

```
[Host Browser]  <-- P2P WebRTC (encrypted SRTP) -->  [Viewer Browser(s)]
       |                                                      |
       |                                                      |
       --- Signaling (HTTPS) --> [Vercel + Upstash] <--------
```

- Signaling: Vercel Serverless Functions + Upstash Redis (WebRTC negotiation only)
- Media: Direct P2P between browsers (video never touches servers)
- Encryption: SRTP for media, HTTPS for signaling

## Deployment

### Prerequisites
- Vercel account (free tier works)
- Upstash Redis database (free tier works)
- GitHub account

### Step 1: Upstash Redis Setup

1. Create a free account at https://upstash.com/
2. Create a new Redis database (select any region)
3. Copy your credentials:
   - `UPSTASH_REDIS_REST_URL`
   - `UPSTASH_REDIS_REST_TOKEN`

### Step 2: Deploy to Vercel

#### Option A: Deploy Button (Easiest)
[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/YourUsername/YourRepo)

#### Option B: Manual Deployment
1. Fork or clone this repository
2. Push to your GitHub account
3. Go to https://vercel.com and import your repository
4. Add environment variables:
   ```
   UPSTASH_REDIS_REST_URL=your_url_here
   UPSTASH_REDIS_REST_TOKEN=your_token_here

   # Optional but recommended for private deployments:
   AUTH_SECRET=generate_random_string_here
   ```

   Generate AUTH_SECRET with: `openssl rand -hex 32`

5. If you set AUTH_SECRET, update `/public/client.js` line 9:
   ```javascript
   const AUTH_SECRET = 'your-secret-here'; // Must match server
   ```

6. Deploy

### Step 3: Verify Deployment

1. Open your deployed URL
2. Click "Diagnostics" to run system health checks
3. Verify all checks pass (WebRTC support, STUN connectivity, Redis connection)

### Step 4: Configure Vercel Cron Job

The weekly health check cron job keeps your Upstash Redis database active:

1. Vercel automatically deploys the cron job from `vercel.json`
2. It runs every Monday at midnight (UTC)
3. Verify in Vercel Dashboard > Your Project > Cron Jobs

## Usage Guide

### As a Host (Screen Sharer)

1. Start Sharing
   - Click "Start sharing my screen"
   - Select which screen/window/tab to share
   - Your preview appears, and you get a shareable link

2. Share the Link
   - Click "Copy Link" button
   - Send to viewers via any messaging platform
   - Monitor active viewer count in real-time

3. Optional: Record
   - Click "Start Recording" while sharing
   - Recording saves as `.webm` file when you stop

4. Use Chat
   - Type messages to communicate with viewers
   - All participants see the chat in real-time

5. Stop Sharing
   - Click "Stop sharing" when done
   - All connections close gracefully

### As a Viewer

1. Join Session
   - Open the link provided by the host
   - Video automatically starts (may take 5-10 seconds)

2. Monitor Connection
   - Check connection quality indicator
   - Green = Excellent, Yellow = Good, Red = Poor

3. Use Chat
   - Communicate with host and other viewers
   - Enter your name when prompted

4. Auto-Reconnect
   - If connection drops, app automatically tries to reconnect (up to 3 attempts)

## Troubleshooting

### Connection Issues

1. Run Diagnostics
   - Click "Diagnostics" button
   - Review all checks (browser support, STUN, server, room status)

2. Common Issues
   - "Cannot connect to STUN servers": Firewall/corporate network blocking UDP
     - Solution: Connect to different network or set up TURN relay
   - "Connection failed": Symmetric NAT or strict firewall
     - Solution: One participant should use mobile hotspot or VPN
   - "Room expired": Session older than 30 minutes
     - Solution: Create a new room

3. Browser Compatibility
   - Supported: Chrome/Edge (recommended), Firefox, Safari
   - Not supported: IE

### Performance Tips

- Close unnecessary browser tabs
- Use wired internet connection if possible
- Disable browser extensions that may interfere
- Check "Connection Quality" indicator during session

## Security & Privacy

- Ephemeral: All data expires after 30 minutes
- Encrypted: WebRTC uses SRTP encryption for video
- Unguessable IDs: Cryptographically secure random room IDs (24 hex characters)
- No persistence: No video data stored on servers
- Input validation: All user inputs sanitized to prevent XSS/injection attacks
- Rate limiting: Upstash-powered rate limiting prevents abuse
- Optional auth: Set AUTH_SECRET to prevent unauthorized room creation
- Weekly health check: Vercel cron job keeps Redis database active

## Production Features

### Included
- Rate limiting - Upstash-powered (10 rooms/hour per IP)
- Analytics - Vercel Analytics integrated
- TURN support ready - See TURN_SETUP.md for configuration
- Auth protection - Optional AUTH_SECRET for private deployments
- Weekly health check - Automated Redis database activity

### Optional Additions

1. TURN Server (for strict NATs) - See `TURN_SETUP.md`
2. Custom Domain - Add via Vercel dashboard (SSL automatic)
3. Automated Testing - See TODO.md for implementation plan

## Project Structure

```
├── api/                    # Vercel Serverless Functions
│   ├── cron/              # Cron job endpoints
│   │   └── health.js      # Weekly health check
│   ├── _utils.js          # Shared validation & utilities
│   ├── create-room.js     # Room creation endpoint
│   ├── offer.js           # WebRTC offer signaling
│   ├── answer.js          # WebRTC answer signaling
│   ├── candidate.js       # ICE candidate exchange
│   ├── chat.js            # Text chat functionality
│   ├── viewers.js         # Viewer presence tracking
│   └── diagnostics.js     # Network diagnostics
├── public/                # Static frontend files
│   ├── index.html         # Single-page application
│   └── client.js          # Frontend logic (vanilla JS)
├── package.json           # Dependencies
├── vercel.json            # Vercel configuration (includes cron)
├── .env                   # Local environment variables
├── README.md              # This file
├── TURN_SETUP.md          # TURN relay server setup guide
├── COSTS_AND_LIMITS.md    # Detailed cost breakdown
└── TODO.md                # Development roadmap
```

## Contributing

This project follows professional development practices:
- Comprehensive input validation
- Consistent error handling
- Security best practices
- Clear code documentation
- Accessibility standards (WCAG 2.1)

Pull requests welcome. Please maintain the code quality standards.

## Costs & Limits

TL;DR: $0/month for personal use (few hours/month)

All services used are free tier:
- Vercel: 100 GB bandwidth/month (API only, video is P2P)
- Upstash: 10k commands/day (you'll use ~50-100 per session)
- Video traffic: Peer-to-peer (doesn't hit servers at all)
- Cron job: Included in Vercel free tier

See `COSTS_AND_LIMITS.md` for detailed breakdown and monitoring guide.

## License

CC BY-NC-SA 4.0 (Creative Commons Attribution-NonCommercial-ShareAlike 4.0)

- Free for personal/educational use
- Can view and modify code
- Must credit original author
- Cannot use commercially without permission

Want to use commercially? Contact for licensing.

## Acknowledgments

Built with:
- WebRTC - Real-time communication
- Vercel - Serverless deployment
- Upstash - Redis database
- Claude Code - AI-assisted development

---

Note: This started as "stupid simple" and evolved into a production-ready application with enterprise-grade code quality. The name remains as a reminder that simplicity and quality aren't mutually exclusive.
