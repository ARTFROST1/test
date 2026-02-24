"use client"

import Link from "next/link"
import { useRouter } from "next/navigation"
import { Clock, CheckCircle, BarChart3, ArrowRight, Sparkles } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useSupabase } from "@/components/providers/supabase-provider"
import { TaskInput } from "@/components/tasks/task-input"
import { TaskCard } from "@/components/tasks/task-card"
import { TemplateCard } from "@/components/templates/template-card"
import { TaskListSkeleton, DashboardStatsSkeleton } from "@/components/shared/loading-skeleton"
import { EmptyState } from "@/components/shared/empty-state"
import { useRecentTasks } from "@/hooks/use-tasks"
import { usePopularTemplates } from "@/hooks/use-templates"
import { useTaskStore } from "@/stores/task-store"

export default function DashboardPage() {
  const router = useRouter()
  const { user } = useSupabase()
  const { setSelectedTemplateId } = useTaskStore()
  
  // Fetch real data
  const { data: recentTasksData, isLoading: tasksLoading } = useRecentTasks(5)
  const { data: templatesData, isLoading: templatesLoading } = usePopularTemplates(3)
  
  const recentTasks = recentTasksData?.data || []
  const popularTemplates = templatesData?.data || []
  
  const getGreeting = () => {
    const hour = new Date().getHours()
    if (hour < 12) return "Good morning"
    if (hour < 18) return "Good afternoon"
    return "Good evening"
  }

  const firstName = user?.user_metadata?.full_name?.split(" ")[0] || "there"

  const handleTaskCreated = (taskId: string) => {
    router.push(`/tasks/${taskId}`)
  }

  const handleUseTemplate = (templateId: string) => {
    setSelectedTemplateId(templateId)
    router.push(`/templates/${templateId}`)
  }

  // Calculate stats from recent tasks
  const completedCount = recentTasks.filter(t => t.status === 'completed').length
  const inProgressCount = recentTasks.filter(t => ['executing', 'decomposing'].includes(t.status)).length

  const stats = [
    {
      title: "Tasks This Month",
      value: String(recentTasks.length),
      total: "50",
      icon: BarChart3,
      description: `${Math.round((recentTasks.length / 50) * 100)}% of quota used`,
    },
    {
      title: "In Progress",
      value: String(inProgressCount),
      icon: Clock,
      description: "Active tasks",
    },
    {
      title: "Completed",
      value: String(completedCount),
      icon: CheckCircle,
      description: "Tasks completed",
    },
  ]

  return (
    <div className="space-y-8">
      {/* Welcome header */}
      <div>
        <h1 className="text-3xl font-bold">
          {getGreeting()}, {firstName} 👋
        </h1>
        <p className="text-muted-foreground mt-1">
          What would you like to delegate today?
        </p>
      </div>

      {/* Task Input Card */}
      <Card className="border-2 border-primary/20 bg-gradient-to-br from-primary/5 to-transparent">
        <CardHeader className="pb-3">
          <div className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-primary" />
            <CardTitle className="text-lg">Create a new task</CardTitle>
          </div>
          <CardDescription>
            Describe what you need in natural language, and AI will handle the rest
          </CardDescription>
        </CardHeader>
        <CardContent>
          <TaskInput onTaskCreated={handleTaskCreated} />
        </CardContent>
      </Card>

      {/* Stats */}
      {tasksLoading ? (
        <DashboardStatsSkeleton />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {stats.map((stat) => (
            <Card key={stat.title}>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  {stat.title}
                </CardTitle>
                <stat.icon className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {stat.value}
                  {stat.total && (
                    <span className="text-lg font-normal text-muted-foreground">
                      /{stat.total}
                    </span>
                  )}
                </div>
                <p className="text-xs text-muted-foreground">{stat.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Active/Recent Tasks */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Recent Tasks</CardTitle>
              <CardDescription>Your latest task activity</CardDescription>
            </div>
            <Button variant="ghost" size="sm" asChild>
              <Link href="/tasks">
                View All
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </CardHeader>
          <CardContent>
            {tasksLoading ? (
              <TaskListSkeleton count={3} />
            ) : recentTasks.length === 0 ? (
              <EmptyState
                title="No tasks yet"
                description="Create your first task above to get started."
                className="py-8"
              />
            ) : (
              <div className="space-y-3">
                {recentTasks.slice(0, 5).map((task) => (
                  <TaskCard key={task.id} task={task} compact />
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Popular Templates */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Popular Templates</CardTitle>
              <CardDescription>Quick start with proven workflows</CardDescription>
            </div>
            <Button variant="ghost" size="sm" asChild>
              <Link href="/templates">
                Browse All
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </CardHeader>
          <CardContent>
            {templatesLoading ? (
              <div className="space-y-3">
                {Array.from({ length: 3 }).map((_, i) => (
                  <div key={i} className="h-24 bg-muted animate-pulse rounded-lg" />
                ))}
              </div>
            ) : popularTemplates.length === 0 ? (
              <EmptyState
                title="No templates available"
                description="Templates will appear here when available."
                className="py-8"
              />
            ) : (
              <div className="space-y-3">
                {popularTemplates.map((template) => (
                  <TemplateCard
                    key={template.id}
                    template={template}
                    onUse={() => handleUseTemplate(template.id)}
                  />
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
