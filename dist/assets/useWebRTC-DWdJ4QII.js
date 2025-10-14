import { r, j as A } from './main-DEmRS2_I.js';
const M = r.forwardRef(({ className: s, ...c }, l) => {
  const I = r.useRef(null),
    v = l || I;
  return (
    r.useEffect(() => {
      const n = v.current;
      if (!n) return;
      const y = () => {
          console.log('Video metadata loaded:', {
            duration: n.duration,
            videoWidth: n.videoWidth,
            videoHeight: n.videoHeight,
          });
        },
        g = () => {
          console.log('Video data loaded');
        },
        u = () => {
          console.log('Video can start playing');
        },
        E = () => {
          console.log('Video started playing');
        },
        S = () => {
          console.log('Video paused');
        },
        i = () => {
          console.log('Video ended');
        },
        m = (L) => {
          console.error('Video error:', L);
        },
        R = () => {
          console.log('Video waiting for data');
        },
        w = () => {
          console.log('Video stalled');
        };
      return (
        n.addEventListener('loadedmetadata', y),
        n.addEventListener('loadeddata', g),
        n.addEventListener('canplay', u),
        n.addEventListener('play', E),
        n.addEventListener('pause', S),
        n.addEventListener('ended', i),
        n.addEventListener('error', m),
        n.addEventListener('waiting', R),
        n.addEventListener('stalled', w),
        () => {
          (n.removeEventListener('loadedmetadata', y),
            n.removeEventListener('loadeddata', g),
            n.removeEventListener('canplay', u),
            n.removeEventListener('play', E),
            n.removeEventListener('pause', S),
            n.removeEventListener('ended', i),
            n.removeEventListener('error', m),
            n.removeEventListener('waiting', R),
            n.removeEventListener('stalled', w));
        }
      );
    }, [v]),
    A.jsx('video', { ref: v, className: s, ...c })
  );
});
M.displayName = 'VideoPlayer';
var _ = {};
const W = [
    { urls: 'stun:stun.l.google.com:19302' },
    { urls: 'stun:stun1.l.google.com:19302' },
    { urls: 'stun:stun2.l.google.com:19302' },
    { urls: 'stun:stun3.l.google.com:19302' },
    { urls: 'stun:stun4.l.google.com:19302' },
  ],
  D = [
    {
      urls: 'turn:your-turn-server.com:3478',
      username: _.TURN_USERNAME || 'your-username',
      credential: _.TURN_PASSWORD || 'your-password',
    },
  ];
