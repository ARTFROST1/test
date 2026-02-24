/**
 * Tasks API - List and Create
 * GET /api/tasks - List user's tasks with pagination & filtering
 * POST /api/tasks - Create new task with AI decomposition
 */

import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { createClient } from '@/lib/supabase/server'
import { decomposeTask, generateTaskTitle } from '@/lib/ai/task-decomposer'
import type { ApiError, TaskListResponse, CreateTaskResponse } from '@/types/api'
import type { TaskStatus } from '@/types/database'

// Request validation schemas
const listQuerySchema = z.object({
  page: z.coerce.number().min(1).default(1),
  limit: z.coerce.number().min(1).max(50).default(10),
  status: z.string().optional(),
  search: z.string().optional(),
  sortBy: z.enum(['created_at', 'updated_at', 'status']).default('created_at'),
  sortOrder: z.enum(['asc', 'desc']).default('desc'),
})

const createTaskSchema = z.object({
  description: z.string().min(10).max(2000),
  templateId: z.string().uuid().optional(),
  useKnowledgeBase: z.boolean().default(true),
  templateParams: z.record(z.string(), z.unknown()).optional(),
})

/**
 * GET /api/tasks - List tasks
 */
export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient()
    
    // Check auth
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
      return NextResponse.json<ApiError>(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    // Parse query params
    const searchParams = Object.fromEntries(request.nextUrl.searchParams)
    const params = listQuerySchema.parse(searchParams)
    const { page, limit, status, search, sortBy, sortOrder } = params

    // Build query
    let query = supabase
      .from('tasks')
      .select(`
        *,
        steps:task_steps(id, title, status, order_index),
        result:task_results(id, content_format)
      `, { count: 'exact' })
      .eq('user_id', user.id)
      .is('deleted_at', null)

    // Apply filters
    if (status) {
      const statuses = status.split(',') as TaskStatus[]
      query = query.in('status', statuses)
    }

    if (search) {
      query = query.or(`title.ilike.%${search}%,description.ilike.%${search}%`)
    }

    // Apply sorting
    query = query.order(sortBy, { ascending: sortOrder === 'asc' })

    // Apply pagination
    const from = (page - 1) * limit
    const to = from + limit - 1
    query = query.range(from, to)

    const { data: tasks, error, count } = await query

    if (error) {
      console.error('Tasks query error:', error)
      return NextResponse.json<ApiError>(
        { error: 'Failed to fetch tasks' },
        { status: 500 }
      )
    }

    const total = count || 0
    const totalPages = Math.ceil(total / limit)

    const response: TaskListResponse = {
      data: (tasks || []) as unknown as TaskListResponse['data'],
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
    
    console.error('Tasks GET error:', error)
    return NextResponse.json<ApiError>(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

/**
 * POST /api/tasks - Create task with AI decomposition
 */
export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()
    
    // Check auth
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
      return NextResponse.json<ApiError>(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    // Check subscription limits
    const { data: subscription } = await supabase
      .from('subscriptions')
      .select('tasks_used_this_month, task_limit')
      .eq('user_id', user.id)
      .single()

    if (subscription && subscription.tasks_used_this_month >= subscription.task_limit) {
      return NextResponse.json<ApiError>(
        { error: 'Task limit reached', code: 'LIMIT_EXCEEDED' },
        { status: 403 }
      )
    }

    // Parse and validate body
    const body = await request.json()
    const { description, templateId, useKnowledgeBase, templateParams } = createTaskSchema.parse(body)

    // Get template context if using template
    let templateContext: string | undefined
    if (templateId) {
      const { data: template } = await supabase
        .from('templates')
        .select('prompt_template, parameters')
        .eq('id', templateId)
        .single()

      if (template) {
        templateContext = template.prompt_template
      }
    }

    // Get knowledge base context if enabled
    // TODO: Implement knowledge base retrieval

    // Generate title from description
    const title = await generateTaskTitle(description)

    // Decompose task with AI
    const decomposition = await decomposeTask({
      taskDescription: description,
      templateContext,
    })

    // Create task in database
    const { data: task, error: taskError } = await supabase
      .from('tasks')
      .insert({
        user_id: user.id,
        template_id: templateId,
        title,
        description,
        status: 'pending',
        progress: 0,
        estimated_time_seconds: decomposition.totalEstimatedTimeSeconds,
        use_knowledge_base: useKnowledgeBase,
        template_params: templateParams as unknown as import('@/types/database').Json,
      })
      .select()
      .single()

    if (taskError || !task) {
      console.error('Task creation error:', taskError)
      return NextResponse.json<ApiError>(
        { error: 'Failed to create task' },
        { status: 500 }
      )
    }

    // Create task steps
    const steps = decomposition.steps.map((step, index) => ({
      task_id: task.id,
      title: step.title,
      description: step.description,
      order_index: index,
      status: 'pending' as const,
      estimated_time_seconds: step.estimatedTimeSeconds,
    }))

    const { data: createdSteps, error: stepsError } = await supabase
      .from('task_steps')
      .insert(steps)
      .select()

    if (stepsError) {
      console.error('Steps creation error:', stepsError)
      // Clean up task if steps failed
      await supabase.from('tasks').delete().eq('id', task.id)
      return NextResponse.json<ApiError>(
        { error: 'Failed to create task steps' },
        { status: 500 }
      )
    }

    // Increment tasks used
    await supabase.rpc('increment_tasks_used', { p_user_id: user.id })

    // Log usage
    await supabase.from('usage_logs').insert({
      user_id: user.id,
      event_type: 'task_created',
      resource_id: task.id,
      resource_type: 'task',
      metadata: { templateId, useKnowledgeBase },
    })

    const response: CreateTaskResponse = {
      task: {
        ...task,
        steps: createdSteps || [],
      },
    }

    return NextResponse.json(response, { status: 201 })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json<ApiError>(
        { error: 'Invalid request body', details: error.issues as unknown as Record<string, unknown> },
        { status: 400 }
      )
    }
    
    console.error('Tasks POST error:', error)
    return NextResponse.json<ApiError>(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
