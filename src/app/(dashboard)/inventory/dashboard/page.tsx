// src/app/(dashboard)/inventory/dashboard/page.tsx
'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { 
  Package, 
  AlertTriangle, 
  CheckCircle, 
  TrendingUp, 
  Eye, 
  Plus,
  RefreshCw,
  Download,
  Scan
} from 'lucide-react'
import { RoleGuard } from '@/components/shared/role-guard'
import { StockTable } from '@/components/inventory/stock-table'
import { DesignApproval } from '@/components/inventory/design-approval'
import { InventoryReports } from '@/components/inventory/inventory-reports'
import Link from 'next/link'

// Mock data for inventory dashboard
const inventoryStats = {
  totalProducts: 1247,
  lowStockItems: 23,
  outOfStockItems: 8,
  pendingDesigns: 12,
  totalValue: 145230,
  monthlyTurnover: 15.7
}

const recentActivity = [
  { id: 1, action: 'Stock Updated', product: 'Summer Dress Collection', time: '2 minutes ago', type: 'stock' },
  { id: 2, action: 'Design Approved', product: 'Autumn Jacket Design', time: '15 minutes ago', type: 'approval' },
  { id: 3, action: 'Low Stock Alert', product: 'Casual T-Shirts', time: '1 hour ago', type: 'alert' },
  { id: 4, action: 'Design Rejected', product: 'Winter Coat Design', time: '2 hours ago', type: 'rejection' },
  { id: 5, action: 'Reorder Placed', product: 'Denim Jeans', time: '3 hours ago', type: 'reorder' }
]

const criticalAlerts = [
  { product: 'Premium Silk Scarves', currentStock: 2, minStock: 10, status: 'critical' },
  { product: 'Designer Handbags', currentStock: 5, minStock: 15, status: 'warning' },
  { product: 'Leather Jackets', currentStock: 0, minStock: 8, status: 'out-of-stock' }
]

