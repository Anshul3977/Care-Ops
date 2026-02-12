'use client'

import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Plus, Search, Filter } from 'lucide-react'
import { Input } from '@/components/ui/input'

export default function JobsPage() {
  const jobs = [
    {
      id: '001',
      customer: 'Acme Corp',
      service: 'HVAC Maintenance',
      status: 'In Progress',
      date: '2026-02-12',
      assignee: 'John Smith',
    },
    {
      id: '002',
      customer: 'Tech Solutions',
      service: 'Plumbing Repair',
      status: 'Completed',
      date: '2026-02-11',
      assignee: 'Sarah Johnson',
    },
    {
      id: '003',
      customer: 'Global Services',
      service: 'Electrical Work',
      status: 'Pending',
      date: '2026-02-13',
      assignee: 'Mike Davis',
    },
    {
      id: '004',
      customer: 'Local Business Inc',
      service: 'General Maintenance',
      status: 'In Progress',
      date: '2026-02-12',
      assignee: 'Emily Wilson',
    },
  ]

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Completed':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100'
      case 'In Progress':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100'
      default:
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-100'
    }
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Jobs</h1>
          <p className="text-muted-foreground mt-2">
            Manage and track all service jobs
          </p>
        </div>
        <Button className="gap-2">
          <Plus className="w-4 h-4" />
          New Job
        </Button>
      </div>

      {/* Filters */}
      <Card className="p-4 border border-border">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search jobs..."
              className="pl-10"
            />
          </div>
          <Button variant="outline" className="gap-2">
            <Filter className="w-4 h-4" />
            Filter
          </Button>
        </div>
      </Card>

      {/* Jobs Table */}
      <Card className="border border-border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-secondary/50 border-b border-border">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">
                  Job ID
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">
                  Customer
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">
                  Service
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">
                  Assignee
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">
                  Date
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">
                  Status
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {jobs.map((job) => (
                <tr key={job.id} className="hover:bg-secondary/30 transition-colors cursor-pointer">
                  <td className="px-6 py-4 text-sm font-medium text-foreground">
                    #{job.id}
                  </td>
                  <td className="px-6 py-4 text-sm text-foreground">
                    {job.customer}
                  </td>
                  <td className="px-6 py-4 text-sm text-muted-foreground">
                    {job.service}
                  </td>
                  <td className="px-6 py-4 text-sm text-foreground">
                    {job.assignee}
                  </td>
                  <td className="px-6 py-4 text-sm text-muted-foreground">
                    {job.date}
                  </td>
                  <td className="px-6 py-4 text-sm">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(job.status)}`}>
                      {job.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  )
}
