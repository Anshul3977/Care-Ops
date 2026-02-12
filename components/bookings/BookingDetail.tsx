'use client'

import React, { useState } from 'react'
import { useBookings } from '@/contexts/BookingsContext'
import { BookingStatus, getBookingStatusColor, getBookingStatusLabel } from '@/lib/bookingsData'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Select } from '@/components/ui/select'
import { User, Phone, Mail, MapPin, Clock, DollarSign, Users, Calendar, Edit, MessageSquare } from 'lucide-react'
import { format } from 'date-fns'

export function BookingDetail() {
  const { selectedBooking, updateBookingStatus } = useBookings()
  const [isEditingStatus, setIsEditingStatus] = useState(false)
  const [newStatus, setNewStatus] = useState<BookingStatus | ''>(selectedBooking?.status || '')

  if (!selectedBooking) {
    return (
      <div className="flex items-center justify-center h-full text-muted-foreground">
        <div className="text-center">
          <Calendar className="w-12 h-12 mx-auto mb-4 opacity-50" />
          <p>Select a booking to view details</p>
        </div>
      </div>
    )
  }

  const handleStatusChange = () => {
    if (newStatus && newStatus !== selectedBooking.status) {
      updateBookingStatus(selectedBooking.id, newStatus as BookingStatus)
      setIsEditingStatus(false)
    }
  }

  return (
    <div className="space-y-4 h-full overflow-y-auto">
      {/* Header */}
      <div className="space-y-3">
        <div className="flex items-start justify-between">
          <div>
            <h2 className="text-2xl font-bold">{selectedBooking.customerName}</h2>
            <p className="text-muted-foreground">{selectedBooking.serviceTitle}</p>
          </div>
          <Badge className={getBookingStatusColor(selectedBooking.status)}>
            {getBookingStatusLabel(selectedBooking.status)}
          </Badge>
        </div>

        {/* Status Update */}
        {isEditingStatus ? (
          <div className="flex gap-2">
            <select
              value={newStatus}
              onChange={(e) => setNewStatus(e.target.value as BookingStatus)}
              className="px-3 py-2 border border-border rounded-md bg-background text-foreground"
            >
              <option value="">Select status...</option>
              <option value="pending">Pending</option>
              <option value="confirmed">Confirmed</option>
              <option value="completed">Completed</option>
              <option value="cancelled">Cancelled</option>
              <option value="no_show">No Show</option>
            </select>
            <Button onClick={handleStatusChange} size="sm">
              Save
            </Button>
            <Button onClick={() => setIsEditingStatus(false)} size="sm" variant="outline">
              Cancel
            </Button>
          </div>
        ) : (
          <Button onClick={() => setIsEditingStatus(true)} size="sm" variant="outline" className="gap-2">
            <Edit className="w-4 h-4" />
            Change Status
          </Button>
        )}
      </div>

      {/* Date & Time */}
      <Card className="p-4">
        <div className="space-y-3">
          <h3 className="font-semibold flex items-center gap-2">
            <Clock className="w-4 h-4 text-primary" />
            Date & Time
          </h3>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-muted-foreground text-xs font-medium">Date</p>
              <p className="font-semibold">{format(new Date(selectedBooking.date), 'EEEE, MMMM d, yyyy')}</p>
            </div>
            <div>
              <p className="text-muted-foreground text-xs font-medium">Time</p>
              <p className="font-semibold">
                {selectedBooking.timeSlot.start} - {selectedBooking.timeSlot.end}
              </p>
            </div>
          </div>
        </div>
      </Card>

      {/* Customer Info */}
      <Card className="p-4">
        <div className="space-y-3">
          <h3 className="font-semibold flex items-center gap-2">
            <User className="w-4 h-4 text-primary" />
            Customer Information
          </h3>
          <div className="space-y-2 text-sm">
            <div className="flex items-center gap-2">
              <Mail className="w-4 h-4 text-muted-foreground" />
              <a href={`mailto:${selectedBooking.customerEmail}`} className="text-primary hover:underline">
                {selectedBooking.customerEmail}
              </a>
            </div>
            <div className="flex items-center gap-2">
              <Phone className="w-4 h-4 text-muted-foreground" />
              <a href={`tel:${selectedBooking.customerPhone}`} className="text-primary hover:underline">
                {selectedBooking.customerPhone}
              </a>
            </div>
          </div>
        </div>
      </Card>

      {/* Service Details */}
      <Card className="p-4">
        <div className="space-y-3">
          <h3 className="font-semibold flex items-center gap-2">
            <Users className="w-4 h-4 text-primary" />
            Service Details
          </h3>
          <div className="space-y-2 text-sm">
            {selectedBooking.location && (
              <div className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-muted-foreground mt-0.5" />
                <div>
                  <p className="text-muted-foreground text-xs font-medium">Location</p>
                  <p>{selectedBooking.location}</p>
                </div>
              </div>
            )}
            {selectedBooking.totalPrice && (
              <div className="flex items-center gap-2 pt-2 border-t border-border">
                <DollarSign className="w-4 h-4 text-muted-foreground" />
                <div>
                  <p className="text-muted-foreground text-xs font-medium">Total Price</p>
                  <p className="font-semibold">${selectedBooking.totalPrice}</p>
                </div>
              </div>
            )}
            {selectedBooking.staffAssigned && (
              <div className="flex items-center gap-2 pt-2 border-t border-border">
                <Users className="w-4 h-4 text-muted-foreground" />
                <div>
                  <p className="text-muted-foreground text-xs font-medium">Staff Assigned</p>
                  <p>{selectedBooking.staffAssigned}</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </Card>

      {/* Notes */}
      {selectedBooking.notes && (
        <Card className="p-4">
          <div className="space-y-3">
            <h3 className="font-semibold">Notes</h3>
            <p className="text-sm text-muted-foreground">{selectedBooking.notes}</p>
          </div>
        </Card>
      )}

      {/* Action Buttons */}
      <div className="flex gap-2 pt-4 border-t border-border">
        <Button className="gap-2" variant="outline" size="sm">
          <MessageSquare className="w-4 h-4" />
          Send Message
        </Button>
        <Button variant="outline" size="sm">
          Edit Booking
        </Button>
      </div>
    </div>
  )
}
