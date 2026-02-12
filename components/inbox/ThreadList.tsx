'use client'

import React from 'react'
import { useInbox } from '@/contexts/InboxContext'
import { ConversationThread } from '@/lib/inboxData'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Mail, Archive, Trash2, Search } from 'lucide-react'
import { formatDistanceToNow } from 'date-fns'

export function ThreadList() {
  const { threads, selectedThread, selectThread, archiveThread, deleteThread, searchQuery, setSearchQuery, filterType } =
    useInbox()

  const filteredThreads = threads.filter((thread) => {
    if (thread.isArchived && filterType !== 'archived') return false
    if (filterType === 'archived' && !thread.isArchived) return false
    if (filterType === 'unread' && thread.unreadCount === 0) return false

    if (searchQuery) {
      return (
        thread.participantName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        thread.participantEmail.toLowerCase().includes(searchQuery.toLowerCase())
      )
    }

    return true
  })

  return (
    <div className="flex flex-col h-full gap-4">
      {/* Search Bar */}
      <div className="relative">
        <Search className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
        <Input
          placeholder="Search conversations..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* Thread List */}
      <div className="flex-1 overflow-y-auto space-y-2">
        {filteredThreads.length === 0 ? (
          <Card className="p-6 text-center text-muted-foreground">
            <Mail className="w-12 h-12 mx-auto mb-4 opacity-50" />
            <p>No conversations found</p>
          </Card>
        ) : (
          filteredThreads.map((thread) => (
            <Card
              key={thread.id}
              className={`p-3 cursor-pointer transition-colors hover:bg-accent ${
                selectedThread?.id === thread.id ? 'bg-accent' : ''
              }`}
              onClick={() => selectThread(thread)}
            >
              <div className="flex items-start justify-between gap-2">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <h3 className="font-semibold text-sm truncate">{thread.participantName}</h3>
                    {thread.unreadCount > 0 && <Badge variant="default">{thread.unreadCount}</Badge>}
                  </div>
                  <p className="text-xs text-muted-foreground truncate">{thread.participantEmail}</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    {formatDistanceToNow(new Date(thread.lastMessageTime), { addSuffix: true })}
                  </p>
                </div>

                {/* Actions */}
                <div className="flex gap-1" onClick={(e) => e.stopPropagation()}>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => archiveThread(thread.id)}
                    title="Archive"
                    className="h-8 w-8 p-0"
                  >
                    <Archive className="w-4 h-4" />
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => deleteThread(thread.id)}
                    title="Delete"
                    className="h-8 w-8 p-0 text-destructive hover:text-destructive"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </Card>
          ))
        )}
      </div>
    </div>
  )
}
