import { test, expect } from '@playwright/test';

const mockUser = {
  login: 'torvalds',
  name: 'Linus Torvalds',
  bio: 'Linux creator',
  avatar_url: 'https://avatars.githubusercontent.com/u/1024025?v=4',
  public_repos: 50,
  public_gists: 5,
  followers: 250000,
  following: 0,
  created_at: '2011-09-04T15:18:01Z',
  blog: 'kernel.org',
  location: 'Portland, OR',
  twitter_username: '',
};

const mockRepos = [
  {
    id: 1,
    name: 'linux',
    description: 'Linux kernel',
    html_url: 'https://github.com/torvalds/linux',
    url: 'https://github.com/torvalds/linux',
    stargazers_count: 180000,
    forks_count: 50000,
    language: 'C',
    topics: ['kernel', 'linux'],
    created_at: '2011-09-04T15:18:01Z',
    updated_at: '2026-06-28T00:00:00Z',
  },
  {
    id: 2,
    name: 'git',
    description: 'Git SCM',
    html_url: 'https://github.com/git/git',
    url: 'https://github.com/git/git',
    stargazers_count: 50000,
    forks_count: 25000,
    language: 'C',
    topics: ['vcs'],
    created_at: '2005-04-07T00:00:00Z',
    updated_at: '2026-06-28T00:00:00Z',
  },
];

const mockEvents = [
  { created_at: new Date().toISOString() },
  { created_at: new Date(Date.now() - 86400000).toISOString() },
];

test.describe('Profile Page', () => {
  test.beforeEach(async ({ page }) => {
    // Mock GitHub API responses
    await page.route('**/api.github.com/**', (route) => {
      const url = route.request().url();
      if (url.includes('/users/torvalds') && !url.includes('/repos') && !url.includes('/events')) {
        route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify(mockUser),
          headers: { 'X-RateLimit-Remaining': '100' }
        });
      } else if (url.includes('/users/torvalds/repos')) {
        route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify(mockRepos),
          headers: { 'X-RateLimit-Remaining': '100' }
        });
      } else if (url.includes('/users/torvalds/events')) {
        route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify(mockEvents),
          headers: { 'X-RateLimit-Remaining': '100' }
        });
      } else {
        route.abort();
      }
    });

    // Navigate directly to a profile
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

    // Look for stat cards by finding the exact text match without substring matches
    const statsSection = page.locator('div.grid.gap-4.mb-12').first();
    await expect(statsSection.locator('p.text-3xl.font-bold')).toHaveCount(5);
  });

  test('should display language chart', async ({ page }) => {
    await page.waitForLoadState('networkidle');

    await expect(page.locator('h2:has-text("Languages Used")')).toBeVisible();
  });

  test('should display top repositories section', async ({ page }) => {
    await page.waitForLoadState('networkidle');

    await expect(page.locator('h2:has-text("Repositories")')).toBeVisible();
  });

  test('should have working GitHub links', async ({ page }) => {
    await page.waitForLoadState('networkidle');

    const githubLink = page.locator('a[href*="github.com"]').first();
    await expect(githubLink).toHaveAttribute('target', '_blank');
  });
});
