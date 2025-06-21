import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArticleManager } from '../utils/articleManager';
import { Clock, User, Calendar, ArrowLeft, Share2, Twitter, Facebook, Linkedin } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

const ArticleView = () => {
  const { slug } = useParams<{ slug: string }>();
  const article = slug ? ArticleManager.getArticleBySlug(slug) : null;

  if (!article) {
    return (
      <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold mb-4">Article Not Found</h1>
          <p className="text-gray-400 mb-8">The article you're looking for doesn't exist.</p>
          <Link
            to="/"
            className="bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
          >
            Return Home
          </Link>
        </div>
      </div>
    );
  }

  const shareUrl = window.location.href;
  const shareText = `${article.title} - ${article.summary}`;

  const handleShare = (platform: string) => {
    let url = '';
    switch (platform) {
      case 'twitter':
        url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(shareUrl)}`;
        break;
      case 'facebook':
        url = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`;
        break;
      case 'linkedin':
        url = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`;
        break;
    }
    window.open(url, '_blank', 'width=600,height=400');
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Header */}
      <header className="bg-gray-800 border-b border-gray-700">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <Link
            to="/"
            className="flex items-center space-x-2 text-gray-400 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Home</span>
          </Link>
        </div>
      </header>

      {/* Article Content */}
      <article className="max-w-4xl mx-auto px-4 py-8">
        {/* Breadcrumbs */}
        <nav className="text-sm text-gray-400 mb-6">
          <Link to="/" className="hover:text-white">Home</Link>
          <span className="mx-2">/</span>
          <Link to={`/category/${article.category.toLowerCase()}`} className="hover:text-white">
            {article.category}
          </Link>
          <span className="mx-2">/</span>
          <span className="text-white">{article.title}</span>
        </nav>

        {/* Article Header */}
        <header className="mb-8">
          <div className="flex items-center space-x-4 mb-4">
            <span className={`bg-red-600 text-white px-3 py-1 rounded text-sm font-bold uppercase`}>
              {article.category}
            </span>
            {article.breaking && (
              <span className="bg-red-500 text-white px-3 py-1 rounded text-sm font-bold uppercase animate-pulse">
                Breaking
              </span>
            )}
            {article.featured && (
              <span className="bg-yellow-600 text-white px-3 py-1 rounded text-sm font-bold uppercase">
                Featured
              </span>
            )}
          </div>

          <h1 className="text-4xl lg:text-5xl font-bold text-white mb-6 leading-tight">
            {article.title}
          </h1>

          <p className="text-xl text-gray-300 mb-6 leading-relaxed">
            {article.summary}
          </p>

          <div className="flex flex-wrap items-center justify-between gap-4 text-gray-400 text-sm">
            <div className="flex items-center space-x-6">
              <div className="flex items-center space-x-2">
                <User className="w-4 h-4" />
                <span>{article.author}</span>
              </div>
              <div className="flex items-center space-x-2">
                <Clock className="w-4 h-4" />
                <span>{article.readTime}</span>
              </div>
              <div className="flex items-center space-x-2">
                <Calendar className="w-4 h-4" />
                <span>{new Date(article.publishDate).toLocaleDateString()}</span>
              </div>
            </div>

            {/* Share Buttons */}
            <div className="flex items-center space-x-3">
              <Share2 className="w-4 h-4" />
              <button
                onClick={() => handleShare('twitter')}
                className="text-gray-400 hover:text-blue-400 transition-colors"
              >
                <Twitter className="w-4 h-4" />
              </button>
              <button
                onClick={() => handleShare('facebook')}
                className="text-gray-400 hover:text-blue-600 transition-colors"
              >
                <Facebook className="w-4 h-4" />
              </button>
              <button
                onClick={() => handleShare('linkedin')}
                className="text-gray-400 hover:text-blue-500 transition-colors"
              >
                <Linkedin className="w-4 h-4" />
              </button>
            </div>
          </div>
        </header>

        {/* Featured Image */}
        {article.image && (
          <div className="mb-8">
            <img
              src={article.image}
              alt={article.title}
              className="w-full h-64 lg:h-96 object-cover rounded-lg"
            />
          </div>
        )}

        {/* Article Content */}
        <div className="prose prose-invert prose-lg max-w-none">
          <ReactMarkdown
            remarkPlugins={[remarkGfm]}
            components={{
              h1: ({ children }) => <h1 className="text-3xl font-bold text-white mb-6 mt-8">{children}</h1>,
              h2: ({ children }) => <h2 className="text-2xl font-bold text-white mb-4 mt-6">{children}</h2>,
              h3: ({ children }) => <h3 className="text-xl font-bold text-white mb-3 mt-5">{children}</h3>,
              p: ({ children }) => <p className="text-gray-300 mb-4 leading-relaxed">{children}</p>,
              blockquote: ({ children }) => (
                <blockquote className="border-l-4 border-red-600 pl-6 py-2 my-6 bg-gray-800 rounded-r">
                  <div className="text-gray-300 italic">{children}</div>
                </blockquote>
              ),
              ul: ({ children }) => <ul className="list-disc list-inside text-gray-300 mb-4 space-y-2">{children}</ul>,
              ol: ({ children }) => <ol className="list-decimal list-inside text-gray-300 mb-4 space-y-2">{children}</ol>,
              li: ({ children }) => <li className="text-gray-300">{children}</li>,
              strong: ({ children }) => <strong className="text-white font-bold">{children}</strong>,
              em: ({ children }) => <em className="text-gray-200 italic">{children}</em>,
              code: ({ children }) => (
                <code className="bg-gray-800 text-red-400 px-2 py-1 rounded text-sm">{children}</code>
              ),
              pre: ({ children }) => (
                <pre className="bg-gray-800 p-4 rounded-lg overflow-x-auto mb-4">{children}</pre>
              ),
            }}
          >
            {article.content}
          </ReactMarkdown>
        </div>

        {/* Tags */}
        {article.tags && article.tags.length > 0 && (
          <div className="mt-8 pt-6 border-t border-gray-700">
            <h3 className="text-lg font-semibold text-white mb-3">Tags</h3>
            <div className="flex flex-wrap gap-2">
              {article.tags.map((tag) => (
                <span
                  key={tag}
                  className="bg-gray-700 hover:bg-red-600 text-gray-300 hover:text-white px-3 py-1 rounded-full text-sm cursor-pointer transition-colors"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
        )}
      </article>
    </div>
  );
};

export default ArticleView;