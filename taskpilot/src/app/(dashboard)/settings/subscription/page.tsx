"use client"

import { useState, useEffect, Suspense } from "react"
import { useSearchParams } from "next/navigation"
import { ArrowLeft, CheckCircle2, AlertCircle } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"
import { CurrentPlan, PricingTable, UpgradeModal, UsageMeter } from "@/components/subscription"
import { useSubscription } from "@/hooks/use-subscription"
import type { SubscriptionPlan } from "@/types/database"

function SubscriptionContent() {
  const searchParams = useSearchParams()
  const [showUpgradeModal, setShowUpgradeModal] = useState(false)
  const [successMessage, setSuccessMessage] = useState<string | null>(null)
  const { data: subscriptionData, isLoading, refetch } = useSubscription()
  
  // Check for success/cancel query params (from Stripe redirect)
  useEffect(() => {
    const success = searchParams.get("success")
    const canceled = searchParams.get("canceled")
    
    if (success === "true") {
      setSuccessMessage("Your subscription has been updated successfully!")
      // Refetch subscription data
      refetch()
      // Clear message after 5 seconds
      const timeout = setTimeout(() => setSuccessMessage(null), 5000)
      return () => clearTimeout(timeout)
    }
    
    if (canceled === "true") {
      setSuccessMessage(null)
    }
  }, [searchParams, refetch])
  
  const currentPlan = subscriptionData?.subscription?.plan as SubscriptionPlan | undefined
  
  const handleSelectPlan = (plan: SubscriptionPlan) => {
    if (plan !== currentPlan && plan !== "free") {
      setShowUpgradeModal(true)
    }
  }
  
  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center gap-4">
        <Link href="/settings">
          <Button variant="ghost" size="icon">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-bold">Subscription</h1>
          <p className="text-muted-foreground mt-1">
            Manage your plan and billing
          </p>
        </div>
      </div>
      
      {/* Success Message */}
      {successMessage && (
        <div className="flex items-center gap-2 p-4 bg-green-50 dark:bg-green-950 border border-green-200 dark:border-green-800 rounded-lg">
          <CheckCircle2 className="h-5 w-5 text-green-600 dark:text-green-400" />
          <span className="text-green-800 dark:text-green-200">{successMessage}</span>
        </div>
      )}
      
      {/* Current Plan Card */}
      <CurrentPlan onUpgrade={() => setShowUpgradeModal(true)} />
      
      {/* Usage Details */}
      <Card>
        <CardHeader>
          <CardTitle>Usage This Month</CardTitle>
          <CardDescription>
            Your usage resets at the start of each billing cycle
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {isLoading ? (
            <div className="space-y-4">
              <div className="h-16 bg-muted rounded animate-pulse" />
              <div className="h-16 bg-muted rounded animate-pulse" />
            </div>
          ) : subscriptionData?.limits ? (
            <>
              <UsageMeter
                label="Tasks"
                used={subscriptionData.limits.tasksUsed}
                limit={subscriptionData.limits.tasksLimit}
                size="lg"
              />
              <UsageMeter
                label="Storage"
                used={subscriptionData.limits.storageUsed}
                limit={subscriptionData.limits.storageLimit}
                formatAsBytes
                size="lg"
              />
              
              {/* Warning if near limit */}
              {subscriptionData.limits.tasksRemaining <= 2 && subscriptionData.limits.tasksRemaining > 0 && (
                <div className="flex items-center gap-2 p-3 bg-yellow-50 dark:bg-yellow-950 border border-yellow-200 dark:border-yellow-800 rounded-lg">
                  <AlertCircle className="h-5 w-5 text-yellow-600 dark:text-yellow-400" />
                  <span className="text-sm text-yellow-800 dark:text-yellow-200">
                    You have only {subscriptionData.limits.tasksRemaining} task{subscriptionData.limits.tasksRemaining === 1 ? "" : "s"} remaining this month.
                    Consider upgrading for more.
                  </span>
                </div>
              )}
              
              {/* Error if at limit */}
              {subscriptionData.limits.tasksRemaining === 0 && (
                <div className="flex items-center gap-2 p-3 bg-red-50 dark:bg-red-950 border border-red-200 dark:border-red-800 rounded-lg">
                  <AlertCircle className="h-5 w-5 text-red-600 dark:text-red-400" />
                  <span className="text-sm text-red-800 dark:text-red-200">
                    You&apos;ve reached your task limit. Upgrade to continue creating tasks.
                  </span>
                  <Button size="sm" className="ml-auto" onClick={() => setShowUpgradeModal(true)}>
                    Upgrade Now
                  </Button>
                </div>
              )}
            </>
          ) : (
            <p className="text-muted-foreground">Unable to load usage data</p>
          )}
        </CardContent>
      </Card>
      
      {/* Plan Comparison */}
      <Card>
        <CardHeader>
          <CardTitle>Compare Plans</CardTitle>
          <CardDescription>
            See all features and choose the right plan for you
          </CardDescription>
        </CardHeader>
        <CardContent>
          <PricingTable
            currentPlan={currentPlan}
            onSelectPlan={handleSelectPlan}
            isLoading={isLoading}
          />
        </CardContent>
      </Card>
      
      {/* Upgrade Modal */}
      <UpgradeModal
        isOpen={showUpgradeModal}
        onClose={() => setShowUpgradeModal(false)}
        currentPlan={currentPlan}
        recommendedPlan={currentPlan === "free" ? "pro" : "business"}
      />
    </div>
  )
}

export default function SubscriptionPage() {
  return (
    <Suspense fallback={<div className="animate-pulse space-y-6"><div className="h-12 bg-muted rounded" /><div className="h-64 bg-muted rounded" /></div>}>
      <SubscriptionContent />
    </Suspense>
  )
}
