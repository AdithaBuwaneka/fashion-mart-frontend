// src/app/(dashboard)/staff/orders/[orderId]/page.tsx
'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { 
  ArrowLeft,
  Package,
  Truck,
  MapPin,
  User,
  CreditCard,
  CheckCircle,
  Clock,
  Edit
} from 'lucide-react'
import { RoleGuard } from '@/components/shared/role-guard'
import Link from 'next/link'

interface OrderDetailsPageProps {
  params: {
    orderId: string
  }
}

export default function OrderDetailsPage({ params }: OrderDetailsPageProps) {
  // Mock data - would come from API based on params.orderId
  const order = {
    id: params.orderId,
    orderNumber: 'ORD-2024-001',
    customer: {
      id: 'cust-1',
      name: 'Alice Johnson',
      email: 'alice@example.com',
      phone: '+1 (555) 123-4567'
    },
    status: 'pending',
    priority: 'high',
    total: 156.50,
    subtotal: 139.50,
    tax: 11.16,
    shipping: 5.84,
    items: [
      {
        id: 'item-1',
        product: {
          id: 'prod-1',
          name: 'Summer Floral Dress',
          image: '/images/products/dress-1.jpg'
        },
        quantity: 1,
        price: 89.99,
        size: 'M',
        color: 'Blue'
      },
      {
        id: 'item-2',
        product: {
          id: 'prod-2',
          name: 'Casual Cotton T-Shirt',
          image: '/images/products/tshirt-1.jpg'
        },
        quantity: 2,
        price: 24.75,
        size: 'L',
        color: 'White'
      }
    ],
    createdAt: '2024-06-28T10:30:00Z',
    estimatedDelivery: '2024-07-02',
    shippingAddress: {
      name: 'Alice Johnson',
      street: '123 Main St',
      city: 'New York',
      state: 'NY',
      zipCode: '10001',
      country: 'United States'
    },
    billingAddress: {
      name: 'Alice Johnson',
      street: '123 Main St',
      city: 'New York',
      state: 'NY',
      zipCode: '10001',
      country: 'United States'
    },
    payment: {
      method: 'Credit Card',
      last4: '4242',
      status: 'completed'
    },
    trackingNumber: null,
    notes: 'Customer requested expedited processing'
  }

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
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Link href="/staff/orders">
              <Button variant="outline" size="sm">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Orders
              </Button>
            </Link>
            <div>
              <h1 className="text-3xl font-bold text-foreground">Order Details</h1>
              <p className="text-muted-foreground mt-1">
                Order {order.orderNumber} • {new Date(order.createdAt).toLocaleDateString()}
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Badge variant={getStatusColor(order.status)} className="text-sm">
              {order.status.toUpperCase()}
            </Badge>
            <Badge variant={getPriorityColor(order.priority)} className="text-sm">
              {order.priority.toUpperCase()} PRIORITY
            </Badge>
          </div>
        </div>

        {/* Order Actions */}
        <Card>
          <CardContent className="p-4">
            <div className="flex flex-wrap gap-2">
              {order.status === 'pending' && (
                <>
                  <Button>
                    <CheckCircle className="w-4 h-4 mr-2" />
                    Mark as Processing
                  </Button>
                  <Button variant="outline">
                    <Edit className="w-4 h-4 mr-2" />
                    Edit Order
                  </Button>
                </>
              )}
              {order.status === 'processing' && (
                <>
                  <Button>
                    <Truck className="w-4 h-4 mr-2" />
                    Mark as Shipped
                  </Button>
                  <Button variant="outline">
                    <Package className="w-4 h-4 mr-2" />
                    Generate Label
                  </Button>
                </>
              )}
              <Button variant="outline">
                <User className="w-4 h-4 mr-2" />
                Contact Customer
              </Button>
              <Button variant="outline">Print Invoice</Button>
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Order Items */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>Order Items</CardTitle>
                <CardDescription>
                  {order.items.length} items in this order
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {order.items.map((item) => (
                    <div key={item.id} className="flex items-center space-x-4 p-4 border rounded-lg">
                      <div className="w-16 h-16 bg-muted rounded-lg flex items-center justify-center">
                        <Package className="w-8 h-8 text-muted-foreground" />
                      </div>
                      <div className="flex-1">
                        <h4 className="font-medium">{item.product.name}</h4>
                        <p className="text-sm text-muted-foreground">
                          Size: {item.size} • Color: {item.color}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          Quantity: {item.quantity} × ${item.price}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold">${(item.quantity * item.price).toFixed(2)}</p>
                      </div>
                    </div>
                  ))}
                </div>
                
                <Separator className="my-4" />
                
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Subtotal:</span>
                    <span>${order.subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Tax:</span>
                    <span>${order.tax.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Shipping:</span>
                    <span>${order.shipping.toFixed(2)}</span>
                  </div>
                  <Separator className="my-2" />
                  <div className="flex justify-between font-semibold">
                    <span>Total:</span>
                    <span>${order.total.toFixed(2)}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Order Information */}
          <div className="space-y-6">
            {/* Customer Information */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <User className="w-5 h-5 mr-2" />
                  Customer Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <p className="font-medium">{order.customer.name}</p>
                  <p className="text-sm text-muted-foreground">{order.customer.email}</p>
                  <p className="text-sm text-muted-foreground">{order.customer.phone}</p>
                </div>
                <Button variant="outline" size="sm" className="w-full">
                  View Customer Profile
                </Button>
              </CardContent>
            </Card>

            {/* Shipping Address */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <MapPin className="w-5 h-5 mr-2" />
                  Shipping Address
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-sm space-y-1">
                  <p className="font-medium">{order.shippingAddress.name}</p>
                  <p>{order.shippingAddress.street}</p>
                  <p>{order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.zipCode}</p>
                  <p>{order.shippingAddress.country}</p>
                </div>
              </CardContent>
            </Card>

            {/* Payment Information */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <CreditCard className="w-5 h-5 mr-2" />
                  Payment Information
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Method:</span>
                    <span>{order.payment.method}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Card ending in:</span>
                    <span>****{order.payment.last4}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Status:</span>
                    <Badge variant="secondary">{order.payment.status}</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Order Timeline */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Clock className="w-5 h-5 mr-2" />
                  Order Timeline
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <div>
                      <p className="text-sm font-medium">Order Placed</p>
                      <p className="text-xs text-muted-foreground">
                        {new Date(order.createdAt).toLocaleString()}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                    <div>
                      <p className="text-sm font-medium">Awaiting Processing</p>
                      <p className="text-xs text-muted-foreground">Current status</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-gray-300 rounded-full"></div>
                    <div>
                      <p className="text-sm text-muted-foreground">Expected Delivery</p>
                      <p className="text-xs text-muted-foreground">{order.estimatedDelivery}</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Order Notes */}
            {order.notes && (
              <Card>
                <CardHeader>
                  <CardTitle>Order Notes</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm">{order.notes}</p>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </RoleGuard>
  )
}
