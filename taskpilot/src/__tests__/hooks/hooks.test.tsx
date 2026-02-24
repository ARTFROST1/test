/**
 * Hook Tests - Custom React Hooks
 */
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { renderHook, waitFor, act } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ReactNode } from 'react'

// Mock fetch
global.fetch = vi.fn()

// Mock Supabase provider
vi.mock('@/components/providers/supabase-provider', () => ({
  useSupabase: () => ({
    supabase: {
      from: vi.fn(() => ({
        select: vi.fn(() => ({
          eq: vi.fn(() => ({
            single: vi.fn(() => Promise.resolve({ data: null, error: null })),
            order: vi.fn(() => Promise.resolve({ data: [], error: null })),
          })),
          order: vi.fn(() => Promise.resolve({ data: [], error: null })),
        })),
        insert: vi.fn(() => Promise.resolve({ data: null, error: null })),
        update: vi.fn(() => ({
          eq: vi.fn(() => Promise.resolve({ data: null, error: null })),
        })),
        delete: vi.fn(() => ({
          eq: vi.fn(() => Promise.resolve({ error: null })),
        })),
      })),
      channel: vi.fn(() => ({
        on: vi.fn(() => ({ subscribe: vi.fn() })),
      })),
    },
    user: { id: 'user-123', email: 'test@example.com' },
    isLoading: false,
  }),
}))

// Wrapper with QueryClient
const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
    },
  })
  return function Wrapper({ children }: { children: ReactNode }) {
    return (
      <QueryClientProvider client={queryClient}>
        {children}
      </QueryClientProvider>
    )
  }
}

