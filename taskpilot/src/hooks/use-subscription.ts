/**
 * Subscription Hook - Fetch and manage subscription data
 */

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import type { SubscriptionResponse, CreateCheckoutResponse } from "@/types/api"
import type { SubscriptionPlan } from "@/types/database"

/**
 * Fetch current subscription
 */
async function fetchSubscription(): Promise<SubscriptionResponse> {
  const response = await fetch("/api/subscription")
  
  if (!response.ok) {
    throw new Error("Failed to fetch subscription")
  }
  
  return response.json()
}

/**
 * Create checkout session
 */
async function createCheckout(plan: Exclude<SubscriptionPlan, "free">): Promise<CreateCheckoutResponse> {
  const response = await fetch("/api/subscription/checkout", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ plan }),
  })
  
  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.error || "Failed to create checkout")
  }
  
  return response.json()
}

/**
 * Create customer portal session
 */
async function createPortalSession(): Promise<{ portalUrl: string }> {
  const response = await fetch("/api/subscription/portal", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
  })
  
  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.error || "Failed to create portal session")
  }
  
  return response.json()
}

/**
 * Hook to get subscription data
 */
export function useSubscription() {
  return useQuery({
    queryKey: ["subscription"],
    queryFn: fetchSubscription,
    staleTime: 5 * 60 * 1000, // 5 minutes
  })
}

/**
 * Hook to create checkout session
 */
export function useCreateCheckout() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: createCheckout,
    onSuccess: (data) => {
      // Redirect to Stripe checkout
      if (data.checkoutUrl) {
        window.location.href = data.checkoutUrl
      }
    },
    onError: (error) => {
      console.error("Checkout error:", error)
    },
  })
}

/**
 * Hook to create portal session (manage subscription)
 */
export function useCreatePortal() {
  return useMutation({
    mutationFn: createPortalSession,
    onSuccess: (data) => {
      // Redirect to Stripe portal
      if (data.portalUrl) {
        window.location.href = data.portalUrl
      }
    },
    onError: (error) => {
      console.error("Portal error:", error)
    },
  })
}

/**
 * Get plan display name
 */
export function getPlanDisplayName(plan: SubscriptionPlan): string {
  const names: Record<SubscriptionPlan, string> = {
    free: "Free",
    pro: "Pro",
    business: "Business",
  }
  return names[plan]
}

/**
 * Get plan price
 */
export function getPlanPrice(plan: SubscriptionPlan): number {
  const prices: Record<SubscriptionPlan, number> = {
    free: 0,
    pro: 29,
    business: 99,
  }
  return prices[plan]
}

/**
 * Format bytes to human-readable string
 */
export function formatBytes(bytes: number): string {
  if (bytes === 0) return "0 B"
  
  const k = 1024
  const sizes = ["B", "KB", "MB", "GB", "TB"]
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(1))} ${sizes[i]}`
}
