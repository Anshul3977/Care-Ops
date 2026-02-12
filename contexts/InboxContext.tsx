'use client'

import React, { createContext, useContext, useEffect, useState } from 'react'
import { Message, ConversationThread } from '@/lib/inboxData'

interface InboxContextType {
  messages: Message[]
  threads: ConversationThread[]
  unreadCount: number
  selectedThread: ConversationThread | null
  searchQuery: string
  filterType: string | null
  isLoading: boolean
  selectThread: (thread: ConversationThread) => void
  markAsRead: (messageId: string) => void
  markThreadAsRead: (threadId: string) => void
  archiveThread: (threadId: string) => void
  restoreThread: (threadId: string) => void
  deleteThread: (threadId: string) => void
  sendMessage: (threadId: string, content: string) => void
  setSearchQuery: (query: string) => void
  setFilterType: (type: string | null) => void
}

const InboxContext = createContext<InboxContextType | undefined>(undefined)

export function InboxProvider({ children }: { children: React.ReactNode }) {
  const [messages, setMessages] = useState<Message[]>([])
  const [threads, setThreads] = useState<ConversationThread[]>([])
  const [unreadCount, setUnreadCount] = useState(0)
  const [selectedThread, setSelectedThread] = useState<ConversationThread | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [filterType, setFilterType] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  // Initialize with mock data
  useEffect(() => {
    const initializeInbox = async () => {
      try {
        const { MOCK_MESSAGES, MOCK_THREADS } = await import('@/lib/inboxData')

        setMessages(MOCK_MESSAGES)
        setThreads(MOCK_THREADS)

        // Calculate unread count
        const unread = MOCK_MESSAGES.filter((msg) => !msg.isRead).length
        setUnreadCount(unread)
      } catch (error) {
        console.error('Failed to load inbox data:', error)
      } finally {
        setIsLoading(false)
      }
    }

    initializeInbox()
  }, [])

  const selectThread = (thread: ConversationThread) => {
    setSelectedThread(thread)
  }

  const markAsRead = (messageId: string) => {
    setMessages((prevMessages) => {
      const updated = prevMessages.map((msg) => (msg.id === messageId ? { ...msg, isRead: true } : msg))

      // Update unread count
      const newUnreadCount = updated.filter((msg) => !msg.isRead).length
      setUnreadCount(newUnreadCount)

      return updated
    })

    // Update thread's unread count
    setThreads((prevThreads) =>
      prevThreads.map((thread) => {
        const updatedMessages = thread.messages.map((msg) => (msg.id === messageId ? { ...msg, isRead: true } : msg))
        return {
          ...thread,
          messages: updatedMessages,
          unreadCount: updatedMessages.filter((msg) => !msg.isRead).length,
        }
      })
    )
  }

  const markThreadAsRead = (threadId: string) => {
    setThreads((prevThreads) =>
      prevThreads.map((thread) => {
        if (thread.id === threadId) {
          const updatedMessages = thread.messages.map((msg) => ({ ...msg, isRead: true }))
          return { ...thread, messages: updatedMessages, unreadCount: 0 }
        }
        return thread
      })
    )

    setMessages((prevMessages) =>
      prevMessages.map((msg) => (msg.id === threadId ? { ...msg, isRead: true } : msg))
    )

    const newUnreadCount = messages.filter((msg) => !msg.isRead && msg.id !== threadId).length
    setUnreadCount(newUnreadCount)
  }

  const archiveThread = (threadId: string) => {
    setThreads((prevThreads) => prevThreads.map((thread) => (thread.id === threadId ? { ...thread, isArchived: true } : thread)))
    if (selectedThread?.id === threadId) {
      setSelectedThread(null)
    }
  }

  const restoreThread = (threadId: string) => {
    setThreads((prevThreads) => prevThreads.map((thread) => (thread.id === threadId ? { ...thread, isArchived: false } : thread)))
  }

  const deleteThread = (threadId: string) => {
    setThreads((prevThreads) => prevThreads.filter((thread) => thread.id !== threadId))
    if (selectedThread?.id === threadId) {
      setSelectedThread(null)
    }
  }

  const sendMessage = (threadId: string, content: string) => {
    const newMessage: Message = {
      id: `msg-${Date.now()}`,
      type: 'other',
      senderName: 'You',
      senderEmail: 'user@careops.com',
      subject: 'RE: ' + (selectedThread?.messages[0]?.subject || ''),
      content,
      timestamp: new Date(),
      isRead: true,
      channel: 'email',
      priority: 'normal',
    }

    setMessages((prev) => [newMessage, ...prev])
    setThreads((prevThreads) =>
      prevThreads.map((thread) => {
        if (thread.id === threadId) {
          return {
            ...thread,
            messages: [newMessage, ...thread.messages],
            lastMessageTime: new Date(),
          }
        }
        return thread
      })
    )
  }

  return (
    <InboxContext.Provider
      value={{
        messages,
        threads,
        unreadCount,
        selectedThread,
        searchQuery,
        filterType,
        isLoading,
        selectThread,
        markAsRead,
        markThreadAsRead,
        archiveThread,
        restoreThread,
        deleteThread,
        sendMessage,
        setSearchQuery,
        setFilterType,
      }}
    >
      {children}
    </InboxContext.Provider>
  )
}

export function useInbox() {
  const context = useContext(InboxContext)
  if (context === undefined) {
    throw new Error('useInbox must be used within InboxProvider')
  }
  return context
}
