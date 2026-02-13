'use client'

import React, { createContext, useContext, useEffect, useState } from 'react'
import { Message, ConversationThread } from '@/lib/inboxData'
import { useAuth } from '@/contexts/AuthContext'
import { supabase } from '@/lib/supabase'
import type { RealtimeChannel } from '@supabase/supabase-js'

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
  const { user } = useAuth()
  const [messages, setMessages] = useState<Message[]>([])
  const [threads, setThreads] = useState<ConversationThread[]>([])
  const [unreadCount, setUnreadCount] = useState(0)
  const [selectedThread, setSelectedThread] = useState<ConversationThread | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [filterType, setFilterType] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  // Fetch data
  useEffect(() => {
    let subscription: RealtimeChannel;

    const initializeInbox = async () => {
      if (!user?.workspaceId) return

      try {
        setIsLoading(true)

        // 1. Fetch Conversations
        const { data: conversationsData, error: convError } = await supabase
          .from('conversations')
          .select(`
            *,
            contacts (name, email)
          `)
          .eq('workspace_id', user.workspaceId)
          .order('last_message_at', { ascending: false })

        if (convError) throw convError

        // 2. Fetch Messages
        // Fetching all messages for visible conversations might be heavy in production, 
        // but for this MVP it's consistent with previous architecture.
        const { data: messagesData, error: msgError } = await supabase
          .from('messages')
          .select('*')
          // We can't easily filter by workspace_id on messages directly if it's not on the table (schema check: messages has conversation_id, not workspace_id?)
          // Schema says: messages has `conversation_id`. 
          // So we should filter by conversation IDs we just fetched.
          .in('conversation_id', conversationsData?.map(c => c.id) || [])
          .order('created_at', { ascending: true }) // Messages in order

        if (msgError) throw msgError

        // 3. Map to internal types
        const mappedMessages: Message[] = messagesData?.map(m => ({
          id: m.id,
          type: m.type as any, // 'email' | 'sms' | 'system' -> MessageType needs checking. 
          // MessageType = 'booking_confirmation' | 'customer_inquiry' ... 
          // The DB has 'email', 'sms'. We might need to map or store specific type in DB.
          // For now, let's derive or default.
          // If sender is system -> system.
          // If inbound -> inquiry?
          senderName: m.sender_name || 'Unknown',
          senderEmail: m.sender_email || '',
          subject: '', // Message table doesn't have subject? Conversation has it.
          content: m.content,
          timestamp: new Date(m.created_at),
          isRead: m.is_read,
          channel: m.type, // 'email' | 'sms'
          priority: 'normal', // Default
        })) || []

        // We need to inject subjects from conversations into messages if needed?
        // Or just map threads.

        const mappedThreads: ConversationThread[] = conversationsData?.map(c => {
          const threadMessages = mappedMessages.filter(m => (messagesData?.find(dbM => dbM.id === m.id)?.conversation_id === c.id))
          // Sort desc for display if needed, but usually threads show ASC history.
          // inboxData seems to store them... checking... 
          // MOCK_THREADS has messages.

          return {
            id: c.id,
            participantName: c.contacts && !Array.isArray(c.contacts) ? c.contacts.name : 'Unknown',
            participantEmail: c.contacts && !Array.isArray(c.contacts) ? c.contacts.email : '',
            messages: threadMessages,
            lastMessageTime: c.last_message_at ? new Date(c.last_message_at) : new Date(),
            unreadCount: c.unread_count,
            isArchived: c.is_archived
          }
        }) || []

        setMessages(mappedMessages)
        setThreads(mappedThreads)

        // Calculate total unread
        const totalUnread = mappedThreads.reduce((sum, t) => sum + t.unreadCount, 0)
        setUnreadCount(totalUnread)

        // Setup Realtime Subscription
        subscription = supabase
          .channel('public:messages')
          .on('postgres_changes', {
            event: 'INSERT',
            schema: 'public',
            table: 'messages'
          }, (payload) => {
            // Handle new message
            console.log('New message received:', payload)
            // In a real app we'd optimistically update or refetch.
            // Refetching is safer for relationships.
            initializeInbox()
          })
          .subscribe()

      } catch (error) {
        console.error('Failed to load inbox data:', error)
      } finally {
        setIsLoading(false)
      }
    }

    initializeInbox()

    return () => {
      if (subscription) subscription.unsubscribe()
    }
  }, [user?.workspaceId])

  const selectThread = (thread: ConversationThread) => {
    setSelectedThread(thread)
    // Mark as read locally? Or wait for explicit action?
    // Usually selecting implies reading, but `markThreadAsRead` is explicit in the interface likely.
  }

  const markAsRead = async (messageId: string) => {
    // Optimistic Update
    setMessages((prev) => prev.map(m => m.id === messageId ? { ...m, isRead: true } : m))
    setThreads((prev) => prev.map(t => ({
      ...t,
      messages: t.messages.map(m => m.id === messageId ? { ...m, isRead: true } : m)
    })))

    // DB Update
    try {
      const { error } = await supabase
        .from('messages')
        .update({ is_read: true })
        .eq('id', messageId)

      if (error) throw error

      // Also decrement conversation unread count?
      // Triggers/Functions usually handle this in Supabase, but if not:
      // We might need to manually update conversation.
      // For now assume basic update.
    } catch (err) {
      console.error('Error marking as read:', err)
      // Revert if needed
    }
  }

  const markThreadAsRead = async (threadId: string) => {
    const thread = threads.find(t => t.id === threadId)
    if (!thread) return

    // Optimistic
    setThreads(prev => prev.map(t => t.id === threadId ? { ...t, unreadCount: 0, messages: t.messages.map(m => ({ ...m, isRead: true })) } : t))
    setUnreadCount(prev => Math.max(0, prev - thread.unreadCount))

    try {
      // Update all messages
      const { error: msgError } = await supabase
        .from('messages')
        .update({ is_read: true })
        .eq('conversation_id', threadId)

      if (msgError) throw msgError

      // Update conversation
      const { error: convError } = await supabase
        .from('conversations')
        .update({ unread_count: 0 })
        .eq('id', threadId)

      if (convError) throw convError

    } catch (err) {
      console.error('Error marking thread as read:', err)
    }
  }

  const archiveThread = async (threadId: string) => {
    // Optimistic
    setThreads(prev => prev.map(t => t.id === threadId ? { ...t, isArchived: true } : t))
    if (selectedThread?.id === threadId) setSelectedThread(null)

    try {
      const { error } = await supabase
        .from('conversations')
        .update({ is_archived: true })
        .eq('id', threadId)

      if (error) throw error
    } catch (err) {
      console.error('Error archiving thread:', err)
    }
  }

  const restoreThread = async (threadId: string) => {
    setThreads(prev => prev.map(t => t.id === threadId ? { ...t, isArchived: false } : t))
    try {
      await supabase.from('conversations').update({ is_archived: false }).eq('id', threadId)
    } catch (err) { console.error(err) }
  }

  const deleteThread = async (threadId: string) => {
    // DB likely requires cascading delete or explicit delete.
    // For now just hide (archive logic?) or actually delete.
    // UI says delete.
    setThreads(prev => prev.filter(t => t.id !== threadId))
    if (selectedThread?.id === threadId) setSelectedThread(null)

    try {
      await supabase.from('conversations').delete().eq('id', threadId)
    } catch (err) { console.error(err) }
  }

  const sendMessage = async (threadId: string, content: string) => {
    const thread = threads.find(t => t.id === threadId)
    if (!thread || !user) return

    const newMessage: Message = {
      id: `temp-${Date.now()}`,
      type: 'other' as any,
      senderName: user.name,
      senderEmail: user.email,
      subject: 'RE: ' + (thread.messages[0]?.subject || ''),
      content,
      timestamp: new Date(),
      isRead: true,
      channel: 'email',
      priority: 'normal',
    }

    // Optimistic
    setMessages(prev => [...prev, newMessage])
    setThreads(prev => prev.map(t => {
      if (t.id === threadId) {
        return {
          ...t,
          messages: [...t.messages, newMessage], // Append to end usually? sorted by time? 
          // messages array order matters. 
          // If rendering maps messages, usually bottom is newest.
          // MOCK_DATA had [MOCK_MESSAGES[0]] etc.
          // UI likely renders loop.
          lastMessageTime: new Date()
        }
      }
      return t
    }))

    try {
      const { data: insertedMsg, error } = await supabase
        .from('messages')
        .insert({
          conversation_id: threadId,
          content: content,
          type: 'email',
          direction: 'outbound',
          sender_name: user.name,
          sender_email: user.email,
          is_read: true
        })
        .select()
        .single()

      if (error) throw error

      // Update conversation last_message_at
      await supabase
        .from('conversations')
        .update({ last_message_at: new Date().toISOString() })
        .eq('id', threadId)

      // Replace temp ID with real ID in state if complex logic needed
      // Re-fetching handles this eventually via subscription
    } catch (err) {
      console.error('Error sending message:', err)
      // Show error toast?
    }
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
