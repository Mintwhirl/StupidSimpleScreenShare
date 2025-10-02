# Stupid Simple Screen Share

A professional, production-ready browser-based screen sharing application with WebRTC P2P connections.

## ✨ Features

### Core Functionality
- **Browser-only P2P screen sharing** - No plugins, no downloads, no accounts required
- **WebRTC with STUN/TURN support** - Direct peer-to-peer connections for optimal performance
- **Ephemeral rooms** - Automatically expire after 30 minutes for privacy
- **Real-time connection quality monitoring** - RTT, packet loss, and connection state indicators

### Advanced Features
- **Screen recording** - Record your screen share with MediaRecorder API (VP9/VP8/WebM)
- **Multi-viewer support** - Multiple viewers can watch a single host simultaneously
- **Live viewer count** - See how many people are watching in real-time
- **Built-in text chat** - Communicate without needing external tools
- **Network diagnostics** - Comprehensive testing tool for troubleshooting connections
- **Auto-reconnection** - Viewers automatically reconnect on temporary network issues

### Professional Quality
- ✅ **Comprehensive input validation** - All user inputs sanitized and validated
- ✅ **Enterprise-grade error handling** - Graceful failures with user-friendly messages
- ✅ **Security hardening** - XSS prevention, length limits, cryptographically secure IDs
- ✅ **Accessibility** - Full ARIA labels, keyboard navigation, screen reader support
- ✅ **Best practices** - DRY principles, async error wrapping, proper HTTP status codes

## 🏗️ Architecture

```
[Host Browser]  <-- P2P WebRTC (encrypted SRTP) -->  [Viewer Browser(s)]
       ↑                                                      ↑
       |                                                      |
       └─── Signaling (HTTPS) ──→ [Vercel + Upstash] ←──────┘
```

- **Signaling**: Vercel Serverless Functions + Upstash Redis (WebRTC negotiation only)
- **Media**: Direct P2P between browsers (video never touches servers)
- **Encryption**: SRTP for media, HTTPS for signaling

## 🚀 Deployment

### Prerequisites
- [Vercel account](https://vercel.com) (free tier works)
- [Upstash Redis database](https://upstash.com) (free tier works)
- GitHub account

### Step 1: Upstash Redis Setup

1. Create a free account at [Upstash](https://upstash.com/)
2. Create a new Redis database (select any region)
3. Copy your credentials:
   - `UPSTASH_REDIS_REST_URL`
   - `UPSTASH_REDIS_REST_TOKEN`

### Step 2: Deploy to Vercel

#### Option A: Deploy Button (Easiest)
[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/Mintwhirl/StupidSimpleScreenShare)

#### Option B: Manual Deployment
1. Fork or clone this repository
2. Push to your GitHub account
3. Go to [Vercel](https://vercel.com) and import your repository
4. Add environment variables:
   ```
   UPSTASH_REDIS_REST_URL=your_url_here
   UPSTASH_REDIS_REST_TOKEN=your_token_here
   ```
5. Deploy!

### Step 3: Verify Deployment

1. Open your deployed URL
2. Click **🔧 Diagnostics** to run system health checks
3. Verify all checks pass (WebRTC support, STUN connectivity, Redis connection)

## 📖 Usage Guide

### As a Host (Screen Sharer)

1. **Start Sharing**
   - Click "Start sharing my screen"
   - Select which screen/window/tab to share
   - Your preview appears, and you get a shareable link

2. **Share the Link**
   - Click "Copy Link" button
   - Send to viewers via any messaging platform
   - Monitor active viewer count in real-time

3. **Optional: Record**
   - Click "Start Recording" while sharing
   - Recording saves as `.webm` file when you stop

4. **Use Chat**
   - Type messages to communicate with viewers
   - All participants see the chat in real-time

5. **Stop Sharing**
   - Click "Stop sharing" when done
   - All connections close gracefully

### As a Viewer

1. **Join Session**
   - Open the link provided by the host
   - Video automatically starts (may take 5-10 seconds)

2. **Monitor Connection**
   - Check connection quality indicator
   - Green = Excellent, Yellow = Good, Red = Poor

3. **Use Chat**
   - Communicate with host and other viewers
   - Enter your name when prompted

4. **Auto-Reconnect**
   - If connection drops, app automatically tries to reconnect (up to 3 attempts)

## 🔧 Troubleshooting

### Connection Issues

1. **Run Diagnostics**
   - Click **🔧 Diagnostics** button
   - Review all checks (browser support, STUN, server, room status)

2. **Common Issues**
   - **"Cannot connect to STUN servers"**: Firewall/corporate network blocking UDP
     - Solution: Connect to different network or set up TURN relay
   - **"Connection failed"**: Symmetric NAT or strict firewall
     - Solution: One participant should use mobile hotspot or VPN
   - **"Room expired"**: Session older than 30 minutes
     - Solution: Create a new room

3. **Browser Compatibility**
   - ✅ Chrome/Edge (recommended)
   - ✅ Firefox
   - ✅ Safari
   - ❌ IE (not supported)

### Performance Tips

- Close unnecessary browser tabs
- Use wired internet connection if possible
- Disable browser extensions that may interfere
- Check "Connection Quality" indicator during session

## 🛡️ Security & Privacy

- **Ephemeral**: All data expires after 30 minutes
- **Encrypted**: WebRTC uses SRTP encryption for video
- **Unguessable IDs**: Cryptographically secure random room IDs (24 hex characters)
- **No persistence**: No video data stored on servers
- **Input validation**: All user inputs sanitized to prevent XSS/injection attacks
- **Rate limiting ready**: Architecture supports rate limiting (can be added via Vercel/Upstash)

## 🏢 Production Considerations

### Current Status
✅ Production-ready codebase
✅ Enterprise-grade validation and error handling
✅ Comprehensive security measures
✅ Professional logging and monitoring

### Optional Enhancements

1. **TURN Server** (for strict NATs)
   - Deploy coturn on a VPS
   - Update `STUN_SERVERS` in `client.js`

2. **Analytics**
   - Add Vercel Analytics
   - Track room creation, connection success rates

3. **Rate Limiting**
   - Upstash rate limiting API
   - Prevent abuse of room creation endpoint

4. **Custom Domain**
   - Add via Vercel dashboard
   - SSL certificate automatic

## 📁 Project Structure

```
├── api/                    # Vercel Serverless Functions
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
├── vercel.json            # Vercel configuration
└── README.md              # This file
```

## 🤝 Contributing

This project follows professional development practices:

- ✅ Comprehensive input validation
- ✅ Consistent error handling
- ✅ Security best practices
- ✅ Clear code documentation
- ✅ Accessibility standards (WCAG 2.1)

Pull requests welcome! Please maintain the code quality standards.

## 📄 License

MIT License - feel free to use in your own projects!

## 🙏 Acknowledgments

Built with:
- [WebRTC](https://webrtc.org/) - Real-time communication
- [Vercel](https://vercel.com) - Serverless deployment
- [Upstash](https://upstash.com) - Redis database
- [Claude Code](https://claude.com/claude-code) - AI-assisted development

---

**Note**: This started as "stupid simple" and evolved into a production-ready application with enterprise-grade code quality. The name remains as a reminder that simplicity and quality aren't mutually exclusive! 🚀
