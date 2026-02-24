"use client"

import { Loader2 } from "lucide-react"

import { cn } from "@/lib/utils"
import type { TaskWithSteps } from "@/types/api"
import type { TaskStatus } from "@/types/database"

const statusMessages: Record<TaskStatus, string> = {
  pending: "Waiting to start...",
  decomposing: "Planning task steps...",
  executing: "Executing task...",
  paused: "Task paused",
  completed: "Task complete!",
  failed: "Task failed",
  canceled: "Task canceled",
}

interface TaskProgressProps {
  task: TaskWithSteps
  className?: string
  showAnimation?: boolean
}

export function TaskProgress({ 
  task, 
  className,
  showAnimation = true,
}: TaskProgressProps) {
  const isRunning = ['decomposing', 'executing'].includes(task.status)
  const isComplete = task.status === 'completed'
  const isFailed = task.status === 'failed'
  
  const completedSteps = task.steps?.filter(s => s.status === 'completed').length || 0
  const totalSteps = task.steps?.length || 0
  const currentStep = task.steps?.find(s => s.status === 'in_progress')

  // Calculate time estimates
  const formatTime = (seconds: number | null) => {
    if (!seconds) return null
    if (seconds < 60) return `${seconds}s`
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return secs > 0 ? `${mins}m ${secs}s` : `${mins}m`
  }

  const estimatedTime = formatTime(task.estimated_time_seconds)
  const actualTime = formatTime(task.actual_time_seconds)

  return (
    <div className={cn("rounded-lg border border-border bg-card p-6", className)}>
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          {isRunning && showAnimation && (
            <Loader2 className="h-5 w-5 text-primary animate-spin" />
          )}
          <div>
            <h3 className="font-semibold">
              {statusMessages[task.status]}
            </h3>
            {currentStep && (
              <p className="text-sm text-muted-foreground">
                {currentStep.title}
              </p>
            )}
          </div>
        </div>
        
        <span className={cn(
          "text-2xl font-bold",
          isComplete && "text-green-600",
          isFailed && "text-destructive"
        )}>
          {task.progress}%
        </span>
      </div>

      {/* Progress bar */}
      <div className="h-3 bg-muted rounded-full overflow-hidden mb-4">
        <div 
          className={cn(
            "h-full rounded-full transition-all duration-700 ease-out",
            isRunning && "bg-primary",
            isComplete && "bg-green-500",
            isFailed && "bg-destructive",
            task.status === 'canceled' && "bg-muted-foreground",
            task.status === 'paused' && "bg-yellow-500",
            task.status === 'pending' && "bg-muted-foreground",
            isRunning && showAnimation && "animate-pulse"
          )}
          style={{ width: `${task.progress}%` }}
        />
      </div>

      {/* Stats */}
      <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-sm">
        {totalSteps > 0 && (
          <div className="flex items-center gap-2">
            <span className="text-muted-foreground">Steps:</span>
            <span className="font-medium">
              {completedSteps} / {totalSteps}
            </span>
          </div>
        )}
        
        {estimatedTime && !actualTime && (
          <div className="flex items-center gap-2">
            <span className="text-muted-foreground">Est. time:</span>
            <span className="font-medium">{estimatedTime}</span>
          </div>
        )}
        
        {actualTime && (
          <div className="flex items-center gap-2">
            <span className="text-muted-foreground">Duration:</span>
            <span className="font-medium">{actualTime}</span>
          </div>
        )}
      </div>

      {/* Running animation indicator */}
      {isRunning && showAnimation && (
        <div className="mt-4 flex items-center gap-2 text-sm text-muted-foreground">
          <div className="flex gap-1">
            <span className="h-1.5 w-1.5 bg-primary rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
            <span className="h-1.5 w-1.5 bg-primary rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
            <span className="h-1.5 w-1.5 bg-primary rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
          </div>
          <span>AI is working on your task</span>
        </div>
      )}
    </div>
  )
}
