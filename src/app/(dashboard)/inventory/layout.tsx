'use client';

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
