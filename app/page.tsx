"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Code, Search } from "lucide-react";

export default function Home() {
  const [username, setUsername] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!username.trim()) return;

    setLoading(true);
    router.push(`/profile/${username}`);
  };

  return (
    <div className="min-h-screen bg-white flex items-center justify-center px-4">
      <div className="text-center max-w-2xl w-full">
        {/* Hero Section */}
        <div className="mb-12">
          <div className="flex justify-center mb-6">
            <div className="p-4 bg-gradient-to-br from-blue-600 to-blue-700 rounded-full">
              <Code className="w-12 h-12 text-white" />
            </div>
          </div>
          <h1 className="text-5xl md:text-6xl font-bold text-slate-900 mb-4">
            GitHub Portfolio
          </h1>
          <p className="text-xl text-slate-700 mb-2">
            Visualize your GitHub journey in one beautiful dashboard
          </p>
          <p className="text-slate-600">
            See your repositories, contributions, and coding languages at a glance
          </p>
        </div>

        {/* Search Form */}
        <form onSubmit={handleSearch} className="mb-12">
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-blue-700 rounded-lg blur opacity-75"></div>
            <div className="relative bg-slate-50 rounded-lg p-2 flex items-center gap-3">
              <Search className="w-5 h-5 text-slate-400 ml-3" />
              <input
                type="text"
                placeholder="Enter GitHub username..."
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="flex-1 bg-transparent text-slate-900 placeholder-slate-500 outline-none py-3"
              />
              <button
                type="submit"
                disabled={loading || !username.trim()}
                className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 disabled:from-slate-600 disabled:to-slate-600 text-white font-semibold px-6 py-3 rounded-lg transition mr-2"
              >
                {loading ? "Loading..." : "Search"}
              </button>
            </div>
          </div>
        </form>

        {/* Features */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <div className="bg-slate-100 backdrop-blur border border-slate-200 rounded-lg p-6 hover:border-blue-500 transition">
            <div className="text-3xl mb-3">ðŸ“Š</div>
            <h3 className="font-bold text-slate-900 mb-2">Statistics</h3>
            <p className="text-slate-700 text-sm">
              View your followers, repos, and total stars
            </p>
          </div>
          <div className="bg-slate-100 backdrop-blur border border-slate-200 rounded-lg p-6 hover:border-blue-500 transition">
            <div className="text-3xl mb-3">ðŸ”¥</div>
            <h3 className="font-bold text-slate-900 mb-2">Contributions</h3>
            <p className="text-slate-700 text-sm">
              Track your coding streak and activity
            </p>
          </div>
          <div className="bg-slate-100 backdrop-blur border border-slate-200 rounded-lg p-6 hover:border-blue-500 transition">
            <div className="text-3xl mb-3">â­</div>
            <h3 className="font-bold text-slate-900 mb-2">Top Projects</h3>
            <p className="text-slate-700 text-sm">
              Highlight your most popular repositories
            </p>
          </div>
        </div>

        {/* Example Users */}
        <div className="text-slate-600">
          <p className="mb-4">Try these popular developers:</p>
          <div className="flex flex-wrap justify-center gap-3">
            {["torvalds", "gvanrossum", "antirez", "elisealder"].map((user) => (
              <button
                key={user}
                onClick={() => {
                  setUsername(user);
                  router.push(`/profile/${user}`);
                }}
                className="px-4 py-2 bg-slate-200 hover:bg-slate-300 border border-slate-300 hover:border-blue-500 rounded-lg transition text-sm text-slate-700"
              >
                @{user}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

