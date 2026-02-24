/**
 * AI Task Execution Service with Streaming
 */

import { openai } from '@ai-sdk/openai'
import { anthropic } from '@ai-sdk/anthropic'
import { streamText, generateText } from 'ai'
import { SYSTEM_PROMPTS, getExecutionPrompt, TASK_TEMPLATES } from './prompts'
import type { TaskStep, TemplateCategoryEnum } from '@/types/database'

export interface ExecuteStepOptions {
  taskDescription: string
  step: Pick<TaskStep, 'title' | 'description'>
  previousOutputs: string[]
  knowledgeContext?: string
  templateCategory?: TemplateCategoryEnum
  stream?: boolean
}

export interface ExecuteStepResult {
  output: string
  tokensUsed: {
    input: number
    output: number
  }
}

/**
 * Get the appropriate system prompt based on template category
 */
function getSystemPrompt(category?: TemplateCategoryEnum): string {
  if (!category) return SYSTEM_PROMPTS.taskExecutor
  
  // Map database category enum to TASK_TEMPLATES keys
  const categoryMap: Record<TemplateCategoryEnum, keyof typeof TASK_TEMPLATES | null> = {
    research: 'research',
    content: 'contentCreation',
    email: 'emailOutreach',
    data_analysis: 'dataAnalysis',
    social_media: 'socialMedia',
    seo: 'seo',
    other: null,
  }
  
  const templateKey = categoryMap[category]
  if (templateKey && TASK_TEMPLATES[templateKey]) {
    return TASK_TEMPLATES[templateKey].systemPrompt
  }
  
  return SYSTEM_PROMPTS.taskExecutor
}

/**
 * Execute a single task step with streaming response
 */
export async function executeStepStream(options: ExecuteStepOptions) {
  const { taskDescription, step, previousOutputs, knowledgeContext, templateCategory } = options

  const userPrompt = getExecutionPrompt(
    taskDescription,
    step,
    previousOutputs,
    knowledgeContext
  )

  const systemPrompt = getSystemPrompt(templateCategory)

  try {
    const result = await streamText({
      model: openai('gpt-4o'),
      system: systemPrompt,
      prompt: userPrompt,
      temperature: 0.7,
      maxOutputTokens: 4000,
    })

    return result
  } catch (error) {
    console.error('Step execution streaming failed:', error)
    throw new Error('Failed to execute step. Please try again.')
  }
}

/**
 * Execute a single task step without streaming
 */
export async function executeStep(options: ExecuteStepOptions): Promise<ExecuteStepResult> {
  const { taskDescription, step, previousOutputs, knowledgeContext, templateCategory } = options

  const userPrompt = getExecutionPrompt(
    taskDescription,
    step,
    previousOutputs,
    knowledgeContext
  )

  const systemPrompt = getSystemPrompt(templateCategory)

  try {
    const result = await generateText({
      model: openai('gpt-4o'),
      system: systemPrompt,
      prompt: userPrompt,
      temperature: 0.7,
      maxOutputTokens: 4000,
    })

    return {
      output: result.text,
      tokensUsed: {
        input: result.usage?.inputTokens ?? 0,
        output: result.usage?.outputTokens ?? 0,
      },
    }
  } catch (error) {
    console.error('Step execution failed:', error)
    throw new Error('Failed to execute step. Please try again.')
  }
}

/**
 * Execute step with fallback to Anthropic Claude if OpenAI fails
 */
export async function executeStepWithFallback(options: ExecuteStepOptions): Promise<ExecuteStepResult> {
  try {
    return await executeStep(options)
  } catch (openaiError) {
    console.warn('OpenAI execution failed, falling back to Anthropic:', openaiError)
    
    const { taskDescription, step, previousOutputs, knowledgeContext, templateCategory } = options

    const userPrompt = getExecutionPrompt(
      taskDescription,
      step,
      previousOutputs,
      knowledgeContext
    )

    const systemPrompt = getSystemPrompt(templateCategory)

    try {
      const result = await generateText({
        model: anthropic('claude-sonnet-4-20250514'),
        system: systemPrompt,
        prompt: userPrompt,
        temperature: 0.7,
        maxOutputTokens: 4000,
      })

      return {
        output: result.text,
        tokensUsed: {
          input: result.usage?.inputTokens ?? 0,
          output: result.usage?.outputTokens ?? 0,
        },
      }
    } catch (anthropicError) {
      console.error('Anthropic fallback also failed:', anthropicError)
      throw new Error('All AI providers failed. Please try again later.')
    }
  }
}

/**
 * Aggregate step outputs into a final result
 */
export async function aggregateResults(
  taskDescription: string,
  stepOutputs: { title: string; output: string }[]
): Promise<string> {
  const outputsSummary = stepOutputs
    .map((s, i) => `## Step ${i + 1}: ${s.title}\n\n${s.output}`)
    .join('\n\n---\n\n')

  try {
    const result = await generateText({
      model: openai('gpt-4o'),
      system: `You are compiling the final output for a completed task. 
        Combine the step outputs into a cohesive, well-structured final document.
        - Keep all important information
        - Remove redundancy
        - Add executive summary at the top
        - Format with clear sections using markdown`,
      prompt: `Task: ${taskDescription}\n\nStep Outputs:\n\n${outputsSummary}`,
      temperature: 0.5,
      maxOutputTokens: 6000,
    })

    return result.text
  } catch (error) {
    console.error('Result aggregation failed:', error)
    // Fallback: return concatenated outputs
    return `# Task Results\n\n${outputsSummary}`
  }
}
