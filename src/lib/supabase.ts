import { createClient } from '@supabase/supabase-js';

// Environment variables with fallbacks for development
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

// Check if we're in development and provide helpful error messages
if (!supabaseUrl || !supabaseAnonKey) {
  if (import.meta.env.DEV) {
    console.warn('⚠️ Supabase environment variables not found. Please check your .env file.');
    console.warn('Required variables: VITE_SUPABASE_URL, VITE_SUPABASE_ANON_KEY');
  }
}

// Create a mock client for development if env vars are missing
const createMockClient = () => ({
  from: () => ({
    select: () => Promise.resolve({ data: [], error: null }),
    insert: () => Promise.resolve({ data: null, error: null }),
    update: () => Promise.resolve({ data: null, error: null }),
    delete: () => Promise.resolve({ data: null, error: null }),
    eq: function() { return this; },
    order: function() { return this; },
    single: () => Promise.resolve({ data: null, error: new Error('No Supabase connection') })
  }),
  auth: {
    getSession: () => Promise.resolve({ data: { session: null }, error: null }),
    onAuthStateChange: () => ({ data: { subscription: { unsubscribe: () => {} } } }),
    signInWithPassword: () => Promise.resolve({ data: null, error: new Error('No Supabase connection') }),
    signUp: () => Promise.resolve({ data: null, error: new Error('No Supabase connection') }),
    signOut: () => Promise.resolve({ error: null })
  }
});

export const supabase = (supabaseUrl && supabaseAnonKey) 
  ? createClient(supabaseUrl, supabaseAnonKey)
  : createMockClient();

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