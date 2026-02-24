"use client"

import { use } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { ArrowLeft, Clock, Calendar, FileText } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { TaskProgress } from "@/components/tasks/task-progress"
import { TaskSteps } from "@/components/tasks/task-steps"
import { TaskResultView } from "@/components/tasks/task-result"
import { TaskActions } from "@/components/tasks/task-actions"
import { TaskDetailSkeleton } from "@/components/shared/loading-skeleton"
import { EmptyState } from "@/components/shared/empty-state"
import { useTask } from "@/hooks/use-tasks"

interface TaskDetailPageProps {
  params: Promise<{ taskId: string }>
}

export default function TaskDetailPage({ params }: TaskDetailPageProps) {
  const { taskId } = use(params)
  const router = useRouter()
  const { data: task, isLoading, isError, error } = useTask(taskId)

  const handleExport = () => {
    if (!task?.result) return
    
    const content = task.result.content
    const blob = new Blob([content], { type: "text/markdown" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `${task.title.replace(/[^a-z0-9]/gi, '_').toLowerCase()}.md`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  const handleShare = () => {
    // Copy link to clipboard
    navigator.clipboard.writeText(window.location.href)
    // Could show a toast notification here
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "numeric",
      minute: "2-digit",
    })
  }

  const formatDuration = (seconds: number | null) => {
    if (!seconds) return null
    if (seconds < 60) return `${seconds} seconds`
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    if (mins < 60) return secs > 0 ? `${mins}m ${secs}s` : `${mins} minutes`
    const hours = Math.floor(mins / 60)
    const remainingMins = mins % 60
    return `${hours}h ${remainingMins}m`
  }

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Button variant="ghost" asChild className="mb-4">
          <Link href="/tasks">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Tasks
          </Link>
        </Button>
        <TaskDetailSkeleton />
      </div>
    )
  }

  if (isError || !task) {
    return (
      <div className="space-y-6">
        <Button variant="ghost" asChild className="mb-4">
          <Link href="/tasks">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Tasks
          </Link>
        </Button>
        <EmptyState
          icon={FileText}
          title="Task not found"
          description={error?.message || "The task you're looking for doesn't exist or you don't have access to it."}
          action={{ label: "Go to Tasks", onClick: () => router.push("/tasks") }}
        />
      </div>
    )
  }

  const isRunning = ['decomposing', 'executing'].includes(task.status)
  const isCompleted = task.status === 'completed'

  return (
    <div className="space-y-6">
      {/* Back button */}
      <Button variant="ghost" asChild className="mb-2">
        <Link href="/tasks">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Tasks
        </Link>
      </Button>

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
        <div className="flex-1 min-w-0">
          <h1 className="text-2xl sm:text-3xl font-bold">{task.title}</h1>
          <p className="text-muted-foreground mt-1">{task.description}</p>
          
          {/* Meta info */}
          <div className="flex flex-wrap items-center gap-4 mt-3 text-sm text-muted-foreground">
            <span className="flex items-center gap-1">
              <Calendar className="h-4 w-4" />
              Created {formatDate(task.created_at)}
            </span>
            {task.completed_at && (
              <span className="flex items-center gap-1">
                <Clock className="h-4 w-4" />
                Completed {formatDate(task.completed_at)}
              </span>
            )}
            {task.actual_time_seconds && (
              <span>Duration: {formatDuration(task.actual_time_seconds)}</span>
            )}
            {task.template && (
              <span className="text-primary">
                Template: {task.template.name}
              </span>
            )}
          </div>
        </div>
        
        {/* Actions */}
        <TaskActions 
          task={task}
          onExport={task.result ? handleExport : undefined}
          onShare={handleShare}
        />
      </div>

      {/* Progress */}
      <TaskProgress task={task} />

      {/* Steps */}
      {task.steps && task.steps.length > 0 && (
        <TaskSteps steps={task.steps} showOutput={!isRunning} />
      )}

      {/* Result */}
      {task.result && isCompleted && (
        <TaskResultView result={task.result} />
      )}

      {/* Error message for failed tasks */}
      {task.status === 'failed' && !task.result && (
        <Card className="border-destructive/50 bg-destructive/5">
          <CardHeader>
            <CardTitle className="text-destructive">Task Failed</CardTitle>
            <CardDescription>
              An error occurred while processing this task.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              You can try running the task again using the &quot;Retry&quot; button above.
              If the problem persists, please contact support.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
