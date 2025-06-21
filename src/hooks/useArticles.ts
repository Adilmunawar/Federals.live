import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { Article } from '../types/Article';

export function useArticles() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchArticles = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('articles')
        .select('*')
        .eq('status', 'published')
        .order('publish_date', { ascending: false });

      if (error) throw error;

      const formattedArticles: Article[] = data.map(article => ({
        id: article.id,
        title: article.title,
        summary: article.summary,
        content: article.content,
        image: article.image,
        category: article.category,
        author: article.author,
        readTime: article.read_time,
        publishDate: article.publish_date,
        slug: article.slug,
        tags: article.tags,
        featured: article.featured,
        breaking: article.breaking,
        seoTitle: article.seo_title,
        seoDescription: article.seo_description,
        seoKeywords: article.seo_keywords,
      }));

      setArticles(formattedArticles);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchArticles();
  }, []);

  const getArticleBySlug = async (slug: string): Promise<Article | null> => {
    try {
      const { data, error } = await supabase
        .from('articles')
        .select('*')
        .eq('slug', slug)
        .eq('status', 'published')
        .single();

      if (error) throw error;

      return {
        id: data.id,
        title: data.title,
        summary: data.summary,
        content: data.content,
        image: data.image,
        category: data.category,
        author: data.author,
        readTime: data.read_time,
        publishDate: data.publish_date,
        slug: data.slug,
        tags: data.tags,
        featured: data.featured,
        breaking: data.breaking,
        seoTitle: data.seo_title,
        seoDescription: data.seo_description,
        seoKeywords: data.seo_keywords,
      };
    } catch (err) {
      console.error('Error fetching article:', err);
      return null;
    }
  };

  const getFeaturedArticles = () => {
    return articles.filter(article => article.featured);
  };

  const getBreakingNews = () => {
    return articles.filter(article => article.breaking);
  };

  const getArticlesByCategory = (category: string) => {
    return articles.filter(article => 
      article.category.toLowerCase() === category.toLowerCase()
    );
  };

  return {
    articles,
    loading,
    error,
    fetchArticles,
    getArticleBySlug,
    getFeaturedArticles,
    getBreakingNews,
    getArticlesByCategory,
  };
}