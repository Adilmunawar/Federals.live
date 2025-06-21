import React, { useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
import { supabase } from '../lib/supabase';
import { Article } from '../types/Article';
import { Save, Trash2, Edit3, Plus, LogOut, Eye, Upload } from 'lucide-react';

const AdminPanel = () => {
  const { user, signOut } = useAuth();
  const [articles, setArticles] = useState<any[]>([]);
  const [editingArticle, setEditingArticle] = useState<any | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    summary: '',
    content: '',
    image: '',
    category: 'Politics',
    author: 'Editorial Team',
    tags: [] as string[],
    featured: false,
    breaking: false,
    seoTitle: '',
    seoDescription: '',
    seoKeywords: [] as string[],
    status: 'published'
  });

  useEffect(() => {
    loadArticles();
  }, []);

  const loadArticles = async () => {
    try {
      const { data, error } = await supabase
        .from('articles')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setArticles(data || []);
    } catch (err) {
      console.error('Error loading articles:', err);
    }
  };

  const generateSlug = (title: string): string => {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9 -]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim();
  };

  const calculateReadTime = (content: string): string => {
    const wordsPerMinute = 200;
    const wordCount = content.split(/\s+/).length;
    const minutes = Math.ceil(wordCount / wordsPerMinute);
    return `${minutes} min read`;
  };

  const handleSave = async () => {
    if (!formData.title || !formData.content) {
      alert('Title and content are required');
      return;
    }

    setLoading(true);
    try {
      const slug = generateSlug(formData.title);
      const readTime = calculateReadTime(formData.content);

      const articleData = {
        title: formData.title,
        summary: formData.summary,
        content: formData.content,
        image: formData.image,
        category: formData.category,
        author: formData.author,
        read_time: readTime,
        slug: slug,
        tags: formData.tags,
        featured: formData.featured,
        breaking: formData.breaking,
        seo_title: formData.seoTitle || formData.title,
        seo_description: formData.seoDescription || formData.summary,
        seo_keywords: formData.seoKeywords,
        status: formData.status,
      };

      if (editingArticle) {
        const { error } = await supabase
          .from('articles')
          .update(articleData)
          .eq('id', editingArticle.id);

        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('articles')
          .insert([articleData]);

        if (error) throw error;
      }

      await loadArticles();
      resetForm();
    } catch (err) {
      console.error('Error saving article:', err);
      alert('Error saving article. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (article: any) => {
    setEditingArticle(article);
    setFormData({
      title: article.title,
      summary: article.summary,
      content: article.content,
      image: article.image,
      category: article.category,
      author: article.author,
      tags: article.tags || [],
      featured: article.featured,
      breaking: article.breaking,
      seoTitle: article.seo_title,
      seoDescription: article.seo_description,
      seoKeywords: article.seo_keywords || [],
      status: article.status
    });
    setIsCreating(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this article?')) return;

    try {
      const { error } = await supabase
        .from('articles')
        .delete()
        .eq('id', id);

      if (error) throw error;
      await loadArticles();
    } catch (err) {
      console.error('Error deleting article:', err);
      alert('Error deleting article. Please try again.');
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
      seoKeywords: [],
      status: 'published'
    });
  };

  const handleSignOut = async () => {
    await signOut();
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
            <div className="flex space-x-4">
              <button
                onClick={resetForm}
                className="bg-gray-700 hover:bg-gray-600 px-4 py-2 rounded"
              >
                Cancel
              </button>
              <button
                onClick={handleSignOut}
                className="bg-red-700 hover:bg-red-800 px-4 py-2 rounded flex items-center space-x-2"
              >
                <LogOut className="w-4 h-4" />
                <span>Sign Out</span>
              </button>
            </div>
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

            {/* Flags and Status */}
            <div className="flex flex-wrap items-center space-x-6">
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
              <div>
                <label className="block text-sm font-medium mb-2">Status</label>
                <select
                  value={formData.status}
                  onChange={(e) => setFormData({...formData, status: e.target.value})}
                  className="bg-gray-700 border border-gray-600 rounded px-3 py-2 focus:outline-none focus:border-red-600"
                >
                  <option value="published">Published</option>
                  <option value="draft">Draft</option>
                </select>
              </div>
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
                    value={formData.tags.join(', ')}
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
                disabled={loading}
                className="bg-red-600 hover:bg-red-700 disabled:bg-red-800 px-6 py-2 rounded flex items-center space-x-2"
              >
                <Save className="w-4 h-4" />
                <span>{loading ? 'Saving...' : 'Save Article'}</span>
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
          <div>
            <h1 className="text-3xl font-bold">Content Management</h1>
            <p className="text-gray-400 mt-1">Welcome back, {user?.email}</p>
          </div>
          <div className="flex space-x-4">
            <button
              onClick={() => setIsCreating(true)}
              className="bg-red-600 hover:bg-red-700 px-6 py-2 rounded flex items-center space-x-2"
            >
              <Plus className="w-4 h-4" />
              <span>New Article</span>
            </button>
            <button
              onClick={handleSignOut}
              className="bg-gray-700 hover:bg-gray-600 px-4 py-2 rounded flex items-center space-x-2"
            >
              <LogOut className="w-4 h-4" />
              <span>Sign Out</span>
            </button>
          </div>
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
                        {article.image && (
                          <img
                            src={article.image}
                            alt={article.title}
                            className="w-12 h-12 rounded object-cover mr-4"
                          />
                        )}
                        <div>
                          <div className="text-sm font-medium text-white">
                            {article.title}
                          </div>
                          <div className="text-sm text-gray-400">
                            {article.read_time}
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
                        <span className={`px-2 py-1 text-xs font-semibold rounded ${
                          article.status === 'published' ? 'bg-green-600' : 'bg-yellow-600'
                        } text-white`}>
                          {article.status}
                        </span>
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
                      {new Date(article.created_at).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex space-x-2">
                        <button
                          onClick={() => window.open(`/article/${article.slug}`, '_blank')}
                          className="text-green-400 hover:text-green-300"
                          title="View Article"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleEdit(article)}
                          className="text-blue-400 hover:text-blue-300"
                          title="Edit Article"
                        >
                          <Edit3 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(article.id)}
                          className="text-red-400 hover:text-red-300"
                          title="Delete Article"
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

        {articles.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-400 mb-4">No articles found. Create your first article to get started!</p>
            <button
              onClick={() => setIsCreating(true)}
              className="bg-red-600 hover:bg-red-700 px-6 py-2 rounded"
            >
              Create First Article
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminPanel;