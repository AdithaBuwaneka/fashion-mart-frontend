'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Order, OrderStatus } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Package, 
  Truck, 
  CheckCircle, 
  Clock, 
  XCircle,
  Eye,
  RotateCcw,
  ExternalLink
} from 'lucide-react';

interface OrderHistoryProps {
  orders: Order[];
  onRequestReturn?: (orderId: string) => void;
}

export function OrderHistory({ 
  orders, 
  onRequestReturn 
}: OrderHistoryProps) {
  const [expandedOrders, setExpandedOrders] = useState<Set<string>>(new Set());

  const toggleOrderExpansion = (orderId: string) => {
    setExpandedOrders(prev => {
      const newSet = new Set(prev);
      if (newSet.has(orderId)) {
        newSet.delete(orderId);
      } else {
        newSet.add(orderId);
      }
      return newSet;
    });
  };

  const getStatusIcon = (status: OrderStatus) => {
    switch (status) {
      case 'pending':
        return <Clock className="h-4 w-4" />;
      case 'confirmed':
        return <CheckCircle className="h-4 w-4" />;
      case 'processing':
        return <Package className="h-4 w-4" />;
      case 'shipped':
        return <Truck className="h-4 w-4" />;
      case 'delivered':
        return <CheckCircle className="h-4 w-4" />;
      case 'cancelled':
        return <XCircle className="h-4 w-4" />;
      case 'returned':
        return <RotateCcw className="h-4 w-4" />;
      default:
        return <Package className="h-4 w-4" />;
    }
  };

  const getStatusColor = (status: OrderStatus) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'confirmed':
        return 'bg-blue-100 text-blue-800';
      case 'processing':
        return 'bg-purple-100 text-purple-800';
      case 'shipped':
        return 'bg-indigo-100 text-indigo-800';
      case 'delivered':
        return 'bg-green-100 text-green-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      case 'returned':
        return 'bg-orange-100 text-orange-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const canRequestReturn = (order: Order) => {
    // Can return within 7 days of delivery
    if (order.status !== 'delivered') return false;
    
    const deliveryDate = new Date(order.updatedAt);
    const now = new Date();
    const daysDiff = Math.floor((now.getTime() - deliveryDate.getTime()) / (1000 * 60 * 60 * 24));
    
    return daysDiff <= 7;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  if (orders.length === 0) {
    return (
      <div className="text-center py-12">
        <Package className="h-12 w-12 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">No orders found</h3>
        <p className="text-gray-600">Orders will appear here once you make a purchase</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {orders.map((order) => {
        const isExpanded = expandedOrders.has(order.id);
        
        return (
          <Card key={order.id} className="overflow-hidden">
            <CardContent className="p-0">
              {/* Order Header */}
              <div className="p-6 border-b bg-gray-50">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="flex items-center gap-4">
                    <div className="flex-shrink-0">
                      {getStatusIcon(order.status)}
                    </div>
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-semibold">{order.orderNumber}</h3>
                        <Badge className={getStatusColor(order.status)}>
                          {order.status}
                        </Badge>
                      </div>
                      <p className="text-sm text-gray-600">
                        Placed on {formatDate(order.createdAt)} • {order.items.length} item{order.items.length !== 1 ? 's' : ''}
                      </p>
                      {order.trackingNumber && (
                        <p className="text-sm text-blue-600">
                          Tracking: {order.trackingNumber}
                        </p>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <div className="text-right mr-4">
                      <p className="font-semibold">${order.totalAmount.toFixed(2)}</p>
                      {order.estimatedDelivery && order.status === 'shipped' && (
                        <p className="text-sm text-gray-600">
                          Est. delivery: {formatDate(order.estimatedDelivery)}
                        </p>
                      )}
                    </div>
                    
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => toggleOrderExpansion(order.id)}
                      >
                        <Eye className="h-4 w-4 mr-1" />
                        {isExpanded ? 'Hide' : 'View'} Details
                      </Button>
                      
                      {canRequestReturn(order) && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => onRequestReturn?.(order.id)}
                          className="text-orange-600 hover:text-orange-700"
                        >
                          <RotateCcw className="h-4 w-4 mr-1" />
                          Return
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Order Details (Expanded) */}
              {isExpanded && (
                <div className="p-6 space-y-6">
                  {/* Order Items */}
                  <div>
                    <h4 className="font-medium mb-4">Order Items</h4>
                    <div className="space-y-3">
                      {order.items.map((item) => (
                        <div key={item.id} className="flex items-center gap-4 p-3 border rounded-lg">
                          <div className="w-16 h-16 bg-gray-100 rounded-md overflow-hidden flex-shrink-0">
                            <Image
                              src={item.product.images[0] || '/images/placeholder-product.jpg'}
                              alt={item.product.name}
                              width={64}
                              height={64}
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <div className="flex-1 min-w-0">
                            <Link 
                              href={`/customer/products/${item.product.id}`}
                              className="font-medium hover:text-blue-600 transition-colors flex items-center gap-1"
                            >
                              {item.product.name}
                              <ExternalLink className="h-3 w-3" />
                            </Link>
                            <p className="text-sm text-gray-600 mt-1">
                              Size: {item.size} • Color: {item.color} • Qty: {item.quantity}
                            </p>
                          </div>
                          <div className="text-right">
                            <p className="font-medium">${(item.price * item.quantity).toFixed(2)}</p>
                            <p className="text-sm text-gray-600">${item.price.toFixed(2)} each</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Shipping Address */}
                  <div>
                    <h4 className="font-medium mb-2">Shipping Address</h4>
                    <div className="p-3 bg-gray-50 rounded-lg text-sm">
                      <p>{order.shippingAddress.street}</p>
                      <p>
                        {order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.zipCode}
                      </p>
                      <p>{order.shippingAddress.country}</p>
                    </div>
                  </div>

                  {/* Order Timeline */}
                  {order.status !== 'pending' && (
                    <div>
                      <h4 className="font-medium mb-4">Order Timeline</h4>
                      <div className="space-y-3">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 bg-green-100 text-green-600 rounded-full flex items-center justify-center flex-shrink-0">
                            <CheckCircle className="h-4 w-4" />
                          </div>
                          <div>
                            <p className="font-medium">Order Placed</p>
                            <p className="text-sm text-gray-600">{formatDate(order.createdAt)}</p>
                          </div>
                        </div>
                        
                        {['confirmed', 'processing', 'shipped', 'delivered'].includes(order.status) && (
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center flex-shrink-0">
                              <CheckCircle className="h-4 w-4" />
                            </div>
                            <div>
                              <p className="font-medium">Order Confirmed</p>
                              <p className="text-sm text-gray-600">Processing started</p>
                            </div>
                          </div>
                        )}

                        {['shipped', 'delivered'].includes(order.status) && (
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 bg-purple-100 text-purple-600 rounded-full flex items-center justify-center flex-shrink-0">
                              <Truck className="h-4 w-4" />
                            </div>
                            <div>
                              <p className="font-medium">Order Shipped</p>
                              <p className="text-sm text-gray-600">
                                Tracking: {order.trackingNumber}
                              </p>
                            </div>
                          </div>
                        )}

                        {order.status === 'delivered' && (
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 bg-green-100 text-green-600 rounded-full flex items-center justify-center flex-shrink-0">
                              <CheckCircle className="h-4 w-4" />
                            </div>
                            <div>
                              <p className="font-medium">Order Delivered</p>
                              <p className="text-sm text-gray-600">{formatDate(order.updatedAt)}</p>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
