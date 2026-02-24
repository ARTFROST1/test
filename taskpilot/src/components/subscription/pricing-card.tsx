"use client"

import { Check } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Card, CardHeader, CardContent, CardFooter } from "@/components/ui/card"
import type { SubscriptionPlan } from "@/types/database"
import { PRICING_PLANS, getPlanOrder, type PricingPlan, type PlanFeature } from "@/lib/constants/pricing"

// Re-export for backward compatibility
export { PRICING_PLANS, type PricingPlan, type PlanFeature }

interface PricingCardProps {
  plan: PricingPlan
  currentPlan?: SubscriptionPlan
  onSelect?: (plan: SubscriptionPlan) => void
  isLoading?: boolean
  className?: string
}

export function PricingCard({
  plan,
  currentPlan,
  onSelect,
  isLoading,
  className,
}: PricingCardProps) {
  const isCurrentPlan = currentPlan === plan.id
  const isDowngrade = currentPlan && getPlanOrder(currentPlan) > getPlanOrder(plan.id)
  
  return (
    <Card
      className={cn(
        "relative flex flex-col",
        plan.popular && "border-primary shadow-lg",
        className
      )}
    >
      {/* Popular badge */}
      {plan.popular && (
        <div className="absolute -top-3 left-1/2 -translate-x-1/2">
          <span className="bg-primary text-primary-foreground text-xs font-semibold px-3 py-1 rounded-full">
            Most Popular
          </span>
        </div>
      )}
      
      <CardHeader className="text-center pb-2">
        <h3 className="text-lg font-semibold">{plan.name}</h3>
        <p className="text-sm text-muted-foreground">{plan.description}</p>
        
        {/* Price */}
        <div className="mt-4">
          <span className="text-4xl font-bold">
            ${plan.price}
          </span>
          {plan.price > 0 && (
            <span className="text-muted-foreground">/{plan.period}</span>
          )}
        </div>
      </CardHeader>
      
      <CardContent className="flex-1">
        <ul className="space-y-3">
          {plan.features.map((feature, index) => (
            <li key={index} className="flex items-start gap-2">
              <Check
                className={cn(
                  "h-5 w-5 shrink-0 mt-0.5",
                  feature.included ? "text-primary" : "text-muted-foreground/30"
                )}
              />
              <span
                className={cn(
                  "text-sm",
                  !feature.included && "text-muted-foreground line-through"
                )}
              >
                {feature.text}
              </span>
            </li>
          ))}
        </ul>
      </CardContent>
      
      <CardFooter>
        <Button
          className="w-full"
          variant={isCurrentPlan ? "outline" : plan.buttonVariant || "default"}
          disabled={isLoading || isCurrentPlan}
          onClick={() => onSelect?.(plan.id)}
        >
          {isLoading ? (
            <span className="flex items-center gap-2">
              <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                  fill="none"
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                />
              </svg>
              Processing...
            </span>
          ) : isCurrentPlan ? (
            "Current Plan"
          ) : isDowngrade ? (
            "Downgrade"
          ) : (
            plan.buttonText
          )}
        </Button>
      </CardFooter>
    </Card>
  )
}
