'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useAuth } from '@/contexts/AuthContext'
import { DASHBOARD_MENU } from '@/lib/constants'
import { cn } from '@/lib/utils'

interface MobileMenuProps {
  onClose: () => void
}

export function MobileMenu({ onClose }: MobileMenuProps) {
  const pathname = usePathname()
  const { user } = useAuth()

  if (!user) return null

  const visibleMenuItems = DASHBOARD_MENU.filter((item) =>
    item.requiredRoles.includes(user.role)
  )

  return (
    <nav className="lg:hidden border-t border-border bg-card p-4 space-y-2">
      {visibleMenuItems.map((item) => {
        const Icon = item.icon
        const isActive = pathname === item.href || pathname.startsWith(item.href + '/')
        return (
          <Link key={item.href} href={item.href} onClick={onClose}>
            <button
              className={cn(
                'w-full flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition-colors',
                isActive
                  ? 'bg-primary text-primary-foreground'
                  : 'text-foreground hover:bg-secondary'
              )}
            >
              <Icon className="w-5 h-5" />
              <span>{item.label}</span>
            </button>
          </Link>
        )
      })}
    </nav>
  )
}
