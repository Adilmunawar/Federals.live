export interface Article {
  id: string;
  title: string;
  summary: string;
  content: string;
  image: string;
  category: string;
  author: string;
  readTime: string;
  publishDate: string;
  slug: string;
  tags: string[];
  featured: boolean;
  breaking: boolean;
  seoTitle?: string;
  seoDescription?: string;
  seoKeywords?: string[];
}