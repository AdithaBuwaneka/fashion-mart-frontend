// src/components/staff/return-processor.tsx
'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { 
  ArrowLeftRight,
  CheckCircle,
  XCircle,
  DollarSign,
  Eye
} from 'lucide-react'
import Link from 'next/link'

interface ReturnItem {
  id: string
  returnNumber: string
  order: {
    id: string
    orderNumber: string
  }
  customer: {
    name: string
    email: string
    id: string
  }
  status: string
  reason: string
  refundAmount: number
  items: Array<{
    id: string
    product: {
      name: string
      image: string
    }
    quantity: number
    reason: string
  }>
  createdAt: string
  requestedRefund: number
  isRefundProcessed: boolean
  processedBy?: string
  processedAt?: string
  rejectionReason?: string
}

interface ReturnProcessorProps {
  returns: ReturnItem[]
  title: string
  description: string
}

export function ReturnProcessor({ returns, title, description }: ReturnProcessorProps) {
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
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          {title}
          <Badge variant="outline">{returns.length} returns</Badge>
        </CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>
        {returns.length === 0 ? (
          <div className="text-center py-8">
            <ArrowLeftRight className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-medium text-muted-foreground mb-2">No returns found</h3>
            <p className="text-sm text-muted-foreground">
              There are no return requests in this category at the moment.
            </p>
          </div>
        ) : (
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
        )}
      </CardContent>
    </Card>
  )
}
