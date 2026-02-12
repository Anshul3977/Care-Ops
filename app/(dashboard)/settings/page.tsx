'use client'

import { useAuth } from '@/contexts/AuthContext'
import { useStaff } from '@/contexts/StaffContext'
import { useContactForm } from '@/contexts/ContactFormContext'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { StaffTable } from '@/components/staff/StaffTable'
import { InvitationsPanel } from '@/components/staff/InvitationsPanel'
import BusinessSettingsTab from '@/components/settings/BusinessSettingsTab'
import { Shield, Bell, Palette, Lock, Users, FileText, Plus, Building2 } from 'lucide-react'
import Link from 'next/link'
import { useState } from 'react'

export default function SettingsPage() {
  const { user } = useAuth()
  const { staff, invitations, sendInvitation, resendInvitation, cancelInvitation, removeStaffMember } = useStaff()
  const { forms } = useContactForm()
  
  const [inviteEmail, setInviteEmail] = useState('')
  const [inviteRole, setInviteRole] = useState<'admin' | 'staff' | 'viewer'>('staff')
  const [showInviteForm, setShowInviteForm] = useState(false)
  const [activeTab, setActiveTab] = useState<'account' | 'business'>('account')

  const handleSendInvitation = () => {
    if (inviteEmail.trim()) {
      sendInvitation(inviteEmail, inviteRole)
      setInviteEmail('')
      setShowInviteForm(false)
    }
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-foreground">Settings</h1>
        <p className="text-muted-foreground mt-2">
          Manage your account and application settings
        </p>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 border-b border-border">
        <button
          onClick={() => setActiveTab('account')}
          className={`px-4 py-3 font-medium border-b-2 transition-colors ${
            activeTab === 'account'
              ? 'border-primary text-primary'
              : 'border-transparent text-muted-foreground hover:text-foreground'
          }`}
        >
          <div className="flex items-center gap-2">
            <Shield className="w-4 h-4" />
            Account Settings
          </div>
        </button>
        {user?.role === 'admin' && (
          <button
            onClick={() => setActiveTab('business')}
            className={`px-4 py-3 font-medium border-b-2 transition-colors ${
              activeTab === 'business'
                ? 'border-primary text-primary'
                : 'border-transparent text-muted-foreground hover:text-foreground'
            }`}
          >
            <div className="flex items-center gap-2">
              <Building2 className="w-4 h-4" />
              Business Settings
            </div>
          </button>
        )}
      </div>

      {/* Account Tab */}
      {activeTab === 'account' && (
        <div className="space-y-8">
          {/* Account Settings */}
          <Card className="p-6 border border-border">
        <h2 className="text-xl font-bold text-foreground mb-6 flex items-center gap-2">
          <Shield className="w-5 h-5 text-primary" />
          Account Information
        </h2>
        
        <form className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Full Name</Label>
              <Input
                id="name"
                type="text"
                value={user?.name || ''}
                readOnly
                disabled
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email Address</Label>
              <Input
                id="email"
                type="email"
                value={user?.email || ''}
                readOnly
                disabled
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="role">Role</Label>
            <Input
              id="role"
              type="text"
              value={user?.role || ''}
              readOnly
              disabled
            />
          </div>

          <Button disabled className="opacity-50">
            Update Profile
          </Button>
        </form>
      </Card>

      {/* Notification Settings */}
      <Card className="p-6 border border-border">
        <h2 className="text-xl font-bold text-foreground mb-6 flex items-center gap-2">
          <Bell className="w-5 h-5 text-primary" />
          Notifications
        </h2>

        <div className="space-y-4">
          {[
            { label: 'Job Updates', description: 'Get notified about job status changes' },
            { label: 'Customer Messages', description: 'Receive alerts for new customer messages' },
            { label: 'Weekly Reports', description: 'Get weekly summary reports' },
            { label: 'Team Updates', description: 'Notifications about team activities' },
          ].map((notification, idx) => (
            <div key={idx} className="flex items-center justify-between p-4 rounded-lg bg-secondary/50">
              <div>
                <p className="font-medium text-foreground">{notification.label}</p>
                <p className="text-sm text-muted-foreground">{notification.description}</p>
              </div>
              <input
                type="checkbox"
                defaultChecked
                className="w-5 h-5 rounded cursor-pointer"
              />
            </div>
          ))}
        </div>

        <Button disabled className="mt-4 opacity-50">
          Save Preferences
        </Button>
      </Card>

      {/* Appearance Settings */}
      <Card className="p-6 border border-border">
        <h2 className="text-xl font-bold text-foreground mb-6 flex items-center gap-2">
          <Palette className="w-5 h-5 text-primary" />
          Appearance
        </h2>

        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="theme">Theme</Label>
            <select
              id="theme"
              className="w-full px-3 py-2 rounded-lg border border-input bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
            >
              <option>Auto (System)</option>
              <option>Light</option>
              <option>Dark</option>
            </select>
          </div>

          <Button disabled className="opacity-50">
            Save Preferences
          </Button>
        </div>
      </Card>

      {/* Security Settings */}
      <Card className="p-6 border border-border">
        <h2 className="text-xl font-bold text-foreground mb-6 flex items-center gap-2">
          <Lock className="w-5 h-5 text-primary" />
          Security
        </h2>

        <div className="space-y-4">
          <div>
            <p className="font-medium text-foreground mb-3">Change Password</p>
            <form className="space-y-3">
              <div className="space-y-2">
                <Label htmlFor="current-password">Current Password</Label>
                <Input
                  id="current-password"
                  type="password"
                  placeholder="••••••••"
                  disabled
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="new-password">New Password</Label>
                <Input
                  id="new-password"
                  type="password"
                  placeholder="••••••••"
                  disabled
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="confirm-password">Confirm Password</Label>
                <Input
                  id="confirm-password"
                  type="password"
                  placeholder="••••••••"
                  disabled
                />
              </div>
              <Button disabled className="opacity-50">
                Update Password
              </Button>
            </form>
          </div>
        </div>
      </Card>

      {/* Staff Management */}
      {user?.role === 'admin' && (
        <Card className="p-6 border border-border">
          <h2 className="text-xl font-bold text-foreground mb-6 flex items-center gap-2">
            <Users className="w-5 h-5 text-primary" />
            Staff Management
          </h2>

          <div className="space-y-6">
            {/* Active Staff */}
            <div>
              <h3 className="text-lg font-semibold text-foreground mb-4">Active Staff</h3>
              <StaffTable
                staff={staff}
                onRemove={(id) => {
                  if (confirm('Are you sure you want to remove this staff member?')) {
                    removeStaffMember(id)
                  }
                }}
              />
            </div>

            {/* Pending Invitations */}
            {invitations.some((inv) => inv.status === 'pending') && (
              <div>
                <h3 className="text-lg font-semibold text-foreground mb-4">Pending Invitations</h3>
                <InvitationsPanel
                  invitations={invitations.filter((inv) => inv.status === 'pending')}
                  onResend={resendInvitation}
                  onCancel={cancelInvitation}
                />
              </div>
            )}

            {/* Send Invitation */}
            <div className="border-t border-border pt-6">
              <h3 className="text-lg font-semibold text-foreground mb-4">Send Invitation</h3>
              {!showInviteForm ? (
                <Button onClick={() => setShowInviteForm(true)} className="gap-2">
                  <Plus className="w-4 h-4" />
                  Invite Staff Member
                </Button>
              ) : (
                <Card className="p-4 border border-border bg-secondary/5">
                  <div className="space-y-3">
                    <div>
                      <Label htmlFor="invite-email">Email Address</Label>
                      <Input
                        id="invite-email"
                        type="email"
                        placeholder="staff@example.com"
                        value={inviteEmail}
                        onChange={(e) => setInviteEmail(e.target.value)}
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <Label htmlFor="invite-role">Role</Label>
                      <select
                        id="invite-role"
                        value={inviteRole}
                        onChange={(e) => setInviteRole(e.target.value as 'admin' | 'staff' | 'viewer')}
                        className="w-full px-3 py-2 rounded-lg border border-input bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary mt-1"
                      >
                        <option value="admin">Admin</option>
                        <option value="staff">Staff</option>
                        <option value="viewer">Viewer</option>
                      </select>
                    </div>
                    <div className="flex gap-2">
                      <Button onClick={handleSendInvitation}>Send Invitation</Button>
                      <Button variant="outline" onClick={() => setShowInviteForm(false)}>
                        Cancel
                      </Button>
                    </div>
                  </div>
                </Card>
              )}
            </div>
          </div>
        </Card>
      )}

      {/* Contact Forms */}
      {user?.role === 'admin' && (
        <Card className="p-6 border border-border">
          <h2 className="text-xl font-bold text-foreground mb-6 flex items-center gap-2">
            <FileText className="w-5 h-5 text-primary" />
            Contact Forms
          </h2>

          <div className="space-y-4">
            {forms.length === 0 ? (
              <p className="text-muted-foreground">No contact forms created yet</p>
            ) : (
              <div className="grid gap-3">
                {forms.map((form) => (
                  <div
                    key={form.id}
                    className="p-3 rounded-lg border border-border bg-secondary/5 flex items-center justify-between"
                  >
                    <div>
                      <p className="font-medium text-foreground">{form.name}</p>
                      <p className="text-sm text-muted-foreground">{form.fields.length} fields • {form.submissions} submissions</p>
                    </div>
                  </div>
                ))}
              </div>
            )}

            <Link href="/contact-forms">
              <Button variant="outline" className="w-full gap-2">
                <Plus className="w-4 h-4" />
                Manage Forms
              </Button>
            </Link>
          </div>
        </Card>
      )}

      {/* Danger Zone */}
      <Card className="p-6 border border-destructive/30 bg-destructive/5">
        <h2 className="text-xl font-bold text-destructive mb-4">Danger Zone</h2>
        <p className="text-sm text-muted-foreground mb-4">
          These actions cannot be undone. Please be careful.
        </p>
        <Button variant="destructive" disabled className="opacity-50">
          Delete Account
        </Button>
      </Card>
        </div>
      )}

      {/* Business Tab */}
      {activeTab === 'business' && user?.role === 'admin' && (
        <BusinessSettingsTab />
      )}
    </div>
  )
}
