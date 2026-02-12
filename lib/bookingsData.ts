export type BookingStatus = 'confirmed' | 'pending' | 'completed' | 'cancelled' | 'no_show'
export type BookingType = 'service' | 'consultation' | 'inspection' | 'installation' | 'maintenance'

export interface TimeSlot {
  start: string // HH:mm format
  end: string // HH:mm format
}

export interface Booking {
  id: string
  customerId: string
  customerName: string
  customerEmail: string
  customerPhone: string
  service: BookingType
  serviceTitle: string
  date: Date
  timeSlot: TimeSlot
  status: BookingStatus
  notes?: string
  location?: string
  totalPrice?: number
  staffAssigned?: string
  createdAt: Date
  updatedAt: Date
}

export interface BookingType {
  id: string
  name: string
  description: string
  duration: number // in minutes
  price?: number
  capacity: number
  isActive: boolean
}

export interface CalendarDay {
  date: Date
  bookings: Booking[]
  isToday: boolean
  isWeekend: boolean
}

export interface BookingStats {
  totalBookings: number
  confirmedBookings: number
  pendingBookings: number
  completedBookings: number
  cancelledBookings: number
  noShowBookings: number
  occupancyRate: number
}

// Mock booking types
export const MOCK_BOOKING_TYPES: BookingType[] = [
  {
    id: 'type-1',
    name: 'Home Inspection',
    description: 'Comprehensive property inspection',
    duration: 120,
    price: 250,
    capacity: 1,
    isActive: true,
  },
  {
    id: 'type-2',
    name: 'Consultation',
    description: 'Initial consultation call',
    duration: 30,
    price: 0,
    capacity: 1,
    isActive: true,
  },
  {
    id: 'type-3',
    name: 'Installation Service',
    description: 'System installation service',
    duration: 180,
    price: 500,
    capacity: 2,
    isActive: true,
  },
  {
    id: 'type-4',
    name: 'Maintenance Visit',
    description: 'Routine maintenance',
    duration: 90,
    price: 150,
    capacity: 1,
    isActive: true,
  },
]

// Mock bookings
export const MOCK_BOOKINGS: Booking[] = [
  {
    id: 'booking-1',
    customerId: 'cust-1',
    customerName: 'John Smith',
    customerEmail: 'john@example.com',
    customerPhone: '(555) 123-4567',
    service: 'inspection',
    serviceTitle: 'Home Inspection',
    date: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000), // Tomorrow
    timeSlot: { start: '10:00', end: '12:00' },
    status: 'confirmed',
    location: '123 Main St, Springfield, IL',
    totalPrice: 250,
    staffAssigned: 'Mike Johnson',
    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
    updatedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
  },
  {
    id: 'booking-2',
    customerId: 'cust-2',
    customerName: 'Sarah Wilson',
    customerEmail: 'sarah@example.com',
    customerPhone: '(555) 234-5678',
    service: 'consultation',
    serviceTitle: 'Consultation',
    date: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000),
    timeSlot: { start: '14:00', end: '14:30' },
    status: 'pending',
    createdAt: new Date(Date.now() - 1 * 60 * 60 * 1000),
    updatedAt: new Date(Date.now() - 1 * 60 * 60 * 1000),
  },
  {
    id: 'booking-3',
    customerId: 'cust-3',
    customerName: 'Michael Brown',
    customerEmail: 'michael@example.com',
    customerPhone: '(555) 345-6789',
    service: 'installation',
    serviceTitle: 'Installation Service',
    date: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000), // In 2 days
    timeSlot: { start: '09:00', end: '12:00' },
    status: 'confirmed',
    location: '456 Oak Ave, Springfield, IL',
    totalPrice: 500,
    staffAssigned: 'Sarah Lee',
    createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
    updatedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
  },
  {
    id: 'booking-4',
    customerId: 'cust-4',
    customerName: 'Emily Davis',
    customerEmail: 'emily@example.com',
    customerPhone: '(555) 456-7890',
    service: 'maintenance',
    serviceTitle: 'Maintenance Visit',
    date: new Date(Date.now()), // Today
    timeSlot: { start: '11:00', end: '12:30' },
    status: 'completed',
    location: '789 Pine Rd, Springfield, IL',
    totalPrice: 150,
    staffAssigned: 'John Davis',
    createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
    updatedAt: new Date(Date.now() - 2 * 60 * 60 * 1000),
  },
  {
    id: 'booking-5',
    customerId: 'cust-5',
    customerName: 'Robert Taylor',
    customerEmail: 'robert@example.com',
    customerPhone: '(555) 567-8901',
    service: 'inspection',
    serviceTitle: 'Home Inspection',
    date: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
    timeSlot: { start: '15:00', end: '17:00' },
    status: 'confirmed',
    location: '321 Elm St, Springfield, IL',
    totalPrice: 250,
    staffAssigned: 'Mike Johnson',
    createdAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000),
    updatedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
  },
  {
    id: 'booking-6',
    customerId: 'cust-6',
    customerName: 'Jessica Martinez',
    customerEmail: 'jessica@example.com',
    customerPhone: '(555) 678-9012',
    service: 'consultation',
    serviceTitle: 'Consultation',
    date: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000),
    timeSlot: { start: '16:00', end: '16:30' },
    status: 'no_show',
    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
    updatedAt: new Date(Date.now() - 1 * 60 * 60 * 1000),
  },
]

export const getBookingStatusColor = (status: BookingStatus): string => {
  switch (status) {
    case 'confirmed':
      return 'bg-green-100 text-green-800 border-green-300'
    case 'pending':
      return 'bg-yellow-100 text-yellow-800 border-yellow-300'
    case 'completed':
      return 'bg-blue-100 text-blue-800 border-blue-300'
    case 'cancelled':
      return 'bg-gray-100 text-gray-800 border-gray-300'
    case 'no_show':
      return 'bg-red-100 text-red-800 border-red-300'
    default:
      return 'bg-gray-100 text-gray-800 border-gray-300'
  }
}

export const getBookingStatusLabel = (status: BookingStatus): string => {
  const labels: Record<BookingStatus, string> = {
    confirmed: 'Confirmed',
    pending: 'Pending',
    completed: 'Completed',
    cancelled: 'Cancelled',
    no_show: 'No Show',
  }
  return labels[status] || 'Unknown'
}
