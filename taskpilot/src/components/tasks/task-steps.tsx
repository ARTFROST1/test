"use client"

import { 
  Circle, 
  CheckCircle2, 
  XCircle, 
  Loader2, 
  MinusCircle,
  ChevronDown 
} from "lucide-react"
import { useState } from "react"

import { cn } from "@/lib/utils"
import type { TaskStep } from "@/types/database"

const stepStatusConfig = {
  pending: {
    icon: Circle,
    className: "text-muted-foreground",
    label: "Pending",
  },
  in_progress: {
    icon: Loader2,
    className: "text-primary animate-spin",
    label: "In Progress",
  },
  completed: {
    icon: CheckCircle2,
    className: "text-green-600",
    label: "Completed",
  },
  failed: {
    icon: XCircle,
    className: "text-destructive",
    label: "Failed",
  },
  skipped: {
    icon: MinusCircle,
    className: "text-muted-foreground",
    label: "Skipped",
  },
}

interface TaskStepItemProps {
  step: TaskStep
  isLast: boolean
  showOutput?: boolean
}

function TaskStepItem({ step, isLast, showOutput = false }: TaskStepItemProps) {
  const [expanded, setExpanded] = useState(false)
  const config = stepStatusConfig[step.status]
  const Icon = config.icon
  const hasOutput = step.output && step.output.trim().length > 0
  const hasError = step.error_message && step.error_message.trim().length > 0

  return (
    <div className="relative">
      {/* Connector line */}
      {!isLast && (
        <div className={cn(
          "absolute left-3 top-8 w-0.5 h-[calc(100%-8px)]",
          step.status === 'completed' ? "bg-green-600/30" : "bg-border"
        )} />
      )}
      
      <div className="flex gap-3">
        {/* Status icon */}
        <div className={cn(
          "flex-shrink-0 h-6 w-6 rounded-full flex items-center justify-center",
          step.status === 'completed' && "bg-green-100 dark:bg-green-900/30",
          step.status === 'in_progress' && "bg-primary/10",
          step.status === 'failed' && "bg-destructive/10"
        )}>
          <Icon className={cn("h-4 w-4", config.className)} />
        </div>
        
        <div className="flex-1 min-w-0 pb-4">
          {/* Header */}
          <div 
            className={cn(
              "flex items-start justify-between gap-2",
              (hasOutput || hasError) && showOutput && "cursor-pointer"
            )}
            onClick={() => (hasOutput || hasError) && showOutput && setExpanded(!expanded)}
          >
            <div className="flex-1 min-w-0">
              <h4 className={cn(
                "font-medium text-sm",
                step.status === 'completed' && "text-green-600",
                step.status === 'in_progress' && "text-primary",
                step.status === 'failed' && "text-destructive"
              )}>
                {step.title}
              </h4>
              {step.description && (
                <p className="text-sm text-muted-foreground mt-0.5 line-clamp-2">
                  {step.description}
                </p>
              )}
            </div>
            
            {(hasOutput || hasError) && showOutput && (
              <ChevronDown className={cn(
                "h-4 w-4 text-muted-foreground transition-transform flex-shrink-0 mt-0.5",
                expanded && "rotate-180"
              )} />
            )}
          </div>
          
          {/* Expandable output */}
          {showOutput && expanded && (
            <div className="mt-3 space-y-2">
              {hasOutput && (
                <div className="bg-muted rounded-lg p-3">
                  <p className="text-xs font-medium text-muted-foreground mb-1">Output:</p>
                  <pre className="text-sm whitespace-pre-wrap overflow-x-auto">
                    {step.output}
                  </pre>
                </div>
              )}
              {hasError && (
                <div className="bg-destructive/10 rounded-lg p-3">
                  <p className="text-xs font-medium text-destructive mb-1">Error:</p>
                  <pre className="text-sm text-destructive whitespace-pre-wrap overflow-x-auto">
                    {step.error_message}
                  </pre>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

interface TaskStepsProps {
  steps: TaskStep[]
  className?: string
  showOutput?: boolean
}

export function TaskSteps({ steps, className, showOutput = true }: TaskStepsProps) {
  // Sort steps by order_index
  const sortedSteps = [...steps].sort((a, b) => a.order_index - b.order_index)
  
  const completedCount = steps.filter(s => s.status === 'completed').length
  const inProgressStep = steps.find(s => s.status === 'in_progress')

  return (
    <div className={cn("rounded-lg border border-border bg-card", className)}>
      <div className="p-4 border-b border-border">
        <div className="flex items-center justify-between">
          <h3 className="font-semibold">Task Steps</h3>
          <span className="text-sm text-muted-foreground">
            {completedCount}/{steps.length} completed
          </span>
        </div>
        {inProgressStep && (
          <p className="text-sm text-primary mt-1">
            Currently: {inProgressStep.title}
          </p>
        )}
      </div>
      
      <div className="p-4">
        {sortedSteps.map((step, index) => (
          <TaskStepItem
            key={step.id}
            step={step}
            isLast={index === sortedSteps.length - 1}
            showOutput={showOutput}
          />
        ))}
      </div>
    </div>
  )
}
