import { MessageType } from '@/types'

export interface Message {
  id: string
  type: MessageType
  senderName: string
  senderEmail: string
  subject: string
  content: string
  timestamp: Date
  isRead: boolean
  relatedId?: string // Job ID, Customer ID, etc.
  channel: 'email' | 'sms' | 'contact_form' | 'system'
  priority: 'low' | 'normal' | 'high' | 'urgent'
  metadata?: Record<string, any>
}

export interface ConversationThread {
  id: string
  participantName: string
  participantEmail: string
  messages: Message[]
  lastMessageTime: Date
  unreadCount: number
  isArchived: boolean
}

export interface InboxStats {
  totalUnread: number
  totalMessages: number
  unreadByType: Record<MessageType, number>
}

// Mock messages data
export const MOCK_MESSAGES: Message[] = [
  {
    id: 'msg-1',
    type: 'booking_confirmation',
    senderName: 'John Smith',
    senderEmail: 'john@example.com',
    subject: 'Booking Confirmation - Home Inspection',
    content:
      'I would like to confirm my booking for the home inspection on March 15th at 2:00 PM. Please let me know if there are any additional details I need to provide.',
    timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
    isRead: false,
    channel: 'email',
    priority: 'high',
    relatedId: 'job-101',
  },
  {
    id: 'msg-2',
    type: 'customer_inquiry',
    senderName: 'Sarah Johnson',
    senderEmail: 'sarah.j@example.com',
    subject: 'Question About Service Package',
    content:
      'Hi, I was looking at your Premium package and had a few questions about the included services. Can we set up a time to discuss?',
    timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000), // 4 hours ago
    isRead: false,
    channel: 'contact_form',
    priority: 'normal',
  },
  {
    id: 'msg-3',
    type: 'payment_confirmation',
    senderName: 'System',
    senderEmail: 'noreply@careops.com',
    subject: 'Payment Received - Invoice #2024-031',
    content: 'Payment of $450.00 has been received for Invoice #2024-031. Thank you!',
    timestamp: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000), // 1 day ago
    isRead: true,
    channel: 'system',
    priority: 'normal',
  },
  {
    id: 'msg-4',
    type: 'booking_cancellation',
    senderName: 'Michael Davis',
    senderEmail: 'm.davis@example.com',
    subject: 'Booking Cancellation - March 18th Appointment',
    content: 'I need to cancel my scheduled appointment on March 18th. Can you please help me reschedule for a later date?',
    timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000), // 6 hours ago
    isRead: false,
    channel: 'email',
    priority: 'high',
    relatedId: 'job-105',
  },
  {
    id: 'msg-5',
    type: 'feedback_review',
    senderName: 'Emily Wilson',
    senderEmail: 'emily.w@example.com',
    subject: 'Service Review - 5 Stars!',
    content: 'Thank you for the excellent service! Your team was professional and thorough. Highly recommend!',
    timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2 days ago
    isRead: true,
    channel: 'contact_form',
    priority: 'low',
  },
  {
    id: 'msg-6',
    type: 'payment_reminder',
    senderName: 'System',
    senderEmail: 'noreply@careops.com',
    subject: 'Payment Due Reminder - Invoice #2024-030',
    content: 'This is a friendly reminder that payment for Invoice #2024-030 is due on March 20th.',
    timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000), // 3 days ago
    isRead: true,
    channel: 'email',
    priority: 'normal',
  },
]

export const MOCK_THREADS: ConversationThread[] = [
  {
    id: 'thread-1',
    participantName: 'John Smith',
    participantEmail: 'john@example.com',
    messages: [MOCK_MESSAGES[0]],
    lastMessageTime: MOCK_MESSAGES[0].timestamp,
    unreadCount: 1,
    isArchived: false,
  },
  {
    id: 'thread-2',
    participantName: 'Sarah Johnson',
    participantEmail: 'sarah.j@example.com',
    messages: [MOCK_MESSAGES[1]],
    lastMessageTime: MOCK_MESSAGES[1].timestamp,
    unreadCount: 1,
    isArchived: false,
  },
  {
    id: 'thread-3',
    participantName: 'Michael Davis',
    participantEmail: 'm.davis@example.com',
    messages: [MOCK_MESSAGES[3]],
    lastMessageTime: MOCK_MESSAGES[3].timestamp,
    unreadCount: 1,
    isArchived: false,
  },
]
