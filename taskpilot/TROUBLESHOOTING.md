# TaskPilot Troubleshooting Guide

## Common Issues and Solutions

### 1. "Fail to Fetch" Error on Login/Signup

This error typically indicates a network issue between your app and Supabase.

#### Causes and Solutions:

##### A. Missing or Incorrect Environment Variables

**On Vercel:**
1. Go to your Vercel project dashboard
2. Navigate to Settings → Environment Variables
3. Ensure these variables are set:
   - `NEXT_PUBLIC_SUPABASE_URL` - Your Supabase project URL (e.g., `https://xxx.supabase.co`)
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY` - Your Supabase anon/public key
   - `SUPABASE_SERVICE_ROLE_KEY` - Your Supabase service role key (for server-side operations)

**Local Development:**
1. Copy `.env.example` to `.env.local`
2. Fill in your Supabase credentials from the Supabase Dashboard

##### B. Supabase Project Paused (Free Tier)

Free tier Supabase projects pause after 7 days of inactivity.

**Solution:**
1. Go to [Supabase Dashboard](https://supabase.com/dashboard)
2. Select your project
3. If paused, click "Resume Project"
4. Wait 1-2 minutes for the project to become active

##### C. CORS / Redirect URL Configuration

Supabase needs to know your app's URL for authentication to work.

**Solution:**
1. Go to Supabase Dashboard → Authentication → URL Configuration
2. Set **Site URL** to your production URL:
   - `https://your-app.vercel.app`
3. Add **Redirect URLs**:
   - `https://your-app.vercel.app/**`
   - `http://localhost:3000/**` (for local development)

##### D. Database Tables Not Created

The database schema might not be applied.

**Solution:**
1. Go to Supabase Dashboard → SQL Editor
2. Run migrations from `supabase/migrations/` folder in order:
   ```sql
   -- Run each migration file in numerical order
   -- 20260224000001_init_extensions.sql
   -- 20260224000002_create_functions.sql
   -- ... etc
   ```

##### E. Auth Trigger Not Created

The trigger that creates user profiles on signup might be missing.

**Solution:**
1. Go to Supabase Dashboard → SQL Editor
2. Run this SQL:
   ```sql
   CREATE TRIGGER on_auth_user_created
       AFTER INSERT ON auth.users
       FOR EACH ROW
       EXECUTE FUNCTION public.handle_new_user();
   ```

### 2. Diagnostic Page

Visit `/debug` in your app to run connection diagnostics:

```
https://your-app.vercel.app/debug
```

This page will check:
- Environment variables present
- Supabase connection
- Database query capability
- Auth endpoint accessibility

### 3. RLS (Row Level Security) Issues

If you can connect but get empty results or permission errors:

**Check RLS Policies:**
```sql
-- View all policies
SELECT * FROM pg_policies;

-- Temporarily disable RLS for testing (NOT for production!)
ALTER TABLE public.users DISABLE ROW LEVEL SECURITY;
```

### 4. Stripe Integration Issues

##### Webhook Not Working:

1. Go to Stripe Dashboard → Developers → Webhooks
2. Add endpoint: `https://your-app.vercel.app/api/webhooks/stripe`
3. Select events:
   - `checkout.session.completed`
   - `customer.subscription.created`
   - `customer.subscription.updated`
   - `customer.subscription.deleted`
4. Copy the webhook signing secret
5. Add to Vercel: `STRIPE_WEBHOOK_SECRET`

##### Checkout Not Redirecting:

1. Ensure `NEXT_PUBLIC_APP_URL` is set correctly in Vercel
2. Check that Stripe price IDs are correct in `src/lib/constants/pricing.ts`

### 5. Build Errors

##### TypeScript Errors:

```bash
# Check for type errors
npm run build

# If errors, try:
npm run lint -- --fix
```

##### Module Not Found:

```bash
# Clear cache and reinstall
rm -rf node_modules .next
npm install
npm run dev
```

### 6. Running Tests

```bash
# Unit tests
npm run test

# Unit tests with coverage
npm run test:coverage

# E2E tests (requires app running)
npm run dev  # In one terminal
npm run test:e2e  # In another terminal

# E2E with UI
npm run test:e2e:ui
```

### 7. Debug Checklist

1. [ ] Environment variables set correctly
2. [ ] Supabase project active (not paused)
3. [ ] Site URL configured in Supabase
4. [ ] Redirect URLs added in Supabase
5. [ ] Database migrations applied
6. [ ] Auth trigger created
7. [ ] RLS policies correct
8. [ ] Stripe webhook configured
9. [ ] Build passes without errors

### 8. Getting Help

If you're still experiencing issues:

1. Check browser Network tab for specific error responses
2. Check Vercel Functions logs
3. Check Supabase logs (Dashboard → Logs)
4. Run the diagnostic page at `/debug`

### Quick Environment Variable Reference

```env
# Required - Public (exposed to browser)
NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...
NEXT_PUBLIC_APP_URL=https://your-app.vercel.app

# Required - Server only
SUPABASE_SERVICE_ROLE_KEY=eyJ...

# Stripe (required for payments)
STRIPE_SECRET_KEY=sk_live_...
STRIPE_WEBHOOK_SECRET=whsec_...
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_...

# AI (required for task execution)
OPENAI_API_KEY=sk-...
ANTHROPIC_API_KEY=sk-ant-...
```