export default function InventoryDashboardPage() {
  return (
    <RoleGuard allowedRoles={['inventory_manager']}>
      <div className="space-y-6">
        {/* Page Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Inventory Management</h1>
            <p className="text-muted-foreground mt-2">
              Monitor stock levels, approve designs, and manage inventory operations
            </p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm">
              <RefreshCw className="w-4 h-4 mr-2" />
              Refresh Data
            </Button>
            <Button asChild>
              <Link href="/inventory/stock">
                <Plus className="w-4 h-4 mr-2" />
                Add Stock
              </Link>
            </Button>
          </div>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Products</CardTitle>
              <Package className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{inventoryStats.totalProducts.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground">
                <span className="text-green-600">+12</span> from last week
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Low Stock Items</CardTitle>
              <AlertTriangle className="h-4 w-4 text-orange-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-orange-600">{inventoryStats.lowStockItems}</div>
              <p className="text-xs text-muted-foreground">
                Requires attention
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Pending Designs</CardTitle>
              <CheckCircle className="h-4 w-4 text-blue-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600">{inventoryStats.pendingDesigns}</div>
              <p className="text-xs text-muted-foreground">
                Awaiting approval
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Inventory Value</CardTitle>
              <TrendingUp className="h-4 w-4 text-green-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">${inventoryStats.totalValue.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground">
                <span className="text-green-600">+5.2%</span> from last month
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Critical Alerts */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-orange-500" />
              Critical Stock Alerts
            </CardTitle>
            <CardDescription>
              Items requiring immediate attention
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {criticalAlerts.map((alert, index) => (
                <div key={index} className="flex items-center justify-between p-4 rounded-lg border">
                  <div className="flex items-center gap-3">
                    <div className={`w-3 h-3 rounded-full ${
                      alert.status === 'critical' ? 'bg-red-500' :
                      alert.status === 'warning' ? 'bg-orange-500' :
                      'bg-gray-500'
                    }`} />
                    <div>
                      <p className="font-medium">{alert.product}</p>
                      <p className="text-sm text-muted-foreground">
                        Current: {alert.currentStock} | Min: {alert.minStock}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant={
                      alert.status === 'critical' ? 'destructive' :
                      alert.status === 'warning' ? 'default' :
                      'secondary'
                    }>
                      {alert.status === 'out-of-stock' ? 'Out of Stock' : 
                       alert.status === 'critical' ? 'Critical' : 'Warning'}
                    </Badge>
                    <Button size="sm" variant="outline">
                      <Eye className="w-4 h-4 mr-1" />
                      View
                    </Button>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-4 pt-4 border-t">
              <Button asChild variant="outline" className="w-full">
                <Link href="/inventory/alerts">
                  View All Alerts ({inventoryStats.lowStockItems + inventoryStats.outOfStockItems})
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Main Dashboard Content */}
        <Tabs defaultValue="overview" className="space-y-4">
          <TabsList>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="stock">Stock Status</TabsTrigger>
            <TabsTrigger value="designs">Design Approval</TabsTrigger>
            <TabsTrigger value="reports">Reports</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Recent Activity */}
              <Card>
                <CardHeader>
                  <CardTitle>Recent Activity</CardTitle>
                  <CardDescription>Latest inventory operations</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {recentActivity.map((activity) => (
                      <div key={activity.id} className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className={`w-2 h-2 rounded-full ${
                            activity.type === 'stock' ? 'bg-blue-500' :
                            activity.type === 'approval' ? 'bg-green-500' :
                            activity.type === 'alert' ? 'bg-orange-500' :
                            activity.type === 'rejection' ? 'bg-red-500' :
                            'bg-purple-500'
                          }`} />
                          <div>
                            <p className="text-sm font-medium">{activity.action}</p>
                            <p className="text-xs text-muted-foreground">{activity.product}</p>
                          </div>
                        </div>
                        <span className="text-xs text-muted-foreground">{activity.time}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Quick Actions */}
              <Card>
                <CardHeader>
                  <CardTitle>Quick Actions</CardTitle>
                  <CardDescription>Common inventory tasks</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Button asChild className="w-full justify-start">
                    <Link href="/inventory/designs/pending">
                      <CheckCircle className="w-4 h-4 mr-3" />
                      Review Pending Designs ({inventoryStats.pendingDesigns})
                    </Link>
                  </Button>
                  <Button asChild variant="outline" className="w-full justify-start">
                    <Link href="/inventory/stock">
                      <Package className="w-4 h-4 mr-3" />
                      Manage Stock Levels
                    </Link>
                  </Button>
                  <Button asChild variant="outline" className="w-full justify-start">
                    <Link href="/inventory/reports">
                      <Download className="w-4 h-4 mr-3" />
                      Generate Reports
                    </Link>
                  </Button>
                  <Button asChild variant="outline" className="w-full justify-start">
                    <Link href="/inventory/purchase-orders">
                      <Scan className="w-4 h-4 mr-3" />
                      Purchase Orders
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            </div>

            {/* Performance Metrics */}
            <Card>
              <CardHeader>
                <CardTitle>Inventory Performance</CardTitle>
                <CardDescription>Key performance indicators</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Inventory Turnover Rate</span>
                    <span className="text-sm text-muted-foreground">{inventoryStats.monthlyTurnover}x/month</span>
                  </div>
                  <Progress value={inventoryStats.monthlyTurnover * 5} className="h-2" />
                  
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Stock Accuracy</span>
                    <span className="text-sm text-muted-foreground">97.8%</span>
                  </div>
                  <Progress value={97.8} className="h-2" />
                  
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Order Fulfillment Rate</span>
                    <span className="text-sm text-muted-foreground">94.2%</span>
                  </div>
                  <Progress value={94.2} className="h-2" />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="stock" className="space-y-4">
            <StockTable />
          </TabsContent>

          <TabsContent value="designs" className="space-y-4">
            <DesignApproval />
          </TabsContent>

          <TabsContent value="reports" className="space-y-4">
            <InventoryReports />
          </TabsContent>
        </Tabs>
      </div>
    </RoleGuard>
  )
}
