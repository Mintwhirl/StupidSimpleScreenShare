import { test, expect } from '@playwright/test';

test.describe('Host-Viewer basic flow (mocked)', () => {
  test('host creates room, viewer joins with room id', async ({ browser }) => {
    // Host context
    const host = await browser.newContext();
    const hostPage = await host.newPage();

    await hostPage.route('**/api/config', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          success: true,
          config: {
            apiBase: '/api',
            features: { chat: true, diagnostics: true, viewerCount: true },
            rateLimits: { chat: 10, api: 100 },
          },
          timestamp: new Date().toISOString(),
        }),
      });
    });

    await hostPage.route('**/api/create-room', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ success: true, roomId: 'e2e-123', message: 'ok' }),
      });
    });

    await hostPage.goto('/');
    await hostPage.getByRole('button', { name: /start sharing your screen to create a new room/i }).click();

    // Host view should render and show room information
    await expect(hostPage.getByText('Room Information')).toBeVisible();
    await expect(hostPage.locator('input[value="e2e-123"]').first()).toBeVisible();

    // Viewer context
    const viewer = await browser.newContext();
    const viewerPage = await viewer.newPage();

    await viewerPage.route('**/api/config', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          success: true,
          config: {
            apiBase: '/api',
            features: { chat: true, diagnostics: true, viewerCount: true },
            rateLimits: { chat: 10, api: 100 },
          },
          timestamp: new Date().toISOString(),
        }),
      });
    });

    await viewerPage.goto('/');
    const input = viewerPage.getByLabel(/enter room id to join a screen sharing session/i);
    await input.fill('e2e-123');
    await viewerPage.getByRole('button', { name: /join a room as a viewer to watch screen sharing/i }).click();

    // Viewer view should render in a ready state (no real media is required for this step)
    await expect(viewerPage.getByText('Ready to View')).toBeVisible();

    await host.close();
    await viewer.close();
  });
});
