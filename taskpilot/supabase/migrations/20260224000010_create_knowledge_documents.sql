-- Migration: Create knowledge_documents table
-- Description: User-uploaded documents for RAG context

CREATE TABLE public.knowledge_documents (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    file_path VARCHAR(500) NOT NULL,
    file_type VARCHAR(20) NOT NULL,
    file_size INTEGER NOT NULL,
    folder VARCHAR(255),
    embedding_status VARCHAR(20) NOT NULL DEFAULT 'pending',
    chunk_count INTEGER DEFAULT 0,
    error_message TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    deleted_at TIMESTAMPTZ
);

-- Indexes
CREATE INDEX idx_knowledge_docs_user_id ON public.knowledge_documents(user_id);
CREATE INDEX idx_knowledge_docs_user_folder ON public.knowledge_documents(user_id, folder);
CREATE INDEX idx_knowledge_docs_embedding_status ON public.knowledge_documents(embedding_status);
CREATE INDEX idx_knowledge_docs_deleted_at ON public.knowledge_documents(deleted_at) WHERE deleted_at IS NULL;

-- Constraints
ALTER TABLE public.knowledge_documents ADD CONSTRAINT chk_knowledge_docs_file_type 
    CHECK (file_type IN ('txt', 'md', 'pdf', 'docx'));
ALTER TABLE public.knowledge_documents ADD CONSTRAINT chk_knowledge_docs_embedding_status 
    CHECK (embedding_status IN ('pending', 'processing', 'completed', 'failed'));
ALTER TABLE public.knowledge_documents ADD CONSTRAINT chk_knowledge_docs_file_size 
    CHECK (file_size > 0 AND file_size <= 10485760);

-- Trigger for updated_at
CREATE TRIGGER set_knowledge_docs_updated_at
    BEFORE UPDATE ON public.knowledge_documents
    FOR EACH ROW
    EXECUTE FUNCTION public.set_updated_at();

-- Comments
COMMENT ON TABLE public.knowledge_documents IS 'User-uploaded documents for knowledge base (RAG)';
COMMENT ON COLUMN public.knowledge_documents.file_path IS 'Path to file in Supabase Storage';
COMMENT ON COLUMN public.knowledge_documents.file_type IS 'File type: txt, md, pdf, docx';
COMMENT ON COLUMN public.knowledge_documents.embedding_status IS 'Embedding processing status: pending, processing, completed, failed';
COMMENT ON COLUMN public.knowledge_documents.chunk_count IS 'Number of text chunks after processing';
COMMENT ON COLUMN public.knowledge_documents.deleted_at IS 'Soft delete timestamp';
