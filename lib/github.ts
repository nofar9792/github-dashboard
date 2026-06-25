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
  language: string;
  topics: string[];
  created_at: string;
  updated_at: string;
}

export interface LanguageStat {
  name: string;
  value: number;
}

export const fetchGitHubUser = async (username: string): Promise<GitHubUser> => {
  try {
    const response = await axios.get(`${GITHUB_API}/users/${username}`);
    return response.data;
  } catch (error) {
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
  } catch (error) {
    throw new Error(`Failed to fetch repositories for ${username}`);
  }
};

export const fetchUserEvents = async (username: string) => {
  try {
    const response = await axios.get(
      `${GITHUB_API}/users/${username}/events/public?per_page=100`
    );
    return response.data;
  } catch (error) {
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

export const calculateContributionStreak = (events: any[]): number => {
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
