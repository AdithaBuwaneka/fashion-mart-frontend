'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  TrendingUp, 
  Eye, 
  Download, 
  DollarSign, 
  Star,
  Calendar,
  Users,
  ArrowUpRight,
  ArrowDownRight
} from 'lucide-react';

interface AnalyticsData {
  totalViews: number;
  totalDownloads: number;
  totalSales: number;
  totalRevenue: number;
  averageRating: number;
  topDesigns: Array<{
    id: string;
    name: string;
    views: number;
    sales: number;
    revenue: number;
  }>;
  monthlyStats: Array<{
    month: string;
    views: number;
    sales: number;
    revenue: number;
  }>;
  categoryPerformance: Array<{
    category: string;
    designs: number;
    totalSales: number;
    avgRating: number;
  }>;
}

interface DesignAnalyticsProps {
  data: AnalyticsData;
  period?: 'week' | 'month' | 'year';
  onPeriodChange?: (period: 'week' | 'month' | 'year') => void;
}

export function DesignAnalytics({ 
  data, 
  period = 'month',
  onPeriodChange 
}: DesignAnalyticsProps) {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  const formatNumber = (num: number) => {
    return new Intl.NumberFormat('en-US').format(num);
  };

  const getGrowthIcon = (growth: number) => {
    return growth >= 0 ? (
      <ArrowUpRight className="h-4 w-4 text-green-600" />
    ) : (
      <ArrowDownRight className="h-4 w-4 text-red-600" />
    );
  };

  const getGrowthColor = (growth: number) => {
    return growth >= 0 ? 'text-green-600' : 'text-red-600';
  };

  // Mock growth data - TODO: Calculate from real data
  const growthData = {
    views: 12.5,
    downloads: 8.3,
    sales: 15.7,
    revenue: 23.4
  };

  return (
    <div className="space-y-6">
      {/* Period Selector */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Analytics Dashboard</h2>
          <p className="text-muted-foreground">Track your design performance and earnings</p>
        </div>
        <div className="flex gap-2">
          {(['week', 'month', 'year'] as const).map((p) => (
            <Button
              key={p}
              variant={period === p ? 'default' : 'outline'}
              size="sm"
              onClick={() => onPeriodChange?.(p)}
              className="capitalize"
            >
              {p}
            </Button>
          ))}
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Views</CardTitle>
            <Eye className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatNumber(data.totalViews)}</div>
            <div className={`text-xs flex items-center gap-1 ${getGrowthColor(growthData.views)}`}>
              {getGrowthIcon(growthData.views)}
              +{growthData.views}% from last {period}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Downloads</CardTitle>
            <Download className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatNumber(data.totalDownloads)}</div>
            <div className={`text-xs flex items-center gap-1 ${getGrowthColor(growthData.downloads)}`}>
              {getGrowthIcon(growthData.downloads)}
              +{growthData.downloads}% from last {period}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Sales</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatNumber(data.totalSales)}</div>
            <div className={`text-xs flex items-center gap-1 ${getGrowthColor(growthData.sales)}`}>
              {getGrowthIcon(growthData.sales)}
              +{growthData.sales}% from last {period}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(data.totalRevenue)}</div>
            <div className={`text-xs flex items-center gap-1 ${getGrowthColor(growthData.revenue)}`}>
              {getGrowthIcon(growthData.revenue)}
              +{growthData.revenue}% from last {period}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Performing Designs */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              Top Performing Designs
            </CardTitle>
            <CardDescription>Your best designs this {period}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {data.topDesigns.map((design, index) => (
                <div key={design.id} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                      <span className="text-sm font-bold text-primary">#{index + 1}</span>
                    </div>
                    <div>
                      <h4 className="font-medium text-sm">{design.name}</h4>
                      <p className="text-xs text-muted-foreground">
                        {formatNumber(design.views)} views • {design.sales} sales
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-semibold text-sm">{formatCurrency(design.revenue)}</div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Category Performance */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Star className="h-5 w-5" />
              Category Performance
            </CardTitle>
            <CardDescription>Performance by design category</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {data.categoryPerformance.map((category) => (
                <div key={category.category} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-medium text-sm">{category.category}</span>
                    <Badge variant="secondary">{category.designs} designs</Badge>
                  </div>
                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <span>{category.totalSales} sales</span>
                    <div className="flex items-center gap-1">
                      <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                      <span>{category.avgRating.toFixed(1)}</span>
                    </div>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-1.5">
                    <div 
                      className="bg-primary h-1.5 rounded-full transition-all duration-300"
                      style={{ width: `${(category.totalSales / Math.max(...data.categoryPerformance.map(c => c.totalSales))) * 100}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Monthly Trend Chart Placeholder */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Performance Trends
          </CardTitle>
          <CardDescription>Revenue and views over time</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {data.monthlyStats.map((stat) => (
              <div key={stat.month} className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-primary rounded-full" />
                  <span className="font-medium text-sm">{stat.month}</span>
                </div>
                <div className="flex items-center gap-4 text-sm">
                  <div className="text-center">
                    <div className="font-medium">{formatNumber(stat.views)}</div>
                    <div className="text-xs text-muted-foreground">views</div>
                  </div>
                  <div className="text-center">
                    <div className="font-medium">{stat.sales}</div>
                    <div className="text-xs text-muted-foreground">sales</div>
                  </div>
                  <div className="text-center">
                    <div className="font-medium">{formatCurrency(stat.revenue)}</div>
                    <div className="text-xs text-muted-foreground">revenue</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-4 p-4 bg-muted/50 rounded-lg text-center">
            <p className="text-sm text-muted-foreground">
              📊 Interactive charts coming soon! This will show detailed trend analysis.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
          <CardDescription>Improve your design performance</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Button variant="outline" className="h-auto p-4 flex flex-col items-start">
              <TrendingUp className="h-5 w-5 mb-2" />
              <div className="text-left">
                <div className="font-medium">Optimize Tags</div>
                <div className="text-xs text-muted-foreground">Improve discoverability</div>
              </div>
            </Button>
            <Button variant="outline" className="h-auto p-4 flex flex-col items-start">
              <Star className="h-5 w-5 mb-2" />
              <div className="text-left">
                <div className="font-medium">Request Feedback</div>
                <div className="text-xs text-muted-foreground">Get customer reviews</div>
              </div>
            </Button>
            <Button variant="outline" className="h-auto p-4 flex flex-col items-start">
              <DollarSign className="h-5 w-5 mb-2" />
              <div className="text-left">
                <div className="font-medium">Pricing Analysis</div>
                <div className="text-xs text-muted-foreground">Optimize your pricing</div>
              </div>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}