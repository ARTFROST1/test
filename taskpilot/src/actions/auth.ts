/**
 * Auth Server Actions
 * Actions for authentication operations
 */

'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'

export type AuthState = {
  error?: string
  success?: boolean
}

/**
 * Sign up with email and password
 */
export async function signUp(formData: FormData): Promise<AuthState>
export async function signUp(_prevState: AuthState, formData: FormData): Promise<AuthState>
export async function signUp(
  arg1: AuthState | FormData,
  arg2?: FormData
): Promise<AuthState> {
  const formData = arg2 ?? (arg1 as FormData)

  const email = formData.get('email') as string
  const password = formData.get('password') as string
  const fullName = formData.get('fullName') as string | null

  if (!email || !password) {
    return { error: 'Email and password are required' }
  }

  if (password.length < 8) {
    return { error: 'Password must be at least 8 characters' }
  }

  const supabase = await createClient()

  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        full_name: fullName,
      },
      emailRedirectTo: `${process.env.NEXT_PUBLIC_APP_URL}/api/auth/callback`,
    },
  })

  if (error) {
    console.error('Sign up error:', error)
    return { error: error.message }
  }

  if (data.user) {
    // Create user profile
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    await (supabase as any).from('users').insert({
      id: data.user.id,
      email: data.user.email!,
      full_name: fullName,
      auth_provider: 'email',
    })

    // Create default subscription
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    await (supabase as any).from('subscriptions').insert({
      user_id: data.user.id,
      plan: 'free',
      status: 'active',
      task_limit: 5,
      storage_limit_bytes: 104857600, // 100MB
    })
  }

  // Check if email confirmation is required
  if (data.user && !data.user.email_confirmed_at) {
    return { success: true } // User needs to confirm email
  }

  revalidatePath('/', 'layout')
  redirect('/dashboard')
}

/**
 * Sign in with email and password
 */
export async function signIn(formData: FormData): Promise<AuthState>
export async function signIn(_prevState: AuthState, formData: FormData): Promise<AuthState>
export async function signIn(
  arg1: AuthState | FormData,
  arg2?: FormData
): Promise<AuthState> {
  const formData = arg2 ?? (arg1 as FormData)

  const email = formData.get('email') as string
  const password = formData.get('password') as string

  if (!email || !password) {
    return { error: 'Email and password are required' }
  }

  const supabase = await createClient()

  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  })

  if (error) {
    console.error('Sign in error:', error)
    return { error: error.message }
  }

  revalidatePath('/', 'layout')
  redirect('/dashboard')
}

/**
 * Sign in with OAuth provider
 */
export async function signInWithOAuth(provider: 'google' | 'github'): Promise<AuthState> {
  const supabase = await createClient()

  const { data, error } = await supabase.auth.signInWithOAuth({
    provider,
    options: {
      redirectTo: `${process.env.NEXT_PUBLIC_APP_URL}/api/auth/callback`,
    },
  })

  if (error) {
    console.error('OAuth error:', error)
    return { error: error.message }
  }

  if (data.url) {
    redirect(data.url)
  }

  return { error: 'Failed to get OAuth URL' }
}

/**
 * Sign out
 */
export async function signOut(): Promise<void> {
  const supabase = await createClient()

  await supabase.auth.signOut()
  
  revalidatePath('/', 'layout')
  redirect('/login')
}

/**
 * Request password reset
 */
export async function resetPassword(formData: FormData): Promise<AuthState> {
  const email = formData.get('email') as string

  if (!email) {
    return { error: 'Email is required' }
  }

  const supabase = await createClient()

  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${process.env.NEXT_PUBLIC_APP_URL}/auth/update-password`,
  })

  if (error) {
    console.error('Password reset error:', error)
    return { error: error.message }
  }

  return { success: true }
}

/**
 * Update password
 */
export async function updatePassword(formData: FormData): Promise<AuthState> {
  const password = formData.get('password') as string
  const confirmPassword = formData.get('confirmPassword') as string

  if (!password || !confirmPassword) {
    return { error: 'Password is required' }
  }

  if (password !== confirmPassword) {
    return { error: 'Passwords do not match' }
  }

  if (password.length < 8) {
    return { error: 'Password must be at least 8 characters' }
  }

  const supabase = await createClient()

  const { error } = await supabase.auth.updateUser({
    password,
  })

  if (error) {
    console.error('Update password error:', error)
    return { error: error.message }
  }

  revalidatePath('/', 'layout')
  redirect('/dashboard')
}

/**
 * Get current user
 */
export async function getCurrentUser() {
  const supabase = await createClient()

  const { data: { user }, error } = await supabase.auth.getUser()

  if (error || !user) {
    return null
  }

  // Get user profile
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data: profile } = await (supabase as any)
    .from('users')
    .select('*')
    .eq('id', user.id)
    .single()

  return profile
}

/**
 * Update user profile
 */
export async function updateProfile(formData: FormData): Promise<AuthState> {
  const fullName = formData.get('fullName') as string | null
  const avatarUrl = formData.get('avatarUrl') as string | null

  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    return { error: 'Not authenticated' }
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { error } = await (supabase as any)
    .from('users')
    .update({
      full_name: fullName,
      avatar_url: avatarUrl,
    })
    .eq('id', user.id)

  if (error) {
    console.error('Update profile error:', error)
    return { error: error.message }
  }

  revalidatePath('/dashboard')
  return { success: true }
}