describe('Custom Hooks', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('useTasks', () => {
    it('should fetch tasks', async () => {
      const mockTasks = [
        { id: 'task-1', title: 'Task 1', status: 'pending' },
        { id: 'task-2', title: 'Task 2', status: 'completed' },
      ]

      vi.mocked(fetch).mockResolvedValueOnce({
        ok: true,
        json: async () => mockTasks,
      } as Response)

      const { useTasks } = await import('@/hooks/use-tasks')
      const { result } = renderHook(() => useTasks(), { wrapper: createWrapper() })

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false)
      })

      expect(result.current.tasks).toEqual(mockTasks)
    })

    it('should create a new task', async () => {
      vi.mocked(fetch).mockResolvedValue({
        ok: true,
        json: async () => ({ id: 'new-task', title: 'New Task', status: 'pending' }),
      } as Response)

      const { useTasks } = await import('@/hooks/use-tasks')
      const { result } = renderHook(() => useTasks(), { wrapper: createWrapper() })

      await act(async () => {
        await result.current.createTask({ description: 'New Task' })
      })

      expect(fetch).toHaveBeenCalledWith(
        '/api/tasks',
        expect.objectContaining({
          method: 'POST',
          body: JSON.stringify({ description: 'New Task' }),
        })
      )
    })

    it('should delete a task', async () => {
      vi.mocked(fetch).mockResolvedValue({
        ok: true,
        json: async () => ({}),
      } as Response)

      const { useTasks } = await import('@/hooks/use-tasks')
      const { result } = renderHook(() => useTasks(), { wrapper: createWrapper() })

      await act(async () => {
        await result.current.deleteTask('task-123')
      })

      expect(fetch).toHaveBeenCalledWith(
        '/api/tasks/task-123',
        expect.objectContaining({ method: 'DELETE' })
      )
    })

    it('should handle fetch errors', async () => {
      vi.mocked(fetch).mockRejectedValueOnce(new Error('Network error'))

      const { useTasks } = await import('@/hooks/use-tasks')
      const { result } = renderHook(() => useTasks(), { wrapper: createWrapper() })

      await waitFor(() => {
        expect(result.current.error).toBeTruthy()
      })
    })
  })

  describe('useTemplates', () => {
    it('should fetch templates', async () => {
      const mockTemplates = [
        { id: 'tpl-1', name: 'Template 1', category: 'research' },
        { id: 'tpl-2', name: 'Template 2', category: 'content' },
      ]

      vi.mocked(fetch).mockResolvedValueOnce({
        ok: true,
        json: async () => mockTemplates,
      } as Response)

      const { useTemplates } = await import('@/hooks/use-templates')
      const { result } = renderHook(() => useTemplates(), { wrapper: createWrapper() })

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false)
      })

      expect(result.current.templates).toEqual(mockTemplates)
    })

    it('should filter templates by category', async () => {
      const mockTemplates = [
        { id: 'tpl-1', name: 'Template 1', category: 'research' },
      ]

      vi.mocked(fetch).mockResolvedValueOnce({
        ok: true,
        json: async () => mockTemplates,
      } as Response)

      const { useTemplates } = await import('@/hooks/use-templates')
      const { result } = renderHook(
        () => useTemplates({ category: 'research' }),
        { wrapper: createWrapper() }
      )

      await waitFor(() => {
        expect(result.current.templates).toHaveLength(1)
      })
    })

    it('should create a custom template', async () => {
      vi.mocked(fetch).mockResolvedValue({
        ok: true,
        json: async () => ({
          id: 'tpl-new',
          name: 'Custom Template',
          is_custom: true,
        }),
      } as Response)

      const { useTemplates } = await import('@/hooks/use-templates')
      const { result } = renderHook(() => useTemplates(), { wrapper: createWrapper() })

      await act(async () => {
        await result.current.createTemplate({
          name: 'Custom Template',
          prompt: 'Custom prompt',
          category: 'custom',
        })
      })

      expect(fetch).toHaveBeenCalledWith(
        '/api/templates',
        expect.objectContaining({
          method: 'POST',
        })
      )
    })
  })

  describe('useSubscription', () => {
    it('should fetch subscription status', async () => {
      const mockSubscription = {
        plan: 'pro',
        status: 'active',
        tasks_used: 50,
        tasks_limit: 100,
      }

      vi.mocked(fetch).mockResolvedValueOnce({
        ok: true,
        json: async () => mockSubscription,
      } as Response)

      const { useSubscription } = await import('@/hooks/use-subscription')
      const { result } = renderHook(() => useSubscription(), { wrapper: createWrapper() })

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false)
      })

      expect(result.current.subscription).toEqual(mockSubscription)
    })

    it('should check if user can create task', async () => {
      const mockSubscription = {
        plan: 'free',
        tasks_used: 4,
        tasks_limit: 5,
      }

      vi.mocked(fetch).mockResolvedValueOnce({
        ok: true,
        json: async () => mockSubscription,
      } as Response)

      const { useSubscription } = await import('@/hooks/use-subscription')
      const { result } = renderHook(() => useSubscription(), { wrapper: createWrapper() })

      await waitFor(() => {
        expect(result.current.canCreateTask).toBe(true)
      })
    })

    it('should block task creation at limit', async () => {
      const mockSubscription = {
        plan: 'free',
        tasks_used: 5,
        tasks_limit: 5,
      }

      vi.mocked(fetch).mockResolvedValueOnce({
        ok: true,
        json: async () => mockSubscription,
      } as Response)

      const { useSubscription } = await import('@/hooks/use-subscription')
      const { result } = renderHook(() => useSubscription(), { wrapper: createWrapper() })

      await waitFor(() => {
        expect(result.current.canCreateTask).toBe(false)
      })
    })

    it('should initiate checkout', async () => {
      vi.mocked(fetch).mockResolvedValue({
        ok: true,
        json: async () => ({ url: 'https://checkout.stripe.com/...' }),
      } as Response)

      const { useSubscription } = await import('@/hooks/use-subscription')
      const { result } = renderHook(() => useSubscription(), { wrapper: createWrapper() })

      await act(async () => {
        await result.current.subscribe('pro')
      })

      expect(fetch).toHaveBeenCalledWith(
        '/api/subscription/checkout',
        expect.objectContaining({
          method: 'POST',
          body: expect.stringContaining('pro'),
        })
      )
    })

    it('should open customer portal', async () => {
      vi.mocked(fetch).mockResolvedValue({
        ok: true,
        json: async () => ({ url: 'https://billing.stripe.com/...' }),
      } as Response)

      const { useSubscription } = await import('@/hooks/use-subscription')
      const { result } = renderHook(() => useSubscription(), { wrapper: createWrapper() })

      await act(async () => {
        await result.current.openPortal()
      })

      expect(fetch).toHaveBeenCalledWith(
        '/api/subscription/portal',
        expect.objectContaining({ method: 'POST' })
      )
    })
  })
})
