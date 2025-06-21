import React from 'react';
import { Link } from 'react-router-dom';
import { ArticleManager } from '../utils/articleManager';
import NewsCard from './NewsCard';

const MainContent = () => {
  const articles = ArticleManager.getAllArticles();

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

      {/* Load More Button */}
      <div className="text-center">
        <button className="bg-gray-800 hover:bg-gray-700 text-white px-8 py-3 rounded-lg font-semibold transition-colors border border-gray-700">
          Load More Articles
        </button>
      </div>
    </main>
  );
};

export default MainContent;