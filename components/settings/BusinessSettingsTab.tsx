'use client'

import { useState } from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Save, MapPin, Phone, Mail, Clock } from 'lucide-react'

export interface BusinessSettings {
  companyName: string
  businessPhone: string
  businessEmail: string
  address: string
  city: string
  state: string
  zipCode: string
  timezone: string
  bookingBuffer: number
  maxDailyBookings: number
  businessHours: {
    monday: { open: string; close: string; closed: boolean }
    tuesday: { open: string; close: string; closed: boolean }
    wednesday: { open: string; close: string; closed: boolean }
    thursday: { open: string; close: string; closed: boolean }
    friday: { open: string; close: string; closed: boolean }
    saturday: { open: string; close: string; closed: boolean }
    sunday: { open: string; close: string; closed: boolean }
  }
  services: Array<{
    id: string
    name: string
    duration: number
    price: number
    description: string
  }>
  paymentMethods: {
    creditCard: boolean
    bankTransfer: boolean
    paypal: boolean
    applePay: boolean
  }
}

const DAYS = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'] as const

export default function BusinessSettingsTab() {
  const [settings, setSettings] = useState<BusinessSettings>({
    companyName: 'CareOps Services',
    businessPhone: '+1 (555) 123-4567',
    businessEmail: 'info@careops.com',
    address: '123 Main Street',
    city: 'New York',
    state: 'NY',
    zipCode: '10001',
    timezone: 'America/New_York',
    bookingBuffer: 30,
    maxDailyBookings: 10,
    businessHours: {
      monday: { open: '09:00', close: '17:00', closed: false },
      tuesday: { open: '09:00', close: '17:00', closed: false },
      wednesday: { open: '09:00', close: '17:00', closed: false },
      thursday: { open: '09:00', close: '17:00', closed: false },
      friday: { open: '09:00', close: '17:00', closed: false },
      saturday: { open: '10:00', close: '14:00', closed: false },
      sunday: { open: '09:00', close: '17:00', closed: true },
    },
    services: [
      {
        id: '1',
        name: 'Standard Cleaning',
        duration: 120,
        price: 150,
        description: 'Complete home cleaning service',
      },
      {
        id: '2',
        name: 'Deep Cleaning',
        duration: 180,
        price: 250,
        description: 'Thorough deep clean of your property',
      },
    ],
    paymentMethods: {
      creditCard: true,
      bankTransfer: true,
      paypal: true,
      applePay: false,
    },
  })

  const [isSaving, setIsSaving] = useState(false)

  const handleBusinessInfoChange = (field: string, value: string) => {
    setSettings((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  const handleBusinessHoursChange = (
    day: (typeof DAYS)[number],
    field: 'open' | 'close' | 'closed',
    value: string | boolean
  ) => {
    setSettings((prev) => ({
      ...prev,
      businessHours: {
        ...prev.businessHours,
        [day]: {
          ...prev.businessHours[day],
          [field]: value,
        },
      },
    }))
  }

  const handleAddService = () => {
    const newService = {
      id: Date.now().toString(),
      name: '',
      duration: 60,
      price: 0,
      description: '',
    }
    setSettings((prev) => ({
      ...prev,
      services: [...prev.services, newService],
    }))
  }

  const handleUpdateService = (id: string, field: string, value: string | number) => {
    setSettings((prev) => ({
      ...prev,
      services: prev.services.map((service) =>
        service.id === id ? { ...service, [field]: value } : service
      ),
    }))
  }

  const handleRemoveService = (id: string) => {
    setSettings((prev) => ({
      ...prev,
      services: prev.services.filter((service) => service.id !== id),
    }))
  }

  const handlePaymentMethodChange = (method: keyof typeof settings.paymentMethods) => {
    setSettings((prev) => ({
      ...prev,
      paymentMethods: {
        ...prev.paymentMethods,
        [method]: !prev.paymentMethods[method],
      },
    }))
  }

  const handleSave = async () => {
    setIsSaving(true)
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000))
    setIsSaving(false)
    // Show success toast here
  }

  return (
    <div className="space-y-6">
      {/* Business Information */}
      <Card className="p-6 border border-border">
        <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
          <MapPin className="w-5 h-5 text-primary" />
          Business Information
        </h3>

        <div className="space-y-4">
          <div>
            <Label htmlFor="companyName">Company Name</Label>
            <Input
              id="companyName"
              value={settings.companyName}
              onChange={(e) => handleBusinessInfoChange('companyName', e.target.value)}
              className="mt-1"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="businessPhone" className="flex items-center gap-2">
                <Phone className="w-4 h-4" />
                Phone
              </Label>
              <Input
                id="businessPhone"
                value={settings.businessPhone}
                onChange={(e) => handleBusinessInfoChange('businessPhone', e.target.value)}
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="businessEmail" className="flex items-center gap-2">
                <Mail className="w-4 h-4" />
                Email
              </Label>
              <Input
                id="businessEmail"
                type="email"
                value={settings.businessEmail}
                onChange={(e) => handleBusinessInfoChange('businessEmail', e.target.value)}
                className="mt-1"
              />
            </div>
          </div>

          <div>
            <Label htmlFor="address">Street Address</Label>
            <Input
              id="address"
              value={settings.address}
              onChange={(e) => handleBusinessInfoChange('address', e.target.value)}
              className="mt-1"
            />
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div>
              <Label htmlFor="city">City</Label>
              <Input
                id="city"
                value={settings.city}
                onChange={(e) => handleBusinessInfoChange('city', e.target.value)}
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="state">State</Label>
              <Input
                id="state"
                value={settings.state}
                onChange={(e) => handleBusinessInfoChange('state', e.target.value)}
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="zipCode">ZIP Code</Label>
              <Input
                id="zipCode"
                value={settings.zipCode}
                onChange={(e) => handleBusinessInfoChange('zipCode', e.target.value)}
                className="mt-1"
              />
            </div>
          </div>
        </div>
      </Card>

      {/* Business Hours */}
      <Card className="p-6 border border-border">
        <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
          <Clock className="w-5 h-5 text-primary" />
          Business Hours
        </h3>

        <div className="space-y-3">
          {DAYS.map((day) => (
            <div key={day} className="flex items-center gap-4 p-3 rounded-lg bg-secondary/5">
              <label className="flex items-center gap-2 w-24">
                <input
                  type="checkbox"
                  checked={settings.businessHours[day].closed}
                  onChange={(e) =>
                    handleBusinessHoursChange(day, 'closed', e.target.checked)
                  }
                  className="rounded"
                />
                <span className="text-sm font-medium text-foreground capitalize">{day}</span>
              </label>

              {!settings.businessHours[day].closed && (
                <div className="flex items-center gap-2 flex-1">
                  <input
                    type="time"
                    value={settings.businessHours[day].open}
                    onChange={(e) =>
                      handleBusinessHoursChange(day, 'open', e.target.value)
                    }
                    className="px-3 py-1 rounded border border-input bg-background text-foreground"
                  />
                  <span className="text-muted-foreground">to</span>
                  <input
                    type="time"
                    value={settings.businessHours[day].close}
                    onChange={(e) =>
                      handleBusinessHoursChange(day, 'close', e.target.value)
                    }
                    className="px-3 py-1 rounded border border-input bg-background text-foreground"
                  />
                </div>
              )}
              {settings.businessHours[day].closed && (
                <span className="text-sm text-muted-foreground">Closed</span>
              )}
            </div>
          ))}
        </div>
      </Card>

      {/* Services */}
      <Card className="p-6 border border-border">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-foreground">Services</h3>
          <Button onClick={handleAddService} variant="outline" size="sm">
            Add Service
          </Button>
        </div>

        <div className="space-y-4">
          {settings.services.map((service) => (
            <div key={service.id} className="p-4 rounded-lg border border-border space-y-3">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor={`name-${service.id}`} className="text-sm">
                    Service Name
                  </Label>
                  <Input
                    id={`name-${service.id}`}
                    value={service.name}
                    onChange={(e) => handleUpdateService(service.id, 'name', e.target.value)}
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor={`description-${service.id}`} className="text-sm">
                    Description
                  </Label>
                  <Input
                    id={`description-${service.id}`}
                    value={service.description}
                    onChange={(e) => handleUpdateService(service.id, 'description', e.target.value)}
                    className="mt-1"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <Label htmlFor={`duration-${service.id}`} className="text-sm">
                    Duration (min)
                  </Label>
                  <Input
                    id={`duration-${service.id}`}
                    type="number"
                    value={service.duration}
                    onChange={(e) =>
                      handleUpdateService(service.id, 'duration', parseInt(e.target.value))
                    }
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor={`price-${service.id}`} className="text-sm">
                    Price ($)
                  </Label>
                  <Input
                    id={`price-${service.id}`}
                    type="number"
                    value={service.price}
                    onChange={(e) =>
                      handleUpdateService(service.id, 'price', parseFloat(e.target.value))
                    }
                    className="mt-1"
                  />
                </div>
                <div className="flex items-end">
                  <Button
                    onClick={() => handleRemoveService(service.id)}
                    variant="destructive"
                    size="sm"
                    className="w-full"
                  >
                    Remove
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* Payment Methods */}
      <Card className="p-6 border border-border">
        <h3 className="text-lg font-semibold text-foreground mb-4">Accepted Payment Methods</h3>

        <div className="space-y-3">
          {Object.entries(settings.paymentMethods).map(([method, enabled]) => (
            <label key={method} className="flex items-center gap-3 p-3 rounded-lg bg-secondary/5 cursor-pointer">
              <input
                type="checkbox"
                checked={enabled}
                onChange={() =>
                  handlePaymentMethodChange(
                    method as keyof typeof settings.paymentMethods
                  )
                }
                className="rounded"
              />
              <span className="text-sm font-medium text-foreground capitalize">
                {method === 'creditCard' ? 'Credit Card' : method === 'bankTransfer' ? 'Bank Transfer' : method === 'paypal' ? 'PayPal' : 'Apple Pay'}
              </span>
            </label>
          ))}
        </div>
      </Card>

      {/* Save Button */}
      <Button onClick={handleSave} disabled={isSaving} className="w-full gap-2">
        <Save className="w-4 h-4" />
        {isSaving ? 'Saving...' : 'Save Changes'}
      </Button>
    </div>
  )
}
