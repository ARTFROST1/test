-- Migration: Create templates table
-- Description: Task templates with parameters

CREATE TABLE public.templates (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(100) NOT NULL,
    description TEXT,
    category VARCHAR(50) NOT NULL,
    prompt_template TEXT NOT NULL,
    parameters JSONB NOT NULL DEFAULT '[]',
    example_output TEXT,
    usage_count INTEGER NOT NULL DEFAULT 0,
    avg_rating DECIMAL(3,2),
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    is_public BOOLEAN NOT NULL DEFAULT TRUE,
    created_by UUID REFERENCES public.users(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_templates_category ON public.templates(category);
CREATE INDEX idx_templates_is_active ON public.templates(is_active) WHERE is_active = TRUE;
CREATE INDEX idx_templates_is_public ON public.templates(is_public) WHERE is_public = TRUE;
CREATE INDEX idx_templates_usage_count ON public.templates(usage_count DESC);
CREATE INDEX idx_templates_created_by ON public.templates(created_by) WHERE created_by IS NOT NULL;
CREATE INDEX idx_templates_name_search ON public.templates USING gin(to_tsvector('english', name || ' ' || COALESCE(description, '')));

-- Constraints
ALTER TABLE public.templates ADD CONSTRAINT chk_templates_category 
    CHECK (category IN ('research', 'content', 'email', 'data_analysis', 'social_media', 'seo', 'other'));
ALTER TABLE public.templates ADD CONSTRAINT chk_templates_usage_count 
    CHECK (usage_count >= 0);
ALTER TABLE public.templates ADD CONSTRAINT chk_templates_rating 
    CHECK (avg_rating IS NULL OR (avg_rating >= 1 AND avg_rating <= 5));

-- Trigger for updated_at
CREATE TRIGGER set_templates_updated_at
    BEFORE UPDATE ON public.templates
    FOR EACH ROW
    EXECUTE FUNCTION public.set_updated_at();

-- Comments
COMMENT ON TABLE public.templates IS 'Task templates with customizable parameters';
COMMENT ON COLUMN public.templates.prompt_template IS 'Prompt template with {{parameter}} placeholders';
COMMENT ON COLUMN public.templates.parameters IS 'JSON array of parameter definitions: [{name, type, required, description, options, default}]';
COMMENT ON COLUMN public.templates.created_by IS 'NULL for system templates, user_id for custom templates';
