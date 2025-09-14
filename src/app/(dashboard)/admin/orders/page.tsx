// src/app/(dashboard)/admin/orders/page.tsx
'use client';

import { PermissionCheck } from '@/lib/guards';
import { OrderAnalytics } from '@/components/admin/order-analytics';

export default function AdminOrdersPage() {
  return (
    <PermissionCheck permissions={['view_analytics']}>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Order Analytics</h1>
          <p className="text-gray-600 mt-2">
            Comprehensive order analytics and performance metrics
          </p>
        </div>

        <OrderAnalytics />
      </div>
    </PermissionCheck>
  );
}