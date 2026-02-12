'use client'

import { useState } from 'react'
import { useOnboarding } from '@/contexts/OnboardingContext'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { Label } from '@/components/ui/label'
import { Copy, CheckCircle2 } from 'lucide-react'

export function Step3ContactForm() {
  const { state, updateContactForm } = useOnboarding()
  const [nameEnabled, setNameEnabled] = useState(
    state.contactForm?.fields.name ?? true,
  )
  const [emailEnabled, setEmailEnabled] = useState(
    state.contactForm?.fields.email ?? true,
  )
  const [phoneEnabled, setPhoneEnabled] = useState(
    state.contactForm?.fields.phone ?? true,
  )
  const [messageEnabled, setMessageEnabled] = useState(
    state.contactForm?.fields.message ?? true,
  )
  const [copied, setCopied] = useState(false)

  const isComplete = nameEnabled || emailEnabled || phoneEnabled || messageEnabled

  const handleSave = () => {
    updateContactForm({
      fields: {
        name: nameEnabled,
        email: emailEnabled,
        phone: phoneEnabled,
        message: messageEnabled,
      },
    })
  }

  React.useEffect(() => {
    if (isComplete) {
      const timer = setTimeout(handleSave, 500)
      return () => clearTimeout(timer)
    }
  }, [nameEnabled, emailEnabled, phoneEnabled, messageEnabled])

  const shareableLink = 'https://careops.com/forms/contact?id=xyz123'

  const handleCopy = () => {
    navigator.clipboard.writeText(shareableLink)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold text-foreground mb-2">
          Customize Your Contact Form
        </h2>
        <p className="text-muted-foreground">
          Select which fields to include in your public contact form
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Form Builder */}
        <Card className="p-6 border border-border">
          <h3 className="font-semibold text-foreground mb-6">Form Fields</h3>
          <div className="space-y-4">
            {[
              { id: 'name', label: 'Name', checked: nameEnabled, setter: setNameEnabled },
              { id: 'email', label: 'Email', checked: emailEnabled, setter: setEmailEnabled },
              { id: 'phone', label: 'Phone', checked: phoneEnabled, setter: setPhoneEnabled },
              { id: 'message', label: 'Message', checked: messageEnabled, setter: setMessageEnabled },
            ].map((field) => (
              <div
                key={field.id}
                className="flex items-center gap-3 p-3 rounded-lg border border-border hover:bg-secondary/30 transition-colors"
              >
                <Checkbox
                  id={field.id}
                  checked={field.checked}
                  onCheckedChange={(checked) =>
                    field.setter(checked as boolean)
                  }
                />
                <Label htmlFor={field.id} className="flex-1 cursor-pointer">
                  <span className="font-medium">{field.label}</span>
                </Label>
              </div>
            ))}
          </div>
        </Card>

        {/* Live Preview */}
        <div className="space-y-4">
          <div className="text-sm font-semibold text-muted-foreground">
            Live Preview
          </div>
          <Card className="p-6 border border-border bg-secondary/30">
            <h3 className="font-semibold text-foreground mb-4">Contact Us</h3>
            <div className="space-y-4">
              {nameEnabled && (
                <div>
                  <label className="text-sm font-medium text-foreground">Name</label>
                  <div className="mt-1 h-10 bg-background border border-border rounded px-3 py-2 text-sm text-muted-foreground">
                    Your name
                  </div>
                </div>
              )}
              {emailEnabled && (
                <div>
                  <label className="text-sm font-medium text-foreground">
                    Email
                  </label>
                  <div className="mt-1 h-10 bg-background border border-border rounded px-3 py-2 text-sm text-muted-foreground">
                    your@email.com
                  </div>
                </div>
              )}
              {phoneEnabled && (
                <div>
                  <label className="text-sm font-medium text-foreground">
                    Phone
                  </label>
                  <div className="mt-1 h-10 bg-background border border-border rounded px-3 py-2 text-sm text-muted-foreground">
                    (123) 456-7890
                  </div>
                </div>
              )}
              {messageEnabled && (
                <div>
                  <label className="text-sm font-medium text-foreground">
                    Message
                  </label>
                  <div className="mt-1 h-20 bg-background border border-border rounded px-3 py-2 text-sm text-muted-foreground">
                    Tell us about your needs
                  </div>
                </div>
              )}
            </div>
          </Card>

          {/* Shareable Link */}
          <div className="space-y-2">
            <p className="text-sm font-medium text-foreground">
              Shareable Form Link
            </p>
            <div className="flex items-center gap-2 p-3 rounded-lg border border-border bg-secondary/30">
              <code className="flex-1 text-xs text-muted-foreground truncate">
                {shareableLink}
              </code>
              <Button
                size="sm"
                variant="ghost"
                onClick={handleCopy}
                className="gap-2"
              >
                {copied ? (
                  <>
                    <CheckCircle2 className="w-4 h-4" />
                    Copied
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4" />
                    Copy
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
