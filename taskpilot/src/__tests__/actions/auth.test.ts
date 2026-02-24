/**
 * Auth Actions Tests
 * Tests for authentication server actions
 */
import { describe, it, expect, vi, beforeEach } from 'vitest'

// Mock Supabase before importing auth actions
vi.mock('@/lib/supabase/server', () => ({
  createClient: vi.fn(() => Promise.resolve({
    auth: {
      signUp: vi.fn(),
      signInWithPassword: vi.fn(),
      signOut: vi.fn(),
      getUser: vi.fn(),
    },
    from: vi.fn(() => ({
      insert: vi.fn(() => Promise.resolve({ data: null, error: null })),
      select: vi.fn(() => ({
        eq: vi.fn(() => ({
          single: vi.fn(() => Promise.resolve({ data: null, error: null })),
        })),
      })),
    })),
  })),
}))

// Mock redirect to prevent actual navigation
vi.mock('next/navigation', () => ({
  redirect: vi.fn(() => {
    throw new Error('NEXT_REDIRECT')
  }),
}))

vi.mock('next/cache', () => ({
  revalidatePath: vi.fn(),
}))

import { createClient } from '@/lib/supabase/server'

describe('Auth Actions', () => {
  let mockSupabase: any

  beforeEach(() => {
    vi.clearAllMocks()
    mockSupabase = {
      auth: {
        signUp: vi.fn(),
        signInWithPassword: vi.fn(),
        signOut: vi.fn(),
        getUser: vi.fn(),
      },
      from: vi.fn(() => ({
        insert: vi.fn(() => Promise.resolve({ data: null, error: null })),
        select: vi.fn(() => ({
          eq: vi.fn(() => ({
            single: vi.fn(() => Promise.resolve({ data: null, error: null })),
          })),
        })),
      })),
    }
    vi.mocked(createClient).mockResolvedValue(mockSupabase)
  })

  describe('signUp', () => {
    it('should return error if email is missing', async () => {
      const { signUp } = await import('@/actions/auth')
      const formData = new FormData()
      formData.append('password', 'password123')

      const result = await signUp(formData)

      expect(result.error).toBe('Email and password are required')
    })

    it('should return error if password is missing', async () => {
      const { signUp } = await import('@/actions/auth')
      const formData = new FormData()
      formData.append('email', 'test@example.com')

      const result = await signUp(formData)

      expect(result.error).toBe('Email and password are required')
    })

    it('should return error if password is too short', async () => {
      const { signUp } = await import('@/actions/auth')
      const formData = new FormData()
      formData.append('email', 'test@example.com')
      formData.append('password', '123')

      const result = await signUp(formData)

      expect(result.error).toBe('Password must be at least 8 characters')
    })

    it('should call supabase auth signUp with correct params', async () => {
      mockSupabase.auth.signUp.mockResolvedValue({
        data: { user: { id: 'user-123', email_confirmed_at: null }, session: null },
        error: null,
      })

      const { signUp } = await import('@/actions/auth')
      const formData = new FormData()
      formData.append('email', 'test@example.com')
      formData.append('password', 'password123')
      formData.append('fullName', 'Test User')

      const result = await signUp(formData)

      expect(result.success).toBe(true)
      expect(mockSupabase.auth.signUp).toHaveBeenCalledWith({
        email: 'test@example.com',
        password: 'password123',
        options: expect.objectContaining({
          data: { full_name: 'Test User' },
        }),
      })
    })

    it('should return error message from Supabase on failure', async () => {
      mockSupabase.auth.signUp.mockResolvedValue({
        data: { user: null, session: null },
        error: { message: 'Email already registered' },
      })

      const { signUp } = await import('@/actions/auth')
      const formData = new FormData()
      formData.append('email', 'existing@example.com')
      formData.append('password', 'password123')

      const result = await signUp(formData)

      expect(result.error).toBe('Email already registered')
    })
  })

  describe('signIn', () => {
    it('should return error if email is missing', async () => {
      const { signIn } = await import('@/actions/auth')
      const formData = new FormData()
      formData.append('password', 'password123')

      const result = await signIn(formData)

      expect(result.error).toBe('Email and password are required')
    })

    it('should return error if password is missing', async () => {
      const { signIn } = await import('@/actions/auth')
      const formData = new FormData()
      formData.append('email', 'test@example.com')

      const result = await signIn(formData)

      expect(result.error).toBe('Email and password are required')
    })

    it('should call supabase auth signInWithPassword', async () => {
      mockSupabase.auth.signInWithPassword.mockResolvedValue({
        data: { user: { id: 'user-123' }, session: {} },
        error: null,
      })

      const { signIn } = await import('@/actions/auth')
      const formData = new FormData()
      formData.append('email', 'test@example.com')
      formData.append('password', 'password123')

      try {
        await signIn(formData)
      } catch (e: any) {
        // Expected redirect
        expect(e.message).toBe('NEXT_REDIRECT')
      }

      expect(mockSupabase.auth.signInWithPassword).toHaveBeenCalledWith({
        email: 'test@example.com',
        password: 'password123',
      })
    })

    it('should return error on invalid credentials', async () => {
      mockSupabase.auth.signInWithPassword.mockResolvedValue({
        data: { user: null, session: null },
        error: { message: 'Invalid login credentials' },
      })

      const { signIn } = await import('@/actions/auth')
      const formData = new FormData()
      formData.append('email', 'wrong@example.com')
      formData.append('password', 'wrongpassword')

      const result = await signIn(formData)

      expect(result.error).toBe('Invalid login credentials')
    })
  })

  describe('signOut', () => {
    it('should call supabase auth signOut', async () => {
      mockSupabase.auth.signOut.mockResolvedValue({ error: null })

      const { signOut } = await import('@/actions/auth')

      try {
        await signOut()
      } catch (e: any) {
        // Expected redirect
        expect(e.message).toBe('NEXT_REDIRECT')
      }

      expect(mockSupabase.auth.signOut).toHaveBeenCalled()
    })
  })
})
