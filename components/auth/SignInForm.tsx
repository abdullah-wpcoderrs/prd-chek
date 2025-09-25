"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card } from "@/components/ui/card"
import { useAuth } from "@/lib/hooks/useAuth"
import { useRouter, useSearchParams } from "next/navigation"
import Link from "next/link"

export default function SignInForm() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [message, setMessage] = useState("")
  
  const { signIn, signInWithOAuth } = useAuth()
  const router = useRouter()
  const searchParams = useSearchParams()
  const redirectTo = searchParams.get("redirectTo") || "/dashboard"

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email || !password) return

    setLoading(true)
    setError("")
    setMessage("")

    try {
      const { error } = await signIn(email, password)
      if (error) {
        setError(error.message)
      } else {
        setMessage("Sign in successful! Redirecting...")
        // Immediate redirect
        router.push(redirectTo)
      }
    } catch {
      setError("An unexpected error occurred")
    } finally {
      setLoading(false)
    }
  }

  const handleOAuthSignIn = async (provider: 'google' | 'github') => {
    try {
      await signInWithOAuth(provider)
    } catch {
      setError("OAuth sign in failed")
    }
  }

  return (
    <Card className="w-full max-w-md mx-auto p-6">
      <div className="space-y-6">
        <div className="text-center">
          <h1 className="text-2xl font-bold">Welcome back</h1>
          <p className="text-gray-600">Sign in to your account</p>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
            {error}
          </div>
        )}

        {message && (
          <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded">
            {message}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              required
            />
          </div>

          <Button
            type="submit"
            className="w-full"
            disabled={loading || !email || !password}
          >
            {loading ? "Signing in..." : "Sign in"}
          </Button>
        </form>

        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-background px-2 text-muted-foreground">
              Or continue with
            </span>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <Button
            variant="outline"
            onClick={() => handleOAuthSignIn('google')}
            disabled={loading}
          >
            Google
          </Button>
          <Button
            variant="outline"
            onClick={() => handleOAuthSignIn('github')}
            disabled={loading}
          >
            GitHub
          </Button>
        </div>

        <div className="text-center text-sm">
          <span className="text-gray-600">Don&apos;t have an account? </span>
          <Link href="/sign-up" className="text-primary hover:underline">
            Sign up
          </Link>
        </div>

        <div className="text-center text-sm">
          <Link href="/forgot-password" className="text-primary hover:underline">
            Forgot your password?
          </Link>
        </div>
      </div>
    </Card>
  )
}