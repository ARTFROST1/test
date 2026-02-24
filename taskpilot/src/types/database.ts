/**
 * Database types for TaskPilot
 * These types represent the database schema and should be kept in sync with Supabase
 * Note: In production, generate these types using: npx supabase gen types typescript
 */

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

// ============== Enums ==============

export type AuthProvider = 'email' | 'google' | 'github'

export type SubscriptionPlan = 'free' | 'pro' | 'business'

export type SubscriptionStatus = 'active' | 'canceled' | 'past_due' | 'trialing' | 'paused'

export type TaskStatus = 'pending' | 'decomposing' | 'executing' | 'paused' | 'completed' | 'failed' | 'canceled'

export type TaskStepStatus = 'pending' | 'in_progress' | 'completed' | 'failed' | 'skipped'

export type TemplateCategoryEnum = 'research' | 'content' | 'email' | 'data_analysis' | 'social_media' | 'seo' | 'other'

export type ContentFormat = 'markdown' | 'html' | 'plain'

export type DocumentFileType = 'txt' | 'md' | 'pdf' | 'docx'

export type EmbeddingStatus = 'pending' | 'processing' | 'completed' | 'failed'

export type UsageEventType = 
  | 'task_created' 
  | 'task_completed' 
  | 'task_failed'
  | 'document_uploaded' 
  | 'document_deleted'
  | 'template_used'
  | 'export_markdown' 
  | 'export_pdf'
  | 'subscription_upgraded' 
  | 'subscription_downgraded' 
  | 'subscription_canceled'
  | 'login' 
  | 'logout'
  | 'api_call'

export type ResourceType = 'task' | 'document' | 'template' | 'subscription'

// ============== Helper Types ==============

export interface UserPreferences {
  theme?: 'light' | 'dark' | 'system'
  notifications_email?: boolean
  notifications_push?: boolean
  default_knowledge_base?: boolean
  language?: string
}

export interface TemplateParameter {
  name: string
  type: 'string' | 'number' | 'boolean' | 'enum'
  required: boolean
  description: string
  placeholder?: string
  options?: string[]
  default?: string | number | boolean
}

export interface SourceReference {
  document_id: string
  document_name: string
  chunk_indices: number[]
  relevance_score: number
}

// ============== Database Type ==============

