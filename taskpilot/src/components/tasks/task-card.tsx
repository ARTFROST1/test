"use client"

import Link from "next/link"
import { Clock, CheckCircle, XCircle, Loader2, Pause, AlertCircle } from "lucide-react"

import { cn } from "@/lib/utils"
import { Card, CardContent } from "@/components/ui/card"
import type { TaskWithSteps } from "@/types/api"
import type { TaskStatus } from "@/types/database"

const statusConfig: Record<TaskStatus, { 
  label: string
  icon: typeof Clock
  className: string
  progressColor: string
}> = {
  pending: {
    label: "Pending",
    icon: Clock,
    className: "text-muted-foreground bg-muted",
    progressColor: "bg-muted-foreground",
  },
  decomposing: {
    label: "Planning",
    icon: Loader2,
    className: "text-blue-600 bg-blue-100 dark:bg-blue-900/30 dark:text-blue-400",
    progressColor: "bg-blue-500",
  },
  executing: {
    label: "Running",
    icon: Loader2,
    className: "text-blue-600 bg-blue-100 dark:bg-blue-900/30 dark:text-blue-400",
    progressColor: "bg-blue-500",
  },
  paused: {
    label: "Paused",
    icon: Pause,
    className: "text-yellow-600 bg-yellow-100 dark:bg-yellow-900/30 dark:text-yellow-400",
    progressColor: "bg-yellow-500",
  },
  completed: {
    label: "Completed",
    icon: CheckCircle,
    className: "text-green-600 bg-green-100 dark:bg-green-900/30 dark:text-green-400",
    progressColor: "bg-green-500",
  },
  failed: {
    label: "Failed",
    icon: XCircle,
    className: "text-destructive bg-destructive/10",
    progressColor: "bg-destructive",
  },
  canceled: {
    label: "Canceled",
    icon: AlertCircle,
    className: "text-muted-foreground bg-muted",
    progressColor: "bg-muted-foreground",
  },
}

interface TaskCardProps {
  task: TaskWithSteps
  className?: string
  compact?: boolean
}

export function TaskCard({ task, className, compact = false }: TaskCardProps) {
  const status = statusConfig[task.status]
  const StatusIcon = status.icon
  const isRunning = ['decomposing', 'executing'].includes(task.status)
  
  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffMs = now.getTime() - date.getTime()
    const diffMins = Math.floor(diffMs / 60000)
    const diffHours = Math.floor(diffMins / 60)
    const diffDays = Math.floor(diffHours / 24)
    
    if (diffMins < 1) return "Just now"
    if (diffMins < 60) return `${diffMins} min ago`
    if (diffHours < 24) return `${diffHours}h ago`
    if (diffDays < 7) return `${diffDays}d ago`
    
    return date.toLocaleDateString("en-US", { month: "short", day: "numeric" })
  }

  const formatEstimatedTime = (seconds: number | null) => {
    if (!seconds) return null
    if (seconds < 60) return "< 1 min"
    const mins = Math.ceil(seconds / 60)
    return `~${mins} min`
  }

  return (
    <Card className={cn(
      "transition-all hover:shadow-md hover:border-primary/20 cursor-pointer group",
      className
    )}>
      <Link href={`/tasks/${task.id}`}>
        <CardContent className={cn("p-4", compact && "p-3")}>
          <div className="flex items-start justify-between gap-3 mb-3">
            <div className="flex-1 min-w-0">
              <h3 className={cn(
                "font-semibold truncate group-hover:text-primary transition-colors",
                compact ? "text-sm" : "text-base"
              )}>
                {task.title}
              </h3>
              {!compact && (
                <p className="text-sm text-muted-foreground line-clamp-2 mt-1">
                  {task.description}
                </p>
              )}
            </div>
            
            <span className={cn(
              "inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium flex-shrink-0",
              status.className
            )}>
              <StatusIcon className={cn(
                "h-3 w-3",
                isRunning && "animate-spin"
              )} />
              {status.label}
            </span>
          </div>
          
          {/* Progress bar */}
          {task.progress > 0 && task.progress < 100 && (
            <div className="mb-3">
              <div className="h-1.5 bg-muted rounded-full overflow-hidden">
                <div 
                  className={cn(
                    "h-full rounded-full transition-all duration-500",
                    status.progressColor,
                    isRunning && "animate-pulse"
                  )}
                  style={{ width: `${task.progress}%` }}
                />
              </div>
            </div>
          )}
          
          {/* Meta info */}
          <div className="flex items-center gap-4 text-xs text-muted-foreground">
            <span>{formatDate(task.created_at)}</span>
            {task.estimated_time_seconds && !['completed', 'failed', 'canceled'].includes(task.status) && (
              <span className="flex items-center gap-1">
                <Clock className="h-3 w-3" />
                {formatEstimatedTime(task.estimated_time_seconds)}
              </span>
            )}
            {task.steps && task.steps.length > 0 && (
              <span>
                {task.steps.filter(s => s.status === 'completed').length}/{task.steps.length} steps
              </span>
            )}
          </div>
        </CardContent>
      </Link>
    </Card>
  )
}
