export interface WorkspaceConfig {
  businessName: string
  address: string
  timezone: string
  contactEmail: string
}

export interface EmailSmsConfig {
  emailProvider: 'sendgrid' | 'mailgun' | null
  smsProvider: 'twilio' | 'nexmo' | null
  emailConnected: boolean
  smsConnected: boolean
}

export interface ContactFormConfig {
  fields: {
    name: boolean
    email: boolean
    phone: boolean
    message: boolean
  }
  customFields?: Array<{
    id: string
    label: string
    type: 'text' | 'email' | 'phone' | 'textarea'
  }>
}

export interface BookingService {
  id: string
  name: string
  duration: number // in minutes
  location?: string
}

export interface BookingConfig {
  services: BookingService[]
  availability: {
    [key: string]: string[] // day of week -> time slots
  }
}

export interface PostBookingForm {
  id: string
  name: string
  url: string
  linkedServices: string[]
}

export interface PostBookingFormsConfig {
  forms: PostBookingForm[]
}

export interface InventoryItem {
  id: string
  name: string
  quantity: number
  lowStockThreshold: number
  usagePerBooking: number
}

export interface InventoryConfig {
  items: InventoryItem[]
}

export interface StaffMember {
  id: string
  email: string
  name?: string
  permissions: {
    inbox: boolean
    bookings: boolean
    forms: boolean
    inventory: boolean
  }
  status: 'pending' | 'active'
  invitedAt: Date
  activatedAt?: Date
}

export interface StaffConfig {
  members: StaffMember[]
}

export interface OnboardingState {
  currentStep: number
  completed: {
    step1: boolean
    step2: boolean
    step3: boolean
    step4: boolean
    step5: boolean
    step6: boolean
    step7: boolean
    step8: boolean
  }
  workspace: WorkspaceConfig | null
  emailSms: EmailSmsConfig | null
  contactForm: ContactFormConfig | null
  booking: BookingConfig | null
  postBookingForms: PostBookingFormsConfig | null
  inventory: InventoryConfig | null
  staff: StaffConfig | null
  workspaceActivated: boolean
}

export const initialOnboardingState: OnboardingState = {
  currentStep: 1,
  completed: {
    step1: false,
    step2: false,
    step3: false,
    step4: false,
    step5: false,
    step6: false,
    step7: false,
    step8: false,
  },
  workspace: null,
  emailSms: null,
  contactForm: null,
  booking: null,
  postBookingForms: null,
  inventory: null,
  staff: null,
  workspaceActivated: false,
}

export const timezones = [
  'America/New_York',
  'America/Chicago',
  'America/Denver',
  'America/Los_Angeles',
  'America/Anchorage',
  'Pacific/Honolulu',
  'Europe/London',
  'Europe/Paris',
  'Europe/Berlin',
  'Asia/Tokyo',
  'Asia/Shanghai',
  'Asia/Hong_Kong',
  'Australia/Sydney',
]

export const serviceDurations = [
  { label: '15 minutes', value: 15 },
  { label: '30 minutes', value: 30 },
  { label: '1 hour', value: 60 },
  { label: '1.5 hours', value: 90 },
  { label: '2 hours', value: 120 },
  { label: '3 hours', value: 180 },
  { label: '4 hours', value: 240 },
  { label: '8 hours', value: 480 },
]

export const daysOfWeek = [
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday',
  'Sunday',
]

export const timeSlots = [
  '8:00 AM',
  '8:30 AM',
  '9:00 AM',
  '9:30 AM',
  '10:00 AM',
  '10:30 AM',
  '11:00 AM',
  '11:30 AM',
  '12:00 PM',
  '12:30 PM',
  '1:00 PM',
  '1:30 PM',
  '2:00 PM',
  '2:30 PM',
  '3:00 PM',
  '3:30 PM',
  '4:00 PM',
  '4:30 PM',
  '5:00 PM',
  '5:30 PM',
  '6:00 PM',
]
