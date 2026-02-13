'use client'

import React, { useState } from 'react'
import { useInbox } from '@/contexts/InboxContext'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Mail, Send, Archive, Trash2, Reply } from 'lucide-react'
import { formatDistanceToNow } from 'date-fns'

const PRIORITY_COLORS = {
  low: 'bg-blue-100 text-blue-800 border-blue-300',
  normal: 'bg-gray-100 text-gray-800 border-gray-300',
  high: 'bg-orange-100 text-orange-800 border-orange-300',
  urgent: 'bg-red-100 text-red-800 border-red-300',
}

export function MessageDetail() {
  const { selectedThread, markThreadAsRead, archiveThread, deleteThread, sendMessage } = useInbox()
  const [replyContent, setReplyContent] = useState('')
  const [isReplying, setIsReplying] = useState(false)

  if (!selectedThread) {
    return (
      <div className="flex items-center justify-center h-full text-muted-foreground">
        <div className="text-center">
          <Mail className="w-12 h-12 mx-auto mb-4 opacity-50" />
          <p>Select a conversation to view messages</p>
        </div>
      </div>
    )
  }

  const handleSendReply = () => {
    if (replyContent.trim()) {
      sendMessage(selectedThread.id, replyContent)
      setReplyContent('')
      setIsReplying(false)
    }
  }

  React.useEffect(() => {
    if (selectedThread?.unreadCount > 0) {
      markThreadAsRead(selectedThread.id)
    }
  }, [selectedThread?.id, selectedThread?.unreadCount, markThreadAsRead])

  return (
    <div className="flex flex-col h-full gap-4">
      {/* Thread Header */}
      <div className="border-b border-border pb-4">
        <div className="flex items-start justify-between gap-4 mb-2">
          <div>
            <h2 className="text-xl font-bold">{selectedThread.participantName}</h2>
            <p className="text-sm text-muted-foreground">{selectedThread.participantEmail}</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={() => archiveThread(selectedThread.id)} className="gap-2">
              <Archive className="w-4 h-4" />
              Archive
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => deleteThread(selectedThread.id)}
              className="gap-2 text-destructive hover:text-destructive"
            >
              <Trash2 className="w-4 h-4" />
              Delete
            </Button>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto space-y-3">
        {selectedThread.messages.map((message) => (
          <Card key={message.id} className="p-4">
            <div className="flex items-start justify-between mb-2">
              <div>
                <h3 className="font-semibold">{message.senderName}</h3>
                <p className="text-xs text-muted-foreground">{message.senderEmail}</p>
              </div>
              <div className="flex items-center gap-2">
                <Badge
                  variant="outline"
                  className={PRIORITY_COLORS[message.priority as keyof typeof PRIORITY_COLORS]}
                >
                  {message.priority.charAt(0).toUpperCase() + message.priority.slice(1)}
                </Badge>
                <span className="text-xs text-muted-foreground">
                  {formatDistanceToNow(new Date(message.timestamp), { addSuffix: true })}
                </span>
              </div>
            </div>

            <p className="text-xs text-muted-foreground mb-2 font-mono">{message.subject}</p>
            <div className="prose prose-sm dark:prose-invert max-w-none">
              <p className="text-sm whitespace-pre-wrap">{message.content}</p>
            </div>

            {message.channel !== 'system' && (
              <div className="mt-3 pt-3 border-t border-border">
                <Button size="sm" variant="ghost" className="gap-2" onClick={() => setIsReplying(true)}>
                  <Reply className="w-4 h-4" />
                  Reply
                </Button>
              </div>
            )}
          </Card>
        ))}
      </div>

      {/* Reply Box */}
      {isReplying && (
        <Card className="p-4 border-primary/50 bg-primary/5">
          <div className="space-y-3">
            <textarea
              value={replyContent}
              onChange={(e) => setReplyContent(e.target.value)}
              placeholder="Type your reply..."
              className="w-full p-3 border border-border rounded-md bg-background text-foreground resize-none focus:outline-none focus:ring-2 focus:ring-primary min-h-[100px]"
            />
            <div className="flex gap-2 justify-end">
              <Button variant="outline" onClick={() => setIsReplying(false)}>
                Cancel
              </Button>
              <Button onClick={handleSendReply} className="gap-2">
                <Send className="w-4 h-4" />
                Send Reply
              </Button>
            </div>
          </div>
        </Card>
      )}
    </div>
  )
}
