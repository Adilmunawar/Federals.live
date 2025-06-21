import { GoogleGenerativeAI } from '@google/generative-ai';

const GEMINI_API_KEY = 'AIzaSyBE-SkmQO-yqDyn51HaenX8Xw3BCLjCcM0';

class GeminiService {
  private genAI: GoogleGenerativeAI;
  private model: any;

  constructor() {
    this.genAI = new GoogleGenerativeAI(GEMINI_API_KEY);
    this.model = this.genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
  }

  private parseAIResponse(text: string): any {
    try {
      // Remove markdown code block fences if present
      let cleanText = text.trim();
      cleanText = cleanText.replace(/^```json\s*/i, '');
      cleanText = cleanText.replace(/^```\s*/i, '');
      cleanText = cleanText.replace(/\s*```$/i, '');
      
      // Extract JSON from the response
      const jsonMatch = cleanText.match(/\{[\s\S]*\}/);
      if (!jsonMatch) {
        console.error('No JSON found in response:', cleanText);
        throw new Error('No valid JSON found in AI response');
      }
      
      let jsonString = jsonMatch[0];
      
      // Only remove trailing commas - avoid aggressive regex replacements
      jsonString = jsonString.replace(/,(\s*[}\]])/g, '$1');
      
      return JSON.parse(jsonString);
    } catch (parseError) {
      console.error('JSON parsing failed:', parseError);
      console.error('Original text:', text);
      console.error('Attempted JSON:', text.match(/\{[\s\S]*\}/)?.[0]);
      throw new Error('Failed to parse AI response as JSON');
    }
  }

  async generateArticle(topic: string, category: string, keywords: string[]): Promise<{
    title: string;
    summary: string;
    content: string;
    seoTitle: string;
    seoDescription: string;
    seoKeywords: string[];
    suggestedTags: string[];
    imageQuery: string;
  }> {
    const prompt = `
You are an expert political journalist and advanced SEO specialist writing for Federals.live, an authoritative news platform. 

Create a comprehensive, EEAT-optimized article about: "${topic}"
Category: ${category}
Target Keywords: ${keywords.join(', ')}

ADVANCED SEO REQUIREMENTS FOR 100% SCORE:
1. EXPERTISE: Demonstrate deep knowledge with specific data, statistics, and expert quotes
2. AUTHORITATIVENESS: Reference official sources, government data, and credible institutions
3. TRUSTWORTHINESS: Include fact-checking, balanced perspectives, and transparent sourcing
4. TECHNICAL SEO: Perfect keyword density (1-2%), semantic keywords, LSI terms
5. CONTENT STRUCTURE: Optimal heading hierarchy (H1, H2, H3), bullet points, numbered lists
6. READABILITY: Flesch-Kincaid score 60-70, varied sentence length, active voice
7. USER INTENT: Address search intent completely with comprehensive coverage
8. FEATURED SNIPPETS: Include FAQ sections, step-by-step processes, definitions

IMPORTANT: Respond with ONLY valid JSON, no markdown formatting or extra text.

Structure your response as JSON with these fields:
{
  "title": "Compelling, SEO-optimized headline (50-60 chars) with primary keyword",
  "summary": "Engaging summary for social sharing (150-160 chars) with keywords",
  "content": "Full article in Markdown format (2000-3000 words) with perfect SEO structure",
  "seoTitle": "SEO-optimized title with primary keyword (50-60 chars)",
  "seoDescription": "Meta description with keywords and CTA (150-160 chars)",
  "seoKeywords": ["primary-keyword", "secondary-keyword", "long-tail-keyword", "semantic-keyword", "lsi-term"],
  "suggestedTags": ["relevant", "article", "tags", "with", "keywords"],
  "imageQuery": "Specific descriptive query for finding relevant stock photos"
}

CONTENT STRUCTURE REQUIREMENTS:
- H1: Main title with primary keyword
- H2: 4-6 section headings with secondary keywords
- H3: Subsections with long-tail keywords
- Include FAQ section with common questions
- Add "What's Next" or "Key Takeaways" section
- Use bullet points and numbered lists
- Include statistics and data points
- Add internal linking opportunities (mention related topics)
- Include quotes from officials/experts
- End with strong conclusion and call-to-action

KEYWORD OPTIMIZATION:
- Primary keyword in title, first paragraph, and conclusion
- Secondary keywords in H2 headings
- Long-tail keywords in H3 headings and content
- Semantic keywords naturally throughout
- LSI terms for topic relevance
- Keyword density 1-2% (not stuffed)

Focus on current political developments, policy implications, and institutional processes relevant to the topic.
`;

    try {
      const result = await this.model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();
      
      return this.parseAIResponse(text);
    } catch (error) {
      console.error('Error generating article:', error);
      throw new Error('Failed to generate article content');
    }
  }

  async optimizeSEO(title: string, content: string, category: string): Promise<{
    seoTitle: string;
    seoDescription: string;
    seoKeywords: string[];
    suggestedTags: string[];
    readabilityScore: number;
    seoScore: number;
    technicalSEO: any;
    contentAnalysis: any;
    suggestions: string[];
    optimizedContent: string;
  }> {
    const prompt = `
Perform ADVANCED SEO analysis for 100% optimization score:

Title: ${title}
Category: ${category}
Content: ${content.substring(0, 3000)}...

COMPREHENSIVE SEO ANALYSIS REQUIREMENTS:
1. Technical SEO audit (title length, meta description, keyword density)
2. Content quality analysis (readability, structure, depth)
3. EEAT factors assessment (expertise, authority, trust)
4. Semantic SEO analysis (LSI keywords, topic coverage)
5. User intent optimization (search intent matching)
6. Featured snippet optimization
7. Core Web Vitals considerations
8. Mobile-first indexing readiness

IMPORTANT: Respond with ONLY valid JSON, no markdown formatting or extra text.

Provide comprehensive SEO analysis as JSON:
{
  "seoTitle": "Perfect SEO title with primary keyword (50-60 chars)",
  "seoDescription": "Compelling meta description with keywords and CTA (150-160 chars)",
  "seoKeywords": ["primary-keyword", "secondary-keyword", "long-tail-1", "long-tail-2", "semantic-1", "semantic-2", "lsi-1", "lsi-2"],
  "suggestedTags": ["optimized", "content", "tags", "with", "keywords"],
  "readabilityScore": 95,
  "seoScore": 100,
  "technicalSEO": {
    "titleLength": 58,
    "metaDescriptionLength": 155,
    "keywordDensity": 1.8,
    "headingStructure": "Perfect H1-H6 hierarchy",
    "internalLinks": 5,
    "imageAltTags": "Optimized",
    "urlStructure": "SEO-friendly",
    "schemaMarkup": "Recommended"
  },
  "contentAnalysis": {
    "wordCount": 2500,
    "averageSentenceLength": 18,
    "fleschKincaidScore": 65,
    "topicCoverage": 95,
    "expertiseLevel": "High",
    "authoritySignals": ["Government sources", "Expert quotes", "Official data"],
    "trustFactors": ["Fact-checking", "Balanced perspective", "Transparent sourcing"]
  },
  "suggestions": [
    "Add FAQ section for featured snippets",
    "Include more internal links to related articles",
    "Optimize images with descriptive alt text",
    "Add structured data markup",
    "Include more semantic keywords",
    "Improve sentence variety for readability",
    "Add call-to-action in conclusion",
    "Include more recent statistics",
    "Add expert quotes for authority",
    "Optimize for voice search queries"
  ],
  "optimizedContent": "Enhanced version of content with perfect SEO structure"
}

SCORING CRITERIA FOR 100%:
- Title optimization: 15 points
- Meta description: 15 points  
- Keyword optimization: 20 points
- Content structure: 15 points
- Readability: 15 points
- EEAT factors: 10 points
- Technical SEO: 10 points

Focus on:
- Political and news-related keywords with high search volume
- Search intent optimization for news queries
- Competitive keyword analysis for political topics
- EEAT factors specifically for news content
- Local and trending political topics
- Featured snippet optimization
- Voice search optimization
- Mobile-first considerations
`;

    try {
      const result = await this.model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();
      
      return this.parseAIResponse(text);
    } catch (error) {
      console.error('Error optimizing SEO:', error);
      throw new Error('Failed to optimize SEO');
    }
  }

  async generateAdvancedSEOContent(topic: string, category: string, targetKeywords: string[]): Promise<{
    optimizedTitle: string;
    optimizedContent: string;
    faqSection: string;
    keyTakeaways: string;
    semanticKeywords: string[];
    lsiTerms: string[];
    internalLinkSuggestions: string[];
    featuredSnippetContent: string;
  }> {
    const prompt = `
Generate ADVANCED SEO-optimized content for 100% search performance:

Topic: "${topic}"
Category: ${category}
Target Keywords: ${targetKeywords.join(', ')}

ADVANCED CONTENT OPTIMIZATION REQUIREMENTS:
1. Perfect keyword integration (1-2% density)
2. Semantic keyword inclusion for topic authority
3. LSI terms for search engine understanding
4. FAQ section optimized for featured snippets
5. Key takeaways for user engagement
6. Internal linking opportunities
7. Voice search optimization
8. Mobile-first content structure

IMPORTANT: Respond with ONLY valid JSON, no markdown formatting or extra text.

Generate optimized content as JSON:
{
  "optimizedTitle": "Perfect SEO title with primary keyword (50-60 chars)",
  "optimizedContent": "Enhanced article content with perfect SEO structure (2000+ words)",
  "faqSection": "FAQ section with 5-7 questions optimized for featured snippets",
  "keyTakeaways": "Bullet-point summary of key insights",
  "semanticKeywords": ["related-term-1", "related-term-2", "context-keyword-1", "context-keyword-2"],
  "lsiTerms": ["latent-semantic-1", "latent-semantic-2", "topic-variant-1", "topic-variant-2"],
  "internalLinkSuggestions": ["Related Article 1", "Related Topic 2", "Background Context 3"],
  "featuredSnippetContent": "Concise answer optimized for position zero in search results"
}

CONTENT STRUCTURE FOR 100% SEO:
- H1: Primary keyword in title
- H2: Secondary keywords in section headings
- H3: Long-tail keywords in subsections
- FAQ: Question-based content for featured snippets
- Lists: Numbered and bulleted for readability
- Tables: Data presentation for rich snippets
- Quotes: Expert opinions for authority
- Statistics: Recent data for credibility

KEYWORD OPTIMIZATION STRATEGY:
- Primary keyword: 3-5 times naturally
- Secondary keywords: 2-3 times in headings
- Long-tail keywords: 1-2 times in content
- Semantic keywords: Throughout for context
- LSI terms: Natural integration for relevance

Focus on creating content that dominates search results for the target topic.
`;

    try {
      const result = await this.model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();
      
      return this.parseAIResponse(text);
    } catch (error) {
      console.error('Error generating advanced SEO content:', error);
      throw new Error('Failed to generate advanced SEO content');
    }
  }

  async researchTopic(topic: string): Promise<{
    keyPoints: string[];
    relatedTopics: string[];
    expertSources: string[];
    trendingAngles: string[];
    factCheckPoints: string[];
    competitorAnalysis: string[];
    searchTrends: string[];
    semanticKeywords: string[];
  }> {
    const prompt = `
Research the political topic: "${topic}"

COMPREHENSIVE RESEARCH FOR 100% SEO OPTIMIZATION:
1. Key policy implications and stakeholder analysis
2. Related topics for internal linking opportunities
3. Expert sources for authority building
4. Trending angles for current relevance
5. Fact-checking points for trustworthiness
6. Competitor content analysis
7. Search trend insights
8. Semantic keyword opportunities

IMPORTANT: Respond with ONLY valid JSON, no markdown formatting or extra text.

Provide comprehensive research data as JSON:
{
  "keyPoints": [
    "Main policy implications with specific details",
    "Key stakeholders and their positions",
    "Historical context and precedents",
    "Economic impact analysis",
    "International implications"
  ],
  "relatedTopics": [
    "Connected political issues for internal links",
    "Related legislation and policies",
    "Similar past events and outcomes",
    "Broader policy implications",
    "International comparisons"
  ],
  "expertSources": [
    "Government officials and their titles",
    "Policy experts and institutions",
    "Academic researchers and universities",
    "Think tank analysts",
    "International organization representatives"
  ],
  "trendingAngles": [
    "Current debate points and controversies",
    "Public opinion polling data",
    "Media coverage analysis",
    "Social media sentiment",
    "Emerging developments"
  ],
  "factCheckPoints": [
    "Claims requiring verification",
    "Statistics needing confirmation",
    "Official statements to reference",
    "Data sources to cite",
    "Contradictory information to address"
  ],
  "competitorAnalysis": [
    "Top-ranking content gaps to fill",
    "Unique angles not covered elsewhere",
    "Keyword opportunities competitors missed",
    "Content depth improvements needed",
    "Authority signals to include"
  ],
  "searchTrends": [
    "Rising search queries related to topic",
    "Seasonal search patterns",
    "Geographic search variations",
    "Voice search query patterns",
    "Featured snippet opportunities"
  ],
  "semanticKeywords": [
    "Related terms search engines associate",
    "Contextual keywords for topic authority",
    "LSI terms for comprehensive coverage",
    "Synonym variations for natural language",
    "Industry-specific terminology"
  ]
}

Focus on current political developments, institutional processes, and policy implications with comprehensive coverage for search dominance.
`;

    try {
      const result = await this.model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();
      
      return this.parseAIResponse(text);
    } catch (error) {
      console.error('Error researching topic:', error);
      throw new Error('Failed to research topic');
    }
  }

  async generateImageSuggestions(topic: string, category: string): Promise<string[]> {
    const prompt = `
Generate 5 specific image search queries for a news article about: "${topic}"
Category: ${category}

IMPORTANT: Respond with ONLY a valid JSON array, no markdown formatting or extra text.

Return ONLY a JSON array of search terms that would find relevant, professional images:
["search query 1", "search query 2", "search query 3", "search query 4", "search query 5"]

Guidelines:
- Make queries specific to the topic, not generic
- Focus on visual elements that relate to the story
- Include relevant locations, people, or events
- Avoid partisan imagery
- Use professional news photography terms

Example for "Iran-Israel conflict":
["middle east conflict", "iran israel war", "international diplomacy", "military conflict", "geopolitical tensions"]

For topic "${topic}":
`;

    try {
      const result = await this.model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();
      
      // Clean up the response for array parsing
      let cleanText = text.trim();
      cleanText = cleanText.replace(/^```json\s*/i, '');
      cleanText = cleanText.replace(/^```\s*/i, '');
      cleanText = cleanText.replace(/\s*```$/i, '');
      
      const jsonMatch = cleanText.match(/\[[\s\S]*?\]/);
      if (!jsonMatch) {
        console.error('No JSON array found in response:', cleanText);
        return this.generateFallbackQueries(topic, category);
      }
      
      try {
        let jsonString = jsonMatch[0];
        // Clean up common array formatting issues
        jsonString = jsonString.replace(/,(\s*\])/g, '$1'); // Remove trailing commas
        
        const queries = JSON.parse(jsonString);
        return Array.isArray(queries) ? queries : this.generateFallbackQueries(topic, category);
      } catch (parseError) {
        console.error('Failed to parse image suggestions JSON:', parseError);
        console.error('Attempted JSON:', jsonMatch[0]);
        return this.generateFallbackQueries(topic, category);
      }
    } catch (error) {
      console.error('Error generating image suggestions:', error);
      return this.generateFallbackQueries(topic, category);
    }
  }

  private generateFallbackQueries(topic: string, category: string): string[] {
    const topicLower = topic.toLowerCase();
    
    // Generate topic-specific queries based on keywords
    const queries: string[] = [];
    
    if (topicLower.includes('iran') || topicLower.includes('israel')) {
      queries.push('middle east conflict', 'iran israel war', 'international diplomacy', 'military conflict', 'geopolitical tensions');
    } else if (topicLower.includes('congress') || topicLower.includes('senate')) {
      queries.push('government building', 'political meeting', 'federal government', 'congressional session', 'political debate');
    } else if (topicLower.includes('economy') || topicLower.includes('financial')) {
      queries.push('economic policy', 'financial markets', 'government building', 'political meeting', 'federal reserve');
    } else if (topicLower.includes('security') || topicLower.includes('defense')) {
      queries.push('military conflict', 'government building', 'political meeting', 'federal government', 'national security');
    } else {
      // Default based on category
      switch (category.toLowerCase()) {
        case 'world':
          queries.push('international diplomacy', 'geopolitical tensions', 'world leaders', 'global politics', 'international relations');
          break;
        case 'economy':
          queries.push('economic policy', 'financial markets', 'government building', 'political meeting', 'federal reserve');
          break;
        case 'security':
          queries.push('military conflict', 'national security', 'government building', 'political meeting', 'defense policy');
          break;
        default:
          queries.push('government building', 'political meeting', 'federal government', 'political debate', 'congressional session');
      }
    }
    
    return queries.slice(0, 5);
  }
}

export const geminiService = new GeminiService();