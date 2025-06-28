// src/app/(dashboard)/staff/dashboard/page.tsx
'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Progress } from '@/components/ui/progress'
import { 
  Package, 
  Bell, 
  Clock,
  CheckCircle,
  AlertTriangle,
  TrendingUp,
  ArrowRight,
  Filter,
  RefreshCw
} from 'lucide-react'
import { RoleGuard } from '@/components/shared/role-guard'
import Link from 'next/link'

export default function StaffDashboard() {
  // Mock data - would come from API
  const staffStats = {
    pendingOrders: 12,
    activeTickets: 5,
    todayTasks: 8,
    overdueItems: 2,
    averageResponseTime: 24, // hours
    completionRate: 87 // percentage
  }

  const urgentTasks = [
    {
      id: '1',
      title: 'Process urgent order #ORD-001',
      type: 'order_processing',
      priority: 'urgent',
      dueDate: '2024-06-28',
      customer: 'Alice Johnson'
    },
    {
      id: '2',
      title: 'Resolve payment issue ticket',
      type: 'customer_support',
      priority: 'high',
      dueDate: '2024-06-28',
      customer: 'Bob Smith'
    },
    {
      id: '3',
      title: 'Quality check for bulk order',
      type: 'quality_check',
      priority: 'medium',
      dueDate: '2024-06-29',
      customer: 'Fashion Store Co.'
    }
  ]

  const recentActivity = [
    {
      id: '1',
      action: 'Processed order #ORD-123',
      time: '2 minutes ago',
      status: 'completed'
    },
    {
      id: '2',
      action: 'Responded to support ticket #T-456',
      time: '15 minutes ago',
      status: 'completed'
    },
    {
      id: '3',
      action: 'Approved return request #R-789',
      time: '1 hour ago',
      status: 'completed'
    }
  ]

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
            <h1 className="text-3xl font-bold text-foreground">Staff Dashboard</h1>
            <p className="text-muted-foreground mt-1">
              Manage orders, support tickets, and daily tasks
            </p>
          </div>
          <div className="flex items-center space-x-2 mt-4 md:mt-0">
            <Button variant="outline" size="sm">
              <RefreshCw className="w-4 h-4 mr-2" />
              Refresh
            </Button>
            <Button variant="outline" size="sm">
              <Filter className="w-4 h-4 mr-2" />
              Filter
            </Button>
          </div>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Pending Orders</p>
                  <p className="text-2xl font-bold text-orange-600">{staffStats.pendingOrders}</p>
                </div>
                <Package className="w-8 h-8 text-orange-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Active Tickets</p>
                  <p className="text-2xl font-bold text-blue-600">{staffStats.activeTickets}</p>
                </div>
                <Bell className="w-8 h-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Today&apos;s Tasks</p>
                  <p className="text-2xl font-bold text-green-600">{staffStats.todayTasks}</p>
                </div>
                <CheckCircle className="w-8 h-8 text-green-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Overdue Items</p>
                  <p className="text-2xl font-bold text-red-600">{staffStats.overdueItems}</p>
                </div>
                <AlertTriangle className="w-8 h-8 text-red-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Avg Response</p>
                  <p className="text-2xl font-bold text-purple-600">{staffStats.averageResponseTime}h</p>
                </div>
                <Clock className="w-8 h-8 text-purple-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Completion Rate</p>
                  <p className="text-2xl font-bold text-emerald-600">{staffStats.completionRate}%</p>
                </div>
                <TrendingUp className="w-8 h-8 text-emerald-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>
              Common tasks and shortcuts for your daily workflow
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <Link href="/staff/orders">
                <Button variant="outline" className="w-full h-20 flex flex-col items-center justify-center space-y-2">
                  <Package className="w-6 h-6" />
                  <span>Process Orders</span>
                </Button>
              </Link>
              <Link href="/staff/support">
                <Button variant="outline" className="w-full h-20 flex flex-col items-center justify-center space-y-2">
                  <Bell className="w-6 h-6" />
                  <span>Support Tickets</span>
                </Button>
              </Link>
              <Link href="/staff/returns">
                <Button variant="outline" className="w-full h-20 flex flex-col items-center justify-center space-y-2">
                  <ArrowRight className="w-6 h-6" />
                  <span>Handle Returns</span>
                </Button>
              </Link>
              <Link href="/staff/quality">
                <Button variant="outline" className="w-full h-20 flex flex-col items-center justify-center space-y-2">
                  <CheckCircle className="w-6 h-6" />
                  <span>Quality Check</span>
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>

        {/* Main Content Tabs */}
        <Tabs defaultValue="tasks" className="space-y-4">
          <TabsList>
            <TabsTrigger value="tasks">Urgent Tasks</TabsTrigger>
            <TabsTrigger value="activity">Recent Activity</TabsTrigger>
            <TabsTrigger value="performance">Performance</TabsTrigger>
          </TabsList>

          <TabsContent value="tasks" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  Urgent Tasks
                  <Badge variant="destructive">{urgentTasks.length} urgent</Badge>
                </CardTitle>
                <CardDescription>
                  High priority tasks that need immediate attention
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {urgentTasks.map((task) => (
                    <div key={task.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center space-x-4">
                        <div className="flex-1">
                          <h4 className="font-medium">{task.title}</h4>
                          <p className="text-sm text-muted-foreground">
                            Customer: {task.customer} • Due: {task.dueDate}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Badge variant={getPriorityColor(task.priority)}>
                          {task.priority}
                        </Badge>
                        <Button size="sm">
                          Start Task
                          <ArrowRight className="w-4 h-4 ml-2" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="activity" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Recent Activity</CardTitle>
                <CardDescription>
                  Your recent actions and completed tasks
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentActivity.map((activity) => (
                    <div key={activity.id} className="flex items-center space-x-4 p-4 border rounded-lg">
                      <CheckCircle className="w-5 h-5 text-green-600" />
                      <div className="flex-1">
                        <p className="font-medium">{activity.action}</p>
                        <p className="text-sm text-muted-foreground">{activity.time}</p>
                      </div>
                      <Badge variant="secondary">{activity.status}</Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="performance" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Daily Performance</CardTitle>
                  <CardDescription>
                    Your productivity metrics for today
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span>Task Completion</span>
                      <span>{staffStats.completionRate}%</span>
                    </div>
                    <Progress value={staffStats.completionRate} />
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span>Response Time Goal</span>
                      <span>85%</span>
                    </div>
                    <Progress value={85} />
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span>Quality Score</span>
                      <span>92%</span>
                    </div>
                    <Progress value={92} />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Goals & Targets</CardTitle>
                  <CardDescription>
                    Monthly performance targets
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Orders Processed</span>
                    <span className="font-medium">156 / 200</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Tickets Resolved</span>
                    <span className="font-medium">43 / 50</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Customer Satisfaction</span>
                    <span className="font-medium">4.6 / 5.0</span>
                  </div>
                  <Link href="/staff/performance">
                    <Button variant="outline" className="w-full mt-4">
                      View Detailed Performance
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </RoleGuard>
  )
}
