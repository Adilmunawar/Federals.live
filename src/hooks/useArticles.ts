import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { Article } from '../types/Article';

// Fallback articles for when Supabase is not connected
const FALLBACK_ARTICLES: Article[] = [
  {
    id: '1',
    title: "Federal Budget Negotiations Enter Critical Phase as Deadline Approaches",
    summary: "Congressional leaders work around the clock to prevent government shutdown with just days remaining before fiscal year deadline.",
    content: `# Federal Budget Negotiations Enter Critical Phase

Congressional leaders are working around the clock to prevent a government shutdown as the fiscal year deadline rapidly approaches. With just days remaining, both parties are scrambling to reach a compromise on key spending priorities.

## Key Points of Contention

The negotiations have stalled over several critical issues:

- **Defense Spending**: Republicans push for increased military funding
- **Social Programs**: Democrats advocate for expanded social safety nets  
- **Infrastructure**: Bipartisan support exists but funding mechanisms remain disputed
- **Emergency Preparedness**: New allocations for disaster response and pandemic readiness

## Timeline and Implications

If no agreement is reached by the deadline, federal agencies will begin implementing shutdown procedures, affecting:

- National parks and museums
- Federal employee paychecks
- Government services and processing times
- Economic confidence and market stability

## What's Next

Leadership from both chambers will continue negotiations through the weekend, with a potential vote scheduled for early next week. The American people are watching closely as their elected representatives work to fulfill their most basic constitutional duty: funding the government.

This situation highlights the ongoing challenges in American governance and the need for bipartisan cooperation in addressing the nation's fiscal responsibilities.

## Expert Analysis

Political analysts suggest that this budget standoff reflects deeper ideological divisions within Congress. The outcome will likely set the tone for future legislative battles and could impact the upcoming election cycle.

## Public Response

Recent polling indicates that Americans are increasingly frustrated with congressional gridlock, with approval ratings for Congress remaining at historic lows. Citizens are calling for pragmatic solutions that prioritize essential government services.`,
    image: "https://images.pexels.com/photos/5692251/pexels-photo-5692251.jpeg?auto=compress&cs=tinysrgb&w=1200",
    category: "Politics",
    author: "Editorial Team",
    readTime: "4 min read",
    publishDate: new Date().toISOString(),
    slug: "federal-budget-negotiations-critical-phase",
    tags: ["Congress", "Budget", "Government", "Politics"],
    featured: true,
    breaking: true,
    seoTitle: "Federal Budget Negotiations: Government Shutdown Looms",
    seoDescription: "Congressional leaders race against time to prevent government shutdown as budget negotiations enter critical phase with key disagreements remaining.",
    seoKeywords: ["federal budget", "government shutdown", "congress", "negotiations", "politics"]
  },
  {
    id: '2',
    title: "International Summit Addresses Global Security Challenges",
    summary: "World leaders convene to discuss emerging threats and coordinate international response strategies.",
    content: `# International Summit Addresses Global Security Challenges

World leaders gathered today for a critical summit focused on addressing the evolving landscape of global security threats. The meeting brings together representatives from major powers to coordinate responses to emerging challenges.

## Key Discussion Points

The summit agenda includes several priority areas:

- **Cybersecurity Threats**: Coordinating responses to state-sponsored cyber attacks
- **Regional Conflicts**: Addressing ongoing tensions in various global hotspots
- **Economic Security**: Protecting critical supply chains and infrastructure
- **Climate Security**: Managing security implications of climate change

## International Cooperation

The discussions emphasize the need for multilateral approaches to modern security challenges, recognizing that no single nation can address these issues alone.

## Expected Outcomes

Participants aim to establish new frameworks for information sharing and coordinated response mechanisms to enhance global security cooperation.

## Regional Focus Areas

Special attention is being paid to several key regions:

### Middle East Stability
Ongoing conflicts and their broader implications for regional security continue to be a primary concern for international leaders.

### Asia-Pacific Tensions
Rising geopolitical tensions in the Asia-Pacific region require careful diplomatic management and multilateral engagement.

### European Security Architecture
The evolving security landscape in Europe necessitates updated frameworks for cooperation and collective defense.

## Technology and Security

The summit also addresses the intersection of emerging technologies and security challenges, including artificial intelligence, quantum computing, and space-based assets.`,
    image: "https://images.pexels.com/photos/7621047/pexels-photo-7621047.jpeg?auto=compress&cs=tinysrgb&w=1200",
    category: "World",
    author: "International Desk",
    readTime: "3 min read",
    publishDate: new Date(Date.now() - 3600000).toISOString(),
    slug: "international-summit-global-security",
    tags: ["International", "Security", "Diplomacy", "World"],
    featured: true,
    breaking: false,
    seoTitle: "International Summit on Global Security Challenges",
    seoDescription: "World leaders convene to address emerging security threats and coordinate international response strategies.",
    seoKeywords: ["international summit", "global security", "world leaders", "diplomacy"]
  },
  {
    id: '3',
    title: "Economic Indicators Show Mixed Signals for Q4 Growth",
    summary: "Latest economic data reveals complex patterns as markets navigate uncertainty.",
    content: `# Economic Indicators Show Mixed Signals for Q4 Growth

The latest economic indicators present a complex picture as the fourth quarter progresses, with some metrics showing strength while others suggest caution.

## Key Economic Metrics

Recent data shows:

- **Employment**: Job growth continues but at a slower pace
- **Inflation**: Core inflation remains elevated but showing signs of moderation
- **Consumer Spending**: Retail sales demonstrate resilience despite headwinds
- **Manufacturing**: Industrial production faces ongoing supply chain challenges

## Market Response

Financial markets have responded with cautious optimism, as investors weigh positive employment data against persistent inflationary pressures.

## Policy Implications

These mixed signals present challenges for policymakers as they balance growth objectives with inflation control measures.

## Looking Ahead

Economists emphasize the importance of monitoring these trends closely as they will influence policy decisions in the coming months.

## Sector Analysis

### Technology Sector
The technology sector continues to show resilience, with strong earnings reports from major companies offsetting concerns about regulatory pressures.

### Energy Markets
Energy prices remain volatile, influenced by geopolitical tensions and supply chain disruptions affecting global markets.

### Housing Market
The housing market shows signs of cooling, with rising interest rates affecting both buyers and sellers in major metropolitan areas.

## Federal Reserve Considerations

The Federal Reserve faces difficult decisions as it balances the need to control inflation while supporting economic growth and employment.`,
    image: "https://images.pexels.com/photos/259027/pexels-photo-259027.jpeg?auto=compress&cs=tinysrgb&w=1200",
    category: "Economy",
    author: "Economics Team",
    readTime: "5 min read",
    publishDate: new Date(Date.now() - 7200000).toISOString(),
    slug: "economic-indicators-mixed-signals-q4",
    tags: ["Economy", "Markets", "Growth", "Policy"],
    featured: false,
    breaking: false,
    seoTitle: "Q4 Economic Indicators Show Mixed Growth Signals",
    seoDescription: "Latest economic data reveals complex patterns as markets navigate uncertainty in the fourth quarter.",
    seoKeywords: ["economic indicators", "Q4 growth", "markets", "economy"]
  }
];

