'use client';

import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { ordersApi } from '@/lib/api/orders';
import { OrderStatus } from '@/lib/types';
import { OrderHistory } from '@/components/customer/order-history';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { 
  Search, 
  Package,
  ArrowLeft
} from 'lucide-react';
import Link from 'next/link';

export default function OrdersPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<OrderStatus | 'all'>('all');

  // Fetch orders from API
  const { data: ordersData, isLoading } = useQuery({
    queryKey: ['customer-orders'],
    queryFn: () => ordersApi.getOrders(1, 50)
  });

  const orders = ordersData?.orders || [];

  // Filter orders based on search and status
  const filteredOrders = orders.filter(order => {
    const matchesSearch = searchQuery === '' || 
      order.orderNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.items.some(item => 
        item.product.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
    
    const matchesStatus = statusFilter === 'all' || order.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  const orderStatusCounts = {
    all: orders.length,
    pending: orders.filter(o => o.status === 'pending').length,
    confirmed: orders.filter(o => o.status === 'confirmed').length,
    processing: orders.filter(o => o.status === 'processing').length,
    shipped: orders.filter(o => o.status === 'shipped').length,
    delivered: orders.filter(o => o.status === 'delivered').length,
    cancelled: orders.filter(o => o.status === 'cancelled').length,
    returned: orders.filter(o => o.status === 'returned').length
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Header */}
        <div className="flex items-center gap-4 mb-6">
          <Button variant="ghost" size="sm" asChild>
            <Link href="/customer/dashboard">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Dashboard
            </Link>
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Order History</h1>
            <p className="text-gray-600">
              Track and manage your orders
            </p>
          </div>
        </div>

        {/* Search and Filters */}
        <Card className="mb-6">
          <CardContent className="p-6">
            <div className="flex flex-col sm:flex-row gap-4">
              {/* Search */}
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Search orders or products..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>

              {/* Status Filter */}
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value as OrderStatus | 'all')}
                className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">All Orders ({orderStatusCounts.all})</option>
                <option value="pending">Pending ({orderStatusCounts.pending})</option>
                <option value="confirmed">Confirmed ({orderStatusCounts.confirmed})</option>
                <option value="processing">Processing ({orderStatusCounts.processing})</option>
                <option value="shipped">Shipped ({orderStatusCounts.shipped})</option>
                <option value="delivered">Delivered ({orderStatusCounts.delivered})</option>
                <option value="cancelled">Cancelled ({orderStatusCounts.cancelled})</option>
                <option value="returned">Returned ({orderStatusCounts.returned})</option>
              </select>
            </div>

            {/* Active Filters */}
            {(searchQuery || statusFilter !== 'all') && (
              <div className="flex flex-wrap gap-2 mt-4">
                {searchQuery && (
                  <Badge variant="secondary" className="gap-1">
                    Search: &quot;{searchQuery}&quot;
                    <button onClick={() => setSearchQuery('')}>
                      ×
                    </button>
                  </Badge>
                )}
                {statusFilter !== 'all' && (
                  <Badge variant="secondary" className="gap-1">
                    Status: {statusFilter}
                    <button onClick={() => setStatusFilter('all')}>
                      ×
                    </button>
                  </Badge>
                )}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Orders List */}
        {filteredOrders.length === 0 ? (
          <div className="text-center py-12">
            <Package className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              {searchQuery || statusFilter !== 'all' ? 'No orders found' : 'No orders yet'}
            </h3>
            <p className="text-gray-600 mb-4">
              {searchQuery || statusFilter !== 'all'
                ? 'Try adjusting your search or filter criteria'
                : 'When you place your first order, it will appear here'
              }
            </p>
            {searchQuery || statusFilter !== 'all' ? (
              <Button onClick={() => {
                setSearchQuery('');
                setStatusFilter('all');
              }}>
                Clear Filters
              </Button>
            ) : (
              <Button asChild>
                <Link href="/customer/products">
                  Start Shopping
                </Link>
              </Button>
            )}
          </div>
        ) : (
          <OrderHistory orders={filteredOrders} />
        )}
      </div>
    </div>
  );
}
