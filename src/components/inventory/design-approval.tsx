// src/components/inventory/design-approval.tsx
'use client'

import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { inventoryApi } from '@/lib/api/inventory'
import { Design } from '@/lib/types'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { 
  Search, 
  CheckCircle, 
  XCircle, 
  Clock, 
  Eye, 
  MessageSquare,
  User,
  Calendar,
  Filter,
  MoreHorizontal,
  Star,
  Download
} from 'lucide-react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator
} from '@/components/ui/dropdown-menu'
import Image from 'next/image'

/*
// Mock design data (kept for reference but not used)
const designSubmissions = [
  {
    id: 1,
    title: 'Summer Floral Dress Design',
    designer: 'Sarah Johnson',
    designerAvatar: '/images/avatars/designer1.jpg',
    submittedDate: '2024-06-28',
    category: 'Dresses',
    tags: ['summer', 'floral', 'casual'],
    status: 'pending',
    priority: 'high',
    thumbnail: '/images/designs/design1.jpg',
    description: 'Beautiful summer dress with vibrant floral patterns, perfect for casual wear.',
    estimatedCost: 45.99,
    expectedProfit: 25.00,
    marketDemand: 'high',
    comments: 2
  },
  {
    id: 2,
    title: 'Minimalist T-Shirt Collection',
    designer: 'Mike Chen',
    designerAvatar: '/images/avatars/designer2.jpg',
    submittedDate: '2024-06-27',
    category: 'T-Shirts',
    tags: ['minimalist', 'basic', 'everyday'],
    status: 'pending',
    priority: 'medium',
    thumbnail: '/images/designs/design2.jpg',
    description: 'Clean and simple t-shirt designs focusing on quality basics.',
    estimatedCost: 18.99,
    expectedProfit: 12.00,
    marketDemand: 'medium',
    comments: 1
  },
  {
    id: 3,
    title: 'Vintage Leather Jacket',
    designer: 'Emma Wilson',
    designerAvatar: '/images/avatars/designer3.jpg',
    submittedDate: '2024-06-26',
    category: 'Jackets',
    tags: ['vintage', 'leather', 'premium'],
    status: 'approved',
    priority: 'high',
    thumbnail: '/images/designs/design3.jpg',
    description: 'Premium vintage-style leather jacket with unique detailing.',
    estimatedCost: 189.99,
    expectedProfit: 80.00,
    marketDemand: 'high',
    comments: 5
  },
  {
    id: 4,
    title: 'Bohemian Maxi Dress',
    designer: 'Lisa Rodriguez',
    designerAvatar: '/images/avatars/designer4.jpg',
    submittedDate: '2024-06-25',
    category: 'Dresses',
    tags: ['bohemian', 'maxi', 'flowing'],
    status: 'rejected',
    priority: 'low',
    thumbnail: '/images/designs/design4.jpg',
    description: 'Flowing bohemian-style maxi dress with intricate patterns.',
    estimatedCost: 52.99,
    expectedProfit: 18.00,
    marketDemand: 'low',
    comments: 3
  }
]
*/

const categories = ['All Categories', 'Dresses', 'T-Shirts', 'Jackets', 'Accessories']
const priorities = ['All Priorities', 'high', 'medium', 'low']

