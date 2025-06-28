// src/app/(dashboard)/admin/reports/page.tsx
'use client';

import { PermissionCheck } from '@/lib/guards';
import { ReportsGenerator } from '@/components/admin/reports-generator';

export default function AdminReportsPage() {
  return (
    <PermissionCheck permissions={['generate_reports']}>
      <ReportsGenerator />
    </PermissionCheck>
  );
}
