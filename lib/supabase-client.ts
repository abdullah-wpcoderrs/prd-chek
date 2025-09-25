import { createBrowserClient } from '@supabase/ssr'
import { env } from '@/lib/env'

// Client-side Supabase client for browser usage
export function createSupabaseClient() {
  return createBrowserClient(
    env.NEXT_PUBLIC_SUPABASE_URL as string,
    env.NEXT_PUBLIC_SUPABASE_ANON_KEY as string
  )
}