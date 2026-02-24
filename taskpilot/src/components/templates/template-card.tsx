"use client"

import Link from "next/link"
import { 
  Search, 
  FileText, 
  Mail, 
  BarChart3, 
  MessageSquare,
  Globe,
  Lightbulb,
  Star,
  Clock,
  ArrowRight,
  type LucideIcon
} from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { categoryInfo } from "@/hooks/use-templates"
import type { Template } from "@/types/database"

// Category to icon mapping
const categoryIcons: Record<string, LucideIcon> = {
  research: Search,
  content: FileText,
  email: Mail,
  data_analysis: BarChart3,
  social_media: MessageSquare,
  seo: Globe,
  other: Lightbulb,
}

interface TemplateCardProps {
  template: Template
  className?: string
  onUse?: () => void
}

export function TemplateCard({ template, className, onUse }: TemplateCardProps) {
  const Icon = categoryIcons[template.category] || Lightbulb
  const category = categoryInfo[template.category]

  const formatEstimatedTime = () => {
    // Templates don't have estimated_time, but we can show a generic estimate
    return "3-5 min"
  }

  return (
    <Card className={cn(
      "transition-all hover:shadow-md hover:border-primary/20 group h-full flex flex-col",
      className
    )}>
      <CardHeader className="pb-3">
        <div className="flex items-start gap-4">
          <div className={cn(
            "rounded-lg p-2.5 transition-colors",
            "bg-primary/10 text-primary group-hover:bg-primary group-hover:text-primary-foreground"
          )}>
            <Icon className="h-5 w-5" />
          </div>
          <div className="flex-1 min-w-0">
            <CardTitle className="text-base mb-1 line-clamp-1">
              {template.name}
            </CardTitle>
            <CardDescription className="line-clamp-2">
              {template.description}
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="pt-0 mt-auto">
        {/* Meta info */}
        <div className="flex flex-wrap items-center gap-3 mb-4 text-xs text-muted-foreground">
          <span className={cn(
            "px-2 py-0.5 rounded-full font-medium",
            category.color
          )}>
            {category.label}
          </span>
          
          {template.avg_rating && (
            <span className="flex items-center gap-1">
              <Star className="h-3 w-3 fill-yellow-500 text-yellow-500" />
              {template.avg_rating.toFixed(1)}
            </span>
          )}
          
          <span className="flex items-center gap-1">
            <Clock className="h-3 w-3" />
            {formatEstimatedTime()}
          </span>
          
          {template.usage_count > 0 && (
            <span>{template.usage_count.toLocaleString()} uses</span>
          )}
        </div>
        
        {/* Action */}
        {onUse ? (
          <Button 
            className="w-full"
            onClick={(e) => {
              e.preventDefault()
              onUse()
            }}
          >
            Use Template
            <ArrowRight className="h-4 w-4 ml-2" />
          </Button>
        ) : (
          <Button className="w-full" asChild>
            <Link href={`/templates/${template.id}`}>
              Use Template
              <ArrowRight className="h-4 w-4 ml-2" />
            </Link>
          </Button>
        )}
      </CardContent>
    </Card>
  )
}
