// src/app/(dashboard)/customer/dashboard/page.tsx
'use client'

import { useQuery } from '@tanstack/react-query'
import { ordersApi } from '@/lib/api/orders'
import { usersApi } from '@/lib/api/users'
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
import { LoadingScreen } from '@/components/shared/loading-screen'
import Link from 'next/link'

export default function CustomerDashboard() {
  // Fetch user stats from API
  const { data: userProfile, isLoading: profileLoading } = useQuery({
    queryKey: ['customer-profile'],
    queryFn: () => usersApi.getProfile()
  });

  // Fetch recent orders from API
  const { data: ordersData, isLoading: ordersLoading } = useQuery({
    queryKey: ['customer-orders-recent'],
    queryFn: () => ordersApi.getOrders(1, 3) // Get first 3 orders for dashboard
  });

  const isLoading = profileLoading || ordersLoading;

  if (isLoading) {
    return <LoadingScreen />;
  }

  const recentOrders = ordersData?.orders || [];
  const userStats = {
    totalOrders: ordersData?.total || 0,
    pendingOrders: recentOrders.filter(order => ['pending', 'confirmed', 'processing', 'shipped'].includes(order.status)).length,
    favoriteItems: userProfile?.wishlistCount || 0,
    rewardPoints: userProfile?.loyaltyPoints || 0
  }

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
              {recentOrders.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <Package className="h-12 w-12 mx-auto mb-4 text-muted-foreground/50" />
                  <p>No orders yet. Start shopping to see your orders here!</p>
                  <Button className="mt-4" asChild>
                    <Link href="/customer/products">Browse Products</Link>
                  </Button>
                </div>
              ) : (
                recentOrders.map((order) => (
                  <div key={order.id} className="flex items-center justify-between p-4 border border-border rounded-lg">
                    <div className="flex items-center space-x-4">
                      <div className="p-2 bg-primary/10 rounded-full">
                        <Package className="h-4 w-4 text-primary" />
                      </div>
                      <div>
                        <p className="font-medium">{order.orderNumber}</p>
                        <p className="text-sm text-muted-foreground">
                          {new Date(order.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-4">
                      <div className="text-right">
                        <p className="font-medium">${order.totalAmount.toFixed(2)}</p>
                        <p className="text-sm text-muted-foreground">{order.items.length} items</p>
                      </div>
                      <Badge
                        variant={order.status === 'delivered' ? 'success' : 'secondary'}
                        className="capitalize"
                      >
                        {order.status}
                      </Badge>
                    </div>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </RoleGuard>
  )
}