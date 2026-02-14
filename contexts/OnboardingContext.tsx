'use client'

import React, { createContext, useContext, useState, useEffect } from 'react'
import {
  OnboardingState,
  initialOnboardingState,
  WorkspaceConfig,
  EmailSmsConfig,
  ContactFormConfig,
  BookingConfig,
  PostBookingFormsConfig,
  InventoryConfig,
  StaffConfig,
} from '@/lib/onboardingData'
import { supabase } from '@/lib/supabase'
import { createBookingType, createInventoryItem, createStaffMember } from '@/lib/api'
import { useAuth } from '@/contexts/AuthContext'
import { toast } from 'sonner' // Assuming sonner is used for toasts, or console.error if not available. User didn't specify toast lib but package.json has sonner.

interface OnboardingContextType {
  state: OnboardingState
  setCurrentStep: (step: number) => void
  markStepCompleted: (step: keyof OnboardingState['completed']) => void
  updateWorkspace: (config: WorkspaceConfig) => Promise<void>
  updateEmailSms: (config: EmailSmsConfig) => Promise<void>
  updateContactForm: (config: ContactFormConfig) => Promise<void>
  updateBooking: (config: BookingConfig) => Promise<void>
  updatePostBookingForms: (config: PostBookingFormsConfig) => Promise<void>
  updateInventory: (config: InventoryConfig) => Promise<void>
  updateStaff: (config: StaffConfig) => Promise<void>
  activateWorkspace: () => Promise<void>
  resetOnboarding: () => void
  isLoading: boolean
}

const OnboardingContext = createContext<OnboardingContextType | undefined>(
  undefined,
)

