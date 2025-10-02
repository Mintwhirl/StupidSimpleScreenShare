STUPID-SIMPLE Screen Share — Proof-of-Concept (copy-paste this whole file to Gemini / Claude / your dev agent)

Short version: browser-based WebRTC screen sharing + ephemeral link (no installs). Signaling server = tiny Vercel serverless API + Upstash (free Redis) for short-lived offer/answer/candidate exchange (polling). Uses free STUNs for NAT traversal; optionally add a TURN server if you hit strict NATs/firewalls. Traffic (video) is P2P via WebRTC SRTP — Vercel / Upstash only handle signaling data (tiny) and not the video stream.

Goals / Constraints (explicit)

No signup, no account, no installs — Browser only (Chrome/Edge/Safari).

One-click link sharing: host clicks Start sharing, gets a short, unguessable URL to send to buddy. Buddy opens link → sees host's screen.

Ephemeral links by default (auto-expire).

No built-in voice for MVP (we left voice out).

Target frame rate: ~15–30fps (good for coding help).

Keep it free where practical. Be honest: STUN-only solves ~95% of cases. For strict double NAT and symmetric NAT cases, a TURN server (relay) will be required — TURN typically requires a VPS (some small cost unless you find a free TURN). We provide an optional coturn guide later.

Security: TLS (Vercel provides it), unguessable room IDs, short TTL, WebRTC encryption (SRTP) — built in.

High level architecture
[Host Browser]  <--P2P WebRTC (video SRTP)-->  [Viewer Browser]
       ^                                            ^
       |                                            |
       \--- Signaling via HTTPS (Vercel serverless + Upstash Redis) ---/


Signaling (offer/answer/ICE candidates) is posted/polled via Vercel API endpoints backed by Upstash Redis. Small messages only.

Media (screen frames) flows directly between peers over WebRTC whenever possible (STUN used for NAT traversal).

If peer-to-peer fails because of restrictive NATs, you’ll need a TURN server (optional step).

Tech stack (minimal)

Frontend: single static index.html + one JS file (vanilla JS). No build step required.

Signaling: Vercel Serverless API functions (Node.js) — HTTP POST/GET endpoints.

Short-term store: Upstash Redis (free tier) — store offer/answer/candidates with TTL.

WebRTC: built-in browser APIs (getDisplayMedia, RTCPeerConnection).

Optional TURN server: coturn (self-hosted on VPS) — instructions below.

File structure (repo)
/public
  index.html
  client.js
/api
  create-room.js
  offer.js       (POST/GET)
  answer.js      (POST/GET)
  candidate.js   (POST to push candidate, GET to fetch candidates)
package.json
README.md

API spec (simple, REST)

All endpoints accept/return JSON; CORS enabled.

POST /api/create-room

Request: {}

Response: { roomId: "<unguessable-id>" }

Creates a room id and reserves a TTL in Redis.

POST /api/offer

Request: { roomId, desc } where desc = { type: "offer", sdp: "..." }

Stores offer under room:{roomId}:offer and sets TTL.

GET /api/offer?roomId=...

Response: { desc } or 404

POST /api/answer

Request: { roomId, desc } where desc = { type: "answer", sdp: "..." }

Stores answer under room:{roomId}:answer.

GET /api/answer?roomId=...

Response: { desc } or 404

POST /api/candidate

Request: { roomId, role, candidate } where role in ["host","viewer"] and candidate is ICE candidate object

Pushes candidate into Redis list room:{roomId}:{role}:candidates (and sets TTL).

GET /api/candidate?roomId=...&role=host|viewer

Response: { candidates: [...] } and the endpoint removes returned candidates (so each candidate is delivered once).

Notes: Using lists and removing candidates avoids duplicate adds on the peer.

Backend: Vercel API (example code)

Note for implementer: I use the @upstash/redis client here. Put these files in /api. Set environment variables UPSTASH_REST_URL and UPSTASH_REST_TOKEN (names below). Use Node 18+.

Install dependency:

npm init -y
npm i @upstash/redis


common header for each function (CORS + Upstash init)

// utils.js (conceptual - or copy header into each file)
import { Redis } from "@upstash/redis";
export const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL,
  token: process.env.UPSTASH_REDIS_REST_TOKEN
});

