// src/app/(dashboard)/inventory/designs/approved/page.tsx
'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { CheckCircle, Package, TrendingUp, Calendar } from 'lucide-react'
import { RoleGuard } from '@/components/shared/role-guard'

export default function ApprovedDesignsPage() {
  return (
    <RoleGuard allowedRoles={['inventory_manager']}>
      <div className="space-y-6">
        {/* Page Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Approved Designs</h1>
            <p className="text-muted-foreground mt-2">
              Designs approved for production and available in inventory
            </p>
          </div>
          <Badge variant="default" className="bg-green-500">
            <CheckCircle className="w-4 h-4 mr-1" />
            28 Approved
          </Badge>
        </div>

        {/* Approved Designs Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-3">
                <CheckCircle className="w-8 h-8 text-green-600" />
                <div>
                  <div className="text-2xl font-bold text-green-600">28</div>
                  <div className="text-sm text-muted-foreground">Total Approved</div>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-3">
                <Package className="w-8 h-8 text-blue-600" />
                <div>
                  <div className="text-2xl font-bold text-blue-600">15</div>
                  <div className="text-sm text-muted-foreground">In Production</div>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-3">
                <TrendingUp className="w-8 h-8 text-purple-600" />
                <div>
                  <div className="text-2xl font-bold text-purple-600">8</div>
                  <div className="text-sm text-muted-foreground">Best Sellers</div>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-3">
                <Calendar className="w-8 h-8 text-orange-600" />
                <div>
                  <div className="text-2xl font-bold text-orange-600">3</div>
                  <div className="text-sm text-muted-foreground">This Week</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Approved Designs List */}
        <Card>
          <CardHeader>
            <CardTitle>Recently Approved Designs</CardTitle>
            <CardDescription>
              Designs that have been approved and are ready for production
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-center py-12">
              <CheckCircle className="w-12 h-12 text-green-500 mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">Approved Designs Dashboard</h3>
              <p className="text-muted-foreground mb-4">
                This section will show all approved designs with production status and performance metrics.
              </p>
              <Button>View All Approved Designs</Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </RoleGuard>
  )
}
