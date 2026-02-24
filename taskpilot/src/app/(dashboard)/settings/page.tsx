import { Metadata } from "next"
import Link from "next/link"
import { User, CreditCard, Bell, Shield, Palette } from "lucide-react"
import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"

export const metadata: Metadata = {
  title: "Settings | TaskPilot",
  description: "Manage your account settings and preferences",
}

const settingsNav = [
  {
    title: "Profile",
    description: "Update your personal information and avatar",
    href: "/settings/profile",
    icon: User,
  },
  {
    title: "Subscription",
    description: "Manage your plan, billing, and usage",
    href: "/settings/subscription",
    icon: CreditCard,
  },
  {
    title: "Notifications",
    description: "Configure email and push notifications",
    href: "/settings/notifications",
    icon: Bell,
  },
  {
    title: "Security",
    description: "Password, two-factor authentication, and sessions",
    href: "/settings/security",
    icon: Shield,
  },
  {
    title: "Appearance",
    description: "Customize theme and display preferences",
    href: "/settings/appearance",
    icon: Palette,
  },
]

export default function SettingsPage() {
  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-bold">Settings</h1>
        <p className="text-muted-foreground mt-1">
          Manage your account settings and preferences
        </p>
      </div>
      
      {/* Settings Navigation Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {settingsNav.map((item) => (
          <Link key={item.href} href={item.href}>
            <Card className="h-full hover:border-primary/50 hover:shadow-md transition-all cursor-pointer">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                    <item.icon className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <CardTitle className="text-lg">{item.title}</CardTitle>
                    <CardDescription className="mt-1">
                      {item.description}
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  )
}
