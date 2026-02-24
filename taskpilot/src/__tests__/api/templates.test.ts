/**
 * Templates API Route Tests
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

describe('Templates API', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('GET /api/templates', () => {
    it('should return templates without authentication', async () => {
      const mockTemplates = [
        { id: 'tmpl-1', name: 'Market Research', category: 'research', usage_count: 100 },
        { id: 'tmpl-2', name: 'Content Brief', category: 'content', usage_count: 80 },
      ]

      mockSupabaseClient.from.mockReturnValue({
        select: vi.fn().mockReturnValue({
          eq: vi.fn().mockReturnValue({
            or: vi.fn().mockReturnValue({
              order: vi.fn().mockReturnValue({
                range: vi.fn().mockResolvedValue({
                  data: mockTemplates,
                  error: null,
                  count: 2,
                }),
              }),
            }),
          }),
          or: vi.fn().mockReturnValue({
            order: vi.fn().mockReturnValue({
              range: vi.fn().mockResolvedValue({
                data: mockTemplates,
                error: null,
                count: 2,
              }),
            }),
          }),
        }),
      })

      const { GET } = await import('@/app/api/templates/route')
      const request = new NextRequest('http://localhost:3000/api/templates')
      
      const response = await GET(request)
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data.templates).toHaveLength(2)
      expect(data.templates[0].name).toBe('Market Research')
    })

    it('should filter by category', async () => {
      const mockTemplates = [
        { id: 'tmpl-1', name: 'Market Research', category: 'research', usage_count: 100 },
      ]

      mockSupabaseClient.from.mockReturnValue({
        select: vi.fn().mockReturnValue({
          eq: vi.fn().mockReturnValue({
            or: vi.fn().mockReturnValue({
              order: vi.fn().mockReturnValue({
                range: vi.fn().mockResolvedValue({
                  data: mockTemplates,
                  error: null,
                  count: 1,
                }),
              }),
            }),
          }),
        }),
      })

      const { GET } = await import('@/app/api/templates/route')
      const request = new NextRequest('http://localhost:3000/api/templates?category=research')
      
      const response = await GET(request)
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data.templates).toHaveLength(1)
      expect(data.templates[0].category).toBe('research')
    })

    it('should support search', async () => {
      mockSupabaseClient.from.mockReturnValue({
        select: vi.fn().mockReturnValue({
          eq: vi.fn().mockReturnValue({
            or: vi.fn().mockReturnValue({
              ilike: vi.fn().mockReturnValue({
                order: vi.fn().mockReturnValue({
                  range: vi.fn().mockResolvedValue({
                    data: [{ id: 'tmpl-1', name: 'CRM Research', category: 'research' }],
                    error: null,
                    count: 1,
                  }),
                }),
              }),
            }),
          }),
          ilike: vi.fn().mockReturnValue({
            or: vi.fn().mockReturnValue({
              order: vi.fn().mockReturnValue({
                range: vi.fn().mockResolvedValue({
                  data: [{ id: 'tmpl-1', name: 'CRM Research', category: 'research' }],
                  error: null,
                  count: 1,
                }),
              }),
            }),
          }),
          or: vi.fn().mockReturnValue({
            ilike: vi.fn().mockReturnValue({
              order: vi.fn().mockReturnValue({
                range: vi.fn().mockResolvedValue({
                  data: [{ id: 'tmpl-1', name: 'CRM Research', category: 'research' }],
                  error: null,
                  count: 1,
                }),
              }),
            }),
          }),
        }),
      })

      const { GET } = await import('@/app/api/templates/route')
      const request = new NextRequest('http://localhost:3000/api/templates?search=CRM')
      
      const response = await GET(request)

      expect(response.status).toBe(200)
    })

    it('should support pagination', async () => {
      mockSupabaseClient.from.mockReturnValue({
        select: vi.fn().mockReturnValue({
          eq: vi.fn().mockReturnValue({
            or: vi.fn().mockReturnValue({
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

      const { GET } = await import('@/app/api/templates/route')
      const request = new NextRequest('http://localhost:3000/api/templates?page=3&limit=10')
      
      const response = await GET(request)
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data.pagination.page).toBe(3)
      expect(data.pagination.limit).toBe(10)
    })

    it('should handle database errors', async () => {
      mockSupabaseClient.from.mockReturnValue({
        select: vi.fn().mockReturnValue({
          eq: vi.fn().mockReturnValue({
            or: vi.fn().mockReturnValue({
              order: vi.fn().mockReturnValue({
                range: vi.fn().mockResolvedValue({
                  data: null,
                  error: { message: 'Database connection failed' },
                }),
              }),
            }),
          }),
        }),
      })

      const { GET } = await import('@/app/api/templates/route')
      const request = new NextRequest('http://localhost:3000/api/templates')
      
      const response = await GET(request)
      const data = await response.json()

      expect(response.status).toBe(500)
      expect(data.error).toBeDefined()
    })
  })
})

describe('Template Detail API (/api/templates/[templateId])', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('GET /api/templates/[templateId]', () => {
    it('should return template by ID', async () => {
      const mockTemplate = {
        id: 'tmpl-123',
        name: 'Market Research',
        description: 'Comprehensive market analysis',
        category: 'research',
        prompt_template: 'Research {{topic}} in {{industry}}',
        parameters: [
          { name: 'topic', type: 'string', required: true },
          { name: 'industry', type: 'string', required: true },
        ],
        usage_count: 150,
        is_active: true,
        template_categories: {
          name: 'Research',
          slug: 'research',
        },
      }

      mockSupabaseClient.from.mockReturnValue({
        select: vi.fn().mockReturnValue({
          eq: vi.fn().mockReturnValue({
            eq: vi.fn().mockReturnValue({
              single: vi.fn().mockResolvedValue({
                data: mockTemplate,
                error: null,
              }),
            }),
          }),
        }),
      })

      const { GET } = await import('@/app/api/templates/[templateId]/route')
      const request = new NextRequest('http://localhost:3000/api/templates/tmpl-123')
      
      const response = await GET(request, { params: Promise.resolve({ templateId: 'tmpl-123' }) })
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data.template.id).toBe('tmpl-123')
      expect(data.template.name).toBe('Market Research')
      expect(data.template.parameters).toHaveLength(2)
    })

    it('should return 404 if template not found', async () => {
      mockSupabaseClient.from.mockReturnValue({
        select: vi.fn().mockReturnValue({
          eq: vi.fn().mockReturnValue({
            eq: vi.fn().mockReturnValue({
              single: vi.fn().mockResolvedValue({
                data: null,
                error: { code: 'PGRST116' },
              }),
            }),
          }),
        }),
      })

      const { GET } = await import('@/app/api/templates/[templateId]/route')
      const request = new NextRequest('http://localhost:3000/api/templates/nonexistent')
      
      const response = await GET(request, { params: Promise.resolve({ templateId: 'nonexistent' }) })
      const data = await response.json()

      expect(response.status).toBe(404)
      expect(data.error).toBe('Template not found')
    })

    it('should return 404 if template is inactive', async () => {
      mockSupabaseClient.from.mockReturnValue({
        select: vi.fn().mockReturnValue({
          eq: vi.fn().mockReturnValue({
            eq: vi.fn().mockReturnValue({
              single: vi.fn().mockResolvedValue({
                data: null,
                error: { code: 'PGRST116' },
              }),
            }),
          }),
        }),
      })

      const { GET } = await import('@/app/api/templates/[templateId]/route')
      const request = new NextRequest('http://localhost:3000/api/templates/inactive-tmpl')
      
      const response = await GET(request, { params: Promise.resolve({ templateId: 'inactive-tmpl' }) })
      const data = await response.json()

      expect(response.status).toBe(404)
    })
  })
})
