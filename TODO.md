# Development Roadmap

## Immediate Actions

### Security
- [ ] Enable AUTH_SECRET for room creation
  - Generate secret: `openssl rand -hex 32`
  - Add to Vercel environment variables
  - Update `public/client.js` line 9 with the secret
  - Test that unauthorized users cannot create rooms

## Short-Term Enhancements (1-2 weeks)

### Testing Infrastructure
- [ ] Set up automated testing framework
  - Install Vitest: `npm install --save-dev vitest @vitest/ui`
  - Create test directory structure: `tests/unit/` and `tests/integration/`
  - Add test scripts to package.json

- [ ] Write unit tests for validation functions
  - Test `validateRoomId()` - valid/invalid formats
  - Test `validateRole()` - enum validation
  - Test `validateViewerId()` - length and character checks
  - Test `validateMessage()` - XSS prevention, length limits
  - Test `validateSender()` - input sanitization
  - Target: 80% coverage for `api/_utils.js`

- [ ] Write integration tests for API endpoints
  - Test room creation with/without auth
  - Test offer/answer exchange flow
  - Test ICE candidate submission
  - Test chat message posting and retrieval
  - Test rate limit enforcement

### Code Quality
- [ ] Add ESLint configuration
  - Install: `npm install --save-dev eslint eslint-config-airbnb-base eslint-plugin-import`
  - Run: `npx eslint --init`
  - Add lint script to package.json: `"lint": "eslint api public"`
  - Fix any linting issues

- [ ] Add code comments for complex functions
  - Document WebRTC signaling flow
  - Explain rate limiting logic
  - Add JSDoc comments to public functions

## Medium-Term Improvements (1-2 months)

### Performance
- [ ] Implement Redis pipelining for parallel operations
  - Batch multiple Redis commands into single network round-trip
  - Target: 30-50% reduction in API latency
  - Apply to endpoints that fetch multiple keys

- [ ] Add exponential backoff for client-side polling
  - Gradually increase polling interval when no changes detected
  - Reduce server load and client battery usage

### User Experience
- [ ] Enhance diagnostics panel
  - Add WebRTC stats (bitrate, codec, connection type)
  - Add browser compatibility check with warnings
  - Add troubleshooting tips based on connection state
  - Add "copy diagnostic report" button

- [ ] UI/UX polish
  - Add loading states and spinners
  - Add fade-in animations for chat messages
  - Improve mobile responsiveness
  - Add dark mode support

### Documentation
- [ ] Create CONTRIBUTING.md
  - Code style guide
  - How to run locally
  - How to run tests
  - Pull request process

- [ ] Create API documentation
  - OpenAPI/Swagger spec for all endpoints
  - Request/response examples
  - Error code documentation

## Optional Future Enhancements

### Advanced Features
- [ ] Upgrade chat to Server-Sent Events (SSE)
  - Replace HTTP polling with SSE for real-time updates
  - Maintain backwards compatibility
  - Reduce server load

- [ ] Add persistent viewer history
  - Track viewer join/leave events
  - Show connection duration
  - Store in Redis with TTL

### Infrastructure
- [ ] Set up TURN relay server (if P2P connections fail frequently)
  - Follow TURN_SETUP.md guide
  - Rent VPS (DigitalOcean/Linode/Hetzner)
  - Install and configure coturn
  - Update client with TURN credentials
  - Implement dynamic TURN credential generation

- [ ] Add monitoring and observability
  - Option A (Lightweight): Enhanced structured logging + Vercel Analytics
  - Option B (Full): Sentry for error tracking + performance monitoring
  - Set up email alerts for 5xx errors

### Scaling
- [ ] Implement database optimization strategies
  - Redis pipelining (mentioned above)
  - Connection pooling
  - Query optimization

- [ ] Consider architecture evolution (if usage grows significantly)
  - Evaluate WebSocket server for real-time features
  - Consider PostgreSQL for persistent data
  - Plan for multi-region deployment

## Maintenance Tasks

### Regular (Monthly)
- [ ] Update dependencies
  - Run: `npm update`
  - Test all functionality after updates
  - Check for security vulnerabilities: `npm audit`

- [ ] Monitor usage and costs
  - Check Vercel dashboard for bandwidth usage
  - Check Upstash console for command count
  - Verify cron job is running successfully

- [ ] Review and clean up Redis database
  - Check for orphaned keys
  - Verify TTLs are working correctly
  - Monitor storage usage

### As Needed
- [ ] Review and respond to issues/PRs (if open-sourced)
- [ ] Update documentation based on user feedback
- [ ] Optimize based on production metrics

## Completed

- [x] Create new Upstash Redis database
- [x] Configure environment variables in Vercel
- [x] Set up weekly health check cron job
- [x] Fix Redis client initialization (lazy loading)
- [x] Add input validation for all endpoints
- [x] Implement rate limiting
- [x] Add error handling and logging
- [x] Create network diagnostics endpoint
- [x] Add screen recording feature
- [x] Implement multi-viewer support
- [x] Add real-time chat functionality
- [x] Create viewer presence tracking
- [x] Add auto-reconnection logic
- [x] Clean up documentation (remove emojis, consolidate)

## Notes

- All tasks are prioritized based on impact and effort
- Security and testing should be prioritized before adding new features
- Monitor free tier limits before implementing resource-intensive features
- Keep the "stupid simple" philosophy - don't over-engineer

## Questions or Clarifications Needed

- None currently - ready to proceed with immediate actions
