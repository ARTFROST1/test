/**
 * Task Execution API with Streaming
 * POST /api/tasks/[taskId]/execute - Execute task steps with AI streaming
 */

import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { executeStepStream, aggregateResults } from '@/lib/ai/task-executor'
import type { ApiError } from '@/types/api'
import type { TaskStep, TemplateCategoryEnum } from '@/types/database'

type RouteParams = { params: Promise<{ taskId: string }> }

/**
 * POST /api/tasks/[taskId]/execute - Stream task execution
 */
export async function POST(request: NextRequest, { params }: RouteParams) {
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

    // Get task with steps
    const { data: task, error: taskError } = await supabase
      .from('tasks')
      .select(`
        *,
        steps:task_steps(*),
        template:templates(category)
      `)
      .eq('id', taskId)
      .eq('user_id', user.id)
      .is('deleted_at', null)
      .single()

    if (taskError || !task) {
      return NextResponse.json<ApiError>(
        { error: 'Task not found' },
        { status: 404 }
      )
    }

    // Check task status
    if (!['pending', 'paused'].includes(task.status)) {
      return NextResponse.json<ApiError>(
        { error: `Cannot execute task in ${task.status} status` },
        { status: 400 }
      )
    }

    const steps = (task.steps as TaskStep[]).sort((a, b) => a.order_index - b.order_index)
    const templateCategory = (task.template as { category: TemplateCategoryEnum } | null)?.category

    // Update task status to executing
    await supabase
      .from('tasks')
      .update({
        status: 'executing',
        started_at: task.started_at || new Date().toISOString(),
      })
      .eq('id', taskId)

    // Create a streaming response
    const encoder = new TextEncoder()
    
    const stream = new ReadableStream({
      async start(controller) {
        try {
          const completedOutputs: string[] = []
          const stepOutputs: { title: string; output: string }[] = []
          let totalTokensInput = 0
          let totalTokensOutput = 0
          const startTime = Date.now()

          for (let i = 0; i < steps.length; i++) {
            const step = steps[i]

            // Send step start event
            controller.enqueue(encoder.encode(
              `data: ${JSON.stringify({ type: 'step_start', stepIndex: i, title: step.title })}\n\n`
            ))

            // Update step status
            await supabase
              .from('task_steps')
              .update({
                status: 'in_progress',
                started_at: new Date().toISOString(),
              })
              .eq('id', step.id)

            // Execute step with streaming
            const result = await executeStepStream({
              taskDescription: task.description,
              step: { title: step.title, description: step.description },
              previousOutputs: completedOutputs,
              templateCategory,
            })

            let stepOutput = ''

            // Stream the content
            for await (const chunk of result.textStream) {
              stepOutput += chunk
              controller.enqueue(encoder.encode(
                `data: ${JSON.stringify({ type: 'step_progress', stepIndex: i, content: chunk })}\n\n`
              ))
            }

            // Get usage info (AI SDK v3+ uses inputTokens/outputTokens)
            const usage = await result.usage
            const usageObj = usage as unknown as Record<string, number>
            totalTokensInput += usageObj?.inputTokens ?? usageObj?.promptTokens ?? 0
            totalTokensOutput += usageObj?.outputTokens ?? usageObj?.completionTokens ?? 0

            // Update step with output
            const stepTime = Math.round((Date.now() - startTime) / 1000)
            await supabase
              .from('task_steps')
              .update({
                status: 'completed',
                output: stepOutput,
                actual_time_seconds: step.actual_time_seconds || stepTime,
                completed_at: new Date().toISOString(),
              })
              .eq('id', step.id)

            completedOutputs.push(stepOutput)
            stepOutputs.push({ title: step.title, output: stepOutput })

            // Update task progress
            const progress = Math.round(((i + 1) / steps.length) * 100)
            await supabase
              .from('tasks')
              .update({ progress })
              .eq('id', taskId)

            // Send step complete event
            controller.enqueue(encoder.encode(
              `data: ${JSON.stringify({ type: 'step_complete', stepIndex: i, progress })}\n\n`
            ))
          }

          // Aggregate final results
          const finalContent = await aggregateResults(task.description, stepOutputs)

          // Create task result
          await supabase
            .from('task_results')
            .insert({
              task_id: taskId,
              content: finalContent,
              content_format: 'markdown',
              sources_used: [],
              tokens_input: totalTokensInput,
              tokens_output: totalTokensOutput,
            })

          // Update task as completed
          const actualTime = Math.round((Date.now() - startTime) / 1000)
          await supabase
            .from('tasks')
            .update({
              status: 'completed',
              progress: 100,
              actual_time_seconds: actualTime,
              completed_at: new Date().toISOString(),
            })
            .eq('id', taskId)

          // Log completion
          await supabase.from('usage_logs').insert({
            user_id: user.id,
            event_type: 'task_completed',
            resource_id: taskId,
            resource_type: 'task',
            tokens_used: totalTokensInput + totalTokensOutput,
            metadata: { actualTimeSeconds: actualTime },
          })

          // Send completion event
          controller.enqueue(encoder.encode(
            `data: ${JSON.stringify({ 
              type: 'task_complete', 
              result: { content: finalContent, tokensUsed: totalTokensInput + totalTokensOutput }
            })}\n\n`
          ))

          controller.close()
        } catch (error) {
          console.error('Execution error:', error)

          // Update task status to failed
          await supabase
            .from('tasks')
            .update({ status: 'failed' })
            .eq('id', taskId)

          // Log failure
          await supabase.from('usage_logs').insert({
            user_id: user.id,
            event_type: 'task_failed',
            resource_id: taskId,
            resource_type: 'task',
            metadata: { error: error instanceof Error ? error.message : 'Unknown error' },
          })

          controller.enqueue(encoder.encode(
            `data: ${JSON.stringify({ 
              type: 'error', 
              error: error instanceof Error ? error.message : 'Execution failed' 
            })}\n\n`
          ))
          controller.close()
        }
      },
    })

    return new Response(stream, {
      headers: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive',
      },
    })
  } catch (error) {
    console.error('Task execution error:', error)
    return NextResponse.json<ApiError>(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
