'use client'

import React, { createContext, useContext, useEffect, useState } from 'react'
import { Booking, BookingStatus, BookingStats } from '@/lib/bookingsData'
import { supabase } from '@/lib/supabase'
import { useAuth } from '@/contexts/AuthContext'

interface BookingsContextType {
  bookings: Booking[]
  filteredBookings: Booking[]
  selectedBooking: Booking | null
  stats: BookingStats
  filterStatus: BookingStatus | 'all'
  searchQuery: string
  isLoading: boolean
  error: string | null
  selectBooking: (booking: Booking) => void
  setFilterStatus: (status: BookingStatus | 'all') => void
  setSearchQuery: (query: string) => void
  updateBookingStatus: (bookingId: string, status: BookingStatus) => void
  getUpcomingBookings: () => Booking[]
  getTodayBookings: () => Booking[]
  getBookingsByDate: (date: Date) => Booking[]
}

const BookingsContext = createContext<BookingsContextType | undefined>(undefined)

export function BookingsProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth()
  const [bookings, setBookings] = useState<Booking[]>([])
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null)
  const [filterStatus, setFilterStatus] = useState<BookingStatus | 'all'>('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [stats, setStats] = useState<BookingStats>({
    totalBookings: 0,
    confirmedBookings: 0,
    pendingBookings: 0,
    completedBookings: 0,
    cancelledBookings: 0,
    noShowBookings: 0,
    occupancyRate: 0,
  })
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Helper: compute end time from start + duration
  function computeEndTime(start: string, durationMinutes: number): string {
    const [h, m] = start.split(':').map(Number)
    const totalMinutes = h * 60 + m + durationMinutes
    const endH = Math.floor(totalMinutes / 60) % 24
    const endM = totalMinutes % 60
    return `${String(endH).padStart(2, '0')}:${String(endM).padStart(2, '0')}`
  }

  // Map a Supabase booking row (with joined contact + booking_type) to our Booking interface
  function mapDbBooking(row: any): Booking {
    const contact = row.contact as { name: string; email: string | null; phone: string | null } | null
    const bookingType = row.booking_type as { name: string; duration_minutes: number; price: number | null } | null

    const startTime = row.booking_time || '09:00'
    const duration = bookingType?.duration_minutes ?? 60
    const endTime = computeEndTime(startTime, duration)

    return {
      id: row.id,
      customerId: row.contact_id || '',
      customerName: contact?.name || 'Unknown',
      customerEmail: contact?.email || '',
      customerPhone: contact?.phone || '',
      service: 'service', // Default; DB doesn't have the BookingType union
      serviceTitle: bookingType?.name || 'Service',
      date: new Date(row.booking_date),
      timeSlot: { start: startTime, end: endTime },
      status: row.status as BookingStatus,
      notes: row.notes || undefined,
      totalPrice: bookingType?.price ?? undefined,
      staffAssigned: row.assigned_to || undefined,
      createdAt: new Date(row.created_at),
      updatedAt: new Date(row.updated_at),
    }
  }

  // Fetch bookings from Supabase
  useEffect(() => {
    const fetchBookings = async () => {
      if (!user?.workspaceId) {
        setIsLoading(false)
        return
      }

      try {
        setIsLoading(true)
        setError(null)

        const { data, error: fetchError } = await supabase
          .from('bookings')
          .select(`
            *,
            contact:contacts(name, email, phone),
            booking_type:booking_types(name, duration_minutes, price)
          `)
          .eq('workspace_id', user.workspaceId)
          .order('booking_date', { ascending: false })

        if (fetchError) throw fetchError

        const mapped = (data || []).map(mapDbBooking)
        setBookings(mapped)
        calculateStats(mapped)
      } catch (err) {
        console.error('Failed to load bookings:', err)
        setError('Failed to load bookings')
      } finally {
        setIsLoading(false)
      }
    }

    fetchBookings()
  }, [user?.workspaceId])

  const calculateStats = (bookingsList: Booking[]) => {
    const confirmed = bookingsList.filter((b) => b.status === 'confirmed').length
    const pending = bookingsList.filter((b) => b.status === 'pending').length
    const completed = bookingsList.filter((b) => b.status === 'completed').length
    const cancelled = bookingsList.filter((b) => b.status === 'cancelled').length
    const noShow = bookingsList.filter((b) => b.status === 'no_show').length

    setStats({
      totalBookings: bookingsList.length,
      confirmedBookings: confirmed,
      pendingBookings: pending,
      completedBookings: completed,
      cancelledBookings: cancelled,
      noShowBookings: noShow,
      occupancyRate: bookingsList.length > 0 ? (confirmed / bookingsList.length) * 100 : 0,
    })
  }

  const filteredBookings = bookings.filter((booking) => {
    if (filterStatus !== 'all' && booking.status !== filterStatus) return false

    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      return (
        booking.customerName.toLowerCase().includes(query) ||
        booking.customerEmail.toLowerCase().includes(query) ||
        booking.customerPhone.includes(query) ||
        booking.serviceTitle.toLowerCase().includes(query)
      )
    }

    return true
  })

  const selectBooking = (booking: Booking) => {
    setSelectedBooking(booking)
  }

  const updateBookingStatus = async (bookingId: string, status: BookingStatus) => {
    // Optimistically update local state
    const updated = bookings.map((booking) =>
      booking.id === bookingId ? { ...booking, status, updatedAt: new Date() } : booking
    )
    setBookings(updated)
    calculateStats(updated)

    if (selectedBooking?.id === bookingId) {
      setSelectedBooking({ ...selectedBooking, status })
    }

    // Persist to Supabase
    try {
      const { error: updateError } = await supabase
        .from('bookings')
        .update({ status })
        .eq('id', bookingId)

      if (updateError) {
        console.error('Failed to update booking status in DB:', updateError)
        // Revert optimistic update on failure
        const reverted = bookings // original state before update
        setBookings(reverted)
        calculateStats(reverted)
      }
    } catch (err) {
      console.error('Error updating booking status:', err)
    }
  }

  const getUpcomingBookings = () => {
    const now = new Date()
    return bookings
      .filter(
        (b) =>
          b.date > now &&
          (b.status === 'confirmed' || b.status === 'pending')
      )
      .sort((a, b) => a.date.getTime() - b.date.getTime())
      .slice(0, 5)
  }

  const getTodayBookings = () => {
    const today = new Date()
    today.setHours(0, 0, 0, 0)

    return bookings
      .filter((b) => {
        const bookingDate = new Date(b.date)
        bookingDate.setHours(0, 0, 0, 0)
        return bookingDate.getTime() === today.getTime()
      })
      .sort((a, b) => {
        const [aHour, aMin] = a.timeSlot.start.split(':').map(Number)
        const [bHour, bMin] = b.timeSlot.start.split(':').map(Number)
        return aHour * 60 + aMin - (bHour * 60 + bMin)
      })
  }

  const getBookingsByDate = (date: Date) => {
    const targetDate = new Date(date)
    targetDate.setHours(0, 0, 0, 0)

    return bookings
      .filter((b) => {
        const bookingDate = new Date(b.date)
        bookingDate.setHours(0, 0, 0, 0)
        return bookingDate.getTime() === targetDate.getTime()
      })
      .sort((a, b) => {
        const [aHour, aMin] = a.timeSlot.start.split(':').map(Number)
        const [bHour, bMin] = b.timeSlot.start.split(':').map(Number)
        return aHour * 60 + aMin - (bHour * 60 + bMin)
      })
  }

  return (
    <BookingsContext.Provider
      value={{
        bookings,
        filteredBookings,
        selectedBooking,
        stats,
        filterStatus,
        searchQuery,
        isLoading,
        error,
        selectBooking,
        setFilterStatus,
        setSearchQuery,
        updateBookingStatus,
        getUpcomingBookings,
        getTodayBookings,
        getBookingsByDate,
      }}
    >
      {children}
    </BookingsContext.Provider>
  )
}

export function useBookings() {
  const context = useContext(BookingsContext)
  if (context === undefined) {
    throw new Error('useBookings must be used within BookingsProvider')
  }
  return context
}
