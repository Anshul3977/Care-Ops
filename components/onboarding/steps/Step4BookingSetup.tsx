'use client'

import { useState } from 'react'
import { useOnboarding } from '@/contexts/OnboardingContext'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Checkbox } from '@/components/ui/checkbox'
import { serviceDurations, daysOfWeek, timeSlots } from '@/lib/onboardingData'
import { Plus, Trash2, Calendar, Clock, MapPin } from 'lucide-react'

export function Step4BookingSetup() {
  const { state, updateBooking } = useOnboarding()
  const [services, setServices] = useState(state.booking?.services || [])
  const [newServiceName, setNewServiceName] = useState('')
  const [newServiceDuration, setNewServiceDuration] = useState('60')
  const [selectedDays, setSelectedDays] = useState<string[]>(['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'])
  const [selectedTimes, setSelectedTimes] = useState<string[]>(['9:00 AM', '5:00 PM'])
  const [location, setLocation] = useState('')

  const isComplete =
    services.length > 0 &&
    selectedDays.length > 0 &&
    selectedTimes.length > 0

  const handleAddService = () => {
    if (newServiceName.trim()) {
      setServices([
        ...services,
        {
          id: Math.random().toString(),
          name: newServiceName,
          duration: parseInt(newServiceDuration),
        },
      ])
      setNewServiceName('')
      setNewServiceDuration('60')
    }
  }

  const handleRemoveService = (id: string) => {
    setServices(services.filter((s) => s.id !== id))
  }

  const toggleDay = (day: string) => {
    setSelectedDays((prev) =>
      prev.includes(day) ? prev.filter((d) => d !== day) : [...prev, day],
    )
  }

  const toggleTime = (time: string) => {
    setSelectedTimes((prev) =>
      prev.includes(time) ? prev.filter((t) => t !== time) : [...prev, time],
    )
  }

  const handleSave = () => {
    if (isComplete) {
      updateBooking({
        services,
        availability: {
          days: selectedDays.join(','),
          times: selectedTimes.join(','),
        },
      })
    }
  }

  React.useEffect(() => {
    if (isComplete) {
      const timer = setTimeout(handleSave, 500)
      return () => clearTimeout(timer)
    }
  }, [services, selectedDays, selectedTimes])

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold text-foreground mb-2">
          Booking Setup
        </h2>
        <p className="text-muted-foreground">
          Create service types and set your availability
        </p>
      </div>

      <div className="space-y-8">
        {/* Services */}
        <Card className="p-6 border border-border">
          <h3 className="font-semibold text-foreground mb-4">Services/Meeting Types</h3>
          <div className="space-y-4">
            {services.length > 0 && (
              <div className="space-y-2">
                {services.map((service) => (
                  <div
                    key={service.id}
                    className="flex items-center justify-between p-3 rounded-lg border border-border bg-secondary/20"
                  >
                    <div>
                      <p className="font-medium text-foreground">{service.name}</p>
                      <p className="text-sm text-muted-foreground">
                        {service.duration} minutes
                      </p>
                    </div>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => handleRemoveService(service.id)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                ))}
              </div>
            )}

            <div className="p-4 rounded-lg border border-dashed border-border space-y-3">
              <div>
                <Label htmlFor="serviceName" className="text-sm">
                  Service Name
                </Label>
                <Input
                  id="serviceName"
                  placeholder="e.g., Basic Cleaning"
                  value={newServiceName}
                  onChange={(e) => setNewServiceName(e.target.value)}
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="duration" className="text-sm">
                  Duration
                </Label>
                <Select
                  value={newServiceDuration}
                  onValueChange={setNewServiceDuration}
                >
                  <SelectTrigger className="mt-1">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {serviceDurations.map((d) => (
                      <SelectItem key={d.value} value={d.value.toString()}>
                        {d.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <Button
                onClick={handleAddService}
                className="w-full gap-2"
              >
                <Plus className="w-4 h-4" />
                Add Service
              </Button>
            </div>
          </div>
        </Card>

        {/* Availability */}
        <Card className="p-6 border border-border">
          <h3 className="font-semibold text-foreground mb-4 flex items-center gap-2">
            <Calendar className="w-4 h-4" />
            Operating Hours
          </h3>
          <div className="space-y-4">
            <div>
              <p className="text-sm font-medium text-foreground mb-3">
                Operating Days
              </p>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                {daysOfWeek.map((day) => (
                  <div
                    key={day}
                    className="flex items-center gap-2 p-2 rounded border border-border"
                  >
                    <Checkbox
                      id={`day-${day}`}
                      checked={selectedDays.includes(day)}
                      onCheckedChange={() => toggleDay(day)}
                    />
                    <Label htmlFor={`day-${day}`} className="cursor-pointer text-sm">
                      {day.slice(0, 3)}
                    </Label>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <p className="text-sm font-medium text-foreground mb-3 flex items-center gap-2">
                <Clock className="w-4 h-4" />
                Operating Hours (Sample)
              </p>
              <div className="grid grid-cols-3 md:grid-cols-4 gap-2 max-h-40 overflow-y-auto">
                {timeSlots.slice(0, 10).map((time) => (
                  <div
                    key={time}
                    className="flex items-center gap-2 p-2 rounded border border-border"
                  >
                    <Checkbox
                      id={`time-${time}`}
                      checked={selectedTimes.includes(time)}
                      onCheckedChange={() => toggleTime(time)}
                    />
                    <Label htmlFor={`time-${time}`} className="cursor-pointer text-xs">
                      {time}
                    </Label>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <Label htmlFor="location" className="text-sm flex items-center gap-2">
                <MapPin className="w-4 h-4" />
                Service Location (Optional)
              </Label>
              <Input
                id="location"
                placeholder="e.g., On-site, Client location, Virtual"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="mt-1"
              />
            </div>
          </div>
        </Card>
      </div>
    </div>
  )
}
