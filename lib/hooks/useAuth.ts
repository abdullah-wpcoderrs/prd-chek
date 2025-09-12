"use client"

import { useSupabase } from "./useSupabase"
import { useEffect, useState } from "react"
import { User } from "@supabase/supabase-js"
import { useRouter } from "next/navigation"

export function useAuth() {
  const supabase = useSupabase()
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    // Get initial session
    const getInitialSession = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      setUser(session?.user ?? null)
      setLoading(false)
    }

    getInitialSession()

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        setUser(session?.user ?? null)
        setLoading(false)
        
        // Handle sign out event
        if (event === 'SIGNED_OUT') {
          router.push('/')
        }
      }
    )

    return () => subscription.unsubscribe()
  }, [supabase.auth, router])

  return {
    user,
    loading,
    signOut: () => supabase.auth.signOut(),
    signIn: (email: string, password: string) => 
      supabase.auth.signInWithPassword({ email, password }),
    signUp: (email: string, password: string) => 
      supabase.auth.signUp({ email, password }),
    signInWithOAuth: (provider: 'google' | 'github') =>
      supabase.auth.signInWithOAuth({ 
        provider,
        options: {
          redirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/dashboard`
        }
      }),
    resetPassword: (email: string) =>
      supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/reset-password`
      }),
    changePassword: (newPassword: string) =>
      supabase.auth.updateUser({ password: newPassword }),
    updateProfile: (updates: { email?: string; data?: any }) =>
      supabase.auth.updateUser(updates),
    resendConfirmation: (email: string) =>
      supabase.auth.resend({ 
        type: 'signup',
        email: email
      }),
    refreshSession: () => supabase.auth.refreshSession()
  }
}