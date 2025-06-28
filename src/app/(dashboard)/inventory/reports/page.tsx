// src/app/(dashboard)/inventory/reports/page.tsx
'use client'

import { InventoryReports } from '@/components/inventory/inventory-reports'
import { RoleGuard } from '@/components/shared/role-guard'

export default function InventoryReportsPage() {
  return (
    <RoleGuard allowedRoles={['inventory']}>
      <div className="space-y-6">
        {/* Page Header */}
        <div>
          <h1 className="text-3xl font-bold text-foreground">Inventory Reports</h1>
          <p className="text-muted-foreground mt-2">
            Generate and manage inventory analysis reports
          </p>
        </div>

        {/* Inventory Reports */}
        <InventoryReports />
      </div>
    </RoleGuard>
  )
}
