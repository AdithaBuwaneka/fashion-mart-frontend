// src/app/(dashboard)/staff/quality/page.tsx
'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Checkbox } from '@/components/ui/checkbox'
import { 
  Search,
  CheckCircle,
  XCircle,
  Package,
  ClipboardCheck,
  Eye,
  RefreshCw,
  Star
} from 'lucide-react'
import { RoleGuard } from '@/components/shared/role-guard'
import Link from 'next/link'

export default function StaffQualityPage() {
  // Mock data - would come from API
  const qualityStats = {
    pendingChecks: 15,
    passedToday: 42,
    failedToday: 3,
    qualityScore: 94.2
  }

  const qualityChecks = [
    {
      id: 'QC-001',
      order: {
        id: 'ORD-001',
        orderNumber: 'ORD-2024-001',
        customer: {
          name: 'Alice Johnson'
        }
      },
      status: 'pending',
      priority: 'high',
      items: [
        {
          id: 'item-1',
          product: {
            name: 'Summer Floral Dress',
            sku: 'SFD-001'
          },
          quantity: 1,
          checkPoints: [
            'Material quality',
            'Stitching integrity',
            'Color accuracy',
            'Size specifications',
            'Packaging condition'
          ]
        }
      ],
      createdAt: '2024-06-28T10:30:00Z',
      dueDate: '2024-06-28T16:00:00Z'
    },
    {
      id: 'QC-002',
      order: {
        id: 'ORD-002',
        orderNumber: 'ORD-2024-002',
        customer: {
          name: 'Bob Smith'
        }
      },
      status: 'passed',
      priority: 'medium',
      items: [
        {
          id: 'item-2',
          product: {
            name: 'Cotton T-Shirt',
            sku: 'CTS-002'
          },
          quantity: 2,
          checkPoints: [
            'Material quality',
            'Print quality',
            'Size specifications'
          ]
        }
      ],
      createdAt: '2024-06-28T08:15:00Z',
      completedAt: '2024-06-28T09:30:00Z',
      checkedBy: 'Quality Staff',
      qualityScore: 95,
      notes: 'Excellent quality. Ready for shipping.'
    },
    {
      id: 'QC-003',
      order: {
        id: 'ORD-003',
        orderNumber: 'ORD-2024-003',
        customer: {
          name: 'Carol Davis'
        }
      },
      status: 'failed',
      priority: 'high',
      items: [
        {
          id: 'item-3',
          product: {
            name: 'Designer Jacket',
            sku: 'DJ-003'
          },
          quantity: 1,
          checkPoints: [
            'Material quality',
            'Stitching integrity',
            'Hardware quality',
            'Fit and finish'
          ]
        }
      ],
      createdAt: '2024-06-27T14:20:00Z',
      completedAt: '2024-06-28T11:15:00Z',
      checkedBy: 'Quality Staff',
      qualityScore: 65,
      issues: [
        {
          type: 'Stitching defect',
          severity: 'major',
          description: 'Loose threads on left sleeve seam'
        },
        {
          type: 'Material flaw',
          severity: 'minor',
          description: 'Small mark on fabric near pocket'
        }
      ],
      notes: 'Item requires rework before shipping. Contacted supplier about quality issues.'
    }
  ]

  const checklistItems = [
    'Material quality and texture',
    'Stitching integrity and alignment',
    'Color accuracy and consistency',
    'Size specifications and fit',
    'Hardware functionality (zippers, buttons)',
    'Print/embroidery quality',
    'Packaging condition',
    'Care label accuracy',
    'Overall appearance and finish'
  ]

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'destructive'
      case 'passed': return 'secondary'
      case 'failed': return 'outline'
      case 'needs_review': return 'default'
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

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'destructive'
      case 'major': return 'default'
      case 'minor': return 'secondary'
      default: return 'outline'
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
            <h1 className="text-3xl font-bold text-foreground">Quality Control</h1>
            <p className="text-muted-foreground mt-1">
              Perform quality checks and ensure product standards
            </p>
          </div>
          <div className="flex items-center space-x-2 mt-4 md:mt-0">
            <Button variant="outline" size="sm">
              <RefreshCw className="w-4 h-4 mr-2" />
              Refresh
            </Button>
            <Button size="sm">
              <ClipboardCheck className="w-4 h-4 mr-2" />
              New Check
            </Button>
          </div>
        </div>

        {/* Quality Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Pending Checks</p>
                  <p className="text-2xl font-bold text-orange-600">{qualityStats.pendingChecks}</p>
                </div>
                <ClipboardCheck className="w-8 h-8 text-orange-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Passed Today</p>
                  <p className="text-2xl font-bold text-green-600">{qualityStats.passedToday}</p>
                </div>
                <CheckCircle className="w-8 h-8 text-green-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Failed Today</p>
                  <p className="text-2xl font-bold text-red-600">{qualityStats.failedToday}</p>
                </div>
                <XCircle className="w-8 h-8 text-red-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Quality Score</p>
                  <p className="text-2xl font-bold text-purple-600">{qualityStats.qualityScore}%</p>
                </div>
                <Star className="w-8 h-8 text-purple-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Quality Control Interface */}
        <Tabs defaultValue="queue" className="space-y-4">
          <TabsList>
            <TabsTrigger value="queue">Quality Queue ({qualityStats.pendingChecks})</TabsTrigger>
            <TabsTrigger value="checklist">Quality Checklist</TabsTrigger>
            <TabsTrigger value="reports">Quality Reports</TabsTrigger>
          </TabsList>

          <TabsContent value="queue" className="space-y-4">
            {/* Filters */}
            <Card>
              <CardContent className="p-4">
                <div className="flex flex-col md:flex-row gap-4">
                  <div className="flex-1">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                      <Input
                        placeholder="Search by order number, product, or customer..."
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
                      <SelectItem value="passed">Passed</SelectItem>
                      <SelectItem value="failed">Failed</SelectItem>
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
                </div>
              </CardContent>
            </Card>

            {/* Quality Queue */}
            <Card>
              <CardHeader>
                <CardTitle>Quality Control Queue</CardTitle>
                <CardDescription>
                  Products awaiting quality inspection
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {qualityChecks.map((check) => (
                    <div key={check.id} className="flex items-start justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors">
                      <div className="flex items-start space-x-4 flex-1">
                        <div className="mt-1">
                          <Package className="w-5 h-5 text-muted-foreground" />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center space-x-2 mb-2">
                            <h4 className="font-semibold">{check.id}</h4>
                            <Badge variant={getStatusColor(check.status)}>
                              {check.status}
                            </Badge>
                            <Badge variant={getPriorityColor(check.priority)}>
                              {check.priority}
                            </Badge>
                          </div>
                          <p className="text-sm text-muted-foreground mb-1">
                            <span className="font-medium">Order:</span> {check.order.orderNumber} • 
                            <span className="font-medium"> Customer:</span> {check.order.customer.name}
                          </p>
                          <p className="text-sm text-muted-foreground mb-2">
                            <span className="font-medium">Items:</span> {check.items.map(item => `${item.product.name} (${item.quantity})`).join(', ')}
                          </p>
                          <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                            <span>Created {formatTimeAgo(check.createdAt)}</span>
                            {check.completedAt && (
                              <span>Completed {formatTimeAgo(check.completedAt)}</span>
                            )}
                            {check.checkedBy && (
                              <span>By {check.checkedBy}</span>
                            )}
                          </div>
                          {check.qualityScore && (
                            <div className="flex items-center space-x-2 mt-1">
                              <Star className="w-4 h-4 text-yellow-500" />
                              <span className="text-sm font-medium">Quality Score: {check.qualityScore}%</span>
                            </div>
                          )}
                          {check.issues && check.issues.length > 0 && (
                            <div className="mt-2">
                              <p className="text-sm font-medium text-red-600 mb-1">Issues Found:</p>
                              {check.issues.map((issue, index) => (
                                <div key={index} className="flex items-center space-x-2 text-sm">
                                  <Badge variant={getSeverityColor(issue.severity)} className="text-xs">
                                    {issue.severity}
                                  </Badge>
                                  <span>{issue.type}: {issue.description}</span>
                                </div>
                              ))}
                            </div>
                          )}
                          {check.notes && (
                            <p className="text-sm text-muted-foreground mt-1">
                              <span className="font-medium">Notes:</span> {check.notes}
                            </p>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Link href={`/staff/quality/${check.id}`}>
                          <Button variant="outline" size="sm">
                            <Eye className="w-4 h-4 mr-2" />
                            Inspect
                          </Button>
                        </Link>
                        {check.status === 'pending' && (
                          <>
                            <Button size="sm" variant="outline" className="text-green-600 border-green-600 hover:bg-green-50">
                              <CheckCircle className="w-4 h-4 mr-2" />
                              Pass
                            </Button>
                            <Button size="sm" variant="outline" className="text-red-600 border-red-600 hover:bg-red-50">
                              <XCircle className="w-4 h-4 mr-2" />
                              Fail
                            </Button>
                          </>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="checklist" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Quality Control Checklist</CardTitle>
                <CardDescription>
                  Standard quality inspection points for all products
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <h4 className="font-medium">Product Quality Inspection</h4>
                  <div className="space-y-3">
                    {checklistItems.map((item, index) => (
                      <div key={index} className="flex items-center space-x-3">
                        <Checkbox id={`check-${index}`} />
                        <label htmlFor={`check-${index}`} className="text-sm">
                          {item}
                        </label>
                      </div>
                    ))}
                  </div>
                  
                  <div className="space-y-4 pt-4 border-t">
                    <h4 className="font-medium">Quality Assessment</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="text-sm font-medium mb-2 block">Overall Quality Score (1-100)</label>
                        <Input type="number" min="1" max="100" placeholder="85" />
                      </div>
                      <div>
                        <label className="text-sm font-medium mb-2 block">Status</label>
                        <Select>
                          <SelectTrigger>
                            <SelectValue placeholder="Select status" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="passed">Passed</SelectItem>
                            <SelectItem value="failed">Failed</SelectItem>
                            <SelectItem value="needs_review">Needs Review</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    <div>
                      <label className="text-sm font-medium mb-2 block">Quality Notes</label>
                      <Textarea 
                        placeholder="Add any quality observations, issues, or recommendations..."
                        rows={4}
                      />
                    </div>
                    <div className="flex space-x-2">
                      <Button>Submit Quality Check</Button>
                      <Button variant="outline">Save Draft</Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="reports" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Quality Reports</CardTitle>
                <CardDescription>
                  Quality metrics and performance analytics
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8">
                  <ClipboardCheck className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-muted-foreground mb-2">Quality Reports</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    Detailed quality analytics and trend reports will be available here.
                  </p>
                  <Button variant="outline">Generate Report</Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </RoleGuard>
  )
}
