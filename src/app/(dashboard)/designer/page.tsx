// src/app/(dashboard)/designer/page.tsx
'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { 
  Upload,
  Palette,
  TrendingUp,
  Users,
  ArrowRight,
  Eye,
  DollarSign,
  Star,
  Clock,
  CheckCircle
} from 'lucide-react'
import Link from 'next/link'

export default function DesignerDashboard() {
  // Mock data - TODO: Replace with API calls
  const designerStats = {
    totalDesigns: 24,
    approvedDesigns: 18,
    pendingDesigns: 4,
    rejectedDesigns: 2,
    totalViews: 1247,
    thisMonthEarnings: 3420.50,
    activeCollaborations: 3,
    avgRating: 4.8
  }

  const recentActivity = [
    {
      id: 1,
      type: 'design_uploaded',
      title: 'Summer Collection Design #3',
      time: '2 hours ago',
      status: 'pending'
    },
    {
      id: 2,
      type: 'design_approved',
      title: 'Floral Pattern Design',
      time: '1 day ago',
      status: 'approved'
    },
    {
      id: 3,
      type: 'collaboration_request',
      title: 'Urban Styles wants to collaborate',
      time: '2 days ago',
      status: 'new'
    },
    {
      id: 4,
      type: 'sale_made',
      title: 'Your design "Geometric Abstract" sold',
      time: '3 days ago',
      status: 'completed'
    }
  ]

  const topDesigns = [
    {
      id: 1,
      name: 'Geometric Abstract',
      views: 234,
      sales: 12,
      revenue: 480.00,
      image: '/images/designs/geometric-abstract.jpg'
    },
    {
      id: 2,
      name: 'Floral Pattern',
      views: 187,
      sales: 8,
      revenue: 320.00,
      image: '/images/designs/floral-pattern.jpg'
    },
    {
      id: 3,
      name: 'Vintage Textile',
      views: 156,
      sales: 6,
      revenue: 240.00,
      image: '/images/designs/vintage-textile.jpg'
    }
  ]

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved': return 'bg-green-100 text-green-800'
      case 'pending': return 'bg-yellow-100 text-yellow-800'
      case 'rejected': return 'bg-red-100 text-red-800'
      case 'new': return 'bg-blue-100 text-blue-800'
      case 'completed': return 'bg-green-100 text-green-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'design_uploaded': return <Upload className="h-4 w-4" />
      case 'design_approved': return <CheckCircle className="h-4 w-4 text-green-600" />
      case 'collaboration_request': return <Users className="h-4 w-4 text-blue-600" />
      case 'sale_made': return <DollarSign className="h-4 w-4 text-green-600" />
      default: return <Clock className="h-4 w-4" />
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Designer Dashboard</h1>
          <p className="text-muted-foreground mt-1">
            Manage your designs, track performance, and grow your creative business
          </p>
        </div>
        <div className="flex gap-3 mt-4 md:mt-0">
          <Button asChild>
            <Link href="/designer/upload">
              <Upload className="mr-2 h-4 w-4" />
              Upload Design
            </Link>
          </Button>
          <Button variant="outline" asChild>
            <Link href="/designer/portfolio">
              <Palette className="mr-2 h-4 w-4" />
              Portfolio
            </Link>
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Designs</CardTitle>
            <Palette className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{designerStats.totalDesigns}</div>
            <p className="text-xs text-muted-foreground">
              {designerStats.approvedDesigns} approved, {designerStats.pendingDesigns} pending
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Views</CardTitle>
            <Eye className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{designerStats.totalViews.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              +12% from last month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">This Month Earnings</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${designerStats.thisMonthEarnings.toFixed(2)}</div>
            <p className="text-xs text-muted-foreground">
              +23% from last month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Rating</CardTitle>
            <Star className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{designerStats.avgRating}</div>
            <p className="text-xs text-muted-foreground">
              Based on 47 reviews
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Activity */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>Your latest design activities and updates</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentActivity.map((activity) => (
                <div key={activity.id} className="flex items-center space-x-4">
                  <div className="flex-shrink-0">
                    {getActivityIcon(activity.type)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-foreground truncate">
                      {activity.title}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {activity.time}
                    </p>
                  </div>
                  <Badge className={getStatusColor(activity.status)}>
                    {activity.status}
                  </Badge>
                </div>
              ))}
            </div>
            <div className="mt-6">
              <Button variant="outline" className="w-full">
                View All Activity
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>Frequently used actions</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button asChild className="w-full justify-start">
              <Link href="/designer/upload">
                <Upload className="mr-2 h-4 w-4" />
                Upload New Design
              </Link>
            </Button>
            <Button asChild variant="outline" className="w-full justify-start">
              <Link href="/designer/collaborations">
                <Users className="mr-2 h-4 w-4" />
                View Collaborations
              </Link>
            </Button>
            <Button asChild variant="outline" className="w-full justify-start">
              <Link href="/designer/analytics">
                <TrendingUp className="mr-2 h-4 w-4" />
                View Analytics
              </Link>
            </Button>
            <Button asChild variant="outline" className="w-full justify-start">
              <Link href="/designer/earnings">
                <DollarSign className="mr-2 h-4 w-4" />
                Earnings & Payouts
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Top Performing Designs */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Top Performing Designs</CardTitle>
            <CardDescription>Your best designs this month</CardDescription>
          </div>
          <Button variant="outline" asChild>
            <Link href="/designer/analytics">
              View All
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {topDesigns.map((design) => (
              <div key={design.id} className="space-y-3">
                <div className="aspect-square bg-gray-100 rounded-lg flex items-center justify-center">
                  {/* Design thumbnail placeholder */}
                  <Palette className="h-12 w-12 text-gray-400" />
                </div>
                <div>
                  <h3 className="font-medium text-sm">{design.name}</h3>
                  <div className="text-xs text-muted-foreground space-y-1">
                    <div className="flex justify-between">
                      <span>Views:</span>
                      <span>{design.views}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Sales:</span>
                      <span>{design.sales}</span>
                    </div>
                    <div className="flex justify-between font-medium">
                      <span>Revenue:</span>
                      <span>${design.revenue.toFixed(2)}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
