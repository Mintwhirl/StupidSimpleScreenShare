
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
const copyLinkBtn = document.getElementById('copyLinkBtn');
const connectionStats = document.getElementById('connectionStats');
const statsContent = document.getElementById('statsContent');

let localStream = null;
let pc = null;
let roomId = null;
let role = null; // 'host' or 'viewer'
let seenCandidates = new Set();
let pollIntervals = [];
let statsInterval = null;
let reconnectAttempts = 0;
const MAX_RECONNECT_ATTEMPTS = 3;

function setStatus(s){ statusEl.textContent = 'Status: ' + s; }

async function apiPost(path, body){
  try {
    const r = await fetch(API_BASE + path, {
      method: 'POST',
      headers: {'Content-Type':'application/json'},
      body: JSON.stringify(body)
    });
    if (!r.ok) {
      const errorText = await r.text();
      throw new Error(`API error: ${r.status} ${r.statusText} - ${errorText}`);
    }
    return r.json();
  } catch (e) {
    console.error('Error in apiPost:', e);
    setStatus(`API Post Error: ${e.message}`);
    throw e; // Re-throw to propagate the error
  }
}
async function apiGet(path){
  const r = await fetch(API_BASE + path);
  return r.json();
}

async function createRoom(){
  try {
    const res = await apiPost('/create-room', {});
    return res.roomId;
  } catch (e) {
    console.error('Error creating room:', e);
    setStatus('Error creating room. See console for details.');
    throw e; // re-throw the error to stop the execution flow
  }
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

// Copy link to clipboard
async function copyLink() {
  const shareUrl = linkEl.textContent;
  try {
    await navigator.clipboard.writeText(shareUrl);
    copyLinkBtn.textContent = 'Copied!';
    setTimeout(() => {
      copyLinkBtn.textContent = 'Copy Link';
    }, 2000);
  } catch (e) {
    console.error('Failed to copy:', e);
    copyLinkBtn.textContent = 'Failed to copy';
    setTimeout(() => {
      copyLinkBtn.textContent = 'Copy Link';
    }, 2000);
  }
}

// Monitor connection quality
function startConnectionStats() {
  if (!pc) return;

  connectionStats.style.display = 'block';

  statsInterval = setInterval(async () => {
    if (!pc) return;

    try {
      const stats = await pc.getStats();
      let bytesReceived = 0;
      let bytesSent = 0;
      let currentRoundTripTime = 0;
      let packetsLost = 0;

      stats.forEach(report => {
        if (report.type === 'inbound-rtp' && report.mediaType === 'video') {
          bytesReceived = report.bytesReceived || 0;
          packetsLost = report.packetsLost || 0;
        }
        if (report.type === 'outbound-rtp' && report.mediaType === 'video') {
          bytesSent = report.bytesSent || 0;
        }
        if (report.type === 'candidate-pair' && report.state === 'succeeded') {
          currentRoundTripTime = report.currentRoundTripTime || 0;
        }
      });

      const rtt = (currentRoundTripTime * 1000).toFixed(0);
      const quality = rtt < 100 ? 'Excellent' : rtt < 200 ? 'Good' : rtt < 300 ? 'Fair' : 'Poor';

      statsContent.innerHTML = `
        State: ${pc.connectionState} |
        RTT: ${rtt}ms (${quality}) |
        Packets Lost: ${packetsLost}
      `;
    } catch (e) {
      console.error('Error getting stats:', e);
    }
  }, 2000);
}

function stopConnectionStats() {
  if (statsInterval) {
    clearInterval(statsInterval);
    statsInterval = null;
  }
  connectionStats.style.display = 'none';
}

// Handle reconnection
async function handleReconnection() {
  if (reconnectAttempts >= MAX_RECONNECT_ATTEMPTS) {
    setStatus('Connection failed after multiple attempts. Please refresh.');
    return;
  }

  reconnectAttempts++;
  setStatus(`Connection lost. Reconnecting (attempt ${reconnectAttempts}/${MAX_RECONNECT_ATTEMPTS})...`);

  // Wait a bit before reconnecting
  await new Promise(resolve => setTimeout(resolve, 2000));

  if (role === 'viewer' && roomId) {
    // Restart viewer connection
    seenCandidates.clear();
    stopAllPolling();
    await viewRoom(roomId);
  }
}

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

    if (pc.connectionState === 'connected') {
      reconnectAttempts = 0;
      startConnectionStats();
    } else if (pc.connectionState === 'disconnected' || pc.connectionState === 'failed') {
      stopConnectionStats();
      if (role === 'viewer') {
        handleReconnection();
      }
    }
  };

  const offer = await pc.createOffer();
  await pc.setLocalDescription(offer);

  // post offer to server
  await postOffer(roomId, pc.localDescription.toJSON());

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

  pc.onconnectionstatechange = () => {
    setStatus('pc state: ' + pc.connectionState);

    if (pc.connectionState === 'connected') {
      reconnectAttempts = 0;
      startConnectionStats();
    } else if (pc.connectionState === 'disconnected' || pc.connectionState === 'failed') {
      stopConnectionStats();
      handleReconnection();
    }
  };

  await pc.setRemoteDescription(offerDesc);
  const answer = await pc.createAnswer();
  await pc.setLocalDescription(answer);
  await postAnswer(roomId, pc.localDescription.toJSON());

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
  stopConnectionStats();
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
  reconnectAttempts = 0;
  setStatus('stopped');
}

// Wire up buttons
startShareBtn.addEventListener('click', startShare);
stopShareBtn.addEventListener('click', stopSharing);
viewRoomBtn.addEventListener('click', () => {
  const id = roomInput.value.trim();
  viewRoom(id);
});
copyLinkBtn.addEventListener('click', copyLink);

// Auto view if ?room=... in URL
const params = new URLSearchParams(window.location.search);
if (params.has('room')) {
  const id = params.get('room');
  roomInput.value = id;
  // Optionally auto-start viewer mode:
  viewRoom(id);
}

// Small helper: detect GET endpoints that return 404 gracefully.
// That's handled above where we check response.status.
