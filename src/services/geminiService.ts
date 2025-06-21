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
      
      // Clean up common JSON formatting issues
      jsonString = jsonString
        .replace(/,(\s*[}\]])/g, '$1') // Remove trailing commas
        .replace(/([{,]\s*)(\w+):/g, '$1"$2":') // Quote unquoted keys
        .replace(/:\s*([^",{\[\]}\s][^",{\[\]}\n]*?)(\s*[,}\]])/g, ':"$1"$2'); // Quote unquoted string values
      
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
You are an expert political journalist and SEO specialist writing for Federals.live, an authoritative news platform. 

Create a comprehensive, EEAT-optimized article about: "${topic}"
Category: ${category}
Target Keywords: ${keywords.join(', ')}

Requirements:
1. EXPERTISE: Demonstrate deep knowledge of political processes, institutions, and current events
2. AUTHORITATIVENESS: Use credible sources, official statements, and expert analysis
3. TRUSTWORTHINESS: Present balanced, fact-based reporting with proper attribution
4. SEO OPTIMIZATION: Include target keywords naturally throughout

IMPORTANT: Respond with ONLY valid JSON, no markdown formatting or extra text.

Structure your response as JSON with these fields:
{
  "title": "Compelling, SEO-optimized headline (50-60 chars)",
  "summary": "Engaging summary for social sharing (150-160 chars)",
  "content": "Full article in Markdown format (1500-2500 words)",
  "seoTitle": "SEO-optimized title with primary keyword",
  "seoDescription": "Meta description with keywords (150-160 chars)",
  "seoKeywords": ["array", "of", "relevant", "keywords"],
  "suggestedTags": ["relevant", "article", "tags"],
  "imageQuery": "Descriptive query for finding relevant stock photos"
}

Content Guidelines:
- Start with a compelling lead paragraph
- Use H2 and H3 headings for structure
- Include quotes from officials or experts (you can create realistic attributions)
- Add bullet points for key information
- Include background context and analysis
- End with implications and what's next
- Maintain journalistic objectivity
- Use active voice and clear, professional language
- Naturally incorporate keywords without stuffing

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
    suggestions: string[];
  }> {
    const prompt = `
Analyze this article for SEO optimization:

Title: ${title}
Category: ${category}
Content: ${content.substring(0, 2000)}...

IMPORTANT: Respond with ONLY valid JSON, no markdown formatting or extra text.

Provide SEO analysis and recommendations as JSON:
{
  "seoTitle": "Optimized title with primary keyword (50-60 chars)",
  "seoDescription": "Compelling meta description (150-160 chars)",
  "seoKeywords": ["primary", "secondary", "long-tail", "keywords"],
  "suggestedTags": ["relevant", "content", "tags"],
  "readabilityScore": 85,
  "suggestions": [
    "Add more internal links",
    "Include more specific statistics",
    "Optimize heading structure"
  ]
}

Focus on:
- Political and news-related keywords
- Search intent optimization
- Competitive keyword analysis
- EEAT factors for news content
- Local and trending political topics
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

  async researchTopic(topic: string): Promise<{
    keyPoints: string[];
    relatedTopics: string[];
    expertSources: string[];
    trendingAngles: string[];
    factCheckPoints: string[];
  }> {
    const prompt = `
Research the political topic: "${topic}"

IMPORTANT: Respond with ONLY valid JSON, no markdown formatting or extra text.

Provide comprehensive research data as JSON:
{
  "keyPoints": [
    "Main policy implications",
    "Key stakeholders involved",
    "Historical context"
  ],
  "relatedTopics": [
    "Connected political issues",
    "Related legislation",
    "Similar past events"
  ],
  "expertSources": [
    "Government officials to quote",
    "Policy experts",
    "Academic researchers"
  ],
  "trendingAngles": [
    "Current debate points",
    "Public opinion aspects",
    "Media coverage angles"
  ],
  "factCheckPoints": [
    "Claims to verify",
    "Statistics to confirm",
    "Official statements to reference"
  ]
}

Focus on current political developments, institutional processes, and policy implications.
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