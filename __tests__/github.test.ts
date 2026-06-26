import {
  getLanguageStats,
  getLanguagePercentage,
  getTopRepos,
  calculateContributionStreak,
  getContributionHeatmap,
  getRepositoryTimeline,
  categorizeRepositories,
  filterRepositories,
  sortRepositories,
} from "@/lib/github";
import { Repository } from "@/lib/github";

const mockRepos: Repository[] = [
  {
    id: 1,
    name: "TypeScript Project",
    description: "A TypeScript project",
    url: "https://github.com/user/typescript-project",
    stargazers_count: 100,
    forks_count: 10,
    language: "TypeScript",
    topics: ["web", "typescript"],
    created_at: "2020-01-15T10:00:00Z",
    updated_at: "2024-01-15T10:00:00Z",
  },
  {
    id: 2,
    name: "Python Script",
    description: "A Python utility script",
    url: "https://github.com/user/python-script",
    stargazers_count: 50,
    forks_count: 5,
    language: "Python",
    topics: ["python", "utilities"],
    created_at: "2021-03-20T14:30:00Z",
    updated_at: "2024-03-15T10:00:00Z",
  },
  {
    id: 3,
    name: "JavaScript App",
    description: "A JavaScript application",
    url: "https://github.com/user/javascript-app",
    stargazers_count: 25,
    forks_count: 3,
    language: "JavaScript",
    topics: ["javascript", "app"],
    created_at: "2022-06-10T08:15:00Z",
    updated_at: "2024-06-10T10:00:00Z",
  },
  {
    id: 4,
    name: "Java Library",
    description: "A Java library with no stars",
    url: "https://github.com/user/java-library",
    stargazers_count: 0,
    forks_count: 0,
    language: "Java",
    topics: ["java"],
    created_at: "2023-01-01T00:00:00Z",
    updated_at: "2024-01-01T00:00:00Z",
  },
  {
    id: 5,
    name: "TypeScript Utils",
    description: "TypeScript utility functions",
    url: "https://github.com/user/typescript-utils",
    stargazers_count: 75,
    forks_count: 8,
    language: "TypeScript",
    topics: ["typescript", "utils"],
    created_at: "2023-06-01T12:00:00Z",
    updated_at: "2024-06-01T10:00:00Z",
  },
];

const getMockEvents = () => {
  const today = new Date();
  return [
    { created_at: new Date(today.getTime() - 0 * 24 * 60 * 60 * 1000).toISOString() },
    { created_at: new Date(today.getTime() - 1 * 24 * 60 * 60 * 1000).toISOString() },
    { created_at: new Date(today.getTime() - 2 * 24 * 60 * 60 * 1000).toISOString() },
    { created_at: new Date(today.getTime() - 3 * 24 * 60 * 60 * 1000).toISOString() },
    { created_at: new Date(today.getTime() - 4 * 24 * 60 * 60 * 1000).toISOString() },
    { created_at: new Date(today.getTime() - 6 * 24 * 60 * 60 * 1000).toISOString() }, // Gap on day 5
  ];
};

describe("getLanguageStats", () => {
  it("should return language counts sorted by frequency", () => {
    const stats = getLanguageStats(mockRepos);

    expect(stats).toHaveLength(4);
    expect(stats[0]).toEqual({ name: "TypeScript", value: 2 });
    expect(stats[1]).toEqual({ name: "Python", value: 1 });
  });

  it("should limit to 8 languages", () => {
    const manyLanguageRepos = Array.from({ length: 10 }, (_, i) => ({
      ...mockRepos[0],
      id: i,
      language: `Language${i}`,
    }));

    const stats = getLanguageStats(manyLanguageRepos);
    expect(stats.length).toBeLessThanOrEqual(8);
  });

  it("should handle repos without language", () => {
    const reposWithoutLanguage = [
      { ...mockRepos[0], language: "" },
      { ...mockRepos[1], language: "" },
    ];

    const stats = getLanguageStats(reposWithoutLanguage);
    expect(stats).toHaveLength(0);
  });

  it("should handle empty repo list", () => {
    const stats = getLanguageStats([]);
    expect(stats).toHaveLength(0);
  });
});

describe("getLanguagePercentage", () => {
  it("should calculate language percentages correctly", () => {
    const percentages = getLanguagePercentage(mockRepos);

    expect(percentages.length).toBeGreaterThan(0);
    const totalPercentage = percentages.reduce((sum, lang) => sum + lang.percentage!, 0);
    expect(totalPercentage).toBeGreaterThan(0);
    expect(percentages[0].percentage).toBeGreaterThanOrEqual(percentages[1]?.percentage || 0);
  });

  it("should include percentage field", () => {
    const percentages = getLanguagePercentage(mockRepos);

    percentages.forEach((lang) => {
      expect(lang.percentage).toBeDefined();
      expect(typeof lang.percentage).toBe("number");
    });
  });

  it("should limit to 8 languages", () => {
    const percentages = getLanguagePercentage(mockRepos);
    expect(percentages.length).toBeLessThanOrEqual(8);
  });
});

