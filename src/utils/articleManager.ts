import { Article } from '../types/Article';

// This would typically connect to your CMS or database
// For now, we'll use localStorage for demonstration
export class ArticleManager {
  private static STORAGE_KEY = 'federals_articles';

  static getAllArticles(): Article[] {
    const stored = localStorage.getItem(this.STORAGE_KEY);
    if (!stored) {
      // Return default articles if none exist
      return this.getDefaultArticles();
    }
    return JSON.parse(stored);
  }

  static getArticleBySlug(slug: string): Article | null {
    const articles = this.getAllArticles();
    return articles.find(article => article.slug === slug) || null;
  }

  static getArticlesByCategory(category: string): Article[] {
    const articles = this.getAllArticles();
    return articles.filter(article => 
      article.category.toLowerCase() === category.toLowerCase()
    );
  }

  static getFeaturedArticles(): Article[] {
    const articles = this.getAllArticles();
    return articles.filter(article => article.featured);
  }

  static getBreakingNews(): Article[] {
    const articles = this.getAllArticles();
    return articles.filter(article => article.breaking);
  }

  static saveArticle(article: Article): void {
    const articles = this.getAllArticles();
    const existingIndex = articles.findIndex(a => a.id === article.id);
    
    if (existingIndex >= 0) {
      articles[existingIndex] = article;
    } else {
      articles.unshift(article); // Add to beginning
    }
    
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(articles));
  }

  static deleteArticle(id: string): void {
    const articles = this.getAllArticles();
    const filtered = articles.filter(article => article.id !== id);
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(filtered));
  }

  static generateSlug(title: string): string {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9 -]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim();
  }

  private static getDefaultArticles(): Article[] {
    const defaultArticles: Article[] = [
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

Leadership from both chambers will continue negotiations through the weekend, with a potential vote scheduled for early next week. The American people are watching closely as their elected representatives work to fulfill their most basic constitutional duty: funding the government.`,
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
      }
    ];

    // Save default articles to localStorage
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(defaultArticles));
    return defaultArticles;
  }
}