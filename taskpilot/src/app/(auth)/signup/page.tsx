"use client"

import Link from "next/link"
import { useState } from "react"
import { useFormState, useFormStatus } from "react-dom"
import { Eye, EyeOff, Loader2, Check, X } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { signUp, type AuthState } from "@/actions/auth"

const passwordRequirements = [
  { label: "At least 8 characters", test: (p: string) => p.length >= 8 },
  { label: "One uppercase letter", test: (p: string) => /[A-Z]/.test(p) },
  { label: "One lowercase letter", test: (p: string) => /[a-z]/.test(p) },
  { label: "One number", test: (p: string) => /\d/.test(p) },
]

export default function SignupPage() {
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [clientError, setClientError] = useState<string | null>(null)
  const [acceptTerms, setAcceptTerms] = useState(false)

  const passwordStrength = passwordRequirements.filter((req) =>
    req.test(password)
  ).length

  const [state, formAction] = useFormState<AuthState, FormData>(signUp, {})

  const handleClientValidation = (e: React.FormEvent<HTMLFormElement>) => {
    if (!acceptTerms) {
      e.preventDefault()
      setClientError("Please accept the terms of service")
      return
    }

    if (passwordStrength < passwordRequirements.length) {
      e.preventDefault()
      setClientError("Please meet all password requirements")
      return
    }

    setClientError(null)
  }

  return (
    <div className="min-h-screen flex">
      {/* Left side - Brand */}
      <div className="hidden lg:flex lg:w-1/2 bg-primary items-center justify-center p-12">
        <div className="max-w-md text-primary-foreground">
          <Link href="/" className="flex items-center space-x-2 mb-8">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary-foreground text-primary font-bold text-xl">
              T
            </div>
            <span className="font-semibold text-2xl">TaskPilot</span>
          </Link>
          <h1 className="text-4xl font-bold mb-4">
            Start delegating tasks today
          </h1>
          <p className="text-lg opacity-90">
            Create your free account and get 10 tasks per month. No credit card required.
          </p>
        </div>
      </div>

      {/* Right side - Form */}
      <div className="flex-1 flex items-center justify-center p-4 sm:p-8">
        <Card className="w-full max-w-md border-0 shadow-none sm:border sm:shadow-sm">
          <CardHeader className="text-center">
            <Link href="/" className="flex items-center justify-center space-x-2 mb-4 lg:hidden">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground font-bold">
                T
              </div>
              <span className="font-semibold text-xl">TaskPilot</span>
            </Link>
            <CardTitle className="text-2xl">Create your account</CardTitle>
            <CardDescription>
              Get started with your free account
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form action={formAction} onSubmit={handleClientValidation} className="space-y-4">
              {(clientError || state.error) && (
                <div className="p-3 text-sm text-destructive bg-destructive/10 rounded-md">
                  {clientError ?? state.error}
                </div>
              )}

              {state.success && !state.error && !clientError && (
                <div className="p-3 text-sm text-green-600 bg-green-500/10 rounded-md">
                  Check your email to confirm your account.
                </div>
              )}

              <SignupFormFields
                password={password}
                onPasswordChange={setPassword}
                showPassword={showPassword}
                onTogglePassword={() => setShowPassword((v) => !v)}
                acceptTerms={acceptTerms}
                onAcceptTermsChange={setAcceptTerms}
                passwordStrength={passwordStrength}
              />
              
              <SignupSubmitButton />

              <div className="relative my-6">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-card px-2 text-muted-foreground">
                    Or continue with
                  </span>
                </div>
              </div>

              <SignupOAuthButtons />
            </form>
            
            <p className="mt-6 text-center text-sm text-muted-foreground">
              Already have an account?{" "}
              <Link href="/login" className="text-primary hover:underline">
                Log in
              </Link>
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

function SignupFormFields({
  password,
  onPasswordChange,
  showPassword,
  onTogglePassword,
  acceptTerms,
  onAcceptTermsChange,
  passwordStrength,
}: {
  password: string
  onPasswordChange: (value: string) => void
  showPassword: boolean
  onTogglePassword: () => void
  acceptTerms: boolean
  onAcceptTermsChange: (value: boolean) => void
  passwordStrength: number
}) {
  const { pending } = useFormStatus()

  return (
    <>
      <div className="space-y-2">
        <Label htmlFor="fullName">Full Name</Label>
        <Input
          id="fullName"
          name="fullName"
          type="text"
          placeholder="John Doe"
          required
          autoComplete="name"
          disabled={pending}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          name="email"
          type="email"
          placeholder="name@example.com"
          required
          autoComplete="email"
          disabled={pending}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="password">Password</Label>
        <div className="relative">
          <Input
            id="password"
            name="password"
            type={showPassword ? "text" : "password"}
            placeholder="Create a password"
            value={password}
            onChange={(e) => onPasswordChange(e.target.value)}
            required
            autoComplete="new-password"
            disabled={pending}
          />
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="absolute right-0 top-0 h-full px-3 hover:bg-transparent"
            onClick={onTogglePassword}
            disabled={pending}
          >
            {showPassword ? (
              <EyeOff className="h-4 w-4 text-muted-foreground" />
            ) : (
              <Eye className="h-4 w-4 text-muted-foreground" />
            )}
          </Button>
        </div>

        {/* Password strength indicator */}
        {password && (
          <div className="mt-3 space-y-2">
            <div className="flex items-center gap-2">
              <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
                <div
                  className={`h-full transition-all ${
                    passwordStrength <= 1
                      ? "bg-destructive w-1/4"
                      : passwordStrength <= 2
                      ? "bg-warning w-2/4"
                      : passwordStrength <= 3
                      ? "bg-warning w-3/4"
                      : "bg-green-500 w-full"
                  }`}
                />
              </div>
              <span className="text-xs text-muted-foreground">
                {passwordStrength <= 1
                  ? "Weak"
                  : passwordStrength <= 2
                  ? "Fair"
                  : passwordStrength <= 3
                  ? "Good"
                  : "Strong"}
              </span>
            </div>
            <ul className="space-y-1">
              {passwordRequirements.map((req) => (
                <li key={req.label} className="flex items-center gap-2 text-xs">
                  {req.test(password) ? (
                    <Check className="h-3 w-3 text-green-500" />
                  ) : (
                    <X className="h-3 w-3 text-muted-foreground" />
                  )}
                  <span
                    className={
                      req.test(password)
                        ? "text-green-500"
                        : "text-muted-foreground"
                    }
                  >
                    {req.label}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      <div className="flex items-start space-x-2">
        <input
          type="checkbox"
          id="terms"
          name="acceptTerms"
          checked={acceptTerms}
          onChange={(e) => onAcceptTermsChange(e.target.checked)}
          className="mt-1 h-4 w-4 rounded border-input"
          disabled={pending}
        />
        <Label htmlFor="terms" className="text-sm font-normal leading-tight">
          I agree to the{" "}
          <Link href="/terms" className="text-primary hover:underline">
            Terms of Service
          </Link>{" "}
          and{" "}
          <Link href="/privacy" className="text-primary hover:underline">
            Privacy Policy
          </Link>
        </Label>
      </div>
    </>
  )
}

function SignupSubmitButton() {
  const { pending } = useFormStatus()

  return (
    <Button type="submit" className="w-full" disabled={pending}>
      {pending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
      Create Account
    </Button>
  )
}

function SignupOAuthButtons() {
  const { pending } = useFormStatus()

  return (
    <div className="grid grid-cols-2 gap-4">
      <Button type="button" variant="outline" disabled={pending}>
        <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24">
          <path
            d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
            fill="#4285F4"
          />
          <path
            d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
            fill="#34A853"
          />
          <path
            d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
            fill="#FBBC05"
          />
          <path
            d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
            fill="#EA4335"
          />
        </svg>
        Google
      </Button>
      <Button type="button" variant="outline" disabled={pending}>
        <svg className="mr-2 h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
          <path
            fillRule="evenodd"
            d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
            clipRule="evenodd"
          />
        </svg>
        GitHub
      </Button>
    </div>
  )
}
