'use client';

import { PermissionCheck } from '@/lib/guards';
import { notFound } from 'next/navigation';
import { use } from 'react';

interface AdminUserDetailPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default function AdminUserDetailPage({ params }: AdminUserDetailPageProps) {
  const { id } = use(params);

  if (!id) {
    notFound();
  }

  return (
    <PermissionCheck permissions={['manage_users']}>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">User Details</h1>
          <p className="text-gray-600 mt-2">
            Detailed information for user ID: {id}
          </p>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow">
          <p className="text-center text-gray-500">
            User detail page will be implemented here.
          </p>
        </div>
      </div>
    </PermissionCheck>
  );
}
