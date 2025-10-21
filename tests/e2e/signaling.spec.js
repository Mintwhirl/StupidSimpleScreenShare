import { test, expect } from '@playwright/test';

async function setupSignalingRoutes(context, state) {
  const respond = (route, status, data) =>
    route.fulfill({ status, contentType: 'application/json', body: JSON.stringify(data) });

  await context.route('**/api/register-sender**', async (route, request) => {
    if (request.method() !== 'POST') {
      return respond(route, 405, { error: 'Method not allowed' });
    }
    const body = await request.postDataJSON();
    const senderId = body?.senderId ?? 'anonymous';
    const secret = `${senderId}-secret`;
    state.secrets.set(senderId, secret);
    return respond(route, 200, { ok: true, secret });
  });

  await context.route('**/api/offer**', async (route, request) => {
    if (request.method() === 'POST') {
      const body = await request.postDataJSON();
      state.offer = body?.desc ?? null;
      return respond(route, 200, { ok: true });
    }

    if (!state.offer) {
      return respond(route, 404, { error: 'No offer available yet' });
    }

    const desc = state.offer;
    state.offer = null; // emulate single-consumer semantics
    return respond(route, 200, { desc });
  });

  await context.route('**/api/answer**', async (route, request) => {
    if (request.method() === 'POST') {
      const body = await request.postDataJSON();
      state.answer = body?.desc ?? null;
      return respond(route, 200, { ok: true });
    }

    if (!state.answer) {
      return respond(route, 404, { error: 'No answer available yet' });
    }

    const desc = state.answer;
    state.answer = null;
    return respond(route, 200, { desc });
  });

  await context.route('**/api/candidate**', async (route, request) => {
    if (request.method() === 'POST') {
      const body = await request.postDataJSON();
      const role = body?.role ?? 'host';
      const viewerId = body?.viewerId ?? 'default';
      const candidate = body?.candidate ?? null;

      if (candidate) {
        if (role === 'host') {
          state.hostCandidates.push(candidate);
        } else {
          const key = viewerId || 'default';
          const list = state.viewerCandidates.get(key) ?? [];
          list.push(candidate);
          state.viewerCandidates.set(key, list);
        }
      }

      return respond(route, 200, { ok: true });
    }

    const url = new URL(request.url());
    const role = url.searchParams.get('role') ?? 'viewer';
    const viewerId = url.searchParams.get('viewerId') ?? 'default';

    let candidates = [];
    if (role === 'viewer') {
      candidates = state.hostCandidates.splice(0);
    } else {
      const key = viewerId || 'default';
      candidates = state.viewerCandidates.get(key) ?? [];
      state.viewerCandidates.delete(key);
    }

    return respond(route, 200, { candidates });
  });
}

test.describe('browser signaling handshake', () => {
  test.skip(({ browserName }) => browserName !== 'chromium', 'Handshake mock is validated on Chromium only.');

  test('host and viewer exchange media tracks', async ({ browser }, testInfo) => {
    const baseURL = testInfo.project.use?.baseURL ?? 'http://localhost:3000';

    const signalingState = {
      offer: null,
      answer: null,
      hostCandidates: [],
      viewerCandidates: new Map(),
      secrets: new Map(),
    };

    const hostContext = await browser.newContext();
    await hostContext.addInitScript(() => {
      window.navigator.mediaDevices = window.navigator.mediaDevices || {};
      window.navigator.mediaDevices.getDisplayMedia = async () => {
        if (!window.__playwrightDisplayStream) {
          const canvas = document.createElement('canvas');
          canvas.width = 640;
          canvas.height = 360;
          const ctx = canvas.getContext('2d');
          let frame = 0;
          const draw = () => {
            frame += 1;
            ctx.fillStyle = frame % 2 === 0 ? '#ff00ff' : '#00c2ff';
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            requestAnimationFrame(draw);
          };
          draw();
          window.__playwrightDisplayStream = canvas.captureStream(15);
        }
        return window.__playwrightDisplayStream;
      };
    });
    await setupSignalingRoutes(hostContext, signalingState);

    const viewerContext = await browser.newContext();
    await setupSignalingRoutes(viewerContext, signalingState);

    const hostLogs = [];
    const viewerLogs = [];

    const hostPage = await hostContext.newPage();
    hostPage.on('console', (msg) => hostLogs.push(`[host:${msg.type()}] ${msg.text()}`));

    const viewerPage = await viewerContext.newPage();
    viewerPage.on('console', (msg) => viewerLogs.push(`[viewer:${msg.type()}] ${msg.text()}`));

    try {
      await hostPage.goto(baseURL);

      await hostPage.getByRole('button', { name: /Start sharing my screen/i }).click();
      await hostPage.getByRole('button', { name: /^Start Sharing$/i }).click();

      const roomIdInput = hostPage.getByLabel('Room ID');
      const roomId = await roomIdInput.inputValue();
      expect(roomId).not.toBe('');

      await viewerPage.goto(baseURL);
      await viewerPage.getByLabel(/Enter room ID to join a screen sharing session/i).fill(roomId);
      await viewerPage.getByRole('button', { name: /Open room link \(viewer\)/i }).click();

      await viewerPage.getByPlaceholder(/Enter your name/).fill('PlaywrightViewer');
      await viewerPage.getByRole('button', { name: /Connect to Host/i }).click();

      await hostPage.getByText(/Status: Connected/i).waitFor({ timeout: 15000 });
      await viewerPage.getByText(/Connected to Host/i).waitFor({ timeout: 15000 });

      const trackCount = await viewerPage.waitForFunction(() => {
        const video = document.querySelector('video');
        if (!video || !video.srcObject) return 0;
        return video.srcObject.getVideoTracks().length;
      });

      expect(await trackCount).toBeGreaterThan(0);
    } finally {
      const combinedLogs = [...hostLogs, ...viewerLogs];
      if (combinedLogs.length > 0) {
        await testInfo.attach('handshake-logs', {
          body: combinedLogs.join('\n'),
          contentType: 'text/plain',
        });
      }

      await hostContext.close();
      await viewerContext.close();
    }
  });
});
