"use client"

import { ThemeProvider } from "./theme-provider"
import { QueryProvider } from "./query-provider"
import { SupabaseProvider } from "./supabase-provider"

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
    >
      <QueryProvider>
        <SupabaseProvider>{children}</SupabaseProvider>
      </QueryProvider>
    </ThemeProvider>
  )
}
