-- Migration: Create common functions and triggers
-- Description: Utility functions used across all tables

-- Function to automatically update updated_at timestamp
CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

COMMENT ON FUNCTION public.set_updated_at() IS 'Automatically sets updated_at to current timestamp on UPDATE';

-- Function to reset monthly task usage (called by cron job)
CREATE OR REPLACE FUNCTION public.reset_monthly_task_usage()
RETURNS void AS $$
BEGIN
    UPDATE public.subscriptions
    SET tasks_used_this_month = 0,
        updated_at = NOW()
    WHERE current_period_end <= NOW()
    AND status = 'active';
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

COMMENT ON FUNCTION public.reset_monthly_task_usage() IS 'Resets monthly task counter for subscriptions whose period has ended';

-- Function to increment template usage counter
CREATE OR REPLACE FUNCTION public.increment_template_usage(template_uuid UUID)
RETURNS void AS $$
BEGIN
    UPDATE public.templates
    SET usage_count = usage_count + 1
    WHERE id = template_uuid;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

COMMENT ON FUNCTION public.increment_template_usage(UUID) IS 'Increments the usage counter for a template';

-- Function to check if user has remaining task quota
CREATE OR REPLACE FUNCTION public.check_task_limit(user_uuid UUID)
RETURNS BOOLEAN AS $$
DECLARE
    sub_record RECORD;
BEGIN
    SELECT tasks_used_this_month, task_limit
    INTO sub_record
    FROM public.subscriptions
    WHERE user_id = user_uuid;
    
    IF sub_record IS NULL THEN
        RETURN FALSE;
    END IF;
    
    RETURN sub_record.tasks_used_this_month < sub_record.task_limit;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

COMMENT ON FUNCTION public.check_task_limit(UUID) IS 'Returns TRUE if user has remaining task quota for the month';

-- Function to increment task usage counter when task is created
CREATE OR REPLACE FUNCTION public.on_task_created()
RETURNS TRIGGER AS $$
BEGIN
    UPDATE public.subscriptions
    SET tasks_used_this_month = tasks_used_this_month + 1
    WHERE user_id = NEW.user_id;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

COMMENT ON FUNCTION public.on_task_created() IS 'Trigger function: increments monthly task usage when a task is created';

-- Function to handle new user signup (creates profile and default subscription)
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    -- Create user profile
    INSERT INTO public.users (id, email, auth_provider, email_verified)
    VALUES (
        NEW.id,
        NEW.email,
        COALESCE(NEW.raw_app_meta_data->>'provider', 'email'),
        COALESCE(NEW.email_confirmed_at IS NOT NULL, FALSE)
    );
    
    -- Create free subscription
    INSERT INTO public.subscriptions (user_id, plan, status, task_limit, storage_limit_bytes)
    VALUES (
        NEW.id,
        'free',
        'active',
        5,           -- Free plan: 5 tasks/month
        104857600    -- Free plan: 100MB storage
    );
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

COMMENT ON FUNCTION public.handle_new_user() IS 'Trigger function: creates user profile and default subscription on auth.users insert';
