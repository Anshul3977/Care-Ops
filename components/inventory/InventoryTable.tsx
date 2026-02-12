import { InventoryItem } from '@/lib/inventoryData'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  AlertTriangle,
  CheckCircle,
  XCircle,
  Edit2,
  Trash2,
  Plus,
} from 'lucide-react'
import { Card } from '@/components/ui/card'

interface InventoryTableProps {
  items: InventoryItem[]
  onEdit?: (item: InventoryItem) => void
  onDelete?: (id: string) => void
  onRestock?: (item: InventoryItem) => void
}

export function InventoryTable({
  items,
  onEdit,
  onDelete,
  onRestock,
}: InventoryTableProps) {
  const getStatusColor = (status: InventoryItem['status']) => {
    switch (status) {
      case 'in-stock':
        return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300'
      case 'low-stock':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300'
      case 'out-of-stock':
        return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300'
      case 'expired':
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-300'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatusIcon = (status: InventoryItem['status']) => {
    switch (status) {
      case 'in-stock':
        return <CheckCircle className="w-4 h-4" />
      case 'low-stock':
        return <AlertTriangle className="w-4 h-4" />
      case 'out-of-stock':
        return <XCircle className="w-4 h-4" />
      default:
        return null
    }
  }

  if (items.length === 0) {
    return (
      <Card className="p-8 border border-border text-center">
        <p className="text-muted-foreground">No inventory items found</p>
      </Card>
    )
  }

  return (
    <div className="border border-border rounded-lg overflow-x-auto bg-card">
      <table className="w-full text-sm">
        <thead className="border-b border-border bg-secondary/5">
          <tr>
            <th className="px-4 py-3 text-left font-semibold text-foreground">Name</th>
            <th className="px-4 py-3 text-left font-semibold text-foreground">SKU</th>
            <th className="px-4 py-3 text-left font-semibold text-foreground">Category</th>
            <th className="px-4 py-3 text-center font-semibold text-foreground">Quantity</th>
            <th className="px-4 py-3 text-center font-semibold text-foreground">Reorder Level</th>
            <th className="px-4 py-3 text-center font-semibold text-foreground">Status</th>
            <th className="px-4 py-3 text-right font-semibold text-foreground">Actions</th>
          </tr>
        </thead>
        <tbody>
          {items.map((item) => (
            <tr key={item.id} className="border-b border-border hover:bg-secondary/5 transition-colors">
              <td className="px-4 py-3 text-foreground font-medium">{item.name}</td>
              <td className="px-4 py-3 text-muted-foreground text-xs font-mono">{item.sku}</td>
              <td className="px-4 py-3 text-muted-foreground">{item.category}</td>
              <td className="px-4 py-3 text-center font-semibold">{item.quantity}</td>
              <td className="px-4 py-3 text-center text-muted-foreground">{item.reorderLevel}</td>
              <td className="px-4 py-3 text-center">
                <div className="flex items-center justify-center gap-2">
                  {getStatusIcon(item.status)}
                  <Badge className={getStatusColor(item.status)}>
                    {item.status.replace('-', ' ')}
                  </Badge>
                </div>
              </td>
              <td className="px-4 py-3 text-right">
                <div className="flex items-center justify-end gap-2">
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => onRestock?.(item)}
                    className="text-primary hover:bg-primary/10"
                  >
                    <Plus className="w-4 h-4" />
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => onEdit?.(item)}
                    className="text-primary hover:bg-primary/10"
                  >
                    <Edit2 className="w-4 h-4" />
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => onDelete?.(item.id)}
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
