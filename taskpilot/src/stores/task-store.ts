import { create } from 'zustand'
import type { TaskStatus } from '@/types/database'

interface TaskFilters {
  status: TaskStatus | 'all'
  search: string
  sortBy: 'created_at' | 'updated_at' | 'status'
  sortOrder: 'asc' | 'desc'
}

interface TaskStoreState {
  // Active task being viewed
  activeTaskId: string | null
  setActiveTaskId: (id: string | null) => void
  
  // Task creation modal
  isCreateModalOpen: boolean
  openCreateModal: () => void
  closeCreateModal: () => void
  
  // Task filters
  filters: TaskFilters
  setFilter: <K extends keyof TaskFilters>(key: K, value: TaskFilters[K]) => void
  resetFilters: () => void
  
  // Selected template for task creation
  selectedTemplateId: string | null
  setSelectedTemplateId: (id: string | null) => void
  
  // Task progress streaming
  streamingTaskId: string | null
  setStreamingTaskId: (id: string | null) => void
}

const defaultFilters: TaskFilters = {
  status: 'all',
  search: '',
  sortBy: 'created_at',
  sortOrder: 'desc',
}

export const useTaskStore = create<TaskStoreState>((set) => ({
  // Active task
  activeTaskId: null,
  setActiveTaskId: (id) => set({ activeTaskId: id }),
  
  // Create modal
  isCreateModalOpen: false,
  openCreateModal: () => set({ isCreateModalOpen: true }),
  closeCreateModal: () => set({ isCreateModalOpen: false, selectedTemplateId: null }),
  
  // Filters
  filters: defaultFilters,
  setFilter: (key, value) => set((state) => ({
    filters: { ...state.filters, [key]: value },
  })),
  resetFilters: () => set({ filters: defaultFilters }),
  
  // Template selection
  selectedTemplateId: null,
  setSelectedTemplateId: (id) => set({ selectedTemplateId: id }),
  
  // Streaming
  streamingTaskId: null,
  setStreamingTaskId: (id) => set({ streamingTaskId: id }),
}))
