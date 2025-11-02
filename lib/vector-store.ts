import * as fs from 'fs';
import * as path from 'path';
import { EmbeddingService } from './embedding-service';
import { ApiDocSection } from './documentation-fetcher';

export interface VectorDocument {
  id: string;
  text: string;
  embedding: number[];
  metadata: {
    title: string;
    endpoint?: string;
    method?: string;
    api: string; // 'github', 'youtube', 'spotify', 'twitter', 'googlemaps', 'stripe', 'openai', 'openweathermap', 'notion', 'reddit'
    content: string;
  };
}

export class VectorStore {
  private documents: VectorDocument[] = [];
  private embeddingService: EmbeddingService;
  private storagePath: string;

  constructor() {
    this.embeddingService = new EmbeddingService();
    this.storagePath = path.join(process.cwd(), '.vector-store.json');
    this.loadFromDisk();
  }

  // Load documents from disk
  private loadFromDisk(): void {
    try {
      if (fs.existsSync(this.storagePath)) {
        const data = fs.readFileSync(this.storagePath, 'utf-8');
        const stored = JSON.parse(data);
        this.documents = stored.documents || [];
        console.log(`✅ Loaded ${this.documents.length} documents from vector store`);
      }
    } catch (error) {
      console.error('Error loading vector store:', error);
      this.documents = [];
    }
  }

  // Save documents to disk
  private saveToDisk(): void {
    try {
      const data = {
        documents: this.documents,
        lastUpdated: new Date().toISOString(),
      };
      fs.writeFileSync(this.storagePath, JSON.stringify(data, null, 2));
    } catch (error) {
      console.error('Error saving vector store:', error);
    }
  }

  // Add a document to the vector store
  async addDocument(
    text: string,
    metadata: {
      title: string;
      endpoint?: string;
      method?: string;
      api: string;
      content: string;
    }
  ): Promise<string> {
    try {
      const embedding = await this.embeddingService.generateEmbedding(text);
      const id = `${metadata.api}_${Date.now()}_${Math.random().toString(36).substring(7)}`;
      
      const document: VectorDocument = {
        id,
        text,
        embedding,
        metadata,
      };

      this.documents.push(document);
      this.saveToDisk();
      
      return id;
    } catch (error) {
      console.error('Error adding document to vector store:', error);
      throw error;
    }
  }

  // Add multiple documents
  async addDocuments(docs: ApiDocSection[], api: string): Promise<void> {
    console.log(`📚 Adding ${docs.length} documents for ${api} to vector store...`);
    
    for (const doc of docs) {
      // Create a searchable text representation
      const searchableText = `${doc.title} ${doc.content} ${doc.endpoint || ''} ${doc.method || ''}`;
      
      await this.addDocument(searchableText, {
        title: doc.title,
        endpoint: doc.endpoint,
        method: doc.method,
        api: api.toLowerCase(),
        content: doc.content,
      });
    }

    console.log(`✅ Added all documents for ${api}`);
  }

  // Search for similar documents using cosine similarity
  async search(query: string, limit: number = 5, apiFilter?: string): Promise<VectorDocument[]> {
    if (this.documents.length === 0) {
      console.log('⚠️  Vector store is empty. Please initialize it first.');
      return [];
    }

    try {
      // Generate embedding for the query
      const queryEmbedding = await this.embeddingService.generateEmbedding(query);

      // Calculate similarity scores
      const scoredDocs = this.documents
        .filter(doc => !apiFilter || doc.metadata.api.toLowerCase() === apiFilter.toLowerCase())
        .map(doc => ({
          document: doc,
          score: this.embeddingService.cosineSimilarity(queryEmbedding, doc.embedding),
        }))
        .sort((a, b) => b.score - a.score) // Sort by score descending
        .slice(0, limit)
        .map(item => item.document);

      return scoredDocs;
    } catch (error) {
      console.error('Error searching vector store:', error);
      return [];
    }
  }

  // Clear all documents
  clear(): void {
    this.documents = [];
    this.saveToDisk();
    console.log('✅ Vector store cleared');
  }

  // Get document count
  getDocumentCount(): number {
    return this.documents.length;
  }

  // Check if store is initialized
  isInitialized(): boolean {
    return this.documents.length > 0;
  }
}