export function OnboardingProvider({
  children,
}: {
  children: React.ReactNode
}) {
  const { user } = useAuth()
  const [state, setState] = useState<OnboardingState>(initialOnboardingState)
  const [mounted, setMounted] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const getWorkspaceId = async (): Promise<string | null> => {
    if (!user) return null
    if (user.workspaceId) return user.workspaceId

    // Fallback: fetch from DB if not on user object
    const { data } = await supabase
      .from('users')
      .select('workspace_id')
      .eq('id', user.id)
      .single()

    return data?.workspace_id ?? null
  }

  // Load from localStorage on mount
  useEffect(() => {
    const savedState = localStorage.getItem('onboarding-state')
    if (savedState) {
      try {
        setState(JSON.parse(savedState))
      } catch (error) {
        console.error('Failed to load onboarding state:', error)
      }
    }
    setMounted(true)
  }, [])

  // Save to localStorage whenever state changes
  useEffect(() => {
    if (mounted) {
      localStorage.setItem('onboarding-state', JSON.stringify(state))
    }
  }, [state, mounted])

  const setCurrentStep = (step: number) => {
    setState((prev) => ({ ...prev, currentStep: step }))
  }

  const markStepCompleted = (step: keyof OnboardingState['completed']) => {
    setState((prev) => ({
      ...prev,
      completed: {
        ...prev.completed,
        [step]: true,
      },
    }))
  }

  const updateWorkspace = async (config: WorkspaceConfig) => {
    setIsLoading(true)
    try {
      const workspaceId = await getWorkspaceId()
      if (workspaceId) {
        const { error } = await supabase
          .from('workspaces')
          .update({
            name: config.businessName,
            address: config.address,
            email: config.contactEmail,
            timezone: config.timezone,
          })
          .eq('id', workspaceId)

        if (error) throw error
      }

      setState((prev) => ({
        ...prev,
        workspace: config,
        completed: { ...prev.completed, step1: true },
        currentStep: prev.currentStep + 1
      }))
    } catch (error) {
      console.error('Error updating workspace:', error)
      toast.error('Failed to save workspace details')
    } finally {
      setIsLoading(false)
    }
  }

  const updateEmailSms = async (config: EmailSmsConfig) => {
    setIsLoading(true)
    try {
      const workspaceId = await getWorkspaceId()
      if (workspaceId) {
        const { error } = await supabase
          .from('workspaces')
          .update({
            email_sms_settings: config
          })
          .eq('id', workspaceId)

        if (error) throw error
      }

      setState((prev) => ({
        ...prev,
        emailSms: config,
        completed: { ...prev.completed, step2: true },
      }))
    } catch (error) {
      console.error('Error saving email/sms settings:', error)
      toast.error('Failed to save settings')
    } finally {
      setIsLoading(false)
    }
  }

  const updateContactForm = async (config: ContactFormConfig) => {
    setState((prev) => ({
      ...prev,
      contactForm: config,
      completed: { ...prev.completed, step3: true },
      currentStep: prev.currentStep + 1,
    }))
  }

  const updateBooking = async (config: BookingConfig) => {
    setIsLoading(true)
    try {
      const workspaceId = await getWorkspaceId()
      if (workspaceId) {
        // 1. Insert services into booking_types
        // We probably want to clear existing ones first? Or just add?
        // Onboarding usually implies fresh start.
        // Let's just add them.
        for (const service of config.services) {
          await createBookingType({
            workspace_id: workspaceId,
            name: service.name,
            duration_minutes: service.duration,
            price: null, // Not in onboarding config
            description: null, // Not in onboarding config
            is_active: true
          })
        }

        // 2. Update workspace with availability settings
        const { error } = await supabase
          .from('workspaces')
          .update({
            availability_settings: config.availability
          })
          .eq('id', workspaceId)

        if (error) throw error
      }

      setState((prev) => ({
        ...prev,
        booking: config,
        completed: { ...prev.completed, step4: true },
      }))
    } catch (error) {
      console.error('Error saving booking settings:', error)
      toast.error('Failed to save booking settings')
    } finally {
      setIsLoading(false)
    }
  }

  const updatePostBookingForms = async (config: PostBookingFormsConfig) => {
    setState((prev) => ({
      ...prev,
      postBookingForms: config,
      completed: { ...prev.completed, step5: true },
      currentStep: prev.currentStep + 1,
    }))
  }

  const updateInventory = async (config: InventoryConfig) => {
    setIsLoading(true)
    try {
      const workspaceId = await getWorkspaceId()
      if (workspaceId) {
        for (const item of config.items) {
          await createInventoryItem({
            workspace_id: workspaceId,
            name: item.name,
            quantity: item.quantity,
            reorder_level: item.lowStockThreshold,
            category: null, // Not in onboarding config
            is_active: true,
            expiry_date: null,
            location: null,
            sku: null,
            supplier: null,
            unit_price: null
          })
        }
      }

      setState((prev) => ({
        ...prev,
        inventory: config,
        completed: { ...prev.completed, step6: true },
      }))
    } catch (error) {
      console.error('Error saving inventory:', error)
      toast.error('Failed to save inventory')
    } finally {
      setIsLoading(false)
    }
  }

  const updateStaff = async (config: StaffConfig) => {
    setIsLoading(true)
    try {
      const workspaceId = await getWorkspaceId()
      if (workspaceId) {
        for (const member of config.members) {
          await createStaffMember({
            workspace_id: workspaceId,
            email: member.email,
            name: member.name || '', // handle optional name
            status: 'pending_invitation',
            permissions: member.permissions,
            user_id: null,
            accepted_at: null,
            invitation_expires_at: null,
            invitation_token: null
          })
        }
      }

      setState((prev) => ({
        ...prev,
        staff: config,
        completed: { ...prev.completed, step7: true },
      }))
    } catch (error) {
      console.error('Error saving staff:', error)
      toast.error('Failed to save staff members')
    } finally {
      setIsLoading(false)
    }
  }

  const activateWorkspace = async () => {
    setIsLoading(true)
    try {
      const workspaceId = await getWorkspaceId()
      if (workspaceId) {
        const { error } = await supabase
          .from('workspaces')
          .update({
            onboarding_completed: true
          })
          .eq('id', workspaceId)

        if (error) throw error
      }

      setState((prev) => ({
        ...prev,
        workspaceActivated: true,
        completed: { ...prev.completed, step8: true },
      }))

      // Clear onboarding state and redirect to dashboard
      localStorage.removeItem('onboarding-state')
      window.location.href = '/dashboard/owner'
    } catch (error) {
      console.error('Error activating workspace:', error)
      toast.error('Failed to activate workspace')
    } finally {
      setIsLoading(false)
    }
  }

  const resetOnboarding = () => {
    setState(initialOnboardingState)
    localStorage.removeItem('onboarding-state')
  }

  const value: OnboardingContextType = {
    state,
    setCurrentStep,
    markStepCompleted,
    updateWorkspace,
    updateEmailSms,
    updateContactForm,
    updateBooking,
    updatePostBookingForms, // Added missing method
    updateInventory,
    updateStaff,
    activateWorkspace,
    resetOnboarding,
    isLoading
  }

  return (
    <OnboardingContext.Provider value={value}>
      {children}
    </OnboardingContext.Provider>
  )
}

export function useOnboarding() {
  const context = useContext(OnboardingContext)
  if (!context) {
    throw new Error('useOnboarding must be used within OnboardingProvider')
  }
  return context
}
