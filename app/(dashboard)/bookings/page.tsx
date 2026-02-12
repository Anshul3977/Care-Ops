'use client'

import React from 'react'
import { BookingsProvider, useBookings } from '@/contexts/BookingsContext'
import { BookingCard } from '@/components/bookings/BookingCard'
import { BookingDetail } from '@/components/bookings/BookingDetail'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Calendar, Plus, Search, Filter } from 'lucide-react'

function BookingsContent() {
  const { filteredBookings, selectedBooking, selectBooking, stats, setFilterStatus, setSearchQuery, searchQuery, filterStatus } =
    useBookings()

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Bookings</h1>
            <p className="text-muted-foreground mt-1">Manage all your service bookings and appointments</p>
          </div>
          <Button className="gap-2">
            <Plus className="w-4 h-4" />
            New Booking
          </Button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          <Card className="p-3 text-center">
            <p className="text-2xl font-bold text-primary">{stats.totalBookings}</p>
            <p className="text-xs text-muted-foreground">Total</p>
          </Card>
          <Card className="p-3 text-center">
            <p className="text-2xl font-bold text-green-600">{stats.confirmedBookings}</p>
            <p className="text-xs text-muted-foreground">Confirmed</p>
          </Card>
          <Card className="p-3 text-center">
            <p className="text-2xl font-bold text-yellow-600">{stats.pendingBookings}</p>
            <p className="text-xs text-muted-foreground">Pending</p>
          </Card>
          <Card className="p-3 text-center">
            <p className="text-2xl font-bold text-blue-600">{stats.completedBookings}</p>
            <p className="text-xs text-muted-foreground">Completed</p>
          </Card>
          <Card className="p-3 text-center">
            <p className="text-2xl font-bold text-red-600">{stats.cancelledBookings}</p>
            <p className="text-xs text-muted-foreground">Cancelled</p>
          </Card>
          <Card className="p-3 text-center">
            <p className="text-2xl font-bold text-orange-600">{Math.round(stats.occupancyRate)}%</p>
            <p className="text-xs text-muted-foreground">Occupancy</p>
          </Card>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-2 items-center">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search bookings..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>

        <div className="flex gap-2 flex-wrap">
          <Button
            variant={filterStatus === 'all' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setFilterStatus('all')}
          >
            All
          </Button>
          <Button
            variant={filterStatus === 'confirmed' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setFilterStatus('confirmed')}
          >
            Confirmed
          </Button>
          <Button
            variant={filterStatus === 'pending' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setFilterStatus('pending')}
          >
            Pending
          </Button>
          <Button
            variant={filterStatus === 'completed' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setFilterStatus('completed')}
          >
            Completed
          </Button>
        </div>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 min-h-[600px]">
        {/* Bookings List */}
        <Card className="lg:col-span-1 p-4">
          <div className="space-y-3 h-full overflow-y-auto">
            {filteredBookings.length === 0 ? (
              <div className="text-center text-muted-foreground py-8">
                <Calendar className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p>No bookings found</p>
              </div>
            ) : (
              filteredBookings.map((booking) => (
                <BookingCard
                  key={booking.id}
                  booking={booking}
                  isSelected={selectedBooking?.id === booking.id}
                  onClick={() => selectBooking(booking)}
                />
              ))
            )}
          </div>
        </Card>

        {/* Booking Detail */}
        <Card className="lg:col-span-2 p-4">
          <BookingDetail />
        </Card>
      </div>
    </div>
  )
}

export default function BookingsPage() {
  return (
    <BookingsProvider>
      <BookingsContent />
    </BookingsProvider>
  )
}
