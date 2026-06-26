import axios from "axios";

const GITHUB_API = "https://api.github.com";

export interface GitHubUser {
  login: string;
  name: string;
  bio: string;
  avatar_url: string;
  public_repos: number;
  public_gists: number;
  followers: number;
  following: number;
  created_at: string;
  blog: string;
  location: string;
  twitter_username: string;
}

export interface Repository {
  id: number;
  name: string;
  description: string;
  url: string;
  stargazers_count: number;
  forks_count: number;
  language: string | null;
  topics: string[];
  created_at: string;
  updated_at: string;
}

export interface LanguageStat {
  name: string;
  value: number;
  percentage?: number;
}

export interface RepositoryCategory {
  name: string;
  repos: Repository[];
}

export interface ContributionData {
  date: string;
  count: number;
}

export interface RepositoryTimeline {
  date: string;
  reposCreated: number;
}

export interface GitHubEvent {
  created_at: string;
  id?: number;
  type?: string;
}

export const fetchGitHubUser = async (username: string): Promise<GitHubUser> => {
  try {
    const response = await axios.get(`${GITHUB_API}/users/${username}`);
    return response.data;
  } catch {
    throw new Error(`Failed to fetch user ${username}`);
  }
};

export const fetchUserRepos = async (
  username: string,
  sort: "stars" | "updated" = "stars"
): Promise<Repository[]> => {
  try {
    const response = await axios.get(
      `${GITHUB_API}/users/${username}/repos?sort=${sort}&per_page=100&type=owner`
    );
    return response.data;
  } catch {
    throw new Error(`Failed to fetch repositories for ${username}`);
  }
};

export const fetchUserEvents = async (username: string) => {
  try {
    const response = await axios.get(
      `${GITHUB_API}/users/${username}/events/public?per_page=100`
    );
    return response.data;
  } catch {
    throw new Error(`Failed to fetch events for ${username}`);
  }
};

export const getLanguageStats = (repos: Repository[]): LanguageStat[] => {
  const languageCounts: { [key: string]: number } = {};

  repos.forEach((repo) => {
    if (repo.language) {
      languageCounts[repo.language] = (languageCounts[repo.language] || 0) + 1;
    }
  });

  return Object.entries(languageCounts)
    .map(([name, value]) => ({ name, value }))
    .sort((a, b) => b.value - a.value)
    .slice(0, 8);
};

export const getTopRepos = (repos: Repository[], limit = 6): Repository[] => {
  return repos
    .filter((repo) => repo.stargazers_count > 0)
    .sort((a, b) => b.stargazers_count - a.stargazers_count)
    .slice(0, limit);
};

export const calculateContributionStreak = (events: GitHubEvent[] | null): number => {
  if (!events || events.length === 0) return 0;

  let streak = 0;
  const today = new Date();

  for (let i = 0; i < 365; i++) {
    const date = new Date(today);
    date.setDate(date.getDate() - i);
    const dateStr = date.toISOString().split("T")[0];

    const hasEvent = events.some(
      (event) => event.created_at.split("T")[0] === dateStr
    );

    if (hasEvent) {
      streak++;
    } else if (i > 0) {
      break;
    }
  }

  return streak;
};

export const getLanguagePercentage = (repos: Repository[]): LanguageStat[] => {
  const languageCounts: { [key: string]: number } = {};
  let total = 0;

  repos.forEach((repo) => {
    if (repo.language) {
      languageCounts[repo.language] = (languageCounts[repo.language] || 0) + 1;
      total++;
    }
  });

  return Object.entries(languageCounts)
    .map(([name, value]) => ({
      name,
      value,
      percentage: Math.round((value / total) * 100),
    }))
    .sort((a, b) => b.value - a.value)
    .slice(0, 8);
};

export const categorizeRepositories = (repos: Repository[]): RepositoryCategory[] => {
  const personal = repos.filter((r) => !r.url.includes("fork"));
  const topStarred = repos.filter((r) => r.stargazers_count > 0);

  return [
    { name: "All Repositories", repos },
    { name: "Personal Projects", repos: personal },
    { name: "Top Starred", repos: topStarred },
  ];
};

export const getContributionHeatmap = (events: GitHubEvent[] | null): ContributionData[] => {
  const contributionMap: { [key: string]: number } = {};
  const today = new Date();

  for (let i = 0; i < 365; i++) {
    const date = new Date(today);
    date.setDate(date.getDate() - i);
    const dateStr = date.toISOString().split("T")[0];
    contributionMap[dateStr] = 0;
  }

  events?.forEach((event) => {
    const dateStr = event.created_at.split("T")[0];
    if (contributionMap[dateStr] !== undefined) {
      contributionMap[dateStr]++;
    }
  });

  return Object.entries(contributionMap)
    .map(([date, count]) => ({ date, count }))
    .reverse();
};

export const getRepositoryTimeline = (repos: Repository[]): RepositoryTimeline[] => {
  const timelineMap: { [key: string]: number } = {};

  repos.forEach((repo) => {
    const date = repo.created_at.split("T")[0];
    timelineMap[date] = (timelineMap[date] || 0) + 1;
  });

  return Object.entries(timelineMap)
    .map(([date, reposCreated]) => ({ date, reposCreated }))
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
    .slice(-30);
};

export const filterRepositories = (
  repos: Repository[],
  query: string,
  language?: string,
  minStars?: number
): Repository[] => {
  return repos.filter((repo) => {
    const matchesQuery =
      query === "" ||
      repo.name.toLowerCase().includes(query.toLowerCase()) ||
      (repo.description &&
        repo.description.toLowerCase().includes(query.toLowerCase()));
    const matchesLanguage = !language || repo.language === language;
    const matchesStars = !minStars || repo.stargazers_count >= minStars;

    return matchesQuery && matchesLanguage && matchesStars;
  });
};

export const sortRepositories = (
  repos: Repository[],
  sortBy: "stars" | "forks" | "updated" | "created" | "name"
): Repository[] => {
  const sorted = [...repos];
  switch (sortBy) {
    case "stars":
      return sorted.sort((a, b) => b.stargazers_count - a.stargazers_count);
    case "forks":
      return sorted.sort((a, b) => b.forks_count - a.forks_count);
    case "updated":
      return sorted.sort(
        (a, b) =>
          new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime()
      );
    case "created":
      return sorted.sort(
        (a, b) =>
          new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      );
    case "name":
      return sorted.sort((a, b) => a.name.localeCompare(b.name));
    default:
      return sorted;
  }
};
