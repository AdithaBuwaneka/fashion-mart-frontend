// src/components/staff/order-queue.tsx
'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { 
  Eye,
  CheckCircle,
  Clock,
  Package,
  ArrowRight
} from 'lucide-react'
import Link from 'next/link'

interface Order {
  id: string
  orderNumber: string
  customer: {
    name: string
    email: string
  }
  status: string
  priority: string
  total: number
  items: number
  createdAt: string
  estimatedDelivery: string
  shippingAddress: {
    street: string
    city: string
    state: string
    zipCode: string
  }
}

interface OrderQueueProps {
  orders: Order[]
  title: string
  description: string
}

export function OrderQueue({ orders, title, description }: OrderQueueProps) {
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

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending': return Clock
      case 'processing': return Package
      case 'shipped': return CheckCircle
      default: return Package
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          {title}
          <Badge variant="outline">{orders.length} orders</Badge>
        </CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>
        {orders.length === 0 ? (
          <div className="text-center py-8">
            <Package className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-medium text-muted-foreground mb-2">No orders found</h3>
            <p className="text-sm text-muted-foreground">
              There are no orders in this category at the moment.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {orders.map((order) => {
              const StatusIcon = getStatusIcon(order.status)
              return (
                <div key={order.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors">
                  <div className="flex items-start space-x-4 flex-1">
                    <div className="mt-1">
                      <StatusIcon className="w-5 h-5 text-muted-foreground" />
                    </div>
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
                        {order.items} items • ${order.total.toFixed(2)} • Due: {order.estimatedDelivery}
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
                        View
                      </Button>
                    </Link>
                    {order.status === 'pending' && (
                      <Button size="sm">
                        <CheckCircle className="w-4 h-4 mr-2" />
                        Process
                      </Button>
                    )}
                    {order.status === 'processing' && (
                      <Button size="sm">
                        <ArrowRight className="w-4 h-4 mr-2" />
                        Ship
                      </Button>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
