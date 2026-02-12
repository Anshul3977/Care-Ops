'use client'

import { useState, useMemo } from 'react'
import { useForms } from '@/contexts/FormsContext'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { SubmissionsTable } from '@/components/forms/SubmissionsTable'
import { FormSubmission } from '@/lib/formsData'
import {
  CheckCircle,
  Clock,
  AlertCircle,
  FileText,
  Eye,
} from 'lucide-react'

export default function FormsPage() {
  const {
    submissions,
    getCompletionStats,
    getPendingSubmissions,
    getCompletedSubmissions,
    deleteSubmission,
    updateSubmission,
  } = useForms()

  const [searchQuery, setSearchQuery] = useState('')
  const [selectedSubmission, setSelectedSubmission] = useState<FormSubmission | null>(null)
  const [activeTab, setActiveTab] = useState('all')

  const stats = useMemo(() => getCompletionStats(), [getCompletionStats])
  const pendingSubmissions = useMemo(() => getPendingSubmissions(), [getPendingSubmissions])
  const completedSubmissions = useMemo(
    () => getCompletedSubmissions(),
    [getCompletedSubmissions]
  )

  const filteredSubmissions = useMemo(() => {
    let filtered = submissions

    // Filter by tab
    if (activeTab === 'pending') {
      filtered = pendingSubmissions
    } else if (activeTab === 'completed') {
      filtered = completedSubmissions
    } else if (activeTab === 'needs-revision') {
      filtered = submissions.filter((s) => s.status === 'needs-revision')
    }

    // Filter by search
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      filtered = filtered.filter(
        (sub) =>
          sub.customerName.toLowerCase().includes(query) ||
          sub.customerEmail.toLowerCase().includes(query) ||
          sub.formName.toLowerCase().includes(query)
      )
    }

    return filtered
  }, [submissions, searchQuery, activeTab, pendingSubmissions, completedSubmissions])

  const handleStatusChange = (id: string, newStatus: FormSubmission['status']) => {
    updateSubmission(id, { status: newStatus })
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-foreground">Forms & Submissions</h1>
        <p className="text-muted-foreground mt-2">
          Track and manage customer form submissions and responses
        </p>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        <Card className="p-4 border border-border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Total</p>
              <p className="text-2xl font-bold text-foreground">{stats.total}</p>
            </div>
            <div className="p-3 rounded-lg bg-primary/10">
              <FileText className="w-6 h-6 text-primary" />
            </div>
          </div>
        </Card>

        <Card className="p-4 border border-border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Pending</p>
              <p className="text-2xl font-bold text-yellow-600">{stats.pending}</p>
            </div>
            <div className="p-3 rounded-lg bg-yellow-100 dark:bg-yellow-900/30">
              <Clock className="w-6 h-6 text-yellow-600" />
            </div>
          </div>
        </Card>

        <Card className="p-4 border border-border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Reviewed</p>
              <p className="text-2xl font-bold text-blue-600">{stats.reviewed}</p>
            </div>
            <div className="p-3 rounded-lg bg-blue-100 dark:bg-blue-900/30">
              <Eye className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </Card>

        <Card className="p-4 border border-border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Completed</p>
              <p className="text-2xl font-bold text-green-600">{stats.completed}</p>
            </div>
            <div className="p-3 rounded-lg bg-green-100 dark:bg-green-900/30">
              <CheckCircle className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </Card>

        <Card className="p-4 border border-border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Needs Review</p>
              <p className="text-2xl font-bold text-red-600">{stats.needsRevision}</p>
            </div>
            <div className="p-3 rounded-lg bg-red-100 dark:bg-red-900/30">
              <AlertCircle className="w-6 h-6 text-red-600" />
            </div>
          </div>
        </Card>
      </div>

      {/* Alerts */}
      {stats.needsRevision > 0 && (
        <Card className="p-4 border border-red-200 bg-red-50 dark:bg-red-900/20">
          <div className="flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-red-600 mt-0.5 flex-shrink-0" />
            <div>
              <h3 className="font-semibold text-red-900 dark:text-red-300">
                Forms Needing Review
              </h3>
              <p className="text-sm text-red-800 dark:text-red-200 mt-1">
                {stats.needsRevision} form submission(s) need your attention and revision.
              </p>
            </div>
          </div>
        </Card>
      )}

      {/* Search */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
        <Input
          placeholder="Search by customer name or email..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="flex-1"
        />
        <Button>New Form</Button>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList>
          <TabsTrigger value="all">All ({submissions.length})</TabsTrigger>
          <TabsTrigger value="pending">Pending ({pendingSubmissions.length})</TabsTrigger>
          <TabsTrigger value="completed">Completed ({completedSubmissions.length})</TabsTrigger>
          <TabsTrigger value="needs-revision">
            Needs Review ({stats.needsRevision})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="mt-6">
          <SubmissionsTable
            submissions={filteredSubmissions}
            onView={(submission) => setSelectedSubmission(submission)}
            onEdit={(submission) => setSelectedSubmission(submission)}
            onDelete={deleteSubmission}
          />
        </TabsContent>

        <TabsContent value="pending" className="mt-6">
          <SubmissionsTable
            submissions={filteredSubmissions}
            onView={(submission) => setSelectedSubmission(submission)}
            onEdit={(submission) => setSelectedSubmission(submission)}
            onDelete={deleteSubmission}
          />
        </TabsContent>

        <TabsContent value="completed" className="mt-6">
          <SubmissionsTable
            submissions={filteredSubmissions}
            onView={(submission) => setSelectedSubmission(submission)}
            onEdit={(submission) => setSelectedSubmission(submission)}
            onDelete={deleteSubmission}
          />
        </TabsContent>

        <TabsContent value="needs-revision" className="mt-6">
          <SubmissionsTable
            submissions={filteredSubmissions}
            onView={(submission) => setSelectedSubmission(submission)}
            onEdit={(submission) => setSelectedSubmission(submission)}
            onDelete={deleteSubmission}
          />
        </TabsContent>
      </Tabs>

      {/* Detail Modal */}
      {selectedSubmission && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <Card className="w-full max-w-2xl p-6 border border-border max-h-[90vh] overflow-y-auto">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="text-lg font-bold text-foreground">
                  {selectedSubmission.formName}
                </h3>
                <p className="text-sm text-muted-foreground">
                  {selectedSubmission.customerName} ({selectedSubmission.customerEmail})
                </p>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setSelectedSubmission(null)}
              >
                ✕
              </Button>
            </div>

            <div className="space-y-4 mb-6">
              <div>
                <label className="text-sm font-medium text-foreground">Status</label>
                <select
                  value={selectedSubmission.status}
                  onChange={(e) =>
                    handleStatusChange(
                      selectedSubmission.id,
                      e.target.value as FormSubmission['status']
                    )
                  }
                  className="w-full mt-1 px-3 py-2 rounded border border-border bg-card text-foreground"
                >
                  <option value="pending">Pending</option>
                  <option value="reviewed">Reviewed</option>
                  <option value="completed">Completed</option>
                  <option value="needs-revision">Needs Revision</option>
                </select>
              </div>

              {selectedSubmission.notes && (
                <div>
                  <label className="text-sm font-medium text-foreground">Notes</label>
                  <p className="text-sm text-muted-foreground mt-2">{selectedSubmission.notes}</p>
                </div>
              )}

              <div>
                <label className="text-sm font-medium text-foreground mb-3 block">
                  Form Fields
                </label>
                <div className="space-y-3">
                  {Object.entries(selectedSubmission.fields).map(([key, value]) => (
                    <div key={key} className="p-3 bg-secondary/5 rounded border border-border">
                      <p className="text-xs font-medium text-muted-foreground uppercase">
                        {key.replace(/_/g, ' ')}
                      </p>
                      <p className="text-foreground mt-1">{value}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex gap-3 justify-end border-t border-border pt-4">
              <Button variant="outline" onClick={() => setSelectedSubmission(null)}>
                Close
              </Button>
              <Button onClick={() => setSelectedSubmission(null)}>Save Changes</Button>
            </div>
          </Card>
        </div>
      )}
    </div>
  )
}
