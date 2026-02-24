/**
 * Task Server Actions
 * Actions for task operations
 */

/* eslint-disable @typescript-eslint/no-explicit-any */

'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'
import { decomposeTask, generateTaskTitle } from '@/lib/ai/task-decomposer'
import type { Task, TaskStep, TaskStatus } from '@/types/database'

export type TaskActionState = {
  error?: string
  success?: boolean
  data?: Task | TaskWithSteps
}

export type TaskWithSteps = Task & {
  steps: TaskStep[]
}

/**
 * Create a new task with AI decomposition
 */
export async function createTask(formData: FormData): Promise<TaskActionState> {
  const description = formData.get('description') as string
  const templateId = formData.get('templateId') as string | null
  const useKnowledgeBase = formData.get('useKnowledgeBase') === 'true'

  if (!description || description.length < 10) {
    return { error: 'Description must be at least 10 characters' }
  }

  if (description.length > 2000) {
    return { error: 'Description must be less than 2000 characters' }
  }

  const supabase = await createClient()

  // Check auth
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    return { error: 'Not authenticated' }
  }

  // Check subscription limits
  const { data: subscription } = await (supabase as any)
    .from('subscriptions')
    .select('tasks_used_this_month, task_limit')
    .eq('user_id', user.id)
    .single()

  if (subscription && subscription.tasks_used_this_month >= subscription.task_limit) {
    return { error: 'Task limit reached. Please upgrade your plan.' }
  }

  try {
    // Get template context if using template
    let templateContext: string | undefined
    if (templateId) {
      const { data: template } = await (supabase as any)
        .from('templates')
        .select('prompt_template')
        .eq('id', templateId)
        .single()

      if (template) {
        templateContext = template.prompt_template
      }
    }

    // Generate title
    const title = await generateTaskTitle(description)

    // Decompose task
    const decomposition = await decomposeTask({
      taskDescription: description,
      templateContext,
    })

    // Create task
    const { data: task, error: taskError } = await (supabase as any)
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
      })
      .select()
      .single()

    if (taskError || !task) {
      console.error('Task creation error:', taskError)
      return { error: 'Failed to create task' }
    }

    // Create steps
    const steps = decomposition.steps.map((step, index) => ({
      task_id: task.id,
      title: step.title,
      description: step.description,
      order_index: index,
      status: 'pending' as const,
      estimated_time_seconds: step.estimatedTimeSeconds,
    }))

    const { data: createdSteps, error: stepsError } = await (supabase as any)
      .from('task_steps')
      .insert(steps)
      .select()

    if (stepsError) {
      // Cleanup task if steps failed
      await (supabase as any).from('tasks').delete().eq('id', task.id)
      return { error: 'Failed to create task steps' }
    }

    // Increment task count
    await (supabase as any).rpc('increment_tasks_used', { p_user_id: user.id })

    // Log usage
    await (supabase as any).from('usage_logs').insert({
      user_id: user.id,
      event_type: 'task_created',
      resource_id: task.id,
      resource_type: 'task',
    })

    revalidatePath('/dashboard')
    revalidatePath('/tasks')

    return {
      success: true,
      data: { ...task, steps: createdSteps || [] },
    }
  } catch (error) {
    console.error('Create task error:', error)
    return { error: 'Failed to create task. Please try again.' }
  }
}

/**
 * Update task status
 */
export async function updateTaskStatus(
  taskId: string,
  status: TaskStatus
): Promise<TaskActionState> {
  const supabase = await createClient()

  // Check auth
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    return { error: 'Not authenticated' }
  }

  // Verify ownership
  const { data: existingTask } = await (supabase as any)
    .from('tasks')
    .select('id, status')
    .eq('id', taskId)
    .eq('user_id', user.id)
    .is('deleted_at', null)
    .single()

  if (!existingTask) {
    return { error: 'Task not found' }
  }

  // Prepare update data
  const updateData: Partial<Task> = { status }

  if (status === 'executing' && existingTask.status === 'pending') {
    updateData.started_at = new Date().toISOString()
  }
  if (status === 'completed') {
    updateData.completed_at = new Date().toISOString()
    updateData.progress = 100
  }

  const { data: task, error } = await (supabase as any)
    .from('tasks')
    .update(updateData)
    .eq('id', taskId)
    .select()
    .single()

  if (error) {
    console.error('Update task status error:', error)
    return { error: 'Failed to update task' }
  }

  revalidatePath('/dashboard')
  revalidatePath('/tasks')
  revalidatePath(`/tasks/${taskId}`)

  return { success: true, data: task }
}

/**
 * Delete task (soft delete)
 */
export async function deleteTask(taskId: string): Promise<TaskActionState> {
  const supabase = await createClient()

  // Check auth
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    return { error: 'Not authenticated' }
  }

  const { error } = await (supabase as any)
    .from('tasks')
    .update({ deleted_at: new Date().toISOString() })
    .eq('id', taskId)
    .eq('user_id', user.id)
    .is('deleted_at', null)

  if (error) {
    console.error('Delete task error:', error)
    return { error: 'Failed to delete task' }
  }

  revalidatePath('/dashboard')
  revalidatePath('/tasks')

  return { success: true }
}

/**
 * Cancel task execution
 */
export async function cancelTask(taskId: string): Promise<TaskActionState> {
  return updateTaskStatus(taskId, 'canceled')
}

/**
 * Pause task execution
 */
export async function pauseTask(taskId: string): Promise<TaskActionState> {
  return updateTaskStatus(taskId, 'paused')
}

/**
 * Resume task execution
 */
export async function resumeTask(taskId: string): Promise<TaskActionState> {
  return updateTaskStatus(taskId, 'executing')
}

/**
 * Get task by ID
 */
export async function getTask(taskId: string): Promise<TaskWithSteps | null> {
  const supabase = await createClient()

  // Check auth
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    return null
  }

  const { data: task } = await (supabase as any)
    .from('tasks')
    .select(`
      *,
      steps:task_steps(*)
    `)
    .eq('id', taskId)
    .eq('user_id', user.id)
    .is('deleted_at', null)
    .single()

  if (!task) {
    return null
  }

  return {
    ...task,
    steps: (task.steps || []).sort((a: any, b: any) => a.order_index - b.order_index),
  }
}

/**
 * Get tasks list
 */
export async function getTasks(options?: {
  status?: TaskStatus | TaskStatus[]
  limit?: number
}): Promise<TaskWithSteps[]> {
  const supabase = await createClient()

  // Check auth
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    return []
  }

  let query = supabase
    .from('tasks')
    .select(`
      *,
      steps:task_steps(id, title, status, order_index)
    `)
    .eq('user_id', user.id)
    .is('deleted_at', null)
    .order('created_at', { ascending: false })

  if (options?.status) {
    const statuses = Array.isArray(options.status) ? options.status : [options.status]
    query = query.in('status', statuses)
  }

  if (options?.limit) {
    query = query.limit(options.limit)
  }

  const { data: tasks } = await query

  return (tasks || []).map((task: any) => ({
    ...task,
    steps: (task.steps || []).sort((a: any, b: any) => a.order_index - b.order_index),
  })) as TaskWithSteps[]
}
