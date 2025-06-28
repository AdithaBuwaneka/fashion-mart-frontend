'use client';

import { RoleGuard } from '@/components/shared/role-guard';

export default function DesignerDashboardPage() {
  return (
    <RoleGuard allowedRoles={['designer']}>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Designer Dashboard</h1>
          <p className="text-gray-600 mt-2">
            Welcome to your design workspace
          </p>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow">
          <p className="text-center text-gray-500">
            Designer dashboard will be implemented here.
          </p>
        </div>
      </div>
    </RoleGuard>
  );
}
