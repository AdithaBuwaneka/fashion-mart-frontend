'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { 
  ArrowLeft,
  Package,
  ArrowLeftRight,
  User,
  DollarSign,
  CheckCircle,
  XCircle,
  Clock,
  FileText
} from 'lucide-react';
import { RoleGuard } from '@/components/shared/role-guard';
import Link from 'next/link';
import { use } from 'react';

interface ReturnDetailPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default function ReturnDetailPage({ params }: ReturnDetailPageProps) {
  const { id } = use(params);

  // Mock data - would come from API based on id
  const returnRequest = {
    id: id,
    returnNumber: 'RET-2024-001',
    order: {
      id: 'ORD-001',
      orderNumber: 'ORD-2024-001',
      orderDate: '2024-06-15'
    },
    customer: {
      id: 'cust-1',
      name: 'Alice Johnson',
      email: 'alice@example.com',
      phone: '+1 (555) 123-4567'
    },
    status: 'pending',
    reason: 'Item damaged during shipping',
    description: 'The dress arrived with a tear in the fabric near the hem. The package appeared to be damaged during transit.',
    refundAmount: 89.99,
    requestDate: '2024-06-20T10:30:00Z',
    items: [
      {
        id: 'item-1',
        product: {
          id: 'prod-1',
          name: 'Summer Floral Dress',
          sku: 'SFD-001',
          image: '/images/products/summer-dress.jpg'
        },
        size: 'M',
        color: 'Blue',
        quantity: 1,
        price: 89.99,
        returnQuantity: 1,
        condition: 'damaged'
      }
    ],
    timeline: [
      {
        id: 1,
        action: 'Return requested',
        date: '2024-06-20T10:30:00Z',
        user: 'Alice Johnson (Customer)',
        description: 'Customer submitted return request'
      },
      {
        id: 2,
        action: 'Under review',
        date: '2024-06-20T11:15:00Z',
        user: 'System',
        description: 'Return request received and assigned to staff'
      }
    ]
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'approved':
        return 'bg-green-100 text-green-800';
      case 'rejected':
        return 'bg-red-100 text-red-800';
      case 'processing':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const handleApprove = () => {
    // Handle approval logic
    console.log('Approving return:', id);
  };

  const handleReject = () => {
    // Handle rejection logic
    console.log('Rejecting return:', id);
  };

  return (
    <RoleGuard allowedRoles={['staff']}>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Link href="/dashboard/staff/returns">
              <Button variant="outline" size="sm">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Returns
              </Button>
            </Link>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Return Details</h1>
              <p className="text-gray-600 mt-1">
                {returnRequest.returnNumber} • {returnRequest.order.orderNumber}
              </p>
            </div>
          </div>
          
          <div className="flex items-center space-x-3">
            <Badge className={getStatusColor(returnRequest.status)}>
              {returnRequest.status}
            </Badge>
            {returnRequest.status === 'pending' && (
              <div className="flex space-x-2">
                <Button variant="outline" onClick={handleReject}>
                  <XCircle className="h-4 w-4 mr-2" />
                  Reject
                </Button>
                <Button onClick={handleApprove}>
                  <CheckCircle className="h-4 w-4 mr-2" />
                  Approve
                </Button>
              </div>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Return Information */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <ArrowLeftRight className="h-5 w-5 mr-2" />
                  Return Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-gray-600">Return Number</label>
                    <p className="font-semibold">{returnRequest.returnNumber}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600">Request Date</label>
                    <p className="font-semibold">
                      {new Date(returnRequest.requestDate).toLocaleDateString()}
                    </p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600">Reason</label>
                    <p className="font-semibold">{returnRequest.reason}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600">Refund Amount</label>
                    <p className="font-semibold text-green-600">
                      ${returnRequest.refundAmount.toFixed(2)}
                    </p>
                  </div>
                </div>
                
                <Separator />
                
                <div>
                  <label className="text-sm font-medium text-gray-600">Description</label>
                  <p className="mt-1 text-gray-900">{returnRequest.description}</p>
                </div>
              </CardContent>
            </Card>

            {/* Items to Return */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Package className="h-5 w-5 mr-2" />
                  Items to Return
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {returnRequest.items.map((item) => (
                    <div key={item.id} className="flex items-center space-x-4 p-4 border rounded-lg">
                      <div className="w-16 h-16 bg-gray-200 rounded-md flex items-center justify-center">
                        <Package className="h-8 w-8 text-gray-400" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold">{item.product.name}</h3>
                        <p className="text-sm text-gray-600">SKU: {item.product.sku}</p>
                        <p className="text-sm text-gray-600">
                          Size: {item.size} • Color: {item.color}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold">${item.price.toFixed(2)}</p>
                        <p className="text-sm text-gray-600">Qty: {item.returnQuantity}</p>
                        <Badge 
                          variant={item.condition === 'damaged' ? 'destructive' : 'secondary'}
                          className="mt-1"
                        >
                          {item.condition}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Timeline */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Clock className="h-5 w-5 mr-2" />
                  Return Timeline
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {returnRequest.timeline.map((event) => (
                    <div key={event.id} className="flex items-start space-x-3">
                      <div className="flex-shrink-0">
                        <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                          <div className="w-3 h-3 bg-blue-500 rounded-full" />
                        </div>
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <h3 className="font-semibold">{event.action}</h3>
                          <span className="text-sm text-gray-500">
                            {new Date(event.date).toLocaleDateString()}
                          </span>
                        </div>
                        <p className="text-sm text-gray-600">{event.description}</p>
                        <p className="text-xs text-gray-500 mt-1">by {event.user}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Customer Information */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <User className="h-5 w-5 mr-2" />
                  Customer Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <label className="text-sm font-medium text-gray-600">Name</label>
                  <p className="font-semibold">{returnRequest.customer.name}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">Email</label>
                  <p className="font-semibold">{returnRequest.customer.email}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">Phone</label>
                  <p className="font-semibold">{returnRequest.customer.phone}</p>
                </div>
                <Separator />
                <Link href={`/dashboard/staff/customers/${returnRequest.customer.id}`}>
                  <Button variant="outline" size="sm" className="w-full">
                    View Customer Profile
                  </Button>
                </Link>
              </CardContent>
            </Card>

            {/* Original Order */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <FileText className="h-5 w-5 mr-2" />
                  Original Order
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <label className="text-sm font-medium text-gray-600">Order Number</label>
                  <p className="font-semibold">{returnRequest.order.orderNumber}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">Order Date</label>
                  <p className="font-semibold">
                    {new Date(returnRequest.order.orderDate).toLocaleDateString()}
                  </p>
                </div>
                <Separator />
                <Link href={`/dashboard/staff/orders/${returnRequest.order.id}`}>
                  <Button variant="outline" size="sm" className="w-full">
                    View Original Order
                  </Button>
                </Link>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Button variant="outline" size="sm" className="w-full">
                  <FileText className="h-4 w-4 mr-2" />
                  Generate Return Label
                </Button>
                <Button variant="outline" size="sm" className="w-full">
                  <DollarSign className="h-4 w-4 mr-2" />
                  Process Refund
                </Button>
                <Button variant="outline" size="sm" className="w-full">
                  Contact Customer
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </RoleGuard>
  );
}