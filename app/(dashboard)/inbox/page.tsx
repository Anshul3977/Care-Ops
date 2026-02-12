'use client'

import React, { useState } from 'react'
import { InboxProvider, useInbox } from '@/contexts/InboxContext'
import { ThreadList } from '@/components/inbox/ThreadList'
import { MessageDetail } from '@/components/inbox/MessageDetail'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Mail, Archive, Settings } from 'lucide-react'

function InboxContent() {
  const { threads, unreadCount, setFilterType, filterType } = useInbox()
  const [showArchived, setShowArchived] = useState(false)

  const archivedThreads = threads.filter((t) => t.isArchived).length
  const activeThreads = threads.filter((t) => !t.isArchived).length

  const handleFilterChange = (filter: string | null) => {
    setFilterType(filter)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Inbox</h1>
            <p className="text-muted-foreground mt-1">Manage all your messages and conversations</p>
          </div>
          <Button variant="outline" size="sm" className="gap-2">
            <Settings className="w-4 h-4" />
            Settings
          </Button>
        </div>

        {/* Stats */}
        <div className="flex flex-wrap gap-3">
          <Button
            variant={filterType === null && !showArchived ? 'default' : 'outline'}
            size="sm"
            onClick={() => {
              handleFilterChange(null)
              setShowArchived(false)
            }}
            className="gap-2"
          >
            <Mail className="w-4 h-4" />
            All
            {activeThreads > 0 && <Badge variant="secondary">{activeThreads}</Badge>}
          </Button>
          <Button
            variant={filterType === 'unread' ? 'default' : 'outline'}
            size="sm"
            onClick={() => handleFilterChange('unread')}
            className="gap-2"
          >
            Unread
            {unreadCount > 0 && <Badge variant="default">{unreadCount}</Badge>}
          </Button>
          <Button
            variant={showArchived ? 'default' : 'outline'}
            size="sm"
            onClick={() => {
              handleFilterChange('archived')
              setShowArchived(true)
            }}
            className="gap-2"
          >
            <Archive className="w-4 h-4" />
            Archived ({archivedThreads})
          </Button>
        </div>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 min-h-[600px]">
        {/* Thread List */}
        <Card className="lg:col-span-1 p-4">
          <ThreadList />
        </Card>

        {/* Message Detail */}
        <Card className="lg:col-span-2 p-4">
          <MessageDetail />
        </Card>
      </div>
    </div>
  )
}

export default function InboxPage() {
  return (
    <InboxProvider>
      <InboxContent />
    </InboxProvider>
  )
}
