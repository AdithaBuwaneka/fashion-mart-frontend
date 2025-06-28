'use client';

import { RoleGuard } from '@/components/shared/role-guard';

export default function DesignerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <RoleGuard allowedRoles={['designer']}>
      {children}
    </RoleGuard>
  );
}