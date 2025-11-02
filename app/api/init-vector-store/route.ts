import { NextRequest, NextResponse } from 'next/server';
import { RAGService } from '@/lib/rag-service';

const ragService = new RAGService();

/**
 * API endpoint to initialize the vector store
 * POST /api/init-vector-store
 * This will populate the vector database with API documentation
 */
export async function POST(request: NextRequest) {
  try {
    console.log('🚀 Initializing vector store via API...');
    
    // Force re-initialization to ensure all platforms are included
    await ragService.initializeVectorStore(true);

    return NextResponse.json({
      success: true,
      message: 'Vector store initialized successfully',
      documentCount: ragService.isInitialized() ? 'Initialized' : 0,
    });
  } catch (error) {
    console.error('Error initializing vector store:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to initialize vector store',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}

/**
 * GET endpoint to check vector store status
 */
export async function GET() {
  try {
    const isInitialized = ragService.isInitialized();
    
    return NextResponse.json({
      initialized: isInitialized,
      message: isInitialized 
        ? 'Vector store is initialized' 
        : 'Vector store is not initialized. Call POST to initialize.',
    });
  } catch (error) {
    return NextResponse.json(
      {
        initialized: false,
        error: 'Error checking vector store status',
      },
      { status: 500 }
    );
  }
}

