/**
 * Tasks API Route Tests
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

// Mock AI decomposer
vi.mock('@/lib/ai/task-decomposer', () => ({
  decomposeTask: vi.fn(() => Promise.resolve({
    title: 'Research CRM tools',
    steps: [
      { title: 'Identify top CRM tools', description: 'Find the most popular CRM solutions', estimated_time_seconds: 60 },
      { title: 'Compare features', description: 'Create comparison matrix', estimated_time_seconds: 120 },
      { title: 'Analyze pricing', description: 'Review pricing tiers', estimated_time_seconds: 60 },
    ],
    estimatedTotalTime: 240,
  })),
}))

describe('Tasks API', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('GET /api/tasks', () => {
    it('should return 401 if user is not authenticated', async () => {
      mockSupabaseClient.auth.getUser.mockResolvedValue({
        data: { user: null },
        error: null,
      })

      const { GET } = await import('@/app/api/tasks/route')
      const request = new NextRequest('http://localhost:3000/api/tasks')
      
      const response = await GET(request)
      const data = await response.json()

      expect(response.status).toBe(401)
      expect(data.error).toBe('Unauthorized')
    })

    it('should return tasks for authenticated user', async () => {
      mockSupabaseClient.auth.getUser.mockResolvedValue({
        data: { user: { id: 'user-123' } },
        error: null,
      })

      const mockTasks = [
        { id: 'task-1', title: 'Research CRM', status: 'completed' },
        { id: 'task-2', title: 'Write report', status: 'pending' },
      ]

      mockSupabaseClient.from.mockReturnValue({
        select: vi.fn().mockReturnValue({
          eq: vi.fn().mockReturnValue({
            is: vi.fn().mockReturnValue({
              order: vi.fn().mockReturnValue({
                range: vi.fn().mockResolvedValue({
                  data: mockTasks,
                  error: null,
                  count: 2,
                }),
              }),
            }),
          }),
        }),
      })

      const { GET } = await import('@/app/api/tasks/route')
      const request = new NextRequest('http://localhost:3000/api/tasks')
      
      const response = await GET(request)
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data.tasks).toHaveLength(2)
      expect(data.tasks[0].title).toBe('Research CRM')
    })

    it('should support pagination', async () => {
      mockSupabaseClient.auth.getUser.mockResolvedValue({
        data: { user: { id: 'user-123' } },
        error: null,
      })

      mockSupabaseClient.from.mockReturnValue({
        select: vi.fn().mockReturnValue({
          eq: vi.fn().mockReturnValue({
            is: vi.fn().mockReturnValue({
              order: vi.fn().mockReturnValue({
                range: vi.fn().mockResolvedValue({
                  data: [],
                  error: null,
                  count: 50,
                }),
              }),
            }),
          }),
        }),
      })

      const { GET } = await import('@/app/api/tasks/route')
      const request = new NextRequest('http://localhost:3000/api/tasks?page=2&limit=10')
      
      const response = await GET(request)
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data.pagination).toEqual(expect.objectContaining({
        page: 2,
        limit: 10,
      }))
    })

    it('should filter by status', async () => {
      mockSupabaseClient.auth.getUser.mockResolvedValue({
        data: { user: { id: 'user-123' } },
        error: null,
      })

      const mockSelectFn = vi.fn().mockReturnValue({
        eq: vi.fn().mockReturnValue({
          is: vi.fn().mockReturnValue({
            eq: vi.fn().mockReturnValue({
              order: vi.fn().mockReturnValue({
                range: vi.fn().mockResolvedValue({
                  data: [{ id: 'task-1', status: 'completed' }],
                  error: null,
                  count: 1,
                }),
              }),
            }),
          }),
        }),
      })

      mockSupabaseClient.from.mockReturnValue({
        select: mockSelectFn,
      })

      const { GET } = await import('@/app/api/tasks/route')
      const request = new NextRequest('http://localhost:3000/api/tasks?status=completed')
      
      const response = await GET(request)

      expect(response.status).toBe(200)
    })
  })

  describe('POST /api/tasks', () => {
    it('should return 401 if user is not authenticated', async () => {
      mockSupabaseClient.auth.getUser.mockResolvedValue({
        data: { user: null },
        error: null,
      })

      const { POST } = await import('@/app/api/tasks/route')
      const request = new NextRequest('http://localhost:3000/api/tasks', {
        method: 'POST',
        body: JSON.stringify({ description: 'Test task' }),
      })
      
      const response = await POST(request)
      const data = await response.json()

      expect(response.status).toBe(401)
      expect(data.error).toBe('Unauthorized')
    })

    it('should return 400 if description is missing', async () => {
      mockSupabaseClient.auth.getUser.mockResolvedValue({
        data: { user: { id: 'user-123' } },
        error: null,
      })

      const { POST } = await import('@/app/api/tasks/route')
      const request = new NextRequest('http://localhost:3000/api/tasks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({}),
      })
      
      const response = await POST(request)
      const data = await response.json()

      expect(response.status).toBe(400)
      expect(data.error).toBe('Description is required')
    })

    it('should create task with AI decomposition', async () => {
      mockSupabaseClient.auth.getUser.mockResolvedValue({
        data: { user: { id: 'user-123' } },
        error: null,
      })

      // Mock subscription check
      mockSupabaseClient.from.mockImplementation((table: string) => {
        if (table === 'subscriptions') {
          return {
            select: vi.fn().mockReturnValue({
              eq: vi.fn().mockReturnValue({
                single: vi.fn().mockResolvedValue({
                  data: { plan: 'pro', tasks_used_this_month: 5, task_limit: 50 },
                  error: null,
                }),
              }),
            }),
            update: vi.fn().mockReturnValue({
              eq: vi.fn().mockResolvedValue({ data: null, error: null }),
            }),
          }
        }
        if (table === 'tasks') {
          return {
            insert: vi.fn().mockReturnValue({
              select: vi.fn().mockReturnValue({
                single: vi.fn().mockResolvedValue({
                  data: { id: 'new-task-123', title: 'Research CRM tools', status: 'decomposing' },
                  error: null,
                }),
              }),
            }),
            update: vi.fn().mockReturnValue({
              eq: vi.fn().mockResolvedValue({ data: null, error: null }),
            }),
          }
        }
        if (table === 'task_steps') {
          return {
            insert: vi.fn().mockResolvedValue({ data: null, error: null }),
          }
        }
        return {
          select: vi.fn().mockReturnValue({
            eq: vi.fn().mockReturnValue({
              single: vi.fn().mockResolvedValue({ data: null, error: null }),
            }),
          }),
        }
      })

      const { POST } = await import('@/app/api/tasks/route')
      const request = new NextRequest('http://localhost:3000/api/tasks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ description: 'Research top 10 CRM tools for small business' }),
      })
      
      const response = await POST(request)
      const data = await response.json()

      expect(response.status).toBe(201)
      expect(data.task).toBeDefined()
      expect(data.task.id).toBe('new-task-123')
    })

    it('should return 402 if task limit reached', async () => {
      mockSupabaseClient.auth.getUser.mockResolvedValue({
        data: { user: { id: 'user-123' } },
        error: null,
      })

      mockSupabaseClient.from.mockImplementation((table: string) => {
        if (table === 'subscriptions') {
          return {
            select: vi.fn().mockReturnValue({
              eq: vi.fn().mockReturnValue({
                single: vi.fn().mockResolvedValue({
                  data: { plan: 'free', tasks_used_this_month: 5, task_limit: 5 },
                  error: null,
                }),
              }),
            }),
          }
        }
        return {}
      })

      const { POST } = await import('@/app/api/tasks/route')
      const request = new NextRequest('http://localhost:3000/api/tasks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ description: 'Another task' }),
      })
      
      const response = await POST(request)
      const data = await response.json()

      expect(response.status).toBe(402)
      expect(data.error).toContain('limit')
    })
  })
})

describe('Task Detail API (/api/tasks/[taskId])', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('GET /api/tasks/[taskId]', () => {
    it('should return 401 if user is not authenticated', async () => {
      mockSupabaseClient.auth.getUser.mockResolvedValue({
        data: { user: null },
        error: null,
      })

      const { GET } = await import('@/app/api/tasks/[taskId]/route')
      const request = new NextRequest('http://localhost:3000/api/tasks/task-123')
      
      const response = await GET(request, { params: Promise.resolve({ taskId: 'task-123' }) })
      const data = await response.json()

      expect(response.status).toBe(401)
      expect(data.error).toBe('Unauthorized')
    })

    it('should return 404 if task not found', async () => {
      mockSupabaseClient.auth.getUser.mockResolvedValue({
        data: { user: { id: 'user-123' } },
        error: null,
      })

      mockSupabaseClient.from.mockReturnValue({
        select: vi.fn().mockReturnValue({
          eq: vi.fn().mockReturnValue({
            eq: vi.fn().mockReturnValue({
              is: vi.fn().mockReturnValue({
                single: vi.fn().mockResolvedValue({
                  data: null,
                  error: { code: 'PGRST116' },
                }),
              }),
            }),
          }),
        }),
      })

      const { GET } = await import('@/app/api/tasks/[taskId]/route')
      const request = new NextRequest('http://localhost:3000/api/tasks/nonexistent')
      
      const response = await GET(request, { params: Promise.resolve({ taskId: 'nonexistent' }) })
      const data = await response.json()

      expect(response.status).toBe(404)
      expect(data.error).toBe('Task not found')
    })

    it('should return task with steps', async () => {
      mockSupabaseClient.auth.getUser.mockResolvedValue({
        data: { user: { id: 'user-123' } },
        error: null,
      })

      const mockTask = {
        id: 'task-123',
        title: 'Research CRM',
        status: 'executing',
        progress: 50,
        task_steps: [
          { id: 'step-1', title: 'Step 1', status: 'completed' },
          { id: 'step-2', title: 'Step 2', status: 'in_progress' },
        ],
        task_results: [],
      }

      mockSupabaseClient.from.mockReturnValue({
        select: vi.fn().mockReturnValue({
          eq: vi.fn().mockReturnValue({
            eq: vi.fn().mockReturnValue({
              is: vi.fn().mockReturnValue({
                single: vi.fn().mockResolvedValue({
                  data: mockTask,
                  error: null,
                }),
              }),
            }),
          }),
        }),
      })

      const { GET } = await import('@/app/api/tasks/[taskId]/route')
      const request = new NextRequest('http://localhost:3000/api/tasks/task-123')
      
      const response = await GET(request, { params: Promise.resolve({ taskId: 'task-123' }) })
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data.task.id).toBe('task-123')
      expect(data.task.task_steps).toHaveLength(2)
    })
  })

  describe('DELETE /api/tasks/[taskId]', () => {
    it('should soft delete task', async () => {
      mockSupabaseClient.auth.getUser.mockResolvedValue({
        data: { user: { id: 'user-123' } },
        error: null,
      })

      mockSupabaseClient.from.mockReturnValue({
        update: vi.fn().mockReturnValue({
          eq: vi.fn().mockReturnValue({
            eq: vi.fn().mockResolvedValue({
              data: null,
              error: null,
            }),
          }),
        }),
      })

      const { DELETE } = await import('@/app/api/tasks/[taskId]/route')
      const request = new NextRequest('http://localhost:3000/api/tasks/task-123', {
        method: 'DELETE',
      })
      
      const response = await DELETE(request, { params: Promise.resolve({ taskId: 'task-123' }) })
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data.success).toBe(true)
    })
  })
})
