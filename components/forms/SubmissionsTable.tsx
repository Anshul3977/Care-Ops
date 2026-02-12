import { FormSubmission } from '@/lib/formsData'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Eye, Edit2, Trash2, CheckCircle, AlertCircle, Clock } from 'lucide-react'
import { format } from 'date-fns'

interface SubmissionsTableProps {
  submissions: FormSubmission[]
  onView?: (submission: FormSubmission) => void
  onEdit?: (submission: FormSubmission) => void
  onDelete?: (id: string) => void
}

export function SubmissionsTable({
  submissions,
  onView,
  onEdit,
  onDelete,
}: SubmissionsTableProps) {
  const getStatusColor = (status: FormSubmission['status']) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300'
      case 'reviewed':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300'
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300'
      case 'needs-revision':
        return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatusIcon = (status: FormSubmission['status']) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="w-4 h-4" />
      case 'pending':
        return <Clock className="w-4 h-4" />
      case 'needs-revision':
        return <AlertCircle className="w-4 h-4" />
      default:
        return null
    }
  }

  if (submissions.length === 0) {
    return (
      <Card className="p-8 border border-border text-center">
        <p className="text-muted-foreground">No form submissions found</p>
      </Card>
    )
  }

  return (
    <div className="border border-border rounded-lg overflow-x-auto bg-card">
      <table className="w-full text-sm">
        <thead className="border-b border-border bg-secondary/5">
          <tr>
            <th className="px-4 py-3 text-left font-semibold text-foreground">Customer</th>
            <th className="px-4 py-3 text-left font-semibold text-foreground">Form Name</th>
            <th className="px-4 py-3 text-left font-semibold text-foreground">Submitted</th>
            <th className="px-4 py-3 text-center font-semibold text-foreground">Status</th>
            <th className="px-4 py-3 text-center font-semibold text-foreground">Progress</th>
            <th className="px-4 py-3 text-right font-semibold text-foreground">Actions</th>
          </tr>
        </thead>
        <tbody>
          {submissions.map((submission) => (
            <tr
              key={submission.id}
              className="border-b border-border hover:bg-secondary/5 transition-colors"
            >
              <td className="px-4 py-3">
                <div>
                  <p className="font-medium text-foreground">{submission.customerName}</p>
                  <p className="text-xs text-muted-foreground">{submission.customerEmail}</p>
                </div>
              </td>
              <td className="px-4 py-3 text-foreground">{submission.formName}</td>
              <td className="px-4 py-3 text-muted-foreground text-sm">
                {format(new Date(submission.submittedAt), 'MMM dd, yyyy')}
              </td>
              <td className="px-4 py-3 text-center">
                <div className="flex items-center justify-center gap-2">
                  {getStatusIcon(submission.status)}
                  <Badge className={getStatusColor(submission.status)}>
                    {submission.status.replace('-', ' ')}
                  </Badge>
                </div>
              </td>
              <td className="px-4 py-3 text-center">
                <div className="flex items-center justify-center gap-2">
                  <div className="w-12 h-2 rounded-full bg-secondary/20">
                    <div
                      className="h-full rounded-full bg-primary transition-all"
                      style={{ width: `${submission.completionPercentage}%` }}
                    />
                  </div>
                  <span className="text-xs text-muted-foreground w-8 text-right">
                    {submission.completionPercentage}%
                  </span>
                </div>
              </td>
              <td className="px-4 py-3 text-right">
                <div className="flex items-center justify-end gap-2">
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => onView?.(submission)}
                    className="text-primary hover:bg-primary/10"
                  >
                    <Eye className="w-4 h-4" />
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => onEdit?.(submission)}
                    className="text-primary hover:bg-primary/10"
                  >
                    <Edit2 className="w-4 h-4" />
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => onDelete?.(submission.id)}
                    className="text-destructive hover:bg-destructive/10"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
