'use client'

import React, { createContext, useContext, useState, useEffect } from 'react'
import {
  StaffMember,
  StaffInvitation,
  MOCK_STAFF,
  MOCK_INVITATIONS,
  ROLE_PERMISSIONS,
} from '@/lib/staffData'

interface StaffContextType {
  staff: StaffMember[]
  invitations: StaffInvitation[]
  addStaffMember: (member: StaffMember) => void
  updateStaffMember: (id: string, updates: Partial<StaffMember>) => void
  removeStaffMember: (id: string) => void
  sendInvitation: (email: string, role: 'admin' | 'staff' | 'viewer') => void
  resendInvitation: (invitationId: string) => void
  cancelInvitation: (invitationId: string) => void
  acceptInvitation: (invitationId: string) => void
  rejectInvitation: (invitationId: string) => void
}

const StaffContext = createContext<StaffContextType | undefined>(undefined)

export function StaffProvider({ children }: { children: React.ReactNode }) {
  const [staff, setStaff] = useState<StaffMember[]>([])
  const [invitations, setInvitations] = useState<StaffInvitation[]>([])

  useEffect(() => {
    // Load from localStorage
    const storedStaff = localStorage.getItem('careops_staff')
    const storedInvitations = localStorage.getItem('careops_invitations')

    if (storedStaff) {
      try {
        setStaff(JSON.parse(storedStaff))
      } catch {
        setStaff(MOCK_STAFF)
      }
    } else {
      setStaff(MOCK_STAFF)
    }

    if (storedInvitations) {
      try {
        setInvitations(JSON.parse(storedInvitations))
      } catch {
        setInvitations(MOCK_INVITATIONS)
      }
    } else {
      setInvitations(MOCK_INVITATIONS)
    }
  }, [])

  useEffect(() => {
    localStorage.setItem('careops_staff', JSON.stringify(staff))
  }, [staff])

  useEffect(() => {
    localStorage.setItem('careops_invitations', JSON.stringify(invitations))
  }, [invitations])

  const addStaffMember = (member: StaffMember) => {
    setStaff([...staff, member])
  }

  const updateStaffMember = (id: string, updates: Partial<StaffMember>) => {
    setStaff(
      staff.map((member) =>
        member.id === id
          ? {
              ...member,
              ...updates,
              permissions: ROLE_PERMISSIONS[updates.role || member.role],
            }
          : member
      )
    )
  }

  const removeStaffMember = (id: string) => {
    setStaff(staff.filter((member) => member.id !== id))
  }

  const sendInvitation = (email: string, role: 'admin' | 'staff' | 'viewer') => {
    const newInvitation: StaffInvitation = {
      id: Date.now().toString(),
      email,
      role,
      status: 'pending',
      sentDate: new Date(),
      expiryDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      sentBy: 'admin@careops.com',
    }
    setInvitations([...invitations, newInvitation])
  }

  const resendInvitation = (invitationId: string) => {
    setInvitations(
      invitations.map((inv) =>
        inv.id === invitationId
          ? {
              ...inv,
              sentDate: new Date(),
              expiryDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
            }
          : inv
      )
    )
  }

  const cancelInvitation = (invitationId: string) => {
    setInvitations(invitations.filter((inv) => inv.id !== invitationId))
  }

  const acceptInvitation = (invitationId: string) => {
    const invitation = invitations.find((inv) => inv.id === invitationId)
    if (invitation) {
      const newMember: StaffMember = {
        id: Date.now().toString(),
        name: invitation.email.split('@')[0],
        email: invitation.email,
        role: invitation.role,
        status: 'active',
        joinedDate: new Date(),
        permissions: ROLE_PERMISSIONS[invitation.role],
      }
      addStaffMember(newMember)
      setInvitations(
        invitations.map((inv) =>
          inv.id === invitationId ? { ...inv, status: 'accepted' } : inv
        )
      )
    }
  }

  const rejectInvitation = (invitationId: string) => {
    setInvitations(
      invitations.map((inv) =>
        inv.id === invitationId ? { ...inv, status: 'rejected' } : inv
      )
    )
  }

  return (
    <StaffContext.Provider
      value={{
        staff,
        invitations,
        addStaffMember,
        updateStaffMember,
        removeStaffMember,
        sendInvitation,
        resendInvitation,
        cancelInvitation,
        acceptInvitation,
        rejectInvitation,
      }}
    >
      {children}
    </StaffContext.Provider>
  )
}

export function useStaff() {
  const context = useContext(StaffContext)
  if (!context) {
    throw new Error('useStaff must be used within StaffProvider')
  }
  return context
}
