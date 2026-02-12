'use client'

import { useAuth } from '@/contexts/AuthContext'
import { MetricCard } from '@/components/dashboard/MetricCard'
import { BookingTrendsChart } from '@/components/dashboard/BookingTrendsChart'
import { LeadSourcesChart } from '@/components/dashboard/LeadSourcesChart'
import { AlertsCenter } from '@/components/dashboard/AlertsCenter'
import {
  mockTodayBookings,
  mockLeads,
  mockPendingForms,
  mockInventoryAlerts,
  mockAlertCounts,
} from '@/lib/mockData'

export default function OwnerDashboardPage() {
  const { user } = useAuth()

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-foreground">
          Welcome back, {user?.name}!
        </h1>
        <p className="text-muted-foreground mt-2">
          Real-time business operations overview
        </p>
      </div>

      {/* Metric Cards - Top Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <MetricCard
          title="Today's Bookings"
          count={mockTodayBookings.length}
          items={mockTodayBookings}
          linkText="View all"
          linkHref="/dashboard/bookings"
        />
        <MetricCard
          title="New Leads"
          count={mockLeads.length}
          items={mockLeads}
          badge={mockAlertCounts.unreadMessages}
          badgeLabel="unread"
          linkText="View inbox"
          linkHref="/inbox"
        />
        <MetricCard
          title="Pending Forms"
          count={mockAlertCounts.overdueForms}
          items={mockPendingForms}
          badge={mockAlertCounts.overdueForms}
          badgeLabel="overdue"
          linkText="View forms"
          linkHref="/forms"
        />
        <MetricCard
          title="Inventory Alerts"
          count={mockAlertCounts.criticalInventory}
          items={mockInventoryAlerts}
          badge={mockAlertCounts.criticalInventory}
          badgeLabel="critical"
          linkText="View inventory"
          linkHref="/inventory"
        />
      </div>

      {/* Charts - Middle Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <BookingTrendsChart />
        <LeadSourcesChart />
      </div>

      {/* Alerts Center - Bottom Section */}
      <AlertsCenter />
    </div>
  )
}
