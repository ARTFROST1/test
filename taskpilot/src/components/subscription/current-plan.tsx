"use client"

import { CreditCard, Calendar, ArrowUpRight } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Card, CardHeader, CardContent, CardFooter, CardTitle, CardDescription } from "@/components/ui/card"
import { UsageMeter } from "./usage-meter"
import { useSubscription, useCreatePortal, getPlanDisplayName, getPlanPrice } from "@/hooks/use-subscription"
import type { SubscriptionPlan } from "@/types/database"

interface CurrentPlanProps {
  onUpgrade?: () => void
  className?: string
}

export function CurrentPlan({ onUpgrade, className }: CurrentPlanProps) {
  const { data: subscriptionData, isLoading } = useSubscription()
  const { mutate: openPortal, isPending: isPortalPending } = useCreatePortal()
  
  if (isLoading) {
    return (
      <Card className={cn("animate-pulse", className)}>
        <CardHeader>
          <div className="h-6 bg-muted rounded w-32" />
          <div className="h-4 bg-muted rounded w-48 mt-2" />
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="h-12 bg-muted rounded" />
          <div className="h-12 bg-muted rounded" />
        </CardContent>
      </Card>
    )
  }
  
  const subscription = subscriptionData?.subscription
  const limits = subscriptionData?.limits
  
  if (!subscription || !limits) {
    return (
      <Card className={className}>
        <CardContent className="py-8 text-center">
          <p className="text-muted-foreground">Unable to load subscription data</p>
        </CardContent>
      </Card>
    )
  }
  
  const plan = subscription.plan as SubscriptionPlan
  const planName = getPlanDisplayName(plan)
  const planPrice = getPlanPrice(plan)
  const isFreePlan = plan === "free"
  
  // Format period end date
  const periodEnd = subscription.current_period_end
    ? new Date(subscription.current_period_end).toLocaleDateString("en-US", {
        month: "long",
        day: "numeric",
        year: "numeric",
      })
    : null
  
  return (
    <Card className={className}>
      <CardHeader>
        <div className="flex items-start justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <CreditCard className="h-5 w-5" />
              {planName} Plan
            </CardTitle>
            <CardDescription className="mt-1">
              {isFreePlan ? (
                "You're on the free plan"
              ) : (
                <>
                  ${planPrice}/month
                  {subscription.status === "active" && " • Active"}
                  {subscription.status === "trialing" && " • Trialing"}
                  {subscription.status === "past_due" && " • Payment Due"}
                </>
              )}
            </CardDescription>
          </div>
          
          {/* Status badge */}
          <StatusBadge status={subscription.status} />
        </div>
      </CardHeader>
      
      <CardContent className="space-y-6">
        {/* Usage meters */}
        <div className="space-y-4">
          <UsageMeter
            label="Tasks"
            used={limits.tasksUsed}
            limit={limits.tasksLimit}
            size="md"
          />
          
          <UsageMeter
            label="Storage"
            used={limits.storageUsed}
            limit={limits.storageLimit}
            formatAsBytes
            size="md"
          />
        </div>
        
        {/* Billing period */}
        {periodEnd && !isFreePlan && (
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Calendar className="h-4 w-4" />
            <span>
              {subscription.status === "canceled"
                ? `Access until ${periodEnd}`
                : `Renews on ${periodEnd}`}
            </span>
          </div>
        )}
      </CardContent>
      
      <CardFooter className="flex gap-3">
        {/* Manage subscription button (for paid plans) */}
        {!isFreePlan && subscription.stripe_subscription_id && (
          <Button
            variant="outline"
            onClick={() => openPortal()}
            disabled={isPortalPending}
          >
            {isPortalPending ? "Loading..." : "Manage Subscription"}
          </Button>
        )}
        
        {/* Upgrade button */}
        {plan !== "business" && (
          <Button onClick={onUpgrade} className="gap-1">
            Upgrade
            <ArrowUpRight className="h-4 w-4" />
          </Button>
        )}
      </CardFooter>
    </Card>
  )
}

interface StatusBadgeProps {
  status: string
}

function StatusBadge({ status }: StatusBadgeProps) {
  const config: Record<string, { label: string; className: string }> = {
    active: {
      label: "Active",
      className: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300",
    },
    trialing: {
      label: "Trial",
      className: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300",
    },
    past_due: {
      label: "Past Due",
      className: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300",
    },
    canceled: {
      label: "Canceled",
      className: "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300",
    },
    paused: {
      label: "Paused",
      className: "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300",
    },
  }
  
  const { label, className } = config[status] || config.active
  
  return (
    <span className={cn("text-xs font-medium px-2 py-1 rounded-full", className)}>
      {label}
    </span>
  )
}
