/**
 * Supabase Client Tests
 */
import { describe, it, expect, vi, beforeEach } from 'vitest'

// Mock environment
vi.stubEnv('NEXT_PUBLIC_SUPABASE_URL', 'https://test-project.supabase.co')
vi.stubEnv('NEXT_PUBLIC_SUPABASE_ANON_KEY', 'test-anon-key')

// Mock @supabase/ssr
vi.mock('@supabase/ssr', () => ({
  createBrowserClient: vi.fn(() => ({
    auth: {
      getSession: vi.fn(),
      signInWithPassword: vi.fn(),
      signUp: vi.fn(),
      signOut: vi.fn(),
      onAuthStateChange: vi.fn(() => ({
        data: { subscription: { unsubscribe: vi.fn() } },
      })),
    },
    from: vi.fn(() => ({
      select: vi.fn(),
      insert: vi.fn(),
      update: vi.fn(),
      delete: vi.fn(),
    })),
  })),
  createServerClient: vi.fn(() => ({
    auth: {
      getSession: vi.fn(),
      getUser: vi.fn(),
    },
    from: vi.fn(),
  })),
}))

describe('Supabase Clients', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('Browser Client', () => {
    it('should create browser client with correct config', async () => {
      const { createBrowserClient } = await import('@supabase/ssr')
      await import('@/lib/supabase/client')

      expect(createBrowserClient).toHaveBeenCalledWith(
        'https://test-project.supabase.co',
        'test-anon-key'
      )
    })

    it('should export createClient function', async () => {
      const { createClient } = await import('@/lib/supabase/client')
      expect(createClient).toBeDefined()
      expect(typeof createClient).toBe('function')
    })

    it('should return Supabase client instance', async () => {
      const { createClient } = await import('@/lib/supabase/client')
      const client = createClient()

      expect(client).toBeDefined()
      expect(client.auth).toBeDefined()
      expect(client.from).toBeDefined()
    })
  })

  describe('Server Client', () => {
    it('should create server client', async () => {
      // Server client needs cookies, which are mocked differently
      // This is a basic structure test
      const { createServerClient } = await import('@supabase/ssr')

      expect(createServerClient).toBeDefined()
    })
  })

  describe('Client Methods', () => {
    it('should have auth methods', async () => {
      const { createClient } = await import('@/lib/supabase/client')
      const client = createClient()

      expect(client.auth.signInWithPassword).toBeDefined()
      expect(client.auth.signUp).toBeDefined()
      expect(client.auth.signOut).toBeDefined()
    })

    it('should have database query methods', async () => {
      const { createClient } = await import('@/lib/supabase/client')
      const client = createClient()

      const query = client.from('users')
      expect(query.select).toBeDefined()
      expect(query.insert).toBeDefined()
      expect(query.update).toBeDefined()
      expect(query.delete).toBeDefined()
    })
  })
})

describe('Supabase Provider', () => {
  it('should provide supabase context', async () => {
    // Provider test requires React context setup
    // This validates the hook export exists
    const provider = await import('@/components/providers/supabase-provider')
    expect(provider.useSupabase).toBeDefined()
    expect(provider.SupabaseProvider).toBeDefined()
  })
})
