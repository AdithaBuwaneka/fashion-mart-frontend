// src/app/(dashboard)/inventory/designs/rejected/page.tsx
'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { XCircle, MessageSquare, RotateCcw, Archive } from 'lucide-react'
import { RoleGuard } from '@/components/shared/role-guard'

export default function RejectedDesignsPage() {
  return (
    <RoleGuard allowedRoles={['inventory_manager']}>
      <div className="space-y-6">
        {/* Page Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Rejected Designs</h1>
            <p className="text-muted-foreground mt-2">
              Designs that have been rejected with feedback for designers
            </p>
          </div>
          <Badge variant="destructive">
            <XCircle className="w-4 h-4 mr-1" />
            7 Rejected
          </Badge>
        </div>

        {/* Rejected Designs Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-3">
                <XCircle className="w-8 h-8 text-red-600" />
                <div>
                  <div className="text-2xl font-bold text-red-600">7</div>
                  <div className="text-sm text-muted-foreground">Total Rejected</div>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-3">
                <MessageSquare className="w-8 h-8 text-blue-600" />
                <div>
                  <div className="text-2xl font-bold text-blue-600">5</div>
                  <div className="text-sm text-muted-foreground">With Feedback</div>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-3">
                <RotateCcw className="w-8 h-8 text-purple-600" />
                <div>
                  <div className="text-2xl font-bold text-purple-600">2</div>
                  <div className="text-sm text-muted-foreground">Resubmitted</div>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-3">
                <Archive className="w-8 h-8 text-gray-600" />
                <div>
                  <div className="text-2xl font-bold text-gray-600">3</div>
                  <div className="text-sm text-muted-foreground">Archived</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Rejected Designs List */}
        <Card>
          <CardHeader>
            <CardTitle>Recently Rejected Designs</CardTitle>
            <CardDescription>
              Designs that have been rejected with detailed feedback
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-center py-12">
              <XCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">Rejected Designs Archive</h3>
              <p className="text-muted-foreground mb-4">
                This section will show all rejected designs with rejection reasons and designer feedback.
              </p>
              <Button variant="outline">View Rejection Archive</Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </RoleGuard>
  )
}
