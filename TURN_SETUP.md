# TURN Server Setup Guide

This guide helps you set up a TURN relay server for users behind strict NATs/firewalls.

## When Do You Need TURN?

**STUN alone works ~80-90% of the time.** You need TURN if:
- Users are behind symmetric NAT
- Corporate firewalls block UDP
- Double NAT scenarios (mobile hotspot → router)
- Connection diagnostics show "Cannot connect to STUN servers"

## Option 1: coturn (Self-Hosted) - Recommended

### Prerequisites
- A VPS with public IP (DigitalOcean, Linode, Hetzner, etc.)
- $5-10/month for small VPS
- Ubuntu 20.04+ or similar

### Step 1: Install coturn

```bash
# SSH into your VPS
ssh root@your-vps-ip

# Update system
sudo apt update && sudo apt upgrade -y

# Install coturn
sudo apt install coturn -y
```

### Step 2: Configure coturn

Edit the configuration file:
```bash
sudo nano /etc/turnserver.conf
```

Add/uncomment these lines:
```conf
# Public IP of your server
listening-ip=YOUR_VPS_PUBLIC_IP
relay-ip=YOUR_VPS_PUBLIC_IP
external-ip=YOUR_VPS_PUBLIC_IP

# Listening ports
listening-port=3478
tls-listening-port=5349

# Port range for relay
min-port=49152
max-port=65535

# Enable fingerprinting
fingerprint

# Use long-term credentials
lt-cred-mech

# Static username/password (or use auth-secret for dynamic)
user=your-username:your-password

# Realm (can be your domain or IP)
realm=your-domain.com

# Logging
log-file=/var/log/turnserver.log
verbose

# Security
no-cli
no-loopback-peers
no-multicast-peers

# Recommended: Deny private IP ranges from being relayed
denied-peer-ip=0.0.0.0-0.255.255.255
denied-peer-ip=10.0.0.0-10.255.255.255
denied-peer-ip=172.16.0.0-172.31.255.255
denied-peer-ip=192.168.0.0-192.168.255.255
```

Replace:
- `YOUR_VPS_PUBLIC_IP` with your actual server IP
- `your-username` and `your-password` with secure credentials
- `your-domain.com` with your domain (or use IP)

### Step 3: Enable and Start

```bash
# Enable coturn to start on boot
sudo systemctl enable coturn

# Start coturn
sudo systemctl start coturn

# Check status
sudo systemctl status coturn

# View logs
sudo tail -f /var/log/turnserver.log
```

### Step 4: Configure Firewall

```bash
# Allow TURN ports
sudo ufw allow 3478/tcp
sudo ufw allow 3478/udp
sudo ufw allow 5349/tcp
sudo ufw allow 5349/udp
sudo ufw allow 49152:65535/udp  # Relay port range
```

### Step 5: Test Your TURN Server

Use online TURN test tool: https://webrtc.github.io/samples/src/content/peerconnection/trickle-ice/

Configure:
- STUN or TURN URI: `turn:your-vps-ip:3478`
- Username: `your-username`
- Password: `your-password`

Click "Gather candidates" - you should see `relay` type candidates if working.

### Step 6: Configure in Your App

Edit `/public/client.js`, uncomment and configure:

```javascript
const TURN_SERVER = {
  urls: 'turn:your-vps-ip:3478',
  username: 'your-username',
  credential: 'your-password'
};
STUN_SERVERS.push(TURN_SERVER);
```

For production, use TLS:
```javascript
const TURN_SERVER = {
  urls: 'turns:your-domain.com:5349',  // 's' for secure
  username: 'your-username',
  credential: 'your-password'
};
```

## Option 2: Managed TURN Services

### Twilio TURN (easiest but costs money)

```javascript
// Get credentials from Twilio API, then:
const TURN_SERVER = {
  urls: 'turn:global.turn.twilio.com:3478?transport=udp',
  username: 'twilio-provided-username',
  credential: 'twilio-provided-password'
};
STUN_SERVERS.push(TURN_SERVER);
```

