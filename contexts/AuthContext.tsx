'use client'

import React, { createContext, useContext, useEffect, useState } from 'react'
import type { AuthContextType, User, UserRole } from '@/types'
import { supabase } from '@/lib/supabase'
import { createWorkspace, createUser } from '@/lib/api'
import { AuthChangeEvent, Session } from '@supabase/supabase-js'

// Map DB lowercase roles to frontend uppercase UserRole
function mapDbRole(dbRole: string): UserRole {
  const map: Record<string, UserRole> = { admin: 'ADMIN', staff: 'STAFF', viewer: 'VIEWER' }
  return map[dbRole] || 'NONE'
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Check Supabase session on mount
  useEffect(() => {
    const initAuth = async () => {
      try {
        // Check for existing Supabase session
        const { data: { session }, error: sessionError } = await supabase.auth.getSession()

        if (sessionError) {
          console.error('[Auth] Session error:', sessionError)
          // Don't throw here, just let it fail gracefully (user defaults to null)
        }

        if (session?.user) {
          // User has active session, fetch their data from database
          const { data: userData, error: userError } = await supabase
            .from('users')
            .select('*')
            .eq('id', session.user.id)
            .single()

          if (userError) {
            console.error('[Auth] Error fetching user data:', userError)
          } else if (userData) {
            const mappedUser: User = {
              id: userData.id,
              email: userData.email,
              name: userData.name,
              role: mapDbRole(userData.role),
              workspaceId: userData.workspace_id,
              createdAt: new Date(userData.created_at),
            }
            setUser(mappedUser)
          }
        }
      } catch (err) {
        console.error('[Auth] Auth initialization error:', err)
      } finally {
        setIsLoading(false)
      }
    }

    initAuth()

    // Listen for auth state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event: AuthChangeEvent, session: Session | null) => {
      if (event === 'SIGNED_OUT') {
        setUser(null)
      } else if (event === 'SIGNED_IN' && session?.user && !user) {
        // Optionally refetch user here if needed, but usually login sets it
        // This serves as a backup or for other tab updates
        const { data: userData } = await supabase
          .from('users')
          .select('*')
          .eq('id', session.user.id)
          .single()

        if (userData) {
          setUser({
            id: userData.id,
            email: userData.email,
            name: userData.name,
            role: mapDbRole(userData.role),
            workspaceId: userData.workspace_id,
            createdAt: new Date(userData.created_at),
          })
        }
      }
    })

    return () => {
      subscription.unsubscribe()
    }
  }, []) // Remove user dependency to avoid loops

  const login = async (email: string, password: string) => {
    setIsLoading(true)
    setError(null)
    try {
      const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (authError) {
        throw new Error(authError.message)
      }

      if (authData.user) {
        // Fetch user data from database
        const { data: userData, error: userError } = await supabase
          .from('users')
          .select('*')
          .eq('id', authData.user.id)
          .single()

        if (userError) {
          // Check if it's a "not found" error which might happen if auth exists but user record doesn't
          throw new Error('User record not found. Please contact support.')
        }

        const mappedUser: User = {
          id: userData.id,
          email: userData.email,
          name: userData.name,
          role: mapDbRole(userData.role),
          workspaceId: userData.workspace_id,
          createdAt: new Date(userData.created_at),
        }
        setUser(mappedUser)
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Login failed'
      setError(message)
      throw err
    } finally {
      setIsLoading(false)
    }
  }

  const signup = async (email: string, password: string, name: string) => {
    setIsLoading(true)
    setError(null)
    try {
      // Call server-side API route (uses admin client to bypass RLS)
      const response = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email,
          password,
          name,
          timezone: Intl.DateTimeFormat().resolvedOptions().timeZone || 'UTC',
        }),
      })

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.error || 'Signup failed')
      }

      // Sign in with the newly created credentials to establish a client session
      const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (signInError) {
        throw new Error(signInError.message)
      }

      if (signInData.user && result.user) {
        const mappedUser: User = {
          id: result.user.id,
          email: result.user.email,
          name: result.user.name,
          role: mapDbRole(result.user.role),
          workspaceId: result.user.workspace_id,
          createdAt: new Date(result.user.created_at),
        }
        setUser(mappedUser)
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Signup failed'
      setError(message)
      throw err
    } finally {
      setIsLoading(false)
    }
  }

  const logout = async () => {
    setIsLoading(true)
    try {
      const { error } = await supabase.auth.signOut()
      if (error) console.error('[Auth] Logout error:', error)

      setUser(null)
    } catch (err) {
      console.error('[Auth] Logout failed:', err)
    } finally {
      setIsLoading(false)
    }
  }

  const value: AuthContextType = {
    user,
    isLoading,
    error,
    login,
    signup,
    logout,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
