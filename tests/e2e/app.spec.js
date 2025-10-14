import { test, expect } from '@playwright/test';

test.describe('Stupid Simple Screen Share App', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('should load the main page with synthwave theme', async ({ page }) => {
    // Check that the main title is visible
    await expect(page.getByText('STUPID-SIMPLE SCREEN SHARE')).toBeVisible();

    // Check that all main buttons are present
    await expect(page.getByRole('button', { name: /start sharing your screen to create a new room/i })).toBeVisible();
    await expect(page.getByRole('button', { name: /stop screen sharing and return to home/i })).toBeVisible();
    await expect(page.getByRole('button', { name: /start recording the screen sharing session/i })).toBeVisible();
    await expect(
      page.getByRole('button', { name: /toggle diagnostics panel to view connection information/i })
    ).toBeVisible();
    await expect(page.getByRole('button', { name: /join a room as a viewer to watch screen sharing/i })).toBeVisible();

    // Check that the room ID input is present
    await expect(page.getByLabelText(/enter room id to join a screen sharing session/i)).toBeVisible();

    // Check that preview sections are present
    await expect(page.getByText('Local preview')).toBeVisible();
    await expect(page.getByText('Remote preview')).toBeVisible();
    await expect(page.getByText('No remote connection')).toBeVisible();

    // Check status indicator
    await expect(page.getByText('Status: idle')).toBeVisible();
  });

  test('should handle room ID input', async ({ page }) => {
    const input = page.getByLabelText(/enter room id to join a screen sharing session/i);

    await input.fill('test-room-123');
    await expect(input).toHaveValue('test-room-123');
  });

  test('should show alert when joining room without room ID', async ({ page }) => {
    // Mock window.alert
    page.on('dialog', async (dialog) => {
      expect(dialog.message()).toBe('Please enter a room ID');
      await dialog.accept();
    });

    const button = page.getByRole('button', { name: /join a room as a viewer to watch screen sharing/i });
    await button.click();
  });

  test('should handle start recording button click', async ({ page }) => {
    // Mock window.alert
    page.on('dialog', async (dialog) => {
      expect(dialog.message()).toBe('Recording functionality will be implemented soon!');
      await dialog.accept();
    });

    const button = page.getByRole('button', { name: /start recording the screen sharing session/i });
    await button.click();
  });

  test('should have proper accessibility attributes', async ({ page }) => {
    // Check ARIA labels
    await expect(page.getByLabelText(/start sharing your screen to create a new room/i)).toBeVisible();
    await expect(page.getByLabelText(/stop screen sharing and return to home/i)).toBeVisible();
    await expect(page.getByLabelText(/start recording the screen sharing session/i)).toBeVisible();
    await expect(page.getByLabelText(/toggle diagnostics panel to view connection information/i)).toBeVisible();
    await expect(page.getByLabelText(/join a room as a viewer to watch screen sharing/i)).toBeVisible();
    await expect(page.getByLabelText(/enter room id to join a screen sharing session/i)).toBeVisible();
  });

  test('should be responsive on mobile', async ({ page }) => {
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });

    // Check that the main title is still visible
    await expect(page.getByText('STUPID-SIMPLE SCREEN SHARE')).toBeVisible();

    // Check that buttons are still accessible
    await expect(page.getByRole('button', { name: /start sharing your screen to create a new room/i })).toBeVisible();
    await expect(page.getByRole('button', { name: /join a room as a viewer to watch screen sharing/i })).toBeVisible();

    // Check that the room ID input is still visible
    await expect(page.getByLabelText(/enter room id to join a screen sharing session/i)).toBeVisible();
  });

  test('should have proper focus states', async ({ page }) => {
    const startSharingButton = page.getByRole('button', { name: /start sharing your screen to create a new room/i });
    const stopSharingButton = page.getByRole('button', { name: /stop screen sharing and return to home/i });
    const joinRoomButton = page.getByRole('button', { name: /join a room as a viewer to watch screen sharing/i });

    // Test focus states
    await startSharingButton.focus();
    await expect(startSharingButton).toBeFocused();

    await stopSharingButton.focus();
    await expect(stopSharingButton).toBeFocused();

    await joinRoomButton.focus();
    await expect(joinRoomButton).toBeFocused();
  });

  test('should handle keyboard navigation', async ({ page }) => {
    // Test tab navigation
    await page.keyboard.press('Tab');
    await expect(page.getByRole('button', { name: /start sharing your screen to create a new room/i })).toBeFocused();

    await page.keyboard.press('Tab');
    await expect(page.getByRole('button', { name: /stop screen sharing and return to home/i })).toBeFocused();

    await page.keyboard.press('Tab');
    await expect(page.getByRole('button', { name: /start recording the screen sharing session/i })).toBeFocused();
  });
});
