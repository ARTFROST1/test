/**
 * OAuth Callback Handler
 * Handles redirect from OAuth providers (Google, GitHub)
 */

import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get('code')
  const next = searchParams.get('next') ?? '/dashboard'
  const error = searchParams.get('error')
  const errorDescription = searchParams.get('error_description')

  // Handle OAuth error
  if (error) {
    console.error('OAuth error:', error, errorDescription)
    return NextResponse.redirect(
      `${origin}/login?error=${encodeURIComponent(errorDescription || error)}`
    )
  }

  if (!code) {
    return NextResponse.redirect(
      `${origin}/login?error=${encodeURIComponent('No authorization code provided')}`
    )
  }

  const supabase = await createClient()

  const { error: exchangeError } = await supabase.auth.exchangeCodeForSession(code)

  if (exchangeError) {
    console.error('Code exchange error:', exchangeError)
    return NextResponse.redirect(
      `${origin}/login?error=${encodeURIComponent('Failed to authenticate')}`
    )
  }

  // Get the user to check if profile exists
  const { data: { user } } = await supabase.auth.getUser()

  if (user) {
    // Check if user profile exists
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { data: profile } = await (supabase as any)
      .from('users')
      .select('id')
      .eq('id', user.id)
      .single()

    // If no profile, create one (first-time OAuth login)
    if (!profile) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const { error: profileError } = await (supabase as any)
        .from('users')
        .insert({
          id: user.id,
          email: user.email!,
          full_name: user.user_metadata?.full_name || user.user_metadata?.name || null,
          avatar_url: user.user_metadata?.avatar_url || user.user_metadata?.picture || null,
          auth_provider: user.app_metadata?.provider || 'email',
          email_verified: user.email_confirmed_at ? true : false,
        })

      if (profileError) {
        console.error('Profile creation error:', profileError)
      }

      // Create default subscription for new user
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const { error: subError } = await (supabase as any)
        .from('subscriptions')
        .insert({
          user_id: user.id,
          plan: 'free',
          status: 'active',
          task_limit: 5,
          storage_limit_bytes: 104857600, // 100MB
        })

      if (subError) {
        console.error('Subscription creation error:', subError)
      }

      // Redirect to onboarding for new users
      return NextResponse.redirect(`${origin}/onboarding`)
    }
  }

  // Redirect to the originally requested page or dashboard
  return NextResponse.redirect(`${origin}${next}`)
}
