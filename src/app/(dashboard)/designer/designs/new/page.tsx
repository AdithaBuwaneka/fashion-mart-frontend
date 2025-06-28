'use client';

import { RoleGuard } from '@/components/shared/role-guard';

export default function NewDesignPage() {
  return (
    <RoleGuard allowedRoles={['designer']}>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Create New Design</h1>
          <p className="text-gray-600 mt-2">
            Upload and create a new design
          </p>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow">
          <p className="text-center text-gray-500">
            New design creation page will be implemented here.
          </p>
        </div>
      </div>
    </RoleGuard>
  );
}
