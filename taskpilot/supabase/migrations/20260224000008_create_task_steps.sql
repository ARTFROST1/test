-- Migration: Create task_steps table
-- Description: Decomposed steps for task execution

CREATE TABLE public.task_steps (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    task_id UUID NOT NULL REFERENCES public.tasks(id) ON DELETE CASCADE,
    title VARCHAR(200) NOT NULL,
    description TEXT,
    order_index INTEGER NOT NULL,
    status VARCHAR(20) NOT NULL DEFAULT 'pending',
    estimated_time_seconds INTEGER,
    actual_time_seconds INTEGER,
    output TEXT,
    error_message TEXT,
    started_at TIMESTAMPTZ,
    completed_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    
    CONSTRAINT uq_task_steps_task_order UNIQUE(task_id, order_index)
);

-- Indexes
CREATE INDEX idx_task_steps_task_id ON public.task_steps(task_id);
CREATE INDEX idx_task_steps_task_status ON public.task_steps(task_id, status);
CREATE INDEX idx_task_steps_status ON public.task_steps(status);

-- Constraints
ALTER TABLE public.task_steps ADD CONSTRAINT chk_task_steps_status 
    CHECK (status IN ('pending', 'in_progress', 'completed', 'failed', 'skipped'));
ALTER TABLE public.task_steps ADD CONSTRAINT chk_task_steps_order 
    CHECK (order_index >= 0);

-- Trigger for updated_at
CREATE TRIGGER set_task_steps_updated_at
    BEFORE UPDATE ON public.task_steps
    FOR EACH ROW
    EXECUTE FUNCTION public.set_updated_at();

-- Comments
COMMENT ON TABLE public.task_steps IS 'Decomposed steps for task execution';
COMMENT ON COLUMN public.task_steps.order_index IS 'Execution order within task (0-based)';
COMMENT ON COLUMN public.task_steps.status IS 'Step status: pending, in_progress, completed, failed, skipped';
COMMENT ON COLUMN public.task_steps.output IS 'Step execution output/result';
COMMENT ON COLUMN public.task_steps.error_message IS 'Error message if step failed';
