import React, { useState, useEffect } from 'react';
import { geminiService } from '../services/geminiService';
import { Target, CheckCircle, AlertTriangle, TrendingUp, Search, Loader } from 'lucide-react';

interface SEOAnalyzerProps {
  title: string;
  content: string;
  category: string;
  onClose: () => void;
  onOptimize: (optimizedData: {
    seoTitle: string;
    seoDescription: string;
    seoKeywords: string[];
    suggestedTags: string[];
  }) => void;
}

const SEOAnalyzer: React.FC<SEOAnalyzerProps> = ({ 
  title, 
  content, 
  category, 
  onClose, 
  onOptimize 
}) => {
  const [analysis, setAnalysis] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (title && content) {
      analyzeSEO();
    }
  }, [title, content, category]);

  const analyzeSEO = async () => {
    setLoading(true);
    try {
      const result = await geminiService.optimizeSEO(title, content, category);
      setAnalysis(result);
    } catch (error) {
      console.error('SEO analysis failed:', error);
      // Provide fallback analysis
      setAnalysis({
        seoTitle: title,
        seoDescription: content.substring(0, 160),
        seoKeywords: [category.toLowerCase(), 'news', 'politics'],
        suggestedTags: [category.toLowerCase()],
        readabilityScore: 75,
        suggestions: [
          'Add more specific keywords',
          'Improve meta description',
          'Include internal links'
        ]
      });
    } finally {
      setLoading(false);
    }
  };

  const getSEOScore = () => {
    if (!analysis) return 0;
    
    let score = 0;
    
    // Title optimization (20 points)
    if (title.length >= 50 && title.length <= 60) score += 20;
    else if (title.length >= 40 && title.length <= 70) score += 15;
    else score += 10;
    
    // Content length (20 points)
    const wordCount = content.split(/\s+/).length;
    if (wordCount >= 1500) score += 20;
    else if (wordCount >= 1000) score += 15;
    else if (wordCount >= 500) score += 10;
    else score += 5;
    
    // Keywords presence (20 points)
    const keywordCount = analysis.seoKeywords?.length || 0;
    if (keywordCount >= 5) score += 20;
    else if (keywordCount >= 3) score += 15;
    else score += 10;
    
    // Meta description (20 points)
    if (analysis.seoDescription?.length >= 150 && analysis.seoDescription?.length <= 160) score += 20;
    else if (analysis.seoDescription?.length >= 120) score += 15;
    else score += 10;
    
    // Readability (20 points)
    score += Math.min(20, (analysis.readabilityScore || 75) / 5);
    
    return Math.round(score);
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-400';
    if (score >= 60) return 'text-yellow-400';
    return 'text-red-400';
  };

  const getScoreBackground = (score: number) => {
    if (score >= 80) return 'bg-green-500';
    if (score >= 60) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  if (loading) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
        <div className="bg-gray-800 rounded-lg p-8 max-w-md w-full text-center">
          <Loader className="w-12 h-12 text-blue-400 mx-auto mb-4 animate-spin" />
          <h2 className="text-xl font-bold text-white mb-2">Analyzing SEO</h2>
          <p className="text-gray-400">AI is analyzing your content for SEO optimization...</p>
        </div>
      </div>
    );
  }

  const seoScore = getSEOScore();

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-gray-800 rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-3">
              <Target className="w-8 h-8 text-blue-400" />
              <div>
                <h2 className="text-2xl font-bold text-white">SEO Analysis</h2>
                <p className="text-gray-400">AI-powered content optimization</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-white text-xl"
            >
              ✕
            </button>
          </div>

          {analysis && (
            <div className="space-y-6">
              {/* SEO Score */}
              <div className="bg-gray-700 rounded-lg p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-white">Overall SEO Score</h3>
                  <span className={`text-2xl font-bold ${getScoreColor(seoScore)}`}>
                    {seoScore}/100
                  </span>
                </div>
                <div className="w-full bg-gray-600 rounded-full h-3">
                  <div 
                    className={`h-3 rounded-full ${getScoreBackground(seoScore)}`}
                    style={{ width: `${seoScore}%` }}
                  ></div>
                </div>
                <p className="text-gray-400 text-sm mt-2">
                  {seoScore >= 80 ? 'Excellent SEO optimization!' : 
                   seoScore >= 60 ? 'Good SEO with room for improvement' : 
                   'Needs significant SEO improvements'}
                </p>
              </div>

              {/* Optimized Content */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-gray-700 rounded-lg p-4">
                  <h3 className="font-semibold text-white mb-3 flex items-center space-x-2">
                    <Search className="w-4 h-4" />
                    <span>Optimized SEO Title</span>
                  </h3>
                  <p className="text-gray-300 text-sm mb-2">{analysis.seoTitle}</p>
                  <div className="text-xs text-gray-400">
                    Length: {analysis.seoTitle?.length || 0}/60 characters
                  </div>
                </div>

                <div className="bg-gray-700 rounded-lg p-4">
                  <h3 className="font-semibold text-white mb-3">Meta Description</h3>
                  <p className="text-gray-300 text-sm mb-2">{analysis.seoDescription}</p>
                  <div className="text-xs text-gray-400">
                    Length: {analysis.seoDescription?.length || 0}/160 characters
                  </div>
                </div>
              </div>

              {/* Keywords */}
              <div className="bg-gray-700 rounded-lg p-4">
                <h3 className="font-semibold text-white mb-3 flex items-center space-x-2">
                  <TrendingUp className="w-4 h-4" />
                  <span>Optimized Keywords</span>
                </h3>
                <div className="flex flex-wrap gap-2">
                  {(analysis.seoKeywords || []).map((keyword: string, index: number) => (
                    <span key={index} className="bg-blue-600 text-white px-3 py-1 rounded-full text-sm">
                      {keyword}
                    </span>
                  ))}
                </div>
              </div>

              {/* Suggested Tags */}
              <div className="bg-gray-700 rounded-lg p-4">
                <h3 className="font-semibold text-white mb-3">Suggested Tags</h3>
                <div className="flex flex-wrap gap-2">
                  {(analysis.suggestedTags || []).map((tag: string, index: number) => (
                    <span key={index} className="bg-gray-600 text-gray-300 px-3 py-1 rounded-full text-sm">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>

              {/* SEO Suggestions */}
              <div className="bg-gray-700 rounded-lg p-4">
                <h3 className="font-semibold text-white mb-3 flex items-center space-x-2">
                  <AlertTriangle className="w-4 h-4" />
                  <span>Improvement Suggestions</span>
                </h3>
                <ul className="space-y-2">
                  {(analysis.suggestions || []).map((suggestion: string, index: number) => (
                    <li key={index} className="text-gray-300 text-sm flex items-start space-x-2">
                      <CheckCircle className="w-4 h-4 text-green-400 mt-0.5 flex-shrink-0" />
                      <span>{suggestion}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Content Analysis */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-gray-700 rounded-lg p-4 text-center">
                  <div className="text-2xl font-bold text-white mb-1">
                    {content.split(/\s+/).length}
                  </div>
                  <div className="text-gray-400 text-sm">Words</div>
                </div>
                <div className="bg-gray-700 rounded-lg p-4 text-center">
                  <div className="text-2xl font-bold text-white mb-1">
                    {analysis.readabilityScore || 75}%
                  </div>
                  <div className="text-gray-400 text-sm">Readability</div>
                </div>
                <div className="bg-gray-700 rounded-lg p-4 text-center">
                  <div className="text-2xl font-bold text-white mb-1">
                    {Math.ceil(content.split(/\s+/).length / 200)}
                  </div>
                  <div className="text-gray-400 text-sm">Min Read</div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex justify-end space-x-4">
                <button
                  onClick={onClose}
                  className="bg-gray-700 hover:bg-gray-600 px-6 py-2 rounded"
                >
                  Close
                </button>
                <button
                  onClick={() => onOptimize(analysis)}
                  className="bg-blue-600 hover:bg-blue-700 px-6 py-2 rounded flex items-center space-x-2"
                >
                  <Target className="w-4 h-4" />
                  <span>Apply Optimizations</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SEOAnalyzer;