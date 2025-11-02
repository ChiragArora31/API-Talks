import { VectorStore } from './vector-store';
import { DocumentationFetcher } from './documentation-fetcher';

/**
 * Initialize the vector store with API documentation
 * Run this script to populate the vector database
 */
export async function initializeVectorStore(): Promise<void> {
  console.log('🚀 Initializing vector store with API documentation...');
  
  const vectorStore = new VectorStore();
  const docFetcher = new DocumentationFetcher();

  // Clear existing store
  vectorStore.clear();

  // Fetch all documentation
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
    docFetcher.fetchGitHubDocs(),
    docFetcher.fetchYouTubeDocs(),
    docFetcher.fetchSpotifyDocs(),
    docFetcher.fetchTwitterDocs(),
    docFetcher.fetchGoogleMapsDocs(),
    docFetcher.fetchStripeDocs(),
    docFetcher.fetchOpenAIDocs(),
    docFetcher.fetchOpenWeatherMapDocs(),
    docFetcher.fetchNotionDocs(),
    docFetcher.fetchRedditDocs(),
  ]);

  // Add all documents to vector store
  await vectorStore.addDocuments(githubDocs, 'github');
  await vectorStore.addDocuments(youtubeDocs, 'youtube');
  await vectorStore.addDocuments(spotifyDocs, 'spotify');
  await vectorStore.addDocuments(twitterDocs, 'twitter');
  await vectorStore.addDocuments(googlemapsDocs, 'googlemaps');
  await vectorStore.addDocuments(stripeDocs, 'stripe');
  await vectorStore.addDocuments(openaiDocs, 'openai');
  await vectorStore.addDocuments(openweathermapDocs, 'openweathermap');
  await vectorStore.addDocuments(notionDocs, 'notion');
  await vectorStore.addDocuments(redditDocs, 'reddit');

  const totalDocs = vectorStore.getDocumentCount();
  console.log(`✅ Vector store initialized with ${totalDocs} documents`);
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
}

// Allow running this script directly
if (require.main === module) {
  initializeVectorStore()
    .then(() => {
      console.log('✅ Initialization complete!');
      process.exit(0);
    })
    .catch((error) => {
      console.error('❌ Error initializing vector store:', error);
      process.exit(1);
    });
}

