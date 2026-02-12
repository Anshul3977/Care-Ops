'use client'

import React, { createContext, useContext, useState, useCallback, useEffect } from 'react'
import { InventoryItem, MOCK_INVENTORY_ITEMS } from '@/lib/inventoryData'

interface InventoryContextType {
  items: InventoryItem[]
  isLoading: boolean
  addItem: (item: Omit<InventoryItem, 'id'>) => void
  updateItem: (id: string, updates: Partial<InventoryItem>) => void
  deleteItem: (id: string) => void
  getItemById: (id: string) => InventoryItem | undefined
  getLowStockItems: () => InventoryItem[]
  getOutOfStockItems: () => InventoryItem[]
  getTotalInventoryValue: () => number
  restockItem: (id: string, quantity: number) => void
  searchItems: (query: string) => InventoryItem[]
}

const InventoryContext = createContext<InventoryContextType | undefined>(undefined)

export function InventoryProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<InventoryItem[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const savedItems = localStorage.getItem('inventory_items')
    if (savedItems) {
      setItems(JSON.parse(savedItems))
    } else {
      setItems(MOCK_INVENTORY_ITEMS)
      localStorage.setItem('inventory_items', JSON.stringify(MOCK_INVENTORY_ITEMS))
    }
    setIsLoading(false)
  }, [])

  const saveItems = useCallback((updatedItems: InventoryItem[]) => {
    localStorage.setItem('inventory_items', JSON.stringify(updatedItems))
  }, [])

  const addItem = useCallback(
    (item: Omit<InventoryItem, 'id'>) => {
      const newItem: InventoryItem = {
        ...item,
        id: `inv-${Date.now()}`,
      }
      const updatedItems = [...items, newItem]
      setItems(updatedItems)
      saveItems(updatedItems)
    },
    [items, saveItems]
  )

  const updateItem = useCallback(
    (id: string, updates: Partial<InventoryItem>) => {
      const updatedItems = items.map((item) =>
        item.id === id ? { ...item, ...updates } : item
      )
      setItems(updatedItems)
      saveItems(updatedItems)
    },
    [items, saveItems]
  )

  const deleteItem = useCallback(
    (id: string) => {
      const updatedItems = items.filter((item) => item.id !== id)
      setItems(updatedItems)
      saveItems(updatedItems)
    },
    [items, saveItems]
  )

  const getItemById = useCallback(
    (id: string) => items.find((item) => item.id === id),
    [items]
  )

  const getLowStockItems = useCallback(
    () => items.filter((item) => item.status === 'low-stock' || item.status === 'out-of-stock'),
    [items]
  )

  const getOutOfStockItems = useCallback(
    () => items.filter((item) => item.status === 'out-of-stock'),
    [items]
  )

  const getTotalInventoryValue = useCallback(
    () => items.reduce((total, item) => total + item.quantity * item.unitCost, 0),
    [items]
  )

  const restockItem = useCallback(
    (id: string, quantity: number) => {
      const item = items.find((i) => i.id === id)
      if (item) {
        const newQuantity = item.quantity + quantity
        const newStatus: InventoryItem['status'] =
          newQuantity === 0
            ? 'out-of-stock'
            : newQuantity <= item.reorderLevel
              ? 'low-stock'
              : 'in-stock'
        updateItem(id, {
          quantity: newQuantity,
          status: newStatus,
          lastRestocked: new Date().toISOString().split('T')[0],
        })
      }
    },
    [items, updateItem]
  )

  const searchItems = useCallback(
    (query: string) => {
      const lowerQuery = query.toLowerCase()
      return items.filter(
        (item) =>
          item.name.toLowerCase().includes(lowerQuery) ||
          item.sku.toLowerCase().includes(lowerQuery) ||
          item.category.toLowerCase().includes(lowerQuery) ||
          item.supplier.toLowerCase().includes(lowerQuery)
      )
    },
    [items]
  )

  return (
    <InventoryContext.Provider
      value={{
        items,
        isLoading,
        addItem,
        updateItem,
        deleteItem,
        getItemById,
        getLowStockItems,
        getOutOfStockItems,
        getTotalInventoryValue,
        restockItem,
        searchItems,
      }}
    >
      {children}
    </InventoryContext.Provider>
  )
}

export function useInventory() {
  const context = useContext(InventoryContext)
  if (!context) {
    throw new Error('useInventory must be used within InventoryProvider')
  }
  return context
}