export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string
          email: string
          full_name: string | null
          avatar_url: string | null
          auth_provider: AuthProvider
          email_verified: boolean
          onboarding_completed: boolean
          preferences: Json
          created_at: string
          updated_at: string
          last_login_at: string | null
          deleted_at: string | null
        }
        Insert: {
          id: string
          email: string
          full_name?: string | null
          avatar_url?: string | null
          auth_provider?: AuthProvider
          email_verified?: boolean
          onboarding_completed?: boolean
          preferences?: Json
          created_at?: string
          updated_at?: string
          last_login_at?: string | null
          deleted_at?: string | null
        }
        Update: {
          id?: string
          email?: string
          full_name?: string | null
          avatar_url?: string | null
          auth_provider?: AuthProvider
          email_verified?: boolean
          onboarding_completed?: boolean
          preferences?: Json
          created_at?: string
          updated_at?: string
          last_login_at?: string | null
          deleted_at?: string | null
        }
        Relationships: []
      }
      subscriptions: {
        Row: {
          id: string
          user_id: string
          plan: SubscriptionPlan
          status: SubscriptionStatus
          stripe_customer_id: string | null
          stripe_subscription_id: string | null
          current_period_start: string | null
          current_period_end: string | null
          tasks_used_this_month: number
          task_limit: number
          storage_used_bytes: number
          storage_limit_bytes: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          plan?: SubscriptionPlan
          status?: SubscriptionStatus
          stripe_customer_id?: string | null
          stripe_subscription_id?: string | null
          current_period_start?: string | null
          current_period_end?: string | null
          tasks_used_this_month?: number
          task_limit?: number
          storage_used_bytes?: number
          storage_limit_bytes?: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          plan?: SubscriptionPlan
          status?: SubscriptionStatus
          stripe_customer_id?: string | null
          stripe_subscription_id?: string | null
          current_period_start?: string | null
          current_period_end?: string | null
          tasks_used_this_month?: number
          task_limit?: number
          storage_used_bytes?: number
          storage_limit_bytes?: number
          created_at?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "subscriptions_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: true
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
      tasks: {
        Row: {
          id: string
          user_id: string
          template_id: string | null
          title: string
          description: string
          status: TaskStatus
          progress: number
          estimated_time_seconds: number | null
          actual_time_seconds: number | null
          use_knowledge_base: boolean
          template_params: Json | null
          metadata: Json
          created_at: string
          updated_at: string
          started_at: string | null
          completed_at: string | null
          deleted_at: string | null
        }
        Insert: {
          id?: string
          user_id: string
          template_id?: string | null
          title: string
          description: string
          status?: TaskStatus
          progress?: number
          estimated_time_seconds?: number | null
          actual_time_seconds?: number | null
          use_knowledge_base?: boolean
          template_params?: Json | null
          metadata?: Json
          created_at?: string
          updated_at?: string
          started_at?: string | null
          completed_at?: string | null
          deleted_at?: string | null
        }
        Update: {
          id?: string
          user_id?: string
          template_id?: string | null
          title?: string
          description?: string
          status?: TaskStatus
          progress?: number
          estimated_time_seconds?: number | null
          actual_time_seconds?: number | null
          use_knowledge_base?: boolean
          template_params?: Json | null
          metadata?: Json
          created_at?: string
          updated_at?: string
          started_at?: string | null
          completed_at?: string | null
          deleted_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "tasks_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "tasks_template_id_fkey"
            columns: ["template_id"]
            isOneToOne: false
            referencedRelation: "templates"
            referencedColumns: ["id"]
          }
        ]
      }
      task_steps: {
        Row: {
          id: string
          task_id: string
          title: string
          description: string | null
          order_index: number
          status: TaskStepStatus
          estimated_time_seconds: number | null
          actual_time_seconds: number | null
          output: string | null
          error_message: string | null
          started_at: string | null
          completed_at: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          task_id: string
          title: string
          description?: string | null
          order_index: number
          status?: TaskStepStatus
          estimated_time_seconds?: number | null
          actual_time_seconds?: number | null
          output?: string | null
          error_message?: string | null
          started_at?: string | null
          completed_at?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          task_id?: string
          title?: string
          description?: string | null
          order_index?: number
          status?: TaskStepStatus
          estimated_time_seconds?: number | null
          actual_time_seconds?: number | null
          output?: string | null
          error_message?: string | null
          started_at?: string | null
          completed_at?: string | null
          created_at?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "task_steps_task_id_fkey"
            columns: ["task_id"]
            isOneToOne: false
            referencedRelation: "tasks"
            referencedColumns: ["id"]
          }
        ]
      }
      task_results: {
        Row: {
          id: string
          task_id: string
          content: string
          content_format: ContentFormat
          metadata: Json
          sources_used: Json
          tokens_input: number | null
          tokens_output: number | null
          created_at: string
        }
        Insert: {
          id?: string
          task_id: string
          content: string
          content_format?: ContentFormat
          metadata?: Json
          sources_used?: Json
          tokens_input?: number | null
          tokens_output?: number | null
          created_at?: string
        }
        Update: {
          id?: string
          task_id?: string
          content?: string
          content_format?: ContentFormat
          metadata?: Json
          sources_used?: Json
          tokens_input?: number | null
          tokens_output?: number | null
          created_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "task_results_task_id_fkey"
            columns: ["task_id"]
            isOneToOne: true
            referencedRelation: "tasks"
            referencedColumns: ["id"]
          }
        ]
      }
      templates: {
        Row: {
          id: string
          name: string
          description: string | null
          category: TemplateCategoryEnum
          prompt_template: string
          parameters: Json
          example_output: string | null
          usage_count: number
          avg_rating: number | null
          is_active: boolean
          is_public: boolean
          created_by: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          description?: string | null
          category: TemplateCategoryEnum
          prompt_template: string
          parameters?: Json
          example_output?: string | null
          usage_count?: number
          avg_rating?: number | null
          is_active?: boolean
          is_public?: boolean
          created_by?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          description?: string | null
          category?: TemplateCategoryEnum
          prompt_template?: string
          parameters?: Json
          example_output?: string | null
          usage_count?: number
          avg_rating?: number | null
          is_active?: boolean
          is_public?: boolean
          created_by?: string | null
          created_at?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "templates_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
      knowledge_documents: {
        Row: {
          id: string
          user_id: string
          name: string
          file_path: string
          file_type: DocumentFileType
          file_size: number
          folder: string | null
          embedding_status: EmbeddingStatus
          chunk_count: number
          error_message: string | null
          created_at: string
          updated_at: string
          deleted_at: string | null
        }
        Insert: {
          id?: string
          user_id: string
          name: string
          file_path: string
          file_type: DocumentFileType
          file_size: number
          folder?: string | null
          embedding_status?: EmbeddingStatus
          chunk_count?: number
          error_message?: string | null
          created_at?: string
          updated_at?: string
          deleted_at?: string | null
        }
        Update: {
          id?: string
          user_id?: string
          name?: string
          file_path?: string
          file_type?: DocumentFileType
          file_size?: number
          folder?: string | null
          embedding_status?: EmbeddingStatus
          chunk_count?: number
          error_message?: string | null
          created_at?: string
          updated_at?: string
          deleted_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "knowledge_documents_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
      document_embeddings: {
        Row: {
          id: string
          document_id: string
          chunk_index: number
          content: string
          embedding: number[] | null
          created_at: string
        }
        Insert: {
          id?: string
          document_id: string
          chunk_index: number
          content: string
          embedding?: number[] | null
          created_at?: string
        }
        Update: {
          id?: string
          document_id?: string
          chunk_index?: number
          content?: string
          embedding?: number[] | null
          created_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "document_embeddings_document_id_fkey"
            columns: ["document_id"]
            isOneToOne: false
            referencedRelation: "knowledge_documents"
            referencedColumns: ["id"]
          }
        ]
      }
      usage_logs: {
        Row: {
          id: string
          user_id: string
          event_type: UsageEventType
          resource_id: string | null
          resource_type: ResourceType | null
          metadata: Json
          tokens_used: number
          cost_usd: number
          ip_address: string | null
          user_agent: string | null
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          event_type: UsageEventType
          resource_id?: string | null
          resource_type?: ResourceType | null
          metadata?: Json
          tokens_used?: number
          cost_usd?: number
          ip_address?: string | null
          user_agent?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          event_type?: UsageEventType
          resource_id?: string | null
          resource_type?: ResourceType | null
          metadata?: Json
          tokens_used?: number
          cost_usd?: number
          ip_address?: string | null
          user_agent?: string | null
          created_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "usage_logs_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
      template_categories: {
        Row: {
          id: string
          name: string
          slug: string
          description: string | null
          icon: string | null
          display_order: number
          is_active: boolean
          created_at: string
        }
        Insert: {
          id?: string
          name: string
          slug: string
          description?: string | null
          icon?: string | null
          display_order?: number
          is_active?: boolean
          created_at?: string
        }
        Update: {
          id?: string
          name?: string
          slug?: string
          description?: string | null
          icon?: string | null
          display_order?: number
          is_active?: boolean
          created_at?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      increment_tasks_used: {
        Args: {
          p_user_id: string
        }
        Returns: undefined
      }
    }
    Enums: {
      auth_provider: AuthProvider
      subscription_plan: SubscriptionPlan
      subscription_status: SubscriptionStatus
      task_status: TaskStatus
      task_step_status: TaskStepStatus
      template_category: TemplateCategoryEnum
      content_format: ContentFormat
      document_file_type: DocumentFileType
      embedding_status: EmbeddingStatus
      usage_event_type: UsageEventType
      resource_type: ResourceType
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

// ============== Convenience Types ==============

export type Tables<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Row']
export type InsertTables<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Insert']
export type UpdateTables<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Update']

// Legacy aliases for backwards compatibility
export type User = Tables<'users'>
export type Subscription = Tables<'subscriptions'>
export type Task = Tables<'tasks'>
export type TaskStep = Tables<'task_steps'>
export type TaskResult = Tables<'task_results'>
export type Template = Tables<'templates'>
export type KnowledgeDocument = Tables<'knowledge_documents'>
export type DocumentEmbedding = Tables<'document_embeddings'>
export type UsageLog = Tables<'usage_logs'>
// Note: TemplateCategory is already exported as an enum above
