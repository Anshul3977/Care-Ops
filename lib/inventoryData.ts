export interface InventoryItem {
  id: string
  name: string
  sku: string
  category: string
  quantity: number
  reorderLevel: number
  unitCost: number
  supplier: string
  lastRestocked: string
  expiryDate?: string
  status: 'in-stock' | 'low-stock' | 'out-of-stock' | 'expired'
  location: string
  notes?: string
}

export const INVENTORY_CATEGORIES = [
  'Cleaning Supplies',
  'Equipment',
  'Chemicals',
  'Tools',
  'Protective Gear',
  'Other',
]

export const MOCK_INVENTORY_ITEMS: InventoryItem[] = [
  {
    id: '1',
    name: 'Vacuum Cleaner Pro',
    sku: 'VC-2024-001',
    category: 'Equipment',
    quantity: 3,
    reorderLevel: 2,
    unitCost: 450,
    supplier: 'CleanTech Supplies',
    lastRestocked: '2026-02-05',
    status: 'in-stock',
    location: 'Warehouse A - Shelf 1',
  },
  {
    id: '2',
    name: 'Eco Cleaning Solution (5L)',
    sku: 'ECS-2024-002',
    category: 'Chemicals',
    quantity: 8,
    reorderLevel: 5,
    unitCost: 35,
    supplier: 'EcoClean Ltd',
    lastRestocked: '2026-02-08',
    status: 'in-stock',
    location: 'Warehouse A - Shelf 3',
  },
  {
    id: '3',
    name: 'Microfiber Cloths (Pack of 50)',
    sku: 'MFC-2024-003',
    category: 'Cleaning Supplies',
    quantity: 2,
    reorderLevel: 10,
    unitCost: 22,
    supplier: 'SupplyCo',
    lastRestocked: '2026-01-28',
    status: 'low-stock',
    location: 'Warehouse B - Shelf 2',
    notes: 'Reorder ASAP',
  },
  {
    id: '4',
    name: 'Protective Gloves (Box 100)',
    sku: 'PG-2024-004',
    category: 'Protective Gear',
    quantity: 0,
    reorderLevel: 3,
    unitCost: 15,
    supplier: 'SafeGuard Inc',
    lastRestocked: '2026-01-15',
    status: 'out-of-stock',
    location: 'Warehouse B - Shelf 1',
  },
  {
    id: '5',
    name: 'Professional Mop Head',
    sku: 'PM-2024-005',
    category: 'Equipment',
    quantity: 12,
    reorderLevel: 5,
    unitCost: 18,
    supplier: 'ProClean',
    lastRestocked: '2026-02-10',
    status: 'in-stock',
    location: 'Warehouse A - Shelf 2',
  },
  {
    id: '6',
    name: 'Disinfectant Spray (1L)',
    sku: 'DS-2024-006',
    category: 'Chemicals',
    quantity: 4,
    reorderLevel: 8,
    unitCost: 12,
    supplier: 'BioChem Ltd',
    lastRestocked: '2026-02-01',
    status: 'low-stock',
    location: 'Warehouse A - Shelf 4',
    expiryDate: '2026-08-15',
  },
  {
    id: '7',
    name: 'Heavy Duty Brush Set',
    sku: 'HDB-2024-007',
    category: 'Tools',
    quantity: 6,
    reorderLevel: 3,
    unitCost: 28,
    supplier: 'ToolMasters',
    lastRestocked: '2026-02-03',
    status: 'in-stock',
    location: 'Warehouse B - Shelf 3',
  },
  {
    id: '8',
    name: 'Safety Face Masks (Box 50)',
    sku: 'SFM-2024-008',
    category: 'Protective Gear',
    quantity: 1,
    reorderLevel: 5,
    unitCost: 8,
    supplier: 'SafeGuard Inc',
    lastRestocked: '2026-01-20',
    status: 'low-stock',
    location: 'Warehouse B - Shelf 1',
    expiryDate: '2026-12-31',
  },
]
