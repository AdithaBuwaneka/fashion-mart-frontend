// src/app/(dashboard)/admin/users/page.tsx
'use client';

import { PermissionCheck } from '@/lib/guards';
import { UserManagement } from '@/components/admin/user-management';

export default function AdminUsersPage() {
  return (
    <PermissionCheck permissions={['manage_users']}>
      <UserManagement />
    </PermissionCheck>
  );
}
