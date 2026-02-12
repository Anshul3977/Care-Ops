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

interface OnboardingContextType {
  state: OnboardingState
  setCurrentStep: (step: number) => void
  markStepCompleted: (step: keyof OnboardingState['completed']) => void
  updateWorkspace: (config: WorkspaceConfig) => void
  updateEmailSms: (config: EmailSmsConfig) => void
  updateContactForm: (config: ContactFormConfig) => void
  updateBooking: (config: BookingConfig) => void
  updatePostBookingForms: (config: PostBookingFormsConfig) => void
  updateInventory: (config: InventoryConfig) => void
  updateStaff: (config: StaffConfig) => void
  activateWorkspace: () => void
  resetOnboarding: () => void
}

const OnboardingContext = createContext<OnboardingContextType | undefined>(
  undefined,
)

export function OnboardingProvider({
  children,
}: {
  children: React.ReactNode
}) {
  const [state, setState] = useState<OnboardingState>(initialOnboardingState)
  const [mounted, setMounted] = useState(false)

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

  const updateWorkspace = (config: WorkspaceConfig) => {
    setState((prev) => ({
      ...prev,
      workspace: config,
      completed: { ...prev.completed, step1: true },
    }))
  }

  const updateEmailSms = (config: EmailSmsConfig) => {
    setState((prev) => ({
      ...prev,
      emailSms: config,
      completed: { ...prev.completed, step2: true },
    }))
  }

  const updateContactForm = (config: ContactFormConfig) => {
    setState((prev) => ({
      ...prev,
      contactForm: config,
      completed: { ...prev.completed, step3: true },
    }))
  }

  const updateBooking = (config: BookingConfig) => {
    setState((prev) => ({
      ...prev,
      booking: config,
      completed: { ...prev.completed, step4: true },
    }))
  }

  const updatePostBookingForms = (config: PostBookingFormsConfig) => {
    setState((prev) => ({
      ...prev,
      postBookingForms: config,
      completed: { ...prev.completed, step5: true },
    }))
  }

  const updateInventory = (config: InventoryConfig) => {
    setState((prev) => ({
      ...prev,
      inventory: config,
      completed: { ...prev.completed, step6: true },
    }))
  }

  const updateStaff = (config: StaffConfig) => {
    setState((prev) => ({
      ...prev,
      staff: config,
      completed: { ...prev.completed, step7: true },
    }))
  }

  const activateWorkspace = () => {
    setState((prev) => ({
      ...prev,
      workspaceActivated: true,
      completed: { ...prev.completed, step8: true },
    }))
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
    updatePostBookingForms,
    updateInventory,
    updateStaff,
    activateWorkspace,
    resetOnboarding,
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
