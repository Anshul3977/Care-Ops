'use client'

import Link from 'next/link'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { ArrowUpRight } from 'lucide-react'

interface BookingItem {
  time: string
  customer: string
}

interface LeadItem {
  name: string
  timestamp: string
}

interface MetricCardProps {
  title: string
  count: number
  items?: (BookingItem | LeadItem)[]
  badge?: number
  badgeLabel?: string
  linkText: string
  linkHref: string
  icon?: React.ReactNode
}

export function MetricCard({
  title,
  count,
  items = [],
  badge,
  badgeLabel,
  linkText,
  linkHref,
  icon,
}: MetricCardProps) {
  return (
    <Card className="p-6 flex flex-col gap-4 border border-border hover:border-primary/50 transition-colors">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold text-muted-foreground">{title}</h3>
        {badge !== undefined && (
          <Badge variant="secondary" className="gap-1">
            <span>{badge}</span>
            {badgeLabel && <span className="text-xs">{badgeLabel}</span>}
          </Badge>
        )}
      </div>

      <div className="flex-1">
        <p className="text-3xl font-bold text-foreground">{count}</p>
        {items.length > 0 && (
          <div className="mt-4 space-y-2">
            {items.slice(0, 3).map((item, idx) => (
              <div key={idx} className="text-xs text-muted-foreground border-t border-border/50 pt-2">
                <p className="font-medium text-foreground">
                  {'time' in item ? item.time : item.name}
                </p>
                <p className="text-muted-foreground">
                  {'customer' in item ? item.customer : item.timestamp}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>

      <Link
        href={linkHref}
        className="inline-flex items-center gap-2 text-sm font-medium text-primary hover:text-primary/80 transition-colors pt-2 border-t border-border/50"
      >
        {linkText}
        <ArrowUpRight className="w-4 h-4" />
      </Link>
    </Card>
  )
}
