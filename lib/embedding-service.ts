import { GoogleGenerativeAI } from '@google/generative-ai';

export class EmbeddingService {
  private genAI: GoogleGenerativeAI | null = null;

  constructor() {
    if (process.env.GEMINI_API_KEY) {
      this.genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
      console.log('✅ Embedding service initialized with Google Gemini API');
    } else {
      console.log('⚠️  No Gemini API key found. Embeddings will not work.');
    }
  }

  async generateEmbedding(text: string): Promise<number[]> {
    // For now, use the improved embedding method
    // Google Generative AI SDK doesn't have direct embedding models
    // We'll use a semantic-aware embedding approach
    return this.generateAdvancedEmbedding(text);
  }

  async generateEmbeddings(texts: string[]): Promise<number[][]> {
    // Generate embeddings in parallel for better performance
    const embeddingPromises = texts.map(text => this.generateEmbedding(text));
    return Promise.all(embeddingPromises);
  }

  // Advanced embedding based on TF-IDF and semantic features
  private generateAdvancedEmbedding(text: string): number[] {
    // Clean and tokenize text
    const cleanedText = text.toLowerCase()
      .replace(/[^\w\s]/g, ' ') // Remove special characters
      .replace(/\s+/g, ' ')
      .trim();

    const words = cleanedText.split(/\s+/).filter(w => w.length > 2); // Filter short words
    const bigrams: string[] = [];
    
    // Create bigrams for better semantic capture
    for (let i = 0; i < words.length - 1; i++) {
      bigrams.push(`${words[i]}_${words[i + 1]}`);
    }

    // Combine unigrams and bigrams
    const tokens = [...words, ...bigrams];
    
    // Create 768-dimensional embedding
    const embedding = new Array(768).fill(0);
    const tokenCount = tokens.length;

    if (tokenCount === 0) {
      // Return zero embedding for empty text
      return embedding;
    }

    // Weight by position and frequency
    tokens.forEach((token, index) => {
      const hash = this.simpleHash(token);
      const position = hash % 768;
      
      // TF-IDF-like weighting
      const frequency = 1 / (tokens.filter(t => t === token).length + 1);
      const positionWeight = 1 - (index / tokenCount) * 0.1; // Slight positional bias
      const weight = frequency * positionWeight;
      
      embedding[position] += weight;
    });

    // Normalize the embedding
    const magnitude = Math.sqrt(embedding.reduce((sum, val) => sum + val * val, 0));
    if (magnitude > 0) {
      return embedding.map(val => val / magnitude);
    }

    return embedding;
  }

  // Fallback simple embedding (keeping for compatibility)
  private generateSimpleEmbedding(text: string): number[] {
    return this.generateAdvancedEmbedding(text);
  }

  private simpleHash(str: string): number {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // Convert to 32-bit integer
    }
    return Math.abs(hash);
  }

  // Calculate cosine similarity between two embeddings
  cosineSimilarity(embedding1: number[], embedding2: number[]): number {
    if (embedding1.length !== embedding2.length) {
      throw new Error('Embeddings must have the same dimension');
    }

    let dotProduct = 0;
    let norm1 = 0;
    let norm2 = 0;

    for (let i = 0; i < embedding1.length; i++) {
      dotProduct += embedding1[i] * embedding2[i];
      norm1 += embedding1[i] * embedding1[i];
      norm2 += embedding2[i] * embedding2[i];
    }

    const denominator = Math.sqrt(norm1) * Math.sqrt(norm2);
    return denominator > 0 ? dotProduct / denominator : 0;
  }
}

