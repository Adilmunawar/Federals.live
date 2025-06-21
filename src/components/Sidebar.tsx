import React from 'react';
import { TrendingUp, Clock, User, Tag } from 'lucide-react';

const Sidebar = () => {
  const trendingNews = [
    {
      id: 1,
      title: "Senate Approves Infrastructure Investment Package",
      category: "Politics",
      publishDate: "2 hours ago"
    },
    {
      id: 2,
      title: "International Sanctions Target Money Laundering Networks",
      category: "World",
      publishDate: "4 hours ago"
    },
    {
      id: 3,
      title: "Federal Courts Address Constitutional Questions",
      category: "Politics",
      publishDate: "6 hours ago"
    },
    {
      id: 4,
      title: "Economic Indicators Show Mixed Growth Signals",
      category: "Economy",
      publishDate: "8 hours ago"
    },
    {
      id: 5,
      title: "Cybersecurity Framework Updated for Critical Sectors",
      category: "Security",
      publishDate: "10 hours ago"
    }
  ];

  const featuredStories = [
    {
      id: 1,
      title: "Deep Dive: The Future of Democratic Institutions",
      image: "https://images.pexels.com/photos/6077326/pexels-photo-6077326.jpeg?auto=compress&cs=tinysrgb&w=300",
      category: "Opinion",
      readTime: "12 min read"
    },
    {
      id: 2,
      title: "Analysis: Global Supply Chain Vulnerabilities",
      image: "https://images.pexels.com/photos/7621047/pexels-photo-7621047.jpeg?auto=compress&cs=tinysrgb&w=300",
      category: "Economy",
      readTime: "9 min read"
    }
  ];

  const popularTags = [
    "Congress", "Federal Policy", "International Relations", "Economic Policy",
    "National Security", "Constitutional Law", "Global Affairs", "Trade Policy"
  ];

  return (
    <aside className="space-y-8">
      {/* Newsletter Signup */}
      <div className="bg-gradient-to-r from-red-600 to-red-700 rounded-lg p-6 text-white">
        <h3 className="text-xl font-bold mb-3">Stay Informed</h3>
        <p className="text-red-100 mb-4 text-sm">
          Get breaking news and analysis delivered to your inbox.
        </p>
        <div className="space-y-3">
          <input
            type="email"
            placeholder="Enter your email"
            className="w-full px-4 py-2 rounded bg-white/20 border border-white/30 placeholder-red-200 text-white focus:outline-none focus:border-white"
          />
          <button className="w-full bg-white text-red-600 py-2 rounded font-semibold hover:bg-red-50 transition-colors">
            Subscribe
          </button>
        </div>
      </div>

      {/* Trending Now */}
      <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
        <div className="flex items-center space-x-2 mb-4">
          <TrendingUp className="w-5 h-5 text-red-400" />
          <h3 className="text-lg font-bold text-white">Trending Now</h3>
        </div>
        <div className="space-y-4">
          {trendingNews.map((news, index) => (
            <div key={news.id} className="flex items-start space-x-3 group cursor-pointer">
              <span className="text-red-400 font-bold text-sm mt-1 flex-shrink-0">
                {(index + 1).toString().padStart(2, '0')}
              </span>
              <div>
                <h4 className="text-white text-sm font-medium group-hover:text-red-400 transition-colors leading-tight">
                  {news.title}
                </h4>
                <div className="flex items-center space-x-2 mt-1 text-xs text-gray-400">
                  <span className="bg-gray-700 px-2 py-1 rounded text-xs">
                    {news.category}
                  </span>
                  <span>{news.publishDate}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Featured Stories */}
      <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
        <h3 className="text-lg font-bold text-white mb-4">Featured Stories</h3>
        <div className="space-y-4">
          {featuredStories.map((story) => (
            <div key={story.id} className="group cursor-pointer">
              <img
                src={story.image}
                alt={story.title}
                className="w-full h-32 object-cover rounded mb-3 group-hover:opacity-90 transition-opacity"
              />
              <div>
                <span className="bg-red-600 text-white px-2 py-1 rounded text-xs font-semibold uppercase">
                  {story.category}
                </span>
                <h4 className="text-white font-medium mt-2 group-hover:text-red-400 transition-colors leading-tight">
                  {story.title}
                </h4>
                <div className="flex items-center space-x-1 mt-1 text-xs text-gray-400">
                  <Clock className="w-3 h-3" />
                  <span>{story.readTime}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Popular Tags */}
      <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
        <div className="flex items-center space-x-2 mb-4">
          <Tag className="w-5 h-5 text-red-400" />
          <h3 className="text-lg font-bold text-white">Popular Tags</h3>
        </div>
        <div className="flex flex-wrap gap-2">
          {popularTags.map((tag) => (
            <span
              key={tag}
              className="bg-gray-700 hover:bg-red-600 text-gray-300 hover:text-white px-3 py-1 rounded-full text-sm cursor-pointer transition-colors"
            >
              {tag}
            </span>
          ))}
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;