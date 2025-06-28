'use client';

import { useState, useEffect } from 'react';
import { Order, OrderStatus } from '@/lib/types';
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
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<OrderStatus | 'all'>('all');

  // Mock data - TODO: Replace with API calls
  useEffect(() => {
    const mockOrders: Order[] = [
      {
        id: '1',
        customerId: '1',
        customer: {
          id: '1',
          clerkId: 'user_1',
          email: 'customer@example.com',
          firstName: 'John',
          lastName: 'Doe',
          role: 'customer',
          isActive: true,
          createdAt: '2025-06-01T00:00:00Z',
          updatedAt: '2025-06-25T00:00:00Z'
        },
        orderNumber: 'FM-001234',
        status: 'delivered',
        totalAmount: 179.98,
        shippingAddress: {
          street: '123 Main St',
          city: 'New York',
          state: 'NY',
          zipCode: '10001',
          country: 'United States'
        },
        billingAddress: {
          street: '123 Main St',
          city: 'New York',
          state: 'NY',
          zipCode: '10001',
          country: 'United States'
        },
        items: [
          {
            id: '1',
            orderId: '1',
            productId: '1',
            product: {
              id: '1',
              name: 'Elegant Summer Dress',
              description: 'A beautiful flowing dress perfect for summer occasions',
              price: 89.99,
              categoryId: '1',
              category: { id: '1', name: 'Dresses', isActive: true },
              images: ['/images/products/dress1.jpg'],
              sizes: [],
              colors: [],
              isActive: true,
              createdAt: '2025-06-01T00:00:00Z',
              updatedAt: '2025-06-25T00:00:00Z',
              stock: []
            },
            quantity: 2,
            price: 89.99,
            size: 'M',
            color: 'Blue'
          }
        ],
        createdAt: '2025-06-20T10:30:00Z',
        updatedAt: '2025-06-25T14:20:00Z',
        estimatedDelivery: '2025-06-27T00:00:00Z',
        trackingNumber: 'TRK123456789'
      },
      {
        id: '2',
        customerId: '1',
        customer: {
          id: '1',
          clerkId: 'user_1',
          email: 'customer@example.com',
          firstName: 'John',
          lastName: 'Doe',
          role: 'customer',
          isActive: true,
          createdAt: '2025-06-01T00:00:00Z',
          updatedAt: '2025-06-25T00:00:00Z'
        },
        orderNumber: 'FM-001235',
        status: 'shipped',
        totalAmount: 59.98,
        shippingAddress: {
          street: '123 Main St',
          city: 'New York',
          state: 'NY',
          zipCode: '10001',
          country: 'United States'
        },
        billingAddress: {
          street: '123 Main St',
          city: 'New York',
          state: 'NY',
          zipCode: '10001',
          country: 'United States'
        },
        items: [
          {
            id: '2',
            orderId: '2',
            productId: '2',
            product: {
              id: '2',
              name: 'Casual Cotton T-Shirt',
              description: 'Comfortable everyday cotton t-shirt',
              price: 29.99,
              categoryId: '2',
              category: { id: '2', name: 'T-Shirts', isActive: true },
              images: ['/images/products/tshirt1.jpg'],
              sizes: [],
              colors: [],
              isActive: true,
              createdAt: '2025-06-01T00:00:00Z',
              updatedAt: '2025-06-25T00:00:00Z',
              stock: []
            },
            quantity: 2,
            price: 29.99,
            size: 'L',
            color: 'White'
          }
        ],
        createdAt: '2025-06-22T14:15:00Z',
        updatedAt: '2025-06-24T09:45:00Z',
        estimatedDelivery: '2025-06-28T00:00:00Z',
        trackingNumber: 'TRK987654321'
      }
    ];

    setTimeout(() => {
      setOrders(mockOrders);
      setLoading(false);
    }, 1000);
  }, []);

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

  if (loading) {
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
