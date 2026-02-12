'use client'

import { useState } from 'react'
import { useOnboarding } from '@/contexts/OnboardingContext'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Plus, Trash2 } from 'lucide-react'

export function Step6Inventory() {
  const { state, updateInventory } = useOnboarding()
  const [items, setItems] = useState(state.inventory?.items || [])
  const [newItem, setNewItem] = useState({
    name: '',
    quantity: '',
    threshold: '',
    usagePerBooking: '',
  })

  const isComplete = items.length >= 0 // At least one item or can be empty

  const handleAddItem = () => {
    if (
      newItem.name.trim() &&
      newItem.quantity &&
      newItem.threshold &&
      newItem.usagePerBooking
    ) {
      setItems([
        ...items,
        {
          id: Math.random().toString(),
          name: newItem.name,
          quantity: parseInt(newItem.quantity),
          lowStockThreshold: parseInt(newItem.threshold),
          usagePerBooking: parseInt(newItem.usagePerBooking),
        },
      ])
      setNewItem({ name: '', quantity: '', threshold: '', usagePerBooking: '' })
    }
  }

  const handleRemoveItem = (id: string) => {
    setItems(items.filter((item) => item.id !== id))
  }

  const handleSave = () => {
    updateInventory({
      items,
    })
  }

  React.useEffect(() => {
    const timer = setTimeout(handleSave, 500)
    return () => clearTimeout(timer)
  }, [items])

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold text-foreground mb-2">
          Inventory Setup
        </h2>
        <p className="text-muted-foreground">
          Track supplies and resources used in your service
        </p>
      </div>

      <Card className="p-6 border border-border overflow-x-auto">
        <div className="mb-6">
          <h3 className="font-semibold text-foreground mb-4">Inventory Items</h3>
        </div>

        {/* Add Item Form */}
        <div className="p-4 rounded-lg border border-dashed border-border mb-6 space-y-3">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div>
              <Label htmlFor="itemName" className="text-sm">
                Item Name
              </Label>
              <Input
                id="itemName"
                placeholder="e.g., Cleaning Solution"
                value={newItem.name}
                onChange={(e) =>
                  setNewItem({ ...newItem, name: e.target.value })
                }
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="quantity" className="text-sm">
                Current Quantity
              </Label>
              <Input
                id="quantity"
                type="number"
                placeholder="e.g., 50"
                value={newItem.quantity}
                onChange={(e) =>
                  setNewItem({ ...newItem, quantity: e.target.value })
                }
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="threshold" className="text-sm">
                Low Stock Threshold
              </Label>
              <Input
                id="threshold"
                type="number"
                placeholder="e.g., 10"
                value={newItem.threshold}
                onChange={(e) =>
                  setNewItem({ ...newItem, threshold: e.target.value })
                }
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="usage" className="text-sm">
                Usage Per Booking
              </Label>
              <Input
                id="usage"
                type="number"
                placeholder="e.g., 2"
                value={newItem.usagePerBooking}
                onChange={(e) =>
                  setNewItem({ ...newItem, usagePerBooking: e.target.value })
                }
                className="mt-1"
              />
            </div>
          </div>
          <Button
            onClick={handleAddItem}
            className="w-full gap-2"
            disabled={
              !newItem.name.trim() ||
              !newItem.quantity ||
              !newItem.threshold ||
              !newItem.usagePerBooking
            }
          >
            <Plus className="w-4 h-4" />
            Add Item
          </Button>
        </div>

        {/* Items Table */}
        {items.length > 0 ? (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Item Name</TableHead>
                <TableHead className="text-right">Quantity</TableHead>
                <TableHead className="text-right">Low Stock Threshold</TableHead>
                <TableHead className="text-right">Usage/Booking</TableHead>
                <TableHead className="w-12">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {items.map((item) => (
                <TableRow key={item.id}>
                  <TableCell className="font-medium">{item.name}</TableCell>
                  <TableCell className="text-right">{item.quantity}</TableCell>
                  <TableCell className="text-right">
                    {item.lowStockThreshold}
                  </TableCell>
                  <TableCell className="text-right">
                    {item.usagePerBooking}
                  </TableCell>
                  <TableCell>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => handleRemoveItem(item.id)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        ) : (
          <div className="text-center py-8">
            <p className="text-sm text-muted-foreground">
              No inventory items added yet. Add your first item above.
            </p>
          </div>
        )}
      </Card>

      {/* Info */}
      <div className="p-4 rounded-lg bg-primary/10 border border-primary/20">
        <p className="text-sm text-foreground">
          {items.length > 0
            ? `${items.length} item${items.length !== 1 ? 's' : ''} tracked. The system will alert you when stock falls below the threshold.`
            : 'Inventory tracking is optional. You can add items now or skip to the next step.'}
        </p>
      </div>
    </div>
  )
}