function H(s = !1) {
  const c = [...W];
  return (s && D.length > 0 && c.push(...D), c);
}
function q(s, c, l, I = null) {
  const [v, n] = r.useState('disconnected'),
    [y, g] = r.useState(null),
    [u, E] = r.useState(null),
    [S, i] = r.useState(null),
    [m, R] = r.useState({}),
    [w, L] = r.useState([]),
    f = r.useRef(null),
    F = r.useRef(null),
    o = r.useRef(null),
    h = r.useRef(null);
  r.useEffect(() => {
    const e = H(l?.useTurn || !1);
    L(e);
  }, [l]);
  const T = r.useCallback(
      async (e) => {
        if (!(!s || !c))
          try {
            const t = await fetch('/api/candidate', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json', ...(l?.authSecret && { 'x-auth-secret': l.authSecret }) },
              body: JSON.stringify({
                roomId: s,
                role: c,
                candidate: { candidate: e.candidate, sdpMid: e.sdpMid, sdpMLineIndex: e.sdpMLineIndex },
              }),
            });
            if (!t.ok) throw new Error(`Failed to send ICE candidate: ${t.status}`);
          } catch (t) {
            (console.error('Error sending ICE candidate:', t), i(`Failed to send ICE candidate: ${t.message}`));
          }
      },
      [s, c, l]
    ),
    C = r.useCallback(() => {
      const e = new RTCPeerConnection({ iceServers: w });
      return (
        (e.onicecandidate = (t) => {
          t.candidate && T(t.candidate);
        }),
        (e.onconnectionstatechange = () => {
          (console.log('Connection state changed:', e.connectionState), n(e.connectionState));
        }),
        (e.oniceconnectionstatechange = () => {
          console.log('ICE connection state changed:', e.iceConnectionState);
        }),
        (e.ontrack = (t) => {
          (console.log('Received remote stream:', t.streams[0]), g(t.streams[0]));
        }),
        (e.ondatachannel = (t) => {
          const a = t.channel;
          ((F.current = a),
            (a.onopen = () => {
              console.log('Data channel opened');
            }),
            (a.onmessage = (d) => {
              console.log('Received data channel message:', d.data);
            }));
        }),
        e
      );
    }, [w, T]),
    b = r.useCallback(
      async (e) => {
        if (s)
          try {
            const t = await fetch('/api/offer', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json', ...(l?.authSecret && { 'x-auth-secret': l.authSecret }) },
              body: JSON.stringify({ roomId: s, desc: e }),
            });
            if (!t.ok) throw new Error(`Failed to send offer: ${t.status}`);
          } catch (t) {
            (console.error('Error sending offer:', t), i(`Failed to send offer: ${t.message}`));
          }
      },
      [s, l]
    ),
    P = r.useCallback(
      async (e) => {
        if (s)
          try {
            const t = await fetch('/api/answer', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json', ...(l?.authSecret && { 'x-auth-secret': l.authSecret }) },
              body: JSON.stringify({ roomId: s, desc: e }),
            });
            if (!t.ok) throw new Error(`Failed to send answer: ${t.status}`);
          } catch (t) {
            (console.error('Error sending answer:', t), i(`Failed to send answer: ${t.message}`));
          }
      },
      [s, l]
    ),
    V = r.useCallback(async () => {
      o.current && clearInterval(o.current);
      let e = 0,
        t = 1e3;
      o.current = setInterval(async () => {
        try {
          const a = await fetch(`/api/offer?roomId=${s}`);
          if (a.ok) {
            const d = await a.json();
            if (d.desc) {
              (clearInterval(o.current), (o.current = null));
              const p = f.current;
              if (p) {
                await p.setRemoteDescription(d.desc);
                const O = await p.createAnswer();
                (await p.setLocalDescription(O), await P(O));
              }
            }
          } else
            a.status === 404
              ? (e++, e > 10 && (clearInterval(o.current), (t = 5e3), (o.current = setInterval(arguments.callee, t))))
              : console.error('Unexpected error polling for offers:', a.status);
        } catch (a) {
          console.error('Error polling for offers:', a);
        }
      }, t);
    }, [s, P]),
    $ = r.useCallback(async () => {
      o.current && clearInterval(o.current);
      let e = 0,
        t = 1e3;
      o.current = setInterval(async () => {
        try {
          const a = await fetch(`/api/answer?roomId=${s}`);
          if (a.ok) {
            const d = await a.json();
            if (d.desc) {
              (clearInterval(o.current), (o.current = null));
              const p = f.current;
              p && (await p.setRemoteDescription(d.desc));
            }
          } else
            a.status === 404
              ? (e++, e > 10 && (clearInterval(o.current), (t = 5e3), (o.current = setInterval(arguments.callee, t))))
              : console.error('Unexpected error polling for answers:', a.status);
        } catch (a) {
          console.error('Error polling for answers:', a);
        }
      }, t);
    }, [s]),
    x = r.useCallback(async () => {
      (h.current && clearInterval(h.current),
        (h.current = setInterval(async () => {
          try {
            const e = await fetch(`/api/candidate?roomId=${s}&role=${c}`);
            if (e.ok) {
              const t = await e.json();
              if (t.candidates && t.candidates.length > 0) {
                const a = f.current;
                if (a) for (const d of t.candidates) await a.addIceCandidate(d);
              }
            }
          } catch (e) {
            console.error('Error polling for ICE candidates:', e);
          }
        }, 1e3)));
    }, [s, c]),
    j = r.useCallback(async () => {
      if (c !== 'host') throw new Error('Only hosts can start screen sharing');
      try {
        (i(null), n('connecting'));
        const e = await navigator.mediaDevices.getDisplayMedia({ video: !0, audio: !0 });
        E(e);
        const t = C();
        ((f.current = t),
          e.getTracks().forEach((d) => {
            t.addTrack(d, e);
          }));
        const a = await t.createOffer({ offerToReceiveAudio: !0, offerToReceiveVideo: !0 });
        return (await t.setLocalDescription(a), await b(a), $(), e);
      } catch (e) {
        throw (
          console.error('Error starting screen share:', e),
          i(`Failed to start screen sharing: ${e.message}`),
          n('disconnected'),
          e
        );
      }
    }, [c, C, b, $]),
    N = r.useCallback(async () => {
      if (c !== 'viewer') throw new Error('Only viewers can connect to host');
      try {
        (i(null), n('connecting'));
        const e = C();
        ((f.current = e), V(), x());
      } catch (e) {
        throw (
          console.error('Error connecting to host:', e),
          i(`Failed to connect to host: ${e.message}`),
          n('disconnected'),
          e
        );
      }
    }, [c, C, x, V]),
    k = r.useCallback(async () => {
      try {
        (u && (u.getTracks().forEach((e) => e.stop()), E(null)),
          f.current && (f.current.close(), (f.current = null)),
          o.current && (clearInterval(o.current), (o.current = null)),
          h.current && (clearInterval(h.current), (h.current = null)),
          n('disconnected'),
          g(null));
      } catch (e) {
        (console.error('Error stopping screen share:', e), i(`Failed to stop screen sharing: ${e.message}`));
      }
    }, [u]),
    U = r.useCallback(async () => {
      await k();
    }, [k]);
  return (
    r.useEffect(
      () => () => {
        (o.current && clearInterval(o.current),
          h.current && clearInterval(h.current),
          f.current && f.current.close(),
          u && u.getTracks().forEach((e) => e.stop()));
      },
      [u]
    ),
    {
      connectionState: v,
      remoteStream: y,
      localStream: u,
      error: S,
      peerConnections: m,
      startScreenShare: j,
      stopScreenShare: k,
      connectToHost: N,
      disconnect: U,
    }
  );
}
export { M as V, q as u };
//# sourceMappingURL=useWebRTC-DWdJ4QII.js.map
