'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { ArrowLeft, Calendar, Clock, CheckCircle } from 'lucide-react'

interface Service {
  id: string
  name: string
  description: string
  duration: number
  price: number
}

interface TimeSlot {
  time: string
  available: boolean
}

const SERVICES: Service[] = [
  {
    id: '1',
    name: 'Standard Cleaning',
    description: 'Complete home cleaning service',
    duration: 120,
    price: 150,
  },
  {
    id: '2',
    name: 'Deep Cleaning',
    description: 'Thorough deep clean of your property',
    duration: 180,
    price: 250,
  },
  {
    id: '3',
    name: 'Window Cleaning',
    description: 'Professional window cleaning service',
    duration: 60,
    price: 75,
  },
  {
    id: '4',
    name: 'Carpet Cleaning',
    description: 'Specialized carpet and upholstery cleaning',
    duration: 90,
    price: 120,
  },
]

const TIME_SLOTS: TimeSlot[] = [
  { time: '09:00', available: true },
  { time: '10:00', available: true },
  { time: '11:00', available: false },
  { time: '12:00', available: true },
  { time: '13:00', available: true },
  { time: '14:00', available: true },
  { time: '15:00', available: false },
  { time: '16:00', available: true },
]

type BookingStep = 'service' | 'date' | 'time' | 'details' | 'confirmation'

