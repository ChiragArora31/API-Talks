import { NextRequest, NextResponse } from 'next/server';
import { RAGService } from '@/lib/rag-service';
import { CodeGenerator } from '@/lib/code-generator';
import { LLMService } from '@/lib/llm-service';
import { ApiDocSection } from '@/lib/documentation-fetcher';

const ragService = new RAGService();
const codeGenerator = new CodeGenerator();
const llmService = new LLMService();

// Initialize vector store on startup (in background)
let initializationPromise: Promise<void> | null = null;
function ensureVectorStoreInitialized() {
  if (!initializationPromise && !ragService.isInitialized()) {
    initializationPromise = ragService.initializeVectorStore()
      .then(() => {
        console.log('✅ Vector store initialized successfully');
      })
      .catch((error) => {
        console.error('❌ Error initializing vector store:', error);
      });
  }
  return initializationPromise || Promise.resolve();
}

// Initialize on first load
ensureVectorStoreInitialized();

/**
 * Detect which platform/API the user is asking about
 * Returns platform name if detected, null otherwise
 */
function detectPlatform(message: string): string | null {
  const msg = message.toLowerCase();
  
  // Platform detection patterns
  const platformPatterns: { [key: string]: RegExp[] } = {
    'github': [/github/i, /git hub/i, /repository|repo/i],
    'youtube': [/youtube/i, /yt\b/i, /video.*api/i],
    'spotify': [/spotify/i],
    'twitter': [/twitter/i, /tweet/i, /x\s+api/i],
    'googlemaps': [/google\s*maps/i, /maps\s*api/i, /geocod/i, /place/i, /directions/i],
    'stripe': [/stripe/i, /payment/i],
    'openai': [/openai/i, /gpt/i, /chatgpt/i, /davinci/i, /whisper/i],
    'openweathermap': [/openweathermap/i, /openweather/i, /weather\s*api/i],
    'notion': [/notion/i],
    'reddit': [/reddit/i, /subreddit/i],
  };
  
  // Check each platform
  for (const [platform, patterns] of Object.entries(platformPatterns)) {
    if (patterns.some(pattern => pattern.test(msg))) {
      return platform;
    }
  }
  
  return null;
}

/**
 * Check if a question is API-related
 * Returns true if the question is about APIs, false otherwise
 */
