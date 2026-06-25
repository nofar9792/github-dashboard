"use client";

import { useState, useEffect } from "react";
import {
  fetchGitHubUser,
  fetchUserRepos,
  fetchUserEvents,
  getLanguageStats,
  getTopRepos,
  calculateContributionStreak,
  GitHubUser,
  Repository,
  LanguageStat,
} from "@/lib/github";
import {
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
} from "recharts";
import {
  Star,
  GitFork,
  Users,
  FileCode,
  Flame,
  Code,
  ExternalLink,
  Loader,
} from "lucide-react";
import { ThemeToggle } from "./theme-toggle";

const COLORS = [
  "#3b82f6",
  "#ef4444",
  "#10b981",
  "#f59e0b",
  "#8b5cf6",
  "#ec4899",
  "#06b6d4",
  "#14b8a6",
];

export default function Dashboard({ username }: { username: string }) {
  const [user, setUser] = useState<GitHubUser | null>(null);
  const [repos, setRepos] = useState<Repository[]>([]);
  const [languageStats, setLanguageStats] = useState<LanguageStat[]>([]);
  const [topRepos, setTopRepos] = useState<Repository[]>([]);
  const [streak, setStreak] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        const userData = await fetchGitHubUser(username);
        setUser(userData);

        const reposData = await fetchUserRepos(username);
        setRepos(reposData);
        setLanguageStats(getLanguageStats(reposData));
        setTopRepos(getTopRepos(reposData));

        const eventsData = await fetchUserEvents(username);
        setStreak(calculateContributionStreak(eventsData));
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load data");
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [username]);

  if (loading) {
    return (
      <div className="min-h-screen bg-white dark:bg-gradient-to-br dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 flex items-center justify-center">
        <div className="text-center">
          <Loader className="w-12 h-12 animate-spin text-blue-500 mx-auto mb-4" />
          <p className="text-slate-600 dark:text-slate-300 text-lg">Loading GitHub profile...</p>
        </div>
      </div>
    );
  }

  if (error || !user) {
    return (
      <div className="min-h-screen bg-white dark:bg-gradient-to-br dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 dark:text-red-400 text-lg">
            {error || "User not found"}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white dark:bg-gradient-to-br dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 text-slate-900 dark:text-white">
      {/* Header */}
      <div className="bg-white dark:bg-slate-800/50 backdrop-blur border-b border-slate-200 dark:border-slate-700">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="flex items-center justify-between mb-6">
            <div />
            <ThemeToggle />
          </div>
          <div className="flex items-center gap-6">
            <img
              src={user.avatar_url}
              alt={user.login}
              className="w-24 h-24 rounded-full border-4 border-blue-500 shadow-lg"
            />
            <div className="flex-1">
              <div className="flex items-center gap-3">
                <h1 className="text-4xl font-bold">{user.name || user.login}</h1>
                <a
                  href={`https://github.com/${user.login}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-slate-400 hover:text-blue-400 transition"
                >
                  <Code className="w-6 h-6" />
                </a>
              </div>
              <p className="text-slate-600 dark:text-slate-400 text-lg mt-1">@{user.login}</p>
              {user.bio && <p className="text-slate-700 dark:text-slate-300 mt-2">{user.bio}</p>}
              <div className="flex flex-wrap gap-4 mt-4 text-sm text-slate-600 dark:text-slate-400">
                {user.location && <span>📍 {user.location}</span>}
                {user.blog && <span>🌐 {user.blog}</span>}
                {user.twitter_username && (
                  <span>𝕏 @{user.twitter_username}</span>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-12">
          <div className="bg-slate-100 dark:bg-slate-800/50 backdrop-blur border border-slate-200 dark:border-slate-700 rounded-lg p-6 hover:border-blue-500 dark:hover:border-blue-400 transition">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-600 dark:text-slate-400 text-sm">Repositories</p>
                <p className="text-3xl font-bold mt-2">{user.public_repos}</p>
              </div>
              <FileCode className="w-10 h-10 text-blue-400" />
            </div>
          </div>

          <div className="bg-slate-100 dark:bg-slate-800/50 backdrop-blur border border-slate-200 dark:border-slate-700 rounded-lg p-6 hover:border-yellow-500 dark:hover:border-yellow-400 transition">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-600 dark:text-slate-400 text-sm">Followers</p>
                <p className="text-3xl font-bold mt-2">{user.followers}</p>
              </div>
              <Users className="w-10 h-10 text-yellow-400" />
            </div>
          </div>

          <div className="bg-slate-100 dark:bg-slate-800/50 backdrop-blur border border-slate-200 dark:border-slate-700 rounded-lg p-6 hover:border-green-500 dark:hover:border-green-400 transition">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-600 dark:text-slate-400 text-sm">Following</p>
                <p className="text-3xl font-bold mt-2">{user.following}</p>
              </div>
              <Users className="w-10 h-10 text-green-400" />
            </div>
          </div>

          <div className="bg-slate-100 dark:bg-slate-800/50 backdrop-blur border border-slate-200 dark:border-slate-700 rounded-lg p-6 hover:border-red-500 dark:hover:border-red-400 transition">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-600 dark:text-slate-400 text-sm">Total Stars</p>
                <p className="text-3xl font-bold mt-2">
                  {repos.reduce((sum, repo) => sum + repo.stargazers_count, 0)}
                </p>
              </div>
              <Star className="w-10 h-10 text-red-400" />
            </div>
          </div>

          <div className="bg-slate-100 dark:bg-slate-800/50 backdrop-blur border border-slate-200 dark:border-slate-700 rounded-lg p-6 hover:border-orange-500 dark:hover:border-orange-400 transition">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-600 dark:text-slate-400 text-sm">Contribution Streak</p>
                <p className="text-3xl font-bold mt-2">{streak}</p>
              </div>
              <Flame className="w-10 h-10 text-orange-400" />
            </div>
          </div>
        </div>

        {/* Charts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          {/* Languages Chart */}
          <div className="bg-slate-100 dark:bg-slate-800/50 backdrop-blur border border-slate-200 dark:border-slate-700 rounded-lg p-6">
            <h2 className="text-xl font-bold mb-6 text-slate-900 dark:text-white">Languages Used</h2>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={languageStats}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, value }) => `${name} (${value})`}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {languageStats.map((_, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>

          {/* Language Distribution Bar Chart */}
          <div className="bg-slate-100 dark:bg-slate-800/50 backdrop-blur border border-slate-200 dark:border-slate-700 rounded-lg p-6">
            <h2 className="text-xl font-bold mb-6 text-slate-900 dark:text-white">Language Distribution</h2>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={languageStats}>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                <XAxis dataKey="name" stroke="#94a3b8" />
                <YAxis stroke="#94a3b8" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "var(--tooltip-bg, #1e293b)",
                    border: "1px solid var(--tooltip-border, #475569)",
                    color: "var(--tooltip-text, #e2e8f0)",
                  }}
                />
                <Bar dataKey="value" fill="#3b82f6" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Top Repositories */}
        <div className="bg-slate-100 dark:bg-slate-800/50 backdrop-blur border border-slate-200 dark:border-slate-700 rounded-lg p-6">
          <h2 className="text-2xl font-bold mb-6 text-slate-900 dark:text-white">Top Repositories</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {topRepos.map((repo) => (
              <a
                key={repo.id}
                href={repo.url}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-slate-200 dark:bg-slate-700/50 hover:bg-slate-300 dark:hover:bg-slate-600/50 border border-slate-300 dark:border-slate-600 hover:border-blue-500 dark:hover:border-blue-400 rounded-lg p-4 transition group"
              >
                <div className="flex items-start justify-between mb-3">
                  <h3 className="font-bold text-lg text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition">
                    {repo.name}
                  </h3>
                  <ExternalLink className="w-4 h-4 text-slate-600 dark:text-slate-400 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition" />
                </div>
                {repo.description && (
                  <p className="text-slate-700 dark:text-slate-400 text-sm mb-3 line-clamp-2">
                    {repo.description}
                  </p>
                )}
                <div className="flex flex-wrap gap-3 mb-3">
                  {repo.language && (
                    <span className="text-xs bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 px-2 py-1 rounded">
                      {repo.language}
                    </span>
                  )}
                  {repo.topics.slice(0, 2).map((topic) => (
                    <span
                      key={topic}
                      className="text-xs bg-slate-300 dark:bg-slate-600/50 text-slate-700 dark:text-slate-300 px-2 py-1 rounded"
                    >
                      {topic}
                    </span>
                  ))}
                </div>
                <div className="flex items-center gap-4 text-sm text-slate-700 dark:text-slate-400">
                  <span className="flex items-center gap-1">
                    <Star className="w-4 h-4" /> {repo.stargazers_count}
                  </span>
                  <span className="flex items-center gap-1">
                    <GitFork className="w-4 h-4" /> {repo.forks_count}
                  </span>
                </div>
              </a>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
