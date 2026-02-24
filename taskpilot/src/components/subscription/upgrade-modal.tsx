"use client"

import { useState } from "react"
import { X, Zap } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Card, CardHeader, CardContent, CardFooter } from "@/components/ui/card"
import { PricingCard, PRICING_PLANS, type PricingPlan } from "./pricing-card"
import { useCreateCheckout } from "@/hooks/use-subscription"
import type { SubscriptionPlan } from "@/types/database"

interface UpgradeModalProps {
  isOpen: boolean
  onClose: () => void
  currentPlan?: SubscriptionPlan
  recommendedPlan?: SubscriptionPlan
}

export function UpgradeModal({
  isOpen,
  onClose,
  currentPlan = "free",
  recommendedPlan = "pro",
}: UpgradeModalProps) {
  const [selectedPlan, setSelectedPlan] = useState<SubscriptionPlan>(recommendedPlan)
  const { mutate: createCheckout, isPending } = useCreateCheckout()
  
  if (!isOpen) return null
  
  const handleUpgrade = () => {
    if (selectedPlan === "free") {
      onClose()
      return
    }
    createCheckout(selectedPlan)
  }
  
  const upgradePlans = PRICING_PLANS.filter(
    (plan) => plan.id !== "free" && getPlanOrder(plan.id) > getPlanOrder(currentPlan)
  )
  
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-background/80 backdrop-blur-sm"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className="relative z-50 w-full max-w-3xl mx-4 max-h-[90vh] overflow-auto">
        <Card className="shadow-xl">
          <CardHeader className="relative text-center pb-2">
            {/* Close button */}
            <Button
              variant="ghost"
              size="icon"
              className="absolute right-4 top-4"
              onClick={onClose}
            >
              <X className="h-4 w-4" />
              <span className="sr-only">Close</span>
            </Button>
            
            <div className="flex justify-center mb-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                <Zap className="h-6 w-6 text-primary" />
              </div>
            </div>
            
            <h2 className="text-2xl font-bold">Upgrade Your Plan</h2>
            <p className="text-muted-foreground mt-2">
              Unlock more tasks, storage, and features to boost your productivity
            </p>
          </CardHeader>
          
          <CardContent className="pb-6">
            {upgradePlans.length > 0 ? (
              <div className={cn(
                "grid gap-6 mt-4",
                upgradePlans.length === 1 ? "grid-cols-1 max-w-md mx-auto" : "grid-cols-1 md:grid-cols-2"
              )}>
                {upgradePlans.map((plan) => (
                  <PlanOption
                    key={plan.id}
                    plan={plan}
                    isSelected={selectedPlan === plan.id}
                    onSelect={() => setSelectedPlan(plan.id)}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <p className="text-muted-foreground">
                  You&apos;re already on the highest plan! 🎉
                </p>
              </div>
            )}
          </CardContent>
          
          <CardFooter className="flex justify-end gap-3 border-t pt-6">
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
            {upgradePlans.length > 0 && (
              <Button onClick={handleUpgrade} disabled={isPending}>
                {isPending ? "Processing..." : `Upgrade to ${getPlanName(selectedPlan)}`}
              </Button>
            )}
          </CardFooter>
        </Card>
      </div>
    </div>
  )
}

interface PlanOptionProps {
  plan: PricingPlan
  isSelected: boolean
  onSelect: () => void
}

function PlanOption({ plan, isSelected, onSelect }: PlanOptionProps) {
  return (
    <div
      className={cn(
        "relative cursor-pointer rounded-lg border-2 p-4 transition-all",
        isSelected
          ? "border-primary bg-primary/5"
          : "border-border hover:border-primary/50"
      )}
      onClick={onSelect}
    >
      {/* Selection indicator */}
      <div className="absolute top-4 right-4">
        <div
          className={cn(
            "h-5 w-5 rounded-full border-2 flex items-center justify-center",
            isSelected ? "border-primary bg-primary" : "border-muted-foreground"
          )}
        >
          {isSelected && (
            <div className="h-2 w-2 rounded-full bg-white" />
          )}
        </div>
      </div>
      
      {/* Plan info */}
      <div className="pr-8">
        <div className="flex items-center gap-2">
          <h3 className="font-semibold">{plan.name}</h3>
          {plan.popular && (
            <span className="bg-primary text-primary-foreground text-xs px-2 py-0.5 rounded-full">
              Recommended
            </span>
          )}
        </div>
        <p className="text-sm text-muted-foreground mt-1">{plan.description}</p>
        <div className="mt-2">
          <span className="text-2xl font-bold">${plan.price}</span>
          <span className="text-muted-foreground">/month</span>
        </div>
        
        {/* Key features */}
        <ul className="mt-3 space-y-1">
          {plan.features.slice(0, 4).map((feature, index) => (
            feature.included && (
              <li key={index} className="text-sm text-muted-foreground">
                • {feature.text}
              </li>
            )
          ))}
        </ul>
      </div>
    </div>
  )
}

function getPlanOrder(plan: SubscriptionPlan): number {
  const order: Record<SubscriptionPlan, number> = {
    free: 0,
    pro: 1,
    business: 2,
  }
  return order[plan]
}

function getPlanName(plan: SubscriptionPlan): string {
  const names: Record<SubscriptionPlan, string> = {
    free: "Free",
    pro: "Pro",
    business: "Business",
  }
  return names[plan]
}
