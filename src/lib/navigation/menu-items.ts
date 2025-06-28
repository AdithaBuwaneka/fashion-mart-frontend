// src/lib/navigation/menu-items.ts
import { 
  Home, 
  Users, 
  ShoppingBag, 
  Package, 
  BarChart3, 
  FileText, 
  Palette, 
  Truck, 
  ArrowLeftRight, 
  Bell, 
  Settings,
  CreditCard,
  UserCheck,
  Scan,
  TrendingUp,
  Inbox,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Eye
} from 'lucide-react'
import { UserRole } from '@/lib/types/auth'

export interface MenuItem {
  title: string
  href: string
  icon: any
  badge?: string
  children?: MenuItem[]
}

export interface RoleMenuItems {
  [key: string]: MenuItem[]
}

export const getMenuItems = (role: UserRole): MenuItem[] => {
  const menuItems: RoleMenuItems = {
    admin: [
      {
        title: 'Dashboard',
        href: '/admin/dashboard',
        icon: Home,
      },
      {
        title: 'User Management',
        href: '/admin/users',
        icon: Users,
      },
      {
        title: 'Analytics',
        href: '/admin/analytics',
        icon: BarChart3,
      },
      {
        title: 'Reports',
        href: '/admin/reports',
        icon: FileText,
      },
      {
        title: 'Bill Scanner',
        href: '/admin/bill-scanner',
        icon: Scan,
      },
      {
        title: 'Settings',
        href: '/admin/settings',
        icon: Settings,
      },
    ],
    customer: [
      {
        title: 'Dashboard',
        href: '/customer/dashboard',
        icon: Home,
      },
      {
        title: 'Products',
        href: '/customer/products',
        icon: ShoppingBag,
      },
      {
        title: 'Cart',
        href: '/customer/cart',
        icon: Package,
        badge: '3', // This would be dynamic
      },
      {
        title: 'Orders',
        href: '/customer/orders',
        icon: Truck,
      },
      {
        title: 'Returns',
        href: '/customer/returns',
        icon: ArrowLeftRight,
      },
      {
        title: 'Profile',
        href: '/customer/profile',
        icon: UserCheck,
      },
    ],
    designer: [
      {
        title: 'Dashboard',
        href: '/designer/dashboard',
        icon: Home,
      },
      {
        title: 'My Designs',
        href: '/designer/designs',
        icon: Palette,
        children: [
          {
            title: 'All Designs',
            href: '/designer/designs',
            icon: Eye,
          },
          {
            title: 'Upload New',
            href: '/designer/designs/new',
            icon: Palette,
          },
        ],
      },
      {
        title: 'Collaborations',
        href: '/designer/collaborations',
        icon: Users,
      },
      {
        title: 'Analytics',
        href: '/designer/analytics',
        icon: TrendingUp,
      },
      {
        title: 'Earnings',
        href: '/designer/earnings',
        icon: CreditCard,
      },
    ],
    staff: [
      {
        title: 'Dashboard',
        href: '/staff/dashboard',
        icon: Home,
      },
      {
        title: 'Order Queue',
        href: '/staff/orders',
        icon: Inbox,
        badge: '12', // Dynamic
      },
      {
        title: 'Returns',
        href: '/staff/returns',
        icon: ArrowLeftRight,
      },
      {
        title: 'Customers',
        href: '/staff/customers',
        icon: Users,
      },
      {
        title: 'Support',
        href: '/staff/support',
        icon: Bell,
      },
    ],
    inventory_manager: [
      {
        title: 'Dashboard',
        href: '/inventory/dashboard',
        icon: Home,
      },
      {
        title: 'Stock Management',
        href: '/inventory/stock',
        icon: Package,
      },
      {
        title: 'Design Approval',
        href: '/inventory/designs',
        icon: Palette,
        children: [
          {
            title: 'Pending',
            href: '/inventory/designs/pending',
            icon: AlertTriangle,
            badge: '5',
          },
          {
            title: 'Approved',
            href: '/inventory/designs/approved',
            icon: CheckCircle,
          },
          {
            title: 'Rejected',
            href: '/inventory/designs/rejected',
            icon: XCircle,
          },
        ],
      },
      {
        title: 'Low Stock Alerts',
        href: '/inventory/alerts',
        icon: AlertTriangle,
        badge: '8',
      },
      {
        title: 'Reports',
        href: '/inventory/reports',
        icon: FileText,
      },
    ],
  }

  return menuItems[role] || []
}