// src/app/(dashboard)/admin/analytics/page.tsx
'use client';

import { PermissionCheck } from '@/lib/guards';
import { AnalyticsCharts } from '@/components/admin/analytics-charts';

export default function AdminAnalyticsPage() {
  return (
    <PermissionCheck permissions={['view_analytics']}>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Analytics Dashboard</h1>
          <p className="text-gray-600 mt-2">
            Detailed analytics and performance metrics
          </p>
        </div>
        <AnalyticsCharts />
      </div>
    </PermissionCheck>
  );
}
