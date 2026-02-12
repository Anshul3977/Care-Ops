'use client'

import { useOnboarding } from '@/contexts/OnboardingContext'
import { useRouter } from 'next/navigation'
import { OnboardingLayout } from '@/components/onboarding/OnboardingLayout'
import { Step1CreateWorkspace } from '@/components/onboarding/steps/Step1CreateWorkspace'
import { Step2EmailSMS } from '@/components/onboarding/steps/Step2EmailSMS'
import { Step3ContactForm } from '@/components/onboarding/steps/Step3ContactForm'
import { Step4BookingSetup } from '@/components/onboarding/steps/Step4BookingSetup'
import { Step5PostBookingForms } from '@/components/onboarding/steps/Step5PostBookingForms'
import { Step6Inventory } from '@/components/onboarding/steps/Step6Inventory'
import { Step7StaffManagement } from '@/components/onboarding/steps/Step7StaffManagement'
import { Step8Activate } from '@/components/onboarding/steps/Step8Activate'

const steps = [
  Step1CreateWorkspace,
  Step2EmailSMS,
  Step3ContactForm,
  Step4BookingSetup,
  Step5PostBookingForms,
  Step6Inventory,
  Step7StaffManagement,
  Step8Activate,
]

export default function OnboardingPage() {
  const { state, setCurrentStep } = useOnboarding()
  const router = useRouter()
  const currentStep = state.currentStep

  // Redirect if workspace already activated
  if (state.workspaceActivated) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold text-foreground">
            Welcome to CareOps!
          </h1>
          <p className="text-lg text-muted-foreground">
            Your workspace has been successfully activated.
          </p>
          <button
            onClick={() => router.push('/dashboard/owner')}
            className="inline-block px-6 py-2 bg-primary text-primary-foreground rounded-lg hover:opacity-90 transition-opacity"
          >
            Go to Dashboard
          </button>
        </div>
      </div>
    )
  }

  const CurrentStep = steps[currentStep - 1]

  // Determine if user can proceed to next step
  const canProceed = (() => {
    if (currentStep === 1) return state.workspace !== null
    if (currentStep === 2) return state.emailSms !== null
    if (currentStep === 3) return state.contactForm !== null
    if (currentStep === 4) return state.booking !== null
    if (currentStep === 8) return true // Step 8 doesn't require validation
    return true
  })()

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
    }
  }

  const handleNext = () => {
    if (currentStep < 8) {
      setCurrentStep(currentStep + 1)
    } else if (currentStep === 8) {
      // Handled by Step8Activate component
    }
  }

  return (
    <OnboardingLayout
      step={currentStep}
      onBack={handleBack}
      onNext={handleNext}
      canProceed={canProceed}
    >
      <CurrentStep />
    </OnboardingLayout>
  )
}
