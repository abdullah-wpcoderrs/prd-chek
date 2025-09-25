"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useAuth } from "@/lib/hooks/useAuth"
import { Mail, AlertCircle, RefreshCw } from "lucide-react"
import { User } from "@supabase/supabase-js"

interface EmailVerificationProps {
  user: User | null
}

export default function EmailVerification({ user }: EmailVerificationProps) {
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState("")
  const [error, setError] = useState("")
  
  const { resendConfirmation } = useAuth()
  
  const isVerified = user?.email_confirmed_at ? true : false

  const handleResendVerification = async () => {
    if (!user?.email) return

    setLoading(true)
    setError("")
    setMessage("")

    try {
      const { error } = await resendConfirmation(user.email)
      
      if (error) {
        setError(error.message)
      } else {
        setMessage("Verification email sent! Check your inbox.")
      }
    } catch {
      setError("Failed to send verification email")
    } finally {
      setLoading(false)
    }
  }

  // Don't show anything if email is verified
  if (isVerified) {
    return null
  }

  return (
    <Card className="border-yellow-200 bg-yellow-50">
      <CardHeader className="pb-3">
        <div className="flex items-center gap-2">
          <AlertCircle className="w-5 h-5 text-yellow-600" />
          <CardTitle className="text-yellow-900 text-base">Email Verification Required</CardTitle>
        </div>
        <CardDescription className="text-yellow-700">
          Please verify your email address to access all features
        </CardDescription>
      </CardHeader>
      <CardContent className="pt-0">
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-3 py-2 rounded text-sm mb-3">
            {error}
          </div>
        )}

        {message && (
          <div className="bg-green-50 border border-green-200 text-green-700 px-3 py-2 rounded text-sm mb-3">
            {message}
          </div>
        )}

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-sm text-yellow-700">
            <Mail className="w-4 h-4" />
            <span>{user?.email}</span>
          </div>
          
          <Button
            onClick={handleResendVerification}
            disabled={loading}
            size="sm"
            variant="outline"
            className="text-yellow-700 border-yellow-300 hover:bg-yellow-100"
          >
            {loading ? (
              <>
                <RefreshCw className="w-3 h-3 mr-1 animate-spin" />
                Sending...
              </>
            ) : (
              <>
                <Mail className="w-3 h-3 mr-1" />
                Resend Email
              </>
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}