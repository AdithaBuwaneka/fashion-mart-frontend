// src/app/(dashboard)/inventory/designs/pending/page.tsx
'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Clock, CheckCircle, Eye } from 'lucide-react'
import { RoleGuard } from '@/components/shared/role-guard'
import { DesignApproval } from '@/components/inventory/design-approval'

export default function PendingDesignsPage() {
  return (
    <RoleGuard allowedRoles={['inventory']}>
      <div className="space-y-6">
        {/* Page Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Pending Designs</h1>
            <p className="text-muted-foreground mt-2">
              Designer submissions awaiting approval
            </p>
          </div>
          <Badge variant="default" className="bg-yellow-500">
            <Clock className="w-4 h-4 mr-1" />
            12 Pending
          </Badge>
        </div>

        {/* Filter for pending only */}
        <Card>
          <CardHeader>
            <CardTitle>Design Review Queue</CardTitle>
            <CardDescription>
              Review pending design submissions and provide feedback
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <div className="text-center p-4 bg-yellow-50 rounded-lg border">
                <Clock className="w-8 h-8 text-yellow-600 mx-auto mb-2" />
                <div className="text-2xl font-bold text-yellow-600">12</div>
                <div className="text-sm text-muted-foreground">Pending Review</div>
              </div>
              <div className="text-center p-4 bg-blue-50 rounded-lg border">
                <Eye className="w-8 h-8 text-blue-600 mx-auto mb-2" />
                <div className="text-2xl font-bold text-blue-600">3</div>
                <div className="text-sm text-muted-foreground">Under Review</div>
              </div>
              <div className="text-center p-4 bg-purple-50 rounded-lg border">
                <CheckCircle className="w-8 h-8 text-purple-600 mx-auto mb-2" />
                <div className="text-2xl font-bold text-purple-600">5</div>
                <div className="text-sm text-muted-foreground">High Priority</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Design Approval Component filtered for pending */}
        <DesignApproval />
      </div>
    </RoleGuard>
  )
}
