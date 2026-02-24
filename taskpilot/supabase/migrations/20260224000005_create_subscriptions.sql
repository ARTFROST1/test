-- Migration: Create subscriptions table
-- Description: User subscriptions and billing information

CREATE TABLE public.subscriptions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    plan VARCHAR(20) NOT NULL DEFAULT 'free',
    status VARCHAR(20) NOT NULL DEFAULT 'active',
    stripe_customer_id VARCHAR(100),
    stripe_subscription_id VARCHAR(100),
    current_period_start TIMESTAMPTZ,
    current_period_end TIMESTAMPTZ,
    tasks_used_this_month INTEGER NOT NULL DEFAULT 0,
    task_limit INTEGER NOT NULL DEFAULT 5,
    storage_used_bytes BIGINT NOT NULL DEFAULT 0,
    storage_limit_bytes BIGINT NOT NULL DEFAULT 104857600,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    
    CONSTRAINT uq_subscriptions_user_id UNIQUE(user_id)
);

-- Indexes
CREATE INDEX idx_subscriptions_user_id ON public.subscriptions(user_id);
CREATE INDEX idx_subscriptions_status ON public.subscriptions(status);
CREATE INDEX idx_subscriptions_stripe_customer_id ON public.subscriptions(stripe_customer_id) 
    WHERE stripe_customer_id IS NOT NULL;
CREATE INDEX idx_subscriptions_current_period_end ON public.subscriptions(current_period_end);

-- Constraints
ALTER TABLE public.subscriptions ADD CONSTRAINT chk_subscriptions_plan 
    CHECK (plan IN ('free', 'pro', 'business'));
ALTER TABLE public.subscriptions ADD CONSTRAINT chk_subscriptions_status 
    CHECK (status IN ('active', 'canceled', 'past_due', 'trialing', 'paused'));
ALTER TABLE public.subscriptions ADD CONSTRAINT chk_subscriptions_tasks_used 
    CHECK (tasks_used_this_month >= 0);
ALTER TABLE public.subscriptions ADD CONSTRAINT chk_subscriptions_task_limit 
    CHECK (task_limit > 0);

-- Trigger for updated_at
CREATE TRIGGER set_subscriptions_updated_at
    BEFORE UPDATE ON public.subscriptions
    FOR EACH ROW
    EXECUTE FUNCTION public.set_updated_at();

-- Comments
COMMENT ON TABLE public.subscriptions IS 'User subscription and billing information';
COMMENT ON COLUMN public.subscriptions.plan IS 'Subscription plan: free, pro, business';
COMMENT ON COLUMN public.subscriptions.status IS 'Subscription status: active, canceled, past_due, trialing, paused';
COMMENT ON COLUMN public.subscriptions.task_limit IS 'Monthly task limit based on plan: free=5, pro=50, business=200';
COMMENT ON COLUMN public.subscriptions.storage_limit_bytes IS 'Storage limit: free=100MB, pro=1GB, business=10GB';
