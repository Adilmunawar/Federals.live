/*
  # Create articles table for Federals.live CMS

  1. New Tables
    - `articles`
      - `id` (uuid, primary key)
      - `title` (text, required)
      - `summary` (text)
      - `content` (text, required)
      - `image` (text)
      - `category` (text, required)
      - `author` (text, required)
      - `read_time` (text)
      - `publish_date` (timestamptz)
      - `slug` (text, unique)
      - `tags` (text array)
      - `featured` (boolean, default false)
      - `breaking` (boolean, default false)
      - `seo_title` (text)
      - `seo_description` (text)
      - `seo_keywords` (text array)
      - `status` (text, default 'published')
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)

  2. Security
    - Enable RLS on `articles` table
    - Add policies for public read access
    - Add policies for authenticated admin access
*/

CREATE TABLE IF NOT EXISTS articles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  summary text DEFAULT '',
  content text NOT NULL,
  image text DEFAULT '',
  category text NOT NULL DEFAULT 'Politics',
  author text NOT NULL DEFAULT 'Editorial Team',
  read_time text DEFAULT '5 min read',
  publish_date timestamptz DEFAULT now(),
  slug text UNIQUE NOT NULL,
  tags text[] DEFAULT '{}',
  featured boolean DEFAULT false,
  breaking boolean DEFAULT false,
  seo_title text DEFAULT '',
  seo_description text DEFAULT '',
  seo_keywords text[] DEFAULT '{}',
  status text DEFAULT 'published',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE articles ENABLE ROW LEVEL SECURITY;

-- Policy for public read access to published articles
CREATE POLICY "Public can read published articles"
  ON articles
  FOR SELECT
  TO anon, authenticated
  USING (status = 'published');

-- Policy for authenticated users to manage all articles
CREATE POLICY "Authenticated users can manage articles"
  ON articles
  FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_articles_slug ON articles(slug);
CREATE INDEX IF NOT EXISTS idx_articles_category ON articles(category);
CREATE INDEX IF NOT EXISTS idx_articles_featured ON articles(featured);
CREATE INDEX IF NOT EXISTS idx_articles_breaking ON articles(breaking);
CREATE INDEX IF NOT EXISTS idx_articles_publish_date ON articles(publish_date DESC);
CREATE INDEX IF NOT EXISTS idx_articles_status ON articles(status);

-- Function to automatically update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Trigger to automatically update updated_at
CREATE TRIGGER update_articles_updated_at
  BEFORE UPDATE ON articles
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();