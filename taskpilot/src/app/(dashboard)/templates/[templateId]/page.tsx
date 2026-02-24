"use client"

import { use } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { ArrowLeft, Clock, Star, Users } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { TemplateForm } from "@/components/templates/template-form"
import { EmptyState } from "@/components/shared/empty-state"
import { Skeleton } from "@/components/shared/loading-skeleton"
import { useTemplateDetail, categoryInfo } from "@/hooks/use-templates"
import { cn } from "@/lib/utils"

interface TemplateDetailPageProps {
  params: Promise<{ templateId: string }>
}

export default function TemplateDetailPage({ params }: TemplateDetailPageProps) {
  const { templateId } = use(params)
  const router = useRouter()
  const { data: template, isLoading, isError, error } = useTemplateDetail(templateId)

  const handleTaskCreated = (taskId: string) => {
    router.push(`/tasks/${taskId}`)
  }

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Button variant="ghost" asChild className="mb-4">
          <Link href="/templates">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Templates
          </Link>
        </Button>
        
        <div className="space-y-4">
          <Skeleton className="h-8 w-2/3" />
          <Skeleton className="h-4 w-full max-w-md" />
        </div>
        
        <Card>
          <CardHeader>
            <Skeleton className="h-6 w-32" />
            <Skeleton className="h-4 w-48" />
          </CardHeader>
          <CardContent className="space-y-4">
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-32" />
          </CardContent>
        </Card>
      </div>
    )
  }

  if (isError || !template) {
    return (
      <div className="space-y-6">
        <Button variant="ghost" asChild className="mb-4">
          <Link href="/templates">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Templates
          </Link>
        </Button>
        <EmptyState
          title="Template not found"
          description={error?.message || "The template you're looking for doesn't exist."}
          action={{ label: "Go to Templates", onClick: () => router.push("/templates") }}
        />
      </div>
    )
  }

  const category = categoryInfo[template.category]

  return (
    <div className="space-y-6">
      {/* Back button */}
      <Button variant="ghost" asChild className="mb-2">
        <Link href="/templates">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Templates
        </Link>
      </Button>

      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6">
        <div className="flex-1">
          <h1 className="text-2xl sm:text-3xl font-bold">{template.name}</h1>
          {template.description && (
            <p className="text-muted-foreground mt-2 max-w-2xl">
              {template.description}
            </p>
          )}
          
          {/* Meta info */}
          <div className="flex flex-wrap items-center gap-4 mt-4 text-sm">
            <span className={cn(
              "px-3 py-1 rounded-full font-medium",
              category.color
            )}>
              {category.label}
            </span>
            
            {template.avg_rating && (
              <span className="flex items-center gap-1 text-muted-foreground">
                <Star className="h-4 w-4 fill-yellow-500 text-yellow-500" />
                {template.avg_rating.toFixed(1)}
              </span>
            )}
            
            <span className="flex items-center gap-1 text-muted-foreground">
              <Clock className="h-4 w-4" />
              ~3-5 min
            </span>
            
            {template.usage_count > 0 && (
              <span className="flex items-center gap-1 text-muted-foreground">
                <Users className="h-4 w-4" />
                {template.usage_count.toLocaleString()} uses
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Form */}
      <Card>
        <CardHeader>
          <CardTitle>Configure Task</CardTitle>
          <CardDescription>
            Fill in the required parameters to create your task
          </CardDescription>
        </CardHeader>
        <CardContent>
          <TemplateForm 
            template={template}
            onTaskCreated={handleTaskCreated}
            onCancel={() => router.push("/templates")}
          />
        </CardContent>
      </Card>

      {/* Example output */}
      {template.example_output && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Example Output</CardTitle>
            <CardDescription>
              Here's an example of what this template can produce
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="bg-muted rounded-lg p-4">
              <pre className="text-sm whitespace-pre-wrap overflow-x-auto">
                {template.example_output}
              </pre>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
