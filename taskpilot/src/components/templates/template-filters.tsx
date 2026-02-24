"use client"

import { useState } from "react"
import { 
  Search, 
  FileText, 
  Mail, 
  BarChart3, 
  MessageSquare,
  Globe,
  Lightbulb,
  Layers,
  type LucideIcon
} from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import type { TemplateCategoryEnum } from "@/types/database"

interface CategoryOption {
  value: TemplateCategoryEnum | 'all'
  label: string
  icon: LucideIcon
  count?: number
}

const CATEGORIES: CategoryOption[] = [
  { value: 'all', label: 'All Templates', icon: Layers },
  { value: 'research', label: 'Research', icon: Search },
  { value: 'content', label: 'Content', icon: FileText },
  { value: 'email', label: 'Email', icon: Mail },
  { value: 'data_analysis', label: 'Analysis', icon: BarChart3 },
  { value: 'social_media', label: 'Social Media', icon: MessageSquare },
  { value: 'seo', label: 'SEO', icon: Globe },
  { value: 'other', label: 'Other', icon: Lightbulb },
]

interface TemplateFiltersProps {
  className?: string
  selectedCategory: TemplateCategoryEnum | null
  onCategoryChange: (category: TemplateCategoryEnum | null) => void
  search: string
  onSearchChange: (search: string) => void
  categoryCounts?: Record<TemplateCategoryEnum | 'all', number>
  showSearch?: boolean
  layout?: 'horizontal' | 'vertical'
}

export function TemplateFilters({
  className,
  selectedCategory,
  onCategoryChange,
  search,
  onSearchChange,
  categoryCounts,
  showSearch = true,
  layout = 'horizontal',
}: TemplateFiltersProps) {
  const [localSearch, setLocalSearch] = useState(search)

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSearchChange(localSearch)
  }

  const handleCategoryClick = (value: TemplateCategoryEnum | 'all') => {
    onCategoryChange(value === 'all' ? null : value)
  }

  if (layout === 'vertical') {
    return (
      <div className={cn("space-y-4", className)}>
        {showSearch && (
          <form onSubmit={handleSearchSubmit}>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search templates..."
                value={localSearch}
                onChange={(e) => {
                  setLocalSearch(e.target.value)
                  // Debounce search - immediate for now
                  if (e.target.value === '') {
                    onSearchChange('')
                  }
                }}
                onBlur={() => onSearchChange(localSearch)}
                className="pl-9"
              />
            </div>
          </form>
        )}
        
        <div className="space-y-1">
          <p className="text-sm font-medium text-muted-foreground mb-2">Categories</p>
          {CATEGORIES.map((category) => {
            const Icon = category.icon
            const isSelected = category.value === 'all' 
              ? selectedCategory === null 
              : selectedCategory === category.value
            const count = categoryCounts?.[category.value]
            
            return (
              <button
                key={category.value}
                onClick={() => handleCategoryClick(category.value)}
                className={cn(
                  "w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm transition-colors",
                  isSelected 
                    ? "bg-primary text-primary-foreground" 
                    : "hover:bg-accent"
                )}
              >
                <span className="flex items-center gap-2">
                  <Icon className="h-4 w-4" />
                  {category.label}
                </span>
                {count !== undefined && (
                  <span className={cn(
                    "text-xs",
                    isSelected ? "text-primary-foreground/70" : "text-muted-foreground"
                  )}>
                    {count}
                  </span>
                )}
              </button>
            )
          })}
        </div>
      </div>
    )
  }

  return (
    <div className={cn("space-y-4", className)}>
      {showSearch && (
        <form onSubmit={handleSearchSubmit}>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search templates..."
              value={localSearch}
              onChange={(e) => {
                setLocalSearch(e.target.value)
                if (e.target.value === '') {
                  onSearchChange('')
                }
              }}
              onBlur={() => onSearchChange(localSearch)}
              className="pl-9"
            />
          </div>
        </form>
      )}
      
      <div className="flex flex-wrap gap-2">
        {CATEGORIES.map((category) => {
          const Icon = category.icon
          const isSelected = category.value === 'all' 
            ? selectedCategory === null 
            : selectedCategory === category.value
          
          return (
            <Button
              key={category.value}
              variant={isSelected ? "default" : "outline"}
              size="sm"
              onClick={() => handleCategoryClick(category.value)}
              className="gap-1.5"
            >
              <Icon className="h-4 w-4" />
              {category.label}
              {categoryCounts?.[category.value] !== undefined && (
                <span className={cn(
                  "ml-1 text-xs",
                  isSelected ? "text-primary-foreground/70" : "text-muted-foreground"
                )}>
                  ({categoryCounts[category.value]})
                </span>
              )}
            </Button>
          )
        })}
      </div>
    </div>
  )
}
