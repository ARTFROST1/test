/**
 * Templates API - List templates
 * GET /api/templates - Get all active templates with filters
 */

import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { createClient } from '@/lib/supabase/server'
import type { ApiError, TemplateListResponse } from '@/types/api'

const listQuerySchema = z.object({
  page: z.coerce.number().min(1).default(1),
  limit: z.coerce.number().min(1).max(50).default(20),
  category: z.enum(['research', 'content', 'email', 'data_analysis', 'social_media', 'seo', 'other']).optional(),
  search: z.string().optional(),
  sortBy: z.enum(['name', 'usage_count', 'avg_rating', 'created_at']).default('usage_count'),
  sortOrder: z.enum(['asc', 'desc']).default('desc'),
})

/**
 * GET /api/templates - List templates
 */
export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient()
    
    // Parse query params
    const searchParams = Object.fromEntries(request.nextUrl.searchParams)
    const params = listQuerySchema.parse(searchParams)
    const { page, limit, category, search, sortBy, sortOrder } = params

    // Build query
    let query = supabase
      .from('templates')
      .select('*', { count: 'exact' })
      .eq('is_active', true)
      .eq('is_public', true)

    // Apply filters
    if (category) {
      query = query.eq('category', category)
    }

    if (search) {
      query = query.or(`name.ilike.%${search}%,description.ilike.%${search}%`)
    }

    // Apply sorting
    query = query.order(sortBy, { ascending: sortOrder === 'asc' })

    // Apply pagination
    const from = (page - 1) * limit
    const to = from + limit - 1
    query = query.range(from, to)

    const { data: templates, error, count } = await query

    if (error) {
      console.error('Templates query error:', error)
      return NextResponse.json<ApiError>(
        { error: 'Failed to fetch templates' },
        { status: 500 }
      )
    }

    const total = count || 0
    const totalPages = Math.ceil(total / limit)

    const response: TemplateListResponse = {
      data: templates || [],
      pagination: {
        page,
        limit,
        total,
        totalPages,
        hasMore: page < totalPages,
      },
    }

    return NextResponse.json(response)
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json<ApiError>(
        { error: 'Invalid request parameters', details: error.issues as unknown as Record<string, unknown> },
        { status: 400 }
      )
    }
    
    console.error('Templates GET error:', error)
    return NextResponse.json<ApiError>(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