export function setCors(res){
  res.setHeader('Access-Control-Allow-Origin','*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if(res.method === 'OPTIONS') res.status(204).end();
}


/api/create-room.js

import { Redis } from "@upstash/redis";
import { randomBytes } from "crypto";

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL,
  token: process.env.UPSTASH_REDIS_REST_TOKEN
});

export default async function handler(req, res) {
  // CORS
  res.setHeader('Access-Control-Allow-Origin','*');
  res.setHeader('Access-Control-Allow-Headers','Content-Type');
  if (req.method === 'OPTIONS') { res.status(204).end(); return; }
  if (req.method !== 'POST') return res.status(405).json({ error: 'Only POST' });

  const roomId = randomBytes(12).toString('hex'); // 24 hex chars, unguessable
  // create a marker key and set TTL (e.g., 30 minutes)
  await redis.set(`room:${roomId}:meta`, JSON.stringify({ createdAt: Date.now() }));
  await redis.expire(`room:${roomId}:meta`, 60 * 30);

  res.json({ roomId });
}


/api/offer.js

import { Redis } from "@upstash/redis";
const redis = new Redis({...});

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin','*');
  res.setHeader('Access-Control-Allow-Headers','Content-Type');
  if (req.method === 'OPTIONS') { res.status(204).end(); return; }

  if (req.method === 'POST') {
    const { roomId, desc } = req.body;
    if (!roomId || !desc) return res.status(400).json({ error: 'Missing' });
    await redis.set(`room:${roomId}:offer`, JSON.stringify(desc));
    await redis.expire(`room:${roomId}:offer`, 60 * 30);
    return res.json({ ok: true });
  }

  if (req.method === 'GET') {
    const { roomId } = req.query;
    const raw = await redis.get(`room:${roomId}:offer`);
    if (!raw) return res.status(404).json({ error: 'no offer' });
    return res.json({ desc: JSON.parse(raw) });
  }

  res.status(405).json({ error: 'Method' });
}


/api/answer.js — same pattern as offer.js but keys room:{id}:answer.

/api/candidate.js

import { Redis } from "@upstash/redis";
const redis = new Redis({...});

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin','*');
  res.setHeader('Access-Control-Allow-Headers','Content-Type');
  if (req.method === 'OPTIONS') { res.status(204).end(); return; }

  if (req.method === 'POST') {
    const { roomId, role, candidate } = req.body;
    if (!roomId || !role || !candidate) return res.status(400).json({ error: 'Missing' });
    const key = `room:${roomId}:${role}:candidates`;
    await redis.rpush(key, JSON.stringify(candidate));
    await redis.expire(key, 60 * 30);
    return res.json({ ok: true });
  }

  if (req.method === 'GET') {
    const { roomId, role } = req.query;
    if (!roomId || !role) return res.status(400).json({ error: 'Missing' });
    const key = `room:${roomId}:${role}:candidates`;
    const arr = await redis.lrange(key, 0, -1) || [];
    if (arr.length) await redis.del(key); // remove after fetching
    const parsed = arr.map(a => JSON.parse(a));
    return res.json({ candidates: parsed });
  }

  res.status(405).json({ error: 'Method' });
}


Note to dev agent: Put real Upstash env keys into Vercel as UPSTASH_REDIS_REST_URL and UPSTASH_REDIS_REST_TOKEN. TTLs are in seconds (here 30 minutes).

Frontend: index.html + client.js (full MVP)

This is a single-page app. It has two modes: host (start sharing) and viewer (open link). Put both files in public/.

index.html

