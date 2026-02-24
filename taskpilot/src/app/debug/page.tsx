"use client"

import { useState } from "react"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function DebugPage() {
  const [results, setResults] = useState<Record<string, any>>({})
  const [isLoading, setIsLoading] = useState(false)

  const runDiagnostics = async () => {
    setIsLoading(true)
    const diagnostics: Record<string, any> = {}

    // Check environment variables
    diagnostics.env = {
      supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL || "NOT SET",
      supabaseUrlPrefix: (process.env.NEXT_PUBLIC_SUPABASE_URL || "").substring(0, 30),
      anonKeyPresent: !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
      anonKeyPrefix: (process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "").substring(0, 20),
    }

    // Test Supabase connection
    try {
      const supabase = createClient()
      
      // Test 1: Get session (should work even unauthenticated)
      const { data: sessionData, error: sessionError } = await supabase.auth.getSession()
      diagnostics.session = {
        success: !sessionError,
        error: sessionError?.message,
        hasSession: !!sessionData?.session,
      }
    } catch (e: any) {
      diagnostics.session = {
        success: false,
        error: e.message,
        fullError: e.toString(),
      }
    }

    // Test 2: Basic API call
    try {
      const supabase = createClient()
      const { data, error } = await supabase.from('templates').select('id').limit(1)
      diagnostics.dbQuery = {
        success: !error,
        error: error?.message,
        code: error?.code,
        hint: error?.hint,
        rowCount: data?.length || 0,
      }
    } catch (e: any) {
      diagnostics.dbQuery = {
        success: false,
        error: e.message,
        fullError: e.toString(),
      }
    }

    // Test 3: Direct fetch to Supabase URL
    try {
      const url = process.env.NEXT_PUBLIC_SUPABASE_URL
      if (url) {
        const response = await fetch(`${url}/rest/v1/`, {
          headers: {
            apikey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '',
          },
        })
        diagnostics.directFetch = {
          success: response.ok,
          status: response.status,
          statusText: response.statusText,
        }
      } else {
        diagnostics.directFetch = { success: false, error: "No URL configured" }
      }
    } catch (e: any) {
      diagnostics.directFetch = {
        success: false,
        error: e.message,
        type: e.name,
        fullError: e.toString(),
      }
    }

    // Test 4: Auth endpoint
    try {
      const url = process.env.NEXT_PUBLIC_SUPABASE_URL
      if (url) {
        const response = await fetch(`${url}/auth/v1/health`)
        diagnostics.authHealth = {
          success: response.ok,
          status: response.status,
        }
      }
    } catch (e: any) {
      diagnostics.authHealth = {
        success: false,
        error: e.message,
      }
    }

    // Browser info
    diagnostics.browser = {
      userAgent: typeof navigator !== 'undefined' ? navigator.userAgent : 'N/A',
      onLine: typeof navigator !== 'undefined' ? navigator.onLine : 'N/A',
    }

    setResults(diagnostics)
    setIsLoading(false)
  }

  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-4xl mx-auto space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Supabase Connection Diagnostics</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button onClick={runDiagnostics} disabled={isLoading}>
              {isLoading ? "Running..." : "Run Diagnostics"}
            </Button>

            {Object.keys(results).length > 0 && (
              <div className="space-y-4">
                {Object.entries(results).map(([key, value]) => (
                  <div key={key} className="border rounded-lg p-4">
                    <h3 className="font-semibold mb-2 capitalize">{key}</h3>
                    <pre className="bg-muted p-3 rounded text-xs overflow-auto">
                      {JSON.stringify(value, null, 2)}
                    </pre>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Troubleshooting Guide</CardTitle>
          </CardHeader>
          <CardContent className="prose prose-sm">
            <p><strong>If "fail to fetch" error:</strong></p>
            <ul>
              <li>Check if Supabase URL and Anon Key are correctly set in Vercel environment variables</li>
              <li>Ensure the Supabase project is not paused (free tier projects pause after 7 days of inactivity)</li>
              <li>Verify CORS settings in Supabase Dashboard → Authentication → URL Configuration</li>
              <li>Add your Vercel domain to "Site URL" and "Redirect URLs" in Supabase</li>
            </ul>
            
            <p><strong>Required Supabase Settings:</strong></p>
            <ol>
              <li>Go to Supabase Dashboard → Authentication → URL Configuration</li>
              <li>Set Site URL to: <code>https://your-app.vercel.app</code></li>
              <li>Add Redirect URL: <code>https://your-app.vercel.app/**</code></li>
              <li>Also add: <code>http://localhost:3000/**</code> for local development</li>
            </ol>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
