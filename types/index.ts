export type UserRole = 'ADMIN' | 'STAFF' | 'NONE'
export type MessageType =
  | 'booking_confirmation'
  | 'customer_inquiry'
  | 'payment_confirmation'
  | 'booking_cancellation'
  | 'feedback_review'
  | 'payment_reminder'
  | 'other'

export interface User {
  id: string
  email: string
  name: string
  role: UserRole
  createdAt: Date
}

export interface AuthContextType {
  user: User | null
  isLoading: boolean
  error: string | null
  login: (email: string, password: string) => Promise<void>
  signup: (email: string, password: string, name: string, role?: UserRole) => Promise<void>
  logout: () => void
}
