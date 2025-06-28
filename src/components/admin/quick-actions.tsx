'use client';

import { Button } from '@/components/ui/button';
import { 
  Users, 
  FileText, 
  Scan, 
  BarChart3
} from 'lucide-react';
import Link from 'next/link';

export function QuickActions() {
  const actions = [
    {
      label: 'Manage Users',
      href: '/admin/users',
      icon: Users,
      color: 'bg-blue-500',
    },
    {
      label: 'Generate Report',
      href: '/admin/reports',
      icon: FileText,
      color: 'bg-green-500',
    },
    {
      label: 'Scan Bills',
      href: '/admin/bill-scanner',
      icon: Scan,
      color: 'bg-purple-500',
    },
    {
      label: 'Analytics',
      href: '/admin/analytics',
      icon: BarChart3,
      color: 'bg-orange-500',
    },
  ];

  return (
    <div className="flex gap-2">
      {actions.map((action) => (
        <Link key={action.href} href={action.href}>
          <Button variant="outline" size="sm" className="flex items-center gap-2">
            <action.icon className="h-4 w-4" />
            {action.label}
          </Button>
        </Link>
      ))}
    </div>
  );
}
