// src/app/(dashboard)/customer/dashboard/page.tsx
'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { 
  ShoppingBag, 
  Package, 
  Heart,
  Star,
  ArrowRight,
  Clock
} from 'lucide-react'
import { RoleGuard } from '@/components/shared/role-guard'
import Link from 'next/link'

export default function CustomerDashboard() {
  // Mock data
  const userStats = {
    totalOrders: 12,
    pendingOrders: 2,
    favoriteItems: 8,
    rewardPoints: 1250
  }

  const recentOrders = [
    {
      id: 'ORD-001',
      date: '2024-06-25',
      status: 'delivered',
      total: 89.99,
      items: 2
    },
    {
      id: 'ORD-002', 
      date: '2024-06-20',
      status: 'shipped',
      total: 156.50,
      items: 3
    }
  ]

  return (
    <RoleGuard allowedRoles={['customer']}>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">My Dashboard</h1>
            <p className="text-muted-foreground mt-1">
              Welcome back! Discover new arrivals and track your orders.
            </p>
          </div>
          <div className="flex items-center space-x-2 mt-4 md:mt-0">
            <Button variant="outline" size="sm" asChild>
              <Link href="/customer/products">
                <ShoppingBag className="h-4 w-4 mr-2" />
                Browse Products
              </Link>
            </Button>
            <Button size="sm" asChild>
              <Link href="/customer/cart">
                <Package className="h-4 w-4 mr-2" />
                View Cart
              </Link>
            </Button>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="card-hover">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Total Orders</p>
                  <p className="text-2xl font-bold">{userStats.totalOrders}</p>
                </div>
                <ShoppingBag className="h-8 w-8 text-primary" />
              </div>
            </CardContent>
          </Card>

          <Card className="card-hover">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Pending Orders</p>
                  <p className="text-2xl font-bold">{userStats.pendingOrders}</p>
                </div>
                <Clock className="h-8 w-8 text-yellow-500" />
              </div>
            </CardContent>
          </Card>

          <Card className="card-hover">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Wishlist</p>
                  <p className="text-2xl font-bold">{userStats.favoriteItems}</p>
                </div>
                <Heart className="h-8 w-8 text-red-500" />
              </div>
            </CardContent>
          </Card>

          <Card className="card-hover">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Reward Points</p>
                  <p className="text-2xl font-bold">{userStats.rewardPoints}</p>
                </div>
                <Star className="h-8 w-8 text-yellow-500" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Recent Orders */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Recent Orders</CardTitle>
                <CardDescription>Your latest purchase history</CardDescription>
              </div>
              <Button variant="outline" size="sm" asChild>
                <Link href="/customer/orders">
                  View All <ArrowRight className="h-4 w-4 ml-1" />
                </Link>
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentOrders.map((order) => (
                <div key={order.id} className="flex items-center justify-between p-4 border border-border rounded-lg">
                  <div className="flex items-center space-x-4">
                    <div className="p-2 bg-primary/10 rounded-full">
                      <Package className="h-4 w-4 text-primary" />
                    </div>
                    <div>
                      <p className="font-medium">{order.id}</p>
                      <p className="text-sm text-muted-foreground">{order.date}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4">
                    <div className="text-right">
                      <p className="font-medium">${order.total}</p>
                      <p className="text-sm text-muted-foreground">{order.items} items</p>
                    </div>
                    <Badge 
                      variant={order.status === 'delivered' ? 'success' : 'secondary'}
                      className="capitalize"
                    >
                      {order.status}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </RoleGuard>
  )
}