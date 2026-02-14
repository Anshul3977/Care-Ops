'use client'

import { useState, useEffect } from 'react'
import { useOnboarding } from '@/contexts/OnboardingContext'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { timezones } from '@/lib/onboardingData'
import { Building2, MapPin, Clock, Mail } from 'lucide-react'

export function Step1CreateWorkspace() {
  const { state, updateWorkspace } = useOnboarding()
  const [businessName, setBusinessName] = useState(
    state.workspace?.businessName || '',
  )
  const [address, setAddress] = useState(state.workspace?.address || '')
  const [timezone, setTimezone] = useState(
    state.workspace?.timezone || 'America/New_York',
  )
  const [contactEmail, setContactEmail] = useState(
    state.workspace?.contactEmail || '',
  )

  const isComplete =
    businessName.trim() &&
    address.trim() &&
    timezone &&
    contactEmail.trim() &&
    contactEmail.includes('@')

  const handleSave = () => {
    if (isComplete) {
      updateWorkspace({
        businessName,
        address,
        timezone,
        contactEmail,
      })
    }
  }

  // Auto-save on change
  useEffect(() => {
    if (isComplete) {
      const timer = setTimeout(handleSave, 500)
      return () => clearTimeout(timer)
    }
  }, [businessName, address, timezone, contactEmail])

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold text-foreground mb-2">
          Create Your Workspace
        </h2>
        <p className="text-muted-foreground">
          Set up the basic information for your service business
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Form */}
        <div className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="businessName" className="flex items-center gap-2">
              <Building2 className="w-4 h-4" />
              Business Name
            </Label>
            <Input
              id="businessName"
              placeholder="e.g., ABC Cleaning Services"
              value={businessName}
              onChange={(e) => setBusinessName(e.target.value)}
              className="border border-input"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="address" className="flex items-center gap-2">
              <MapPin className="w-4 h-4" />
              Business Address
            </Label>
            <Input
              id="address"
              placeholder="123 Main St, City, State, ZIP"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              className="border border-input"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="timezone" className="flex items-center gap-2">
              <Clock className="w-4 h-4" />
              Timezone
            </Label>
            <Select value={timezone} onValueChange={setTimezone}>
              <SelectTrigger className="border border-input">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {timezones.map((tz) => (
                  <SelectItem key={tz} value={tz}>
                    {tz}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="contactEmail" className="flex items-center gap-2">
              <Mail className="w-4 h-4" />
              Contact Email
            </Label>
            <Input
              id="contactEmail"
              type="email"
              placeholder="contact@example.com"
              value={contactEmail}
              onChange={(e) => setContactEmail(e.target.value)}
              className="border border-input"
            />
          </div>
        </div>

        {/* Preview */}
        <div className="space-y-4">
          <div className="text-sm font-semibold text-muted-foreground mb-4">
            Workspace Preview
          </div>
          <Card className="p-6 border border-border bg-secondary/30 space-y-4">
            {businessName && (
              <div>
                <p className="text-xs text-muted-foreground">Business Name</p>
                <p className="text-lg font-semibold text-foreground">
                  {businessName}
                </p>
              </div>
            )}
            {address && (
              <div>
                <p className="text-xs text-muted-foreground">Address</p>
                <p className="text-sm text-foreground">{address}</p>
              </div>
            )}
            {timezone && (
              <div>
                <p className="text-xs text-muted-foreground">Timezone</p>
                <p className="text-sm text-foreground">{timezone}</p>
              </div>
            )}
            {contactEmail && (
              <div>
                <p className="text-xs text-muted-foreground">Contact Email</p>
                <p className="text-sm text-foreground">{contactEmail}</p>
              </div>
            )}
            {!businessName && (
              <p className="text-sm text-muted-foreground italic">
                Your workspace preview will appear here as you fill in the
                information
              </p>
            )}
          </Card>
        </div>
      </div>
    </div>
  )
}
