# Stupid Simple Screen Share

A production-ready browser-based screen sharing application built with React, WebRTC, and modern development practices.

## 🚀 Features

### Core Functionality
- **Browser-only P2P screen sharing** - No plugins, no downloads, no accounts required
- **WebRTC with STUN/TURN support** - Direct peer-to-peer connections with relay fallback
- **Ephemeral rooms** - Automatically expire after 30 minutes for privacy
- **Real-time connection quality monitoring** - RTT, packet loss, and connection state indicators
- **Modern React architecture** - Component-based, hook-driven, maintainable codebase

### Advanced Features
- **Screen recording** - Record your screen share with MediaRecorder API (VP9/VP8/WebM/MP4)
- **Multi-viewer support** - Multiple viewers can watch a single host simultaneously
- **Live viewer count** - See how many people are watching in real-time
- **Built-in text chat** - Communicate without needing external tools
- **Network diagnostics** - Comprehensive testing tool for troubleshooting connections
- **Auto-reconnection** - Viewers automatically reconnect on temporary network issues
- **Role-based UI** - Different interfaces for hosts vs viewers
- **Mobile-optimized** - Responsive design with touch-friendly controls
- **Fullscreen support** - Double-tap or button to go fullscreen on mobile
- **URL-based reconnection** - Auto-reconnect after page refresh

### Security & Quality
- **Comprehensive input validation** - All user inputs sanitized and validated
- **Enterprise-grade error handling** - Graceful failures with user-friendly messages
- **Security hardening** - XSS prevention, length limits, cryptographically secure IDs
- **Accessibility** - Full ARIA labels, keyboard navigation, screen reader support
- **Rate limiting** - Upstash-powered rate limiting (50 rooms/hour, 60 chat msgs/min, 2000 API calls/min)
- **325 comprehensive tests** - Unit and integration tests with 71.75% code coverage
- **Automated CI/CD** - GitHub Actions with pre-commit hooks
- **Code quality** - ESLint, Prettier, and professional development practices

## 🏗️ Architecture

```
[Host Browser]  <-- P2P WebRTC (encrypted SRTP) -->  [Viewer Browser(s)]
       |                                                      |
       |                                                      |
       --- Signaling (HTTPS) --> [Vercel + Upstash] <--------
```

- **Frontend**: React 19 with Vite build system
- **Signaling**: Vercel Serverless Functions + Upstash Redis (WebRTC negotiation only)
- **Media**: Direct P2P between browsers (video never touches servers)
- **Encryption**: SRTP for media, HTTPS for signaling
- **Testing**: Vitest with comprehensive unit and integration tests
- **CI/CD**: GitHub Actions with automated testing and deployment

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ and npm
- Vercel account (free tier works)
- Upstash Redis database (free tier works)

### Local Development

1. **Clone and install dependencies:**
   ```bash
   git clone <your-repo>
   cd stupid-simple-screen-share
   npm install
   ```

2. **Set up environment variables:**
   ```bash
   # Create .env file
   UPSTASH_REDIS_REST_URL=your_redis_url
   UPSTASH_REDIS_REST_TOKEN=your_redis_token
   AUTH_SECRET=your_auth_secret  # Optional but recommended
   ```

3. **Run development server:**
   ```bash
   npm run dev
   ```

4. **Run tests:**
   ```bash
   npm test              # Run all tests
   npm run test:watch    # Watch mode
   npm run test:coverage # With coverage report
   ```

5. **Lint and format:**
   ```bash
   npm run lint          # Check for issues
   npm run lint:fix      # Auto-fix issues
   npm run format        # Format code
   ```

### Production Deployment

#### Option A: Deploy Button (Easiest)
[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/YourUsername/YourRepo)

#### Option B: Manual Deployment

