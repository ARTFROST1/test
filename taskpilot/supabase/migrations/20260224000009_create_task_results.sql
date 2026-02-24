-- Migration: Create task_results table
-- Description: Final results of completed tasks

CREATE TABLE public.task_results (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    task_id UUID NOT NULL REFERENCES public.tasks(id) ON DELETE CASCADE,
    content TEXT NOT NULL,
    content_format VARCHAR(20) NOT NULL DEFAULT 'markdown',
    metadata JSONB DEFAULT '{}',
    sources_used JSONB DEFAULT '[]',
    tokens_input INTEGER,
    tokens_output INTEGER,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    
    CONSTRAINT uq_task_results_task_id UNIQUE(task_id)
);

-- Indexes
CREATE INDEX idx_task_results_task_id ON public.task_results(task_id);
CREATE INDEX idx_task_results_created_at ON public.task_results(created_at DESC);

-- Constraints
ALTER TABLE public.task_results ADD CONSTRAINT chk_task_results_format 
    CHECK (content_format IN ('markdown', 'html', 'plain'));

-- Comments
COMMENT ON TABLE public.task_results IS 'Final results of completed tasks (one per task)';
COMMENT ON COLUMN public.task_results.content IS 'Result content in specified format';
COMMENT ON COLUMN public.task_results.content_format IS 'Content format: markdown, html, plain';
COMMENT ON COLUMN public.task_results.sources_used IS 'JSON array of sources used: [{type, name, url}]';
COMMENT ON COLUMN public.task_results.tokens_input IS 'Total input tokens used';
COMMENT ON COLUMN public.task_results.tokens_output IS 'Total output tokens generated';
