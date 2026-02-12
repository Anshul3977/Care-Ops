'use client'

import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Plus, Search, Mail, Phone } from 'lucide-react'
import { Input } from '@/components/ui/input'

export default function CustomersPage() {
  const customers = [
    {
      id: 1,
      name: 'Acme Corp',
      email: 'contact@acme.com',
      phone: '(555) 123-4567',
      jobs: 12,
      status: 'Active',
    },
    {
      id: 2,
      name: 'Tech Solutions',
      email: 'hello@techsol.com',
      phone: '(555) 234-5678',
      jobs: 8,
      status: 'Active',
    },
    {
      id: 3,
      name: 'Global Services',
      email: 'info@globalserv.com',
      phone: '(555) 345-6789',
      jobs: 5,
      status: 'Inactive',
    },
    {
      id: 4,
      name: 'Local Business Inc',
      email: 'support@localbiz.com',
      phone: '(555) 456-7890',
      jobs: 15,
      status: 'Active',
    },
    {
      id: 5,
      name: 'Regional Enterprises',
      email: 'contact@regional.com',
      phone: '(555) 567-8901',
      jobs: 3,
      status: 'Active',
    },
  ]

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Customers</h1>
          <p className="text-muted-foreground mt-2">
            Manage customer information and history
          </p>
        </div>
        <Button className="gap-2">
          <Plus className="w-4 h-4" />
          Add Customer
        </Button>
      </div>

      {/* Search */}
      <Card className="p-4 border border-border">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search customers..."
              className="pl-10"
            />
          </div>
        </div>
      </Card>

      {/* Customers Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {customers.map((customer) => (
          <Card
            key={customer.id}
            className="p-6 border border-border hover:border-primary/50 transition-colors cursor-pointer"
          >
            <div className="space-y-4">
              {/* Header */}
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="text-lg font-bold text-foreground">
                    {customer.name}
                  </h3>
                  <span
                    className={`text-xs font-medium px-2 py-1 rounded-full mt-2 inline-block ${
                      customer.status === 'Active'
                        ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100'
                        : 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-100'
                    }`}
                  >
                    {customer.status}
                  </span>
                </div>
              </div>

              {/* Contact Info */}
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Mail className="w-4 h-4" />
                  <a href={`mailto:${customer.email}`} className="hover:text-foreground transition-colors">
                    {customer.email}
                  </a>
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Phone className="w-4 h-4" />
                  <a href={`tel:${customer.phone}`} className="hover:text-foreground transition-colors">
                    {customer.phone}
                  </a>
                </div>
              </div>

              {/* Stats */}
              <div className="pt-4 border-t border-border">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs text-muted-foreground">Total Jobs</p>
                    <p className="text-2xl font-bold text-primary">{customer.jobs}</p>
                  </div>
                  <Button variant="outline" size="sm">
                    View Details
                  </Button>
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  )
}
