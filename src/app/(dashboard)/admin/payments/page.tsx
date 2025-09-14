// src/app/(dashboard)/admin/payments/page.tsx
'use client';

import { PermissionCheck } from '@/lib/guards';
import { PaymentManagement } from '@/components/admin/payment-management';

export default function AdminPaymentsPage() {
  return (
    <PermissionCheck permissions={['manage_payments']}>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Payment Management</h1>
          <p className="text-gray-600 mt-2">
            Monitor and manage all payment transactions and refunds
          </p>
        </div>

        <PaymentManagement />
      </div>
    </PermissionCheck>
  );
}