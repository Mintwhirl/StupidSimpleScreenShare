# Stupid Simple Screen Share

A production-ready browser-based **one-to-one** screen sharing application built with React, WebRTC, and a stunning synthwave design theme.

## 🚀 Features

### Core Functionality

- **Browser-only P2P screen sharing** - No plugins, no downloads, no accounts required
- **One-to-one connections** - One host shares screen with one viewer (perfect for personal use)
- **WebRTC with STUN/TURN support** - Direct peer-to-peer connections with relay fallback
- **Ephemeral rooms** - Automatically expire after 1 hour for privacy
- **Real-time connection quality monitoring** - Connection state indicators and diagnostics
- **Modern React architecture** - Component-based, hook-driven, maintainable codebase

### User Experience

- **Simple one-to-one sharing** - Perfect for personal screen sharing, tutoring, or tech support
- **Connection status** - Real-time connection state monitoring
- **Built-in text chat** - Communicate without needing external tools
- **Network diagnostics** - Comprehensive testing tool for troubleshooting connections
- **Role-based UI** - Different interfaces for hosts vs viewers
- **Mobile-optimized** - Responsive design with touch-friendly controls

### Visual Design

- **Synthwave theme** - Retro-futuristic design with purple skies and neon accents
- **Animated background** - Stars, glowing sun, geometric mountains, and electric grid
- **Frosted glass UI** - Translucent panels with backdrop blur effects
- **Custom typography** - "Righteous" font with glowing text effects
- **Interactive buttons** - Gradients, glows, and smooth hover animations

### Security & Quality

- **Comprehensive input validation** - All user inputs sanitized and validated
- **Rate limiting** - Upstash-powered rate limiting (50 rooms/hour, 60 chat msgs/min, 2000 API calls/hour)
- **325 comprehensive tests** - Unit and integration tests with 71.75% code coverage
- **Automated CI/CD** - GitHub Actions with pre-commit hooks
- **Code quality** - ESLint, Prettier, and professional development practices

## 🏗️ Architecture

```
[Host Browser]  <-- P2P WebRTC (encrypted SRTP) -->  [Viewer Browser]
       |                                                      |
       |                                                      |
       --- Signaling (HTTPS) --> [Vercel + Upstash] <--------
```

- **Frontend**: React 19 with Vite build system
- **Signaling**: Vercel Serverless Functions + Upstash Redis (WebRTC negotiation only)
- **Media**: Direct P2P between browsers (video never touches servers)
- **Styling**: Tailwind CSS with custom synthwave theme
- **Testing**: Vitest with comprehensive test coverage
- **Deployment**: Vercel with automated CI/CD

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ and npm
- Modern browser with WebRTC support (Chrome, Firefox, Safari, Edge)

### Development

```bash
# Clone the repository
git clone https://github.com/Mintwhirl/StupidSimpleScreenShare.git
cd StupidSimpleScreenShare

# Install dependencies
npm install

# Start development server
npm run dev

# Open http://localhost:3000 in your browser
```

### Production Deployment

```bash
# Build for production
npm run build

# Deploy to Vercel
vercel --prod
```

## 🧪 Testing

```bash
# Run all tests
npm test

# Run tests with coverage
npm run test:coverage

# Run linting
npm run lint

# Format code
npm run format
```

## 📱 Usage

### For Hosts (Screen Sharers)

1. **Start Sharing**: Click "Start sharing my screen" to create a room
2. **Share Room ID**: Copy the generated room ID and share it with your viewer
3. **Begin Screen Share**: Click "Start Sharing" and select your screen/application
4. **Monitor Connection**: See connection status and viewer presence
5. **Chat**: Use the built-in chat to communicate with your viewer
6. **Stop Sharing**: Click "Stop Sharing" when finished

### For Viewers

1. **Join Room**: Enter the room ID provided by the host
2. **Watch Screen**: The host's screen will appear automatically
3. **Chat**: Use the built-in chat to communicate with the host
4. **Reconnect**: If disconnected, refresh the page to reconnect

## 🔧 Configuration

### Environment Variables

```bash
# Required for production
AUTH_SECRET=your-secure-secret-key-here

# Optional Redis configuration (defaults to Upstash)
REDIS_URL=your-redis-url
REDIS_TOKEN=your-redis-token
```

### Vercel Deployment

