import React from 'react';
import { Link } from 'react-router-dom';
import { useArticles } from '../hooks/useArticles';
import NewsCard from './NewsCard';
import { AlertCircle, Database, Wifi } from 'lucide-react';

const MainContent = () => {
  const { articles, loading, error, isSupabaseConnected } = useArticles();

  if (loading) {
    return (
      <main className="lg:col-span-2">
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-white mb-6">Latest News</h2>
          <div className="grid gap-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-gray-800 rounded-lg p-6 animate-pulse">
                <div className="h-4 bg-gray-700 rounded w-3/4 mb-4"></div>
                <div className="h-3 bg-gray-700 rounded w-1/2 mb-2"></div>
                <div className="h-3 bg-gray-700 rounded w-2/3"></div>
              </div>
            ))}
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="lg:col-span-2">
      <div className="mb-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-3xl font-bold text-white">Latest News</h2>
          
          {/* Connection Status Indicator */}
          <div className="flex items-center space-x-2">
            {isSupabaseConnected ? (
              <div className="flex items-center space-x-2 text-green-400 text-sm">
                <Database className="w-4 h-4" />
                <span>Live Database</span>
              </div>
            ) : (
              <div className="flex items-center space-x-2 text-yellow-400 text-sm">
                <Wifi className="w-4 h-4" />
                <span>Demo Mode</span>
              </div>
            )}
          </div>
        </div>

        {/* Error/Demo Mode Notice */}
        {error && !isSupabaseConnected && (
          <div className="bg-yellow-900 border border-yellow-700 text-yellow-300 p-4 rounded mb-6">
            <div className="flex items-center space-x-2">
              <AlertCircle className="w-5 h-5" />
              <div>
                <p className="font-semibold">Demo Mode Active</p>
                <p className="text-sm">Connect to Supabase to see live articles. Currently showing demo content.</p>
              </div>
            </div>
          </div>
        )}

        <div className="grid gap-6">
          {articles.map((article) => (
            <Link key={article.id} to={`/article/${article.slug}`}>
              <NewsCard news={article} />
            </Link>
          ))}
        </div>
      </div>

      {articles.length === 0 && !loading && (
        <div className="text-center py-12">
          <p className="text-gray-400 mb-4">No articles available.</p>
          <Link
            to="/admin"
            className="bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
          >
            Create First Article
          </Link>
        </div>
      )}
    </main>
  );
};

export default MainContent;