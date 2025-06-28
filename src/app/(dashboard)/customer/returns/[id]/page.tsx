'use client';

import { RoleGuard } from '@/components/shared/role-guard';
import { notFound } from 'next/navigation';
import { use } from 'react';

interface CustomerReturnDetailPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default function CustomerReturnDetailPage({ params }: CustomerReturnDetailPageProps) {
  const { id } = use(params);

  if (!id) {
    notFound();
  }

  return (
    <RoleGuard allowedRoles={['customer']}>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Return Details</h1>
          <p className="text-gray-600 mt-2">
            Return ID: {id}
          </p>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow">
          <p className="text-center text-gray-500">
            Return detail page will be implemented here.
          </p>
        </div>
      </div>
    </RoleGuard>
  );
}
