/**
 * Single Template API
 * GET /api/templates/[templateId] - Get template details
 */

import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import type { ApiError } from '@/types/api'

type RouteParams = { params: Promise<{ templateId: string }> }

/**
 * GET /api/templates/[templateId] - Get single template
 */
export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const { templateId } = await params
    const supabase = await createClient()

    // Get template
    const { data: template, error } = await supabase
      .from('templates')
      .select('*')
      .eq('id', templateId)
      .eq('is_active', true)
      .single()

    if (error || !template) {
      return NextResponse.json<ApiError>(
        { error: 'Template not found' },
        { status: 404 }
      )
    }

    // Check if template is public or belongs to user
    if (!template.is_public) {
      const { data: { user } } = await supabase.auth.getUser()
      
      if (!user || template.created_by !== user.id) {
        return NextResponse.json<ApiError>(
          { error: 'Template not found' },
          { status: 404 }
        )
      }
    }

    return NextResponse.json({ data: template })
  } catch (error) {
    console.error('Template GET error:', error)
    return NextResponse.json<ApiError>(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
