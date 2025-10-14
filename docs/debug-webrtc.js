// WebRTC Debug Script
// Run this in browser console to debug WebRTC issues

class WebRTCDebugger {
  constructor() {
    this.logs = [];
    this.startTime = Date.now();
  }

  log(message, data = null) {
    const timestamp = Date.now() - this.startTime;
    const logEntry = { timestamp, message, data };
    this.logs.push(logEntry);
    console.log(`[${timestamp}ms] ${message}`, data || '');
  }

  // Monitor WebRTC connection states
  monitorConnection(pc, name = 'PeerConnection') {
    if (!pc) {
      this.log(`No ${name} to monitor`);
      return;
    }

    this.log(`Monitoring ${name}`, {
      connectionState: pc.connectionState,
      iceConnectionState: pc.iceConnectionState,
      signalingState: pc.signalingState,
    });

    // Connection state changes
    pc.onconnectionstatechange = () => {
      this.log(`${name} connection state changed`, {
        connectionState: pc.connectionState,
        iceConnectionState: pc.iceConnectionState,
        signalingState: pc.signalingState,
      });
    };

    // ICE connection state changes
    pc.oniceconnectionstatechange = () => {
      this.log(`${name} ICE connection state changed`, {
        iceConnectionState: pc.iceConnectionState,
        connectionState: pc.connectionState,
      });
    };

    // ICE gathering state changes
    pc.onicegatheringstatechange = () => {
      this.log(`${name} ICE gathering state changed`, {
        iceGatheringState: pc.iceGatheringState,
      });
    };

    // Signaling state changes
    pc.onsignalingstatechange = () => {
      this.log(`${name} signaling state changed`, {
        signalingState: pc.signalingState,
      });
    };

    // ICE candidates
    pc.onicecandidate = (event) => {
      if (event.candidate) {
        this.log(`${name} ICE candidate`, {
          candidate: event.candidate.candidate,
          sdpMLineIndex: event.candidate.sdpMLineIndex,
        });
      } else {
        this.log(`${name} ICE gathering complete`);
      }
    };

    // Data channel events
    pc.ondatachannel = (event) => {
      this.log(`${name} data channel received`, {
        label: event.channel.label,
        readyState: event.channel.readyState,
      });
    };

    // Track events
    pc.ontrack = (event) => {
      this.log(`${name} track received`, {
        kind: event.track.kind,
        id: event.track.id,
        readyState: event.track.readyState,
        streams: event.streams.length,
      });
    };
  }

  // Monitor video elements
  monitorVideo(video, name = 'Video') {
    if (!video) {
      this.log(`No ${name} element to monitor`);
      return;
    }

    this.log(`Monitoring ${name}`, {
      srcObject: !!video.srcObject,
      currentTime: video.currentTime,
      duration: video.duration,
      paused: video.paused,
      muted: video.muted,
      volume: video.volume,
    });

    video.addEventListener('loadstart', () => {
      this.log(`${name} loadstart`);
    });

    video.addEventListener('loadedmetadata', () => {
      this.log(`${name} loadedmetadata`, {
        videoWidth: video.videoWidth,
        videoHeight: video.videoHeight,
        duration: video.duration,
      });
    });

    video.addEventListener('loadeddata', () => {
      this.log(`${name} loadeddata`);
    });

    video.addEventListener('canplay', () => {
      this.log(`${name} canplay`);
    });

    video.addEventListener('playing', () => {
      this.log(`${name} playing`);
    });

    video.addEventListener('pause', () => {
      this.log(`${name} paused`);
    });

    video.addEventListener('ended', () => {
      this.log(`${name} ended`);
    });

    video.addEventListener('error', (e) => {
      this.log(`${name} error`, {
        error: e.error,
        message: e.message,
      });
    });
  }

  // Get connection stats
  async getStats(pc, name = 'PeerConnection') {
    if (!pc) {
      this.log(`No ${name} to get stats from`);
      return;
    }

    try {
      const stats = await pc.getStats();
      const statsData = {};

      stats.forEach((report) => {
        if (report.type === 'inbound-rtp' && report.mediaType === 'video') {
          statsData.inboundVideo = {
            bytesReceived: report.bytesReceived,
            packetsReceived: report.packetsReceived,
            packetsLost: report.packetsLost,
            framesDecoded: report.framesDecoded,
            framesDropped: report.framesDropped,
          };
        }
        if (report.type === 'outbound-rtp' && report.mediaType === 'video') {
          statsData.outboundVideo = {
            bytesSent: report.bytesSent,
            packetsSent: report.packetsSent,
            framesEncoded: report.framesEncoded,
          };
        }
        if (report.type === 'candidate-pair' && report.state === 'succeeded') {
          statsData.candidatePair = {
            currentRoundTripTime: report.currentRoundTripTime,
            availableOutgoingBitrate: report.availableOutgoingBitrate,
            availableIncomingBitrate: report.availableIncomingBitrate,
          };
        }
      });

      this.log(`${name} stats`, statsData);
      return statsData;
    } catch (error) {
      this.log(`Error getting ${name} stats`, error);
    }
  }

  // Export logs
  exportLogs() {
    const dataStr = JSON.stringify(this.logs, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `webrtc-debug-${Date.now()}.json`;
    link.click();
    URL.revokeObjectURL(url);
  }

  // Clear logs
  clearLogs() {
    this.logs = [];
    this.startTime = Date.now();
    console.log('Debug logs cleared');
  }
}

// Global debugger instance
window.webrtcDebugger = new WebRTCDebugger();

// Auto-monitor existing connections
if (window.pc) {
  window.webrtcDebugger.monitorConnection(window.pc, 'Main PC');
}

if (window.localVideo) {
  window.webrtcDebugger.monitorVideo(window.localVideo, 'Local Video');
}

if (window.remoteVideo) {
  window.webrtcDebugger.monitorVideo(window.remoteVideo, 'Remote Video');
}

console.log('WebRTC Debugger loaded! Use window.webrtcDebugger to interact.');
console.log('Commands:');
console.log('- webrtcDebugger.monitorConnection(pc, "name")');
console.log('- webrtcDebugger.monitorVideo(video, "name")');
console.log('- webrtcDebugger.getStats(pc, "name")');
console.log('- webrtcDebugger.exportLogs()');
console.log('- webrtcDebugger.clearLogs()');