1. **Fork or clone this repository**
2. **Push to your GitHub account**
3. **Go to [Vercel](https://vercel.com) and import your repository**
4. **Add environment variables:**
   ```
   UPSTASH_REDIS_REST_URL=your_url_here
   UPSTASH_REDIS_REST_TOKEN=your_token_here
   AUTH_SECRET=generate_random_string_here  # Optional but recommended
   ```
   Generate AUTH_SECRET with: `openssl rand -hex 32`
5. **Deploy** - Vercel will automatically build and deploy your React app

## 📖 Usage Guide

### As a Host (Screen Sharer)

1. **Start Sharing**
   - Click "Create Room (Host)"
   - Select which screen/window/tab to share
   - Your local preview appears, and you get a shareable link

2. **Share the Link**
   - Copy the room link
   - Send to viewers via any messaging platform
   - Monitor active viewer count in real-time

3. **Optional: Record**
   - Click "Start Recording" while sharing
   - Recording saves as `.webm` or `.mp4` file when you stop

4. **Use Chat**
   - Type messages to communicate with viewers
   - All participants see the chat in real-time

### As a Viewer

1. **Join Session**
   - Open the link provided by the host
   - Clean interface shows only the screen share and chat
   - Video automatically starts (may take 5-10 seconds)

2. **Fullscreen Viewing**
   - Click the "Fullscreen" button in the top-right corner
   - Or double-tap the video to go fullscreen

3. **Use Chat**
   - Communicate with host and other viewers
   - Enter your name when prompted

## 🧪 Testing

This project has comprehensive testing coverage:

- **325 tests** (238 unit + 87 integration)
- **71.75% code coverage** on API layer
- **Automated CI/CD** with GitHub Actions
- **Pre-commit hooks** for code quality

### Running Tests

```bash
npm test              # Run all tests
npm run test:watch    # Watch mode for development
npm run test:ui       # Visual test runner
npm run test:coverage # Generate coverage report
```

### Test Structure

```
tests/
├── unit/           # Unit tests for utility functions
│   ├── validateRoomId.test.js
│   ├── validateRole.test.js
│   └── ...
└── integration/    # Integration tests for API endpoints
    ├── config.test.js
    ├── create-room.test.js
    └── ...
```

## 🔧 Development

### Code Quality

- **ESLint** - Professional code standards
- **Prettier** - Consistent code formatting
- **Husky** - Pre-commit hooks
- **Lint-staged** - Staged file linting

### Project Structure

```
├── src/                    # React application
│   ├── components/        # React components
│   │   ├── App.jsx       # Main application
│   │   ├── HostView.jsx  # Host interface
│   │   ├── ViewerView.jsx # Viewer interface
│   │   ├── Chat.jsx      # Chat component
│   │   ├── VideoPlayer.jsx # Video player
│   │   └── Diagnostics.jsx # Diagnostics panel
│   ├── hooks/            # Custom React hooks
│   │   ├── useWebRTC.js  # WebRTC logic
│   │   ├── useApi.js     # API calls
│   │   └── useChat.js    # Chat functionality
│   └── main.jsx          # React entry point
├── api/                   # Vercel Serverless Functions
│   ├── _utils.js         # Shared utilities and validation
│   ├── config.js         # Client configuration endpoint
│   ├── create-room.js    # Room creation
│   ├── offer.js          # WebRTC offer signaling
│   ├── answer.js         # WebRTC answer signaling
│   ├── candidate.js      # ICE candidate exchange
│   ├── chat.js           # Text chat functionality
│   ├── viewers.js        # Viewer presence tracking
│   └── diagnostics.js    # Network diagnostics
├── tests/                # Comprehensive test suite
│   ├── unit/            # Unit tests
│   └── integration/     # Integration tests
├── public/              # Static assets
│   └── index.html       # HTML entry point
├── .github/workflows/   # CI/CD automation
├── vite.config.js       # Vite configuration
├── vercel.json          # Vercel deployment config
└── package.json         # Dependencies and scripts
```

## 🔒 Security & Privacy

- **Ephemeral**: All data expires after 30 minutes
- **Encrypted**: WebRTC uses SRTP encryption for video
- **Unguessable IDs**: Cryptographically secure random room IDs (24 hex characters)
- **No persistence**: No video data stored on servers
- **Input validation**: All user inputs sanitized to prevent XSS/injection attacks
- **Rate limiting**: Upstash-powered rate limiting prevents abuse
- **Optional auth**: Set AUTH_SECRET to prevent unauthorized room creation
- **Comprehensive testing**: 325 tests ensure security and reliability

## 💰 Costs & Limits

**TL;DR: $0/month for personal use**

All services used are free tier:
- **Vercel**: 100 GB bandwidth/month (API only, video is P2P)
- **Upstash**: 10k commands/day (you'll use ~50-100 per session)
- **Video traffic**: Peer-to-peer (doesn't hit servers at all)

See `COSTS_AND_LIMITS.md` for detailed breakdown.

## 🛠️ Troubleshooting

### Connection Issues

1. **Run Diagnostics**
   - Click "Diagnostics" button in the app
   - Review all checks (browser support, STUN, server, room status)

2. **Common Issues**
   - "Cannot connect to STUN servers": Firewall/corporate network blocking UDP
   - "Connection failed": Symmetric NAT or strict firewall
   - "Room expired": Session older than 30 minutes

3. **Browser Compatibility**
   - **Supported**: Chrome/Edge (recommended), Firefox, Safari
   - **Not supported**: Internet Explorer

### Performance Tips

- Close unnecessary browser tabs
- Use wired internet connection if possible
- Disable browser extensions that may interfere
- Check "Connection Quality" indicator during session

## 📱 Mobile Usage

- **iOS Safari**: Works best with iOS 14+ and Safari 14+
- **Android Chrome**: Works with Chrome 80+ and Android 8+
- **Fullscreen**: Double-tap video or use fullscreen button
- **Touch Controls**: Optimized for mobile interaction
- **Auto-reconnect**: Refresh the page to reconnect automatically

## 🤝 Contributing

This project follows professional development practices:

- **Comprehensive testing** - 325 tests with 71.75% coverage
- **Code quality** - ESLint, Prettier, pre-commit hooks
- **Security best practices** - Input validation, rate limiting
- **Accessibility standards** - WCAG 2.1 compliance
- **Modern React patterns** - Hooks, functional components

### Development Workflow

1. **Fork the repository**
2. **Create a feature branch**
3. **Make your changes**
4. **Run tests**: `npm test`
5. **Check code quality**: `npm run lint`
6. **Submit a pull request**

## 📄 License

CC BY-NC-SA 4.0 (Creative Commons Attribution-NonCommercial-ShareAlike 4.0)

- Free for personal/educational use
- Can view and modify code
- Must credit original author
- Cannot use commercially without permission

Want to use commercially? Contact for licensing.

## 🙏 Acknowledgments

Built with:
- **React 19** - Modern UI framework
- **Vite** - Fast build tool
- **WebRTC** - Real-time communication
- **Vercel** - Serverless deployment
- **Upstash** - Redis database
- **Vitest** - Testing framework
- **Tailwind CSS** - Utility-first styling

---

**Note**: This started as "stupid simple" and evolved into a production-ready application with enterprise-grade code quality, comprehensive testing, and modern React architecture. The name remains as a reminder that simplicity and quality aren't mutually exclusive.