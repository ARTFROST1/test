"use client"

import { useMemo } from "react"
import { cn } from "@/lib/utils"

interface MarkdownRendererProps {
  content: string
  className?: string
}

/**
 * Simple markdown renderer supporting:
 * - Headers (# ## ###)
 * - Bold (**text**)
 * - Italic (*text*)
 * - Code blocks (```code```)
 * - Inline code (`code`)
 * - Links [text](url)
 * - Lists (- item)
 * - Numbered lists (1. item)
 * - Blockquotes (> text)
 * - Horizontal rules (---)
 */
export function MarkdownRenderer({ content, className }: MarkdownRendererProps) {
  const html = useMemo(() => {
    let result = content
    
    // Escape HTML
    result = result
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
    
    // Code blocks (must be before inline processing)
    result = result.replace(
      /```(\w*)\n([\s\S]*?)```/g,
      '<pre class="bg-muted rounded-lg p-4 overflow-x-auto my-4"><code class="text-sm">$2</code></pre>'
    )
    
    // Inline code
    result = result.replace(
      /`([^`]+)`/g,
      '<code class="bg-muted px-1.5 py-0.5 rounded text-sm">$1</code>'
    )
    
    // Headers
    result = result.replace(
      /^### (.+)$/gm,
      '<h3 class="text-lg font-semibold mt-6 mb-2">$1</h3>'
    )
    result = result.replace(
      /^## (.+)$/gm,
      '<h2 class="text-xl font-semibold mt-6 mb-3">$1</h2>'
    )
    result = result.replace(
      /^# (.+)$/gm,
      '<h1 class="text-2xl font-bold mt-6 mb-4">$1</h1>'
    )
    
    // Bold and Italic
    result = result.replace(/\*\*(.+?)\*\*/g, '<strong class="font-semibold">$1</strong>')
    result = result.replace(/\*(.+?)\*/g, '<em>$1</em>')
    
    // Links
    result = result.replace(
      /\[([^\]]+)\]\(([^)]+)\)/g,
      '<a href="$2" target="_blank" rel="noopener noreferrer" class="text-primary underline hover:no-underline">$1</a>'
    )
    
    // Blockquotes
    result = result.replace(
      /^&gt; (.+)$/gm,
      '<blockquote class="border-l-4 border-primary/30 pl-4 italic text-muted-foreground my-4">$1</blockquote>'
    )
    
    // Horizontal rules
    result = result.replace(
      /^---$/gm,
      '<hr class="border-t border-border my-6" />'
    )
    
    // Unordered lists
    result = result.replace(
      /^- (.+)$/gm,
      '<li class="ml-4 list-disc">$1</li>'
    )
    
    // Numbered lists
    result = result.replace(
      /^\d+\. (.+)$/gm,
      '<li class="ml-4 list-decimal">$1</li>'
    )
    
    // Wrap consecutive list items in ul/ol
    result = result.replace(
      /(<li class="ml-4 list-disc">[\s\S]*?<\/li>)+/g,
      '<ul class="my-2 space-y-1">$&</ul>'
    )
    result = result.replace(
      /(<li class="ml-4 list-decimal">[\s\S]*?<\/li>)+/g,
      '<ol class="my-2 space-y-1">$&</ol>'
    )
    
    // Paragraphs - wrap remaining lines
    result = result
      .split('\n\n')
      .map(block => {
        // Skip blocks that already have HTML tags
        if (block.match(/^<[a-z]/i)) return block
        // Skip empty blocks
        if (!block.trim()) return ''
        // Wrap in paragraph if it doesn't look like a block element
        return `<p class="my-2">${block}</p>`
      })
      .join('\n')
    
    // Clean up line breaks within paragraphs
    result = result.replace(/<p class="my-2">([\s\S]*?)<\/p>/g, (match, content) => {
      return `<p class="my-2">${content.replace(/\n/g, '<br />')}</p>`
    })
    
    return result
  }, [content])

  return (
    <div
      className={cn(
        "prose prose-sm dark:prose-invert max-w-none",
        "prose-headings:text-foreground prose-p:text-foreground",
        "prose-a:text-primary prose-strong:text-foreground",
        "prose-code:text-foreground prose-pre:bg-muted",
        className
      )}
      dangerouslySetInnerHTML={{ __html: html }}
    />
  )
}
