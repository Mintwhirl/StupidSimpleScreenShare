
// client.js (vanilla JS)
const API_BASE = window.location.origin + '/api';

// Optional: Auth secret for creating rooms (set in environment variables)
// If you set AUTH_SECRET on server, you need to provide it here
// This prevents random people from creating rooms on your deployment
// Leave empty/null if AUTH_SECRET is not set on server
const AUTH_SECRET = null; // or 'your-secret-key'

// ICE servers configuration (STUN + optional TURN)
// To add TURN server: Set environment variables TURN_URL, TURN_USERNAME, TURN_CREDENTIAL
const STUN_SERVERS = [
  { urls: 'stun:stun.l.google.com:19302' },
  { urls: 'stun:stun1.l.google.com:19302' },
  { urls: 'stun:stun.stunprotocol.org:3478' }
];

// TURN server configuration (optional - for strict NAT/firewall environments)
// Format: { urls: 'turn:your-turn-server.com:3478', username: 'user', credential: 'pass' }
// Uncomment and configure if needed:
/*
const TURN_SERVER = {
  urls: 'turn:your-turn-server.com:3478',
  username: 'your-username',
  credential: 'your-password'
};
STUN_SERVERS.push(TURN_SERVER);
*/

// UI refs
const startShareBtn = document.getElementById('startShare');
const stopShareBtn = document.getElementById('stopShare');
const startRecordingBtn = document.getElementById('startRecording');
const stopRecordingBtn = document.getElementById('stopRecording');
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
const recordingStatus = document.getElementById('recordingStatus');
const recordingTime = document.getElementById('recordingTime');
const viewerCountEl = document.getElementById('viewerCountNum');
const chatBox = document.getElementById('chatBox');
const chatMessages = document.getElementById('chatMessages');
const chatInput = document.getElementById('chatInput');
const sendChatBtn = document.getElementById('sendChatBtn');
const runDiagnosticsBtn = document.getElementById('runDiagnostics');
const diagnosticsModal = document.getElementById('diagnosticsModal');
const diagnosticsContent = document.getElementById('diagnosticsContent');
const closeDiagnosticsBtn = document.getElementById('closeDiagnostics');

let localStream = null;
let pc = null;
let roomId = null;
let role = null; // 'host' or 'viewer'
let seenCandidates = new Set();
let pollIntervals = [];
let statsInterval = null;
let reconnectAttempts = 0;
const MAX_RECONNECT_ATTEMPTS = 3;

// Recording state
let mediaRecorder = null;
let recordedChunks = [];
let recordingStartTime = null;
let recordingTimerInterval = null;

// Viewer tracking
let viewerId = null;
let heartbeatInterval = null;

// Chat state
let lastChatTimestamp = 0;
let chatPollInterval = null;
let userName = null;

function setStatus(s){ statusEl.textContent = 'Status: ' + s; }

async function apiPost(path, body){
  try {
    const r = await fetch(API_BASE + path, {
      method: 'POST',
      headers: {'Content-Type':'application/json'},
      body: JSON.stringify(body)
    });

    if (!r.ok) {
      let errorMsg;
      try {
        const errorData = await r.json();
        errorMsg = errorData.error || errorData.message || r.statusText;
      } catch (e) {
        errorMsg = await r.text() || r.statusText;
      }

      // Provide user-friendly error messages
      if (r.status === 400) {
        throw new Error(`Invalid request: ${errorMsg}`);
      } else if (r.status === 404) {
        throw new Error(`Resource not found: ${errorMsg}`);
      } else if (r.status === 410) {
        throw new Error(`Room expired or not found. Please create a new room.`);
      } else if (r.status >= 500) {
        throw new Error(`Server error: ${errorMsg}. Please try again later.`);
      } else {
        throw new Error(`API error (${r.status}): ${errorMsg}`);
      }
    }

    return r.json();
  } catch (e) {
    console.error('Error in apiPost:', e);
    setStatus(`Error: ${e.message}`);
    throw e;
  }
}

async function apiGet(path){
  try {
    const r = await fetch(API_BASE + path);

    if (!r.ok) {
      let errorMsg;
      try {
        const errorData = await r.json();
        errorMsg = errorData.error || errorData.message || r.statusText;
      } catch (e) {
        errorMsg = await r.text() || r.statusText;
      }

      if (r.status === 410) {
        throw new Error(`Room expired or not found`);
      } else if (r.status === 404) {
        // 404 is sometimes expected (e.g., no answer yet), return null
        return null;
      }

      throw new Error(`API error (${r.status}): ${errorMsg}`);
    }

    return r.json();
  } catch (e) {
    // Don't log 404s as they're expected during polling
    if (!e.message.includes('404')) {
      console.error('Error in apiGet:', e);
    }
    throw e;
  }
}

