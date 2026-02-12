'use client'

import { useState, useMemo } from 'react'
import { useInventory } from '@/contexts/InventoryContext'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { InventoryTable } from '@/components/inventory/InventoryTable'
import { AlertTriangle, Package, TrendingDown, DollarSign } from 'lucide-react'

export default function InventoryPage() {
  const { items, getLowStockItems, getOutOfStockItems, getTotalInventoryValue, deleteItem, restockItem } = useInventory()
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedItem, setSelectedItem] = useState<string | null>(null)
  const [restockAmount, setRestockAmount] = useState('10')

  const lowStockItems = useMemo(() => getLowStockItems(), [getLowStockItems])
  const outOfStockItems = useMemo(() => getOutOfStockItems(), [getOutOfStockItems])
  const totalValue = useMemo(() => getTotalInventoryValue(), [getTotalInventoryValue])

  const filteredItems = useMemo(() => {
    if (!searchQuery) return items
    const query = searchQuery.toLowerCase()
    return items.filter(
      (item) =>
        item.name.toLowerCase().includes(query) ||
        item.sku.toLowerCase().includes(query) ||
        item.category.toLowerCase().includes(query)
    )
  }, [items, searchQuery])

  const handleRestock = (itemId: string) => {
    const amount = parseInt(restockAmount) || 10
    restockItem(itemId, amount)
    setSelectedItem(null)
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-foreground">Inventory Management</h1>
        <p className="text-muted-foreground mt-2">
          Track and manage your inventory levels, stock status, and reordering
        </p>
      </div>

      {/* Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="p-4 border border-border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Total Items</p>
              <p className="text-2xl font-bold text-foreground">{items.length}</p>
            </div>
            <div className="p-3 rounded-lg bg-primary/10">
              <Package className="w-6 h-6 text-primary" />
            </div>
          </div>
        </Card>

        <Card className="p-4 border border-border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Low Stock</p>
              <p className="text-2xl font-bold text-yellow-600">{lowStockItems.length}</p>
            </div>
            <div className="p-3 rounded-lg bg-yellow-100 dark:bg-yellow-900/30">
              <AlertTriangle className="w-6 h-6 text-yellow-600" />
            </div>
          </div>
        </Card>

        <Card className="p-4 border border-border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Out of Stock</p>
              <p className="text-2xl font-bold text-red-600">{outOfStockItems.length}</p>
            </div>
            <div className="p-3 rounded-lg bg-red-100 dark:bg-red-900/30">
              <TrendingDown className="w-6 h-6 text-red-600" />
            </div>
          </div>
        </Card>

        <Card className="p-4 border border-border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Total Value</p>
              <p className="text-2xl font-bold text-foreground">${totalValue.toLocaleString()}</p>
            </div>
            <div className="p-3 rounded-lg bg-green-100 dark:bg-green-900/30">
              <DollarSign className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </Card>
      </div>

      {/* Alerts */}
      {(lowStockItems.length > 0 || outOfStockItems.length > 0) && (
        <Card className="p-4 border border-yellow-200 bg-yellow-50 dark:bg-yellow-900/20">
          <div className="flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-yellow-600 mt-0.5 flex-shrink-0" />
            <div>
              <h3 className="font-semibold text-yellow-900 dark:text-yellow-300">Stock Alerts</h3>
              <p className="text-sm text-yellow-800 dark:text-yellow-200 mt-1">
                {lowStockItems.length} items are low on stock and {outOfStockItems.length}{' '}
                items are out of stock. Consider reordering soon.
              </p>
            </div>
          </div>
        </Card>
      )}

      {/* Search and Filters */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
        <Input
          placeholder="Search by name, SKU, or category..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="flex-1"
        />
        <Button>Add Item</Button>
      </div>

      {/* Inventory Table */}
      <div>
        <h2 className="text-xl font-bold text-foreground mb-4">
          Inventory Items ({filteredItems.length})
        </h2>
        <InventoryTable
          items={filteredItems}
          onDelete={deleteItem}
          onRestock={(item) => {
            setSelectedItem(item.id)
          }}
        />
      </div>

      {/* Restock Modal */}
      {selectedItem && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <Card className="w-full max-w-md p-6 border border-border">
            <h3 className="text-lg font-bold text-foreground mb-4">Restock Item</h3>
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-foreground">Quantity to Add</label>
                <Input
                  type="number"
                  min="1"
                  value={restockAmount}
                  onChange={(e) => setRestockAmount(e.target.value)}
                  className="mt-2"
                />
              </div>
              <div className="flex gap-3 justify-end">
                <Button
                  variant="outline"
                  onClick={() => setSelectedItem(null)}
                >
                  Cancel
                </Button>
                <Button
                  onClick={() => handleRestock(selectedItem)}
                >
                  Confirm Restock
                </Button>
              </div>
            </div>
          </Card>
        </div>
      )}
    </div>
  )
}
