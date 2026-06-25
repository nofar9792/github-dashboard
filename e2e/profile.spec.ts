import { test, expect } from '@playwright/test';

test.describe('Profile Page', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate directly to a profile with a known public user
    await page.goto('/profile/torvalds');
  });

  test('should load profile page and display user info', async ({ page }) => {
    // Wait for the dashboard to load
    await page.waitForLoadState('networkidle');

    // Check if avatar is loaded
    const avatar = page.locator('img[alt*="torvalds"]');
    await expect(avatar).toBeVisible();
  });

  test('should display stats cards', async ({ page }) => {
    await page.waitForLoadState('networkidle');

    // Look for stat cards by their text content
    await expect(page.locator('text=Repositories')).toBeVisible();
    await expect(page.locator('text=Followers')).toBeVisible();
  });

  test('should display language chart', async ({ page }) => {
    await page.waitForLoadState('networkidle');

    await expect(page.locator('text=Languages Used')).toBeVisible();
  });

  test('should display top repositories section', async ({ page }) => {
    await page.waitForLoadState('networkidle');

    await expect(page.locator('text=Top Repositories')).toBeVisible();
  });

  test('should have working GitHub links', async ({ page }) => {
    await page.waitForLoadState('networkidle');

    const githubLink = page.locator('a[href*="github.com"]').first();
    await expect(githubLink).toHaveAttribute('target', '_blank');
  });
});