async function createRoom(){
  try {
    const body = {};
    if (AUTH_SECRET) {
      body.authSecret = AUTH_SECRET;
    }
    const res = await apiPost('/create-room', body);
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
async function postViewerHeartbeat(roomId, viewerId){ return apiPost('/viewers', { roomId, viewerId }); }
async function fetchViewerCount(roomId){ return apiGet(`/viewers?roomId=${roomId}`); }
async function postChatMessage(roomId, sender, message){ return apiPost('/chat', { roomId, sender, message }); }
async function fetchChatMessages(roomId, since){ return apiGet(`/chat?roomId=${roomId}&since=${since}`); }
async function fetchDiagnostics(roomId){ return apiGet(`/diagnostics${roomId ? '?roomId=' + roomId : ''}`); }

// Poll helper
function startPolling(fn, ms=1000){ const id = setInterval(fn, ms); pollIntervals.push(id); return id; }
function stopAllPolling(){ pollIntervals.forEach(i=>clearInterval(i)); pollIntervals = []; }

// Viewer presence tracking
function startViewerHeartbeat() {
  if (!roomId || !viewerId) return;

  // Send immediate heartbeat
  postViewerHeartbeat(roomId, viewerId).catch(console.error);

  // Send heartbeat every 15 seconds
  heartbeatInterval = setInterval(() => {
    postViewerHeartbeat(roomId, viewerId).catch(console.error);
  }, 15000);
}

function stopViewerHeartbeat() {
  if (heartbeatInterval) {
    clearInterval(heartbeatInterval);
    heartbeatInterval = null;
  }
}

// Poll viewer count (host only)
function startViewerCountPolling() {
  if (role !== 'host' || !roomId) return;

  startPolling(async () => {
    try {
      const result = await fetchViewerCount(roomId);
      if (viewerCountEl) {
        viewerCountEl.textContent = result.count || 0;
      }
    } catch (e) {
      console.error('Error fetching viewer count:', e);
    }
  }, 5000);
}

// Chat functionality
function escapeHtml(text) {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

function displayChatMessage(msg) {
  const messageEl = document.createElement('div');
  messageEl.className = 'chat-message';

  const time = new Date(msg.timestamp).toLocaleTimeString();
  messageEl.innerHTML = `<strong>${escapeHtml(msg.sender)}</strong> <span class="muted">${time}</span><br>${escapeHtml(msg.message)}`;

  chatMessages.appendChild(messageEl);
  chatMessages.scrollTop = chatMessages.scrollHeight;
}

async function sendChatMessage() {
  const message = chatInput.value.trim();
  if (!message || !roomId) return;

  if (!userName) {
    userName = prompt('Enter your name:') || 'Anonymous';
  }

  try {
    await postChatMessage(roomId, userName, message);
    chatInput.value = '';
  } catch (e) {
    console.error('Error sending chat message:', e);
    setStatus('Failed to send message');
  }
}

function startChatPolling() {
  if (!roomId) return;

  chatBox.style.display = 'block';

  // Poll for new messages every 2 seconds
  startPolling(async () => {
    try {
      const result = await fetchChatMessages(roomId, lastChatTimestamp);
      if (result.messages && result.messages.length > 0) {
        result.messages.forEach(msg => {
          displayChatMessage(msg);
          lastChatTimestamp = Math.max(lastChatTimestamp, msg.timestamp);
        });
      }
    } catch (e) {
      console.error('Error fetching chat messages:', e);
    }
  }, 2000);
}

// Network Diagnostics
async function runDiagnostics() {
  diagnosticsModal.style.display = 'block';
  diagnosticsContent.innerHTML = '<div style="text-align: center;">Running diagnostics...</div>';

  try {
    // Test WebRTC support
    const webrtcSupport = checkWebRTCSupport();

    // Test STUN server connectivity
    const stunTest = await testSTUNConnectivity();

    // Test API server
    const serverDiag = await fetchDiagnostics(roomId);

    // Build report
    let report = '<div style="color: #00f5d4; font-weight: bold; margin-bottom: 16px;">📊 Diagnostic Report</div>';

    // Browser support
    report += '<div style="margin-bottom: 12px;"><strong>Browser Support:</strong><br/>';
    report += `  getUserMedia: ${webrtcSupport.getUserMedia ? '✅' : '❌'}<br/>`;
    report += `  RTCPeerConnection: ${webrtcSupport.rtcPeerConnection ? '✅' : '❌'}<br/>`;
    report += `  MediaRecorder: ${webrtcSupport.mediaRecorder ? '✅' : '❌'}</div>`;

    // STUN connectivity
    report += '<div style="margin-bottom: 12px;"><strong>STUN Server:</strong><br/>';
    report += `  Status: ${stunTest.success ? '✅ Connected' : '❌ Failed'}<br/>`;
    if (stunTest.candidate) {
      report += `  Your IP: ${stunTest.candidate}<br/>`;
    }
    report += `  Latency: ${stunTest.latency}ms</div>`;

    // Server status
    if (serverDiag.server) {
      report += '<div style="margin-bottom: 12px;"><strong>Server Status:</strong><br/>';
      report += `  Status: ${serverDiag.server.status === 'online' ? '✅' : '❌'} ${serverDiag.server.status}<br/>`;
      report += `  Redis: ${serverDiag.server.redis === 'connected' ? '✅' : '❌'} ${serverDiag.server.redis}<br/>`;
      report += `  Region: ${serverDiag.server.region}</div>`;
    }

    // Room status (if in a room)
    if (serverDiag.room) {
      report += '<div style="margin-bottom: 12px;"><strong>Room Status:</strong><br/>';
      report += `  Exists: ${serverDiag.room.exists ? '✅' : '❌'}<br/>`;
      if (serverDiag.room.exists) {
        report += `  Has Offer: ${serverDiag.room.hasOffer ? '✅' : '❌'}<br/>`;
        report += `  Has Answer: ${serverDiag.room.hasAnswer ? '✅' : '❌'}<br/>`;
        report += `  Active Viewers: ${serverDiag.room.viewerCount || 0}<br/>`;
        report += `  Chat Messages: ${serverDiag.room.chatMessageCount || 0}</div>`;
      }
    }

    // Connection state
    if (pc) {
      report += '<div style="margin-bottom: 12px;"><strong>WebRTC Connection:</strong><br/>';
      report += `  Connection State: ${pc.connectionState}<br/>`;
      report += `  ICE Connection State: ${pc.iceConnectionState}<br/>`;
      report += `  Signaling State: ${pc.signalingState}</div>`;
    }

    // Recommendations
    report += '<div style="margin-top: 16px; padding: 12px; background: #2d3748; border-radius: 6px;">';
    report += '<strong>💡 Recommendations:</strong><br/>';

    if (!webrtcSupport.getUserMedia || !webrtcSupport.rtcPeerConnection) {
      report += '⚠️ Your browser does not fully support WebRTC. Please use Chrome, Firefox, or Edge.<br/>';
    }

    if (!stunTest.success) {
      report += '⚠️ Cannot connect to STUN servers. You may need a TURN relay for NAT traversal.<br/>';
    }

    if (pc && (pc.connectionState === 'failed' || pc.iceConnectionState === 'failed')) {
      report += '⚠️ Connection failed. This usually indicates firewall/NAT issues. Try a different network.<br/>';
    }

    report += '</div>';

    diagnosticsContent.innerHTML = report;
  } catch (error) {
    console.error('Diagnostics error:', error);
    diagnosticsContent.innerHTML = `<div style="color: #f56565;">Error running diagnostics: ${error.message}</div>`;
  }
}

function checkWebRTCSupport() {
  return {
    getUserMedia: !!(navigator.mediaDevices && navigator.mediaDevices.getUserMedia),
    rtcPeerConnection: !!window.RTCPeerConnection,
    mediaRecorder: !!window.MediaRecorder
  };
}

async function testSTUNConnectivity() {
  const startTime = Date.now();

  try {
    const pc = new RTCPeerConnection({ iceServers: STUN_SERVERS });

    return new Promise((resolve) => {
      let resolved = false;

      pc.onicecandidate = (e) => {
        if (resolved) return;

        if (e.candidate && e.candidate.type === 'srflx') {
          resolved = true;
          pc.close();
          resolve({
            success: true,
            candidate: e.candidate.address || e.candidate.ip,
            latency: Date.now() - startTime
          });
        }
      };

      pc.createDataChannel('test');
      pc.createOffer().then(offer => pc.setLocalDescription(offer));

      // Timeout after 5 seconds
      setTimeout(() => {
        if (!resolved) {
          resolved = true;
          pc.close();
          resolve({
            success: false,
            latency: Date.now() - startTime
          });
        }
      }, 5000);
    });
  } catch (e) {
    return {
      success: false,
      error: e.message,
      latency: Date.now() - startTime
    };
  }
}

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

// Recording functionality
function startRecording() {
  if (!localStream) {
    setStatus('No stream available to record');
    return;
  }

  try {
    // Determine best codec
    const options = { mimeType: 'video/webm;codecs=vp9' };

    if (!MediaRecorder.isTypeSupported(options.mimeType)) {
      options.mimeType = 'video/webm;codecs=vp8';

      if (!MediaRecorder.isTypeSupported(options.mimeType)) {
        options.mimeType = 'video/webm';

        if (!MediaRecorder.isTypeSupported(options.mimeType)) {
          throw new Error('No supported video codec found');
        }
      }
    }

    recordedChunks = [];
    mediaRecorder = new MediaRecorder(localStream, options);

    mediaRecorder.ondataavailable = (event) => {
      if (event.data && event.data.size > 0) {
        recordedChunks.push(event.data);
      }
    };

    mediaRecorder.onstop = () => {
      const blob = new Blob(recordedChunks, { type: 'video/webm' });
      const url = URL.createObjectURL(blob);

      // Create download link
      const a = document.createElement('a');
      a.style.display = 'none';
      a.href = url;
      a.download = `screen-recording-${new Date().toISOString().slice(0, 19).replace(/:/g, '-')}.webm`;
      document.body.appendChild(a);
      a.click();

      // Cleanup
      setTimeout(() => {
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
      }, 100);

      setStatus('Recording saved successfully');
    };

    mediaRecorder.onerror = (event) => {
      console.error('MediaRecorder error:', event);
      setStatus('Recording error: ' + (event.error?.message || 'Unknown error'));
      stopRecording();
    };

    // Start recording with 1 second chunks
    mediaRecorder.start(1000);

    recordingStartTime = Date.now();
    startRecordingBtn.disabled = true;
    stopRecordingBtn.disabled = false;
    recordingStatus.style.display = 'block';

    // Update recording timer
    updateRecordingTimer();
    recordingTimerInterval = setInterval(updateRecordingTimer, 1000);

    setStatus('Recording started');
  } catch (error) {
    console.error('Failed to start recording:', error);
    setStatus('Failed to start recording: ' + error.message);
  }
}

function stopRecording() {
  if (mediaRecorder && mediaRecorder.state !== 'inactive') {
    mediaRecorder.stop();
  }

  if (recordingTimerInterval) {
    clearInterval(recordingTimerInterval);
    recordingTimerInterval = null;
  }

  startRecordingBtn.disabled = false;
  stopRecordingBtn.disabled = true;
  recordingStatus.style.display = 'none';
  recordingStartTime = null;
}

function updateRecordingTimer() {
  if (!recordingStartTime) return;

  const elapsed = Math.floor((Date.now() - recordingStartTime) / 1000);
  const minutes = Math.floor(elapsed / 60).toString().padStart(2, '0');
  const seconds = (elapsed % 60).toString().padStart(2, '0');
  recordingTime.textContent = `${minutes}:${seconds}`;
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
  startRecordingBtn.disabled = false;
  setStatus('waiting for viewer to connect... (share link)');

  // Start viewer count polling
  startViewerCountPolling();

  // Start chat
  startChatPolling();

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

  // Generate unique viewer ID
  if (!viewerId) {
    viewerId = 'viewer_' + Math.random().toString(36).substring(2, 15);
  }

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

  // Start viewer heartbeat
  startViewerHeartbeat();

  // Start chat
  startChatPolling();

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
  stopViewerHeartbeat();

  // Stop recording if active
  if (mediaRecorder && mediaRecorder.state !== 'inactive') {
    stopRecording();
  }

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
  startRecordingBtn.disabled = true;
  stopRecordingBtn.disabled = true;
  linkWrap.style.display = 'none';
  reconnectAttempts = 0;
  setStatus('stopped');
}

// Wire up buttons
startShareBtn.addEventListener('click', startShare);
stopShareBtn.addEventListener('click', stopSharing);
startRecordingBtn.addEventListener('click', startRecording);
stopRecordingBtn.addEventListener('click', stopRecording);
viewRoomBtn.addEventListener('click', () => {
  const id = roomInput.value.trim();
  viewRoom(id);
});
copyLinkBtn.addEventListener('click', copyLink);
sendChatBtn.addEventListener('click', sendChatMessage);
chatInput.addEventListener('keypress', (e) => {
  if (e.key === 'Enter') {
    sendChatMessage();
  }
});
runDiagnosticsBtn.addEventListener('click', runDiagnostics);
closeDiagnosticsBtn.addEventListener('click', () => {
  diagnosticsModal.style.display = 'none';
});

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
