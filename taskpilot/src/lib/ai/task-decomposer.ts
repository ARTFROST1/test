/**
 * AI Task Decomposition Service
 */

import { openai } from '@ai-sdk/openai'
import { generateObject } from 'ai'
import { z } from 'zod'
import { SYSTEM_PROMPTS, getDecompositionPrompt } from './prompts'

const TaskStepSchema = z.object({
  title: z.string().max(200),
  description: z.string(),
  estimatedTimeSeconds: z.number().min(10).max(3600),
})

const DecompositionResultSchema = z.object({
  title: z.string().max(100),
  steps: z.array(TaskStepSchema).min(1).max(10),
  totalEstimatedTimeSeconds: z.number(),
})

export type DecompositionResult = z.infer<typeof DecompositionResultSchema>
export type TaskStepInput = z.infer<typeof TaskStepSchema>

export interface DecomposeOptions {
  taskDescription: string
  templateContext?: string
  knowledgeContext?: string
  maxSteps?: number
}

/**
 * Decompose a task into actionable steps using AI
 */
export async function decomposeTask(options: DecomposeOptions): Promise<DecompositionResult> {
  const { taskDescription, templateContext, knowledgeContext } = options

  const userPrompt = getDecompositionPrompt(
    taskDescription,
    templateContext,
    knowledgeContext
  )

  try {
    const result = await generateObject({
      model: openai('gpt-4o'),
      schema: DecompositionResultSchema,
      system: SYSTEM_PROMPTS.taskDecomposer,
      prompt: userPrompt,
      temperature: 0.7,
      maxOutputTokens: 2000,
    })

    return result.object
  } catch (error) {
    console.error('Task decomposition failed:', error)
    throw new Error('Failed to decompose task. Please try again.')
  }
}

/**
 * Generate a task title from description
 */
export async function generateTaskTitle(description: string): Promise<string> {
  const titleSchema = z.object({
    title: z.string().max(100),
  })

  try {
    const result = await generateObject({
      model: openai('gpt-4o-mini'),
      schema: titleSchema,
      system: 'Generate a concise, descriptive title for the given task. Max 100 characters.',
      prompt: description,
      temperature: 0.5,
      maxOutputTokens: 100,
    })

    return result.object.title
  } catch (error) {
    console.error('Title generation failed:', error)
    // Fallback: use first 100 chars of description
    return description.slice(0, 97) + '...'
  }
}

/**
 * Estimate task complexity and time
 */
export async function estimateTaskComplexity(description: string): Promise<{
  complexity: 'low' | 'medium' | 'high'
  estimatedMinutes: number
  suggestedSteps: number
}> {
  const estimationSchema = z.object({
    complexity: z.enum(['low', 'medium', 'high']),
    estimatedMinutes: z.number().min(1).max(120),
    suggestedSteps: z.number().min(1).max(10),
  })

  try {
    const result = await generateObject({
      model: openai('gpt-4o-mini'),
      schema: estimationSchema,
      system: `Estimate the complexity and time required for a task.
        - low: Simple tasks, < 5 minutes, 1-3 steps
        - medium: Moderate tasks, 5-15 minutes, 3-5 steps  
        - high: Complex tasks, 15+ minutes, 5-7 steps`,
      prompt: description,
      temperature: 0.3,
      maxOutputTokens: 200,
    })

    return result.object
  } catch (error) {
    console.error('Complexity estimation failed:', error)
    return {
      complexity: 'medium',
      estimatedMinutes: 10,
      suggestedSteps: 4,
    }
  }
}
