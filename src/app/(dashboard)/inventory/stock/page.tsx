// src/app/(dashboard)/inventory/stock/page.tsx
'use client'

import { StockTable } from '@/components/inventory/stock-table'
import { RoleGuard } from '@/components/shared/role-guard'

export default function InventoryStockPage() {
  return (
    <RoleGuard allowedRoles={['inventory']}>
      <div className="space-y-6">
        {/* Page Header */}
        <div>
          <h1 className="text-3xl font-bold text-foreground">Stock Management</h1>
          <p className="text-muted-foreground mt-2">
            Monitor and manage product inventory levels
          </p>
        </div>

        {/* Stock Table */}
        <StockTable />
      </div>
    </RoleGuard>
  )
}
