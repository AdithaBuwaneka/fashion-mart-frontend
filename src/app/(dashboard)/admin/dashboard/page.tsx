// src/app/(dashboard)/admin/dashboard/page.tsx
'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { 
  Users, 
  ShoppingBag, 
  TrendingUp, 
  AlertTriangle, 
  DollarSign,
  Package,
  UserCheck,
  FileText,
  Palette
} from 'lucide-react'
import { RoleGuard } from '@/components/shared/role-guard'
import { UserRoleManager } from '@/components/admin/user-role-manager'

export default function AdminDashboard() {
  // Mock data - in real app, this would come from your API
  const stats = {
    totalUsers: 1234,
    totalOrders: 456,
    totalRevenue: 78900,
    pendingDesigns: 12,
    lowStockItems: 8,
    activeDesigners: 23,
    monthlyGrowth: 12.5
  }

  return (
    <RoleGuard allowedRoles={['admin']}>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Admin Dashboard</h1>
            <p className="text-muted-foreground mt-1">
              Welcome back! Here&apos;s what&apos;s happening at Fashion Mart.
            </p>
          </div>
          <div className="flex items-center space-x-2 mt-4 md:mt-0">
            <Button variant="outline" size="sm">
              <FileText className="h-4 w-4 mr-2" />
              Generate Report
            </Button>
            <Button size="sm">
              <TrendingUp className="h-4 w-4 mr-2" />
              View Analytics
            </Button>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatsCard
            title="Total Users"
            value={stats.totalUsers.toLocaleString()}
            description="Active users on platform"
            icon={<Users className="h-4 w-4" />}
            trend="+12%"
            trendUp={true}
          />
          <StatsCard
            title="Orders"
            value={stats.totalOrders.toLocaleString()}
            description="This month"
            icon={<ShoppingBag className="h-4 w-4" />}
            trend="+8%"
            trendUp={true}
          />
          <StatsCard
            title="Revenue"
            value={`$${stats.totalRevenue.toLocaleString()}`}
            description="Monthly revenue"
            icon={<DollarSign className="h-4 w-4" />}
            trend="+15%"
            trendUp={true}
          />
          <StatsCard
            title="Low Stock"
            value={stats.lowStockItems.toString()}
            description="Items need restocking"
            icon={<AlertTriangle className="h-4 w-4" />}
            trend="-2"
            trendUp={false}
            variant="warning"
          />
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Package className="h-5 w-5 mr-2" />
                Pending Actions
              </CardTitle>
              <CardDescription>
                Items requiring your attention
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
                <div className="flex items-center space-x-3">
                  <Palette className="h-4 w-4 text-blue-500" />
                  <span className="text-sm font-medium">Designs for Approval</span>
                </div>
                <Badge variant="secondary">{stats.pendingDesigns}</Badge>
              </div>
              <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
                <div className="flex items-center space-x-3">
                  <AlertTriangle className="h-4 w-4 text-yellow-500" />
                  <span className="text-sm font-medium">Low Stock Alerts</span>
                </div>
                <Badge variant="warning">{stats.lowStockItems}</Badge>
              </div>
              <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
                <div className="flex items-center space-x-3">
                  <UserCheck className="h-4 w-4 text-green-500" />
                  <span className="text-sm font-medium">User Approvals</span>
                </div>
                <Badge variant="secondary">3</Badge>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <TrendingUp className="h-5 w-5 mr-2" />
                Quick Stats
              </CardTitle>
              <CardDescription>
                Platform overview
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Active Designers</span>
                <span className="font-semibold">{stats.activeDesigners}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Monthly Growth</span>
                <span className="font-semibold text-green-600">+{stats.monthlyGrowth}%</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Platform Health</span>
                <Badge variant="success">Excellent</Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Server Status</span>
                <Badge variant="success">Online</Badge>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* User Role Management Section */}
        <UserRoleManager />
      </div>
    </RoleGuard>
  )
}

interface StatsCardProps {
  title: string
  value: string
  description: string
  icon: React.ReactNode
  trend?: string
  trendUp?: boolean
  variant?: 'default' | 'warning' | 'success'
}

function StatsCard({ 
  title, 
  value, 
  description, 
  icon, 
  trend, 
  trendUp, 
  variant = 'default' 
}: StatsCardProps) {
  return (
    <Card className="card-hover">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">
          {title}
        </CardTitle>
        <div className={`p-2 rounded-full ${
          variant === 'warning' ? 'bg-yellow-100 text-yellow-600' :
          variant === 'success' ? 'bg-green-100 text-green-600' :
          'bg-primary/10 text-primary'
        }`}>
          {icon}
        </div>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold text-foreground">{value}</div>
        <div className="flex items-center justify-between mt-1">
          <p className="text-xs text-muted-foreground">{description}</p>
          {trend && (
            <span className={`text-xs flex items-center ${
              trendUp ? 'text-green-600' : 'text-red-600'
            }`}>
              {trend}
            </span>
          )}
        </div>
      </CardContent>
    </Card>
  )
}