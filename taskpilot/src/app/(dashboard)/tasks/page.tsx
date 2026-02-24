"use client"

import { useRouter } from "next/navigation"
import { Plus } from "lucide-react"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { TaskList } from "@/components/tasks/task-list"
import { TaskInput } from "@/components/tasks/task-input"

export default function TasksPage() {
  const router = useRouter()

  const handleTaskCreated = (taskId: string) => {
    router.push(`/tasks/${taskId}`)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">Task History</h1>
          <p className="text-muted-foreground mt-1">
            View and manage all your delegated tasks
          </p>
        </div>
      </div>

      {/* Quick Task Creation */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg flex items-center gap-2">
            <Plus className="h-5 w-5" />
            New Task
          </CardTitle>
          <CardDescription>
            Quickly create a new task with natural language
          </CardDescription>
        </CardHeader>
        <CardContent>
          <TaskInput 
            onTaskCreated={handleTaskCreated}
            placeholder="What would you like to delegate?"
          />
        </CardContent>
      </Card>

      {/* Task List with Filters */}
      <TaskList 
        showFilters={true}
        limit={20}
      />
    </div>
  )
}
