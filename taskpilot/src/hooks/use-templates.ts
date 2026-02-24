"use client"

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import type { 
  TemplateListResponse, 
  TemplateListParams,
  UseTemplateRequest,
  UseTemplateResponse,
  ApiError 
} from '@/types/api'
import type { TemplateCategoryEnum, Template } from '@/types/database'

const TEMPLATES_QUERY_KEY = 'templates'
const TASKS_QUERY_KEY = 'tasks'

// API helper functions
async function fetchTemplates(params: TemplateListParams = {}): Promise<TemplateListResponse> {
  const searchParams = new URLSearchParams()
  
  if (params.page) searchParams.set('page', params.page.toString())
  if (params.limit) searchParams.set('limit', params.limit.toString())
  if (params.category) searchParams.set('category', params.category)
  if (params.search) searchParams.set('search', params.search)
  if (params.sortBy) searchParams.set('sortBy', params.sortBy)
  if (params.sortOrder) searchParams.set('sortOrder', params.sortOrder)
  
  const response = await fetch(`/api/templates?${searchParams.toString()}`)
  
  if (!response.ok) {
    const error: ApiError = await response.json()
    throw new Error(error.error || 'Failed to fetch templates')
  }
  
  return response.json()
}

async function fetchTemplate(templateId: string): Promise<Template> {
  const response = await fetch(`/api/templates/${templateId}`)
  
  if (!response.ok) {
    const error: ApiError = await response.json()
    throw new Error(error.error || 'Failed to fetch template')
  }
  
  const result = await response.json()
  return result.data
}

async function applyTemplate(
  templateId: string, 
  data: UseTemplateRequest
): Promise<UseTemplateResponse> {
  const response = await fetch(`/api/templates/${templateId}/use`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  })
  
  if (!response.ok) {
    const error: ApiError = await response.json()
    throw new Error(error.error || 'Failed to use template')
  }
  
  return response.json()
}

// Query hooks
export function useTemplates(params: TemplateListParams = {}) {
  return useQuery({
    queryKey: [TEMPLATES_QUERY_KEY, params],
    queryFn: () => fetchTemplates(params),
    staleTime: 5 * 60 * 1000, // 5 minutes - templates don't change often
  })
}

export function useTemplateDetail(templateId: string | null) {
  return useQuery({
    queryKey: [TEMPLATES_QUERY_KEY, templateId],
    queryFn: () => fetchTemplate(templateId!),
    enabled: !!templateId,
    staleTime: 5 * 60 * 1000,
  })
}

export function useTemplatesByCategory(category: TemplateCategoryEnum | null) {
  return useQuery({
    queryKey: [TEMPLATES_QUERY_KEY, 'category', category],
    queryFn: () => fetchTemplates(category ? { category } : {}),
    staleTime: 5 * 60 * 1000,
  })
}

export function usePopularTemplates(limit = 6) {
  return useQuery({
    queryKey: [TEMPLATES_QUERY_KEY, 'popular', limit],
    queryFn: () => fetchTemplates({ 
      limit, 
      sortBy: 'usage_count', 
      sortOrder: 'desc' 
    }),
    staleTime: 5 * 60 * 1000,
  })
}

// Mutation hooks
export function useUseTemplate() {
  const queryClient = useQueryClient()
  
  return useMutation<UseTemplateResponse, Error, { templateId: string; data: UseTemplateRequest }>({
    mutationFn: ({ templateId, data }) =>
      applyTemplate(templateId, data),
    onSuccess: () => {
      // Invalidate tasks since a new one was created
      queryClient.invalidateQueries({ queryKey: [TASKS_QUERY_KEY] })
      // Optionally refetch templates to update usage_count
      queryClient.invalidateQueries({ queryKey: [TEMPLATES_QUERY_KEY] })
    },
  })
}

// Helper to get category display info
export const categoryInfo: Record<TemplateCategoryEnum, { label: string; color: string }> = {
  research: { label: 'Research', color: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400' },
  content: { label: 'Content', color: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' },
  email: { label: 'Email', color: 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400' },
  data_analysis: { label: 'Analysis', color: 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400' },
  social_media: { label: 'Social Media', color: 'bg-pink-100 text-pink-700 dark:bg-pink-900/30 dark:text-pink-400' },
  seo: { label: 'SEO', color: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400' },
  other: { label: 'Other', color: 'bg-gray-100 text-gray-700 dark:bg-gray-900/30 dark:text-gray-400' },
}
