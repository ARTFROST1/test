import { Metadata } from "next"
import Link from "next/link"
import { Check, ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { PRICING_PLANS } from "@/lib/constants/pricing"

export const metadata: Metadata = {
  title: "Pricing | TaskPilot",
  description: "Choose the plan that's right for you. Start free, upgrade when you need more.",
}

export default function PricingPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center space-x-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground font-bold">
              T
            </div>
            <span className="font-semibold text-xl">TaskPilot</span>
          </Link>
          
          <nav className="flex items-center gap-4">
            <Link href="/login">
              <Button variant="ghost">Log In</Button>
            </Link>
            <Link href="/signup">
              <Button>Get Started</Button>
            </Link>
          </nav>
        </div>
      </header>
      
      {/* Hero Section */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight">
            Simple, transparent pricing
          </h1>
          <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
            Start free and scale as you grow. No hidden fees, no surprises.
            Cancel anytime.
          </p>
        </div>
      </section>
      
      {/* Pricing Cards */}
      <section className="pb-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {PRICING_PLANS.map((plan) => (
              <div
                key={plan.id}
                className={`relative flex flex-col rounded-xl border ${
                  plan.popular
                    ? "border-primary shadow-lg scale-105"
                    : "border-border"
                } bg-card p-6`}
              >
                {/* Popular badge */}
                {plan.popular && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                    <span className="bg-primary text-primary-foreground text-xs font-semibold px-3 py-1 rounded-full">
                      Most Popular
                    </span>
                  </div>
                )}
                
                {/* Plan header */}
                <div className="text-center pb-6 border-b border-border">
                  <h2 className="text-xl font-semibold">{plan.name}</h2>
                  <p className="text-sm text-muted-foreground mt-1">
                    {plan.description}
                  </p>
                  <div className="mt-4">
                    <span className="text-4xl font-bold">${plan.price}</span>
                    {plan.price > 0 && (
                      <span className="text-muted-foreground">/month</span>
                    )}
                  </div>
                </div>
                
                {/* Features */}
                <ul className="flex-1 py-6 space-y-3">
                  {plan.features.map((feature, index) => (
                    <li
                      key={index}
                      className={`flex items-start gap-2 ${
                        !feature.included ? "text-muted-foreground" : ""
                      }`}
                    >
                      <Check
                        className={`h-5 w-5 shrink-0 mt-0.5 ${
                          feature.included
                            ? "text-primary"
                            : "text-muted-foreground/30"
                        }`}
                      />
                      <span
                        className={`text-sm ${
                          !feature.included ? "line-through" : ""
                        }`}
                      >
                        {feature.text}
                      </span>
                    </li>
                  ))}
                </ul>
                
                {/* CTA */}
                <Link href={plan.id === "free" ? "/signup" : `/signup?plan=${plan.id}`}>
                  <Button
                    className="w-full"
                    variant={plan.popular ? "default" : "outline"}
                  >
                    {plan.buttonText}
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>
      
      {/* FAQ Section */}
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4 max-w-3xl">
          <h2 className="text-3xl font-bold text-center mb-12">
            Frequently Asked Questions
          </h2>
          
          <div className="space-y-6">
            <FAQItem
              question="Can I change plans at any time?"
              answer="Yes! You can upgrade or downgrade your plan at any time. When you upgrade, you'll be charged the prorated difference. When you downgrade, the new rate applies from your next billing cycle."
            />
            <FAQItem
              question="What happens when I reach my task limit?"
              answer="When you reach your monthly task limit, you won't be able to create new tasks until your limit resets at the start of your billing cycle. You can always upgrade to get more tasks immediately."
            />
            <FAQItem
              question="Is there a free trial for paid plans?"
              answer="We offer a generous free plan that you can use indefinitely. This lets you try TaskPilot without any commitment. When you're ready for more, upgrading takes just a few clicks."
            />
            <FAQItem
              question="What payment methods do you accept?"
              answer="We accept all major credit cards (Visa, Mastercard, American Express) through our secure payment processor, Stripe."
            />
            <FAQItem
              question="Can I cancel my subscription?"
              answer="Absolutely. You can cancel anytime from your account settings. You'll continue to have access to your paid features until the end of your current billing period."
            />
          </div>
        </div>
      </section>
      
      {/* CTA Section */}
      <section className="py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">
            Ready to get started?
          </h2>
          <p className="text-muted-foreground mb-8 max-w-lg mx-auto">
            Join thousands of users who are already delegating tasks to AI and
            saving hours every week.
          </p>
          <Link href="/signup">
            <Button size="lg">
              Start Free Today
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </div>
      </section>
      
      {/* Footer */}
      <footer className="border-t border-border py-8">
        <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
          <p>© 2026 TaskPilot. All rights reserved.</p>
        </div>
      </footer>
    </div>
  )
}

function FAQItem({ question, answer }: { question: string; answer: string }) {
  return (
    <div className="border-b border-border pb-6">
      <h3 className="font-semibold text-lg mb-2">{question}</h3>
      <p className="text-muted-foreground">{answer}</p>
    </div>
  )
}
