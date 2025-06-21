import React, { useState, useEffect } from 'react';
import { Article } from '../types/Article';
import { ArticleManager } from '../utils/articleManager';
import { Save, Trash2, Eye, Plus, Edit3 } from 'lucide-react';

const AdminPanel = () => {
  const [articles, setArticles] = useState<Article[]>([]);
  const [editingArticle, setEditingArticle] = useState<Article | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [formData, setFormData] = useState<Partial<Article>>({
    title: '',
    summary: '',
    content: '',
    image: '',
    category: 'Politics',
    author: 'Editorial Team',
    tags: [],
    featured: false,
    breaking: false,
    seoTitle: '',
    seoDescription: '',
    seoKeywords: []
  });

  useEffect(() => {
    loadArticles();
  }, []);

  const loadArticles = () => {
    setArticles(ArticleManager.getAllArticles());
  };

  const handleSave = () => {
    if (!formData.title || !formData.content) {
      alert('Title and content are required');
      return;
    }

    const article: Article = {
      id: editingArticle?.id || Date.now().toString(),
      title: formData.title!,
      summary: formData.summary!,
      content: formData.content!,
      image: formData.image!,
      category: formData.category!,
      author: formData.author!,
      readTime: calculateReadTime(formData.content!),
      publishDate: editingArticle?.publishDate || new Date().toISOString(),
      slug: ArticleManager.generateSlug(formData.title!),
      tags: formData.tags!,
      featured: formData.featured!,
      breaking: formData.breaking!,
      seoTitle: formData.seoTitle,
      seoDescription: formData.seoDescription,
      seoKeywords: formData.seoKeywords
    };

    ArticleManager.saveArticle(article);
    loadArticles();
    resetForm();
  };

  const handleEdit = (article: Article) => {
    setEditingArticle(article);
    setFormData(article);
    setIsCreating(true);
  };

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this article?')) {
      ArticleManager.deleteArticle(id);
      loadArticles();
    }
  };

  const resetForm = () => {
    setEditingArticle(null);
    setIsCreating(false);
    setFormData({
      title: '',
      summary: '',
      content: '',
      image: '',
      category: 'Politics',
      author: 'Editorial Team',
      tags: [],
      featured: false,
      breaking: false,
      seoTitle: '',
      seoDescription: '',
      seoKeywords: []
    });
  };

  const calculateReadTime = (content: string): string => {
    const wordsPerMinute = 200;
    const wordCount = content.split(/\s+/).length;
    const minutes = Math.ceil(wordCount / wordsPerMinute);
    return `${minutes} min read`;
  };

  const categories = ['Politics', 'World', 'Opinion', 'Economy', 'Culture', 'Science', 'Security'];

  if (isCreating) {
    return (
      <div className="min-h-screen bg-gray-900 text-white p-6">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <h1 className="text-3xl font-bold">
              {editingArticle ? 'Edit Article' : 'Create New Article'}
            </h1>
            <button
              onClick={resetForm}
              className="bg-gray-700 hover:bg-gray-600 px-4 py-2 rounded"
            >
              Cancel
            </button>
          </div>

          <div className="bg-gray-800 rounded-lg p-6 space-y-6">
            {/* Basic Info */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">Title *</label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({...formData, title: e.target.value})}
                  className="w-full bg-gray-700 border border-gray-600 rounded px-3 py-2 focus:outline-none focus:border-red-600"
                  placeholder="Article title"
                />
              </div>
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
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Summary</label>
              <textarea
                value={formData.summary}
                onChange={(e) => setFormData({...formData, summary: e.target.value})}
                className="w-full bg-gray-700 border border-gray-600 rounded px-3 py-2 h-20 focus:outline-none focus:border-red-600"
                placeholder="Brief article summary"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Featured Image URL</label>
              <input
                type="url"
                value={formData.image}
                onChange={(e) => setFormData({...formData, image: e.target.value})}
                className="w-full bg-gray-700 border border-gray-600 rounded px-3 py-2 focus:outline-none focus:border-red-600"
                placeholder="https://example.com/image.jpg"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Content * (Markdown supported)</label>
              <textarea
                value={formData.content}
                onChange={(e) => setFormData({...formData, content: e.target.value})}
                className="w-full bg-gray-700 border border-gray-600 rounded px-3 py-2 h-64 focus:outline-none focus:border-red-600 font-mono text-sm"
                placeholder="Write your article content here using Markdown..."
              />
            </div>

            {/* Flags */}
            <div className="flex space-x-6">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={formData.featured}
                  onChange={(e) => setFormData({...formData, featured: e.target.checked})}
                  className="mr-2"
                />
                Featured Article
              </label>
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={formData.breaking}
                  onChange={(e) => setFormData({...formData, breaking: e.target.checked})}
                  className="mr-2"
                />
                Breaking News
              </label>
            </div>

            {/* SEO Section */}
            <div className="border-t border-gray-700 pt-6">
              <h3 className="text-lg font-semibold mb-4">SEO Settings</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">SEO Title</label>
                  <input
                    type="text"
                    value={formData.seoTitle}
                    onChange={(e) => setFormData({...formData, seoTitle: e.target.value})}
                    className="w-full bg-gray-700 border border-gray-600 rounded px-3 py-2 focus:outline-none focus:border-red-600"
                    placeholder="SEO optimized title"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">SEO Description</label>
                  <textarea
                    value={formData.seoDescription}
                    onChange={(e) => setFormData({...formData, seoDescription: e.target.value})}
                    className="w-full bg-gray-700 border border-gray-600 rounded px-3 py-2 h-16 focus:outline-none focus:border-red-600"
                    placeholder="Meta description for search engines"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Tags (comma separated)</label>
                  <input
                    type="text"
                    value={formData.tags?.join(', ')}
                    onChange={(e) => setFormData({...formData, tags: e.target.value.split(',').map(tag => tag.trim())})}
                    className="w-full bg-gray-700 border border-gray-600 rounded px-3 py-2 focus:outline-none focus:border-red-600"
                    placeholder="politics, congress, budget"
                  />
                </div>
              </div>
            </div>

            <div className="flex justify-end space-x-4">
              <button
                onClick={resetForm}
                className="bg-gray-700 hover:bg-gray-600 px-6 py-2 rounded"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                className="bg-red-600 hover:bg-red-700 px-6 py-2 rounded flex items-center space-x-2"
              >
                <Save className="w-4 h-4" />
                <span>Save Article</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white p-6">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold">Content Management</h1>
          <button
            onClick={() => setIsCreating(true)}
            className="bg-red-600 hover:bg-red-700 px-6 py-2 rounded flex items-center space-x-2"
          >
            <Plus className="w-4 h-4" />
            <span>New Article</span>
          </button>
        </div>

        <div className="bg-gray-800 rounded-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-700">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                    Article
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                    Category
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                    Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-700">
                {articles.map((article) => (
                  <tr key={article.id} className="hover:bg-gray-750">
                    <td className="px-6 py-4">
                      <div className="flex items-center">
                        <img
                          src={article.image}
                          alt={article.title}
                          className="w-12 h-12 rounded object-cover mr-4"
                        />
                        <div>
                          <div className="text-sm font-medium text-white">
                            {article.title}
                          </div>
                          <div className="text-sm text-gray-400">
                            {article.readTime}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="px-2 py-1 text-xs font-semibold rounded bg-red-600 text-white">
                        {article.category}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex space-x-1">
                        {article.featured && (
                          <span className="px-2 py-1 text-xs font-semibold rounded bg-yellow-600 text-white">
                            Featured
                          </span>
                        )}
                        {article.breaking && (
                          <span className="px-2 py-1 text-xs font-semibold rounded bg-red-500 text-white">
                            Breaking
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-400">
                      {new Date(article.publishDate).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleEdit(article)}
                          className="text-blue-400 hover:text-blue-300"
                        >
                          <Edit3 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(article.id)}
                          className="text-red-400 hover:text-red-300"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminPanel;