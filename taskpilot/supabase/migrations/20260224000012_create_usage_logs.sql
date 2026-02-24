-- Migration: Create usage_logs table
-- Description: Event logging for billing, analytics, and usage tracking

CREATE TABLE public.usage_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    event_type VARCHAR(50) NOT NULL,
    resource_id UUID,
    resource_type VARCHAR(50),
    metadata JSONB DEFAULT '{}',
    tokens_used INTEGER DEFAULT 0,
    cost_usd DECIMAL(10,6) DEFAULT 0,
    ip_address INET,
    user_agent TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_usage_logs_user_id ON public.usage_logs(user_id);
CREATE INDEX idx_usage_logs_user_created ON public.usage_logs(user_id, created_at DESC);
CREATE INDEX idx_usage_logs_event_type ON public.usage_logs(event_type);
CREATE INDEX idx_usage_logs_created_at ON public.usage_logs(created_at DESC);
CREATE INDEX idx_usage_logs_resource ON public.usage_logs(resource_type, resource_id) 
    WHERE resource_id IS NOT NULL;

-- Constraints
ALTER TABLE public.usage_logs ADD CONSTRAINT chk_usage_logs_event_type 
    CHECK (event_type IN (
        'task_created', 'task_completed', 'task_failed',
        'document_uploaded', 'document_deleted',
        'template_used',
        'export_markdown', 'export_pdf',
        'subscription_upgraded', 'subscription_downgraded', 'subscription_canceled',
        'login', 'logout',
        'api_call'
    ));
ALTER TABLE public.usage_logs ADD CONSTRAINT chk_usage_logs_resource_type 
    CHECK (resource_type IS NULL OR resource_type IN ('task', 'document', 'template', 'subscription'));

-- Comments
COMMENT ON TABLE public.usage_logs IS 'Event logging for billing and analytics';
COMMENT ON COLUMN public.usage_logs.event_type IS 'Type of event logged';
COMMENT ON COLUMN public.usage_logs.resource_id IS 'ID of related resource (task, document, etc)';
COMMENT ON COLUMN public.usage_logs.resource_type IS 'Type of resource: task, document, template, subscription';
COMMENT ON COLUMN public.usage_logs.tokens_used IS 'AI tokens consumed by this action';
COMMENT ON COLUMN public.usage_logs.cost_usd IS 'Computed cost in USD';
