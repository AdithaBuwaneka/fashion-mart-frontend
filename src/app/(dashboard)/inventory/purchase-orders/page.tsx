// src/app/(dashboard)/inventory/purchase-orders/page.tsx
'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { 
  ShoppingCart, 
  Plus, 
  Eye, 
  Package, 
  Clock, 
  CheckCircle, 
  Truck,
  FileText,
  Download
} from 'lucide-react'
import { RoleGuard } from '@/components/shared/role-guard'
import Link from 'next/link'

// Mock purchase order data
const purchaseOrders = [
  {
    id: 'PO-001',
    supplier: 'Fashion Forward Co.',
    orderDate: '2024-06-25',
    expectedDelivery: '2024-07-05',
    totalAmount: 15234.50,
    items: 8,
    status: 'pending',
    priority: 'high'
  },
  {
    id: 'PO-002',
    supplier: 'Cotton Basics Ltd.',
    orderDate: '2024-06-20',
    expectedDelivery: '2024-06-30',
    totalAmount: 8750.00,
    items: 12,
    status: 'approved',
    priority: 'medium'
  },
  {
    id: 'PO-003',
    supplier: 'Premium Leather Co.',
    orderDate: '2024-06-18',
    expectedDelivery: '2024-06-28',
    totalAmount: 25680.75,
    items: 5,
    status: 'shipped',
    priority: 'high'
  },
  {
    id: 'PO-004',
    supplier: 'Silk Elegance',
    orderDate: '2024-06-15',
    expectedDelivery: '2024-06-25',
    totalAmount: 4250.00,
    items: 15,
    status: 'delivered',
    priority: 'low'
  }
]

export default function PurchaseOrdersPage() {
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return <Badge variant="default" className="bg-yellow-500">Pending</Badge>
      case 'approved':
        return <Badge variant="default" className="bg-blue-500">Approved</Badge>
      case 'shipped':
        return <Badge variant="default" className="bg-purple-500">Shipped</Badge>
      case 'delivered':
        return <Badge variant="default" className="bg-green-500">Delivered</Badge>
      default:
        return <Badge variant="secondary">{status}</Badge>
    }
  }

  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case 'high':
        return <Badge variant="destructive">High</Badge>
      case 'medium':
        return <Badge variant="default">Medium</Badge>
      case 'low':
        return <Badge variant="secondary">Low</Badge>
      default:
        return <Badge variant="secondary">{priority}</Badge>
    }
  }

  const pendingCount = purchaseOrders.filter(po => po.status === 'pending').length
  const totalValue = purchaseOrders.reduce((sum, po) => sum + po.totalAmount, 0)

  return (
    <RoleGuard allowedRoles={['inventory_manager']}>
      <div className="space-y-6">
        {/* Page Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Purchase Orders</h1>
            <p className="text-muted-foreground mt-2">
              Manage supplier orders and track deliveries
            </p>
          </div>
          <Button>
            <Plus className="w-4 h-4 mr-2" />
            Create Purchase Order
          </Button>
        </div>

        {/* Purchase Order Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-3">
                <Clock className="w-8 h-8 text-yellow-600" />
                <div>
                  <div className="text-2xl font-bold text-yellow-600">{pendingCount}</div>
                  <div className="text-sm text-muted-foreground">Pending Orders</div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-3">
                <Truck className="w-8 h-8 text-purple-600" />
                <div>
                  <div className="text-2xl font-bold text-purple-600">
                    {purchaseOrders.filter(po => po.status === 'shipped').length}
                  </div>
                  <div className="text-sm text-muted-foreground">In Transit</div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-3">
                <CheckCircle className="w-8 h-8 text-green-600" />
                <div>
                  <div className="text-2xl font-bold text-green-600">
                    {purchaseOrders.filter(po => po.status === 'delivered').length}
                  </div>
                  <div className="text-sm text-muted-foreground">Delivered</div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-3">
                <ShoppingCart className="w-8 h-8 text-blue-600" />
                <div>
                  <div className="text-2xl font-bold text-blue-600">${totalValue.toLocaleString()}</div>
                  <div className="text-sm text-muted-foreground">Total Value</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Purchase Orders Table */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="w-5 h-5" />
              Purchase Orders
            </CardTitle>
            <CardDescription>
              Track and manage all purchase orders
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>PO Number</TableHead>
                    <TableHead>Supplier</TableHead>
                    <TableHead>Order Date</TableHead>
                    <TableHead>Expected Delivery</TableHead>
                    <TableHead>Items</TableHead>
                    <TableHead>Total Amount</TableHead>
                    <TableHead>Priority</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {purchaseOrders.map((order) => (
                    <TableRow key={order.id}>
                      <TableCell className="font-mono">{order.id}</TableCell>
                      <TableCell className="font-medium">{order.supplier}</TableCell>
                      <TableCell>{order.orderDate}</TableCell>
                      <TableCell>{order.expectedDelivery}</TableCell>
                      <TableCell>{order.items} items</TableCell>
                      <TableCell>${order.totalAmount.toLocaleString()}</TableCell>
                      <TableCell>{getPriorityBadge(order.priority)}</TableCell>
                      <TableCell>{getStatusBadge(order.status)}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex gap-2 justify-end">
                          <Button variant="outline" size="sm" asChild>
                            <Link href={`/inventory/purchase-orders/${order.id}`}>
                              <Eye className="w-4 h-4 mr-1" />
                              View
                            </Link>
                          </Button>
                          <Button variant="outline" size="sm">
                            <Download className="w-4 h-4 mr-1" />
                            PDF
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>
              Common purchase order operations
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Button variant="outline" className="h-20 flex-col gap-2">
                <Plus className="w-6 h-6" />
                Create New PO
              </Button>
              <Button variant="outline" className="h-20 flex-col gap-2">
                <Package className="w-6 h-6" />
                Receive Shipment
              </Button>
              <Button variant="outline" className="h-20 flex-col gap-2">
                <Download className="w-6 h-6" />
                Export Orders
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </RoleGuard>
  )
}
