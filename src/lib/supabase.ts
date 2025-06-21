import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Database types
export interface Database {
  public: {
    Tables: {
      articles: {
        Row: {
          id: string;
          title: string;
          summary: string;
          content: string;
          image: string;
          category: string;
          author: string;
          read_time: string;
          publish_date: string;
          slug: string;
          tags: string[];
          featured: boolean;
          breaking: boolean;
          seo_title: string;
          seo_description: string;
          seo_keywords: string[];
          status: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          title: string;
          summary?: string;
          content: string;
          image?: string;
          category?: string;
          author?: string;
          read_time?: string;
          publish_date?: string;
          slug: string;
          tags?: string[];
          featured?: boolean;
          breaking?: boolean;
          seo_title?: string;
          seo_description?: string;
          seo_keywords?: string[];
          status?: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          title?: string;
          summary?: string;
          content?: string;
          image?: string;
          category?: string;
          author?: string;
          read_time?: string;
          publish_date?: string;
          slug?: string;
          tags?: string[];
          featured?: boolean;
          breaking?: boolean;
          seo_title?: string;
          seo_description?: string;
          seo_keywords?: string[];
          status?: string;
          created_at?: string;
          updated_at?: string;
        };
      };
      admin_users: {
        Row: {
          id: string;
          email: string;
          full_name: string;
          role: string;
          is_active: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          email: string;
          full_name?: string;
          role?: string;
          is_active?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          email?: string;
          full_name?: string;
          role?: string;
          is_active?: boolean;
          created_at?: string;
          updated_at?: string;
        };
      };
    };
  };
}