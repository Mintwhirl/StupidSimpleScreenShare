# QUICK FIX GUIDE - Get Beta Testing Working in 5 Minutes

## TL;DR - What's Broken?

**Your app only allows 1 viewer per room.** When a second viewer tries to connect, they get "Connection timeout" because the WebRTC offer was deleted after the first viewer retrieved it.

**Critical Bug**: `api/offer.js:86` and `api/answer.js:85` delete the offer/answer after retrieval.

---

## Option 1: Apply Patches Automatically (RECOMMENDED)

```bash
# 1. Apply all 3 critical fixes at once
git apply patches/001-multi-viewer-support.patch
git apply patches/002-crypto-secrets.patch
git apply patches/003-cors-fix.patch

# 2. Commit the fixes
git add api/offer.js api/answer.js api/register-sender.js api/_middleware.js api/_utils.js
git commit -m "fix: enable multi-viewer support + security improvements

- Remove offer/answer deletion to allow multiple viewers
- Use crypto.randomBytes for secure secret generation
- Fix CORS for preview deployments and localhost

Fixes beta testing blockers"

# 3. Push to deploy
git push origin main

# 4. Wait 30 seconds for Vercel to deploy
# 5. Test with 2 browsers - SHOULD WORK NOW! 🎉
```

---

## Option 2: Manual Fixes (If Patches Fail)

### Fix #1: Multi-Viewer Support (CRITICAL)

**File**: `api/offer.js` line 86
**Change**:

```diff
-      // Delete the offer after retrieving it to prevent multiple viewers from getting the same offer
-      await redis.del(`room:${roomId}:offer`);
+      // DO NOT DELETE - allow multiple viewers to retrieve the same offer
```

**File**: `api/answer.js` line 85
**Change**:

```diff
-      // Delete the answer after retrieving it to prevent multiple hosts from getting the same answer
-      await redis.del(`room:${roomId}:answer`);
+      // DO NOT DELETE - allow multiple viewers to retrieve the same answer
```

### Fix #2: Secure Secrets (CRITICAL)

**File**: `api/register-sender.js` line 1 (add import)

```diff
+import { randomBytes } from 'crypto';
 import { createCompleteHandler } from './_middleware.js';
```

**File**: `api/register-sender.js` line 37
**Change**:

```diff
-    const senderSecret = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
+    const senderSecret = randomBytes(16).toString('hex'); // 32 hex chars (128 bits)
```

### Fix #3: CORS for Testing (CRITICAL)

**File**: `api/_utils.js` lines 101-109
**Replace entire function**:

```javascript
export function setCorsHeaders(req, res) {
  const requestOrigin = req.headers.origin;

  // Allow all Vercel preview deployments + production + localhost (dev/testing)
  const allowedOrigins = [
    'https://stupid-simple-screen-share.vercel.app', // Production
    /^https:\/\/stupid-simple-screen-share-[a-z0-9]+\.vercel\.app$/, // Preview deployments
    'http://localhost:5173', // Vite dev
    'http://localhost:3000', // Alternative dev
  ];

  const isAllowed = allowedOrigins.some((origin) => {
    if (typeof origin === 'string') return origin === requestOrigin;
    return origin.test(requestOrigin);
  });

  const origin = isAllowed ? requestOrigin : 'https://stupid-simple-screen-share.vercel.app';

  res.setHeader('Access-Control-Allow-Origin', origin);
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type,x-auth-secret,x-sender-secret,Authorization');
  res.setHeader('Access-Control-Allow-Credentials', 'true');
}
```

**File**: `api/_middleware.js` line 33
**Change**:

```diff
-    setCorsHeaders(res);
+    setCorsHeaders(req, res);
```

---

## Verify the Fixes Work

### Test 1: API Still Works

```bash
curl https://stupid-simple-screen-share.vercel.app/api/config
# Should return: {"success":true,...}
```

### Test 2: Multi-Viewer Support

```bash
# Create a room
ROOM_ID=$(curl -sS https://stupid-simple-screen-share.vercel.app/api/create-room -X POST | jq -r '.roomId')
echo "Room: $ROOM_ID"

# Simulate host sending offer
curl -sS https://stupid-simple-screen-share.vercel.app/api/offer -X POST \
  -H "Content-Type: application/json" \
  -d "{\"roomId\":\"$ROOM_ID\",\"desc\":{\"type\":\"offer\",\"sdp\":\"v=0 test\"}}"

# Viewer 1 retrieves offer
curl -sS "https://stupid-simple-screen-share.vercel.app/api/offer?roomId=$ROOM_ID" | jq '.desc'
# Should return: {"type":"offer","sdp":"v=0 test"}

# Viewer 2 retrieves offer (THIS SHOULD NOW WORK!)
curl -sS "https://stupid-simple-screen-share.vercel.app/api/offer?roomId=$ROOM_ID" | jq '.desc'
# Should return: {"type":"offer","sdp":"v=0 test"} ✅ (not 404!)
```

### Test 3: Real Browser Test

```bash
# Open 3 browser windows:

# Window 1 (Host):
#   - Go to https://stupid-simple-screen-share.vercel.app
#   - Click "Start Sharing"
#   - Allow screen share
#   - Copy Room ID

# Window 2 (Viewer 1):
#   - Go to https://stupid-simple-screen-share.vercel.app
#   - Paste Room ID
#   - Click "Join Room"
#   - YOU SHOULD SEE HOST'S SCREEN ✅

# Window 3 (Viewer 2):
#   - Go to https://stupid-simple-screen-share.vercel.app
#   - Paste SAME Room ID
#   - Click "Join Room"
#   - YOU SHOULD ALSO SEE HOST'S SCREEN ✅ (THIS IS THE FIX!)
```

---

## What Else Was Found?

See `AUDIT_REPORT.md` for:

- 2 more HIGH priority issues (test failures)
- 4 MEDIUM priority issues (CSP, chat sanitization, etc.)
- 3 LOW priority issues (logging, metrics)

But **the 3 critical fixes above are all you need to unblock beta testing**.

---

## Emergency Rollback

If something breaks:

```bash
# Undo the changes
git revert HEAD
git push origin main

# Or restore individual files
git checkout HEAD~1 api/offer.js api/answer.js
git commit -m "Revert: multi-viewer changes"
git push origin main
```

---

## Next Steps After Fixing

1. **Test with beta testers** - notify them the app is fixed
2. **Monitor Vercel logs** for errors: `vercel logs --follow`
3. **Apply remaining fixes** from AUDIT_REPORT.md (non-critical but recommended)
4. **Set up monitoring** - add Sentry or similar for error tracking

---

## Questions?

- Read `AUDIT_REPORT.md` for detailed analysis
- Check `audit_findings.json` for machine-readable data
- All patches are in `patches/` directory
