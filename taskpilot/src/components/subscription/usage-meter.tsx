"use client"

import { cn } from "@/lib/utils"
import { formatBytes } from "@/hooks/use-subscription"

interface UsageMeterProps {
  label: string
  used: number
  limit: number
  /** Format values as bytes (e.g., for storage) */
  formatAsBytes?: boolean
  /** Show percentage text */
  showPercentage?: boolean
  /** Size variant */
  size?: "sm" | "md" | "lg"
  className?: string
}

export function UsageMeter({
  label,
  used,
  limit,
  formatAsBytes = false,
  showPercentage = true,
  size = "md",
  className,
}: UsageMeterProps) {
  const percentage = limit > 0 ? Math.min((used / limit) * 100, 100) : 0
  const remaining = Math.max(limit - used, 0)
  
  // Determine color based on usage
  const getColorClass = () => {
    if (percentage >= 90) return "bg-destructive"
    if (percentage >= 75) return "bg-yellow-500"
    return "bg-primary"
  }
  
  const formatValue = (value: number) => {
    if (formatAsBytes) {
      return formatBytes(value)
    }
    return value.toString()
  }
  
  const sizeClasses = {
    sm: { bar: "h-1.5", text: "text-xs" },
    md: { bar: "h-2", text: "text-sm" },
    lg: { bar: "h-3", text: "text-base" },
  }
  
  return (
    <div className={cn("space-y-2", className)}>
      {/* Label and values */}
      <div className="flex items-center justify-between">
        <span className={cn("font-medium", sizeClasses[size].text)}>
          {label}
        </span>
        <span className={cn("text-muted-foreground", sizeClasses[size].text)}>
          {formatValue(used)} / {formatValue(limit)}
          {showPercentage && (
            <span className="ml-1">({Math.round(percentage)}%)</span>
          )}
        </span>
      </div>
      
      {/* Progress bar */}
      <div className={cn("w-full bg-muted rounded-full overflow-hidden", sizeClasses[size].bar)}>
        <div
          className={cn("h-full rounded-full transition-all duration-300", getColorClass())}
          style={{ width: `${percentage}%` }}
        />
      </div>
      
      {/* Remaining text */}
      <div className="flex justify-end">
        <span className="text-xs text-muted-foreground">
          {formatValue(remaining)} remaining
        </span>
      </div>
    </div>
  )
}

interface UsageMeterCompactProps {
  used: number
  limit: number
  formatAsBytes?: boolean
  className?: string
}

/**
 * Compact version for sidebar/header
 */
export function UsageMeterCompact({
  used,
  limit,
  formatAsBytes = false,
  className,
}: UsageMeterCompactProps) {
  const percentage = limit > 0 ? Math.min((used / limit) * 100, 100) : 0
  
  const getColorClass = () => {
    if (percentage >= 90) return "bg-destructive"
    if (percentage >= 75) return "bg-yellow-500"
    return "bg-primary"
  }
  
  const formatValue = (value: number) => {
    if (formatAsBytes) {
      return formatBytes(value)
    }
    return value.toString()
  }
  
  return (
    <div className={cn("flex items-center gap-2", className)}>
      <div className="flex-1 h-1.5 bg-muted rounded-full overflow-hidden">
        <div
          className={cn("h-full rounded-full transition-all", getColorClass())}
          style={{ width: `${percentage}%` }}
        />
      </div>
      <span className="text-xs text-muted-foreground whitespace-nowrap">
        {formatValue(used)}/{formatValue(limit)}
      </span>
    </div>
  )
}
