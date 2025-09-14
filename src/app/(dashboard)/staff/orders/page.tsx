// src/app/(dashboard)/staff/orders/page.tsx
'use client'

import { useQuery } from '@tanstack/react-query'
import { staffApi } from '@/lib/api/staff'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { 
  Search,
  Filter,
  Clock,
  Package,
  Truck,
  Eye,
  CheckCircle,
  AlertTriangle,
  RefreshCw
} from 'lucide-react'
import { RoleGuard } from '@/components/shared/role-guard'
import { OrderQueue } from '@/components/staff/order-queue'
import Link from 'next/link'

export default function StaffOrdersPage() {
  // Fetch pending and assigned orders
  const { data: pendingOrdersData, isLoading: loadingPending } = useQuery({
    queryKey: ['staff-pending-orders'],
    queryFn: () => staffApi.getPendingOrders(1, 50)
  })

  const { data: assignedOrdersData, isLoading: loadingAssigned } = useQuery({
    queryKey: ['staff-assigned-orders'],
    queryFn: () => staffApi.getAssignedOrders(1, 50)
  })

  const pendingOrders = pendingOrdersData?.orders || []
  const assignedOrders = assignedOrdersData?.orders || []
  const allOrders = [...pendingOrders, ...assignedOrders]

  const orderStats = {
    pending: pendingOrders.length,
    processing: assignedOrders.filter(o => o.status === 'processing').length,
    shipped: assignedOrders.filter(o => o.status === 'shipped').length,
    urgent: allOrders.filter(o => o.priority === 'urgent').length || 0
  }

  const isLoading = loadingPending || loadingAssigned

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  const orders = allOrders.map(order => ({
    id: order.id,
    orderNumber: order.orderNumber || `ORD-${order.id}`,
    customer: {
      name: `${order.customer?.firstName || ''} ${order.customer?.lastName || ''}`.trim() || 'Unknown Customer',
      email: order.customer?.email || 'No email'
    },
    status: order.status,
    priority: (order as Order & { priority?: string }).priority || 'medium',
    total: order.totalAmount,
    items: order.items?.length || 0,
    createdAt: order.createdAt,
    estimatedDelivery: order.estimatedDelivery || 'TBD',
    shippingAddress: {
      street: order.shippingAddress?.street || '',
      city: order.shippingAddress?.city || 'Unknown',
      state: order.shippingAddress?.state || '',
      zipCode: order.shippingAddress?.zipCode || ''
    }
  }))


  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'destructive'
      case 'processing': return 'default'
      case 'shipped': return 'secondary'
      case 'delivered': return 'secondary'
      default: return 'outline'
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent': return 'destructive'
      case 'high': return 'default'
      case 'medium': return 'secondary'
      default: return 'outline'
    }
  }

  return (
    <RoleGuard allowedRoles={['staff']}>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Order Management</h1>
            <p className="text-muted-foreground mt-1">
              Process orders, update status, and manage shipping
            </p>
          </div>
          <div className="flex items-center space-x-2 mt-4 md:mt-0">
            <Button variant="outline" size="sm">
              <RefreshCw className="w-4 h-4 mr-2" />
              Refresh
            </Button>
            <Button size="sm">
              Bulk Actions
            </Button>
          </div>
        </div>

        {/* Order Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Pending Orders</p>
                  <p className="text-2xl font-bold text-orange-600">{orderStats.pending}</p>
                </div>
                <Clock className="w-8 h-8 text-orange-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Processing</p>
                  <p className="text-2xl font-bold text-blue-600">{orderStats.processing}</p>
                </div>
                <Package className="w-8 h-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Shipped</p>
                  <p className="text-2xl font-bold text-green-600">{orderStats.shipped}</p>
                </div>
                <Truck className="w-8 h-8 text-green-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Urgent</p>
                  <p className="text-2xl font-bold text-red-600">{orderStats.urgent}</p>
                </div>
                <AlertTriangle className="w-8 h-8 text-red-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters and Search */}
        <Card>
          <CardContent className="p-4">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                  <Input
                    placeholder="Search orders by number, customer, or email..."
                    className="pl-10"
                  />
                </div>
              </div>
              <Select>
                <SelectTrigger className="w-full md:w-[180px]">
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="processing">Processing</SelectItem>
                  <SelectItem value="shipped">Shipped</SelectItem>
                  <SelectItem value="delivered">Delivered</SelectItem>
                </SelectContent>
              </Select>
              <Select>
                <SelectTrigger className="w-full md:w-[180px]">
                  <SelectValue placeholder="Filter by priority" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Priority</SelectItem>
                  <SelectItem value="urgent">Urgent</SelectItem>
                  <SelectItem value="high">High</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="low">Low</SelectItem>
                </SelectContent>
              </Select>
              <Button variant="outline">
                <Filter className="w-4 h-4 mr-2" />
                More Filters
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Order Queue */}
        <Tabs defaultValue="all" className="space-y-4">
          <TabsList>
            <TabsTrigger value="all">All Orders ({orders.length})</TabsTrigger>
            <TabsTrigger value="pending">Pending ({orderStats.pending})</TabsTrigger>
            <TabsTrigger value="processing">Processing ({orderStats.processing})</TabsTrigger>
            <TabsTrigger value="urgent">Urgent ({orderStats.urgent})</TabsTrigger>
          </TabsList>

          <TabsContent value="all" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Order Queue</CardTitle>
                <CardDescription>
                  All orders requiring your attention
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {orders.map((order) => (
                    <div key={order.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50">
                      <div className="flex items-start space-x-4 flex-1">
                        <div className="flex-1">
                          <div className="flex items-center space-x-2 mb-2">
                            <h4 className="font-semibold">{order.orderNumber}</h4>
                            <Badge variant={getStatusColor(order.status)}>
                              {order.status}
                            </Badge>
                            <Badge variant={getPriorityColor(order.priority)}>
                              {order.priority}
                            </Badge>
                          </div>
                          <p className="text-sm text-muted-foreground mb-1">
                            <span className="font-medium">{order.customer.name}</span> • {order.customer.email}
                          </p>
                          <p className="text-sm text-muted-foreground mb-1">
                            {order.items} items • ${order.total} • Due: {order.estimatedDelivery}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            {order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.zipCode}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Link href={`/staff/orders/${order.id}`}>
                          <Button variant="outline" size="sm">
                            <Eye className="w-4 h-4 mr-2" />
                            View Details
                          </Button>
                        </Link>
                        <Button size="sm">
                          <CheckCircle className="w-4 h-4 mr-2" />
                          Process
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="pending">
            <OrderQueue 
              orders={orders.filter(order => order.status === 'pending')} 
              title="Pending Orders"
              description="Orders waiting to be processed"
            />
          </TabsContent>

          <TabsContent value="processing">
            <OrderQueue 
              orders={orders.filter(order => order.status === 'processing')} 
              title="Processing Orders"
              description="Orders currently being processed"
            />
          </TabsContent>

          <TabsContent value="urgent">
            <OrderQueue 
              orders={orders.filter(order => order.priority === 'urgent')} 
              title="Urgent Orders"
              description="Orders requiring immediate attention"
            />
          </TabsContent>
        </Tabs>
      </div>
    </RoleGuard>
  )
}
