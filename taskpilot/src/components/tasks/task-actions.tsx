"use client"

import { 
  Play, 
  Pause, 
  XCircle, 
  RefreshCcw,
  Download,
  Share2,
  MoreHorizontal,
  Loader2 
} from "lucide-react"
import { useState } from "react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { useUpdateTask, useCancelTask, useExecuteTask } from "@/hooks/use-tasks"
import type { TaskWithSteps } from "@/types/api"

interface TaskActionsProps {
  task: TaskWithSteps
  className?: string
  onExport?: () => void
  onShare?: () => void
}

export function TaskActions({ 
  task, 
  className,
  onExport,
  onShare,
}: TaskActionsProps) {
  const [showMore, setShowMore] = useState(false)
  
  const updateTask = useUpdateTask()
  const cancelTask = useCancelTask()
  const executeTask = useExecuteTask()

  const isRunning = ['decomposing', 'executing'].includes(task.status)
  const isPaused = task.status === 'paused'
  const isCompleted = task.status === 'completed'
  const isFailed = task.status === 'failed'
  const isCanceled = task.status === 'canceled'
  const isPending = task.status === 'pending'

  const handlePause = async () => {
    try {
      await updateTask.mutateAsync({ 
        taskId: task.id, 
        data: { status: 'paused' } 
      })
    } catch (error) {
      console.error('Failed to pause task:', error)
    }
  }

  const handleResume = async () => {
    try {
      await executeTask.mutateAsync(task.id)
    } catch (error) {
      console.error('Failed to resume task:', error)
    }
  }

  const handleCancel = async () => {
    if (!confirm('Are you sure you want to cancel this task?')) return
    
    try {
      await cancelTask.mutateAsync(task.id)
    } catch (error) {
      console.error('Failed to cancel task:', error)
    }
  }

  const handleRetry = async () => {
    try {
      await executeTask.mutateAsync(task.id)
    } catch (error) {
      console.error('Failed to retry task:', error)
    }
  }

  const handleStart = async () => {
    try {
      await executeTask.mutateAsync(task.id)
    } catch (error) {
      console.error('Failed to start task:', error)
    }
  }

  const isLoading = updateTask.isPending || cancelTask.isPending || executeTask.isPending

  return (
    <div className={cn("flex items-center gap-2", className)}>
      {/* Primary actions based on status */}
      {isPending && (
        <Button
          onClick={handleStart}
          disabled={isLoading}
        >
          {executeTask.isPending ? (
            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
          ) : (
            <Play className="h-4 w-4 mr-2" />
          )}
          Start Task
        </Button>
      )}

      {isRunning && (
        <>
          <Button
            variant="outline"
            onClick={handlePause}
            disabled={isLoading}
          >
            {updateTask.isPending ? (
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
            ) : (
              <Pause className="h-4 w-4 mr-2" />
            )}
            Pause
          </Button>
          <Button
            variant="destructive"
            onClick={handleCancel}
            disabled={isLoading}
          >
            {cancelTask.isPending ? (
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
            ) : (
              <XCircle className="h-4 w-4 mr-2" />
            )}
            Cancel
          </Button>
        </>
      )}

      {isPaused && (
        <>
          <Button
            onClick={handleResume}
            disabled={isLoading}
          >
            {executeTask.isPending ? (
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
            ) : (
              <Play className="h-4 w-4 mr-2" />
            )}
            Resume
          </Button>
          <Button
            variant="destructive"
            onClick={handleCancel}
            disabled={isLoading}
          >
            <XCircle className="h-4 w-4 mr-2" />
            Cancel
          </Button>
        </>
      )}

      {isFailed && (
        <Button
          onClick={handleRetry}
          disabled={isLoading}
        >
          {executeTask.isPending ? (
            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
          ) : (
            <RefreshCcw className="h-4 w-4 mr-2" />
          )}
          Retry
        </Button>
      )}

      {/* Secondary actions */}
      {(isCompleted || isFailed || isCanceled) && (
        <>
          {onExport && (
            <Button
              variant="outline"
              onClick={onExport}
            >
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
          )}
          
          {onShare && (
            <Button
              variant="outline"
              onClick={onShare}
            >
              <Share2 className="h-4 w-4 mr-2" />
              Share
            </Button>
          )}
        </>
      )}

      {/* More options dropdown */}
      <div className="relative">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setShowMore(!showMore)}
        >
          <MoreHorizontal className="h-4 w-4" />
        </Button>
        
        {showMore && (
          <>
            <div 
              className="fixed inset-0 z-40" 
              onClick={() => setShowMore(false)} 
            />
            <div className="absolute right-0 top-full mt-1 z-50 w-48 rounded-lg border border-border bg-popover shadow-lg py-1">
              {!isRunning && !isPending && (
                <button
                  className="w-full text-left px-4 py-2 text-sm hover:bg-accent transition-colors flex items-center gap-2"
                  onClick={() => {
                    handleRetry()
                    setShowMore(false)
                  }}
                >
                  <RefreshCcw className="h-4 w-4" />
                  Run again
                </button>
              )}
              {onExport && (
                <button
                  className="w-full text-left px-4 py-2 text-sm hover:bg-accent transition-colors flex items-center gap-2"
                  onClick={() => {
                    onExport()
                    setShowMore(false)
                  }}
                >
                  <Download className="h-4 w-4" />
                  Export to Markdown
                </button>
              )}
              {onShare && (
                <button
                  className="w-full text-left px-4 py-2 text-sm hover:bg-accent transition-colors flex items-center gap-2"
                  onClick={() => {
                    onShare()
                    setShowMore(false)
                  }}
                >
                  <Share2 className="h-4 w-4" />
                  Share result
                </button>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  )
}
