import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useArticles } from '../hooks/useArticles';
import { Clock, User, Calendar, ArrowLeft, Share2, Twitter, Facebook, Linkedin } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Article } from '../types/Article';

const ArticleView = () => {
  const { slug } = useParams<{ slug: string }>();
  const { getArticleBySlug } = useArticles();
  const [article, setArticle] = useState<Article | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchArticle = async () => {
      if (!slug) {
        setError('No article slug provided');
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);
        console.log('Fetching article with slug:', slug);
        
        // Add a small delay to prevent rapid state changes
        const fetchedArticle = await getArticleBySlug(slug);
        
        // Ensure we have a valid article before setting state
        if (fetchedArticle && fetchedArticle.title && fetchedArticle.content) {
          setArticle(fetchedArticle);
          console.log('Article loaded successfully:', fetchedArticle.title);
        } else {
          setError('Article not found or incomplete');
          console.log('Article not found for slug:', slug);
        }
      } catch (err) {
        console.error('Error loading article:', err);
        setError('Failed to load article');
      } finally {
        // Ensure loading is set to false after a minimum delay
        setTimeout(() => {
          setLoading(false);
        }, 100);
      }
    };

    fetchArticle();
  }, [slug, getArticleBySlug]);

  // Show loading state
  if (loading) {
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

        {/* Loading Content */}
        <div className="max-w-4xl mx-auto px-4 py-8">
          <div className="text-center py-16">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mx-auto mb-4"></div>
            <p className="text-gray-400">Loading article...</p>
          </div>
        </div>
      </div>
    );
  }

  // Show error or not found state
  if (error || !article) {
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

        {/* Error Content */}
        <div className="max-w-4xl mx-auto px-4 py-8">
          <div className="text-center py-16">
            <h1 className="text-4xl font-bold mb-4">Article Not Found</h1>
            <p className="text-gray-400 mb-8">
              {error || "The article you're looking for doesn't exist."}
            </p>
            <Link
              to="/"
              className="bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
            >
              Return Home
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const shareUrl = typeof window !== 'undefined' ? window.location.href : '';
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
    if (url && typeof window !== 'undefined') {
      window.open(url, '_blank', 'width=600,height=400');
    }
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

          {article.summary && (
            <p className="text-xl text-gray-300 mb-6 leading-relaxed">
              {article.summary}
            </p>
          )}

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
                aria-label="Share on Twitter"
              >
                <Twitter className="w-4 h-4" />
              </button>
              <button
                onClick={() => handleShare('facebook')}
                className="text-gray-400 hover:text-blue-600 transition-colors"
                aria-label="Share on Facebook"
              >
                <Facebook className="w-4 h-4" />
              </button>
              <button
                onClick={() => handleShare('linkedin')}
                className="text-gray-400 hover:text-blue-500 transition-colors"
                aria-label="Share on LinkedIn"
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
              onError={(e) => {
                e.currentTarget.style.display = 'none';
              }}
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

        {/* Related Articles Section */}
        <div className="mt-12 pt-8 border-t border-gray-700">
          <h3 className="text-xl font-semibold text-white mb-4">Continue Reading</h3>
          <div className="flex justify-center">
            <Link
              to="/"
              className="bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
            >
              View More Articles
            </Link>
          </div>
        </div>
      </article>
    </div>
  );
};

export default ArticleView;