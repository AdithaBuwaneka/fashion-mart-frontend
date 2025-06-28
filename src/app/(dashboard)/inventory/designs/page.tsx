// src/app/(dashboard)/inventory/designs/page.tsx
'use client'

import { DesignApproval } from '@/components/inventory/design-approval'
import { RoleGuard } from '@/components/shared/role-guard'

export default function InventoryDesignsPage() {
  return (
    <RoleGuard allowedRoles={['inventory']}>
      <div className="space-y-6">
        {/* Page Header */}
        <div>
          <h1 className="text-3xl font-bold text-foreground">Design Approval</h1>
          <p className="text-muted-foreground mt-2">
            Review and approve designer submissions for production
          </p>
        </div>

        {/* Design Approval System */}
        <DesignApproval />
      </div>
    </RoleGuard>
  )
}