**Pros:** No server management, global edge network
**Cons:** Costs money (~$0.40/GB), requires Twilio account

### Metered.ca (free tier available)

Free tier: 50GB/month
Pricing: https://www.metered.ca/tools/openrelay/

```javascript
const TURN_SERVER = {
  urls: 'turn:a.relay.metered.ca:80',
  username: 'your-metered-username',
  credential: 'your-metered-password'
};
STUN_SERVERS.push(TURN_SERVER);
```

## Advanced: Dynamic TURN Credentials (More Secure)

Instead of static credentials, generate time-limited credentials:

### Update coturn config:
```conf
# Remove static user= lines
# Add:
use-auth-secret
static-auth-secret=your-very-long-random-secret
```

### Create API endpoint to generate credentials:

Create `/api/turn-credentials.js`:
```javascript
import crypto from 'crypto';

export default function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const secret = process.env.TURN_SECRET;
  const ttl = 86400; // 24 hours
  const username = Math.floor(Date.now() / 1000) + ttl;

  const hmac = crypto.createHmac('sha1', secret);
  hmac.update(username.toString());
  const password = hmac.digest('base64');

  res.json({
    urls: `turn:${process.env.TURN_SERVER_URL}:3478`,
    username: username.toString(),
    credential: password,
    ttl: ttl
  });
}
```

Add to Vercel env:
- `TURN_SERVER_URL=your-vps-ip`
- `TURN_SECRET=your-very-long-random-secret`

### Update frontend to fetch credentials:

```javascript
// Fetch TURN credentials before creating connection
async function getTurnCredentials() {
  try {
    const res = await fetch(API_BASE + '/turn-credentials');
    if (res.ok) {
      const turnConfig = await res.json();
      STUN_SERVERS.push(turnConfig);
    }
  } catch (e) {
    console.error('Failed to get TURN credentials:', e);
  }
}

// Call before creating RTCPeerConnection
await getTurnCredentials();
pc = new RTCPeerConnection({ iceServers: STUN_SERVERS });
```

## Monitoring & Maintenance

### Check TURN usage:
```bash
sudo tail -f /var/log/turnserver.log | grep "session"
```

### Monitor bandwidth:
```bash
vnstat -l  # Install: sudo apt install vnstat
```

### Restart if needed:
```bash
sudo systemctl restart coturn
```

### Update coturn:
```bash
sudo apt update && sudo apt upgrade coturn
```

## Cost Estimates

**VPS Hosting:**
- DigitalOcean Droplet (1GB RAM): $6/month
- Linode Nanode (1GB RAM): $5/month
- Hetzner CX11 (2GB RAM): €3.79/month

**Bandwidth Usage:**
- SD quality (720p @ 15fps): ~1 Mbps = ~450 MB/hour
- HD quality (1080p @ 30fps): ~2-3 Mbps = ~1 GB/hour
- Most VPS include 1-2 TB/month free bandwidth

**Example:** 100 hours/month of HD sharing ≈ 100 GB ≈ Free on most VPS plans

## Troubleshooting

**TURN not working?**
1. Check firewall: `sudo ufw status`
2. Verify coturn running: `sudo systemctl status coturn`
3. Check logs: `sudo tail -100 /var/log/turnserver.log`
4. Test with: https://webrtc.github.io/samples/src/content/peerconnection/trickle-ice/

**High bandwidth usage?**
1. Check number of concurrent sessions in logs
2. Consider bandwidth limits in coturn config
3. Monitor with vnstat

**Security concerns?**
1. Use dynamic credentials (not static)
2. Enable TLS (port 5349)
3. Use firewall to restrict access
4. Keep coturn updated

## References

- coturn GitHub: https://github.com/coturn/coturn
- coturn Wiki: https://github.com/coturn/coturn/wiki
- RFC 5766 (TURN): https://tools.ietf.org/html/rfc5766
- WebRTC Samples: https://webrtc.github.io/samples/
