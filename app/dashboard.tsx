"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { logger } from "@/lib/logger";
import {
  fetchGitHubUser,
  fetchUserRepos,
  fetchUserEvents,
  getLanguageStats,
  getLanguagePercentage,
  calculateContributionStreak,
  getContributionHeatmap,
  categorizeRepositories,
  filterRepositories,
  sortRepositories,
  GitHubUser,
  Repository,
  LanguageStat,
  RepositoryCategory,
  ContributionData,
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
  const [languagePercentage, setLanguagePercentage] = useState<LanguageStat[]>([]);
  const [streak, setStreak] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedLanguage, setSelectedLanguage] = useState<string>();
  const [sortBy, setSortBy] = useState<"stars" | "forks" | "updated" | "created" | "name">("stars");
  const [selectedCategory, setSelectedCategory] = useState("All Repositories");
  const [categories, setCategories] = useState<RepositoryCategory[]>([]);
  const [contributionData, setContributionData] = useState<ContributionData[]>([]);

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        const userData = await fetchGitHubUser(username);
        setUser(userData);

        const reposData = await fetchUserRepos(username);
        setRepos(reposData);
        setLanguageStats(getLanguageStats(reposData));
        setLanguagePercentage(getLanguagePercentage(reposData));
        setCategories(categorizeRepositories(reposData));

        const eventsData = await fetchUserEvents(username);
        setStreak(calculateContributionStreak(eventsData));
        setContributionData(getContributionHeatmap(eventsData));
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "Failed to load data";
        logger.error("Dashboard loading failed", {
          username,
          error: err,
        });
        setError(errorMessage);
      } finally {
        setLoading(false);
      }
    };

    logger.info("Dashboard loading started", { username });
    loadData();
  }, [username]);

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <Loader className="w-12 h-12 animate-spin text-blue-500 mx-auto mb-4" />
          <p className="text-slate-600 text-lg">Loading GitHub profile...</p>
        </div>
      </div>
    );
  }

  if (error || !user) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 text-lg">
            {error || "User not found"}
          </p>
        </div>
      </div>
    );
  }

  const currentCategory = categories.find((c) => c.name === selectedCategory);
  const categoryRepos = currentCategory?.repos || repos;
  const filteredRepos = filterRepositories(
    categoryRepos,
    searchQuery,
    selectedLanguage
  );
  const sortedRepos = sortRepositories(filteredRepos, sortBy);
  const uniqueLanguages = Array.from(
    new Set(repos.filter((r) => r.language !== null).map((r) => r.language as string))
  ).sort();

  return (
    <div className="min-h-screen bg-white text-slate-900">
      {/* Header */}
      <div className="bg-white backdrop-blur border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="flex items-center gap-6">
            <Image
              src={user.avatar_url}
              alt={user.login}
              width={96}
              height={96}
              className="rounded-full border-4 border-blue-500 shadow-lg"
              priority
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
              <p className="text-slate-600 text-lg mt-1">@{user.login}</p>
              {user.bio && <p className="text-slate-700 mt-2">{user.bio}</p>}
              <div className="flex flex-wrap gap-4 mt-4 text-sm text-slate-600">
                {user.location && <span>ðŸ“ {user.location}</span>}
                {user.blog && <span>ðŸŒ {user.blog}</span>}
                {user.twitter_username && (
                  <span>ð• @{user.twitter_username}</span>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-12">
          <div className="bg-slate-100 backdrop-blur border border-slate-200 rounded-lg p-6 hover:border-blue-500 transition">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-600 text-sm">Repositories</p>
                <p className="text-3xl font-bold mt-2">{user.public_repos}</p>
              </div>
              <FileCode className="w-10 h-10 text-blue-400" />
            </div>
          </div>

          <div className="bg-slate-100 backdrop-blur border border-slate-200 rounded-lg p-6 hover:border-yellow-500 transition">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-600 text-sm">Followers</p>
                <p className="text-3xl font-bold mt-2">{user.followers}</p>
              </div>
              <Users className="w-10 h-10 text-yellow-400" />
            </div>
          </div>

          <div className="bg-slate-100 backdrop-blur border border-slate-200 rounded-lg p-6 hover:border-green-500 transition">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-600 text-sm">Following</p>
                <p className="text-3xl font-bold mt-2">{user.following}</p>
              </div>
              <Users className="w-10 h-10 text-green-400" />
            </div>
          </div>

          <div className="bg-slate-100 backdrop-blur border border-slate-200 rounded-lg p-6 hover:border-red-500 transition">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-600 text-sm">Total Stars</p>
                <p className="text-3xl font-bold mt-2">
                  {repos.reduce((sum, repo) => sum + repo.stargazers_count, 0)}
                </p>
              </div>
              <Star className="w-10 h-10 text-red-400" />
            </div>
          </div>

          <div className="bg-slate-100 backdrop-blur border border-slate-200 rounded-lg p-6 hover:border-orange-500 transition">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-600 text-sm">Contribution Streak</p>
                <p className="text-3xl font-bold mt-2">{streak}</p>
              </div>
              <Flame className="w-10 h-10 text-orange-400" />
            </div>
          </div>
        </div>

        {/* Charts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
          {/* Languages Chart */}
          <div className="bg-slate-100 backdrop-blur border border-slate-200 rounded-lg p-6">
            <h2 className="text-xl font-bold mb-6 text-slate-900">Languages Used</h2>
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
          <div className="bg-slate-100 backdrop-blur border border-slate-200 rounded-lg p-6">
            <h2 className="text-xl font-bold mb-6 text-slate-900">Language Distribution</h2>
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

          {/* Language Percentage */}
          <div className="bg-slate-100 backdrop-blur border border-slate-200 rounded-lg p-6">
            <h2 className="text-xl font-bold mb-6 text-slate-900">Language Usage %</h2>
            <div className="space-y-3">
              {languagePercentage.map((lang) => (
                <div key={lang.name}>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="font-medium text-slate-700">{lang.name}</span>
                    <span className="text-slate-600">{lang.percentage}%</span>
                  </div>
                  <div className="w-full bg-slate-300 rounded-full h-2">
                    <div
                      className="bg-gradient-to-r from-blue-500 to-blue-600 h-2 rounded-full"
                      style={{ width: `${lang.percentage}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Contribution Heatmap */}
        <div className="bg-slate-100 backdrop-blur border border-slate-200 rounded-lg p-6 mb-12">
          <h2 className="text-xl font-bold mb-6 text-slate-900">Contribution Activity (Last 30 Days)</h2>
          <div className="grid grid-cols-7 gap-2">
            {contributionData.slice(-30).map((day, idx) => (
              <div
                key={idx}
                className="aspect-square rounded-lg flex items-center justify-center text-xs font-semibold text-white transition"
                style={{
                  backgroundColor:
                    day.count === 0
                      ? "var(--heat-0, #e2e8f0)"
                      : day.count < 3
                      ? "var(--heat-1, #bfdbfe)"
                      : day.count < 6
                      ? "var(--heat-2, #60a5fa)"
                      : day.count < 10
                      ? "var(--heat-3, #3b82f6)"
                      : "var(--heat-4, #1e40af)",
                }}
                title={`${day.date}: ${day.count} contributions`}
              >
                {day.count > 0 ? day.count : ""}
              </div>
            ))}
          </div>
        </div>

        {/* Repository Categories */}
        <div className="mb-8">
          <div className="flex flex-wrap gap-3">
            {categories.map((category) => (
              <button
                key={category.name}
                onClick={() => {
                  setSelectedCategory(category.name);
                  setSearchQuery("");
                  setSelectedLanguage(undefined);
                }}
                className={`px-4 py-2 rounded-lg font-medium transition ${
                  selectedCategory === category.name
                    ? "bg-blue-600 text-white"
                    : "bg-slate-200 text-slate-900 hover:bg-slate-300"
                }`}
              >
                {category.name} ({category.repos.length})
              </button>
            ))}
          </div>
        </div>

        {/* Search and Filter */}
        <div className="mb-8 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <input
              type="text"
              placeholder="Search repositories..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="px-4 py-2 bg-slate-100 border border-slate-300 rounded-lg text-slate-900 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <select
              value={selectedLanguage || ""}
              onChange={(e) => setSelectedLanguage(e.target.value || undefined)}
              className="px-4 py-2 bg-slate-100 border border-slate-300 rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">All Languages</option>
              {uniqueLanguages.map((lang) => (
                <option key={lang} value={lang}>
                  {lang}
                </option>
              ))}
            </select>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as "stars" | "forks" | "updated" | "created" | "name")}
              className="px-4 py-2 bg-slate-100 border border-slate-300 rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="stars">Sort by Stars</option>
              <option value="forks">Sort by Forks</option>
              <option value="updated">Sort by Updated</option>
              <option value="created">Sort by Created</option>
              <option value="name">Sort by Name</option>
            </select>
          </div>
          <p className="text-sm text-slate-600">
            Showing {sortedRepos.length} of {categoryRepos.length} repositories
          </p>
        </div>

        {/* Top Repositories */}
        <div className="bg-slate-100 backdrop-blur border border-slate-200 rounded-lg p-6">
          <h2 className="text-2xl font-bold mb-6 text-slate-900">Repositories</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {sortedRepos.length > 0 ? (
              sortedRepos.map((repo) => (
                <a
                  key={repo.id}
                  href={repo.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-slate-200 hover:bg-slate-300 border border-slate-300 hover:border-blue-500 rounded-lg p-4 transition group"
                >
                  <div className="flex items-start justify-between mb-3">
                    <h3 className="font-bold text-lg text-slate-900 group-hover:text-blue-600 transition">
                      {repo.name}
                    </h3>
                    <ExternalLink className="w-4 h-4 text-slate-600 group-hover:text-blue-600 transition" />
                  </div>
                  {repo.description && (
                    <p className="text-slate-700 text-sm mb-3 line-clamp-2">
                      {repo.description}
                    </p>
                  )}
                  <div className="flex flex-wrap gap-3 mb-3">
                    {repo.language && (
                      <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded">
                        {repo.language}
                      </span>
                    )}
                    {repo.topics.slice(0, 2).map((topic) => (
                      <span
                        key={topic}
                        className="text-xs bg-slate-300 text-slate-700 px-2 py-1 rounded"
                      >
                        {topic}
                      </span>
                    ))}
                  </div>
                  <div className="flex items-center gap-4 text-sm text-slate-700">
                    <span className="flex items-center gap-1">
                      <Star className="w-4 h-4" /> {repo.stargazers_count}
                    </span>
                    <span className="flex items-center gap-1">
                      <GitFork className="w-4 h-4" /> {repo.forks_count}
                    </span>
                  </div>
                </a>
              ))
            ) : (
              <div className="col-span-full text-center py-8">
                <p className="text-slate-600">
                  No repositories match your filters.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

