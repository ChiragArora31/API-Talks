import { VectorStore } from './vector-store';
import { DocumentationFetcher, ApiDocSection } from './documentation-fetcher';

/**
 * RAG Service - Handles retrieval-augmented generation
 * Uses vector store for semantic search
 */
export class RAGService {
  private vectorStore: VectorStore;
  private docFetcher: DocumentationFetcher;

  constructor() {
    this.vectorStore = new VectorStore();
    this.docFetcher = new DocumentationFetcher();
  }

  /**
   * Search for relevant API documentation using semantic search
   */
  async searchRelevantDocs(query: string, limit: number = 5): Promise<ApiDocSection[]> {
    // Check if vector store is initialized
    if (!this.vectorStore.isInitialized()) {
      console.log('⚠️  Vector store not initialized. Initializing now...');
      await this.initializeVectorStore();
    }

    // Perform semantic search
    const vectorDocs = await this.vectorStore.search(query, limit);

    // Convert vector documents to ApiDocSection format
    const apiDocs: ApiDocSection[] = vectorDocs.map(doc => ({
      title: doc.metadata.title,
      content: doc.metadata.content,
      endpoint: doc.metadata.endpoint,
      method: doc.metadata.method,
      api: doc.metadata.api,
    }));

    return apiDocs;
  }

  /**
   * Search for relevant docs in a specific API
   */
  async searchDocsForAPI(query: string, api: string, limit: number = 5): Promise<ApiDocSection[]> {
    if (!this.vectorStore.isInitialized()) {
      await this.initializeVectorStore();
    }

    const vectorDocs = await this.vectorStore.search(query, limit, api);

    return vectorDocs.map(doc => ({
      title: doc.metadata.title,
      content: doc.metadata.content,
      endpoint: doc.metadata.endpoint,
      method: doc.metadata.method,
      api: doc.metadata.api,
    }));
  }

  /**
   * Get all documentation for a specific platform/API
   * Returns all endpoints for the detected platform
   */
  async getAllDocsForPlatform(platform: string): Promise<ApiDocSection[]> {
    if (!this.vectorStore.isInitialized()) {
      await this.initializeVectorStore();
    }

    // Get all documents for the specific platform from the documentation fetcher
    const platformLower = platform.toLowerCase();
    
    switch (platformLower) {
      case 'github':
        return await this.docFetcher.fetchGitHubDocs();
      case 'youtube':
        return await this.docFetcher.fetchYouTubeDocs();
      case 'spotify':
        return await this.docFetcher.fetchSpotifyDocs();
      case 'twitter':
      case 'x':
        return await this.docFetcher.fetchTwitterDocs();
      case 'googlemaps':
      case 'google maps':
      case 'maps':
        return await this.docFetcher.fetchGoogleMapsDocs();
      case 'stripe':
        return await this.docFetcher.fetchStripeDocs();
      case 'openai':
        return await this.docFetcher.fetchOpenAIDocs();
      case 'openweathermap':
      case 'openweather':
      case 'weather':
        return await this.docFetcher.fetchOpenWeatherMapDocs();
      case 'notion':
        return await this.docFetcher.fetchNotionDocs();
      case 'reddit':
        return await this.docFetcher.fetchRedditDocs();
      default:
        return [];
    }
  }

  /**
   * Initialize vector store with API documentation
   * @param forceReinitialize - If true, clears existing store and re-initializes (default: false)
   */
  async initializeVectorStore(forceReinitialize: boolean = false): Promise<void> {
    console.log('🚀 Initializing vector store...');
    
    // If force re-initialize or store is empty, clear it first
    if (forceReinitialize || this.vectorStore.getDocumentCount() === 0) {
      if (forceReinitialize) {
        console.log('🔄 Force re-initializing: clearing existing store...');
        this.vectorStore.clear();
      }
      
      const [
        githubDocs,
        youtubeDocs,
        spotifyDocs,
        twitterDocs,
        googlemapsDocs,
        stripeDocs,
        openaiDocs,
        openweathermapDocs,
        notionDocs,
        redditDocs,
      ] = await Promise.all([
        this.docFetcher.fetchGitHubDocs(),
        this.docFetcher.fetchYouTubeDocs(),
        this.docFetcher.fetchSpotifyDocs(),
        this.docFetcher.fetchTwitterDocs(),
        this.docFetcher.fetchGoogleMapsDocs(),
        this.docFetcher.fetchStripeDocs(),
        this.docFetcher.fetchOpenAIDocs(),
        this.docFetcher.fetchOpenWeatherMapDocs(),
        this.docFetcher.fetchNotionDocs(),
        this.docFetcher.fetchRedditDocs(),
      ]);

      await this.vectorStore.addDocuments(githubDocs, 'github');
      await this.vectorStore.addDocuments(youtubeDocs, 'youtube');
      await this.vectorStore.addDocuments(spotifyDocs, 'spotify');
      await this.vectorStore.addDocuments(twitterDocs, 'twitter');
      await this.vectorStore.addDocuments(googlemapsDocs, 'googlemaps');
      await this.vectorStore.addDocuments(stripeDocs, 'stripe');
      await this.vectorStore.addDocuments(openaiDocs, 'openai');
      await this.vectorStore.addDocuments(openweathermapDocs, 'openweathermap');
      await this.vectorStore.addDocuments(notionDocs, 'notion');
      await this.vectorStore.addDocuments(redditDocs, 'reddit');
      
      console.log(`✅ Vector store initialized with ${this.vectorStore.getDocumentCount()} documents`);
      console.log(`   - GitHub: ${githubDocs.length} documents`);
      console.log(`   - YouTube: ${youtubeDocs.length} documents`);
      console.log(`   - Spotify: ${spotifyDocs.length} documents`);
      console.log(`   - Twitter/X: ${twitterDocs.length} documents`);
      console.log(`   - Google Maps: ${googlemapsDocs.length} documents`);
      console.log(`   - Stripe: ${stripeDocs.length} documents`);
      console.log(`   - OpenAI: ${openaiDocs.length} documents`);
      console.log(`   - OpenWeatherMap: ${openweathermapDocs.length} documents`);
      console.log(`   - Notion: ${notionDocs.length} documents`);
      console.log(`   - Reddit: ${redditDocs.length} documents`);
      return;
    }
    
    console.log(`✅ Vector store already initialized with ${this.vectorStore.getDocumentCount()} documents`);
  }

  /**
   * Check if vector store is initialized
   */
  isInitialized(): boolean {
    return this.vectorStore.isInitialized();
  }
}

