-- Migration: Enable RLS and create policies
-- Description: Row Level Security policies for all user-facing tables

-- ============================================
-- ENABLE ROW LEVEL SECURITY
-- ============================================

ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.task_steps ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.task_results ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.knowledge_documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.document_embeddings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.usage_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.template_categories ENABLE ROW LEVEL SECURITY;

-- ============================================
-- USERS POLICIES
-- ============================================

-- Users can read only their own profile
CREATE POLICY "Users can view own profile"
    ON public.users FOR SELECT
    USING (auth.uid() = id);

-- Users can update only their own profile
CREATE POLICY "Users can update own profile"
    ON public.users FOR UPDATE
    USING (auth.uid() = id);

-- Service role can insert (for handle_new_user trigger)
CREATE POLICY "Service role can insert users"
    ON public.users FOR INSERT
    WITH CHECK (true);

-- ============================================
-- SUBSCRIPTIONS POLICIES
-- ============================================

-- Users can only view their own subscription
CREATE POLICY "Users can view own subscription"
    ON public.subscriptions FOR SELECT
    USING (auth.uid() = user_id);

-- Service role can manage subscriptions (for Stripe webhooks)
CREATE POLICY "Service role can insert subscriptions"
    ON public.subscriptions FOR INSERT
    WITH CHECK (true);

CREATE POLICY "Service role can update subscriptions"
    ON public.subscriptions FOR UPDATE
    USING (true);

-- ============================================
-- TASKS POLICIES
-- ============================================

-- Users can view their own non-deleted tasks
CREATE POLICY "Users can view own tasks"
    ON public.tasks FOR SELECT
    USING (auth.uid() = user_id AND deleted_at IS NULL);

-- Users can create tasks for themselves
CREATE POLICY "Users can create tasks"
    ON public.tasks FOR INSERT
    WITH CHECK (auth.uid() = user_id);

-- Users can update their own tasks
CREATE POLICY "Users can update own tasks"
    ON public.tasks FOR UPDATE
    USING (auth.uid() = user_id);

-- Users can delete (soft delete) their own tasks
CREATE POLICY "Users can delete own tasks"
    ON public.tasks FOR DELETE
    USING (auth.uid() = user_id);

-- ============================================
-- TASK STEPS POLICIES
-- ============================================

-- Users can view steps of their own tasks
CREATE POLICY "Users can view own task steps"
    ON public.task_steps FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM public.tasks
            WHERE tasks.id = task_steps.task_id
            AND tasks.user_id = auth.uid()
        )
    );

-- Service role can manage task steps (for AI execution)
CREATE POLICY "Service role can insert task steps"
    ON public.task_steps FOR INSERT
    WITH CHECK (true);

CREATE POLICY "Service role can update task steps"
    ON public.task_steps FOR UPDATE
    USING (true);

-- ============================================
-- TASK RESULTS POLICIES
-- ============================================

-- Users can view results of their own tasks
CREATE POLICY "Users can view own task results"
    ON public.task_results FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM public.tasks
            WHERE tasks.id = task_results.task_id
            AND tasks.user_id = auth.uid()
        )
    );

-- Service role can insert task results (for AI execution)
CREATE POLICY "Service role can insert task results"
    ON public.task_results FOR INSERT
    WITH CHECK (true);

-- ============================================
-- KNOWLEDGE DOCUMENTS POLICIES
-- ============================================

-- Users can view their own non-deleted documents
CREATE POLICY "Users can view own documents"
    ON public.knowledge_documents FOR SELECT
    USING (auth.uid() = user_id AND deleted_at IS NULL);

-- Users can upload documents for themselves
CREATE POLICY "Users can upload documents"
    ON public.knowledge_documents FOR INSERT
    WITH CHECK (auth.uid() = user_id);

-- Users can update their own documents
CREATE POLICY "Users can update own documents"
    ON public.knowledge_documents FOR UPDATE
    USING (auth.uid() = user_id);

-- Users can delete (soft delete) their own documents
CREATE POLICY "Users can delete own documents"
    ON public.knowledge_documents FOR DELETE
    USING (auth.uid() = user_id);

-- ============================================
-- DOCUMENT EMBEDDINGS POLICIES
-- ============================================

-- Users can view embeddings of their own documents
CREATE POLICY "Users can view own embeddings"
    ON public.document_embeddings FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM public.knowledge_documents
            WHERE knowledge_documents.id = document_embeddings.document_id
            AND knowledge_documents.user_id = auth.uid()
        )
    );

-- Service role can manage embeddings (for embedding pipeline)
CREATE POLICY "Service role can insert embeddings"
    ON public.document_embeddings FOR INSERT
    WITH CHECK (true);

CREATE POLICY "Service role can delete embeddings"
    ON public.document_embeddings FOR DELETE
    USING (true);

-- ============================================
-- USAGE LOGS POLICIES
-- ============================================

-- Users can view their own usage logs
CREATE POLICY "Users can view own usage logs"
    ON public.usage_logs FOR SELECT
    USING (auth.uid() = user_id);

-- Service role can insert usage logs
CREATE POLICY "Service role can insert usage logs"
    ON public.usage_logs FOR INSERT
    WITH CHECK (true);

-- ============================================
-- TEMPLATES POLICIES
-- ============================================

-- Anyone can view public active templates
CREATE POLICY "Anyone can view public templates"
    ON public.templates FOR SELECT
    USING (is_public = TRUE AND is_active = TRUE);

-- Users can view their own private templates
CREATE POLICY "Users can view own templates"
    ON public.templates FOR SELECT
    USING (created_by = auth.uid());

-- Users can create templates
CREATE POLICY "Users can create templates"
    ON public.templates FOR INSERT
    WITH CHECK (created_by = auth.uid() OR created_by IS NULL);

-- Users can update their own templates only
CREATE POLICY "Users can update own templates"
    ON public.templates FOR UPDATE
    USING (created_by = auth.uid());

-- Users can delete their own templates only
CREATE POLICY "Users can delete own templates"
    ON public.templates FOR DELETE
    USING (created_by = auth.uid());

-- ============================================
-- TEMPLATE CATEGORIES POLICIES
-- ============================================

-- Anyone can view active categories
CREATE POLICY "Anyone can view categories"
    ON public.template_categories FOR SELECT
    USING (is_active = TRUE);
