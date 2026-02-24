"use client"

import { useState, useMemo } from "react"
import { Send, Loader2, Info } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useUseTemplate } from "@/hooks/use-templates"
import type { Template, TemplateParameter } from "@/types/database"

interface TemplateFormProps {
  template: Template
  className?: string
  onTaskCreated?: (taskId: string) => void
  onCancel?: () => void
}

export function TemplateForm({ 
  template, 
  className,
  onTaskCreated,
  onCancel,
}: TemplateFormProps) {
  const parameters = template.parameters as TemplateParameter[] | null
  const useTemplateMutation = useUseTemplate()

  // Initialize form state with default values
  const initialValues = useMemo(() => {
    const values: Record<string, string | number | boolean> = {}
    if (parameters) {
      parameters.forEach(param => {
        if (param.default !== undefined) {
          values[param.name] = param.default
        } else if (param.type === 'boolean') {
          values[param.name] = false
        } else if (param.type === 'number') {
          values[param.name] = 0
        } else {
          values[param.name] = ''
        }
      })
    }
    return values
  }, [parameters])

  const [formValues, setFormValues] = useState(initialValues)
  const [errors, setErrors] = useState<Record<string, string>>({})

  const handleChange = (name: string, value: string | number | boolean) => {
    setFormValues(prev => ({ ...prev, [name]: value }))
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => {
        const newErrors = { ...prev }
        delete newErrors[name]
        return newErrors
      })
    }
  }

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {}
    
    if (parameters) {
      parameters.forEach(param => {
        const value = formValues[param.name]
        
        if (param.required) {
          if (param.type === 'string' && (!value || String(value).trim() === '')) {
            newErrors[param.name] = `${param.name} is required`
          } else if (param.type === 'number' && (value === undefined || value === '')) {
            newErrors[param.name] = `${param.name} is required`
          }
        }
        
        if (param.type === 'number' && value !== '' && value !== undefined) {
          const numValue = Number(value)
          if (isNaN(numValue)) {
            newErrors[param.name] = 'Must be a valid number'
          }
        }
      })
    }
    
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validate()) return

    try {
      const result = await useTemplateMutation.mutateAsync({
        templateId: template.id,
        data: {
          templateParams: formValues,
        },
      })
      
      onTaskCreated?.(result.task.id)
    } catch (error) {
      console.error('Failed to use template:', error)
    }
  }

  // If no parameters, show simple confirm
  if (!parameters || parameters.length === 0) {
    return (
      <div className={cn("space-y-4", className)}>
        <p className="text-sm text-muted-foreground">
          This template doesn&apos;t require any additional parameters. Click the button below to create a task.
        </p>
        
        <div className="flex gap-3">
          {onCancel && (
            <Button variant="outline" onClick={onCancel}>
              Cancel
            </Button>
          )}
          <Button 
            onClick={handleSubmit}
            disabled={useTemplateMutation.isPending}
          >
            {useTemplateMutation.isPending ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Creating...
              </>
            ) : (
              <>
                <Send className="h-4 w-4 mr-2" />
                Create Task
              </>
            )}
          </Button>
        </div>
        
        {useTemplateMutation.isError && (
          <p className="text-sm text-destructive">
            {useTemplateMutation.error?.message || "Failed to create task"}
          </p>
        )}
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className={cn("space-y-6", className)}>
      <div className="space-y-4">
        {parameters.map((param) => (
          <div key={param.name} className="space-y-2">
            <Label htmlFor={param.name} className="flex items-center gap-2">
              {param.name}
              {param.required && <span className="text-destructive">*</span>}
              {param.description && (
                <span 
                  className="text-muted-foreground cursor-help"
                  title={param.description}
                >
                  <Info className="h-3.5 w-3.5" />
                </span>
              )}
            </Label>
            
            {param.type === 'enum' && param.options ? (
              <select
                id={param.name}
                value={String(formValues[param.name] || '')}
                onChange={(e) => handleChange(param.name, e.target.value)}
                className={cn(
                  "flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm",
                  "ring-offset-background focus-visible:outline-none focus-visible:ring-2",
                  "focus-visible:ring-ring focus-visible:ring-offset-2",
                  errors[param.name] && "border-destructive"
                )}
              >
                <option value="">Select {param.name}</option>
                {param.options.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            ) : param.type === 'boolean' ? (
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  id={param.name}
                  checked={Boolean(formValues[param.name])}
                  onChange={(e) => handleChange(param.name, e.target.checked)}
                  className="h-4 w-4 rounded border border-input"
                />
                <span className="text-sm text-muted-foreground">
                  {param.description || `Enable ${param.name}`}
                </span>
              </label>
            ) : (
              <Input
                id={param.name}
                type={param.type === 'number' ? 'number' : 'text'}
                value={String(formValues[param.name] || '')}
                onChange={(e) => handleChange(
                  param.name, 
                  param.type === 'number' ? e.target.value : e.target.value
                )}
                placeholder={param.placeholder || `Enter ${param.name}`}
                className={cn(errors[param.name] && "border-destructive")}
              />
            )}
            
            {errors[param.name] && (
              <p className="text-sm text-destructive">{errors[param.name]}</p>
            )}
            
            {param.description && param.type !== 'boolean' && (
              <p className="text-xs text-muted-foreground">{param.description}</p>
            )}
          </div>
        ))}
      </div>
      
      <div className="flex gap-3 pt-2">
        {onCancel && (
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancel
          </Button>
        )}
        <Button 
          type="submit"
          disabled={useTemplateMutation.isPending}
        >
          {useTemplateMutation.isPending ? (
            <>
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              Creating...
            </>
          ) : (
            <>
              <Send className="h-4 w-4 mr-2" />
              Create Task
            </>
          )}
        </Button>
      </div>
      
      {useTemplateMutation.isError && (
        <p className="text-sm text-destructive">
          {useTemplateMutation.error?.message || "Failed to create task"}
        </p>
      )}
    </form>
  )
}
