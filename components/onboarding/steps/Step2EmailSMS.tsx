'use client'

import { useState } from 'react'
import { useOnboarding } from '@/contexts/OnboardingContext'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Switch } from '@/components/ui/switch'
import { Label } from '@/components/ui/label'
import { Mail, MessageSquare, CheckCircle2, Circle } from 'lucide-react'

export function Step2EmailSMS() {
  const { state, updateEmailSms } = useOnboarding()
  const [emailProvider, setEmailProvider] = useState<'sendgrid' | 'mailgun' | null>(
    state.emailSms?.emailProvider || null,
  )
  const [smsProvider, setSmsProvider] = useState<'twilio' | 'nexmo' | null>(
    state.emailSms?.smsProvider || null,
  )
  const [emailConnected, setEmailConnected] = useState(
    state.emailSms?.emailConnected || false,
  )
  const [smsConnected, setSmsConnected] = useState(
    state.emailSms?.smsConnected || false,
  )

  const isComplete = (emailConnected || smsConnected)

  const handleSave = () => {
    updateEmailSms({
      emailProvider,
      smsProvider,
      emailConnected,
      smsConnected,
    })
  }

  React.useEffect(() => {
    if (isComplete) {
      const timer = setTimeout(handleSave, 500)
      return () => clearTimeout(timer)
    }
  }, [emailProvider, smsProvider, emailConnected, smsConnected])

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold text-foreground mb-2">
          Email & SMS Setup
        </h2>
        <p className="text-muted-foreground">
          Connect at least one communication channel for customer notifications
        </p>
      </div>

      <div className="space-y-6">
        {/* Email Section */}
        <Card className="p-6 border border-border">
          <div className="space-y-6">
            <div className="flex items-start justify-between">
              <div className="flex items-start gap-3">
                <Mail className="w-5 h-5 text-primary mt-1" />
                <div>
                  <h3 className="font-semibold text-foreground">Email Provider</h3>
                  <p className="text-sm text-muted-foreground mt-1">
                    Send booking confirmations and notifications
                  </p>
                </div>
              </div>
              {emailConnected && (
                <Badge variant="default" className="gap-1">
                  <CheckCircle2 className="w-3 h-3" />
                  Connected
                </Badge>
              )}
            </div>

            <div className="space-y-3 pl-8">
              {['SendGrid', 'Mailgun'].map((provider) => {
                const providerLower = provider.toLowerCase() as
                  | 'sendgrid'
                  | 'mailgun'
                return (
                  <div
                    key={provider}
                    className="flex items-center gap-3 p-3 rounded-lg border border-border hover:bg-secondary/30 transition-colors"
                  >
                    <input
                      type="radio"
                      id={`email-${providerLower}`}
                      checked={emailProvider === providerLower}
                      onChange={() => setEmailProvider(providerLower)}
                      className="w-4 h-4"
                    />
                    <Label
                      htmlFor={`email-${providerLower}`}
                      className="flex-1 cursor-pointer"
                    >
                      <span className="font-medium">{provider}</span>
                    </Label>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => setEmailConnected(!emailConnected)}
                      disabled={emailProvider !== providerLower}
                    >
                      {emailConnected && emailProvider === providerLower
                        ? 'Connected'
                        : 'Connect'}
                    </Button>
                  </div>
                )
              })}
            </div>
          </div>
        </Card>

        {/* SMS Section */}
        <Card className="p-6 border border-border">
          <div className="space-y-6">
            <div className="flex items-start justify-between">
              <div className="flex items-start gap-3">
                <MessageSquare className="w-5 h-5 text-primary mt-1" />
                <div>
                  <h3 className="font-semibold text-foreground">SMS Provider</h3>
                  <p className="text-sm text-muted-foreground mt-1">
                    Send SMS reminders and confirmations
                  </p>
                </div>
              </div>
              {smsConnected && (
                <Badge variant="default" className="gap-1">
                  <CheckCircle2 className="w-3 h-3" />
                  Connected
                </Badge>
              )}
            </div>

            <div className="space-y-3 pl-8">
              {['Twilio', 'Nexmo'].map((provider) => {
                const providerLower = provider.toLowerCase() as 'twilio' | 'nexmo'
                return (
                  <div
                    key={provider}
                    className="flex items-center gap-3 p-3 rounded-lg border border-border hover:bg-secondary/30 transition-colors"
                  >
                    <input
                      type="radio"
                      id={`sms-${providerLower}`}
                      checked={smsProvider === providerLower}
                      onChange={() => setSmsProvider(providerLower)}
                      className="w-4 h-4"
                    />
                    <Label
                      htmlFor={`sms-${providerLower}`}
                      className="flex-1 cursor-pointer"
                    >
                      <span className="font-medium">{provider}</span>
                    </Label>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => setSmsConnected(!smsConnected)}
                      disabled={smsProvider !== providerLower}
                    >
                      {smsConnected && smsProvider === providerLower
                        ? 'Connected'
                        : 'Connect'}
                    </Button>
                  </div>
                )
              })}
            </div>
          </div>
        </Card>

        {/* Status */}
        <div className="p-4 rounded-lg bg-primary/10 border border-primary/20">
          <div className="flex items-start gap-3">
            {isComplete ? (
              <CheckCircle2 className="w-5 h-5 text-primary mt-0.5" />
            ) : (
              <Circle className="w-5 h-5 text-muted-foreground mt-0.5" />
            )}
            <div>
              <p className="font-medium text-foreground">
                {isComplete
                  ? 'Communication channels configured'
                  : 'Please connect at least one channel'}
              </p>
              {isComplete && (
                <p className="text-sm text-muted-foreground mt-1">
                  Your business is ready to send notifications to customers
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
