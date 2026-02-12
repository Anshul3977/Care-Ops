'use client'

import React from 'react'
import { StaffInvitation } from '@/lib/staffData'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Mail, Trash2, RotateCw } from 'lucide-react'

interface InvitationsPanelProps {
  invitations: StaffInvitation[]
  onResend?: (id: string) => void
  onCancel?: (id: string) => void
}

export function InvitationsPanel({
  invitations,
  onResend,
  onCancel,
}: InvitationsPanelProps) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400'
      case 'accepted':
        return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'
      case 'rejected':
        return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'admin':
        return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400'
      case 'staff':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400'
      case 'viewer':
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  if (invitations.length === 0) {
    return (
      <Card className="p-6 border border-border">
        <p className="text-center text-muted-foreground">No pending invitations</p>
      </Card>
    )
  }

  return (
    <div className="space-y-3">
      {invitations.map((invitation) => (
        <Card
          key={invitation.id}
          className="p-4 border border-border hover:border-primary/50 transition-colors"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3 flex-1">
              <div className="p-2 rounded-lg bg-secondary/50">
                <Mail className="w-4 h-4 text-primary" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-foreground">{invitation.email}</p>
                <div className="flex gap-2 mt-1">
                  <span
                    className={`inline-block px-2 py-0.5 rounded text-xs font-medium capitalize ${getRoleColor(
                      invitation.role
                    )}`}
                  >
                    {invitation.role}
                  </span>
                  <span
                    className={`inline-block px-2 py-0.5 rounded text-xs font-medium capitalize ${getStatusColor(
                      invitation.status
                    )}`}
                  >
                    {invitation.status}
                  </span>
                </div>
              </div>
            </div>

            <div className="flex gap-2">
              {invitation.status === 'pending' && (
                <>
                  {onResend && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onResend(invitation.id)}
                      title="Resend invitation"
                    >
                      <RotateCw className="w-4 h-4" />
                    </Button>
                  )}
                  {onCancel && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onCancel(invitation.id)}
                      title="Cancel invitation"
                    >
                      <Trash2 className="w-4 h-4 text-destructive" />
                    </Button>
                  )}
                </>
              )}
            </div>
          </div>
        </Card>
      ))}
    </div>
  )
}
