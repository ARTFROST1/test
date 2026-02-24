"use client"

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import type { 
  TaskListResponse, 
  TaskWithSteps, 
  CreateTaskRequest, 
  CreateTaskResponse,
  TaskListParams,
  UpdateTaskRequest,
  ApiError 
} from '@/types/api'

const TASKS_QUERY_KEY = 'tasks'

// API helper functions
async function fetchTasks(params: TaskListParams): Promise<TaskListResponse> {
  const searchParams = new URLSearchParams()
  
  if (params.page) searchParams.set('page', params.page.toString())
  if (params.limit) searchParams.set('limit', params.limit.toString())
  if (params.status) {
    const statusValue = Array.isArray(params.status) 
      ? params.status.join(',') 
      : params.status
    searchParams.set('status', statusValue)
  }
  if (params.search) searchParams.set('search', params.search)
  if (params.sortBy) searchParams.set('sortBy', params.sortBy)
  if (params.sortOrder) searchParams.set('sortOrder', params.sortOrder)
  
  const response = await fetch(`/api/tasks?${searchParams.toString()}`)
  
  if (!response.ok) {
    const error: ApiError = await response.json()
    throw new Error(error.error || 'Failed to fetch tasks')
  }
  
  return response.json()
}

async function fetchTask(taskId: string): Promise<TaskWithSteps> {
  const response = await fetch(`/api/tasks/${taskId}`)
  
  if (!response.ok) {
    const error: ApiError = await response.json()
    throw new Error(error.error || 'Failed to fetch task')
  }
  
  const result = await response.json()
  return result.data
}

async function createTask(data: CreateTaskRequest): Promise<CreateTaskResponse> {
  const response = await fetch('/api/tasks', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  })
  
  if (!response.ok) {
    const error: ApiError = await response.json()
    throw new Error(error.error || 'Failed to create task')
  }
  
  return response.json()
}

async function updateTask(taskId: string, data: UpdateTaskRequest): Promise<TaskWithSteps> {
  const response = await fetch(`/api/tasks/${taskId}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  })
  
  if (!response.ok) {
    const error: ApiError = await response.json()
    throw new Error(error.error || 'Failed to update task')
  }
  
  const result = await response.json()
  return result.data
}

async function cancelTask(taskId: string): Promise<TaskWithSteps> {
  return updateTask(taskId, { status: 'canceled' })
}

async function executeTask(taskId: string): Promise<void> {
  const response = await fetch(`/api/tasks/${taskId}/execute`, {
    method: 'POST',
  })
  
  if (!response.ok) {
    const error: ApiError = await response.json()
    throw new Error(error.error || 'Failed to execute task')
  }
}

// Query hooks
export function useTasks(params: TaskListParams = {}) {
  return useQuery({
    queryKey: [TASKS_QUERY_KEY, params],
    queryFn: () => fetchTasks(params),
    staleTime: 30 * 1000, // 30 seconds
  })
}

export function useTask(taskId: string | null) {
  return useQuery({
    queryKey: [TASKS_QUERY_KEY, taskId],
    queryFn: () => fetchTask(taskId!),
    enabled: !!taskId,
    staleTime: 10 * 1000, // 10 seconds
    refetchInterval: (query) => {
      // Refetch every 3 seconds if task is running
      const task = query.state.data
      if (task && ['decomposing', 'executing'].includes(task.status)) {
        return 3000
      }
      return false
    },
  })
}

export function useRecentTasks(limit = 5) {
  return useQuery({
    queryKey: [TASKS_QUERY_KEY, 'recent', limit],
    queryFn: () => fetchTasks({ limit, sortBy: 'created_at', sortOrder: 'desc' }),
    staleTime: 30 * 1000,
  })
}

// Mutation hooks
export function useCreateTask() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: createTask,
    onSuccess: () => {
      // Invalidate all task queries
      queryClient.invalidateQueries({ queryKey: [TASKS_QUERY_KEY] })
    },
  })
}

export function useUpdateTask() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: ({ taskId, data }: { taskId: string; data: UpdateTaskRequest }) =>
      updateTask(taskId, data),
    onSuccess: (data) => {
      // Update the specific task in cache
      queryClient.setQueryData([TASKS_QUERY_KEY, data.id], data)
      // Invalidate list queries
      queryClient.invalidateQueries({ queryKey: [TASKS_QUERY_KEY] })
    },
  })
}

export function useCancelTask() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: cancelTask,
    onSuccess: (data) => {
      queryClient.setQueryData([TASKS_QUERY_KEY, data.id], data)
      queryClient.invalidateQueries({ queryKey: [TASKS_QUERY_KEY] })
    },
  })
}

export function useExecuteTask() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: executeTask,
    onSuccess: (_, taskId) => {
      // Invalidate to trigger refetch
      queryClient.invalidateQueries({ queryKey: [TASKS_QUERY_KEY, taskId] })
      queryClient.invalidateQueries({ queryKey: [TASKS_QUERY_KEY] })
    },
  })
}
