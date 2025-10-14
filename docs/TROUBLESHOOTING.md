# Troubleshooting Guide

## Common Issues and Solutions

### 1. Connection Issues

#### Issue: "Connecting..." state never completes

**Symptoms**: Viewer shows "Connecting..." indefinitely
**Solutions**:

- Check if host has started screen sharing
- Verify room ID is correct
- Check browser console for WebRTC errors
- Try refreshing the page
- Ensure both browsers support WebRTC

#### Issue: "Room not found" error

**Symptoms**: Viewer gets "Room not found" when entering room ID
**Solutions**:

- Verify room ID is exactly 24 characters
- Check if room has expired (1 hour TTL)
- Ensure host has created the room first
- Try creating a new room

#### Issue: Screen sharing fails to start

**Symptoms**: Host clicks "Start Sharing" but nothing happens
**Solutions**:

- Check browser permissions for screen sharing
- Ensure browser supports `getDisplayMedia` API
- Try selecting a different screen/application
- Check browser console for errors

### 2. WebRTC Issues

#### Issue: No video stream appears

**Symptoms**: Connection established but no video
**Solutions**:

- Check if host is actually sharing screen
- Verify WebRTC support in browser
- Check network connectivity
- Try different browser (Chrome, Firefox, Safari)

#### Issue: Poor video quality

**Symptoms**: Choppy or low-quality video
**Solutions**:

- Check network bandwidth
- Close other bandwidth-intensive applications
- Try reducing screen resolution
- Check if TURN servers are working

### 3. Chat Issues

#### Issue: Messages not sending

**Symptoms**: Chat messages don't appear
**Solutions**:

- Check if room is still active
- Verify sender name is provided
- Check rate limiting (60 messages/minute)
- Refresh page and try again

#### Issue: Messages not receiving

**Symptoms**: Messages sent but not received by others
**Solutions**:

- Check if other users are in the same room
- Verify room ID is correct
- Check network connectivity
- Try refreshing the page

### 4. Browser Compatibility

#### Issue: WebRTC not supported

**Symptoms**: "WebRTC Support: No" in diagnostics
**Solutions**:

- Use modern browser (Chrome 60+, Firefox 55+, Safari 11+)
- Enable WebRTC in browser settings
- Check if browser is up to date
- Try different browser

#### Issue: Screen sharing not supported

**Symptoms**: "Screen Share Support: No" in diagnostics
**Solutions**:

- Use Chrome, Firefox, or Safari
- Ensure browser is up to date
- Check browser permissions
- Try different browser

### 5. Network Issues

#### Issue: Connection fails across networks

**Symptoms**: Works on same network but fails across different networks
**Solutions**:

- TURN servers are automatically used for NAT traversal
- Check firewall settings
- Try different network (mobile hotspot)
- Contact network administrator

#### Issue: High latency

**Symptoms**: Delayed video or chat
**Solutions**:

- Check network speed
- Close other applications
- Try different network
- Check server region (Vercel auto-selects)

### 6. Development Issues

#### Issue: Build fails locally

**Solutions**:

```bash
# Clear node_modules and reinstall
rm -rf node_modules package-lock.json
npm install

# Check Node.js version (requires 18+)
node --version

# Run linting
npm run lint:fix
```

#### Issue: Tests failing

**Solutions**:

```bash
# Run tests with verbose output
npm test -- --verbose

# Run specific test file
npm test -- src/hooks/useApi.test.js

# Check test coverage
npm run test:coverage
```

### 7. Deployment Issues

#### Issue: Vercel deployment fails

**Solutions**:

- Check environment variables are set
- Verify build logs for errors
- Check Node.js version in vercel.json
- Ensure all dependencies are in package.json

#### Issue: API endpoints not working

**Solutions**:

- Check AUTH_SECRET is set in Vercel
- Verify Redis connection (Upstash)
- Check function logs in Vercel dashboard
- Test endpoints with curl or Postman

## Diagnostic Tools

### Built-in Diagnostics

- Open diagnostics panel in the app
- Check WebRTC support status
- Monitor connection quality
- View browser information

### Browser Console

- Open Developer Tools (F12)
- Check Console tab for errors
- Look for WebRTC-related messages
- Check Network tab for failed requests

### Network Testing

- Test with different browsers
- Try different networks
- Check firewall settings
- Test with mobile hotspot

## Getting Help

### Before Reporting Issues

1. Check this troubleshooting guide
2. Try different browser
3. Check browser console for errors
4. Test with different network
5. Verify room hasn't expired

### Reporting Issues

When reporting issues, include:

- Browser and version
- Operating system
- Network setup
- Console error messages
- Steps to reproduce
- Expected vs actual behavior

### Contact Information

- GitHub Issues: [Repository Issues](https://github.com/Mintwhirl/StupidSimpleScreenShare/issues)
- Check [WebRTC Flow Audit](WEBRTC_FLOW_AUDIT.md) for technical details
