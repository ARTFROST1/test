import { vi } from 'vitest'
import type { User, Session, AuthError } from '@supabase/supabase-js'

// Mock user data
export const mockUser: User = {
  id: 'test-user-id-123',
  app_metadata: {},
  user_metadata: { full_name: 'Test User' },
  aud: 'authenticated',
  email: 'test@example.com',
  email_confirmed_at: '2024-01-01T00:00:00Z',
  phone: null,
  confirmed_at: '2024-01-01T00:00:00Z',
  last_sign_in_at: '2024-01-01T00:00:00Z',
  role: 'authenticated',
  created_at: '2024-01-01T00:00:00Z',
  updated_at: '2024-01-01T00:00:00Z',
}

export const mockSession: Session = {
  access_token: 'mock-access-token',
  refresh_token: 'mock-refresh-token',
  expires_in: 3600,
  expires_at: Date.now() / 1000 + 3600,
  token_type: 'bearer',
  user: mockUser,
}

// Mock Supabase Auth
export const mockAuth = {
  signUp: vi.fn(),
  signInWithPassword: vi.fn(),
  signInWithOAuth: vi.fn(),
  signOut: vi.fn(),
  getSession: vi.fn(),
  getUser: vi.fn(),
  onAuthStateChange: vi.fn(() => ({
    data: { subscription: { unsubscribe: vi.fn() } },
  })),
  resetPasswordForEmail: vi.fn(),
  updateUser: vi.fn(),
}

// Mock Supabase Database operations
export const mockFrom = vi.fn(() => ({
  select: vi.fn(() => ({
    eq: vi.fn(() => ({
      single: vi.fn(() => Promise.resolve({ data: null, error: null })),
      maybeSingle: vi.fn(() => Promise.resolve({ data: null, error: null })),
      order: vi.fn(() => ({
        limit: vi.fn(() => Promise.resolve({ data: [], error: null, count: 0 })),
      })),
      range: vi.fn(() => Promise.resolve({ data: [], error: null, count: 0 })),
    })),
    single: vi.fn(() => Promise.resolve({ data: null, error: null })),
    order: vi.fn(() => ({
      limit: vi.fn(() => Promise.resolve({ data: [], error: null, count: 0 })),
      range: vi.fn(() => Promise.resolve({ data: [], error: null, count: 0 })),
    })),
    limit: vi.fn(() => Promise.resolve({ data: [], error: null })),
  })),
  insert: vi.fn(() => ({
    select: vi.fn(() => ({
      single: vi.fn(() => Promise.resolve({ data: { id: 'new-id' }, error: null })),
    })),
  })),
  update: vi.fn(() => ({
    eq: vi.fn(() => ({
      select: vi.fn(() => ({
        single: vi.fn(() => Promise.resolve({ data: null, error: null })),
      })),
    })),
  })),
  delete: vi.fn(() => ({
    eq: vi.fn(() => Promise.resolve({ data: null, error: null })),
  })),
  upsert: vi.fn(() => Promise.resolve({ data: null, error: null })),
}))

// Mock Supabase Storage
export const mockStorage = {
  from: vi.fn(() => ({
    upload: vi.fn(() => Promise.resolve({ data: { path: 'uploads/file.txt' }, error: null })),
    download: vi.fn(() => Promise.resolve({ data: new Blob(), error: null })),
    remove: vi.fn(() => Promise.resolve({ data: null, error: null })),
    list: vi.fn(() => Promise.resolve({ data: [], error: null })),
    getPublicUrl: vi.fn(() => ({ data: { publicUrl: 'https://storage.test/file.txt' } })),
  })),
}

// Mock Supabase Realtime
export const mockRealtime = {
  channel: vi.fn(() => ({
    on: vi.fn().mockReturnThis(),
    subscribe: vi.fn().mockReturnThis(),
    unsubscribe: vi.fn(),
  })),
  removeChannel: vi.fn(),
}

// Complete mock Supabase client
export const createMockSupabaseClient = () => ({
  auth: mockAuth,
  from: mockFrom,
  storage: mockStorage,
  channel: mockRealtime.channel,
  removeChannel: mockRealtime.removeChannel,
})

// Helper to reset all mocks
export const resetSupabaseMocks = () => {
  Object.values(mockAuth).forEach((fn) => {
    if (typeof fn === 'function' && 'mockReset' in fn) {
      fn.mockReset()
    }
  })
  mockFrom.mockClear()
}

// Helper to setup successful auth response
export const setupSuccessfulSignUp = () => {
  mockAuth.signUp.mockResolvedValue({
    data: {
      user: mockUser,
      session: mockSession,
    },
    error: null,
  })
}

export const setupSuccessfulSignIn = () => {
  mockAuth.signInWithPassword.mockResolvedValue({
    data: {
      user: mockUser,
      session: mockSession,
    },
    error: null,
  })
}

export const setupAuthError = (message: string) => {
  const error: AuthError = {
    name: 'AuthError',
    message,
    status: 400,
  }
  mockAuth.signInWithPassword.mockResolvedValue({
    data: { user: null, session: null },
    error,
  })
  mockAuth.signUp.mockResolvedValue({
    data: { user: null, session: null },
    error,
  })
}

export const setupSession = (session: Session | null = mockSession) => {
  mockAuth.getSession.mockResolvedValue({
    data: { session },
    error: null,
  })
}
