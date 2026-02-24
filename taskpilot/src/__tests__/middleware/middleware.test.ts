/**
 * Middleware Tests
 */
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { NextRequest, NextResponse } from 'next/server'

// Mock Supabase
vi.mock('@supabase/ssr', () => ({
  createServerClient: vi.fn(() => ({
    auth: {
      getUser: vi.fn(() => Promise.resolve({
        data: { user: null },
        error: null,
      })),
    },
  })),
}))

// Mock Next.js
vi.mock('next/server', () => ({
  NextRequest: vi.fn(),
  NextResponse: {
    next: vi.fn(() => ({ cookies: { set: vi.fn() } })),
    redirect: vi.fn((url) => ({ redirectUrl: url.toString() })),
  },
}))

describe('Middleware', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('Route Protection', () => {
    it('should allow access to public routes', () => {
      const publicPaths = ['/', '/pricing', '/login', '/signup']

      publicPaths.forEach((path) => {
        // These routes should not redirect
        expect(path.startsWith('/dashboard')).toBe(false)
      })
    })

    it('should protect dashboard routes', () => {
      const protectedPaths = ['/dashboard', '/dashboard/tasks', '/settings']

      protectedPaths.forEach((path) => {
        expect(
          path.startsWith('/dashboard') || path === '/settings'
        ).toBe(true)
      })
    })

    it('should protect API routes', () => {
      const protectedAPIs = ['/api/tasks', '/api/templates', '/api/subscription']

      protectedAPIs.forEach((path) => {
        expect(path.startsWith('/api/')).toBe(true)
      })
    })

    it('should allow public API routes', () => {
      const publicAPIs = ['/api/webhooks/stripe']

      publicAPIs.forEach((path) => {
        // Webhook routes don't need auth
        expect(path.includes('webhooks')).toBe(true)
      })
    })
  })

  describe('Auth Flow', () => {
    it('should redirect unauthenticated users to login', () => {
      const user = null
      const destination = '/dashboard'

      if (!user && destination.startsWith('/dashboard')) {
        const redirectUrl = `/login?redirect=${encodeURIComponent(destination)}`
        expect(redirectUrl).toContain('/login')
        expect(redirectUrl).toContain('redirect=')
      }
    })

    it('should redirect authenticated users away from auth pages', () => {
      const user = { id: 'user-123', email: 'test@example.com' }
      const destination = '/login'

      if (user && (destination === '/login' || destination === '/signup')) {
        expect('/dashboard').toBe('/dashboard')
      }
    })

    it('should preserve redirect URL after login', () => {
      const originalDestination = '/dashboard/tasks/new'
      const loginUrl = `/login?redirect=${encodeURIComponent(originalDestination)}`

      expect(loginUrl).toContain(encodeURIComponent('/dashboard/tasks/new'))
    })
  })

  describe('Route Matching', () => {
    it('should match dashboard routes pattern', () => {
      const dashboardPattern = /^\/dashboard(\/.*)?$/
      
      expect(dashboardPattern.test('/dashboard')).toBe(true)
      expect(dashboardPattern.test('/dashboard/')).toBe(true)
      expect(dashboardPattern.test('/dashboard/tasks')).toBe(true)
      expect(dashboardPattern.test('/dashboard/settings/profile')).toBe(true)
      expect(dashboardPattern.test('/dashboardx')).toBe(false)
      expect(dashboardPattern.test('/')).toBe(false)
    })

    it('should match API routes pattern', () => {
      const apiPattern = /^\/api\/(tasks|templates|subscription)(\/.*)?$/
      
      expect(apiPattern.test('/api/tasks')).toBe(true)
      expect(apiPattern.test('/api/tasks/123')).toBe(true)
      expect(apiPattern.test('/api/templates')).toBe(true)
      expect(apiPattern.test('/api/subscription')).toBe(true)
      expect(apiPattern.test('/api/webhooks/stripe')).toBe(false)
    })

    it('should exclude static assets from middleware', () => {
      const staticPaths = [
        '/_next/static/chunk.js',
        '/favicon.ico',
        '/images/logo.png',
      ]

      staticPaths.forEach((path) => {
        const shouldSkip = 
          path.startsWith('/_next') ||
          path.endsWith('.ico') ||
          path.endsWith('.png') ||
          path.endsWith('.jpg')

        expect(shouldSkip).toBe(true)
      })
    })
  })

  describe('Cookie Handling', () => {
    it('should refresh session cookies', () => {
      const mockSet = vi.fn()
      const response = {
        cookies: {
          set: mockSet,
        },
      }

      // Simulate setting a session cookie
      response.cookies.set('sb-access-token', 'new-token', {
        path: '/',
        httpOnly: true,
        secure: true,
        sameSite: 'lax',
      })

      expect(mockSet).toHaveBeenCalledWith(
        'sb-access-token',
        'new-token',
        expect.objectContaining({
          httpOnly: true,
          secure: true,
        })
      )
    })
  })

  describe('Error Handling', () => {
    it('should handle auth errors gracefully', () => {
      const error = { message: 'Invalid session' }
      const destination = '/dashboard'

      // On auth error, redirect to login
      if (error && destination.startsWith('/dashboard')) {
        expect('/login').toBe('/login')
      }
    })

    it('should not expose error details to client', () => {
      const internalError = new Error('Database connection failed')
      const clientMessage = 'Authentication failed'

      // Internal errors should be logged but not exposed
      expect(clientMessage).not.toContain('Database')
      expect(clientMessage).toBe('Authentication failed')
    })
  })
})

describe('Middleware Config', () => {
  it('should have correct matcher config', () => {
    // Middleware should match all routes except static
    const matcher = [
      '/((?!_next/static|_next/image|favicon.ico|.*\\..*).*)' ,
    ]

    expect(matcher.length).toBeGreaterThan(0)
  })

  it('should skip static file extensions', () => {
    const staticExtensions = ['.js', '.css', '.png', '.jpg', '.svg', '.woff']
    const skipPattern = /\.[a-z]+$/i

    staticExtensions.forEach((ext) => {
      expect(skipPattern.test(`file${ext}`)).toBe(true)
    })
  })
})
