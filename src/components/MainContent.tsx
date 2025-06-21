import React from 'react';
import { Link } from 'react-router-dom';
import { useArticles } from '../hooks/useArticles';
import NewsCard from './NewsCard';

const MainContent = () => {
  const { articles, loading, error } = useArticles();

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

  if (error) {
    return (
      <main className="lg:col-span-2">
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-white mb-6">Latest News</h2>
          <div className="bg-red-900 border border-red-700 text-red-300 p-4 rounded">
            Error loading articles: {error}
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="lg:col-span-2">
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-white mb-6">Latest News</h2>
        <div className="grid gap-6">
          {articles.map((article) => (
            <Link key={article.id} to={`/article/${article.slug}`}>
              <NewsCard news={article} />
            </Link>
          ))}
        </div>
      </div>

      {articles.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-400 mb-4">No articles published yet.</p>
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