// src/app/(dashboard)/admin/bill-scanner/page.tsx
'use client';

import { PermissionCheck } from '@/lib/guards';
import { BillScanner } from '@/components/admin/bill-scanner';

export default function AdminBillScannerPage() {
  return (
    <PermissionCheck permissions={['scan_bills']}>
      <BillScanner />
    </PermissionCheck>
  );
}
