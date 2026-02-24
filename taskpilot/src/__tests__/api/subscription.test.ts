/**
 * Subscription API Route Tests
 */
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { NextRequest } from 'next/server'

// Mock Supabase
const mockSupabaseClient = {
  auth: {
    getUser: vi.fn(),
  },
  from: vi.fn(),
}

vi.mock('@/lib/supabase/server', () => ({
  createClient: vi.fn(() => Promise.resolve(mockSupabaseClient)),
}))

// Mock Stripe
vi.mock('@/lib/stripe/client', () => ({
  stripe: {
    checkout: {
      sessions: {
        create: vi.fn(),
      },
    },
    billingPortal: {
      sessions: {
        create: vi.fn(),
      },
    },
  },
}))

describe('Subscription API', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('GET /api/subscription', () => {
    it('should return 401 if user is not authenticated', async () => {
      mockSupabaseClient.auth.getUser.mockResolvedValue({
        data: { user: null },
        error: null,
      })

      const { GET } = await import('@/app/api/subscription/route')
      const request = new NextRequest('http://localhost:3000/api/subscription')
      
      const response = await GET(request)
      const data = await response.json()

      expect(response.status).toBe(401)
      expect(data.error).toBe('Unauthorized')
    })

    it('should return subscription for authenticated user', async () => {
      mockSupabaseClient.auth.getUser.mockResolvedValue({
        data: { user: { id: 'user-123' } },
        error: null,
      })

      const mockSubscription = {
        id: 'sub-123',
        plan: 'pro',
        status: 'active',
        tasks_used_this_month: 15,
        task_limit: 50,
        storage_used_bytes: 52428800, // 50MB
        storage_limit_bytes: 1073741824, // 1GB
        current_period_start: '2024-01-01T00:00:00Z',
        current_period_end: '2024-02-01T00:00:00Z',
      }

      mockSupabaseClient.from.mockReturnValue({
        select: vi.fn().mockReturnValue({
          eq: vi.fn().mockReturnValue({
            single: vi.fn().mockResolvedValue({
              data: mockSubscription,
              error: null,
            }),
          }),
        }),
      })

      const { GET } = await import('@/app/api/subscription/route')
      const request = new NextRequest('http://localhost:3000/api/subscription')
      
      const response = await GET(request)
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data.subscription.plan).toBe('pro')
      expect(data.subscription.status).toBe('active')
      expect(data.limits.tasksUsed).toBe(15)
      expect(data.limits.tasksLimit).toBe(50)
      expect(data.limits.tasksRemaining).toBe(35)
    })

    it('should create default subscription if none exists', async () => {
      mockSupabaseClient.auth.getUser.mockResolvedValue({
        data: { user: { id: 'user-123' } },
        error: null,
      })

      const mockInsert = vi.fn().mockReturnValue({
        select: vi.fn().mockReturnValue({
          single: vi.fn().mockResolvedValue({
            data: {
              plan: 'free',
              status: 'active',
              tasks_used_this_month: 0,
              task_limit: 5,
            },
            error: null,
          }),
        }),
      })

      mockSupabaseClient.from.mockReturnValue({
        select: vi.fn().mockReturnValue({
          eq: vi.fn().mockReturnValue({
            single: vi.fn().mockResolvedValue({
              data: null,
              error: { code: 'PGRST116' },
            }),
          }),
        }),
        insert: mockInsert,
      })

      const { GET } = await import('@/app/api/subscription/route')
      const request = new NextRequest('http://localhost:3000/api/subscription')
      
      const response = await GET(request)

      expect(response.status).toBe(200)
    })
  })
})

describe('Subscription Checkout API (/api/subscription/checkout)', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('POST /api/subscription/checkout', () => {
    it('should return 401 if user is not authenticated', async () => {
      mockSupabaseClient.auth.getUser.mockResolvedValue({
        data: { user: null },
        error: null,
      })

      const { POST } = await import('@/app/api/subscription/checkout/route')
      const request = new NextRequest('http://localhost:3000/api/subscription/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ plan: 'pro' }),
      })
      
      const response = await POST(request)
      const data = await response.json()

      expect(response.status).toBe(401)
      expect(data.error).toBe('Unauthorized')
    })

    it('should return 400 for invalid plan', async () => {
      mockSupabaseClient.auth.getUser.mockResolvedValue({
        data: { user: { id: 'user-123', email: 'test@example.com' } },
        error: null,
      })

      mockSupabaseClient.from.mockReturnValue({
        select: vi.fn().mockReturnValue({
          eq: vi.fn().mockReturnValue({
            single: vi.fn().mockResolvedValue({
              data: { plan: 'free', stripe_customer_id: null },
              error: null,
            }),
          }),
        }),
      })

      const { POST } = await import('@/app/api/subscription/checkout/route')
      const request = new NextRequest('http://localhost:3000/api/subscription/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ plan: 'invalid' }),
      })
      
      const response = await POST(request)
      const data = await response.json()

      expect(response.status).toBe(400)
      expect(data.error).toContain('Invalid plan')
    })

    it('should return 400 for free plan checkout', async () => {
      mockSupabaseClient.auth.getUser.mockResolvedValue({
        data: { user: { id: 'user-123', email: 'test@example.com' } },
        error: null,
      })

      mockSupabaseClient.from.mockReturnValue({
        select: vi.fn().mockReturnValue({
          eq: vi.fn().mockReturnValue({
            single: vi.fn().mockResolvedValue({
              data: { plan: 'free', stripe_customer_id: null },
              error: null,
            }),
          }),
        }),
      })

      const { POST } = await import('@/app/api/subscription/checkout/route')
      const request = new NextRequest('http://localhost:3000/api/subscription/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ plan: 'free' }),
      })
      
      const response = await POST(request)
      const data = await response.json()

      expect(response.status).toBe(400)
      expect(data.error).toContain('free')
    })

    it('should create Stripe checkout session for valid plan', async () => {
      mockSupabaseClient.auth.getUser.mockResolvedValue({
        data: { user: { id: 'user-123', email: 'test@example.com' } },
        error: null,
      })

      mockSupabaseClient.from.mockReturnValue({
        select: vi.fn().mockReturnValue({
          eq: vi.fn().mockReturnValue({
            single: vi.fn().mockResolvedValue({
              data: { plan: 'free', stripe_customer_id: null },
              error: null,
            }),
          }),
        }),
      })

      const { stripe } = await import('@/lib/stripe/client')
      vi.mocked(stripe.checkout.sessions.create).mockResolvedValue({
        url: 'https://checkout.stripe.com/test-session',
      } as any)

      const { POST } = await import('@/app/api/subscription/checkout/route')
      const request = new NextRequest('http://localhost:3000/api/subscription/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ plan: 'pro' }),
      })
      
      const response = await POST(request)
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data.url).toBe('https://checkout.stripe.com/test-session')
    })
  })
})
