"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Sparkles } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { TemplateGrid } from "@/components/templates/template-grid"
import { TemplateFilters } from "@/components/templates/template-filters"
import { useTaskStore } from "@/stores/task-store"
import type { TemplateCategoryEnum } from "@/types/database"

export default function TemplatesPage() {
  const router = useRouter()
  const { setSelectedTemplateId } = useTaskStore()
  
  const [selectedCategory, setSelectedCategory] = useState<TemplateCategoryEnum | null>(null)
  const [search, setSearch] = useState("")

  const handleUseTemplate = (templateId: string) => {
    setSelectedTemplateId(templateId)
    router.push(`/templates/${templateId}`)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold">Templates</h1>
        <p className="text-muted-foreground mt-1">
          Start with proven templates to get results faster
        </p>
      </div>

      {/* Filters */}
      <TemplateFilters
        selectedCategory={selectedCategory}
        onCategoryChange={setSelectedCategory}
        search={search}
        onSearchChange={setSearch}
        showSearch={true}
        layout="horizontal"
      />

      {/* Template Grid */}
      <TemplateGrid
        category={selectedCategory}
        search={search}
        limit={20}
        onUseTemplate={handleUseTemplate}
      />

      {/* Custom Template CTA */}
      <Card className="border-2 border-dashed">
        <CardContent className="p-8 text-center">
          <div className="flex justify-center mb-4">
            <div className="rounded-full bg-primary/10 p-3">
              <Sparkles className="h-6 w-6 text-primary" />
            </div>
          </div>
          <h3 className="text-lg font-semibold">Need something custom?</h3>
          <p className="text-muted-foreground mt-2 max-w-md mx-auto">
            Can&apos;t find what you&apos;re looking for? Create a task from scratch with natural language.
          </p>
          <div className="flex justify-center gap-4 mt-6">
            <Button asChild>
              <Link href="/dashboard">Create Custom Task</Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
