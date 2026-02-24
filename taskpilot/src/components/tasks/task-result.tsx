"use client"

import { FileText, Download, Copy, Check, ExternalLink } from "lucide-react"
import { useState } from "react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { MarkdownRenderer } from "@/components/shared/markdown-renderer"
import type { TaskResult, SourceReference } from "@/types/database"

interface TaskResultProps {
  result: TaskResult
  className?: string
}

export function TaskResultView({ result, className }: TaskResultProps) {
  const [copied, setCopied] = useState(false)
  const sources = result.sources_used as SourceReference[] | null

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(result.content)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error("Failed to copy:", err)
    }
  }

  const handleExportMarkdown = () => {
    const blob = new Blob([result.content], { type: "text/markdown" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = "task-result.md"
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  return (
    <div className={cn("rounded-lg border border-border bg-card", className)}>
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-border">
        <div className="flex items-center gap-2">
          <FileText className="h-5 w-5 text-primary" />
          <h3 className="font-semibold">Result</h3>
          <span className="text-xs text-muted-foreground px-2 py-0.5 bg-muted rounded">
            {result.content_format.toUpperCase()}
          </span>
        </div>
        
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={handleCopy}
            className="h-8"
          >
            {copied ? (
              <>
                <Check className="h-4 w-4 mr-1" />
                Copied
              </>
            ) : (
              <>
                <Copy className="h-4 w-4 mr-1" />
                Copy
              </>
            )}
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleExportMarkdown}
            className="h-8"
          >
            <Download className="h-4 w-4 mr-1" />
            Export
          </Button>
        </div>
      </div>
      
      {/* Content */}
      <div className="p-6 max-h-[600px] overflow-y-auto">
        {result.content_format === 'markdown' ? (
          <MarkdownRenderer content={result.content} />
        ) : result.content_format === 'html' ? (
          <div 
            className="prose prose-sm dark:prose-invert max-w-none"
            dangerouslySetInnerHTML={{ __html: result.content }}
          />
        ) : (
          <pre className="whitespace-pre-wrap text-sm font-mono">
            {result.content}
          </pre>
        )}
      </div>
      
      {/* Sources */}
      {sources && sources.length > 0 && (
        <div className="p-4 border-t border-border bg-muted/30">
          <h4 className="text-sm font-medium mb-2 flex items-center gap-2">
            <ExternalLink className="h-4 w-4" />
            Sources Used ({sources.length})
          </h4>
          <div className="flex flex-wrap gap-2">
            {sources.map((source, index) => (
              <span
                key={index}
                className="text-xs px-2 py-1 bg-background border border-border rounded-md"
                title={`Relevance: ${(source.relevance_score * 100).toFixed(0)}%`}
              >
                {source.document_name}
              </span>
            ))}
          </div>
        </div>
      )}
      
      {/* Token usage */}
      {(result.tokens_input || result.tokens_output) && (
        <div className="px-4 pb-4 text-xs text-muted-foreground">
          Tokens: {result.tokens_input?.toLocaleString() || 0} input, {result.tokens_output?.toLocaleString() || 0} output
        </div>
      )}
    </div>
  )
}
