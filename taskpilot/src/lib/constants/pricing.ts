import type { SubscriptionPlan } from "@/types/database"

export interface PlanFeature {
  text: string
  included: boolean
}

export interface PricingPlan {
  id: SubscriptionPlan
  name: string
  description: string
  price: number
  period: string
  features: PlanFeature[]
  popular?: boolean
  buttonText: string
  buttonVariant?: "default" | "outline" | "secondary"
}

export const PRICING_PLANS: PricingPlan[] = [
  {
    id: "free",
    name: "Free",
    description: "Get started with AI task delegation",
    price: 0,
    period: "month",
    buttonText: "Get Started",
    buttonVariant: "outline",
    features: [
      { text: "5 tasks per month", included: true },
      { text: "100MB storage", included: true },
      { text: "Knowledge base", included: true },
      { text: "Pre-built templates", included: true },
      { text: "Markdown export", included: true },
      { text: "Community support", included: true },
      { text: "PDF/DOCX export", included: false },
      { text: "Priority support", included: false },
      { text: "API access", included: false },
    ],
  },
  {
    id: "pro",
    name: "Pro",
    description: "For professionals and small teams",
    price: 29,
    period: "month",
    buttonText: "Upgrade to Pro",
    popular: true,
    features: [
      { text: "50 tasks per month", included: true },
      { text: "1GB storage", included: true },
      { text: "Knowledge base", included: true },
      { text: "All templates", included: true },
      { text: "All export formats", included: true },
      { text: "Email support", included: true },
      { text: "PDF/DOCX export", included: true },
      { text: "Priority support", included: false },
      { text: "API access", included: false },
    ],
  },
  {
    id: "business",
    name: "Business",
    description: "For growing businesses",
    price: 99,
    period: "month",
    buttonText: "Upgrade to Business",
    features: [
      { text: "500 tasks per month", included: true },
      { text: "10GB storage", included: true },
      { text: "Knowledge base", included: true },
      { text: "All templates + custom", included: true },
      { text: "All export formats", included: true },
      { text: "Priority support", included: true },
      { text: "PDF/DOCX export", included: true },
      { text: "API access", included: true },
      { text: "Custom integrations", included: true },
    ],
  },
]

export function getPlanOrder(plan: SubscriptionPlan): number {
  const order: Record<SubscriptionPlan, number> = {
    free: 0,
    pro: 1,
    business: 2,
  }
  return order[plan]
}
