"use client"

import { useState, useRef, useEffect } from "react"
import { Send, Sparkles, ChevronDown, Loader2 } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { useCreateTask } from "@/hooks/use-tasks"
import { useTaskStore } from "@/stores/task-store"

const EXAMPLE_PROMPTS = [
  "Research the top 10 CRM tools for small businesses",
  "Write a cold email sequence for SaaS products",
  "Analyze competitor pricing in the project management space",
  "Create a content brief for AI in healthcare",
  "Draft a follow-up email for yesterday's meeting",
]

interface TaskInputProps {
  className?: string
  onTaskCreated?: (taskId: string) => void
  placeholder?: string
  autoFocus?: boolean
}

export function TaskInput({ 
  className, 
  onTaskCreated,
  placeholder = "Describe what you want to accomplish...",
  autoFocus = false,
}: TaskInputProps) {
  const [description, setDescription] = useState("")
  const [showExamples, setShowExamples] = useState(false)
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const examplesRef = useRef<HTMLDivElement>(null)
  
  const { selectedTemplateId } = useTaskStore()
  const createTask = useCreateTask()

  // Auto-resize textarea
  useEffect(() => {
    const textarea = textareaRef.current
    if (textarea) {
      textarea.style.height = "auto"
      textarea.style.height = `${Math.min(textarea.scrollHeight, 200)}px`
    }
  }, [description])

  // Close examples on click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (examplesRef.current && !examplesRef.current.contains(event.target as Node)) {
        setShowExamples(false)
      }
    }
    
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  const handleSubmit = async () => {
    if (!description.trim() || createTask.isPending) return

    try {
      const result = await createTask.mutateAsync({
        description: description.trim(),
        templateId: selectedTemplateId || undefined,
        useKnowledgeBase: true,
      })
      
      setDescription("")
      onTaskCreated?.(result.task.id)
    } catch (error) {
      // Error is handled by the mutation
      console.error("Failed to create task:", error)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSubmit()
    }
  }

  const handleExampleClick = (example: string) => {
    setDescription(example)
    setShowExamples(false)
    textareaRef.current?.focus()
  }

  return (
    <div className={cn("relative", className)}>
      <div className="rounded-lg border border-border bg-card shadow-sm focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2 transition-shadow">
        <div className="flex items-start gap-3 p-4">
          <Sparkles className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
          <textarea
            ref={textareaRef}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={placeholder}
            autoFocus={autoFocus}
            disabled={createTask.isPending}
            className="flex-1 resize-none bg-transparent text-base placeholder:text-muted-foreground focus:outline-none disabled:opacity-50 min-h-[24px]"
            rows={1}
          />
        </div>
        
        <div className="flex items-center justify-between px-4 pb-3">
          <div className="relative" ref={examplesRef}>
            <button
              type="button"
              onClick={() => setShowExamples(!showExamples)}
              className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              <span>Examples</span>
              <ChevronDown className={cn(
                "h-4 w-4 transition-transform",
                showExamples && "rotate-180"
              )} />
            </button>
            
            {showExamples && (
              <div className="absolute left-0 top-full mt-2 z-50 w-80 rounded-lg border border-border bg-popover shadow-lg">
                <div className="p-2">
                  <p className="text-xs text-muted-foreground px-2 py-1.5 mb-1">
                    Try one of these examples:
                  </p>
                  {EXAMPLE_PROMPTS.map((example, index) => (
                    <button
                      key={index}
                      onClick={() => handleExampleClick(example)}
                      className="w-full text-left text-sm px-2 py-2 rounded-md hover:bg-accent transition-colors"
                    >
                      {example}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
          
          <Button
            onClick={handleSubmit}
            disabled={!description.trim() || createTask.isPending}
            size="sm"
          >
            {createTask.isPending ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Creating...
              </>
            ) : (
              <>
                <Send className="h-4 w-4" />
                Delegate
              </>
            )}
          </Button>
        </div>
      </div>
      
      {createTask.isError && (
        <p className="text-sm text-destructive mt-2">
          {createTask.error?.message || "Failed to create task. Please try again."}
        </p>
      )}
    </div>
  )
}
