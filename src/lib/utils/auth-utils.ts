// src/lib/utils/auth-utils.ts
import { UserRole } from '@/lib/types'
import { Permission, hasPermission as checkPermission, canAccessRoute as checkRouteAccess } from '@/lib/permissions'

export const getUserRoleDisplayName = (role: UserRole): string => {
  const roleNames: Record<UserRole, string> = {
    admin: 'Administrator',
    customer: 'Customer',
    designer: 'Designer',
    staff: 'Staff Member',
    inventory_manager: 'Inventory Manager'
  }
  return roleNames[role] || role
}

export const getDashboardRoute = (role: UserRole): string => {
  const routes: Record<UserRole, string> = {
    admin: '/admin/dashboard',
    customer: '/customer/dashboard',
    designer: '/designer/dashboard', 
    staff: '/staff/dashboard',
    inventory_manager: '/inventory/dashboard'
  }
  return routes[role] || '/dashboard'
}

export const getUserRoleDescription = (role: UserRole): string => {
  const descriptions: Record<UserRole, string> = {
    admin: 'Full system access, user management, and analytics',
    customer: 'Browse products, place orders, and manage returns',
    designer: 'Upload designs, collaborate, and track royalties',
    staff: 'Process orders, handle returns, and customer support',
    inventory_manager: 'Manage stock, approve designs, and monitor inventory'
  }
  return descriptions[role] || ''
}

// Legacy function - kept for backward compatibility but now uses new permission system
export const getRolePermissions = (role: UserRole): string[] => {
  // Map old permission strings to new Permission types for backward compatibility
  const legacyPermissions: Record<UserRole, string[]> = {
    admin: [
      'manage_users',
      'view_analytics',
      'generate_reports',
      'manage_products',
      'process_orders',
      'handle_returns',
      'approve_designs',
      'manage_inventory',
      'scan_bills'
    ],
    customer: [
      'browse_products',
      'place_orders',
      'manage_profile',
      'request_returns',
      'view_order_history'
    ],
    designer: [
      'upload_designs',
      'manage_designs',
      'view_analytics',
      'collaborate',
      'manage_profile'
    ],
    staff: [
      'process_orders',
      'handle_returns',
      'customer_support',
      'view_customers',
      'manage_profile'
    ],
    inventory_manager: [
      'manage_inventory',
      'approve_designs',
      'view_stock_reports',
      'set_stock_alerts',
      'manage_products',
      'manage_profile'
    ]
  }
  
  return legacyPermissions[role] || []
}

// Enhanced permission checking using new permission system
export const hasPermission = (userRole: UserRole, permission: string | Permission): boolean => {
  return checkPermission(userRole, permission as Permission)
}

// Enhanced route access checking using new permission system
export const canAccessRoute = (userRole: UserRole, route: string): boolean => {
  return checkRouteAccess(userRole, route)
}

// New utility functions for enhanced role management
export const getRoleHierarchy = (): Record<UserRole, number> => {
  return {
    admin: 5,
    inventory_manager: 4,
    staff: 3,
    designer: 2,
    customer: 1
  }
}

export const hasHigherRole = (userRole: UserRole, compareRole: UserRole): boolean => {
  const hierarchy = getRoleHierarchy()
  return hierarchy[userRole] > hierarchy[compareRole]
}

export const getRoleColor = (role: UserRole): string => {
  const colors: Record<UserRole, string> = {
    admin: 'bg-red-500',
    inventory_manager: 'bg-purple-500',
    staff: 'bg-blue-500',
    designer: 'bg-green-500',
    customer: 'bg-gray-500'
  }
  return colors[role] || 'bg-gray-500'
}

export const getRoleIcon = (role: UserRole): string => {
  const icons: Record<UserRole, string> = {
    admin: 'Crown',
    inventory_manager: 'Package',
    staff: 'Users',
    designer: 'Palette',
    customer: 'ShoppingBag'
  }
  return icons[role] || 'User'
}