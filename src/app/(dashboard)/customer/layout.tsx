'use client';

import { CustomerGuard } from '@/lib/guards';

export default function CustomerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <CustomerGuard>
      <div className="min-h-screen bg-gray-50">
        {children}
      </div>
    </CustomerGuard>
  );
}