describe("getTopRepos", () => {
  it("should return repos sorted by stars", () => {
    const topRepos = getTopRepos(mockRepos, 3);

    expect(topRepos).toHaveLength(3);
    expect(topRepos[0].name).toBe("TypeScript Project");
    expect(topRepos[1].name).toBe("TypeScript Utils");
    expect(topRepos[2].name).toBe("Python Script");
  });

  it("should exclude repos with zero stars", () => {
    const topRepos = getTopRepos(mockRepos);

    const hasZeroStars = topRepos.some((repo) => repo.stargazers_count === 0);
    expect(hasZeroStars).toBe(false);
  });

  it("should respect limit parameter", () => {
    const topRepos = getTopRepos(mockRepos, 2);
    expect(topRepos).toHaveLength(2);
  });

  it("should handle default limit of 6", () => {
    const topRepos = getTopRepos(mockRepos);
    expect(topRepos.length).toBeLessThanOrEqual(6);
  });
});

describe("calculateContributionStreak", () => {
  it("should calculate correct streak from events", () => {
    const streak = calculateContributionStreak(getMockEvents());

    expect(streak).toBeGreaterThan(0);
    expect(streak).toBeLessThanOrEqual(5);
  });

  it("should return 0 for empty events", () => {
    const streak = calculateContributionStreak([]);
    expect(streak).toBe(0);
  });

  it("should return 0 for null events", () => {
    const streak = calculateContributionStreak(null);
    expect(streak).toBe(0);
  });

  it("should break streak on gap", () => {
    const today = new Date();
    const eventsWithGap = [
      { created_at: new Date(today.getTime() - 0 * 24 * 60 * 60 * 1000).toISOString() },
      { created_at: new Date(today.getTime() - 1 * 24 * 60 * 60 * 1000).toISOString() },
      // Gap on day 2 and 3
      { created_at: new Date(today.getTime() - 4 * 24 * 60 * 60 * 1000).toISOString() },
    ];

    const streak = calculateContributionStreak(eventsWithGap);
    expect(streak).toBe(2); // Only today and yesterday
  });
});

describe("getContributionHeatmap", () => {
  it("should return contribution data for last 365 days", () => {
    const heatmap = getContributionHeatmap(getMockEvents());

    expect(heatmap.length).toBeLessThanOrEqual(365);
    expect(heatmap[0]).toHaveProperty("date");
    expect(heatmap[0]).toHaveProperty("count");
  });

  it("should count multiple events per day", () => {
    const today = new Date().toISOString().split("T")[0];
    const multiEventDay = [
      { created_at: `${today}T10:00:00Z` },
      { created_at: `${today}T14:00:00Z` },
      { created_at: `${today}T18:00:00Z` },
    ];

    const heatmap = getContributionHeatmap(multiEventDay);
    const latestDay = heatmap[heatmap.length - 1];

    expect(latestDay.count).toBe(3);
  });

  it("should handle empty events", () => {
    const heatmap = getContributionHeatmap([]);

    expect(heatmap.length).toBeGreaterThan(0);
    expect(heatmap.every((day) => day.count === 0)).toBe(true);
  });
});

describe("getRepositoryTimeline", () => {
  it("should return timeline sorted by date", () => {
    const timeline = getRepositoryTimeline(mockRepos);

    for (let i = 1; i < timeline.length; i++) {
      const prevDate = new Date(timeline[i - 1].date).getTime();
      const currDate = new Date(timeline[i].date).getTime();
      expect(prevDate).toBeLessThanOrEqual(currDate);
    }
  });

  it("should count repos created on same day", () => {
    const sameDay = [
      { ...mockRepos[0], created_at: "2024-01-01T10:00:00Z" },
      { ...mockRepos[1], created_at: "2024-01-01T14:00:00Z" },
    ];

    const timeline = getRepositoryTimeline(sameDay);
    expect(timeline).toHaveLength(1);
    expect(timeline[0].reposCreated).toBe(2);
  });

  it("should limit to last 30 days", () => {
    const timeline = getRepositoryTimeline(mockRepos);
    expect(timeline.length).toBeLessThanOrEqual(30);
  });
});

