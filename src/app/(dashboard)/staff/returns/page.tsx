// src/app/(dashboard)/staff/returns/page.tsx
'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { 
  Search,
  ArrowLeftRight,
  Clock,
  CheckCircle,
  XCircle,
  DollarSign,
  Eye,
  RefreshCw
} from 'lucide-react'
import { RoleGuard } from '@/components/shared/role-guard'
import { ReturnProcessor } from '@/components/staff/return-processor'
import Link from 'next/link'

export default function StaffReturnsPage() {
  // Mock data - would come from API
  const returnStats = {
    pendingReturns: 8,
    approvedReturns: 12,
    rejectedReturns: 3,
    totalRefunds: 1250.50
  }

  const returns = [
    {
      id: 'R-001',
      returnNumber: 'RET-2024-001',
      order: {
        id: 'ORD-001',
        orderNumber: 'ORD-2024-001'
      },
      customer: {
        name: 'Alice Johnson',
        email: 'alice@example.com',
        id: 'cust-1'
      },
      status: 'pending',
      reason: 'Item damaged during shipping',
      refundAmount: 89.99,
      items: [
        {
          id: 'item-1',
          product: {
            name: 'Summer Floral Dress',
            image: '/images/products/dress-1.jpg'
          },
          quantity: 1,
          reason: 'Damaged during shipping'
        }
      ],
      createdAt: '2024-06-28T10:30:00Z',
      requestedRefund: 89.99,
      isRefundProcessed: false
    },
    {
      id: 'R-002',
      returnNumber: 'RET-2024-002',
      order: {
        id: 'ORD-002',
        orderNumber: 'ORD-2024-002'
      },
      customer: {
        name: 'Bob Smith',
        email: 'bob@example.com',
        id: 'cust-2'
      },
      status: 'approved',
      reason: 'Wrong size ordered',
      refundAmount: 156.50,
      items: [
        {
          id: 'item-2',
          product: {
            name: 'Designer Jacket',
            image: '/images/products/jacket-1.jpg'
          },
          quantity: 1,
          reason: 'Wrong size'
        }
      ],
      createdAt: '2024-06-27T14:15:00Z',
      requestedRefund: 156.50,
      isRefundProcessed: false,
      processedBy: 'Staff User',
      processedAt: '2024-06-28T09:30:00Z'
    },
    {
      id: 'R-003',
      returnNumber: 'RET-2024-003',
      order: {
        id: 'ORD-003',
        orderNumber: 'ORD-2024-003'
      },
      customer: {
        name: 'Carol Davis',
        email: 'carol@example.com',
        id: 'cust-3'
      },
      status: 'rejected',
      reason: 'Changed mind',
      refundAmount: 0,
      items: [
        {
          id: 'item-3',
          product: {
            name: 'Custom Design T-Shirt',
            image: '/images/products/tshirt-1.jpg'
          },
          quantity: 2,
          reason: 'Changed mind'
        }
      ],
      createdAt: '2024-06-26T11:20:00Z',
      requestedRefund: 49.98,
      isRefundProcessed: false,
      processedBy: 'Staff User',
      processedAt: '2024-06-27T10:15:00Z',
      rejectionReason: 'Custom items are not returnable as per policy'
    }
  ]

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'destructive'
      case 'approved': return 'secondary'
      case 'rejected': return 'outline'
      case 'processed': return 'secondary'
      default: return 'outline'
    }
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount)
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
            <h1 className="text-3xl font-bold text-foreground">Returns Management</h1>
            <p className="text-muted-foreground mt-1">
              Process return requests and manage refunds
            </p>
          </div>
          <div className="flex items-center space-x-2 mt-4 md:mt-0">
            <Button variant="outline" size="sm">
              <RefreshCw className="w-4 h-4 mr-2" />
              Refresh
            </Button>
            <Button size="sm">
              Bulk Process
            </Button>
          </div>
        </div>

        {/* Returns Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Pending Returns</p>
                  <p className="text-2xl font-bold text-orange-600">{returnStats.pendingReturns}</p>
                </div>
                <Clock className="w-8 h-8 text-orange-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Approved</p>
                  <p className="text-2xl font-bold text-green-600">{returnStats.approvedReturns}</p>
                </div>
                <CheckCircle className="w-8 h-8 text-green-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Rejected</p>
                  <p className="text-2xl font-bold text-red-600">{returnStats.rejectedReturns}</p>
                </div>
                <XCircle className="w-8 h-8 text-red-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Total Refunds</p>
                  <p className="text-2xl font-bold text-purple-600">{formatCurrency(returnStats.totalRefunds)}</p>
                </div>
                <DollarSign className="w-8 h-8 text-purple-600" />
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
                    placeholder="Search returns by ID, order number, or customer..."
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
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="approved">Approved</SelectItem>
                  <SelectItem value="rejected">Rejected</SelectItem>
                  <SelectItem value="processed">Processed</SelectItem>
                </SelectContent>
              </Select>
              <Select>
                <SelectTrigger className="w-full md:w-[180px]">
                  <SelectValue placeholder="Date Range" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="today">Today</SelectItem>
                  <SelectItem value="week">This Week</SelectItem>
                  <SelectItem value="month">This Month</SelectItem>
                  <SelectItem value="all">All Time</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Returns Queue */}
        <Tabs defaultValue="all" className="space-y-4">
          <TabsList>
            <TabsTrigger value="all">All Returns ({returns.length})</TabsTrigger>
            <TabsTrigger value="pending">Pending ({returnStats.pendingReturns})</TabsTrigger>
            <TabsTrigger value="approved">Approved ({returnStats.approvedReturns})</TabsTrigger>
            <TabsTrigger value="rejected">Rejected ({returnStats.rejectedReturns})</TabsTrigger>
          </TabsList>

          <TabsContent value="all" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Return Requests</CardTitle>
                <CardDescription>
                  All customer return requests requiring review
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {returns.map((returnItem) => (
                    <div key={returnItem.id} className="flex items-start justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors">
                      <div className="flex items-start space-x-4 flex-1">
                        <div className="mt-1">
                          <ArrowLeftRight className="w-5 h-5 text-muted-foreground" />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center space-x-2 mb-2">
                            <h4 className="font-semibold">{returnItem.returnNumber}</h4>
                            <Badge variant={getStatusColor(returnItem.status)}>
                              {returnItem.status}
                            </Badge>
                          </div>
                          <p className="text-sm text-muted-foreground mb-1">
                            <span className="font-medium">Order:</span> {returnItem.order.orderNumber} • 
                            <span className="font-medium"> Customer:</span> {returnItem.customer.name}
                          </p>
                          <p className="text-sm text-muted-foreground mb-1">
                            <span className="font-medium">Reason:</span> {returnItem.reason}
                          </p>
                          <p className="text-sm text-muted-foreground mb-2">
                            <span className="font-medium">Items:</span> {returnItem.items.length} • 
                            <span className="font-medium"> Refund:</span> {formatCurrency(returnItem.requestedRefund)}
                          </p>
                          <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                            <span>Created {formatTimeAgo(returnItem.createdAt)}</span>
                            {returnItem.processedBy && (
                              <span>Processed by {returnItem.processedBy}</span>
                            )}
                          </div>
                          {returnItem.rejectionReason && (
                            <p className="text-sm text-red-600 mt-1">
                              <span className="font-medium">Rejection reason:</span> {returnItem.rejectionReason}
                            </p>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Link href={`/staff/returns/${returnItem.id}`}>
                          <Button variant="outline" size="sm">
                            <Eye className="w-4 h-4 mr-2" />
                            Review
                          </Button>
                        </Link>
                        {returnItem.status === 'pending' && (
                          <>
                            <Button size="sm" variant="outline" className="text-green-600 border-green-600 hover:bg-green-50">
                              <CheckCircle className="w-4 h-4 mr-2" />
                              Approve
                            </Button>
                            <Button size="sm" variant="outline" className="text-red-600 border-red-600 hover:bg-red-50">
                              <XCircle className="w-4 h-4 mr-2" />
                              Reject
                            </Button>
                          </>
                        )}
                        {returnItem.status === 'approved' && !returnItem.isRefundProcessed && (
                          <Button size="sm">
                            <DollarSign className="w-4 h-4 mr-2" />
                            Process Refund
                          </Button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="pending">
            <ReturnProcessor 
              returns={returns.filter(r => r.status === 'pending')} 
              title="Pending Returns"
              description="Return requests awaiting review and approval"
            />
          </TabsContent>

          <TabsContent value="approved">
            <ReturnProcessor 
              returns={returns.filter(r => r.status === 'approved')} 
              title="Approved Returns"
              description="Returns approved and ready for refund processing"
            />
          </TabsContent>

          <TabsContent value="rejected">
            <ReturnProcessor 
              returns={returns.filter(r => r.status === 'rejected')} 
              title="Rejected Returns"
              description="Returns that have been rejected with reasons"
            />
          </TabsContent>
        </Tabs>
      </div>
    </RoleGuard>
  )
}
