// src/lib/hooks/use-auth.ts
import { useAuth as useAuthContext } from '@/lib/context/auth-context'
import { useUser, useClerk } from '@clerk/nextjs'
import { useRouter } from 'next/navigation'
import { UserRole } from '@/lib/types/auth'

export const useAuth = () => {
  const authContext = useAuthContext()
  const { user: clerkUser } = useUser()
  const { signOut } = useClerk()
  const router = useRouter()

  const logout = async () => {
    try {
      await signOut()
      router.push('/')
    } catch (error) {
      console.error('Logout failed:', error)
    }
  }

  const redirectToDashboard = () => {
    if (!authContext.user) return

    const dashboardRoutes: Record<UserRole, string> = {
      admin: '/admin/dashboard',
      customer: '/customer/dashboard',
      designer: '/designer/dashboard',
      staff: '/staff/dashboard',
      inventory_manager: '/inventory/dashboard'
    }

    const route = dashboardRoutes[authContext.user.role]
    if (route) {
      router.push(route)
    }
  }

  return {
    ...authContext,
    clerkUser,
    logout,
    redirectToDashboard
  }
}

// src/lib/utils/auth-utils.ts
import { UserRole } from '@/lib/types/auth'

export const getUserRoleDisplayName = (role: UserRole): string => {
  const roleNames: Record<UserRole, string> = {
    admin: 'Administrator',
    customer: 'Customer',
    designer: 'Designer',
    staff: 'Staff Member',
    inventory_manager: 'Inventory Manager'
  }
  return roleNames[role]
}

export const getUserRoleDescription = (role: UserRole): string => {
  const descriptions: Record<UserRole, string> = {
    admin: 'Full system access, user management, and analytics',
    customer: 'Browse products, place orders, and manage returns',
    designer: 'Upload designs, collaborate, and track royalties',
    staff: 'Process orders, handle returns, and customer support',
    inventory_manager: 'Manage stock, approve designs, and monitor inventory'
  }
  return descriptions[role]
}

export const getRolePermissions = (role: UserRole) => {
  const permissions = {
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
  
  return permissions[role] || []
}

export const hasPermission = (userRole: UserRole, permission: string): boolean => {
  const userPermissions = getRolePermissions(userRole)
  return userPermissions.includes(permission)
}

export const canAccessRoute = (userRole: UserRole, route: string): boolean => {
  const routePermissions: Record<string, UserRole[]> = {
    '/admin': ['admin'],
    '/customer': ['customer'],
    '/designer': ['designer'],
    '/staff': ['staff'],
    '/inventory': ['inventory_manager']
  }

  for (const [routePrefix, allowedRoles] of Object.entries(routePermissions)) {
    if (route.startsWith(routePrefix)) {
      return allowedRoles.includes(userRole)
    }
  }

  return false
}