// src/app/(dashboard)/designer/analytics/page.tsx
'use client'

import { useState } from 'react';
import { DesignAnalytics } from '@/components/designer/design-analytics';

// Mock analytics data - TODO: Replace with API calls
const mockAnalyticsData = {
  totalViews: 2847,
  totalDownloads: 523,
  totalSales: 89,
  totalRevenue: 3420.50,
  averageRating: 4.6,
  topDesigns: [
    {
      id: '1',
      name: 'Geometric Abstract Pattern',
      views: 234,
      sales: 12,
      revenue: 480.00
    },
    {
      id: '2',
      name: 'Vintage Floral Collection',
      views: 187,
      sales: 8,
      revenue: 320.00
    },
    {
      id: '3',
      name: 'Minimalist Lines',
      views: 156,
      sales: 6,
      revenue: 240.00
    },
    {
      id: '4',
      name: 'Urban Street Art',
      views: 89,
      sales: 3,
      revenue: 120.00
    }
  ],
  monthlyStats: [
    { month: 'June 2024', views: 1247, sales: 23, revenue: 920.00 },
    { month: 'May 2024', views: 1156, sales: 19, revenue: 760.00 },
    { month: 'April 2024', views: 987, sales: 16, revenue: 640.00 },
    { month: 'March 2024', views: 823, sales: 14, revenue: 560.00 },
    { month: 'February 2024', views: 756, sales: 12, revenue: 480.00 },
    { month: 'January 2024', views: 634, sales: 8, revenue: 320.00 }
  ],
  categoryPerformance: [
    {
      category: 'Fashion Apparel',
      designs: 8,
      totalSales: 34,
      avgRating: 4.8
    },
    {
      category: 'Textile Patterns',
      designs: 6,
      totalSales: 28,
      avgRating: 4.6
    },
    {
      category: 'Graphic Designs',
      designs: 4,
      totalSales: 15,
      avgRating: 4.4
    },
    {
      category: 'Accessories',
      designs: 3,
      totalSales: 12,
      avgRating: 4.2
    }
  ]
};

export default function DesignerAnalyticsPage() {
  const [period, setPeriod] = useState<'week' | 'month' | 'year'>('month');

  const handlePeriodChange = (newPeriod: 'week' | 'month' | 'year') => {
    setPeriod(newPeriod);
    // TODO: Fetch new data based on period
    console.log('Fetching analytics for period:', newPeriod);
  };

  return (
    <div className="container mx-auto px-4 py-6">
      <DesignAnalytics 
        data={mockAnalyticsData}
        period={period}
        onPeriodChange={handlePeriodChange}
      />
    </div>
  );
}
