'use client'

import { useState } from 'react'
import { useOnboarding } from '@/contexts/OnboardingContext'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import { CheckCircle2, AlertCircle } from 'lucide-react'

export function Step8Activate() {
  const { state, activateWorkspace } = useOnboarding()
  const [showConfirmation, setShowConfirmation] = useState(false)

  const stepsCompleted = Object.values(state.completed).filter(Boolean).length

  const checklist = [
    {
      step: 'Workspace',
      label: 'Create Workspace',
      completed: state.completed.step1,
    },
    {
      step: 'Email & SMS',
      label: 'Email & SMS Setup',
      completed: state.completed.step2,
    },
    {
      step: 'Contact Form',
      label: 'Customize Contact Form',
      completed: state.completed.step3,
    },
    {
      step: 'Booking',
      label: 'Booking Setup',
      completed: state.completed.step4,
    },
    {
      step: 'Forms',
      label: 'Post-Booking Forms',
      completed: state.completed.step5,
    },
    {
      step: 'Inventory',
      label: 'Inventory Setup',
      completed: state.completed.step6,
    },
    {
      step: 'Staff',
      label: 'Staff Management',
      completed: state.completed.step7,
    },
  ]

  const handleActivate = () => {
    activateWorkspace()
    setShowConfirmation(false)
  }

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold text-foreground mb-2">
          Activate Your Workspace
        </h2>
        <p className="text-muted-foreground">
          Review your setup and activate your workspace to start using CareOps
        </p>
      </div>

      {/* Progress Summary */}
      <Card className="p-6 border border-border">
        <div className="mb-4">
          <h3 className="font-semibold text-foreground flex items-center justify-between">
            Setup Progress
            <span className="text-sm font-normal text-primary">
              {stepsCompleted} of 7 steps
            </span>
          </h3>
        </div>

        <div className="space-y-2">
          {checklist.map((item) => (
            <div
              key={item.step}
              className="flex items-center gap-3 p-3 rounded-lg bg-secondary/20 border border-border"
            >
              {item.completed ? (
                <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0" />
              ) : (
                <AlertCircle className="w-5 h-5 text-yellow-600 flex-shrink-0" />
              )}
              <span className="flex-1 font-medium text-foreground">
                {item.label}
              </span>
              <span
                className={`text-xs font-medium px-2 py-1 rounded ${
                  item.completed
                    ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300'
                    : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300'
                }`}
              >
                {item.completed ? 'Complete' : 'Pending'}
              </span>
            </div>
          ))}
        </div>
      </Card>

      {/* What Happens Next */}
      <Card className="p-6 border border-border bg-primary/5">
        <h3 className="font-semibold text-foreground mb-4">What Happens Next</h3>
        <ul className="space-y-3">
          <li className="flex items-start gap-3">
            <CheckCircle2 className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
            <div>
              <p className="font-medium text-foreground">
                Your workspace goes live
              </p>
              <p className="text-sm text-muted-foreground">
                Your public contact form and booking pages become active
              </p>
            </div>
          </li>
          <li className="flex items-start gap-3">
            <CheckCircle2 className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
            <div>
              <p className="font-medium text-foreground">
                Staff invitations are sent
              </p>
              <p className="text-sm text-muted-foreground">
                Team members receive email invitations to join
              </p>
            </div>
          </li>
          <li className="flex items-start gap-3">
            <CheckCircle2 className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
            <div>
              <p className="font-medium text-foreground">
                Dashboard becomes available
              </p>
              <p className="text-sm text-muted-foreground">
                Start tracking bookings and managing your business
              </p>
            </div>
          </li>
        </ul>
      </Card>

      {/* Activation Status */}
      {state.workspaceActivated ? (
        <Card className="p-6 border border-green-200 bg-green-50 dark:bg-green-900/20 dark:border-green-800">
          <div className="flex items-start gap-3">
            <CheckCircle2 className="w-6 h-6 text-green-600 mt-0.5" />
            <div>
              <h3 className="font-semibold text-green-900 dark:text-green-100">
                Workspace Activated Successfully!
              </h3>
              <p className="text-sm text-green-800 dark:text-green-200 mt-1">
                Your workspace is now live and ready to use. You can access your
                dashboard from the main menu.
              </p>
            </div>
          </div>
        </Card>
      ) : (
        <div className="flex gap-4">
          <Button
            onClick={() => setShowConfirmation(true)}
            className="flex-1"
            size="lg"
          >
            Activate Workspace
          </Button>
          <Button variant="outline" className="flex-1" size="lg">
            Review Setup
          </Button>
        </div>
      )}

      {/* Confirmation Dialog */}
      <AlertDialog open={showConfirmation} onOpenChange={setShowConfirmation}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Activate Workspace?</AlertDialogTitle>
            <AlertDialogDescription>
              This will launch your workspace and make your contact form and
              booking pages publicly available. You can update settings anytime
              from the dashboard.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <div className="bg-secondary/30 p-4 rounded-lg text-sm text-foreground">
            <p className="font-medium mb-2">Ready to launch:</p>
            <ul className="space-y-1 text-muted-foreground">
              <li>✓ Workspace configured</li>
              <li>✓ Communication channels ready</li>
              <li>✓ Services and availability set</li>
            </ul>
          </div>
          <div className="flex gap-3">
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleActivate} className="bg-primary">
              Activate Now
            </AlertDialogAction>
          </div>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