export function DesignApproval() {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('All Categories')
  const [selectedPriority, setSelectedPriority] = useState('All Priorities')
  const [selectedStatus, setSelectedStatus] = useState('pending')
  const [selectedDesign, setSelectedDesign] = useState<Design | null>(null)
  const [approvalComment, setApprovalComment] = useState('')

  const queryClient = useQueryClient()

  // Fetch pending designs from API
  const { data: designs = [], isLoading } = useQuery({
    queryKey: ['pending-designs'],
    queryFn: inventoryApi.getPendingDesigns
  })

  // Review design mutation
  const reviewDesignMutation = useMutation({
    mutationFn: (reviewData: { designId: string; status: 'approved' | 'rejected'; feedback?: string }) =>
      inventoryApi.reviewDesign(reviewData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['pending-designs'] })
    }
  })

  const filteredDesigns = designs.filter(design => {
    const matchesSearch = design.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         design.designer?.firstName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         design.designer?.lastName?.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = selectedCategory === 'All Categories' // Category filtering not available
    const matchesStatus = selectedStatus === 'all' // Status filtering not available with current Design interface

    return matchesSearch && matchesCategory && matchesStatus
  })

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return <Badge variant="default" className="bg-yellow-500">Pending</Badge>
      case 'approved':
        return <Badge variant="default" className="bg-green-500">Approved</Badge>
      case 'rejected':
        return <Badge variant="destructive">Rejected</Badge>
      default:
        return <Badge variant="secondary">{status}</Badge>
    }
  }

  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case 'high':
        return <Badge variant="destructive">High</Badge>
      case 'medium':
        return <Badge variant="default">Medium</Badge>
      case 'low':
        return <Badge variant="secondary">Low</Badge>
      default:
        return <Badge variant="secondary">{priority}</Badge>
    }
  }

  const handleApprove = (designId: string) => {
    reviewDesignMutation.mutate({
      designId,
      status: 'approved',
      feedback: approvalComment
    })
    setApprovalComment('')
  }

  const handleReject = (designId: string) => {
    reviewDesignMutation.mutate({
      designId,
      status: 'rejected',
      feedback: approvalComment
    })
    setApprovalComment('')
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const getStatusCount = (_status: string) => {
    // Status filtering not available with current Design interface
    return 0
  }

  if (isLoading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="text-center">Loading designs...</div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <CheckCircle className="w-5 h-5" />
          Design Approval System
        </CardTitle>
        <CardDescription>
          Review and approve designer submissions for production
        </CardDescription>
      </CardHeader>
      <CardContent>
        {/* Status Tabs */}
        <Tabs value={selectedStatus} onValueChange={setSelectedStatus} className="space-y-4">
          <TabsList>
            <TabsTrigger value="pending">
              Pending ({getStatusCount('pending')})
            </TabsTrigger>
            <TabsTrigger value="approved">
              Approved ({getStatusCount('approved')})
            </TabsTrigger>
            <TabsTrigger value="rejected">
              Rejected ({getStatusCount('rejected')})
            </TabsTrigger>
            <TabsTrigger value="all">All Designs</TabsTrigger>
          </TabsList>

          {/* Filters */}
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search designs or designers..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger className="w-full sm:w-48">
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                {categories.map(category => (
                  <SelectItem key={category} value={category}>
                    {category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={selectedPriority} onValueChange={setSelectedPriority}>
              <SelectTrigger className="w-full sm:w-40">
                <SelectValue placeholder="Priority" />
              </SelectTrigger>
              <SelectContent>
                {priorities.map(priority => (
                  <SelectItem key={priority} value={priority}>
                    {priority}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button variant="outline" size="sm">
              <Filter className="w-4 h-4 mr-2" />
              Filters
            </Button>
          </div>

          <TabsContent value={selectedStatus} className="space-y-4">
            {/* Design Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredDesigns.map((design) => (
                <Card key={design.id} className="overflow-hidden">
                  <div className="aspect-video relative bg-muted">
                    <Image
                      src={design.imageUrl}
                      alt={design.name}
                      fill
                      className="object-cover"
                      onError={(e) => {
                        e.currentTarget.src = '/images/placeholder-design.jpg'
                      }}
                    />
                    <div className="absolute top-2 right-2 flex gap-2">
                      {getPriorityBadge('medium')}
                      {getStatusBadge('pending')}
                    </div>
                  </div>
                  <CardContent className="p-4">
                    <div className="space-y-3">
                      <div>
                        <h3 className="font-semibold line-clamp-2">{design.name}</h3>
                        <div className="flex items-center gap-2 mt-1">
                          <User className="w-4 h-4 text-muted-foreground" />
                          <span className="text-sm text-muted-foreground">
                            {design.designer?.firstName} {design.designer?.lastName}
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <Calendar className="w-4 h-4" />
                          {new Date(design.createdAt).toLocaleDateString()}
                        </div>
                        <div className="flex items-center gap-1">
                          <MessageSquare className="w-4 h-4" />
                          0 comments
                        </div>
                      </div>

                      <div className="flex flex-wrap gap-1">
                        {design.tags?.map((tag) => (
                          <Badge key={tag} variant="outline" className="text-xs">
                            {tag}
                          </Badge>
                        ))}
                      </div>

                      <div className="space-y-1 text-sm">
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Est. Cost:</span>
                          <span>$0</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Profit:</span>
                          <span className="text-green-600">$0</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Demand:</span>
                          <span className="text-yellow-600">
                            Medium
                          </span>
                        </div>
                      </div>

                      <div className="flex gap-2 pt-2">
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button 
                              variant="outline" 
                              size="sm" 
                              className="flex-1"
                              onClick={() => setSelectedDesign(design)}
                            >
                              <Eye className="w-4 h-4 mr-1" />
                              Review
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                            <DialogHeader>
                              <DialogTitle>{design.name}</DialogTitle>
                              <DialogDescription>
                                Design submission by {design.designer?.firstName} {design.designer?.lastName}
                              </DialogDescription>
                            </DialogHeader>
                            {selectedDesign && (
                              <div className="space-y-6">
                                {/* Design Image */}
                                <div className="aspect-video relative bg-muted rounded-lg overflow-hidden">
                                  <Image
                                    src={selectedDesign.imageUrl}
                                    alt={selectedDesign.name}
                                    fill
                                    className="object-cover"
                                    onError={(e) => {
                                      e.currentTarget.src = '/images/placeholder-design.jpg'
                                    }}
                                  />
                                </div>

                                {/* Design Details */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                  <div className="space-y-4">
                                    <div>
                                      <h4 className="font-semibold mb-2">Design Details</h4>
                                      <p className="text-sm text-muted-foreground">
                                        {selectedDesign.description}
                                      </p>
                                    </div>
                                    <div className="flex flex-wrap gap-2">
                                      {selectedDesign.tags?.map((tag) => (
                                        <Badge key={tag} variant="outline">
                                          {tag}
                                        </Badge>
                                      ))}
                                    </div>
                                  </div>

                                  <div className="space-y-4">
                                    <div>
                                      <h4 className="font-semibold mb-2">Financial Analysis</h4>
                                      <div className="space-y-2 text-sm">
                                        <div className="flex justify-between">
                                          <span>Estimated Cost:</span>
                                          <span>$0</span>
                                        </div>
                                        <div className="flex justify-between">
                                          <span>Expected Profit:</span>
                                          <span className="text-green-600">$0</span>
                                        </div>
                                        <div className="flex justify-between">
                                          <span>Market Demand:</span>
                                          <Badge className="bg-yellow-500">
                                            Medium
                                          </Badge>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                </div>

                                {/* Approval Actions */}
                                {!selectedDesign.isApproved && (
                                  <div className="space-y-4 border-t pt-4">
                                    <div>
                                      <label className="text-sm font-medium">Review Comments</label>
                                      <Textarea
                                        placeholder="Add your review comments..."
                                        value={approvalComment}
                                        onChange={(e) => setApprovalComment(e.target.value)}
                                        className="mt-1"
                                      />
                                    </div>
                                    <div className="flex gap-2">
                                      <Button 
                                        onClick={() => handleApprove(selectedDesign.id)}
                                        className="bg-green-600 hover:bg-green-700"
                                      >
                                        <CheckCircle className="w-4 h-4 mr-2" />
                                        Approve Design
                                      </Button>
                                      <Button 
                                        variant="destructive"
                                        onClick={() => handleReject(selectedDesign.id)}
                                      >
                                        <XCircle className="w-4 h-4 mr-2" />
                                        Reject Design
                                      </Button>
                                    </div>
                                  </div>
                                )}
                              </div>
                            )}
                          </DialogContent>
                        </Dialog>

                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="outline" size="sm">
                              <MoreHorizontal className="w-4 h-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem>
                              <Star className="w-4 h-4 mr-2" />
                              Add to Favorites
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <Download className="w-4 h-4 mr-2" />
                              Download Files
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem>
                              <MessageSquare className="w-4 h-4 mr-2" />
                              Message Designer
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {filteredDesigns.length === 0 && (
              <div className="text-center py-12">
                <Clock className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">No designs found</h3>
                <p className="text-muted-foreground">
                  No designs match your current filters.
                </p>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}