describe("categorizeRepositories", () => {
  it("should create three categories", () => {
    const categories = categorizeRepositories(mockRepos);

    expect(categories).toHaveLength(3);
    expect(categories.map((c) => c.name)).toContain("All Repositories");
    expect(categories.map((c) => c.name)).toContain("Personal Projects");
    expect(categories.map((c) => c.name)).toContain("Top Starred");
  });

  it("should include all repos in All Repositories", () => {
    const categories = categorizeRepositories(mockRepos);
    const allCategory = categories.find((c) => c.name === "All Repositories");

    expect(allCategory?.repos).toHaveLength(mockRepos.length);
  });

  it("should exclude zero-star repos from Top Starred", () => {
    const categories = categorizeRepositories(mockRepos);
    const topStarred = categories.find((c) => c.name === "Top Starred");

    const hasZeroStars = topStarred?.repos.some((r) => r.stargazers_count === 0);
    expect(hasZeroStars).toBe(false);
  });

  it("should categorize based on URL fork detection", () => {
    const categories = categorizeRepositories(mockRepos);
    const personal = categories.find((c) => c.name === "Personal Projects");

    expect(personal?.repos.length).toBeGreaterThan(0);
  });
});

describe("filterRepositories", () => {
  it("should filter by search query in name", () => {
    const filtered = filterRepositories(mockRepos, "TypeScript");

    expect(filtered).toHaveLength(2);
    expect(filtered.every((r) => r.name.includes("TypeScript"))).toBe(true);
  });

  it("should filter by search query in description", () => {
    const filtered = filterRepositories(mockRepos, "utility");

    expect(filtered.length).toBeGreaterThan(0);
    expect(
      filtered.every(
        (r) =>
          r.name.toLowerCase().includes("utility") ||
          r.description?.toLowerCase().includes("utility")
      )
    ).toBe(true);
  });

  it("should filter by language", () => {
    const filtered = filterRepositories(mockRepos, "", "Python");

    expect(filtered.every((r) => r.language === "Python")).toBe(true);
  });

  it("should filter by minimum stars", () => {
    const filtered = filterRepositories(mockRepos, "", undefined, 50);

    expect(filtered.every((r) => r.stargazers_count >= 50)).toBe(true);
  });

  it("should combine multiple filters", () => {
    const filtered = filterRepositories(mockRepos, "Script", "Python", 40);

    expect(filtered).toHaveLength(1);
    expect(filtered[0].name).toBe("Python Script");
  });

  it("should return all repos with empty query", () => {
    const filtered = filterRepositories(mockRepos, "");

    expect(filtered).toHaveLength(mockRepos.length);
  });

  it("should be case insensitive", () => {
    const filtered1 = filterRepositories(mockRepos, "typescript");
    const filtered2 = filterRepositories(mockRepos, "TYPESCRIPT");

    expect(filtered1).toHaveLength(filtered2.length);
  });

  it("should return empty array when no matches", () => {
    const filtered = filterRepositories(mockRepos, "nonexistent");

    expect(filtered).toHaveLength(0);
  });
});

describe("sortRepositories", () => {
  it("should sort by stars descending", () => {
    const sorted = sortRepositories(mockRepos, "stars");

    expect(sorted[0].stargazers_count).toBeGreaterThanOrEqual(sorted[1].stargazers_count);
  });

  it("should sort by forks descending", () => {
    const sorted = sortRepositories(mockRepos, "forks");

    expect(sorted[0].forks_count).toBeGreaterThanOrEqual(sorted[1].forks_count);
  });

  it("should sort by updated descending", () => {
    const sorted = sortRepositories(mockRepos, "updated");

    const date1 = new Date(sorted[0].updated_at).getTime();
    const date2 = new Date(sorted[1].updated_at).getTime();
    expect(date1).toBeGreaterThanOrEqual(date2);
  });

  it("should sort by created descending", () => {
    const sorted = sortRepositories(mockRepos, "created");

    const date1 = new Date(sorted[0].created_at).getTime();
    const date2 = new Date(sorted[1].created_at).getTime();
    expect(date1).toBeGreaterThanOrEqual(date2);
  });

  it("should sort by name alphabetically", () => {
    const sorted = sortRepositories(mockRepos, "name");

    for (let i = 1; i < sorted.length; i++) {
      expect(sorted[i - 1].name.localeCompare(sorted[i].name)).toBeLessThanOrEqual(0);
    }
  });

  it("should not modify original array", () => {
    const original = [...mockRepos];
    sortRepositories(mockRepos, "stars");

    expect(mockRepos).toEqual(original);
  });

  it("should handle repos with same sort value", () => {
    const sameStars = [
      { ...mockRepos[0], stargazers_count: 50 },
      { ...mockRepos[1], stargazers_count: 50 },
      { ...mockRepos[2], stargazers_count: 50 },
    ];

    const sorted = sortRepositories(sameStars, "stars");
    expect(sorted).toHaveLength(3);
  });
});
