'use client'

import React, { createContext, useContext, useEffect, useState } from 'react'
import { Booking, BookingStatus, BookingStats, MOCK_BOOKINGS } from '@/lib/bookingsData'

interface BookingsContextType {
  bookings: Booking[]
  filteredBookings: Booking[]
  selectedBooking: Booking | null
  stats: BookingStats
  filterStatus: BookingStatus | 'all'
  searchQuery: string
  isLoading: boolean
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

  // Initialize with mock data
  useEffect(() => {
    const initializeBookings = async () => {
      try {
        setBookings(MOCK_BOOKINGS)
        calculateStats(MOCK_BOOKINGS)
      } catch (error) {
        console.error('Failed to load bookings data:', error)
      } finally {
        setIsLoading(false)
      }
    }

    initializeBookings()
  }, [])

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

  const updateBookingStatus = (bookingId: string, status: BookingStatus) => {
    const updated = bookings.map((booking) =>
      booking.id === bookingId ? { ...booking, status, updatedAt: new Date() } : booking
    )
    setBookings(updated)
    calculateStats(updated)

    if (selectedBooking?.id === bookingId) {
      setSelectedBooking({ ...selectedBooking, status })
    }
  }

  const getUpcomingBookings = () => {
    const now = new Date()
    return bookings
      .filter(
        (b) =>
          b.date > now &&
          (b.status === 'confirmed' || b.status === 'pending') &&
          b.status !== 'cancelled'
      )
      .sort((a, b) => a.date.getTime() - b.date.getTime())
      .slice(0, 5)
  }

  const getTodayBookings = () => {
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    const tomorrow = new Date(today)
    tomorrow.setDate(tomorrow.getDate() + 1)

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
    const nextDate = new Date(targetDate)
    nextDate.setDate(nextDate.getDate() + 1)

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
