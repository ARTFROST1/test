-- Migration: Create auth trigger for new user signup
-- Description: Automatically creates user profile and subscription on auth.users insert
--
-- NOTE: This trigger must be created via Supabase Dashboard SQL Editor
-- because it requires elevated permissions on the auth schema.
--
-- Run the following SQL in Supabase Dashboard → SQL Editor:
--
-- CREATE TRIGGER on_auth_user_created
--     AFTER INSERT ON auth.users
--     FOR EACH ROW
--     EXECUTE FUNCTION public.handle_new_user();
--
-- ALTERNATIVE: Use Supabase Auth Hooks (recommended for production)
-- See: https://supabase.com/docs/guides/auth/auth-hooks

-- The handle_new_user() function is already created in migration 000002.
-- It creates user profile and free subscription automatically.

-- Verify the function exists:
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_proc 
        WHERE proname = 'handle_new_user' 
        AND pronamespace = (SELECT oid FROM pg_namespace WHERE nspname = 'public')
    ) THEN
        RAISE EXCEPTION 'handle_new_user function not found. Run migration 000002 first.';
    END IF;
END $$;
