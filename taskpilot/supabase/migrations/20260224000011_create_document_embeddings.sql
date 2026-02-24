-- Migration: Create document_embeddings table
-- Description: Vector embeddings for semantic search (requires pgvector)

CREATE TABLE public.document_embeddings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    document_id UUID NOT NULL REFERENCES public.knowledge_documents(id) ON DELETE CASCADE,
    chunk_index INTEGER NOT NULL,
    content TEXT NOT NULL,
    embedding vector(1536),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    
    CONSTRAINT uq_embeddings_doc_chunk UNIQUE(document_id, chunk_index)
);

-- Indexes
CREATE INDEX idx_embeddings_document_id ON public.document_embeddings(document_id);

-- Vector similarity search index (IVFFlat for approximate nearest neighbor)
-- Note: This index requires at least 100 rows to be effective
-- For production, consider HNSW index for better performance
CREATE INDEX idx_embeddings_vector ON public.document_embeddings 
    USING ivfflat (embedding vector_cosine_ops) WITH (lists = 100);

-- Constraint
ALTER TABLE public.document_embeddings ADD CONSTRAINT chk_embeddings_chunk_index 
    CHECK (chunk_index >= 0);

-- Comments
COMMENT ON TABLE public.document_embeddings IS 'Vector embeddings for document chunks (pgvector)';
COMMENT ON COLUMN public.document_embeddings.chunk_index IS 'Sequential index of chunk within document';
COMMENT ON COLUMN public.document_embeddings.content IS 'Text content of the chunk';
COMMENT ON COLUMN public.document_embeddings.embedding IS 'OpenAI text-embedding-ada-002 vector (1536 dimensions)';

-- Function for semantic search across user's documents
CREATE OR REPLACE FUNCTION public.search_knowledge(
    user_uuid UUID,
    query_embedding vector(1536),
    match_count INTEGER DEFAULT 5,
    match_threshold FLOAT DEFAULT 0.7
)
RETURNS TABLE (
    document_id UUID,
    document_name TEXT,
    chunk_content TEXT,
    chunk_index INTEGER,
    similarity FLOAT
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        kd.id as document_id,
        kd.name::TEXT as document_name,
        de.content as chunk_content,
        de.chunk_index,
        (1 - (de.embedding <=> query_embedding))::FLOAT as similarity
    FROM public.document_embeddings de
    JOIN public.knowledge_documents kd ON kd.id = de.document_id
    WHERE kd.user_id = user_uuid
      AND kd.deleted_at IS NULL
      AND de.embedding IS NOT NULL
      AND (1 - (de.embedding <=> query_embedding)) > match_threshold
    ORDER BY de.embedding <=> query_embedding
    LIMIT match_count;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

COMMENT ON FUNCTION public.search_knowledge(UUID, vector(1536), INTEGER, FLOAT) 
    IS 'Semantic search across user documents using cosine similarity';
