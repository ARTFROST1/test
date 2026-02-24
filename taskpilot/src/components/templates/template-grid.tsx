"use client"

import { cn } from "@/lib/utils"
import { TemplateCard } from "./template-card"
import { TemplateGridSkeleton } from "@/components/shared/loading-skeleton"
import { EmptyState } from "@/components/shared/empty-state"
import { useTemplates } from "@/hooks/use-templates"
import { Lightbulb, X } from "lucide-react"
import type { TemplateCategoryEnum } from "@/types/database"

interface TemplateGridProps {
  className?: string
  category?: TemplateCategoryEnum | null
  search?: string
  limit?: number
  onUseTemplate?: (templateId: string) => void
}

export function TemplateGrid({ 
  className,
  category,
  search,
  limit = 20,
  onUseTemplate,
}: TemplateGridProps) {
  const { data, isLoading, isError, error, refetch } = useTemplates({
    limit,
    category: category || undefined,
    search: search || undefined,
    sortBy: 'usage_count',
    sortOrder: 'desc',
  })

  const templates = data?.data || []

  if (isLoading) {
    return <TemplateGridSkeleton count={6} />
  }

  if (isError) {
    return (
      <EmptyState
        icon={X}
        title="Failed to load templates"
        description={error?.message || "Something went wrong. Please try again."}
        action={{ label: "Retry", onClick: () => refetch() }}
        className={className}
      />
    )
  }

  if (templates.length === 0) {
    return (
      <EmptyState
        icon={Lightbulb}
        title={category || search ? "No matching templates" : "No templates available"}
        description={
          category || search
            ? "Try different filters or search terms."
            : "Templates will appear here when available."
        }
        className={className}
      />
    )
  }

  return (
    <div className={cn(
      "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4",
      className
    )}>
      {templates.map((template) => (
        <TemplateCard
          key={template.id}
          template={template}
          onUse={onUseTemplate ? () => onUseTemplate(template.id) : undefined}
        />
      ))}
    </div>
  )
}
