import {
  BarChart3,
  Users,
  Briefcase,
  Settings,
  Home,
  LogOut,
  LucideIcon,
  Zap,
  Wrench,
  Mail,
  Calendar,
  Package,
  FileText,
} from 'lucide-react'

export const USER_ROLES = {
  ADMIN: 'ADMIN',
  STAFF: 'STAFF',
  NONE: 'NONE',
} as const

export interface MenuItem {
  label: string
  href: string
  icon: LucideIcon
  requiredRoles: string[]
  children?: MenuItem[]
}

export const DASHBOARD_MENU: MenuItem[] = [
  {
    label: 'Dashboard',
    href: '/dashboard',
    icon: Home,
    requiredRoles: ['ADMIN', 'STAFF'],
  },
  {
    label: 'Inbox',
    href: '/inbox',
    icon: Mail,
    requiredRoles: ['ADMIN', 'STAFF'],
  },
  {
    label: 'Bookings',
    href: '/bookings',
    icon: Calendar,
    requiredRoles: ['ADMIN', 'STAFF'],
  },
  {
    label: 'Jobs',
    href: '/jobs',
    icon: Briefcase,
    requiredRoles: ['ADMIN', 'STAFF'],
  },
  {
    label: 'Customers',
    href: '/customers',
    icon: Users,
    requiredRoles: ['ADMIN', 'STAFF'],
  },
  {
    label: 'Inventory',
    href: '/inventory',
    icon: Package,
    requiredRoles: ['ADMIN', 'STAFF'],
  },
  {
    label: 'Forms',
    href: '/forms',
    icon: FileText,
    requiredRoles: ['ADMIN', 'STAFF'],
  },
  {
    label: 'Reports',
    href: '/reports',
    icon: BarChart3,
    requiredRoles: ['ADMIN'],
  },
  {
    label: 'Owner Dashboard',
    href: '/dashboard/owner',
    icon: Zap,
    requiredRoles: ['ADMIN'],
  },
  {
    label: 'Contact Forms',
    href: '/contact-forms',
    icon: FileText,
    requiredRoles: ['ADMIN'],
  },
  {
    label: 'Setup Guide',
    href: '/onboarding',
    icon: Wrench,
    requiredRoles: ['ADMIN'],
  },
  {
    label: 'Settings',
    href: '/settings',
    icon: Settings,
    requiredRoles: ['ADMIN'],
  },
]

export const MOCK_USERS = {
  admin: {
    id: '1',
    email: 'admin@careops.com',
    password: 'admin123', // In production, this would be hashed
    name: 'Admin User',
    role: 'ADMIN' as const,
    createdAt: new Date(),
  },
  staff: {
    id: '2',
    email: 'staff@careops.com',
    password: 'staff123',
    name: 'Staff User',
    role: 'STAFF' as const,
    createdAt: new Date(),
  },
}
