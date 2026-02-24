/**
 * Single Task API - Get, Update, Delete
 * GET /api/tasks/[taskId] - Get task with steps and result
 * PATCH /api/tasks/[taskId] - Update task
 * DELETE /api/tasks/[taskId] - Soft delete task
 */

import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { createClient } from '@/lib/supabase/server'
import type { ApiError, TaskWithSteps } from '@/types/api'
import type { TaskStep, TaskResult, Template } from '@/types/database'

const updateTaskSchema = z.object({
  title: z.string().min(1).max(200).optional(),
  status: z.enum(['pending', 'decomposing', 'executing', 'paused', 'completed', 'failed', 'canceled']).optional(),
  progress: z.number().min(0).max(100).optional(),
})

type RouteParams = { params: Promise<{ taskId: string }> }

/**
 * GET /api/tasks/[taskId] - Get single task with details
 */
export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const { taskId } = await params
    const supabase = await createClient()
    
    // Check auth
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
      return NextResponse.json<ApiError>(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    // Get task with steps and result
    const { data: task, error } = await supabase
      .from('tasks')
      .select(`
        *,
        steps:task_steps(*),
        result:task_results(*),
        template:templates(id, name, category)
      `)
      .eq('id', taskId)
      .eq('user_id', user.id)
      .is('deleted_at', null)
      .single()

    if (error || !task) {
      return NextResponse.json<ApiError>(
        { error: 'Task not found' },
        { status: 404 }
      )
    }

    // Sort steps by order_index
    const sortedTask: TaskWithSteps = {
      ...task,
      steps: ((task as { steps?: TaskStep[] }).steps || []).sort((a: TaskStep, b: TaskStep) => a.order_index - b.order_index),
      result: (task as { result?: TaskResult | TaskResult[] }).result as TaskResult | undefined,
      template: (task as { template?: Pick<Template, 'id' | 'name' | 'category'> }).template || undefined,
    }

    return NextResponse.json({ data: sortedTask })
  } catch (error) {
    console.error('Task GET error:', error)
    return NextResponse.json<ApiError>(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

/**
 * PATCH /api/tasks/[taskId] - Update task
 */
export async function PATCH(request: NextRequest, { params }: RouteParams) {
  try {
    const { taskId } = await params
    const supabase = await createClient()
    
    // Check auth
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
      return NextResponse.json<ApiError>(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    // Parse body
    const body = await request.json()
    const updates = updateTaskSchema.parse(body)

    // Check task exists and belongs to user
    const { data: existingTask } = await supabase
      .from('tasks')
      .select('id, status')
      .eq('id', taskId)
      .eq('user_id', user.id)
      .is('deleted_at', null)
      .single()

    if (!existingTask) {
      return NextResponse.json<ApiError>(
        { error: 'Task not found' },
        { status: 404 }
      )
    }

    // Prepare update data
    const updateData: Record<string, unknown> = { ...updates }

    // Set timestamps based on status change
    if (updates.status === 'executing' && existingTask.status === 'pending') {
      updateData.started_at = new Date().toISOString()
    }
    if (updates.status === 'completed') {
      updateData.completed_at = new Date().toISOString()
      updateData.progress = 100
    }

    // Update task
    const { data: task, error } = await supabase
      .from('tasks')
      .update(updateData)
      .eq('id', taskId)
      .select()
      .single()

    if (error) {
      console.error('Task update error:', error)
      return NextResponse.json<ApiError>(
        { error: 'Failed to update task' },
        { status: 500 }
      )
    }

    return NextResponse.json({ data: task })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json<ApiError>(
        { error: 'Invalid request body', details: error.issues as unknown as Record<string, unknown> },
        { status: 400 }
      )
    }
    
    console.error('Task PATCH error:', error)
    return NextResponse.json<ApiError>(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

/**
 * DELETE /api/tasks/[taskId] - Soft delete task
 */
export async function DELETE(request: NextRequest, { params }: RouteParams) {
  try {
    const { taskId } = await params
    const supabase = await createClient()
    
    // Check auth
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
      return NextResponse.json<ApiError>(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    // Soft delete (set deleted_at)
    const { error } = await supabase
      .from('tasks')
      .update({ deleted_at: new Date().toISOString() })
      .eq('id', taskId)
      .eq('user_id', user.id)
      .is('deleted_at', null)

    if (error) {
      console.error('Task delete error:', error)
      return NextResponse.json<ApiError>(
        { error: 'Failed to delete task' },
        { status: 500 }
      )
    }

    return new NextResponse(null, { status: 204 })
  } catch (error) {
    console.error('Task DELETE error:', error)
    return NextResponse.json<ApiError>(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
