'use client';

import { useQuery } from '@tanstack/react-query';
import { apiClient } from '@/lib/api/config';
import { DashboardStats as DashboardStatsType } from '@/lib/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  TrendingUp, 
  TrendingDown,
  DollarSign,
  ShoppingCart,
  Users,
  Package,
  AlertTriangle,
  RotateCcw
} from 'lucide-react';
import { LoadingScreen } from '@/components/shared/loading-screen';

export function DashboardStats() {
  const { data: stats, isLoading, error } = useQuery({
    queryKey: ['admin-dashboard-stats'],
    queryFn: async (): Promise<DashboardStatsType> => {
      const response = await apiClient.get('/admin/dashboard');
      return response.data;
    },
    refetchInterval: 30000, // Refresh every 30 seconds
  });

  if (isLoading) {
    return <LoadingScreen />;
  }

  if (error || !stats) {
    return (
      <div className="text-center p-8 text-red-600">
        Error loading dashboard statistics
      </div>
    );
  }

  const statCards = [
    {
      title: 'Total Revenue',
      value: `$${stats.totalRevenue.toLocaleString()}`,
      icon: DollarSign,
      trend: stats.revenueGrowth,
      color: 'bg-green-500',
    },
    {
      title: 'Total Orders',
      value: stats.totalOrders.toLocaleString(),
      icon: ShoppingCart,
      trend: stats.orderGrowth,
      color: 'bg-blue-500',
    },
    {
      title: 'Total Customers',
      value: stats.totalCustomers.toLocaleString(),
      icon: Users,
      trend: 0, // Assuming no trend data for customers
      color: 'bg-purple-500',
    },
    {
      title: 'Total Products',
      value: stats.totalProducts.toLocaleString(),
      icon: Package,
      trend: 0,
      color: 'bg-indigo-500',
    },
    {
      title: 'Low Stock Items',
      value: stats.lowStockItems.toString(),
      icon: AlertTriangle,
      trend: 0,
      color: 'bg-yellow-500',
      isAlert: true,
    },
    {
      title: 'Pending Returns',
      value: stats.pendingReturns.toString(),
      icon: RotateCcw,
      trend: 0,
      color: 'bg-red-500',
      isAlert: true,
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {statCards.map((stat, index) => (
        <Card key={index} className="hover:shadow-lg transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              {stat.title}
            </CardTitle>
            <div className={`${stat.color} p-2 rounded-lg`}>
              <stat.icon className="h-4 w-4 text-white" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900">
              {stat.value}
            </div>
            {stat.trend !== 0 && (
              <div className="flex items-center mt-2">
                {stat.trend > 0 ? (
                  <TrendingUp className="h-4 w-4 text-green-600 mr-1" />
                ) : (
                  <TrendingDown className="h-4 w-4 text-red-600 mr-1" />
                )}
                <span
                  className={`text-sm font-medium ${
                    stat.trend > 0 ? 'text-green-600' : 'text-red-600'
                  }`}
                >
                  {Math.abs(stat.trend)}%
                </span>
                <span className="text-sm text-gray-500 ml-1">from last month</span>
              </div>
            )}
            {stat.isAlert && parseInt(stat.value) > 0 && (
              <div className="text-sm text-yellow-600 mt-2">
                Requires attention
              </div>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