function isApiRelatedQuestion(message: string): boolean {
  const msg = message.toLowerCase().trim();
  
  // First check for explicit API-related keywords (highest priority)
  const apiKeywords = [
    'api', 'endpoint', 'request', 'response', 'http', 'rest', 'graphql',
    'authentication', 'token', 'key', 'github', 'youtube', 'spotify',
    'stripe', 'openai', 'notion', 'reddit', 'twitter', 'weather api',
    'maps api', 'google maps', 'openweathermap', 'fetch', 'curl', 'axios',
    'integrate', 'integration', 'webhook', 'documentation', 'sdk',
    'get data from', 'call api', 'use api', 'connect to', 'access',
  ];
  
  const hasApiKeywords = apiKeywords.some(keyword => msg.includes(keyword));
  
  // If it has API keywords, accept it (unless it matches a clear non-API pattern)
  if (hasApiKeywords) {
    // But still reject if it's clearly about something else
    const conflictingPatterns = [
      /stock.*price|stock.*performing|stock market|share price|trading|financial|invest/i,
    ];
    
    // If it has API keywords but matches conflicting pattern, still reject
    if (conflictingPatterns.some(pattern => pattern.test(msg))) {
      return false;
    }
    
    // Has API keywords and no conflicts - accept
    return true;
  }
  
  // Reject common non-API questions (no API keywords found)
  const nonApiPatterns = [
    // Greetings and personal questions
    /^(hi|hello|hey|how are you|what's up|how's it going)$/i,
    /^(tell me about yourself|what do you do|who are you|what are you)$/i,
    /^(how old are you|where are you from|what's your name)$/i,
    
    // Stock/financial questions
    /^(how is|how's|what is|tell me about).*(stock|price|performing|market|trading|financial|invest)/i,
    /stock.*price|stock.*performing|stock market|share price|trading|financial|invest/i,
    
    // General conversation
    /^(thanks|thank you|bye|goodbye|see you|thanks for|appreciate)$/i,
    
    // Weather questions (unless explicitly about weather API)
    /^(what's the weather|how's the weather|weather today|weather forecast)(?!.*api)/i,
    /^(what|how).*weather(?!.*api)/i,
    
    // Company questions (unless explicitly about their API)
    /^(how is|how's|tell me about|what is) (google|microsoft|apple|meta|amazon|tesla)(?!.*api)/i,
    
    // General knowledge questions without API context
    /^(what is|what are|who is|who are|when did|where is|why is).*(but|not|except|without).*api/i,
  ];
  
  // Check against non-API patterns
  for (const pattern of nonApiPatterns) {
    if (pattern.test(msg)) {
      return false;
    }
  }
  
  // Check if it's a technical question about using services/platforms
  const technicalPatterns = [
    /how (to|do|can).*(fetch|get|post|put|delete|call|use|connect|integrate|access)/i,
    /(fetch|get|post|put|delete|call).*(data|information|result|response)/i,
    /(connect|integrate|use|access).*(service|platform)/i,
    /(example|code|snippet|implementation|tutorial).*(for|of|using)/i,
  ];
  
  const hasTechnicalPattern = technicalPatterns.some(pattern => pattern.test(msg));
  
  // Accept if it has technical pattern (likely API-related)
  return hasTechnicalPattern;
}

export async function POST(request: NextRequest) {
  try {
    const { message } = await request.json();

    if (!message || typeof message !== 'string') {
      return NextResponse.json(
        { error: 'Message is required' },
        { status: 400 }
      );
    }

    // Guardrail: Check if question is API-related
    if (!isApiRelatedQuestion(message)) {
      return NextResponse.json({
        response: "I'm specialized in helping developers with API-related questions. I can assist you with:\n\n• API endpoints and documentation\n• Code examples for integrating APIs\n• Authentication and API keys\n• Making API requests (GitHub, YouTube, Spotify, Stripe, OpenAI, OpenWeatherMap, Notion, Reddit, Twitter/X, Google Maps)\n\nPlease ask me a question about using one of these APIs!",
        codeSnippet: undefined,
        relevantEndpoint: undefined,
      });
    }

    // Ensure vector store is initialized
    await ensureVectorStoreInitialized();

    // Step 1: Detect which platform is being asked about
    const detectedPlatform = detectPlatform(message);
    
    let relevantDocs: ApiDocSection[] = [];
    
    // If a specific platform is detected, get ALL endpoints for that platform
    // Otherwise, use semantic search with top 2 documents
    if (detectedPlatform) {
      console.log(`📌 Detected platform: ${detectedPlatform}, fetching all endpoints...`);
      relevantDocs = await ragService.getAllDocsForPlatform(detectedPlatform);
    } else {
      console.log('🔍 No specific platform detected, using semantic search...');
      // Use only top 2 documents with highest matching scores
      relevantDocs = await ragService.searchRelevantDocs(message, 2);
    }

    // Step 2: Generate response using LLM with retrieved context
    const { response, detectedApi } = await llmService.generateResponse(
      message,
      relevantDocs
    );

    // Step 3: Generate code snippet
    // Find the best matching endpoint based on the query
    let codeSnippet: string | undefined;
    if (relevantDocs.length > 0) {
      // Try to find endpoint that matches the query intent
      const msgLower = message.toLowerCase();
      const queryWords = ['search', 'get', 'fetch', 'retrieve', 'create', 'update', 'delete'];
      const matchingWord = queryWords.find(word => msgLower.includes(word));
      
      let bestDoc = relevantDocs[0]; // Default to first
      
      if (matchingWord && relevantDocs.length > 1) {
        // Try to find doc that matches the intent
        const matchingDoc = relevantDocs.find(doc => 
          doc.title.toLowerCase().includes(matchingWord) ||
          doc.endpoint?.toLowerCase().includes(matchingWord) ||
          doc.content.toLowerCase().includes(matchingWord)
        );
        if (matchingDoc) {
          bestDoc = matchingDoc;
        }
      }
      
      codeSnippet = codeGenerator.generateCode(bestDoc, message);
    }

    return NextResponse.json({
      response,
      codeSnippet,
      relevantEndpoint: relevantDocs[0]?.endpoint,
    });
  } catch (error) {
    console.error('Chat API error:', error);
    return NextResponse.json(
      {
        error: 'An error occurred while processing your request',
        response: 'I encountered an error. Please try again or rephrase your question.',
      },
      { status: 500 }
    );
  }
}
