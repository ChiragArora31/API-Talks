import { GoogleGenerativeAI } from '@google/generative-ai';
import { ApiDocSection } from './documentation-fetcher';

export class LLMService {
  private genAI: GoogleGenerativeAI | null = null;
  private provider: 'gemini' | 'none' = 'none';

  constructor() {
    // Check for Gemini API key
    if (process.env.GEMINI_API_KEY) {
      this.genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
      this.provider = 'gemini';
      console.log('✅ Using Google Gemini API directly for LLM responses');
    } else {
      console.log('⚠️  No Gemini API key found. Using fallback responses.');
      console.log('   To enable AI responses, add GEMINI_API_KEY to .env.local');
      console.log('   Get your free API key at: https://makersuite.google.com/app/apikey');
    }
  }

  async generateResponse(
    query: string,
    relevantDocs: ApiDocSection[]
  ): Promise<{ response: string; detectedApi?: string }> {
    if (!this.genAI || this.provider === 'none') {
      // Fallback to rule-based response if no LLM is configured
      return this.generateFallbackResponse(query, relevantDocs);
    }

    try {
      const docsContext = relevantDocs
        .map(
          (doc) =>
            `Title: ${doc.title}\nEndpoint: ${doc.method} ${doc.endpoint}\nDescription: ${doc.content}`
        )
        .join('\n\n');

      const systemPrompt = `You are a technical API assistant. Provide direct, concise, and context-aware responses based EXCLUSIVELY on the provided API documentation.

CRITICAL GUIDELINES:
1. **Be Direct**: Answer the question immediately without unnecessary introductions or storytelling. No fluff.
2. **Stay Context-Aware**: Use ONLY the information from the provided documentation sections. Do not add information not present in the docs.
3. **Be Concise**: Get to the point quickly. Focus on what the user asked.
4. **Select Relevant Endpoint**: If multiple endpoints are provided, choose the ONE that best matches the user's question. Don't mention endpoints that don't apply.
5. **Include Code**: Always provide a complete, ready-to-use code example using the CORRECT and MOST RELEVANT API endpoint. Use the actual API base URL (e.g., https://api.spotify.com for Spotify, https://api.github.com for GitHub, etc.)
6. **No Redundancy**: Don't repeat information. If something is already clear, move on.
7. **Complete**: Ensure all code examples are complete and functional - never cut off mid-sentence or mid-code.
8. **Be Helpful**: If the user asks about searching, look for search endpoints. If they ask about getting details, look for GET endpoints. Match the intent.

Response Format:
- Start with a brief direct answer (1-2 sentences max)
- Provide the endpoint details (method and path) for the MOST RELEVANT endpoint
- Show a complete code example using the correct API base URL
- Brief explanation of key parameters (if needed)

Do NOT:
- Say an endpoint doesn't exist if it's in the provided documentation
- Mention multiple endpoints when one clearly answers the question
- Use placeholder URLs like "api.example.com" - use the actual API base URL
- Weave stories or add unnecessary context
- Include information not in the provided documentation

Focus on being helpful, direct, and precise. If the user asks about "searching for tracks", find and use the search endpoint from the documentation.`;

      // Format documentation context clearly
      const numDocs = relevantDocs.length;
      const docsContextText = numDocs > 1 
        ? `Multiple API endpoints are provided. Select the ONE endpoint that best answers the user's question:\n\n${docsContext}\n\nCarefully review all endpoints and choose the most relevant one.`
        : `API Documentation:\n${docsContext}`;
      
      const userMessage = `User Question: ${query}\n\n${docsContextText}\n\nProvide a direct, concise response using the most relevant endpoint from the documentation above.`;

      // Combine system prompt with user message
      const fullPrompt = `${systemPrompt}\n\n${userMessage}`;

      // Use gemini-2.5-flash with optimized tokens for faster responses
      // Lower temperature for more focused, less verbose responses
      const model = this.genAI!.getGenerativeModel({ 
        model: 'gemini-2.5-flash',
        generationConfig: {
          temperature: 0.6, // Lower temperature for more focused, direct responses
          maxOutputTokens: 800, // Focused responses - less verbose
          candidateCount: 1,
        },
      });

      const result = await model.generateContent(fullPrompt);
      const response = result.response;
      let responseText = response.text();

      // Check if response was cut off (common indicators)
      const incompleteIndicators = [
        responseText.trim().endsWith('...'),
        responseText.trim().endsWith('..'),
        !responseText.trim().match(/[.!?]$/), // No proper ending punctuation
      ];

      // If response might be incomplete, ensure it ends properly
      if (incompleteIndicators.some(ind => ind) && responseText.length > 900) {
        // Response might be cut off, but don't make another API call for speed
        // Just ensure it ends properly
        if (!responseText.trim().match(/[.!?]$/)) {
          responseText = responseText.trim() + '...';
        }
      }

      // Ensure response ends properly
      if (!responseText.trim().match(/[.!?]$/)) {
        responseText = responseText.trim() + '.';
      }

      // Detect API from response or query
      const detectedApi = this.detectApi(query);

      console.log('✅ Successfully used model: gemini-2.5-flash');
      return { response: responseText, detectedApi };
    } catch (error) {
      console.error('LLM error:', error);
      // If we have an LLM client but it failed, try fallback
      if (error instanceof Error) {
        console.error('Error details:', error.message);
      }
      return this.generateFallbackResponse(query, relevantDocs);
    }
  }

  private detectApi(query: string): string | undefined {
    const queryLower = query.toLowerCase();
    if (queryLower.includes('github') || queryLower.includes('repository') || queryLower.includes('repo')) {
      return 'github';
    }
    if (queryLower.includes('youtube') || queryLower.includes('video')) {
      return 'youtube';
    }
    return undefined;
  }

  private generateFallbackResponse(
    query: string,
    relevantDocs: ApiDocSection[]
  ): { response: string; detectedApi?: string } {
    if (relevantDocs.length === 0) {
      return {
        response:
          "I couldn't find specific documentation for that request. Could you please specify which API you're interested in (e.g., GitHub, YouTube)?",
      };
    }

    const doc = relevantDocs[0];
    const detectedApi = this.detectApi(query);

    return {
      response: `Based on your question, I found relevant API documentation for ${doc.title}. This endpoint (${doc.method} ${doc.endpoint}) allows you to: ${doc.content}. Check out the code example below to see how to use it.`,
      detectedApi,
    };
  }
}
