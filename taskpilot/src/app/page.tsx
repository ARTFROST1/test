import Link from "next/link"
import { ArrowRight, Zap, Clock, Shield, Sparkles } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"

const features = [
  {
    icon: Zap,
    title: "Instant Task Delegation",
    description: "Describe any business task in natural language. Our AI breaks it down and executes it automatically.",
  },
  {
    icon: Clock,
    title: "Save Hours Every Week",
    description: "Automate repetitive research, content creation, and analysis tasks. Focus on what matters most.",
  },
  {
    icon: Shield,
    title: "Enterprise-Grade Security",
    description: "Your data is encrypted and never used to train AI models. SOC 2 compliant infrastructure.",
  },
  {
    icon: Sparkles,
    title: "Smart Templates",
    description: "Start with proven templates for common tasks or create your own reusable workflows.",
  },
]

export default function LandingPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      
      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative overflow-hidden py-20 sm:py-32">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-3xl text-center">
              <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl lg:text-6xl">
                Delegate tasks to AI,{" "}
                <span className="text-primary">get results fast</span>
              </h1>
              <p className="mt-6 text-lg text-muted-foreground sm:text-xl">
                TaskPilot transforms your natural language requests into actionable results. 
                Research, analyze, create content, and more — all powered by advanced AI agents.
              </p>
              <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
                <Button size="lg" asChild>
                  <Link href="/signup">
                    Get Started Free
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
                <Button size="lg" variant="outline" asChild>
                  <Link href="#features">See How It Works</Link>
                </Button>
              </div>
              <p className="mt-4 text-sm text-muted-foreground">
                No credit card required. Free plan includes 10 tasks/month.
              </p>
            </div>
          </div>
          
          {/* Background gradient */}
          <div className="absolute inset-0 -z-10 overflow-hidden">
            <div className="absolute left-1/2 top-0 -translate-x-1/2 -translate-y-1/2 h-[600px] w-[600px] rounded-full bg-primary/5 blur-3xl" />
          </div>
        </section>

        {/* Features Section */}
        <section id="features" className="py-20 bg-muted/30">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-2xl text-center">
              <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
                Everything you need to work smarter
              </h2>
              <p className="mt-4 text-lg text-muted-foreground">
                TaskPilot combines the power of multiple AI models with intelligent task orchestration.
              </p>
            </div>
            
            <div className="mt-16 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
              {features.map((feature) => (
                <Card key={feature.title} className="border-0 bg-background shadow-sm">
                  <CardHeader>
                    <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                      <feature.icon className="h-6 w-6 text-primary" />
                    </div>
                    <CardTitle className="text-xl">{feature.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="text-base">
                      {feature.description}
                    </CardDescription>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* How It Works Section */}
        <section className="py-20">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-2xl text-center">
              <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
                Get started in 3 simple steps
              </h2>
            </div>
            
            <div className="mt-16 grid gap-8 md:grid-cols-3">
              {[
                {
                  step: "1",
                  title: "Describe Your Task",
                  description: "Tell TaskPilot what you need in plain English. Be as detailed as you like.",
                },
                {
                  step: "2",
                  title: "Review the Plan",
                  description: "AI breaks down your task into steps. Approve or adjust before execution.",
                },
                {
                  step: "3",
                  title: "Get Results",
                  description: "Watch as AI completes each step. Download results or iterate further.",
                },
              ].map((item) => (
                <div key={item.step} className="text-center">
                  <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-primary text-primary-foreground text-xl font-bold">
                    {item.step}
                  </div>
                  <h3 className="mt-6 text-xl font-semibold">{item.title}</h3>
                  <p className="mt-2 text-muted-foreground">{item.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section id="pricing" className="py-20 bg-primary text-primary-foreground">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-2xl text-center">
              <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
                Ready to supercharge your productivity?
              </h2>
              <p className="mt-4 text-lg opacity-90">
                Join thousands of professionals who save 10+ hours every week with TaskPilot.
              </p>
              <div className="mt-10">
                <Button size="lg" variant="secondary" asChild>
                  <Link href="/signup">
                    Start Your Free Trial
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  )
}
