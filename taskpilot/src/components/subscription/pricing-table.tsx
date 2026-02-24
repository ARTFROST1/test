"use client"

import { Check, X } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import type { SubscriptionPlan } from "@/types/database"

interface PlanColumn {
  id: SubscriptionPlan
  name: string
  price: number
  popular?: boolean
}

interface FeatureRow {
  name: string
  free: boolean | string
  pro: boolean | string
  business: boolean | string
}

interface PricingTableProps {
  currentPlan?: SubscriptionPlan
  onSelectPlan?: (plan: SubscriptionPlan) => void
  isLoading?: boolean
  className?: string
}

const PLANS: PlanColumn[] = [
  { id: "free", name: "Free", price: 0 },
  { id: "pro", name: "Pro", price: 29, popular: true },
  { id: "business", name: "Business", price: 99 },
]

const FEATURES: FeatureRow[] = [
  { name: "Tasks per month", free: "5", pro: "50", business: "500" },
  { name: "Storage", free: "100MB", pro: "1GB", business: "10GB" },
  { name: "Knowledge base", free: true, pro: true, business: true },
  { name: "Pre-built templates", free: true, pro: true, business: true },
  { name: "Markdown export", free: true, pro: true, business: true },
  { name: "PDF export", free: false, pro: true, business: true },
  { name: "DOCX export", free: false, pro: true, business: true },
  { name: "Email support", free: false, pro: true, business: true },
  { name: "Priority support", free: false, pro: false, business: true },
  { name: "API access", free: false, pro: false, business: true },
  { name: "Custom templates", free: false, pro: false, business: true },
  { name: "Custom integrations", free: false, pro: false, business: true },
]

export function PricingTable({
  currentPlan,
  onSelectPlan,
  isLoading,
  className,
}: PricingTableProps) {
  return (
    <div className={cn("overflow-x-auto", className)}>
      <table className="w-full border-collapse">
        <thead>
          <tr>
            {/* Feature name column */}
            <th className="text-left p-4 border-b border-border w-1/4">
              <span className="text-sm font-medium text-muted-foreground">Features</span>
            </th>
            
            {/* Plan columns */}
            {PLANS.map((plan) => (
              <th
                key={plan.id}
                className={cn(
                  "p-4 border-b border-border text-center",
                  plan.popular && "bg-primary/5"
                )}
              >
                {plan.popular && (
                  <span className="inline-block bg-primary text-primary-foreground text-xs font-semibold px-2 py-0.5 rounded-full mb-2">
                    Popular
                  </span>
                )}
                <div className="font-semibold text-lg">{plan.name}</div>
                <div className="mt-1">
                  <span className="text-2xl font-bold">${plan.price}</span>
                  {plan.price > 0 && (
                    <span className="text-muted-foreground text-sm">/mo</span>
                  )}
                </div>
              </th>
            ))}
          </tr>
        </thead>
        
        <tbody>
          {FEATURES.map((feature, index) => (
            <tr key={feature.name} className={index % 2 === 0 ? "bg-muted/30" : ""}>
              <td className="p-4 border-b border-border">
                <span className="text-sm font-medium">{feature.name}</span>
              </td>
              
              {PLANS.map((plan) => {
                const value = feature[plan.id]
                return (
                  <td
                    key={plan.id}
                    className={cn(
                      "p-4 border-b border-border text-center",
                      plan.popular && "bg-primary/5"
                    )}
                  >
                    {renderFeatureValue(value)}
                  </td>
                )
              })}
            </tr>
          ))}
          
          {/* Action row */}
          <tr>
            <td className="p-4" />
            {PLANS.map((plan) => {
              const isCurrentPlan = currentPlan === plan.id
              return (
                <td
                  key={plan.id}
                  className={cn(
                    "p-4 text-center",
                    plan.popular && "bg-primary/5"
                  )}
                >
                  <Button
                    variant={isCurrentPlan ? "outline" : plan.popular ? "default" : "secondary"}
                    disabled={isLoading || isCurrentPlan}
                    onClick={() => onSelectPlan?.(plan.id)}
                    className="w-full max-w-[160px]"
                  >
                    {isCurrentPlan ? "Current Plan" : `Choose ${plan.name}`}
                  </Button>
                </td>
              )
            })}
          </tr>
        </tbody>
      </table>
    </div>
  )
}

function renderFeatureValue(value: boolean | string) {
  if (typeof value === "boolean") {
    return value ? (
      <Check className="h-5 w-5 text-primary mx-auto" />
    ) : (
      <X className="h-5 w-5 text-muted-foreground/40 mx-auto" />
    )
  }
  return <span className="text-sm font-medium">{value}</span>
}
