import React, { useState } from 'react';
import { geminiService } from '../services/geminiService';
import { ImageService } from '../services/imageService';
import { Sparkles, Search, Image, Target, CheckCircle, AlertCircle, Loader } from 'lucide-react';

interface AIContentGeneratorProps {
  onContentGenerated: (content: {
    title: string;
    summary: string;
    content: string;
    image: string;
    category: string;
    tags: string[];
    seoTitle: string;
    seoDescription: string;
    seoKeywords: string[];
  }) => void;
  onClose: () => void;
}

const AIContentGenerator: React.FC<AIContentGeneratorProps> = ({ onContentGenerated, onClose }) => {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    topic: '',
    category: 'Politics',
    keywords: '',
    tone: 'professional',
    length: 'medium'
  });
  const [research, setResearch] = useState<any>(null);
  const [generatedContent, setGeneratedContent] = useState<any>(null);
  const [selectedImage, setSelectedImage] = useState('');
  const [topicImages, setTopicImages] = useState<string[]>([]);

  const categories = ['Politics', 'World', 'Opinion', 'Economy', 'Culture', 'Science', 'Security'];
  const tones = [
    { value: 'professional', label: 'Professional & Authoritative' },
    { value: 'analytical', label: 'Analytical & In-depth' },
    { value: 'breaking', label: 'Breaking News Style' },
    { value: 'investigative', label: 'Investigative Reporting' }
  ];
  const lengths = [
    { value: 'short', label: 'Short (800-1200 words)' },
    { value: 'medium', label: 'Medium (1500-2000 words)' },
    { value: 'long', label: 'Long (2500-3500 words)' }
  ];

  // Helper function to extract string value from object or return the value as-is
  const extractStringValue = (item: any): string => {
    if (typeof item === 'string') {
      return item;
    }
    if (typeof item === 'object' && item !== null) {
      // If it's an object, get the first value
      const values = Object.values(item);
      return values.length > 0 ? String(values[0]) : '';
    }
    return String(item);
  };

  const handleResearch = async () => {
    if (!formData.topic.trim()) {
      alert('Please enter a topic to research');
      return;
    }

    setLoading(true);
    try {
      const researchData = await geminiService.researchTopic(formData.topic);
      setResearch(researchData);
      setStep(2);
    } catch (error) {
      console.error('Research failed:', error);
      alert('Failed to research topic. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleGenerate = async () => {
    setLoading(true);
    try {
      const keywords = formData.keywords.split(',').map(k => k.trim()).filter(k => k);
      const content = await geminiService.generateArticle(formData.topic, formData.category, keywords);
      
      // Generate topic-specific images using AI
      const imageQueries = await geminiService.generateImageSuggestions(formData.topic, formData.category);
      const relevantImages = ImageService.getImagesForQueries(imageQueries);
      setTopicImages(relevantImages);
      setSelectedImage(relevantImages[0] || ImageService.getRandomImageForCategory(formData.category));
      
      setGeneratedContent(content);
      setStep(3);
    } catch (error) {
      console.error('Content generation failed:', error);
      alert('Failed to generate content. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleOptimize = async () => {
    if (!generatedContent) return;

    setLoading(true);
    try {
      const optimization = await geminiService.optimizeSEO(
        generatedContent.title,
        generatedContent.content,
        formData.category
      );
      
      setGeneratedContent({
        ...generatedContent,
        ...optimization
      });
      setStep(4);
    } catch (error) {
      console.error('SEO optimization failed:', error);
      alert('Failed to optimize SEO. Proceeding with current content.');
      setStep(4);
    } finally {
      setLoading(false);
    }
  };

  const handlePublish = () => {
    if (!generatedContent) return;

    onContentGenerated({
      title: generatedContent.title,
      summary: generatedContent.summary,
      content: generatedContent.content,
      image: selectedImage,
      category: formData.category,
      tags: generatedContent.suggestedTags || [],
      seoTitle: generatedContent.seoTitle,
      seoDescription: generatedContent.seoDescription,
      seoKeywords: generatedContent.seoKeywords || []
    });
  };

  const renderStep1 = () => (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <Sparkles className="w-12 h-12 text-red-400 mx-auto mb-4" />
        <h2 className="text-2xl font-bold text-white mb-2">AI Content Generator</h2>
        <p className="text-gray-400">Create EEAT-optimized articles with advanced AI research</p>
      </div>

      <div>
        <label className="block text-sm font-medium mb-2">Article Topic *</label>
        <input
          type="text"
          value={formData.topic}
          onChange={(e) => setFormData({...formData, topic: e.target.value})}
          className="w-full bg-gray-700 border border-gray-600 rounded px-3 py-2 focus:outline-none focus:border-red-600"
          placeholder="e.g., Iran-Israel conflict latest developments, Federal Reserve interest rate decision"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-2">Category</label>
          <select
            value={formData.category}
            onChange={(e) => setFormData({...formData, category: e.target.value})}
            className="w-full bg-gray-700 border border-gray-600 rounded px-3 py-2 focus:outline-none focus:border-red-600"
          >
            {categories.map(cat => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Article Length</label>
          <select
            value={formData.length}
            onChange={(e) => setFormData({...formData, length: e.target.value})}
            className="w-full bg-gray-700 border border-gray-600 rounded px-3 py-2 focus:outline-none focus:border-red-600"
          >
            {lengths.map(length => (
              <option key={length.value} value={length.value}>{length.label}</option>
            ))}
          </select>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium mb-2">Writing Tone</label>
        <select
          value={formData.tone}
          onChange={(e) => setFormData({...formData, tone: e.target.value})}
          className="w-full bg-gray-700 border border-gray-600 rounded px-3 py-2 focus:outline-none focus:border-red-600"
        >
          {tones.map(tone => (
            <option key={tone.value} value={tone.value}>{tone.label}</option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium mb-2">Target Keywords (optional)</label>
        <input
          type="text"
          value={formData.keywords}
          onChange={(e) => setFormData({...formData, keywords: e.target.value})}
          className="w-full bg-gray-700 border border-gray-600 rounded px-3 py-2 focus:outline-none focus:border-red-600"
          placeholder="iran israel, middle east conflict, international relations"
        />
        <p className="text-xs text-gray-400 mt-1">Separate keywords with commas</p>
      </div>

      <div className="flex justify-end space-x-4">
        <button
          onClick={onClose}
          className="bg-gray-700 hover:bg-gray-600 px-6 py-2 rounded"
        >
          Cancel
        </button>
        <button
          onClick={handleResearch}
          disabled={loading || !formData.topic.trim()}
          className="bg-red-600 hover:bg-red-700 disabled:bg-red-800 px-6 py-2 rounded flex items-center space-x-2"
        >
          {loading ? <Loader className="w-4 h-4 animate-spin" /> : <Search className="w-4 h-4" />}
          <span>{loading ? 'Researching...' : 'Research Topic'}</span>
        </button>
      </div>
    </div>
  );

  const renderStep2 = () => (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <Search className="w-12 h-12 text-green-400 mx-auto mb-4" />
        <h2 className="text-2xl font-bold text-white mb-2">Research Complete</h2>
        <p className="text-gray-400">AI has analyzed your topic and gathered key insights</p>
      </div>

      {research && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-gray-700 rounded-lg p-4">
            <h3 className="font-semibold text-white mb-3">Key Points</h3>
            <ul className="space-y-2">
              {(research.keyPoints || []).map((point: any, index: number) => (
                <li key={index} className="text-gray-300 text-sm flex items-start space-x-2">
                  <CheckCircle className="w-4 h-4 text-green-400 mt-0.5 flex-shrink-0" />
                  <span>{extractStringValue(point)}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="bg-gray-700 rounded-lg p-4">
            <h3 className="font-semibold text-white mb-3">Expert Sources</h3>
            <ul className="space-y-2">
              {(research.expertSources || []).map((source: any, index: number) => (
                <li key={index} className="text-gray-300 text-sm flex items-start space-x-2">
                  <Target className="w-4 h-4 text-blue-400 mt-0.5 flex-shrink-0" />
                  <span>{extractStringValue(source)}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="bg-gray-700 rounded-lg p-4">
            <h3 className="font-semibold text-white mb-3">Trending Angles</h3>
            <ul className="space-y-2">
              {(research.trendingAngles || []).map((angle: any, index: number) => (
                <li key={index} className="text-gray-300 text-sm flex items-start space-x-2">
                  <Sparkles className="w-4 h-4 text-yellow-400 mt-0.5 flex-shrink-0" />
                  <span>{extractStringValue(angle)}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="bg-gray-700 rounded-lg p-4">
            <h3 className="font-semibold text-white mb-3">Fact Check Points</h3>
            <ul className="space-y-2">
              {(research.factCheckPoints || []).map((point: any, index: number) => (
                <li key={index} className="text-gray-300 text-sm flex items-start space-x-2">
                  <AlertCircle className="w-4 h-4 text-orange-400 mt-0.5 flex-shrink-0" />
                  <span>{extractStringValue(point)}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}

      <div className="flex justify-end space-x-4">
        <button
          onClick={() => setStep(1)}
          className="bg-gray-700 hover:bg-gray-600 px-6 py-2 rounded"
        >
          Back
        </button>
        <button
          onClick={handleGenerate}
          disabled={loading}
          className="bg-red-600 hover:bg-red-700 disabled:bg-red-800 px-6 py-2 rounded flex items-center space-x-2"
        >
          {loading ? <Loader className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
          <span>{loading ? 'Generating...' : 'Generate Article'}</span>
        </button>
      </div>
    </div>
  );

  const renderStep3 = () => (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <CheckCircle className="w-12 h-12 text-green-400 mx-auto mb-4" />
        <h2 className="text-2xl font-bold text-white mb-2">Content Generated</h2>
        <p className="text-gray-400">Review and select images for your article</p>
      </div>

      {generatedContent && (
        <div className="space-y-6">
          <div className="bg-gray-700 rounded-lg p-4">
            <h3 className="font-semibold text-white mb-2">Generated Title</h3>
            <p className="text-gray-300">{generatedContent.title}</p>
          </div>

          <div className="bg-gray-700 rounded-lg p-4">
            <h3 className="font-semibold text-white mb-2">Summary</h3>
            <p className="text-gray-300">{generatedContent.summary}</p>
          </div>

          <div className="bg-gray-700 rounded-lg p-4">
            <h3 className="font-semibold text-white mb-3 flex items-center space-x-2">
              <Image className="w-4 h-4" />
              <span>Select Featured Image</span>
              <span className="text-xs bg-blue-600 px-2 py-1 rounded">AI-Curated for "{formData.topic}"</span>
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {topicImages.map((imageUrl, index) => (
                <div
                  key={index}
                  className={`cursor-pointer rounded-lg overflow-hidden border-2 transition-colors ${
                    selectedImage === imageUrl ? 'border-red-600' : 'border-gray-600 hover:border-gray-500'
                  }`}
                  onClick={() => setSelectedImage(imageUrl)}
                >
                  <img
                    src={imageUrl}
                    alt={`AI-suggested image ${index + 1} for ${formData.topic}`}
                    className="w-full h-24 object-cover"
                  />
                </div>
              ))}
            </div>
            <p className="text-xs text-gray-400 mt-2">
              Images are AI-curated based on your topic: "{formData.topic}"
            </p>
          </div>

          <div className="bg-gray-700 rounded-lg p-4">
            <h3 className="font-semibold text-white mb-2">Content Preview</h3>
            <div className="text-gray-300 text-sm max-h-40 overflow-y-auto">
              {generatedContent.content.substring(0, 500)}...
            </div>
          </div>
        </div>
      )}

      <div className="flex justify-end space-x-4">
        <button
          onClick={() => setStep(2)}
          className="bg-gray-700 hover:bg-gray-600 px-6 py-2 rounded"
        >
          Back
        </button>
        <button
          onClick={handleOptimize}
          disabled={loading}
          className="bg-blue-600 hover:bg-blue-700 disabled:bg-blue-800 px-6 py-2 rounded flex items-center space-x-2"
        >
          {loading ? <Loader className="w-4 h-4 animate-spin" /> : <Target className="w-4 h-4" />}
          <span>{loading ? 'Optimizing...' : 'Optimize SEO'}</span>
        </button>
      </div>
    </div>
  );

  const renderStep4 = () => (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <Target className="w-12 h-12 text-blue-400 mx-auto mb-4" />
        <h2 className="text-2xl font-bold text-white mb-2">SEO Optimized</h2>
        <p className="text-gray-400">Your article is ready for publication</p>
      </div>

      {generatedContent && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-gray-700 rounded-lg p-4">
              <h3 className="font-semibold text-white mb-2">SEO Score</h3>
              <div className="flex items-center space-x-2">
                <div className="flex-1 bg-gray-600 rounded-full h-2">
                  <div 
                    className="bg-green-500 h-2 rounded-full" 
                    style={{ width: `${generatedContent.readabilityScore || 85}%` }}
                  ></div>
                </div>
                <span className="text-green-400 font-semibold">{generatedContent.readabilityScore || 85}/100</span>
              </div>
            </div>

            <div className="bg-gray-700 rounded-lg p-4">
              <h3 className="font-semibold text-white mb-2">Keywords</h3>
              <div className="flex flex-wrap gap-2">
                {(generatedContent.seoKeywords || []).slice(0, 5).map((keyword: string, index: number) => (
                  <span key={index} className="bg-red-600 text-white px-2 py-1 rounded text-xs">
                    {keyword}
                  </span>
                ))}
              </div>
            </div>
          </div>

          <div className="bg-gray-700 rounded-lg p-4">
            <h3 className="font-semibold text-white mb-2">SEO Title</h3>
            <p className="text-gray-300">{generatedContent.seoTitle}</p>
          </div>

          <div className="bg-gray-700 rounded-lg p-4">
            <h3 className="font-semibold text-white mb-2">Meta Description</h3>
            <p className="text-gray-300">{generatedContent.seoDescription}</p>
          </div>

          {generatedContent.suggestions && (
            <div className="bg-gray-700 rounded-lg p-4">
              <h3 className="font-semibold text-white mb-2">SEO Suggestions</h3>
              <ul className="space-y-1">
                {generatedContent.suggestions.map((suggestion: string, index: number) => (
                  <li key={index} className="text-gray-300 text-sm flex items-start space-x-2">
                    <CheckCircle className="w-4 h-4 text-green-400 mt-0.5 flex-shrink-0" />
                    <span>{suggestion}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}

      <div className="flex justify-end space-x-4">
        <button
          onClick={() => setStep(3)}
          className="bg-gray-700 hover:bg-gray-600 px-6 py-2 rounded"
        >
          Back
        </button>
        <button
          onClick={handlePublish}
          className="bg-green-600 hover:bg-green-700 px-6 py-2 rounded flex items-center space-x-2"
        >
          <CheckCircle className="w-4 h-4" />
          <span>Publish Article</span>
        </button>
      </div>
    </div>
  );

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-gray-800 rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          {/* Progress Bar */}
          <div className="mb-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-gray-400">Step {step} of 4</span>
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-white"
              >
                ✕
              </button>
            </div>
            <div className="w-full bg-gray-700 rounded-full h-2">
              <div 
                className="bg-red-600 h-2 rounded-full transition-all duration-300" 
                style={{ width: `${(step / 4) * 100}%` }}
              ></div>
            </div>
          </div>

          {/* Step Content */}
          {step === 1 && renderStep1()}
          {step === 2 && renderStep2()}
          {step === 3 && renderStep3()}
          {step === 4 && renderStep4()}
        </div>
      </div>
    </div>
  );
};

export default AIContentGenerator;