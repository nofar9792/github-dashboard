import { test, expect } from '@playwright/test';

test.describe('Home Page', () => {
  test('should load home page with search form', async ({ page }) => {
    await page.goto('/');

    await expect(page.locator('h1')).toContainText('GitHub Portfolio');
    await expect(page.locator('input[placeholder*="GitHub username"]')).toBeVisible();
    await expect(page.locator('button:has-text("Search")')).toBeVisible();
  });

  test('should navigate to profile page when searching', async ({ page }) => {
    await page.goto('/');

    const exampleButton = page.locator('button:has-text("@torvalds")');

    await exampleButton.click();

    await page.waitForURL('**/profile/torvalds');
    expect(page.url()).toContain('/profile/torvalds');
  });

  test('should display example users', async ({ page }) => {
    await page.goto('/');

    const exampleButtons = page.locator('button:has-text("@torvalds")');
    await expect(exampleButtons).toBeVisible();
  });

  test('should show features section', async ({ page }) => {
    await page.goto('/');

    await expect(page.locator('h3:has-text("Statistics")')).toBeVisible();
    await expect(page.locator('h3:has-text("Contributions")')).toBeVisible();
    await expect(page.locator('h3:has-text("Top Projects")')).toBeVisible();
  });
});
