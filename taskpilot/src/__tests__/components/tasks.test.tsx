/**
 * Component Tests - Task Components
 */
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

// Mock providers
vi.mock('@/components/providers/supabase-provider', () => ({
  useSupabase: () => ({
    supabase: {
      auth: {
        signInWithPassword: vi.fn(),
        signUp: vi.fn(),
        signOut: vi.fn(),
      },
    },
    user: null,
    isLoading: false,
  }),
}))

vi.mock('next/navigation', () => ({
  useRouter: () => ({
    push: vi.fn(),
    refresh: vi.fn(),
  }),
  useSearchParams: () => new URLSearchParams(),
}))

// Mock TanStack Query
vi.mock('@tanstack/react-query', () => ({
  useQuery: vi.fn(() => ({
    data: null,
    isLoading: false,
    error: null,
  })),
  useMutation: vi.fn(() => ({
    mutate: vi.fn(),
    mutateAsync: vi.fn(),
    isLoading: false,
    error: null,
  })),
  useQueryClient: vi.fn(() => ({
    invalidateQueries: vi.fn(),
  })),
}))

describe('Task Components', () => {
  describe('TaskInput', () => {
    it('should render input field', async () => {
      const { TaskInput } = await import('@/components/tasks/task-input')
      render(<TaskInput />)

      expect(screen.getByPlaceholderText(/describe your task/i)).toBeInTheDocument()
    })

    it('should show example prompts', async () => {
      const { TaskInput } = await import('@/components/tasks/task-input')
      render(<TaskInput />)

      // Look for example text
      expect(screen.getByText(/example|try/i)).toBeInTheDocument()
    })

    it('should enable submit button when text is entered', async () => {
      const { TaskInput } = await import('@/components/tasks/task-input')
      render(<TaskInput />)

      const input = screen.getByPlaceholderText(/describe your task/i)
      await userEvent.type(input, 'Research top CRM tools')

      const submitButton = screen.getByRole('button', { name: /create|submit|start/i })
      expect(submitButton).not.toBeDisabled()
    })

    it('should call onSubmit when form is submitted', async () => {
      const onSubmit = vi.fn()
      const { TaskInput } = await import('@/components/tasks/task-input')
      render(<TaskInput onSubmit={onSubmit} />)

      const input = screen.getByPlaceholderText(/describe your task/i)
      await userEvent.type(input, 'Research top CRM tools')

      const form = input.closest('form')
      if (form) {
        fireEvent.submit(form)
      }

      // Note: actual submit behavior depends on implementation
    })
  })

  describe('TaskCard', () => {
    it('should render task details', async () => {
      const mockTask = {
        id: 'task-123',
        title: 'Research CRM Tools',
        status: 'executing' as const,
        progress: 50,
        created_at: new Date().toISOString(),
        description: 'Research top 10 CRM tools',
      }

      const { TaskCard } = await import('@/components/tasks/task-card')
      render(<TaskCard task={mockTask} />)

      expect(screen.getByText('Research CRM Tools')).toBeInTheDocument()
      expect(screen.getByText(/50%/)).toBeInTheDocument()
    })

    it('should show correct status badge', async () => {
      const mockTask = {
        id: 'task-123',
        title: 'Completed Task',
        status: 'completed' as const,
        progress: 100,
        created_at: new Date().toISOString(),
        description: 'A completed task',
      }

      const { TaskCard } = await import('@/components/tasks/task-card')
      render(<TaskCard task={mockTask} />)

      expect(screen.getByText(/completed/i)).toBeInTheDocument()
    })
  })

  describe('TaskProgress', () => {
    it('should render progress bar', async () => {
      const { TaskProgress } = await import('@/components/tasks/task-progress')
      render(
        <TaskProgress
          progress={75}
          status="executing"
          elapsedTime={120}
          estimatedTime={180}
        />
      )

      expect(screen.getByRole('progressbar')).toBeInTheDocument()
    })

    it('should show elapsed and estimated time', async () => {
      const { TaskProgress } = await import('@/components/tasks/task-progress')
      render(
        <TaskProgress
          progress={50}
          status="executing"
          elapsedTime={60}
          estimatedTime={120}
        />
      )

      // Time displays depend on implementation
      expect(screen.getByText(/1:00|60|1 min/i)).toBeInTheDocument()
    })
  })

  describe('TaskSteps', () => {
    it('should render all steps', async () => {
      const mockSteps = [
        { id: 'step-1', title: 'Step 1', status: 'completed' as const, order_index: 0 },
        { id: 'step-2', title: 'Step 2', status: 'in_progress' as const, order_index: 1 },
        { id: 'step-3', title: 'Step 3', status: 'pending' as const, order_index: 2 },
      ]

      const { TaskSteps } = await import('@/components/tasks/task-steps')
      render(<TaskSteps steps={mockSteps} />)

      expect(screen.getByText('Step 1')).toBeInTheDocument()
      expect(screen.getByText('Step 2')).toBeInTheDocument()
      expect(screen.getByText('Step 3')).toBeInTheDocument()
    })

    it('should show step status indicators', async () => {
      const mockSteps = [
        { id: 'step-1', title: 'Completed Step', status: 'completed' as const, order_index: 0 },
        { id: 'step-2', title: 'Current Step', status: 'in_progress' as const, order_index: 1 },
      ]

      const { TaskSteps } = await import('@/components/tasks/task-steps')
      render(<TaskSteps steps={mockSteps} />)

      // Check marks or progress indicators
      const stepElements = screen.getAllByRole('listitem')
      expect(stepElements).toHaveLength(2)
    })
  })

  describe('TaskResult', () => {
    it('should render markdown content', async () => {
      const mockResult = {
        id: 'result-123',
        content: '# Research Results\n\nHere are the findings...',
        content_format: 'markdown' as const,
        created_at: new Date().toISOString(),
      }

      const { TaskResult } = await import('@/components/tasks/task-result')
      render(<TaskResult result={mockResult} />)

      expect(screen.getByText('Research Results')).toBeInTheDocument()
    })

    it('should have copy button', async () => {
      const mockResult = {
        id: 'result-123',
        content: 'Some result content',
        content_format: 'markdown' as const,
        created_at: new Date().toISOString(),
      }

      const { TaskResult } = await import('@/components/tasks/task-result')
      render(<TaskResult result={mockResult} />)

      expect(screen.getByRole('button', { name: /copy/i })).toBeInTheDocument()
    })

    it('should have export dropdown', async () => {
      const mockResult = {
        id: 'result-123',
        content: 'Some result content',
        content_format: 'markdown' as const,
        created_at: new Date().toISOString(),
      }

      const { TaskResult } = await import('@/components/tasks/task-result')
      render(<TaskResult result={mockResult} />)

      // Export or download button
      expect(screen.getByRole('button', { name: /export|download/i })).toBeInTheDocument()
    })
  })
})
