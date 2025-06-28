'use client';

// Force dynamic rendering to prevent build-time prerendering issues
export const dynamic = 'force-dynamic'

import { RoleGuard } from '@/components/shared/role-guard';

export default function InventoryLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <RoleGuard allowedRoles={['inventory']}>
      {children}
    </RoleGuard>
  );
}
