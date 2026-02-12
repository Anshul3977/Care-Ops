export type StaffRole = 'admin' | 'staff' | 'viewer'
export type InvitationStatus = 'pending' | 'accepted' | 'rejected'

export interface StaffMember {
  id: string
  name: string
  email: string
  role: StaffRole
  status: 'active' | 'inactive'
  joinedDate: Date
  lastActive?: Date
  permissions: string[]
}

export interface StaffInvitation {
  id: string
  email: string
  role: StaffRole
  status: InvitationStatus
  sentDate: Date
  expiryDate: Date
  sentBy: string
}

export const ROLE_PERMISSIONS: Record<StaffRole, string[]> = {
  admin: [
    'view_dashboard',
    'manage_staff',
    'manage_forms',
    'manage_inventory',
    'manage_bookings',
    'manage_jobs',
    'manage_customers',
    'view_reports',
    'access_settings',
  ],
  staff: [
    'view_dashboard',
    'view_forms',
    'manage_inventory',
    'manage_bookings',
    'manage_jobs',
    'view_customers',
  ],
  viewer: [
    'view_dashboard',
    'view_forms',
    'view_bookings',
    'view_jobs',
    'view_customers',
  ],
}

export const MOCK_STAFF: StaffMember[] = [
  {
    id: '1',
    name: 'John Smith',
    email: 'john@careops.com',
    role: 'admin',
    status: 'active',
    joinedDate: new Date('2024-01-10'),
    lastActive: new Date(Date.now() - 2 * 60 * 60 * 1000),
    permissions: ROLE_PERMISSIONS.admin,
  },
  {
    id: '2',
    name: 'Sarah Johnson',
    email: 'sarah@careops.com',
    role: 'staff',
    status: 'active',
    joinedDate: new Date('2024-02-01'),
    lastActive: new Date(Date.now() - 24 * 60 * 60 * 1000),
    permissions: ROLE_PERMISSIONS.staff,
  },
  {
    id: '3',
    name: 'Mike Davis',
    email: 'mike@careops.com',
    role: 'staff',
    status: 'inactive',
    joinedDate: new Date('2024-01-20'),
    lastActive: new Date('2024-02-10'),
    permissions: ROLE_PERMISSIONS.staff,
  },
]

export const MOCK_INVITATIONS: StaffInvitation[] = [
  {
    id: '1',
    email: 'emily@example.com',
    role: 'staff',
    status: 'pending',
    sentDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
    expiryDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000),
    sentBy: 'admin@careops.com',
  },
]