export default function BookPage() {
  const [currentStep, setCurrentStep] = useState<BookingStep>('service')
  const [selectedService, setSelectedService] = useState<Service | null>(null)
  const [selectedDate, setSelectedDate] = useState<string>('')
  const [selectedTime, setSelectedTime] = useState<string>('')
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    notes: '',
  })

  const handleServiceSelect = (service: Service) => {
    setSelectedService(service)
    setCurrentStep('date')
  }

  const handleDateSelect = () => {
    if (selectedDate) {
      setCurrentStep('time')
    }
  }

  const handleTimeSelect = (time: string) => {
    setSelectedTime(time)
    setCurrentStep('details')
  }

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmitBooking = () => {
    if (formData.name && formData.email && formData.phone && selectedService && selectedDate && selectedTime) {
      setCurrentStep('confirmation')
    }
  }

  const handleBackStep = () => {
    if (currentStep === 'service') return

    const steps: BookingStep[] = ['service', 'date', 'time', 'details', 'confirmation']
    const currentIndex = steps.indexOf(currentStep)
    if (currentIndex > 0) {
      setCurrentStep(steps[currentIndex - 1])
    }
  }

  return (
    <main className="min-h-screen bg-gradient-to-b from-background to-secondary/10">
      {/* Header */}
      <nav className="border-b border-border sticky top-0 z-50 bg-background/95 backdrop-blur-sm">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <Link href="/" className="text-2xl font-bold text-primary">
            CareOps
          </Link>
          <h1 className="text-lg font-semibold text-foreground">Book Your Service</h1>
          <div className="w-16"></div>
        </div>
      </nav>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Progress indicator */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            {['Service', 'Date', 'Time', 'Details', 'Confirm'].map((label, index) => (
              <div key={label} className="flex items-center">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold transition-colors ${
                    ['service', 'date', 'time', 'details', 'confirmation'][index] === currentStep
                      ? 'bg-primary text-primary-foreground'
                      : ['service', 'date', 'time', 'details', 'confirmation'].indexOf(currentStep) >
                          index
                        ? 'bg-green-500 text-white'
                        : 'bg-secondary text-secondary-foreground'
                  }`}
                >
                  {['service', 'date', 'time', 'details', 'confirmation'].indexOf(currentStep) > index ? (
                    '✓'
                  ) : (
                    index + 1
                  )}
                </div>
                {index < 4 && <div className="w-12 h-0.5 mx-2 bg-border"></div>}
              </div>
            ))}
          </div>
          <p className="text-sm text-muted-foreground text-center">
            Step {['service', 'date', 'time', 'details', 'confirmation'].indexOf(currentStep) + 1} of 5
          </p>
        </div>

        {/* Service Selection */}
        {currentStep === 'service' && (
          <div className="space-y-6">
            <div>
              <h2 className="text-3xl font-bold text-foreground mb-2">Choose Your Service</h2>
              <p className="text-muted-foreground">Select the service you'd like to book</p>
            </div>

            <div className="grid gap-4">
              {SERVICES.map((service) => (
                <Card
                  key={service.id}
                  className="p-4 border border-border hover:border-primary hover:bg-primary/5 cursor-pointer transition-all"
                  onClick={() => handleServiceSelect(service)}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-foreground">{service.name}</h3>
                      <p className="text-sm text-muted-foreground mt-1">{service.description}</p>
                      <div className="flex items-center gap-4 mt-3 text-sm">
                        <span className="flex items-center gap-1">
                          <Clock className="w-4 h-4" />
                          {service.duration} min
                        </span>
                        <span className="font-semibold text-primary">${service.price}</span>
                      </div>
                    </div>
                    <div
                      className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                        selectedService?.id === service.id
                          ? 'border-primary bg-primary'
                          : 'border-border'
                      }`}
                    >
                      {selectedService?.id === service.id && <CheckCircle className="w-4 h-4 text-primary-foreground" />}
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* Date Selection */}
        {currentStep === 'date' && (
          <div className="space-y-6">
            <div>
              <h2 className="text-3xl font-bold text-foreground mb-2">Select Date</h2>
              <p className="text-muted-foreground">Choose your preferred date</p>
            </div>

            <Card className="p-6 border border-border">
              <Label htmlFor="date">Date</Label>
              <Input
                id="date"
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="mt-2"
                min={new Date().toISOString().split('T')[0]}
              />
              <p className="text-sm text-muted-foreground mt-2">
                {selectedService?.name} • {selectedService?.duration} minutes
              </p>
            </Card>
          </div>
        )}

        {/* Time Selection */}
        {currentStep === 'time' && (
          <div className="space-y-6">
            <div>
              <h2 className="text-3xl font-bold text-foreground mb-2">Select Time</h2>
              <p className="text-muted-foreground">Choose your preferred time slot</p>
            </div>

            <div className="space-y-3">
              <p className="text-sm font-medium text-foreground">
                {new Date(selectedDate).toLocaleDateString('en-US', {
                  weekday: 'long',
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}
              </p>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {TIME_SLOTS.map((slot) => (
                  <button
                    key={slot.time}
                    onClick={() => handleTimeSelect(slot.time)}
                    disabled={!slot.available}
                    className={`p-3 rounded-lg border transition-all text-sm font-medium ${
                      slot.available
                        ? selectedTime === slot.time
                          ? 'border-primary bg-primary text-primary-foreground'
                          : 'border-border hover:border-primary'
                        : 'border-border bg-secondary/50 text-muted-foreground cursor-not-allowed opacity-50'
                    }`}
                  >
                    {slot.time}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Details Collection */}
        {currentStep === 'details' && (
          <div className="space-y-6">
            <div>
              <h2 className="text-3xl font-bold text-foreground mb-2">Your Details</h2>
              <p className="text-muted-foreground">Please provide your contact information</p>
            </div>

            <Card className="p-6 border border-border space-y-4">
              <div>
                <Label htmlFor="name">Full Name *</Label>
                <Input
                  id="name"
                  name="name"
                  placeholder="John Doe"
                  value={formData.name}
                  onChange={handleFormChange}
                  className="mt-1"
                />
              </div>

              <div>
                <Label htmlFor="email">Email *</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="john@example.com"
                  value={formData.email}
                  onChange={handleFormChange}
                  className="mt-1"
                />
              </div>

              <div>
                <Label htmlFor="phone">Phone Number *</Label>
                <Input
                  id="phone"
                  name="phone"
                  placeholder="+1 (555) 123-4567"
                  value={formData.phone}
                  onChange={handleFormChange}
                  className="mt-1"
                />
              </div>

              <div>
                <Label htmlFor="address">Service Address *</Label>
                <Input
                  id="address"
                  name="address"
                  placeholder="123 Main St, City, State 12345"
                  value={formData.address}
                  onChange={handleFormChange}
                  className="mt-1"
                />
              </div>

              <div>
                <Label htmlFor="notes">Additional Notes</Label>
                <textarea
                  id="notes"
                  name="notes"
                  placeholder="Any special requests or instructions..."
                  value={formData.notes}
                  onChange={handleFormChange}
                  className="w-full px-3 py-2 rounded-lg border border-input bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary mt-1 min-h-24"
                />
              </div>
            </Card>
          </div>
        )}

        {/* Confirmation */}
        {currentStep === 'confirmation' && (
          <div className="space-y-6">
            <div className="text-center">
              <div className="w-16 h-16 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="w-8 h-8 text-green-600" />
              </div>
              <h2 className="text-3xl font-bold text-foreground mb-2">Booking Confirmed!</h2>
              <p className="text-muted-foreground">Your appointment has been successfully scheduled</p>
            </div>

            <Card className="p-6 border border-border space-y-4">
              <div className="space-y-3">
                <div className="flex justify-between pb-3 border-b border-border">
                  <span className="text-muted-foreground">Service</span>
                  <span className="font-semibold text-foreground">{selectedService?.name}</span>
                </div>
                <div className="flex justify-between pb-3 border-b border-border">
                  <span className="text-muted-foreground">Date</span>
                  <span className="font-semibold text-foreground">
                    {new Date(selectedDate).toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric',
                    })}
                  </span>
                </div>
                <div className="flex justify-between pb-3 border-b border-border">
                  <span className="text-muted-foreground">Time</span>
                  <span className="font-semibold text-foreground">{selectedTime}</span>
                </div>
                <div className="flex justify-between pt-3">
                  <span className="text-muted-foreground">Total Price</span>
                  <span className="font-bold text-lg text-primary">${selectedService?.price}</span>
                </div>
              </div>

              <div className="bg-blue-50 dark:bg-blue-950/30 p-3 rounded-lg border border-blue-200 dark:border-blue-900/50">
                <p className="text-sm text-blue-900 dark:text-blue-100">
                  A confirmation email has been sent to <strong>{formData.email}</strong>. You can reschedule or cancel up to 24 hours before your appointment.
                </p>
              </div>
            </Card>

            <Link href="/">
              <Button className="w-full">Return to Home</Button>
            </Link>
          </div>
        )}

        {/* Navigation Buttons */}
        <div className="flex gap-3 mt-8">
          <Button
            variant="outline"
            onClick={handleBackStep}
            disabled={currentStep === 'service'}
            className="gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Back
          </Button>

          {currentStep === 'service' && (
            <Button disabled={!selectedService} onClick={() => setCurrentStep('date')} className="flex-1">
              Continue
            </Button>
          )}

          {currentStep === 'date' && (
            <Button disabled={!selectedDate} onClick={handleDateSelect} className="flex-1">
              Continue
            </Button>
          )}

          {currentStep === 'time' && (
            <Button disabled={!selectedTime} onClick={() => setCurrentStep('details')} className="flex-1">
              Continue
            </Button>
          )}

          {currentStep === 'details' && (
            <Button
              onClick={handleSubmitBooking}
              disabled={!formData.name || !formData.email || !formData.phone || !formData.address}
              className="flex-1"
            >
              Confirm Booking
            </Button>
          )}
        </div>
      </div>
    </main>
  )
}