1. **Connect Repository**: Link your GitHub repository to Vercel
2. **Set Environment Variables**: Add `AUTH_SECRET` and other required variables
3. **Deploy**: Vercel will automatically deploy on every push to main

## 🛠️ Development

### Project Structure

```
├── src/
│   ├── components/          # React components
│   │   ├── App.jsx         # Main application component
│   │   ├── HostView.jsx    # Host interface
│   │   ├── ViewerView.jsx  # Viewer interface
│   │   ├── Chat.jsx        # Chat component
│   │   ├── VideoPlayer.jsx # Video display component
│   │   └── Diagnostics.jsx # Network diagnostics
│   ├── hooks/              # Custom React hooks
│   │   ├── useWebRTC.js    # WebRTC logic
│   │   ├── useApi.js       # API calls
│   │   └── useChat.js      # Chat functionality
│   └── index.css           # Tailwind CSS styles
├── api/                    # Vercel serverless functions
│   ├── _utils.js          # Shared utilities
│   ├── config.js          # Configuration endpoint
│   ├── create-room.js     # Room creation
│   ├── chat.js            # Chat messages
│   ├── offer.js           # WebRTC offers
│   ├── answer.js          # WebRTC answers
│   ├── candidate.js       # ICE candidates
│   └── diagnostics.js     # Network diagnostics
├── tests/                  # Test files
│   ├── unit/              # Unit tests
│   └── integration/       # Integration tests
└── public/                # Static assets
```

### Key Technologies

- **React 19** - Modern React with hooks and concurrent features
- **Vite** - Fast build tool and development server
- **Tailwind CSS** - Utility-first CSS framework
- **WebRTC** - Peer-to-peer communication
- **Vitest** - Fast unit testing framework
- **Vercel** - Serverless deployment platform
- **Upstash** - Serverless Redis and rate limiting

## 🔒 Security

### Input Validation

- All user inputs are validated and sanitized
- Room IDs are cryptographically secure (24-character hex)
- Message length limits prevent abuse
- Rate limiting prevents spam and abuse

### Privacy

- No video data is stored on servers
- Rooms automatically expire after 1 hour
- No user accounts or personal data collection
- All communication is encrypted (HTTPS + WebRTC)

### Rate Limiting

- **Room Creation**: 50 rooms per hour per IP
- **Chat Messages**: 60 messages per minute per IP
- **API Calls**: 2000 calls per hour per IP

## 🧪 Testing

### Test Coverage

- **325 comprehensive tests** (238 unit + 87 integration)
- **71.75% code coverage** on API layer
- **Unit tests** for all validation functions and utilities
- **Integration tests** for all API endpoints

### Running Tests

```bash
# Run all tests
npm test

# Run tests with coverage
npm run test:coverage

# Run tests in watch mode
npm run test:watch
```

## 🚀 Deployment

### Vercel (Recommended)

1. **Connect Repository**: Link your GitHub repository to Vercel
2. **Set Environment Variables**: Add required environment variables
3. **Deploy**: Vercel will automatically deploy on every push

## 🤝 Contributing

1. **Fork the repository**
2. **Create a feature branch**: `git checkout -b feature/amazing-feature`
3. **Make your changes**: Follow the existing code style and add tests
4. **Run tests**: `npm test` to ensure all tests pass
5. **Commit changes**: `git commit -m 'Add amazing feature'`
6. **Push to branch**: `git push origin feature/amazing-feature`
7. **Open a Pull Request**: Describe your changes and link any issues

### Development Guidelines

- **Follow ESLint rules** - Run `npm run lint` before committing
- **Write tests** - Add tests for new features and bug fixes
- **Update documentation** - Keep README and comments up to date
- **Use semantic commits** - Follow conventional commit format

## 📄 License

This project is licensed under the Creative Commons Attribution-NonCommercial-ShareAlike 4.0 International License - see the [LICENSE](LICENSE) file for details.

**Copyright © 2025 Mintwhirl Dev - Kevin Stewart**

Commercial use requires explicit written permission from the copyright holder.

## 📞 Support

- **Issues**: [GitHub Issues](https://github.com/Mintwhirl/StupidSimpleScreenShare/issues)
- **Discussions**: [GitHub Discussions](https://github.com/Mintwhirl/StupidSimpleScreenShare/discussions)

---

**Built with ❤️ and modern web technologies. Ready for production use!** 🚀
