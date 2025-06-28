// src/app/(dashboard)/staff/support/page.tsx
'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { 
  Search,
  Bell,
  MessageSquare,
  Clock,
  CheckCircle,
  AlertTriangle,
  User,
  RefreshCw,
  Plus
} from 'lucide-react'
import { RoleGuard } from '@/components/shared/role-guard'
import { CustomerSupport } from '@/components/staff/customer-support'
import Link from 'next/link'

export default function StaffSupportPage() {
  // Mock data - would come from API
  const supportStats = {
    openTickets: 15,
    inProgress: 8,
    resolved: 25,
    avgResponseTime: 2.5 // hours
  }

  const tickets = [
    {
      id: 'T-001',
      subject: 'Payment issue with order #ORD-123',
      description: 'Customer unable to complete payment with credit card',
      customer: {
        name: 'Alice Johnson',
        email: 'alice@example.com',
        id: 'cust-1'
      },
      status: 'open',
      priority: 'high',
      category: 'payment_problem',
      assignedTo: null,
      createdAt: '2024-06-28T09:30:00Z',
      updatedAt: '2024-06-28T09:30:00Z',
      lastResponse: null,
      messageCount: 1
    },
    {
      id: 'T-002',
      subject: 'Question about return policy',
      description: 'Customer wants to know about return timeframe for custom designs',
      customer: {
        name: 'Bob Smith',
        email: 'bob@example.com',
        id: 'cust-2'
      },
      status: 'in_progress',
      priority: 'medium',
      category: 'product_inquiry',
      assignedTo: {
        name: 'John Staff',
        id: 'staff-1'
      },
      createdAt: '2024-06-28T08:15:00Z',
      updatedAt: '2024-06-28T10:45:00Z',
      lastResponse: '2024-06-28T10:45:00Z',
      messageCount: 3
    },
    {
      id: 'T-003',
      subject: 'Order not received after 2 weeks',
      description: 'Customer claims order was never delivered despite tracking showing delivered',
      customer: {
        name: 'Carol Davis',
        email: 'carol@example.com',
        id: 'cust-3'
      },
      status: 'open',
      priority: 'urgent',
      category: 'order_issue',
      assignedTo: null,
      createdAt: '2024-06-27T14:20:00Z',
      updatedAt: '2024-06-27T14:20:00Z',
      lastResponse: null,
      messageCount: 1
    }
  ]

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'open': return 'destructive'
      case 'in_progress': return 'default'
      case 'pending_customer': return 'secondary'
      case 'resolved': return 'secondary'
      case 'closed': return 'outline'
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

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'order_issue': return Bell
      case 'payment_problem': return AlertTriangle
      case 'product_inquiry': return MessageSquare
      case 'account_issue': return User
      default: return MessageSquare
    }
  }

  const formatTimeAgo = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60))
    
    if (diffInHours < 1) return 'Just now'
    if (diffInHours < 24) return `${diffInHours}h ago`
    return `${Math.floor(diffInHours / 24)}d ago`
  }

  return (
    <RoleGuard allowedRoles={['staff']}>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Customer Support</h1>
            <p className="text-muted-foreground mt-1">
              Manage support tickets and customer inquiries
            </p>
          </div>
          <div className="flex items-center space-x-2 mt-4 md:mt-0">
            <Button variant="outline" size="sm">
              <RefreshCw className="w-4 h-4 mr-2" />
              Refresh
            </Button>
            <Link href="/staff/support/chat">
              <Button size="sm">
                <MessageSquare className="w-4 h-4 mr-2" />
                Live Chat
              </Button>
            </Link>
          </div>
        </div>

        {/* Support Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Open Tickets</p>
                  <p className="text-2xl font-bold text-orange-600">{supportStats.openTickets}</p>
                </div>
                <Bell className="w-8 h-8 text-orange-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">In Progress</p>
                  <p className="text-2xl font-bold text-blue-600">{supportStats.inProgress}</p>
                </div>
                <Clock className="w-8 h-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Resolved Today</p>
                  <p className="text-2xl font-bold text-green-600">{supportStats.resolved}</p>
                </div>
                <CheckCircle className="w-8 h-8 text-green-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Avg Response</p>
                  <p className="text-2xl font-bold text-purple-600">{supportStats.avgResponseTime}h</p>
                </div>
                <MessageSquare className="w-8 h-8 text-purple-600" />
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
                    placeholder="Search tickets by ID, customer, or subject..."
                    className="pl-10"
                  />
                </div>
              </div>
              <Select>
                <SelectTrigger className="w-full md:w-[150px]">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="open">Open</SelectItem>
                  <SelectItem value="in_progress">In Progress</SelectItem>
                  <SelectItem value="pending_customer">Pending Customer</SelectItem>
                  <SelectItem value="resolved">Resolved</SelectItem>
                </SelectContent>
              </Select>
              <Select>
                <SelectTrigger className="w-full md:w-[150px]">
                  <SelectValue placeholder="Priority" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Priority</SelectItem>
                  <SelectItem value="urgent">Urgent</SelectItem>
                  <SelectItem value="high">High</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="low">Low</SelectItem>
                </SelectContent>
              </Select>
              <Select>
                <SelectTrigger className="w-full md:w-[150px]">
                  <SelectValue placeholder="Category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  <SelectItem value="order_issue">Order Issue</SelectItem>
                  <SelectItem value="payment_problem">Payment</SelectItem>
                  <SelectItem value="product_inquiry">Product</SelectItem>
                  <SelectItem value="account_issue">Account</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Support Tickets */}
        <Tabs defaultValue="all" className="space-y-4">
          <TabsList>
            <TabsTrigger value="all">All Tickets ({tickets.length})</TabsTrigger>
            <TabsTrigger value="unassigned">Unassigned ({tickets.filter(t => !t.assignedTo).length})</TabsTrigger>
            <TabsTrigger value="urgent">Urgent ({tickets.filter(t => t.priority === 'urgent').length})</TabsTrigger>
            <TabsTrigger value="my-tickets">My Tickets (0)</TabsTrigger>
          </TabsList>

          <TabsContent value="all" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Support Tickets</CardTitle>
                <CardDescription>
                  All customer support tickets requiring attention
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {tickets.map((ticket) => {
                    const CategoryIcon = getCategoryIcon(ticket.category)
                    return (
                      <div key={ticket.id} className="flex items-start justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors">
                        <div className="flex items-start space-x-4 flex-1">
                          <div className="mt-1">
                            <CategoryIcon className="w-5 h-5 text-muted-foreground" />
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center space-x-2 mb-2">
                              <h4 className="font-semibold">{ticket.id}</h4>
                              <Badge variant={getStatusColor(ticket.status)}>
                                {ticket.status.replace('_', ' ')}
                              </Badge>
                              <Badge variant={getPriorityColor(ticket.priority)}>
                                {ticket.priority}
                              </Badge>
                            </div>
                            <p className="font-medium mb-1">{ticket.subject}</p>
                            <p className="text-sm text-muted-foreground mb-2 line-clamp-2">
                              {ticket.description}
                            </p>
                            <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                              <span>
                                <User className="w-3 h-3 inline mr-1" />
                                {ticket.customer.name}
                              </span>
                              <span>
                                <MessageSquare className="w-3 h-3 inline mr-1" />
                                {ticket.messageCount} messages
                              </span>
                              <span>Created {formatTimeAgo(ticket.createdAt)}</span>
                              {ticket.lastResponse && (
                                <span>Last reply {formatTimeAgo(ticket.lastResponse)}</span>
                              )}
                            </div>
                            {ticket.assignedTo && (
                              <p className="text-sm text-blue-600 mt-1">
                                Assigned to {ticket.assignedTo.name}
                              </p>
                            )}
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Link href={`/staff/support/${ticket.id}`}>
                            <Button variant="outline" size="sm">
                              <MessageSquare className="w-4 h-4 mr-2" />
                              Reply
                            </Button>
                          </Link>
                          {!ticket.assignedTo && (
                            <Button size="sm">
                              <Plus className="w-4 h-4 mr-2" />
                              Take
                            </Button>
                          )}
                        </div>
                      </div>
                    )
                  })}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="unassigned">
            <CustomerSupport 
              tickets={tickets.filter(ticket => !ticket.assignedTo)} 
              title="Unassigned Tickets"
              description="Tickets that need to be assigned to a staff member"
            />
          </TabsContent>

          <TabsContent value="urgent">
            <CustomerSupport 
              tickets={tickets.filter(ticket => ticket.priority === 'urgent')} 
              title="Urgent Tickets"
              description="High priority tickets requiring immediate attention"
            />
          </TabsContent>

          <TabsContent value="my-tickets">
            <CustomerSupport 
              tickets={[]} 
              title="My Tickets"
              description="Tickets assigned to you"
            />
          </TabsContent>
        </Tabs>
      </div>
    </RoleGuard>
  )
}
