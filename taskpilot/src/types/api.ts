/**
 * API Request/Response types for TaskPilot
 */

import type { 
  Task, 
  TaskStep, 
  TaskResult, 
  Template, 
  Subscription,
  SubscriptionPlan,
  TemplateCategoryEnum,
  TaskStatus,
  TemplateParameter
} from './database'

// ============== Common Types ==============

export interface ApiError {
  error: string
  code?: string
  details?: Record<string, unknown>
}

export interface ApiSuccess<T> {
  data: T
}

export type ApiResponse<T> = ApiSuccess<T> | ApiError

export interface PaginationParams {
  page?: number
  limit?: number
}

export interface PaginationMeta {
  page: number
  limit: number
  total: number
  totalPages: number
  hasMore: boolean
}

export interface PaginatedResponse<T> {
  data: T[]
  pagination: PaginationMeta
}

// ============== Auth ==============

export interface LoginRequest {
  email: string
  password: string
}

export interface SignupRequest {
  email: string
  password: string
  fullName?: string
}

export interface AuthResponse {
  user: {
    id: string
    email: string
    fullName: string | null
  }
}

// ============== Tasks ==============

export interface CreateTaskRequest {
  description: string
  templateId?: string
  useKnowledgeBase?: boolean
  templateParams?: Record<string, unknown>
}

export interface CreateTaskResponse {
  task: TaskWithSteps
}

export interface TaskWithSteps extends Task {
  steps: TaskStep[]
  result?: TaskResult
  template?: Pick<Template, 'id' | 'name' | 'category'>
}

export interface TaskListParams extends PaginationParams {
  status?: TaskStatus | TaskStatus[]
  search?: string
  sortBy?: 'created_at' | 'updated_at' | 'status'
  sortOrder?: 'asc' | 'desc'
}

export interface TaskListResponse extends PaginatedResponse<TaskWithSteps> {}

export interface UpdateTaskRequest {
  title?: string
  status?: TaskStatus
  progress?: number
}

export interface ExecuteTaskRequest {
  stepIndex?: number // Optional: start from specific step
}

export interface TaskStreamEvent {
  type: 'step_start' | 'step_progress' | 'step_complete' | 'task_complete' | 'error'
  stepIndex?: number
  content?: string
  progress?: number
  error?: string
}

// ============== Templates ==============

export interface TemplateListParams extends PaginationParams {
  category?: TemplateCategoryEnum
  search?: string
  sortBy?: 'name' | 'usage_count' | 'avg_rating' | 'created_at'
  sortOrder?: 'asc' | 'desc'
}

export interface TemplateListResponse extends PaginatedResponse<Template> {}

export interface TemplateWithCategory extends Template {
  category_info?: {
    name: string
    slug: string
    icon: string | null
  }
}

export interface UseTemplateRequest {
  taskDescription?: string
  templateParams: Record<string, unknown>
}

export interface UseTemplateResponse {
  task: TaskWithSteps
}

// ============== Subscription ==============

export interface SubscriptionResponse {
  subscription: Subscription
  limits: {
    tasksUsed: number
    tasksLimit: number
    tasksRemaining: number
    storageUsed: number
    storageLimit: number
    storageRemaining: number
  }
}

export interface CreateCheckoutRequest {
  plan: Exclude<SubscriptionPlan, 'free'>
  successUrl?: string
  cancelUrl?: string
}

export interface CreateCheckoutResponse {
  checkoutUrl: string
  sessionId: string
}

export interface CreatePortalRequest {
  returnUrl?: string
}

export interface CreatePortalResponse {
  portalUrl: string
}

// ============== Webhook Events ==============

export interface StripeWebhookEvent {
  type: string
  data: {
    object: Record<string, unknown>
  }
}

// ============== Knowledge Base ==============

export interface UploadDocumentRequest {
  file: File
  folder?: string
}

export interface UploadDocumentResponse {
  document: {
    id: string
    name: string
    fileType: string
    fileSize: number
    status: string
  }
}

export interface SearchKnowledgeRequest {
  query: string
  limit?: number
  threshold?: number
}

export interface SearchKnowledgeResponse {
  results: {
    documentId: string
    documentName: string
    chunkIndex: number
    content: string
    similarity: number
  }[]
}

// ============== Plan Limits ==============

export const PLAN_LIMITS = {
  free: {
    tasks: 5,
    storage: 104857600, // 100MB
    knowledgeBase: true,
    templates: true,
    export: ['markdown'],
    support: 'community',
  },
  pro: {
    tasks: 50,
    storage: 1073741824, // 1GB
    knowledgeBase: true,
    templates: true,
    export: ['markdown', 'pdf', 'docx'],
    support: 'email',
  },
  business: {
    tasks: 200,
    storage: 10737418240, // 10GB
    knowledgeBase: true,
    templates: true,
    export: ['markdown', 'pdf', 'docx'],
    support: 'priority',
    api: true,
    customTemplates: true,
  },
} as const
