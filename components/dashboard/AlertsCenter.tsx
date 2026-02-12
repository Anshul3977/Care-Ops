'use client'

import Link from 'next/link'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import {
  MessageCircle,
  Calendar,
  FileText,
  AlertTriangle,
  ArrowRight,
} from 'lucide-react'
import { mockAlertCounts } from '@/lib/mockData'

export function AlertsCenter() {
  const alerts = [
    {
      icon: MessageCircle,
      label: 'Unread Messages',
      count: mockAlertCounts.unreadMessages,
      href: '/inbox',
      color: 'text-red-600',
      bgColor: 'bg-red-50 dark:bg-red-900/20',
      borderColor: 'border-red-200 dark:border-red-800/50',
    },
    {
      icon: Calendar,
      label: 'Unconfirmed Bookings',
      count: mockAlertCounts.unconfirmedBookings,
      href: '/bookings',
      color: 'text-yellow-600',
      bgColor: 'bg-yellow-50 dark:bg-yellow-900/20',
      borderColor: 'border-yellow-200 dark:border-yellow-800/50',
    },
    {
      icon: FileText,
      label: 'Overdue Forms',
      count: mockAlertCounts.overdueForms,
      href: '/forms',
      color: 'text-orange-600',
      bgColor: 'bg-orange-50 dark:bg-orange-900/20',
      borderColor: 'border-orange-200 dark:border-orange-800/50',
    },
    {
      icon: AlertTriangle,
      label: 'Critical Inventory',
      count: mockAlertCounts.criticalInventory,
      href: '/inventory',
      color: 'text-red-600',
      bgColor: 'bg-red-50 dark:bg-red-900/20',
      borderColor: 'border-red-200 dark:border-red-800/50',
    },
  ]

  return (
    <Card className="p-6 border border-border">
      <h3 className="text-lg font-semibold text-foreground mb-4">Alerts Center</h3>
      <div className="space-y-3">
        {alerts.map((alert, idx) => {
          const Icon = alert.icon
          return (
            <Link key={idx} href={alert.href}>
              <div
                className={`p-4 rounded-lg border-l-4 flex items-center justify-between hover:bg-secondary/30 transition-colors cursor-pointer ${alert.bgColor} ${alert.borderColor}`}
              >
                <div className="flex items-center gap-3 flex-1">
                  <Icon className={`w-5 h-5 ${alert.color}`} />
                  <div>
                    <p className="font-medium text-foreground text-sm">
                      {alert.label}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className="font-bold">
                    {alert.count}
                  </Badge>
                  <ArrowRight className="w-4 h-4 text-muted-foreground" />
                </div>
              </div>
            </Link>
          )
        })}
      </div>
    </Card>
  )
}
