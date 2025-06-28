'use client';

import { RoleGuard } from '@/components/shared/role-guard';

export default function CustomerReturnsPage() {
  return (
    <RoleGuard allowedRoles={['customer']}>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">My Returns</h1>
          <p className="text-gray-600 mt-2">
            View and manage your return requests
          </p>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow">
          <p className="text-center text-gray-500">
            Customer returns page will be implemented here.
          </p>
        </div>
      </div>
    </RoleGuard>
  );
}
