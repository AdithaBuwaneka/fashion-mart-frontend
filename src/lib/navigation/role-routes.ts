// src/lib/navigation/role-routes.ts
import { UserRole } from '@/lib/types'

export interface NavItem {
  title: string
  href: string
  icon?: string
  description?: string
  children?: NavItem[]
}

export const roleBasedRoutes: Record<UserRole, NavItem[]> = {
  admin: [
    {
      title: 'Dashboard',
      href: '/admin/dashboard',
      icon: 'BarChart3',
      description: 'Overview and analytics'
    },
    {
      title: 'User Management',
      href: '/admin/users',
      icon: 'Users',
      description: 'Manage system users'
    },
    {
      title: 'Reports',
      href: '/admin/reports',
      icon: 'FileText',
      description: 'Generate and view reports'
    },
    {
      title: 'Settings',
      href: '/admin/settings',
      icon: 'Settings',
      description: 'System configuration'
    }
  ],
  customer: [
    {
      title: 'Shop',
      href: '/customer/products',
      icon: 'ShoppingBag',
      description: 'Browse products'
    },
    {
      title: 'My Orders',
      href: '/customer/orders',
      icon: 'Package',
      description: 'Track your orders'
    },
    {
      title: 'Wishlist',
      href: '/customer/wishlist',
      icon: 'Heart',
      description: 'Saved items'
    },
    {
      title: 'Returns',
      href: '/customer/returns',
      icon: 'RotateCcw',
      description: 'Return requests'
    }
  ],
  designer: [
    {
      title: 'My Designs',
      href: '/designer/designs',
      icon: 'Palette',
      description: 'Manage your designs'
    },
    {
      title: 'Upload Design',
      href: '/designer/upload',
      icon: 'Upload',
      description: 'Add new design'
    },
    {
      title: 'Analytics',
      href: '/designer/analytics',
      icon: 'TrendingUp',
      description: 'Design performance'
    },
    {
      title: 'Collaboration',
      href: '/designer/collaboration',
      icon: 'Users2',
      description: 'Work with team'
    }
  ],
  staff: [
    {
      title: 'Order Queue',
      href: '/staff/orders',
      icon: 'ClipboardList',
      description: 'Process orders'
    },
    {
      title: 'Returns',
      href: '/staff/returns',
      icon: 'RotateCcw',
      description: 'Handle returns'
    },
    {
      title: 'Customer Support',
      href: '/staff/support',
      icon: 'MessageCircle',
      description: 'Help customers'
    },
    {
      title: 'Reports',
      href: '/staff/reports',
      icon: 'FileText',
      description: 'Daily reports'
    }
  ],
  inventory: [
    {
      title: 'Stock Management',
      href: '/inventory/stock',
      icon: 'Package2',
      description: 'Manage inventory'
    },
    {
      title: 'Design Approval',
      href: '/inventory/designs',
      icon: 'CheckCircle',
      description: 'Approve designs'
    },
    {
      title: 'Low Stock Alerts',
      href: '/inventory/alerts',
      icon: 'AlertTriangle',
      description: 'Stock warnings'
    },
    {
      title: 'Reports',
      href: '/inventory/reports',
      icon: 'BarChart',
      description: 'Inventory reports'
    }
  ]
}

export const getDashboardRoute = (role: UserRole): string => {
  const routes = {
    admin: '/admin/dashboard',
    customer: '/customer/dashboard',
    designer: '/designer/dashboard',
    staff: '/staff/dashboard',
    inventory: '/inventory/dashboard'
  }
  return routes[role] || '/dashboard'
}

export const getRoleDisplayName = (role: UserRole): string => {
  const names = {
    admin: 'Administrator',
    customer: 'Customer',
    designer: 'Designer',
    staff: 'Staff Member',
    inventory: 'Inventory Manager'
  }
  return names[role] || role
}
