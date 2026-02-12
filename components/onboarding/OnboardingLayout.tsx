'use client'

import { useOnboarding } from '@/contexts/OnboardingContext'
import { Progress } from '@/components/ui/progress'
import { Button } from '@/components/ui/button'
import { ChevronLeft, ChevronRight } from 'lucide-react'

interface OnboardingLayoutProps {
  children: React.ReactNode
  step: number
  onBack: () => void
  onNext: () => void
  canProceed: boolean
  showBackButton?: boolean
}

export function OnboardingLayout({
  children,
  step,
  onBack,
  onNext,
  canProceed,
  showBackButton = true,
}: OnboardingLayoutProps) {
  const { state } = useOnboarding()
  const progressPercentage = (step / 8) * 100

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Progress Bar */}
      <div className="border-b border-border bg-card sticky top-0 z-40">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-2xl font-bold text-foreground">
                Setup Your Workspace
              </h1>
              <p className="text-sm text-muted-foreground mt-1">
                Step {step} of 8
              </p>
            </div>
          </div>
          <Progress value={progressPercentage} className="h-2" />
        </div>
      </div>

      {/* Content */}
      <div className="flex-1">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {children}
        </div>
      </div>

      {/* Navigation */}
      <div className="border-t border-border bg-card">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex items-center justify-between">
          <Button
            variant="outline"
            onClick={onBack}
            disabled={step === 1}
            className="gap-2"
          >
            <ChevronLeft className="w-4 h-4" />
            Back
          </Button>

          <div className="flex items-center gap-2">
            {Array.from({ length: 8 }).map((_, idx) => (
              <div
                key={idx}
                className={`h-2 w-2 rounded-full transition-colors ${
                  idx + 1 <= step ? 'bg-primary' : 'bg-border'
                }`}
              />
            ))}
          </div>

          <Button
            onClick={onNext}
            disabled={!canProceed}
            className="gap-2"
          >
            {step === 8 ? 'Activate' : 'Next'}
            {step < 8 && <ChevronRight className="w-4 h-4" />}
          </Button>
        </div>
      </div>
    </div>
  )
}
