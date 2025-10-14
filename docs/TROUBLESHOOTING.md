# Troubleshooting Guide

## Common Issues and Solutions

### 1. Build Failures

#### Issue: ESLint errors during build

**Symptoms**: Build fails with ESLint rule violations
**Solution**:

```bash
# Fix auto-fixable issues
npm run lint:fix

# Check specific files
npx eslint src/App.jsx --fix

# Temporarily disable rules if needed (not recommended)
// eslint-disable-next-line rule-name
```

#### Issue: TypeScript/JSX compilation errors

**Symptoms**: Build fails with syntax errors
**Solution**:

```bash
# Check for syntax errors
npm run lint

# Verify all imports are correct
# Check for missing dependencies
npm install
```

### 2. Test Failures

#### Issue: Tests failing in CI but passing locally

**Symptoms**: CI pipeline shows test failures
**Common Causes**:

- Missing environment variables
- Different Node.js versions
- Timeout issues

**Solution**:

```bash
# Run tests with same environment as CI
AUTH_SECRET=test-secret-key-for-ci-123 npm run test

# Check test coverage
npm run test:coverage

# Run specific test files
npm run test tests/unit/validateRoomId.test.js
```

#### Issue: Redis connection errors in tests

**Symptoms**: Tests fail with "Redis connection failed"
**Solution**:

- These are expected in test environment
- Tests mock Redis connections
- Check test setup and mocking

### 3. Runtime Issues

#### Issue: Application won't start

**Symptoms**: White screen or loading forever
**Solution**:

1. Check browser console for errors
2. Verify API configuration:

   ```bash
   # Check environment variables
   echo $AUTH_SECRET

   # Test API endpoints
   curl http://localhost:3000/api/config
   ```

3. Check network connectivity
4. Verify Redis connection (if using production)

#### Issue: WebRTC connection fails

**Symptoms**: Screen sharing doesn't work
**Solution**:

1. Check browser permissions for screen sharing
2. Verify TURN/STUN server configuration
3. Check network firewall settings
4. Test with different browsers
5. Check browser console for WebRTC errors

### 4. Development Issues

#### Issue: Hot reload not working

**Symptoms**: Changes not reflected in browser
**Solution**:

```bash
# Restart development server
npm run dev

# Clear browser cache
# Check for syntax errors in console
```

#### Issue: ESLint rules too strict

**Symptoms**: Many linting errors
**Solution**:

1. Review `.eslintrc.cjs` configuration
2. Check file-specific overrides
3. Use `// eslint-disable-next-line` for specific cases
4. Consider updating ESLint configuration

### 5. Performance Issues

#### Issue: Slow build times

**Symptoms**: `npm run build` takes too long
**Solution**:

```bash
# Check bundle size
npm run build
# Review dist/stats.html

# Optimize imports
# Use lazy loading for components
# Check for circular dependencies
```

#### Issue: Large bundle size

**Symptoms**: Application loads slowly
**Solution**:

1. Analyze bundle with `npm run build`
2. Check `dist/stats.html` for large dependencies
3. Implement code splitting
4. Use dynamic imports for heavy components

### 6. Deployment Issues

#### Issue: Vercel deployment fails

**Symptoms**: Build fails on Vercel
**Solution**:

1. Check `vercel.json` configuration
2. Verify environment variables in Vercel dashboard
3. Check Node.js version compatibility
4. Review build logs for specific errors

#### Issue: API endpoints not working in production

**Symptoms**: 500 errors from API
**Solution**:

1. Check serverless function logs
2. Verify environment variables
3. Test API endpoints directly
4. Check Redis connection (if applicable)

### 7. Security Issues

#### Issue: Security audit shows vulnerabilities

**Symptoms**: `npm audit` shows issues
**Solution**:

```bash
# Check for vulnerabilities
npm audit

# Fix automatically fixable issues
npm audit fix

# Review and update dependencies manually
npm update package-name
```

#### Issue: Authentication errors

**Symptoms**: API returns 401/403 errors
**Solution**:

1. Verify `AUTH_SECRET` environment variable
2. Check API request headers
3. Verify client-side configuration
4. Test with correct authentication

## Debugging Tools

### Browser Developer Tools

- **Console**: Check for JavaScript errors
- **Network**: Monitor API requests and responses
- **Application**: Check localStorage, sessionStorage
- **Performance**: Analyze runtime performance

### Development Tools

```bash
# Run with debug logging
DEBUG=* npm run dev

# Check bundle analysis
npm run build && open dist/stats.html

# Run tests with coverage
npm run test:coverage
```

### API Testing

```bash
# Test API endpoints
curl -X GET http://localhost:3000/api/config \
  -H "x-auth-secret: your-secret"

# Test room creation
curl -X POST http://localhost:3000/api/create-room \
  -H "Content-Type: application/json" \
  -H "x-auth-secret: your-secret" \
  -d '{}'
```

## Getting Help

### Logs and Diagnostics

1. Check browser console for client-side errors
2. Check server logs for API errors
3. Use the built-in diagnostics panel in the application
4. Enable debug logging in development

### Common Error Messages

#### "Failed to fetch client configuration"

- Check API endpoint availability
- Verify network connectivity
- Check CORS settings

#### "Redis connection failed"

- Expected in test environment
- Check Redis configuration in production
- Verify Redis server is running

#### "Room not found"

- Check room ID format
- Verify room exists in Redis
- Check room expiration settings

### Support Resources

- Check existing GitHub issues
- Review API documentation in `docs/API.md`
- Check architecture decisions in `docs/ARCHITECTURE_DECISIONS.md`
- Review development setup in `README.md`
