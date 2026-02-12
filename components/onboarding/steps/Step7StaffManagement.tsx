'use client'

import { useState } from 'react'
import { useOnboarding } from '@/contexts/OnboardingContext'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Checkbox } from '@/components/ui/checkbox'
import { Badge } from '@/components/ui/badge'
import { Mail, Plus, Trash2, Users } from 'lucide-react'

export function Step7StaffManagement() {
  const { state, updateStaff } = useOnboarding()
  const [members, setMembers] = useState(state.staff?.members || [])
  const [newEmail, setNewEmail] = useState('')
  const [newPermissions, setNewPermissions] = useState({
    inbox: true,
    bookings: true,
    forms: true,
    inventory: false,
  })

  const isComplete = members.length >= 0

  const handleAddMember = () => {
    if (newEmail.trim() && newEmail.includes('@')) {
      setMembers([
        ...members,
        {
          id: Math.random().toString(),
          email: newEmail,
          permissions: newPermissions,
          status: 'pending',
          invitedAt: new Date(),
        },
      ])
      setNewEmail('')
      setNewPermissions({
        inbox: true,
        bookings: true,
        forms: true,
        inventory: false,
      })
    }
  }

  const handleRemoveMember = (id: string) => {
    setMembers(members.filter((m) => m.id !== id))
  }

  const handleTogglePermission = (
    memberId: string,
    permission: keyof typeof newPermissions,
  ) => {
    setMembers(
      members.map((m) =>
        m.id === memberId
          ? {
              ...m,
              permissions: {
                ...m.permissions,
                [permission]: !m.permissions[permission],
              },
            }
          : m,
      ),
    )
  }

  const handleSave = () => {
    updateStaff({
      members,
    })
  }

  React.useEffect(() => {
    const timer = setTimeout(handleSave, 500)
    return () => clearTimeout(timer)
  }, [members])

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold text-foreground mb-2">
          Staff Management
        </h2>
        <p className="text-muted-foreground">
          Invite team members and set their permissions
        </p>
      </div>

      <div className="space-y-6">
        {/* Invite Form */}
        <Card className="p-6 border border-border">
          <h3 className="font-semibold text-foreground mb-4 flex items-center gap-2">
            <Users className="w-4 h-4" />
            Invite Staff Member
          </h3>

          <div className="p-4 rounded-lg border border-dashed border-border space-y-4">
            <div>
              <Label htmlFor="staffEmail" className="text-sm flex items-center gap-2">
                <Mail className="w-4 h-4" />
                Email Address
              </Label>
              <Input
                id="staffEmail"
                type="email"
                placeholder="staff@example.com"
                value={newEmail}
                onChange={(e) => setNewEmail(e.target.value)}
                className="mt-1"
              />
            </div>

            <div>
              <p className="text-sm font-medium text-foreground mb-3">
                Permissions
              </p>
              <div className="space-y-2">
                {[
                  { key: 'inbox', label: 'Inbox - View and reply to messages' },
                  { key: 'bookings', label: 'Bookings - Manage appointments' },
                  { key: 'forms', label: 'Forms - Access post-booking forms' },
                  { key: 'inventory', label: 'Inventory - Track supplies' },
                ].map((perm) => (
                  <div key={perm.key} className="flex items-center gap-2">
                    <Checkbox
                      id={`new-perm-${perm.key}`}
                      checked={
                        newPermissions[perm.key as keyof typeof newPermissions]
                      }
                      onCheckedChange={(checked) =>
                        setNewPermissions({
                          ...newPermissions,
                          [perm.key]: checked,
                        })
                      }
                    />
                    <Label
                      htmlFor={`new-perm-${perm.key}`}
                      className="cursor-pointer text-sm"
                    >
                      {perm.label}
                    </Label>
                  </div>
                ))}
              </div>
            </div>

            <Button
              onClick={handleAddMember}
              className="w-full gap-2"
              disabled={!newEmail.trim() || !newEmail.includes('@')}
            >
              <Plus className="w-4 h-4" />
              Send Invite
            </Button>
          </div>
        </Card>

        {/* Staff List */}
        {members.length > 0 && (
          <Card className="p-6 border border-border">
            <h3 className="font-semibold text-foreground mb-4">
              {members.length} Staff Member{members.length !== 1 ? 's' : ''}
            </h3>
            <div className="space-y-4">
              {members.map((member) => (
                <div
                  key={member.id}
                  className="p-4 rounded-lg border border-border bg-secondary/20"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <p className="font-medium text-foreground">{member.email}</p>
                      <Badge
                        variant={member.status === 'active' ? 'default' : 'outline'}
                        className="mt-1"
                      >
                        {member.status === 'pending' ? 'Invitation Pending' : 'Active'}
                      </Badge>
                    </div>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => handleRemoveMember(member.id)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>

                  <div className="space-y-2">
                    <p className="text-xs font-medium text-foreground">
                      Permissions
                    </p>
                    <div className="grid grid-cols-2 gap-2">
                      {[
                        { key: 'inbox', label: 'Inbox' },
                        { key: 'bookings', label: 'Bookings' },
                        { key: 'forms', label: 'Forms' },
                        { key: 'inventory', label: 'Inventory' },
                      ].map((perm) => (
                        <div key={perm.key} className="flex items-center gap-2">
                          <Checkbox
                            id={`member-${member.id}-${perm.key}`}
                            checked={
                              member.permissions[
                                perm.key as keyof typeof member.permissions
                              ]
                            }
                            onCheckedChange={() =>
                              handleTogglePermission(
                                member.id,
                                perm.key as keyof typeof member.permissions,
                              )
                            }
                          />
                          <Label
                            htmlFor={`member-${member.id}-${perm.key}`}
                            className="cursor-pointer text-xs"
                          >
                            {perm.label}
                          </Label>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        )}

        {/* Info */}
        <div className="p-4 rounded-lg bg-primary/10 border border-primary/20">
          <p className="text-sm text-foreground">
            {members.length > 0
              ? `${members.length} staff member${members.length !== 1 ? 's' : ''} invited. They'll receive email invitations to join the workspace.`
              : 'Staff management is optional. You can add team members now or proceed without team members.'}
          </p>
        </div>
      </div>
    </div>
  )
}
