// src/app/(dashboard)/inventory/alerts/page.tsx
'use client'

import { LowStockAlerts } from '@/components/inventory/low-stock-alerts'
import { RoleGuard } from '@/components/shared/role-guard'

export default function InventoryAlertsPage() {
  return (
    <RoleGuard allowedRoles={['inventory_manager']}>
      <div className="space-y-6">
        {/* Page Header */}
        <div>
          <h1 className="text-3xl font-bold text-foreground">Low Stock Alerts</h1>
          <p className="text-muted-foreground mt-2">
            Monitor and manage products with low inventory levels
          </p>
        </div>

        {/* Low Stock Alerts */}
        <LowStockAlerts />
      </div>
    </RoleGuard>
  )
}
