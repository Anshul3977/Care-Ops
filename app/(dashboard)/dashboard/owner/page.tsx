'use client'

import React, { useEffect, useState } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { MetricCard } from '@/components/dashboard/MetricCard'
import { BookingTrendsChart, BookingTrendData } from '@/components/dashboard/BookingTrendsChart'
import { LeadSourcesChart, LeadSourceData } from '@/components/dashboard/LeadSourcesChart'
import { AlertsCenter } from '@/components/dashboard/AlertsCenter'
import { supabase } from '@/lib/supabase'
import { Loader2 } from 'lucide-react'

// Define types for our dashboard data
interface DashboardData {
  todayBookings: any[]
  leads: any[]
  pendingForms: any[]
  inventoryAlerts: any[]
  bookingTrends: BookingTrendData[]
  leadSources: LeadSourceData[]
  counts: {
    unreadMessages: number
    unconfirmedBookings: number
    overdueForms: number
    criticalInventory: number
  }
}

export default function OwnerDashboardPage() {
  const { user } = useAuth()
  const [data, setData] = useState<DashboardData>({
    todayBookings: [],
    leads: [],
    pendingForms: [],
    inventoryAlerts: [],
    bookingTrends: [],
    leadSources: [],
    counts: {
      unreadMessages: 0,
      unconfirmedBookings: 0,
      overdueForms: 0,
      criticalInventory: 0,
    }
  })
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchDashboardData = async () => {
      if (!user?.workspaceId) return

      try {
        setIsLoading(true)
        const today = new Date().toISOString().split('T')[0]
        const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]

        // 1. Fetch Today's Bookings
        const { data: todayBookingsData, error: bookingsError } = await supabase
          .from('bookings')
          .select(`
            id,
            booking_time,
            status,
            contacts (name)
          `)
          .eq('workspace_id', user.workspaceId)
          .eq('booking_date', today)
          .order('booking_time', { ascending: true })

        if (bookingsError) throw bookingsError

        // Format for MetricCard
        const formattedTodayBookings = todayBookingsData?.map(b => {
          const contact = b.contacts as { name: string } | { name: string }[] | null
          const customerName = contact
            ? (Array.isArray(contact) ? contact[0]?.name : contact.name)
            : 'Unknown'
          return {
            time: new Date(`2000-01-01T${b.booking_time}`).toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' }),
            customer: customerName
          }
        }) || []

        // 2. Fetch Recent Leads (Contacts)
        const { data: leadsData, error: leadsError } = await supabase
          .from('contacts')
          .select('id, name, created_at, source')
          .eq('workspace_id', user.workspaceId)
          .gte('created_at', sevenDaysAgo)
          .order('created_at', { ascending: false })
          .limit(5)

        if (leadsError) throw leadsError

        // Format for MetricCard
        const formattedLeads = leadsData?.map(l => ({
          name: l.name,
          timestamp: new Date(l.created_at).toLocaleDateString()
        })) || []

        // 3. Fetch Pending Forms
        const { data: pendingFormsData, error: formsError } = await supabase
          .from('form_submissions')
          .select('form_name, status')
          .eq('workspace_id', user.workspaceId)
          .eq('status', 'pending')

        if (formsError) throw formsError

        // Group by form name
        const formCounts = pendingFormsData?.reduce((acc: Record<string, number>, curr) => {
          acc[curr.form_name] = (acc[curr.form_name] || 0) + 1
          return acc
        }, {}) || {}

        const formattedPendingForms = Object.entries(formCounts).map(([type, count]) => ({
          name: type,
          timestamp: `${count} pending`
        }))

        // 4. Fetch Inventory Alerts (fetch all active, filter in JS for quantity <= reorder_level)
        const { data: allInventory, error: allInvError } = await supabase
          .from('inventory_items')
          .select('name, quantity, reorder_level')
          .eq('workspace_id', user.workspaceId)
          .eq('is_active', true)

        if (allInvError) throw allInvError

        const lowStockItems = allInventory?.filter(item => item.quantity <= item.reorder_level) || []

        const formattedInventoryAlerts = lowStockItems.map(item => ({
          name: item.name,
          timestamp: item.quantity === 0 ? 'critical' : 'low'
        })).slice(0, 3)

        // 5. Calculate Booking Trends (Last 7 Days)
        const { data: trendsData, error: trendsError } = await supabase
          .from('bookings')
          .select('booking_date, status')
          .eq('workspace_id', user.workspaceId)
          .gte('booking_date', sevenDaysAgo)
          .lte('booking_date', today)

        if (trendsError) throw trendsError

        // Initialize last 7 days map
        const trendsMap: Record<string, { completed: number, confirmed: number, noshow: number }> = {}
        for (let i = 6; i >= 0; i--) {
          const d = new Date()
          d.setDate(d.getDate() - i)
          const dateStr = d.toISOString().split('T')[0]
          // Use short day name for chart (Mon, Tue, etc.)
          const dayName = d.toLocaleDateString('en-US', { weekday: 'short' })
          trendsMap[dateStr] = { completed: 0, confirmed: 0, noshow: 0 }
          // Store day name with date key if needed, or just transform later
        }

        trendsData?.forEach(booking => {
          if (trendsMap[booking.booking_date]) {
            if (booking.status === 'completed') trendsMap[booking.booking_date].completed++
            else if (booking.status === 'confirmed') trendsMap[booking.booking_date].confirmed++
            else if (booking.status === 'no_show') trendsMap[booking.booking_date].noshow++
          }
        })

        const formattedTrends = Object.entries(trendsMap).map(([date, counts]) => ({
          date: new Date(date).toLocaleDateString('en-US', { weekday: 'short' }),
          ...counts
        })).sort((a, b) => {
          // Sort isn't strictly needed if we iterated in order, but good for safety.
          // Simplified sort by day index maybe? Actually we built it in order.
          return 0
        })

        // 6. Calculate Lead Sources
        const { data: allContactsData, error: contactsError } = await supabase
          .from('contacts')
          .select('source')
          .eq('workspace_id', user.workspaceId)

        if (contactsError) throw contactsError

        const sourceCounts = allContactsData?.reduce((acc: Record<string, number>, curr) => {
          const source = curr.source || 'Direct'
          acc[source] = (acc[source] || 0) + 1
          return acc
        }, {}) || {}

        const totalContacts = allContactsData?.length || 1
        const formattedLeadSources = Object.entries(sourceCounts).map(([name, count], index) => ({
          name,
          value: Math.round((count / totalContacts) * 100),
          fill: `hsl(${217 + (index * 40)}, 91%, 60%)` // Generate distinct colors
        }))

        // 7. Get Unread Messages Count
        // Assuming we join conversations or have unread_count on conversations
        const { data: threadsData, error: threadsError } = await supabase
          .from('conversations')
          .select('unread_count')
          .eq('workspace_id', user.workspaceId)

        if (threadsError) throw threadsError

        const totalUnread = threadsData?.reduce((sum, t) => sum + (t.unread_count || 0), 0) || 0

        setData({
          todayBookings: formattedTodayBookings,
          leads: formattedLeads,
          pendingForms: formattedPendingForms,
          inventoryAlerts: formattedInventoryAlerts,
          bookingTrends: formattedTrends,
          leadSources: formattedLeadSources,
          counts: {
            unreadMessages: totalUnread,
            unconfirmedBookings: todayBookingsData?.length || 0, // Using today's bookings for now
            overdueForms: pendingFormsData?.length || 0,
            criticalInventory: lowStockItems.length
          }
        })

      } catch (err) {
        console.error('Error fetching dashboard data:', err)
        setError('Failed to load dashboard data')
      } finally {
        setIsLoading(false)
      }
    }

    fetchDashboardData()
  }, [user?.workspaceId])

  if (isLoading) {
    return (
      <div className="flex h-96 items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex h-96 items-center justify-center text-destructive">
        {error}
      </div>
    )
  }

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
          count={data.todayBookings.length}
          items={data.todayBookings}
          linkText="View all"
          linkHref="/dashboard/bookings"
        />
        <MetricCard
          title="New Leads"
          count={data.leads.length}
          items={data.leads}
          badge={data.counts.unreadMessages}
          badgeLabel="unread"
          linkText="View inbox"
          linkHref="/inbox"
        />
        <MetricCard
          title="Pending Forms"
          count={data.counts.overdueForms}
          items={data.pendingForms}
          badge={data.counts.overdueForms}
          badgeLabel="pending"
          linkText="View forms"
          linkHref="/forms"
        />
        <MetricCard
          title="Inventory Alerts"
          count={data.counts.criticalInventory}
          items={data.inventoryAlerts}
          badge={data.counts.criticalInventory}
          badgeLabel="low stock"
          linkText="View inventory"
          linkHref="/inventory"
        />
      </div>

      {/* Charts - Middle Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <BookingTrendsChart data={data.bookingTrends} />
        <LeadSourcesChart data={data.leadSources} />
      </div>

      {/* Alerts Center - Bottom Section */}
      <AlertsCenter counts={data.counts} />
    </div>
  )
}
