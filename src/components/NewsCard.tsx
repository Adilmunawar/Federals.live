import React from 'react';
import { Clock, User, ArrowRight } from 'lucide-react';

interface NewsProps {
  news: {
    id: number;
    title: string;
    summary: string;
    image: string;
    category: string;
    author: string;
    readTime: string;
    publishDate: string;
  };
}

const NewsCard: React.FC<NewsProps> = ({ news }) => {
  const getCategoryColor = (category: string) => {
    const colors: { [key: string]: string } = {
      Politics: 'bg-red-600',
      World: 'bg-blue-600',
      Economy: 'bg-green-600',
      Security: 'bg-purple-600',
      Opinion: 'bg-orange-600',
      Culture: 'bg-pink-600',
      Science: 'bg-cyan-600'
    };
    return colors[category] || 'bg-gray-600';
  };

  return (
    <article className="bg-gray-800 rounded-lg overflow-hidden hover:bg-gray-750 transition-all duration-300 group border border-gray-700 hover:border-gray-600">
      <div className="md:flex">
        <div className="md:w-1/3">
          <img
            src={news.image}
            alt={news.title}
            className="w-full h-48 md:h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        </div>
        <div className="md:w-2/3 p-6">
          <div className="flex items-center space-x-4 mb-3">
            <span className={`${getCategoryColor(news.category)} text-white px-3 py-1 rounded text-sm font-semibold uppercase tracking-wide`}>
              {news.category}
            </span>
            <div className="flex items-center space-x-4 text-gray-400 text-sm">
              <div className="flex items-center space-x-1">
                <User className="w-4 h-4" />
                <span>{news.author}</span>
              </div>
              <div className="flex items-center space-x-1">
                <Clock className="w-4 h-4" />
                <span>{news.readTime}</span>
              </div>
            </div>
          </div>
          
          <h3 className="text-xl font-bold text-white mb-3 leading-tight group-hover:text-red-400 transition-colors">
            {news.title}
          </h3>
          
          <p className="text-gray-300 mb-4 leading-relaxed">
            {news.summary}
          </p>
          
          <div className="flex items-center justify-between">
            <span className="text-gray-400 text-sm">{news.publishDate}</span>
            <button className="flex items-center space-x-2 text-red-400 hover:text-red-300 font-semibold group">
              <span>Read More</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </div>
      </div>
    </article>
  );
};

export default NewsCard;