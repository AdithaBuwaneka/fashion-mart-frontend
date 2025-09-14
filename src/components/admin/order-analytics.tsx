'use client';

import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { ordersApi } from '@/lib/api/orders';
import type { OrderAnalytics } from '@/lib/api/orders';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  Legend
} from 'recharts';
import {
  TrendingUp,
  DollarSign,
  ShoppingCart,
  Users,
  Download,
  Package,
  ArrowUpRight,
  ArrowDownRight
} from 'lucide-react';
import { LoadingScreen } from '@/components/shared/loading-screen';
import { toast } from 'sonner';
import { format, subDays } from 'date-fns';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

interface DateRangeState {
  startDate: string;
  endDate: string;
  preset: 'today' | '7days' | '30days' | '90days' | 'custom';
}

export function OrderAnalytics() {
  const today = new Date();
  const [dateRange, setDateRange] = useState<DateRangeState>({
    startDate: format(subDays(today, 30), 'yyyy-MM-dd'),
    endDate: format(today, 'yyyy-MM-dd'),
    preset: '30days'
  });

  // Get order analytics data
  const { data: analytics, isLoading, error, refetch } = useQuery({
    queryKey: ['order-analytics', dateRange.startDate, dateRange.endDate],
    queryFn: () => ordersApi.getOrderAnalytics(dateRange.startDate, dateRange.endDate),
    refetchInterval: 60000, // Refresh every minute
  });

  const handlePresetChange = (preset: DateRangeState['preset']) => {
    const end = new Date();
    let start = new Date();

    switch (preset) {
      case 'today':
        start = new Date();
        break;
      case '7days':
        start = subDays(end, 7);
        break;
      case '30days':
        start = subDays(end, 30);
        break;
      case '90days':
        start = subDays(end, 90);
        break;
      default:
        return; // Don't change dates for custom
    }

    setDateRange({
      startDate: format(start, 'yyyy-MM-dd'),
      endDate: format(end, 'yyyy-MM-dd'),
      preset
    });
  };

  const handleExportAnalytics = async (format: 'csv' | 'pdf' | 'excel') => {
    try {
      const blob = await ordersApi.exportOrders(format, {
        startDate: dateRange.startDate,
        endDate: dateRange.endDate
      });

      // Create download link
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `order-analytics-${dateRange.startDate}-to-${dateRange.endDate}.${format}`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);

      toast.success(`Analytics exported successfully as ${format.toUpperCase()}`);
    } catch (err) {
      console.error('Export error:', err);
      toast.error('Failed to export analytics');
    }
  };

  if (isLoading) {
    return <LoadingScreen />;
  }

  if (error || !analytics) {
    return (
      <div className="text-center p-8 text-red-600">
        {error && (() => { console.error('Analytics loading error:', error); return null; })()}
        Error loading analytics data
        <Button
          variant="outline"
          onClick={() => refetch()}
          className="ml-4"
        >
          Retry
        </Button>
      </div>
    );
  }

  // Use growth rates from backend data
  const revenueGrowth = analytics.growthRates?.revenue || 0;
  const orderGrowth = analytics.growthRates?.orders || 0;
  const customerGrowth = analytics.growthRates?.customers || 0;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Order Analytics</h2>
          <p className="text-gray-600 mt-1">Comprehensive order and sales analytics</p>
        </div>

        <div className="flex gap-2">
          <Select value={dateRange.preset} onValueChange={handlePresetChange}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="today">Today</SelectItem>
              <SelectItem value="7days">Last 7 Days</SelectItem>
              <SelectItem value="30days">Last 30 Days</SelectItem>
              <SelectItem value="90days">Last 90 Days</SelectItem>
              <SelectItem value="custom">Custom</SelectItem>
            </SelectContent>
          </Select>

          <Button
            variant="outline"
            onClick={() => handleExportAnalytics('csv')}
          >
            <Download className="h-4 w-4 mr-2" />
            Export CSV
          </Button>

          <Button
            variant="outline"
            onClick={() => handleExportAnalytics('pdf')}
          >
            <Download className="h-4 w-4 mr-2" />
            Export PDF
          </Button>
        </div>
      </div>

      {/* Date Range Inputs for Custom */}
      {dateRange.preset === 'custom' && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Custom Date Range</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Start Date</Label>
                <Input
                  type="date"
                  value={dateRange.startDate}
                  onChange={(e) =>
                    setDateRange(prev => ({ ...prev, startDate: e.target.value }))
                  }
                />
              </div>
              <div className="space-y-2">
                <Label>End Date</Label>
                <Input
                  type="date"
                  value={dateRange.endDate}
                  onChange={(e) =>
                    setDateRange(prev => ({ ...prev, endDate: e.target.value }))
                  }
                />
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${analytics.totalRevenue.toLocaleString()}</div>
            <div className="flex items-center text-xs text-muted-foreground">
              {revenueGrowth > 0 ? (
                <ArrowUpRight className="h-4 w-4 text-green-500" />
              ) : (
                <ArrowDownRight className="h-4 w-4 text-red-500" />
              )}
              <span className={revenueGrowth > 0 ? 'text-green-500' : 'text-red-500'}>
                {Math.abs(revenueGrowth)}%
              </span>
              <span className="ml-1">vs previous period</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Orders</CardTitle>
            <ShoppingCart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analytics.totalOrders.toLocaleString()}</div>
            <div className="flex items-center text-xs text-muted-foreground">
              {orderGrowth > 0 ? (
                <ArrowUpRight className="h-4 w-4 text-green-500" />
              ) : (
                <ArrowDownRight className="h-4 w-4 text-red-500" />
              )}
              <span className={orderGrowth > 0 ? 'text-green-500' : 'text-red-500'}>
                {Math.abs(orderGrowth)}%
              </span>
              <span className="ml-1">vs previous period</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Order Value</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${analytics.averageOrderValue.toFixed(2)}</div>
            <p className="text-xs text-muted-foreground">Per order average</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Customers</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{Array.isArray(analytics.topCustomers) ? analytics.topCustomers.length : 0}</div>
            <div className="flex items-center text-xs text-muted-foreground">
              <ArrowUpRight className="h-4 w-4 text-green-500" />
              <span className="text-green-500">{customerGrowth}%</span>
              <span className="ml-1">vs previous period</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts Row 1 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Sales Trend Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Sales Trend</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={Array.isArray(analytics.salesByDate) ? analytics.salesByDate : []}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis
                  dataKey="date"
                  tickFormatter={(value) => format(new Date(value), 'MMM dd')}
                />
                <YAxis yAxisId="revenue" orientation="left" />
                <YAxis yAxisId="orders" orientation="right" />
                <Tooltip
                  labelFormatter={(value) => format(new Date(value), 'MMM dd, yyyy')}
                  formatter={(value: number, name: string) => [
                    name === 'revenue' ? `$${value.toLocaleString()}` : value.toLocaleString(),
                    name === 'revenue' ? 'Revenue' : 'Orders'
                  ]}
                />
                <Legend />
                <Line
                  yAxisId="revenue"
                  type="monotone"
                  dataKey="revenue"
                  stroke="#8884d8"
                  strokeWidth={2}
                  name="Revenue"
                />
                <Line
                  yAxisId="orders"
                  type="monotone"
                  dataKey="orders"
                  stroke="#82ca9d"
                  strokeWidth={2}
                  name="Orders"
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Order Status Distribution */}
        <Card>
          <CardHeader>
            <CardTitle>Order Status Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={Array.isArray(analytics.ordersByStatus) ? analytics.ordersByStatus : []}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={(entry) => `${entry.status}: ${entry.percentage}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="count"
                >
                  {Array.isArray(analytics.ordersByStatus) ? analytics.ordersByStatus.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  )) : null}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Charts Row 2 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Selling Products */}
        <Card>
          <CardHeader>
            <CardTitle>Top Selling Products</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {Array.isArray(analytics.topProducts) ? analytics.topProducts.slice(0, 5).map((product, index) => (
                <div key={product.productId} className="flex items-center space-x-4">
                  <div className="flex-shrink-0 w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                    <span className="text-sm font-medium text-blue-600">{index + 1}</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">
                      {product.productName}
                    </p>
                    <p className="text-sm text-gray-500">
                      {product.quantitySold} sold • ${product.revenue.toLocaleString()} revenue
                    </p>
                  </div>
                  <div className="flex-shrink-0">
                    <Package className="h-5 w-5 text-gray-400" />
                  </div>
                </div>
              )) : null}
            </div>
          </CardContent>
        </Card>

        {/* Top Customers */}
        <Card>
          <CardHeader>
            <CardTitle>Top Customers</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {Array.isArray(analytics.topCustomers) ? analytics.topCustomers.slice(0, 5).map((customer, index) => (
                <div key={customer.customerId} className="flex items-center space-x-4">
                  <div className="flex-shrink-0 w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                    <span className="text-sm font-medium text-green-600">{index + 1}</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">
                      {customer.customerName}
                    </p>
                    <p className="text-sm text-gray-500">
                      {customer.totalOrders} orders • ${customer.totalSpent.toLocaleString()} spent
                    </p>
                  </div>
                  <div className="flex-shrink-0">
                    <Users className="h-5 w-5 text-gray-400" />
                  </div>
                </div>
              )) : null}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}