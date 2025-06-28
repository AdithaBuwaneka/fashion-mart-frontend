// src/app/(dashboard)/admin/page.tsx
'use client';

import { PermissionCheck } from '@/lib/guards';
import { DashboardStats } from '@/components/admin/dashboard-stats';
import { AnalyticsCharts } from '@/components/admin/analytics-charts';
import { RecentActivity } from '@/components/admin/recent-activity';
import { QuickActions } from '@/components/admin/quick-actions';

export default function AdminDashboard() {
  return (
    <PermissionCheck permissions={['view_analytics']}>
      <div className="space-y-6">
        {/* Page Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
            <p className="text-gray-600 mt-2">
              Overview of your Fashion Mart business performance
            </p>
          </div>
          <QuickActions />
        </div>

        {/* Dashboard Stats */}
        <DashboardStats />

        {/* Analytics Charts */}
        <AnalyticsCharts />

        {/* Recent Activity */}
        <RecentActivity />
      </div>
    </PermissionCheck>
  );
}
