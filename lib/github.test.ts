import { getLanguageStats, getTopRepos, calculateContributionStreak } from './github';
import { Repository } from './github';

describe('GitHub utility functions', () => {
  describe('getLanguageStats', () => {
    it('should return language statistics sorted by count', () => {
      const repos: Repository[] = [
        {
          id: 1,
          name: 'repo1',
          description: 'desc1',
          url: 'http://example.com/1',
          stargazers_count: 10,
          forks_count: 2,
          language: 'TypeScript',
          topics: [],
          created_at: '2020-01-01T00:00:00Z',
          updated_at: '2020-01-01T00:00:00Z',
        },
        {
          id: 2,
          name: 'repo2',
          description: 'desc2',
          url: 'http://example.com/2',
          stargazers_count: 5,
          forks_count: 1,
          language: 'TypeScript',
          topics: [],
          created_at: '2020-01-01T00:00:00Z',
          updated_at: '2020-01-01T00:00:00Z',
        },
        {
          id: 3,
          name: 'repo3',
          description: 'desc3',
          url: 'http://example.com/3',
          stargazers_count: 3,
          forks_count: 0,
          language: 'Python',
          topics: [],
          created_at: '2020-01-01T00:00:00Z',
          updated_at: '2020-01-01T00:00:00Z',
        },
      ];

      const result = getLanguageStats(repos);

      expect(result).toHaveLength(2);
      expect(result[0]).toEqual({ name: 'TypeScript', value: 2 });
      expect(result[1]).toEqual({ name: 'Python', value: 1 });
    });

    it('should handle empty repository list', () => {
      const result = getLanguageStats([]);
      expect(result).toEqual([]);
    });

    it('should handle repos without language', () => {
      const repos: Repository[] = [
        {
          id: 1,
          name: 'repo1',
          description: 'desc1',
          url: 'http://example.com/1',
          stargazers_count: 10,
          forks_count: 2,
          language: null as any,
          topics: [],
          created_at: '2020-01-01T00:00:00Z',
          updated_at: '2020-01-01T00:00:00Z',
        },
      ];

      const result = getLanguageStats(repos);
      expect(result).toEqual([]);
    });
  });

  describe('getTopRepos', () => {
    it('should return top repositories by stars', () => {
      const repos: Repository[] = [
        {
          id: 1,
          name: 'popular',
          description: 'Popular repo',
          url: 'http://example.com/1',
          stargazers_count: 100,
          forks_count: 10,
          language: 'TypeScript',
          topics: [],
          created_at: '2020-01-01T00:00:00Z',
          updated_at: '2020-01-01T00:00:00Z',
        },
        {
          id: 2,
          name: 'less-popular',
          description: 'Less popular',
          url: 'http://example.com/2',
          stargazers_count: 20,
          forks_count: 5,
          language: 'JavaScript',
          topics: [],
          created_at: '2020-01-01T00:00:00Z',
          updated_at: '2020-01-01T00:00:00Z',
        },
        {
          id: 3,
          name: 'no-stars',
          description: 'No stars',
          url: 'http://example.com/3',
          stargazers_count: 0,
          forks_count: 0,
          language: 'Python',
          topics: [],
          created_at: '2020-01-01T00:00:00Z',
          updated_at: '2020-01-01T00:00:00Z',
        },
      ];

      const result = getTopRepos(repos, 2);

      expect(result).toHaveLength(2);
      expect(result[0].name).toBe('popular');
      expect(result[1].name).toBe('less-popular');
    });

    it('should filter out repos with no stars', () => {
      const repos: Repository[] = [
        {
          id: 1,
          name: 'with-stars',
          description: 'Has stars',
          url: 'http://example.com/1',
          stargazers_count: 5,
          forks_count: 1,
          language: 'TypeScript',
          topics: [],
          created_at: '2020-01-01T00:00:00Z',
          updated_at: '2020-01-01T00:00:00Z',
        },
        {
          id: 2,
          name: 'no-stars',
          description: 'No stars',
          url: 'http://example.com/2',
          stargazers_count: 0,
          forks_count: 0,
          language: 'Python',
          topics: [],
          created_at: '2020-01-01T00:00:00Z',
          updated_at: '2020-01-01T00:00:00Z',
        },
      ];

      const result = getTopRepos(repos);

      expect(result).toHaveLength(1);
      expect(result[0].name).toBe('with-stars');
    });
  });

  describe('calculateContributionStreak', () => {
    it('should calculate contribution streak', () => {
      const today = new Date();
      const events = [
        {
          created_at: today.toISOString(),
        },
        {
          created_at: new Date(today.getTime() - 1 * 24 * 60 * 60 * 1000).toISOString(),
        },
        {
          created_at: new Date(today.getTime() - 2 * 24 * 60 * 60 * 1000).toISOString(),
        },
      ];

      const result = calculateContributionStreak(events);
      expect(result).toBeGreaterThanOrEqual(3);
    });

    it('should return 0 for empty events', () => {
      const result = calculateContributionStreak([]);
      expect(result).toBe(0);
    });
  });
});
