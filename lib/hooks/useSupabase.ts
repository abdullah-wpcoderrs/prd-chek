"use client"

import { createSupabaseClient } from "@/lib/supabase-client"
import { useMemo, useEffect, useState } from "react"

// Client-side hook for Supabase with native auth and connection monitoring
export function useSupabase() {
  const [isConnected, setIsConnected] = useState(true)
  const [lastError, setLastError] = useState<string | null>(null)
  
  const supabase = useMemo(() => {
    return createSupabaseClient()
  }, [])

  useEffect(() => {
    // Monitor Supabase connection status
    const channel = supabase.channel('connection_monitor')
    
    channel
      .on('system', { event: 'postgres_changes_connected' }, () => {
        setIsConnected(true)
        setLastError(null)
      })
      .on('system', { event: 'postgres_changes_disconnected' }, () => {
        setIsConnected(false)
        setLastError('Database connection lost')
      })
      .on('system', { event: 'postgres_changes_error' }, (error) => {
        setIsConnected(false)
        setLastError(error.message || 'Database connection error')
      })
      .subscribe()

    // Test connection periodically
    const testConnection = async () => {
      try {
        const { error } = await supabase.from('projects').select('id').limit(1)
        if (error) {
          setIsConnected(false)
          setLastError(error.message)
        } else {
          setIsConnected(true)
          setLastError(null)
        }
      } catch (err) {
        setIsConnected(false)
        setLastError('Network error')
      }
    }

    // Test connection every 30 seconds
    const interval = setInterval(testConnection, 30000)
    
    // Initial connection test
    testConnection()

    return () => {
      clearInterval(interval)
      channel.unsubscribe()
    }
  }, [supabase])

  return Object.assign(supabase, {
    connectionStatus: {
      isConnected,
      lastError
    }
  })
}