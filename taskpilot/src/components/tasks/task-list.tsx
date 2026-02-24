"use client"

import { useState } from "react"
import { Search, Filter, X, ListFilter } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { TaskCard } from "./task-card"
import { TaskListSkeleton } from "@/components/shared/loading-skeleton"
import { EmptyState } from "@/components/shared/empty-state"
import { useTasks } from "@/hooks/use-tasks"
import { useTaskStore } from "@/stores/task-store"
import type { TaskStatus } from "@/types/database"

const STATUS_OPTIONS: { value: TaskStatus | 'all'; label: string }[] = [
  { value: 'all', label: 'All Tasks' },
  { value: 'pending', label: 'Pending' },
  { value: 'executing', label: 'Running' },
  { value: 'completed', label: 'Completed' },
  { value: 'failed', label: 'Failed' },
  { value: 'canceled', label: 'Canceled' },
]

interface TaskListProps {
  className?: string
  showFilters?: boolean
  limit?: number
}

export function TaskList({ 
  className, 
  showFilters = true,
  limit = 10,
}: TaskListProps) {
  const [showFilterPanel, setShowFilterPanel] = useState(false)
  const { filters, setFilter, resetFilters } = useTaskStore()
  
  const { data, isLoading, isError, error, refetch } = useTasks({
    page: 1,
    limit,
    status: filters.status === 'all' ? undefined : filters.status,
    search: filters.search || undefined,
    sortBy: filters.sortBy,
    sortOrder: filters.sortOrder,
  })

  const tasks = data?.data || []
  const hasActiveFilters = filters.status !== 'all' || filters.search !== ''

  if (isLoading) {
    return <TaskListSkeleton count={limit > 5 ? 5 : limit} />
  }

  if (isError) {
    return (
      <EmptyState
        icon={X}
        title="Failed to load tasks"
        description={error?.message || "Something went wrong. Please try again."}
        action={{ label: "Retry", onClick: () => refetch() }}
        className={className}
      />
    )
  }

  return (
    <div className={cn("space-y-4", className)}>
      {showFilters && (
        <div className="flex flex-col sm:flex-row gap-3">
          {/* Search */}
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search tasks..."
              value={filters.search}
              onChange={(e) => setFilter('search', e.target.value)}
              className="pl-9"
            />
          </div>
          
          {/* Filter toggle */}
          <Button
            variant={showFilterPanel || hasActiveFilters ? "secondary" : "outline"}
            onClick={() => setShowFilterPanel(!showFilterPanel)}
            className="sm:w-auto"
          >
            <Filter className="h-4 w-4 mr-2" />
            Filters
            {hasActiveFilters && (
              <span className="ml-2 h-5 w-5 rounded-full bg-primary text-primary-foreground text-xs flex items-center justify-center">
                !
              </span>
            )}
          </Button>
        </div>
      )}

      {/* Filter panel */}
      {showFilters && showFilterPanel && (
        <div className="rounded-lg border border-border bg-card p-4 space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="font-medium flex items-center gap-2">
              <ListFilter className="h-4 w-4" />
              Filter Tasks
            </h4>
            {hasActiveFilters && (
              <Button
                variant="ghost"
                size="sm"
                onClick={resetFilters}
                className="text-muted-foreground"
              >
                <X className="h-4 w-4 mr-1" />
                Clear filters
              </Button>
            )}
          </div>
          
          {/* Status filter */}
          <div>
            <label className="text-sm font-medium mb-2 block">Status</label>
            <div className="flex flex-wrap gap-2">
              {STATUS_OPTIONS.map((option) => (
                <Button
                  key={option.value}
                  variant={filters.status === option.value ? "default" : "outline"}
                  size="sm"
                  onClick={() => setFilter('status', option.value)}
                >
                  {option.label}
                </Button>
              ))}
            </div>
          </div>
          
          {/* Sort options */}
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <label className="text-sm font-medium mb-2 block">Sort by</label>
              <div className="flex gap-2">
                {(['created_at', 'updated_at'] as const).map((option) => (
                  <Button
                    key={option}
                    variant={filters.sortBy === option ? "default" : "outline"}
                    size="sm"
                    onClick={() => setFilter('sortBy', option)}
                  >
                    {option === 'created_at' ? 'Created' : 'Updated'}
                  </Button>
                ))}
              </div>
            </div>
            
            <div className="flex-1">
              <label className="text-sm font-medium mb-2 block">Order</label>
              <div className="flex gap-2">
                {(['desc', 'asc'] as const).map((option) => (
                  <Button
                    key={option}
                    variant={filters.sortOrder === option ? "default" : "outline"}
                    size="sm"
                    onClick={() => setFilter('sortOrder', option)}
                  >
                    {option === 'desc' ? 'Newest first' : 'Oldest first'}
                  </Button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Task list */}
      {tasks.length === 0 ? (
        <EmptyState
          title={hasActiveFilters ? "No matching tasks" : "No tasks yet"}
          description={
            hasActiveFilters 
              ? "Try adjusting your filters to find what you're looking for."
              : "Create your first task to get started with AI-powered delegation."
          }
          action={hasActiveFilters ? { label: "Clear filters", onClick: resetFilters } : undefined}
        />
      ) : (
        <div className="space-y-3">
          {tasks.map((task) => (
            <TaskCard key={task.id} task={task} />
          ))}
        </div>
      )}

      {/* Pagination info */}
      {data && data.pagination.total > limit && (
        <p className="text-sm text-muted-foreground text-center pt-2">
          Showing {tasks.length} of {data.pagination.total} tasks
        </p>
      )}
    </div>
  )
}
