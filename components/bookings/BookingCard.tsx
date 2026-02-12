'use client'

import React from 'react'
import { Booking, getBookingStatusColor, getBookingStatusLabel } from '@/lib/bookingsData'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { User, Phone, Mail, MapPin, Clock } from 'lucide-react'
import { format } from 'date-fns'

interface BookingCardProps {
  booking: Booking
  isSelected?: boolean
  onClick?: () => void
}

export function BookingCard({ booking, isSelected, onClick }: BookingCardProps) {
  return (
    <Card
      className={`p-4 cursor-pointer transition-colors ${
        isSelected ? 'border-primary border-2 bg-primary/5' : 'hover:bg-accent'
      }`}
      onClick={onClick}
    >
      <div className="space-y-3">
        {/* Header with status */}
        <div className="flex items-start justify-between gap-2">
          <div className="flex-1">
            <h3 className="font-semibold flex items-center gap-2">
              <User className="w-4 h-4 text-muted-foreground" />
              {booking.customerName}
            </h3>
          </div>
          <Badge className={getBookingStatusColor(booking.status)}>
            {getBookingStatusLabel(booking.status)}
          </Badge>
        </div>

        {/* Service and time */}
        <div className="space-y-2 text-sm">
          <div className="flex items-center gap-2 text-muted-foreground">
            <Clock className="w-4 h-4" />
            <span>{booking.serviceTitle}</span>
          </div>
          <div className="flex items-center gap-2 text-muted-foreground">
            <Clock className="w-4 h-4" />
            <span>
              {format(new Date(booking.date), 'MMM d, yyyy')} • {booking.timeSlot.start} - {booking.timeSlot.end}
            </span>
          </div>
        </div>

        {/* Contact info */}
        <div className="space-y-1 text-sm">
          <div className="flex items-center gap-2 text-muted-foreground">
            <Mail className="w-4 h-4" />
            <span className="truncate">{booking.customerEmail}</span>
          </div>
          <div className="flex items-center gap-2 text-muted-foreground">
            <Phone className="w-4 h-4" />
            <span>{booking.customerPhone}</span>
          </div>
        </div>

        {/* Location if available */}
        {booking.location && (
          <div className="flex items-start gap-2 text-sm text-muted-foreground">
            <MapPin className="w-4 h-4 mt-0.5 flex-shrink-0" />
            <span className="break-words">{booking.location}</span>
          </div>
        )}

        {/* Price and staff if available */}
        <div className="flex items-center justify-between pt-2 border-t border-border">
          <div className="text-sm">
            {booking.totalPrice && <span className="font-semibold">${booking.totalPrice}</span>}
            {booking.staffAssigned && <p className="text-xs text-muted-foreground">Assigned: {booking.staffAssigned}</p>}
          </div>
          <Button size="sm" variant="ghost" className="ml-auto">
            View Details
          </Button>
        </div>
      </div>
    </Card>
  )
}
