import { createServerClient } from '@supabase/ssr'
import { env } from '@/lib/env'
import { NextRequest, NextResponse } from 'next/server'

// Re-export client function from separate file
export { createSupabaseClient } from './supabase-client'
// Re-export server functions from separate file
export { createSupabaseServerClient, getAuthenticatedUser } from './supabase-server'

// Middleware-compatible Supabase client
export function createSupabaseMiddlewareClient(
  request: NextRequest,
  response: NextResponse
) {
  return createServerClient(
    env.NEXT_PUBLIC_SUPABASE_URL,
    env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => {
            request.cookies.set(name, value)
          })
          response = NextResponse.next({
            request: {
              headers: request.headers,
            },
          })
          cookiesToSet.forEach(({ name, value, options }) => {
            response.cookies.set(name, value, options)
          })
        },
      },
    }
  )
}