<!doctype html>
<html>
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width,initial-scale=1" />
  <title>Stupid Simple Screen Share</title>
  <style>
    body{font-family:system-ui,Segoe UI,Roboto,Arial;background:#0f172a;color:#e6eef8;padding:18px}
    button{padding:10px 14px;margin:6px;font-size:15px}
    #local,#remote{width:100%;max-height:60vh;background:#000}
    .controls{margin-bottom:12px}
    .linkbox{margin-top:10px;background:#0b1220;padding:10px;border-radius:6px;word-break:break-all}
    .muted{opacity:.7;font-size:13px}
  </style>
</head>
<body>
  <h1>Stupid-Simple Screen Share</h1>
  <div class="controls">
    <button id="startShare">Start sharing my screen</button>
    <button id="stopShare" disabled>Stop sharing</button>
    <button id="viewRoom">Open room link (viewer)</button>
    <input id="roomInput" placeholder="Paste room id here" style="width:240px;margin-left:8px" />
  </div>

  <div id="status" class="muted">Status: idle</div>

  <div>
    <h3>Local preview</h3>
    <video id="local" autoplay muted playsinline></video>
  </div>
  <div>
    <h3>Remote preview</h3>
    <video id="remote" autoplay playsinline></video>
  </div>

  <div id="linkWrap" style="display:none">
    <div class="linkbox"><strong>Share this link</strong><div id="link"></div></div>
  </div>

<script type="module" src="/client.js"></script>
</body>
</html>


client.js

// client.js (vanilla JS)
const API_BASE = window.location.origin + '/api';
const STUN_SERVERS = [
  { urls: 'stun:stun.l.google.com:19302' },
  { urls: 'stun:stun1.l.google.com:19302' },
  { urls: 'stun:stun.stunprotocol.org:3478' }
];

// UI refs
const startShareBtn = document.getElementById('startShare');
const stopShareBtn = document.getElementById('stopShare');
const viewRoomBtn = document.getElementById('viewRoom');
const roomInput = document.getElementById('roomInput');
const localVideo = document.getElementById('local');
const remoteVideo = document.getElementById('remote');
const statusEl = document.getElementById('status');
const linkWrap = document.getElementById('linkWrap');
const linkEl = document.getElementById('link');

let localStream = null;
let pc = null;
let roomId = null;
let role = null; // 'host' or 'viewer'
let seenCandidates = new Set();
let pollIntervals = [];

function setStatus(s){ statusEl.textContent = 'Status: ' + s; }

async function apiPost(path, body){
  const r = await fetch(API_BASE + path, {
    method: 'POST',
    headers: {'Content-Type':'application/json'},
    body: JSON.stringify(body)
  });
  return r.json();
}
async function apiGet(path){
  const r = await fetch(API_BASE + path);
  return r.json();
}

async function createRoom(){
  const res = await apiPost('/create-room', {});
  return res.roomId;
}

async function postOffer(roomId, desc){ return apiPost('/offer', { roomId, desc }); }
async function fetchOffer(roomId){ return apiGet(`/offer?roomId=${roomId}`); }
async function postAnswer(roomId, desc){ return apiPost('/answer', { roomId, desc }); }
async function fetchAnswer(roomId){ return apiGet(`/answer?roomId=${roomId}`); }
async function postCandidate(roomId, role, candidate){ return apiPost('/candidate', { roomId, role, candidate }); }
async function fetchCandidates(roomId, role){ return apiGet(`/candidate?roomId=${roomId}&role=${role}`); }

// Poll helper
function startPolling(fn, ms=1000){ const id = setInterval(fn, ms); pollIntervals.push(id); return id; }
function stopAllPolling(){ pollIntervals.forEach(i=>clearInterval(i)); pollIntervals = []; }

// Host flow
async function startShare(){
  role = 'host';
  setStatus('asking for screen permission...');
  try {
    localStream = await navigator.mediaDevices.getDisplayMedia({ video: true, audio: false });
  } catch(e){ setStatus('screen permission denied'); return; }

  localVideo.srcObject = localStream;
  setStatus('getting room id...');
  roomId = await createRoom();

  // Build RTCPeerConnection
  pc = new RTCPeerConnection({ iceServers: STUN_SERVERS });
  localStream.getTracks().forEach(t => pc.addTrack(t, localStream));

  pc.onicecandidate = (e) => {
    if (e.candidate) {
      postCandidate(roomId, 'host', e.candidate.toJSON()).catch(()=>{});
    }
  };

  pc.onconnectionstatechange = () => {
    setStatus('pc state: ' + pc.connectionState);
  };

  const offer = await pc.createOffer();
  await pc.setLocalDescription(offer);

  // post offer to server
  await postOffer(roomId, pc.localDescription);

  // show link
  const shareUrl = `${window.location.origin}/?room=${roomId}`;
  linkWrap.style.display = 'block';
  linkEl.textContent = shareUrl;
  startShareBtn.disabled = true;
  stopShareBtn.disabled = false;
  setStatus('waiting for viewer to connect... (share link)');

  // poll for answer
  const answerPoll = async () => {
    try {
      const res = await fetch(`${API_BASE}/answer?roomId=${roomId}`);
      if (res.status === 200) {
        const body = await res.json();
        if (body.desc) {
          await pc.setRemoteDescription(body.desc);
          setStatus('remote description set — connected (or connecting)');
          // stop polling answer
          // but we keep candidate polling
          clearInterval(answerInterval);
        }
      }
    } catch(e){}
  };
  const answerInterval = startPolling(answerPoll, 1500);

  // poll viewer candidates and add them
  startPolling(async () => {
    try {
      const resp = await fetch(`${API_BASE}/candidate?roomId=${roomId}&role=viewer`);
      if (resp.status === 200) {
        const body = await resp.json();
        const candidates = body.candidates || [];
        for (const c of candidates) {
          const idKey = JSON.stringify(c);
          if (!seenCandidates.has(idKey)) {
            seenCandidates.add(idKey);
            try { await pc.addIceCandidate(c); } catch(e){}
          }
        }
      }
    } catch(e){}
  }, 1000);
}

// Viewer flow
async function viewRoom(suppliedRoomId){
  role = 'viewer';
  roomId = suppliedRoomId;
  if (!roomId) {
    setStatus('no room id supplied');
    return;
  }
  setStatus('fetching offer...');
  const res = await fetch(`${API_BASE}/offer?roomId=${roomId}`);
  if (res.status !== 200) {
    setStatus('no such room / offer not found');
    return;
  }
  const body = await res.json();
  const offerDesc = body.desc;

  pc = new RTCPeerConnection({ iceServers: STUN_SERVERS });

  pc.ontrack = (e) => {
    remoteVideo.srcObject = e.streams[0];
    setStatus('received remote track');
  };
  pc.onicecandidate = (e) => {
    if (e.candidate) {
      postCandidate(roomId, 'viewer', e.candidate.toJSON()).catch(()=>{});
    }
  };

  await pc.setRemoteDescription(offerDesc);
  const answer = await pc.createAnswer();
  await pc.setLocalDescription(answer);
  await postAnswer(roomId, pc.localDescription);

  setStatus('sent answer, waiting for media...');

  // poll for host candidates and add
  startPolling(async () => {
    try {
      const resp = await fetch(`${API_BASE}/candidate?roomId=${roomId}&role=host`);
      if (resp.status === 200) {
        const body = await resp.json();
        const candidates = body.candidates || [];
        for (const c of candidates) {
          const idKey = JSON.stringify(c);
          if (!seenCandidates.has(idKey)) {
            seenCandidates.add(idKey);
            try { await pc.addIceCandidate(c); } catch(e){}
          }
        }
      }
    } catch(e){}
  }, 1000);
}

function stopSharing(){
  stopAllPolling();
  if (pc) {
    try { pc.close(); } catch(e){}
    pc = null;
  }
  if (localStream) {
    localStream.getTracks().forEach(t=>t.stop());
    localStream = null;
    localVideo.srcObject = null;
  }
  startShareBtn.disabled = false;
  stopShareBtn.disabled = true;
  linkWrap.style.display = 'none';
  setStatus('stopped');
}

// Wire up buttons
startShareBtn.addEventListener('click', startShare);
stopShareBtn.addEventListener('click', stopSharing);
viewRoomBtn.addEventListener('click', () => {
  const id = roomInput.value.trim();
  viewRoom(id);
});

// Auto view if ?room=... in URL
const params = new URLSearchParams(window.location.search);
if (params.has('room')) {
  const id = params.get('room');
  roomInput.value = id;
  // Optionally auto-start viewer mode:
  // viewRoom(id);
}

// Small helper: detect GET endpoints that return 404 gracefully.
// That's handled above where we check response.status.


Important: Put CORS handling into your API endpoints or set Access-Control-Allow-Origin to your frontend origin. Example backend code above sets it to * for simplicity (acceptable for a private small tool, but restrict origin in production).

How signaling works (flow)

Host calls POST /api/create-room → gets roomId. Host UI posts offer to POST /api/offer.

Host shares URL: https://yourdomain/?room=<roomId>.

Viewer opens URL → client calls GET /api/offer?roomId= → gets offer, sets remote description, creates answer, posts POST /api/answer.

Host polls GET /api/answer?roomId= until receives the answer, sets remote description.

Both host and viewer exchange ICE candidates via POST /api/candidate and GET /api/candidates (polling).

Once ICE negotiation succeeds, WebRTC establishes a P2P SRTP media channel and the viewer sees the host’s screen.

NAT / firewall reality check (be direct)

STUN only (no TURN): works for most home NATs. STUN helps peers discover public addresses and tries to create P2P flows. Free STUN servers (Google) are used above.

If connection cannot be established (common in corporate networks, symmetric NAT, strict CGNAT), you’ll see pc.connectionState stuck in checking or go to failed. Then you need a TURN relay.

TURN = relay (volume = actual media traffic, not cheap on hosted relays). To stay “free” we attempt STUN first, and the app will explain to user to set up TURN if necessary. For robust personal use, spinning up a small VPS with coturn is the usual path (one-time cost / low monthly VPS cost).

Optional: Deploy your own TURN (coturn) — short guide

If and only if you find STUN fails frequently. This is not free long-term (VPS costs), but it gives reliable relay fallback.

Rent a small VPS (DigitalOcean / Linode / Hetzner — smallest plan).

Install coturn on Ubuntu (example):

sudo apt update
sudo apt install coturn -y
# edit /etc/turnserver.conf
# add:
# listening-port=3478
# tls-listening-port=5349
# listening-ip=<YOUR_PUBLIC_IP>
# relay-ip=<YOUR_PUBLIC_IP>
# min-port=49152
# max-port=65535
# fingerprint
# lt-cred-mech
# use-auth-secret
# static-auth-secret=<a long random secret>
# realm=<your-domain-or-ip>
# no-stdout-log


Use LetsEncrypt certs for TLS (if you want coturn to support TLS). Start and enable service.

In your client STUN_SERVERS list add:

{ urls: 'turn:<YOUR_TURN_IP_OR_HOST>:3478', username: '<user>', credential: '<pass>' }


Or if you configure use-auth-secret, generate temporary credentials per RFC 5766.

If you want, your dev agent can automate a coturn docker setup and a script to create ephemeral TURN credentials.

Deployment instructions (step-by-step)

Sign up Upstash (free): create a Redis database. Save REST URL and token. (Upstash has a free tier).

Create Vercel account (free). Create a new project connecting GitHub repo (or deploy via vercel CLI).

Set environment variables in Vercel:

UPSTASH_REDIS_REST_URL = <your upstash URL>

UPSTASH_REDIS_REST_TOKEN = <your upstash token>

Commit repo with the structure above and push to GitHub. Vercel auto-deploys.

Open your Vercel URL (https://<project>.vercel.app) and test Start sharing. Share link with a friend (or open in another browser/incognito) and test cross-network.

Local dev: use vercel dev (install Vercel CLI) to emulate serverless functions locally.

Debugging tips

Check browser console for WebRTC ICE logs (PC state, ICE candidates).

Inspect pc.iceConnectionState and pc.connectionState.

If stuck in checking for >30s: likely blocked by NAT — consider TURN.

If you see No remote tracks — ensure host added tracks (getDisplayMedia permission).

If viewer never receives answer: confirm POST /api/answer succeeded; check Upstash keys in Redis console.

Security checklist (must do)

Use HTTPS (Vercel does by default).

Use long random room IDs (we used 12 random bytes hex). Don’t make predictable names.

TTL: expire room keys (we used 30 minutes). Adjust shorter if you want more privacy.

Consider restricting Access-Control-Allow-Origin to your domain instead of * for extra security.

WebRTC SRTP encrypts media streams end-to-end — even with relay, media is encrypted.

Acceptance criteria for the MVP (what I expect from your dev agent)

Functional: Host can create a room → share link → viewer opens link → viewer sees host screen within 60s in STUN-friendly networks.

Ephemeral: Room keys and candidates expire after TTL (e.g., 30 minutes).

Signaling: Implement endpoints described above using Vercel serverless + Upstash Redis.

UI: Minimal but usable: Start, Stop, Copy link, Viewer auto-connect via ?room= param.

Docs: README with deploy steps + how to configure Upstash & Vercel env vars + troubleshooting.

Security: Unpredictable room IDs; TLS; WebRTC encryption used; CORS not too permissive (or documented).

Polish: Helpful status messages visible in the UI, clear error when NAT prevents connection, instructions for TURN.