import { createBrowserClient } from '@supabase/ssr'
import { env } from '@/lib/env'

// Client-side Supabase client for browser usage
export function createSupabaseClient() {
  return createBrowserClient(
    env.NEXT_PUBLIC_SUPABASE_URL,
    env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  )
}