export function useArticles() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isSupabaseConnected, setIsSupabaseConnected] = useState(false);

  const checkSupabaseConnection = async () => {
    try {
      const { data, error } = await supabase.from('articles').select('count').limit(1);
      if (!error) {
        setIsSupabaseConnected(true);
        return true;
      }
    } catch (err) {
      console.log('Supabase not connected, using fallback data');
    }
    setIsSupabaseConnected(false);
    return false;
  };

  const fetchArticles = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const connected = await checkSupabaseConnection();
      
      if (connected) {
        const { data, error } = await supabase
          .from('articles')
          .select('*')
          .eq('status', 'published')
          .order('publish_date', { ascending: false });

        if (error) {
          console.error('Supabase error:', error);
          throw error;
        }

        console.log('Fetched articles from Supabase:', data);

        const formattedArticles: Article[] = (data || []).map(article => ({
          id: article.id,
          title: article.title,
          summary: article.summary || '',
          content: article.content,
          image: article.image || '',
          category: article.category,
          author: article.author,
          readTime: article.read_time,
          publishDate: article.publish_date,
          slug: article.slug,
          tags: article.tags || [],
          featured: article.featured || false,
          breaking: article.breaking || false,
          seoTitle: article.seo_title,
          seoDescription: article.seo_description,
          seoKeywords: article.seo_keywords || [],
        }));

        setArticles(formattedArticles);
      } else {
        // Use fallback articles when Supabase is not connected
        console.log('Using fallback articles');
        setArticles(FALLBACK_ARTICLES);
      }
    } catch (err) {
      console.error('Error fetching articles:', err);
      console.log('Falling back to demo articles');
      setArticles(FALLBACK_ARTICLES);
      setError('Using demo content - Connect to Supabase for live articles');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchArticles();
  }, []);

  const getArticleBySlug = async (slug: string): Promise<Article | null> => {
    try {
      console.log('Fetching article by slug:', slug);
      
      // First, try to find in current articles array (fastest)
      const existingArticle = articles.find(a => a.slug === slug);
      if (existingArticle) {
        console.log('Found article in current articles:', existingArticle.title);
        return existingArticle;
      }
      
      // If not found in current articles and Supabase is connected, try database
      if (isSupabaseConnected) {
        const { data, error } = await supabase
          .from('articles')
          .select('*')
          .eq('slug', slug)
          .eq('status', 'published')
          .single();

        if (!error && data) {
          console.log('Found article in Supabase:', data.title);
          return {
            id: data.id,
            title: data.title,
            summary: data.summary || '',
            content: data.content,
            image: data.image || '',
            category: data.category,
            author: data.author,
            readTime: data.read_time,
            publishDate: data.publish_date,
            slug: data.slug,
            tags: data.tags || [],
            featured: data.featured || false,
            breaking: data.breaking || false,
            seoTitle: data.seo_title,
            seoDescription: data.seo_description,
            seoKeywords: data.seo_keywords || [],
          };
        }
      }
      
      // Finally, search in fallback articles
      const fallbackArticle = FALLBACK_ARTICLES.find(a => a.slug === slug);
      if (fallbackArticle) {
        console.log('Found article in fallback data:', fallbackArticle.title);
        return fallbackArticle;
      }
      
      console.log('No article found for slug:', slug);
      return null;
    } catch (err) {
      console.error('Error fetching article by slug:', err);
      
      // As a last resort, try fallback articles
      const fallbackArticle = FALLBACK_ARTICLES.find(a => a.slug === slug);
      if (fallbackArticle) {
        console.log('Found article in fallback data after error:', fallbackArticle.title);
        return fallbackArticle;
      }
      
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
    isSupabaseConnected,
    fetchArticles,
    getArticleBySlug,
    getFeaturedArticles,
    getBreakingNews,
    getArticlesByCategory,
  };
}