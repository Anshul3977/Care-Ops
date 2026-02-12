'use client'

import Link from 'next/link'
import { useAuth } from '@/contexts/AuthContext'
import { useInventory } from '@/contexts/InventoryContext'
import { useForms } from '@/contexts/FormsContext'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { BarChart3, Users, Briefcase, TrendingUp, Settings, Mail, Calendar, Package, FileText } from 'lucide-react'

export default function DashboardPage() {
  const { user } = useAuth()
  const { getLowStockItems } = useInventory()
  const { getCompletionStats } = useForms()

  const lowStockCount = getLowStockItems().length
  const formStats = getCompletionStats()

  const stats = [
    {
      label: 'Active Jobs',
      value: '24',
      icon: Briefcase,
      trend: '+12%',
      color: 'text-blue-600',
    },
    {
      label: 'Customers',
      value: '156',
      icon: Users,
      trend: '+8%',
      color: 'text-green-600',
    },
    {
      label: 'Revenue',
      value: '$45.2K',
      icon: TrendingUp,
      trend: '+23%',
      color: 'text-purple-600',
    },
    {
      label: 'Completion Rate',
      value: '94%',
      icon: BarChart3,
      trend: '+5%',
      color: 'text-orange-600',
    },
  ]

  return (
    <div className="space-y-8">
      {/* Header with Navigation */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground">
            Welcome back, {user?.name}!
          </h1>
          <p className="text-muted-foreground mt-2">
            Here's your operations overview for today
          </p>
        </div>
        <div className="flex gap-2">
          {user?.role === 'admin' && (
            <>
              <Link href="/dashboard/owner">
                <Button variant="outline" className="gap-2">
                  <BarChart3 className="w-4 h-4" />
                  Owner Dashboard
                </Button>
              </Link>
              <Link href="/onboarding">
                <Button variant="outline" className="gap-2">
                  <Settings className="w-4 h-4" />
                  Setup Guide
                </Button>
              </Link>
            </>
          )}
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, idx) => {
          const Icon = stat.icon
          return (
            <Card
              key={idx}
              className="p-6 flex flex-col gap-4 border border-border hover:border-primary/50 transition-colors"
            >
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-medium text-muted-foreground">
                  {stat.label}
                </h3>
                <div className={`p-2 rounded-lg bg-primary/10`}>
                  <Icon className={`w-5 h-5 ${stat.color}`} />
                </div>
              </div>
              <div>
                <p className="text-3xl font-bold text-foreground">
                  {stat.value}
                </p>
                <p className="text-sm text-green-600 font-medium mt-1">
                  {stat.trend} from last month
                </p>
              </div>
            </Card>
          )
        })}
      </div>

      {/* Quick Access */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4">
        <Link href="/inbox">
          <Card className="p-4 border border-border hover:border-primary/50 hover:bg-primary/5 transition-all cursor-pointer">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-primary/10">
                <Mail className="w-5 h-5 text-primary" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Messages</p>
                <p className="text-lg font-bold text-foreground">5 Unread</p>
              </div>
            </div>
          </Card>
        </Link>

        <Link href="/bookings">
          <Card className="p-4 border border-border hover:border-primary/50 hover:bg-primary/5 transition-all cursor-pointer">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-green-100 dark:bg-green-900/30">
                <Calendar className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Bookings</p>
                <p className="text-lg font-bold text-foreground">8 Scheduled</p>
              </div>
            </div>
          </Card>
        </Link>

        <Link href="/jobs">
          <Card className="p-4 border border-border hover:border-primary/50 hover:bg-primary/5 transition-all cursor-pointer">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-blue-100 dark:bg-blue-900/30">
                <Briefcase className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Active Jobs</p>
                <p className="text-lg font-bold text-foreground">24 Total</p>
              </div>
            </div>
          </Card>
        </Link>

        <Link href="/customers">
          <Card className="p-4 border border-border hover:border-primary/50 hover:bg-primary/5 transition-all cursor-pointer">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-purple-100 dark:bg-purple-900/30">
                <Users className="w-5 h-5 text-purple-600" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Customers</p>
                <p className="text-lg font-bold text-foreground">156 Total</p>
              </div>
            </div>
          </Card>
        </Link>

        <Link href="/inventory">
          <Card className="p-4 border border-border hover:border-primary/50 hover:bg-primary/5 transition-all cursor-pointer">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-orange-100 dark:bg-orange-900/30">
                <Package className="w-5 h-5 text-orange-600" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Low Stock</p>
                <p className="text-lg font-bold text-orange-600">{lowStockCount} Items</p>
              </div>
            </div>
          </Card>
        </Link>

        <Link href="/forms">
          <Card className="p-4 border border-border hover:border-primary/50 hover:bg-primary/5 transition-all cursor-pointer">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-cyan-100 dark:bg-cyan-900/30">
                <FileText className="w-5 h-5 text-cyan-600" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Pending Forms</p>
                <p className="text-lg font-bold text-cyan-600">{formStats.pending} Pending</p>
              </div>
            </div>
          </Card>
        </Link>
      </div>

      {/* Main content area */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent jobs */}
        <Card className="lg:col-span-2 p-6 border border-border">
          <h2 className="text-xl font-bold text-foreground mb-4">
            Recent Jobs
          </h2>
          <div className="space-y-3">
            {[
              { id: '001', customer: 'Acme Corp', status: 'In Progress' },
              { id: '002', customer: 'Tech Solutions', status: 'Completed' },
              { id: '003', customer: 'Global Services', status: 'Pending' },
            ].map((job) => (
              <div
                key={job.id}
                className="flex items-center justify-between p-3 rounded-lg bg-secondary/50 hover:bg-secondary transition-colors"
              >
                <div>
                  <p className="font-medium text-foreground">Job #{job.id}</p>
                  <p className="text-sm text-muted-foreground">{job.customer}</p>
                </div>
                <span
                  className={`px-3 py-1 rounded-full text-xs font-medium ${
                    job.status === 'Completed'
                      ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100'
                      : job.status === 'In Progress'
                        ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100'
                        : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-100'
                  }`}
                >
                  {job.status}
                </span>
              </div>
            ))}
          </div>
        </Card>

        {/* Quick links */}
        <Card className="p-6 border border-border">
          <h2 className="text-xl font-bold text-foreground mb-4">Quick Stats</h2>
          <div className="space-y-3">
            <div className="p-3 rounded-lg bg-primary/10 border border-primary/20">
              <p className="text-xs text-muted-foreground">Avg Job Duration</p>
              <p className="text-2xl font-bold text-primary">3.2 hours</p>
            </div>
            <div className="p-3 rounded-lg bg-primary/10 border border-primary/20">
              <p className="text-xs text-muted-foreground">Total Assignments</p>
              <p className="text-2xl font-bold text-primary">87</p>
            </div>
            <div className="p-3 rounded-lg bg-primary/10 border border-primary/20">
              <p className="text-xs text-muted-foreground">Customer Rating</p>
              <p className="text-2xl font-bold text-primary">4.8/5.0</p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  )
}
