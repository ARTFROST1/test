-- Migration: Create tasks table
-- Description: Core entity - user tasks for AI delegation

CREATE TABLE public.tasks (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    template_id UUID REFERENCES public.templates(id) ON DELETE SET NULL,
    title VARCHAR(200) NOT NULL,
    description TEXT NOT NULL,
    status VARCHAR(20) NOT NULL DEFAULT 'pending',
    progress INTEGER NOT NULL DEFAULT 0,
    estimated_time_seconds INTEGER,
    actual_time_seconds INTEGER,
    use_knowledge_base BOOLEAN NOT NULL DEFAULT TRUE,
    template_params JSONB,
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    started_at TIMESTAMPTZ,
    completed_at TIMESTAMPTZ,
    deleted_at TIMESTAMPTZ
);

-- Indexes
CREATE INDEX idx_tasks_user_id ON public.tasks(user_id);
CREATE INDEX idx_tasks_user_id_status ON public.tasks(user_id, status);
CREATE INDEX idx_tasks_status ON public.tasks(status);
CREATE INDEX idx_tasks_template_id ON public.tasks(template_id) WHERE template_id IS NOT NULL;
CREATE INDEX idx_tasks_created_at ON public.tasks(created_at DESC);
CREATE INDEX idx_tasks_user_created ON public.tasks(user_id, created_at DESC);
CREATE INDEX idx_tasks_deleted_at ON public.tasks(deleted_at) WHERE deleted_at IS NULL;

-- Constraints
ALTER TABLE public.tasks ADD CONSTRAINT chk_tasks_progress 
    CHECK (progress >= 0 AND progress <= 100);
ALTER TABLE public.tasks ADD CONSTRAINT chk_tasks_description_length 
    CHECK (char_length(description) >= 10 AND char_length(description) <= 2000);
ALTER TABLE public.tasks ADD CONSTRAINT chk_tasks_status 
    CHECK (status IN ('pending', 'decomposing', 'executing', 'paused', 'completed', 'failed', 'canceled'));

-- Trigger for updated_at
CREATE TRIGGER set_tasks_updated_at
    BEFORE UPDATE ON public.tasks
    FOR EACH ROW
    EXECUTE FUNCTION public.set_updated_at();

-- Trigger to increment monthly task usage
CREATE TRIGGER trg_task_created
    AFTER INSERT ON public.tasks
    FOR EACH ROW
    EXECUTE FUNCTION public.on_task_created();

-- Comments
COMMENT ON TABLE public.tasks IS 'User tasks delegated to AI for execution';
COMMENT ON COLUMN public.tasks.status IS 'Task status flow: pending → decomposing → executing → completed/failed/canceled';
COMMENT ON COLUMN public.tasks.progress IS 'Execution progress percentage 0-100';
COMMENT ON COLUMN public.tasks.use_knowledge_base IS 'Whether to use user knowledge base for context';
COMMENT ON COLUMN public.tasks.template_params IS 'Parameters passed to template (if template_id is set)';
COMMENT ON COLUMN public.tasks.metadata IS 'Additional metadata: {source, ai_model, etc}';
COMMENT ON COLUMN public.tasks.deleted_at IS 'Soft delete timestamp';
