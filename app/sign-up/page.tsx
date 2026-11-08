"use client"

import Link from "next/link"
import { type ChangeEvent, type FormEvent, useState } from "react"

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

import { Eye, EyeOff, Loader2 } from "lucide-react"
import { authClient } from "@/lib/auth-client"
import { useRouter } from "next/navigation"
import { toast } from "sonner"

const SignUpPage = () => {
  const router = useRouter()
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  })

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    // Password validation
    if (formData.password.length < 8) {
      toast.error("Password must be at least 8 characters.")
      return
    }

    // Confirm password validation
    if (formData.password !== formData.confirmPassword) {
      toast.error("Passwords do not match.")
      return
    }

    setIsLoading(true)

    try {
      const { data, error } = await authClient.signUp.email({
        email: formData.email,
        password: formData.password,
        name: formData.name,
        callbackURL: "/",
      })

      if (data) {
        toast.success("Account created successfully.")
        router.push("/")
        router.refresh()
      }
      if (error) {
        toast.error(error.message || "Unable to create your account.")
      }
    } catch {
      toast.error("Unable to create your account. Please try again.")
    }

    setIsLoading(false)
  }

  const handleGoogleSignUp = async () => {
    setIsLoading(true)
    try {
      await authClient.signIn.social({
        provider: "google",
        callbackURL: "/",
      })
    } catch {
      toast.error("Google sign up is unavailable. Please try email sign up.")
      setIsLoading(false)
    }
  }

  return (
    <div className="relative flex min-h-[calc(100vh-4rem)] items-center justify-center overflow-hidden bg-[#f7fafb] px-4 py-8 sm:px-6 lg:px-8">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -top-32 -right-24 size-72 rounded-full bg-[#0092B8]/10 blur-3xl" />
        <div className="absolute -bottom-32 -left-24 size-80 rounded-full bg-[#007D9D]/8 blur-3xl" />
      </div>

      <Card className="relative w-full max-w-[920px] gap-0 rounded-3xl border-white/80 bg-white/95 py-0 shadow-[0_24px_70px_-20px_rgba(15,23,42,0.22)] backdrop-blur-sm md:grid md:grid-cols-[0.82fr_1.18fr]">
        <div className="hidden flex-col justify-between overflow-hidden rounded-l-3xl bg-[#063b49] p-10 text-white md:flex">
          <div>
            <p className="text-sm font-semibold tracking-[0.18em] text-[#7edcf4] uppercase">
              Wanderlust
            </p>
            <h2 className="mt-5 max-w-xs text-3xl leading-tight font-semibold">
              Start planning journeys worth remembering.
            </h2>
          </div>
          <div className="rounded-2xl border border-white/10 bg-white/8 p-5 backdrop-blur-sm">
            <p className="text-sm leading-6 text-white/75">
              Save destinations, organize your ideas, and turn every trip into a
              seamless experience.
            </p>
          </div>
        </div>

        <CardContent className="p-5 sm:p-8 md:p-10">
          <CardHeader className="space-y-1.5 p-0 text-left">
            <CardTitle className="text-2xl font-semibold tracking-tight text-slate-950 sm:text-3xl">
              Create your account
            </CardTitle>
            <CardDescription className="text-sm leading-6 text-slate-500 sm:text-base">
              Join Wanderlust and start exploring your next adventure.
            </CardDescription>
          </CardHeader>

          <form
            onSubmit={handleSubmit}
            className="mt-7 grid gap-5 sm:grid-cols-2"
          >
            <div className="space-y-2 sm:col-span-2">
              <Label
                htmlFor="name"
                className="text-sm font-semibold text-slate-700"
              >
                Full Name
              </Label>
              <Input
                id="name"
                name="name"
                type="text"
                placeholder="Enter your full name"
                value={formData.name}
                onChange={handleChange}
                required
                minLength={2}
                autoComplete="name"
                className="h-11 rounded-xl border-slate-200 bg-slate-50/70 px-3.5 text-base shadow-none transition-all focus-visible:border-[#0092B8] focus-visible:bg-white focus-visible:ring-[#0092B8]/15 md:text-sm"
              />
            </div>

            <div className="space-y-2 sm:col-span-2">
              <Label
                htmlFor="email"
                className="text-sm font-semibold text-slate-700"
              >
                Email Address
              </Label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="you@example.com"
                value={formData.email}
                onChange={handleChange}
                required
                autoComplete="email"
                className="h-11 rounded-xl border-slate-200 bg-slate-50/70 px-3.5 text-base shadow-none transition-all focus-visible:border-[#0092B8] focus-visible:bg-white focus-visible:ring-[#0092B8]/15 md:text-sm"
              />
            </div>

            <div className="space-y-2">
              <Label
                htmlFor="password"
                className="text-sm font-semibold text-slate-700"
              >
                Password
              </Label>
              <div className="relative">
                <Input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="At least 8 characters"
                  value={formData.password}
                  onChange={handleChange}
                  className="h-11 rounded-xl border-slate-200 bg-slate-50/70 px-3.5 pr-11 text-base shadow-none transition-all focus-visible:border-[#0092B8] focus-visible:bg-white focus-visible:ring-[#0092B8]/15 md:text-sm"
                  minLength={8}
                  autoComplete="new-password"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute top-1/2 right-3 -translate-y-1/2 rounded-md p-1 text-slate-400 transition-colors hover:text-slate-700 focus-visible:ring-2 focus-visible:ring-[#0092B8]/40 focus-visible:outline-none"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <div className="space-y-2">
              <Label
                htmlFor="confirmPassword"
                className="text-sm font-semibold text-slate-700"
              >
                Confirm Password
              </Label>
              <div className="relative">
                <Input
                  id="confirmPassword"
                  name="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder="Confirm password"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className="h-11 rounded-xl border-slate-200 bg-slate-50/70 px-3.5 pr-11 text-base shadow-none transition-all focus-visible:border-[#0092B8] focus-visible:bg-white focus-visible:ring-[#0092B8]/15 md:text-sm"
                  autoComplete="new-password"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute top-1/2 right-3 -translate-y-1/2 rounded-md p-1 text-slate-400 transition-colors hover:text-slate-700 focus-visible:ring-2 focus-visible:ring-[#0092B8]/40 focus-visible:outline-none"
                  aria-label={
                    showConfirmPassword
                      ? "Hide confirm password"
                      : "Show confirm password"
                  }
                >
                  {showConfirmPassword ? (
                    <EyeOff size={18} />
                  ) : (
                    <Eye size={18} />
                  )}
                </button>
              </div>
            </div>

            <Button
              type="submit"
              size="lg"
              className="h-11 w-full rounded-xl bg-[#0092B8] text-sm font-semibold shadow-[0_10px_24px_-10px_rgba(0,146,184,0.8)] transition-all hover:-translate-y-0.5 hover:bg-[#007D9D] hover:shadow-[0_14px_28px_-10px_rgba(0,146,184,0.85)] sm:col-span-2"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Creating Account...
                </>
              ) : (
                "Create Account"
              )}
            </Button>
          </form>

          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-slate-200" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-white px-3 font-semibold tracking-[0.16em] text-slate-400">
                Or continue with
              </span>
            </div>
          </div>

          <Button
            type="button"
            variant="outline"
            size="lg"
            disabled={isLoading}
            className="h-11 w-full rounded-xl border-slate-200 bg-white text-sm font-semibold text-slate-700 shadow-sm transition-all hover:-translate-y-0.5 hover:border-slate-300 hover:bg-slate-50 hover:text-slate-950"
            onClick={handleGoogleSignUp}
          >
            <svg viewBox="0 0 48 48" className="h-5 w-5" aria-hidden="true">
              <path
                fill="#EA4335"
                d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 3.05 13.22l7.98 6.19C12.91 13.72 18.01 9.5 24 9.5z"
              />
              <path
                fill="#4285F4"
                d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.77 7.18l7.73 6C44.4 37.98 46.98 31.92 46.98 24.55z"
              />
              <path
                fill="#FBBC05"
                d="M10.03 28.59A14.4 14.4 0 0 1 9.25 24c0-1.59.27-3.13.77-4.59l-7.98-6.19A23.9 23.9 0 0 0 0 24c0 3.87.93 7.53 2.57 10.78l7.46-6.19z"
              />
              <path
                fill="#34A853"
                d="M24 48c6.47 0 11.93-2.13 15.9-5.8l-7.73-6c-2.14 1.44-4.88 2.3-8.17 2.3-5.99 0-11.09-4.22-12.97-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"
              />
            </svg>
            Continue with Google
          </Button>

          <p className="mt-6 text-center text-sm text-slate-500">
            Already have an account?{" "}
            <Link
              href="/sign-in"
              className="font-semibold text-[#0092B8] underline-offset-4 transition-colors hover:text-[#007D9D] hover:underline"
            >
              Sign In
            </Link>
          </p>
        </CardContent>
      </Card>
    </div>
  )
}

export default SignUpPage
