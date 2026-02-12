'use client'

import React, { createContext, useContext, useEffect, useState } from 'react'
import type { AuthContextType, User } from '@/types'
import { supabase } from '@/lib/supabase'
import { createWorkspace, createUser } from '@/lib/api'
import { getSavedUser, removeUser, saveUser, validateLogin, validateSignup } from '@/lib/auth'

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Restore user from localStorage on mount and check Supabase session
  useEffect(() => {
    const initAuth = async () => {
      try {
        // Check for existing Supabase session
        const { data: { session }, error: sessionError } = await supabase.auth.getSession()
        
        if (sessionError) {
          console.error('[v0] Session error:', sessionError)
        }

        if (session?.user) {
          // User has active session, fetch their data from database
          const { data: userData, error: userError } = await supabase
            .from('users')
            .select('*')
            .eq('id', session.user.id)
            .single()

          if (userError) {
            console.error('[v0] Error fetching user data:', userError)
          } else if (userData) {
            const mappedUser: User = {
              id: userData.id,
              email: userData.email,
              name: userData.name,
              role: userData.role as 'ADMIN' | 'STAFF' | 'NONE',
              createdAt: new Date(userData.created_at),
            }
            setUser(mappedUser)
            saveUser(mappedUser)
          }
        } else {
          // Fall back to localStorage if no active session
          const savedUser = getSavedUser()
          if (savedUser) {
            setUser(savedUser)
          }
        }
      } catch (err) {
        console.error('[v0] Auth initialization error:', err)
      } finally {
        setIsLoading(false)
      }
    }

    initAuth()
  }, [])

  const login = async (email: string, password: string) => {
    setIsLoading(true)
    setError(null)
    try {
      // Try Supabase auth first
      const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (authError) {
        // Fall back to mock validation for demo
        const loggedInUser = await validateLogin(email, password)
        if (!loggedInUser) {
          throw new Error('Invalid email or password')
        }
        setUser(loggedInUser)
        saveUser(loggedInUser)
      } else if (authData.user) {
        // Fetch user data from database
        const { data: userData, error: userError } = await supabase
          .from('users')
          .select('*')
          .eq('id', authData.user.id)
          .single()

        if (userError) throw userError

        const mappedUser: User = {
          id: userData.id,
          email: userData.email,
          name: userData.name,
          role: userData.role as 'ADMIN' | 'STAFF' | 'NONE',
          createdAt: new Date(userData.created_at),
        }
        setUser(mappedUser)
        saveUser(mappedUser)
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
      // Try Supabase signup first
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            name,
          },
        },
      })

      if (authError) {
        // Fall back to mock signup for demo
        const newUser = await validateSignup(email, password, name, 'STAFF')
        setUser(newUser)
        saveUser(newUser)
      } else if (authData.user) {
        // Create workspace for new user
        const slug = email.split('@')[0].toLowerCase()
        const workspace = await createWorkspace({
          name: `${name}'s Workspace`,
          email,
          slug: `${slug}-${Date.now()}`,
          timezone: 'UTC',
        })

        // Create user record in database
        const userData = await createUser({
          workspace_id: workspace.id,
          email,
          name,
          role: 'admin',
          status: 'active',
        })

        const mappedUser: User = {
          id: userData.id,
          email: userData.email,
          name: userData.name,
          role: userData.role as 'ADMIN' | 'STAFF' | 'NONE',
          createdAt: new Date(userData.created_at),
        }
        setUser(mappedUser)
        saveUser(mappedUser)
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
      // Sign out from Supabase
      const { error } = await supabase.auth.signOut()
      if (error) console.error('[v0] Logout error:', error)
      
      setUser(null)
      removeUser()
    } catch (err) {
      console.error('[v0] Logout failed:', err)
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
