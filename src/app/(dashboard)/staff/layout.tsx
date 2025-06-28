'use client';

import { RoleGuard } from '@/components/shared/role-guard';

export default function StaffLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <RoleGuard allowedRoles={['staff']}>
      {children}
    </RoleGuard>
  );
}