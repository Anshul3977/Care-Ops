'use client'

import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Download, Calendar } from 'lucide-react'

export default function ReportsPage() {
  const reports = [
    {
      title: 'Monthly Revenue Report',
      description: 'Complete breakdown of revenue by service type and customer',
      date: 'February 2026',
      icon: '📊',
    },
    {
      title: 'Job Completion Analytics',
      description: 'Analysis of job completion rates and average duration',
      date: 'February 2026',
      icon: '✓',
    },
    {
      title: 'Customer Satisfaction',
      description: 'Customer ratings and feedback summary',
      date: 'February 2026',
      icon: '⭐',
    },
    {
      title: 'Staff Performance',
      description: 'Performance metrics for all team members',
      date: 'February 2026',
      icon: '👥',
    },
    {
      title: 'Service Trends',
      description: 'Most requested services and seasonal trends',
      date: 'February 2026',
      icon: '📈',
    },
    {
      title: 'Operational Efficiency',
      description: 'Resource utilization and scheduling efficiency',
      date: 'February 2026',
      icon: '⚙️',
    },
  ]

  const metrics = [
    { label: 'Total Revenue', value: '$287,500', change: '+18%' },
    { label: 'Jobs Completed', value: '487', change: '+23%' },
    { label: 'Avg Customer Rating', value: '4.7/5.0', change: '+0.2' },
    { label: 'On-Time Rate', value: '96%', change: '+3%' },
  ]

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Reports</h1>
          <p className="text-muted-foreground mt-2">
            View analytics and operational insights
          </p>
        </div>
        <Button className="gap-2">
          <Download className="w-4 h-4" />
          Export Reports
        </Button>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {metrics.map((metric, idx) => (
          <Card key={idx} className="p-6 border border-border">
            <p className="text-sm text-muted-foreground mb-2">{metric.label}</p>
            <div className="flex items-end justify-between">
              <p className="text-3xl font-bold text-foreground">{metric.value}</p>
              <span className="text-sm font-medium text-green-600">{metric.change}</span>
            </div>
          </Card>
        ))}
      </div>

      {/* Date Range Filter */}
      <Card className="p-4 border border-border">
        <div className="flex items-center gap-4">
          <Calendar className="w-5 h-5 text-muted-foreground" />
          <select className="flex-1 px-3 py-2 rounded-lg border border-input bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary">
            <option>Last 30 days</option>
            <option>Last 90 days</option>
            <option>Last year</option>
            <option>Custom range</option>
          </select>
        </div>
      </Card>

      {/* Reports Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {reports.map((report, idx) => (
          <Card
            key={idx}
            className="p-6 border border-border hover:border-primary/50 transition-colors cursor-pointer group"
          >
            <div className="space-y-4">
              <div className="flex items-start justify-between">
                <div className="text-3xl">{report.icon}</div>
                <Download className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-foreground">
                  {report.title}
                </h3>
                <p className="text-sm text-muted-foreground mt-2">
                  {report.description}
                </p>
              </div>
              <div className="pt-4 border-t border-border">
                <p className="text-xs text-muted-foreground">{report.date}</p>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Summary Section */}
      <Card className="p-8 border border-border bg-primary/5">
        <h2 className="text-2xl font-bold text-foreground mb-4">Summary</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h3 className="font-semibold text-foreground mb-3">Key Achievements</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>✓ Exceeded revenue targets by 18%</li>
              <li>✓ Improved job completion rate to 96%</li>
              <li>✓ Increased customer satisfaction scores</li>
              <li>✓ Optimized resource allocation</li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold text-foreground mb-3">Areas for Growth</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>○ Expand into new service categories</li>
              <li>○ Increase seasonal job scheduling</li>
              <li>○ Develop staff training programs</li>
              <li>○ Enhance customer retention strategies</li>
            </ul>
          </div>
        </div>
      </Card>
    </div>
  )
}
