-- Migration: Create template_categories table
-- Description: Reference table for template categorization

CREATE TABLE public.template_categories (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(50) NOT NULL,
    slug VARCHAR(50) NOT NULL UNIQUE,
    description TEXT,
    icon VARCHAR(50),
    display_order INTEGER NOT NULL DEFAULT 0,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_template_categories_slug ON public.template_categories(slug);
CREATE INDEX idx_template_categories_active ON public.template_categories(is_active, display_order);

-- Comments
COMMENT ON TABLE public.template_categories IS 'Reference table for template categories';
COMMENT ON COLUMN public.template_categories.slug IS 'URL-friendly unique identifier';
COMMENT ON COLUMN public.template_categories.icon IS 'Icon identifier (e.g., Lucide icon name)';
COMMENT ON COLUMN public.template_categories.display_order IS 'Display order in UI';
