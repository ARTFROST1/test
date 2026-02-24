-- Migration: Enable required PostgreSQL extensions
-- Description: Initialize pgvector and other required extensions for TaskPilot

-- Enable pgvector for embedding storage and similarity search
CREATE EXTENSION IF NOT EXISTS vector;

-- Enable pg_trgm for fuzzy text search (optional, useful for template search)
CREATE EXTENSION IF NOT EXISTS pg_trgm;

-- Comment
COMMENT ON EXTENSION vector IS 'vector data type and ivfflat and hnsw access methods';
