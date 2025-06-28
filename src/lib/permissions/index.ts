// src/lib/permissions/index.ts
import { UserRole } from '@/lib/types';

// Define all possible permissions in the system
export type Permission = 
  // Admin permissions
  | 'manage_users'
  | 'view_analytics'
  | 'generate_reports'
  | 'manage_system_settings'
  | 'scan_bills'
  | 'manage_all_products'
  | 'manage_all_orders'
  | 'manage_all_returns'
  | 'approve_all_designs'
  | 'manage_all_inventory'
  
  // Customer permissions
  | 'browse_products'
  | 'place_orders'
  | 'manage_own_orders'
  | 'request_returns'
  | 'manage_profile'
  | 'manage_wishlist'
  | 'view_order_history'
  
  // Designer permissions
  | 'upload_designs'
  | 'manage_own_designs'
  | 'view_design_analytics'
  | 'collaborate_with_inventory'
  | 'track_royalties'
  
  // Staff permissions
  | 'process_orders'
  | 'handle_returns'
  | 'customer_support'
  | 'manage_customers'
  | 'view_order_queue'
  
  // Inventory permissions
  | 'manage_inventory'
  | 'approve_designs'
  | 'view_stock_alerts'
  | 'generate_inventory_reports'
  | 'manage_product_stock';

// Define permissions for each role
export const rolePermissions: Record<UserRole, Permission[]> = {
  admin: [
    'manage_users',
    'view_analytics',
    'generate_reports',
    'manage_system_settings',
    'scan_bills',
    'manage_all_products',
    'manage_all_orders',
    'manage_all_returns',
    'approve_all_designs',
    'manage_all_inventory',
    // Admin can do everything
    'browse_products',
    'place_orders',
    'manage_own_orders',
    'request_returns',
    'manage_profile',
    'upload_designs',
    'manage_own_designs',
    'view_design_analytics',
    'process_orders',
    'handle_returns',
    'customer_support',
    'manage_inventory',
    'approve_designs'
  ],
  
  customer: [
    'browse_products',
    'place_orders',
    'manage_own_orders',
    'request_returns',
    'manage_profile',
    'manage_wishlist',
    'view_order_history'
  ],
  
  designer: [
    'browse_products',
    'upload_designs',
    'manage_own_designs',
    'view_design_analytics',
    'collaborate_with_inventory',
    'track_royalties',
    'manage_profile'
  ],
  
  staff: [
    'browse_products',
    'process_orders',
    'handle_returns',
    'customer_support',
    'manage_customers',
    'view_order_queue',
    'manage_profile'
  ],
  
  inventory: [
    'browse_products',
    'manage_inventory',
    'approve_designs',
    'view_stock_alerts',
    'generate_inventory_reports',
    'manage_product_stock',
    'collaborate_with_inventory',
    'manage_profile'
  ]
};

// Route-based permissions
export interface RoutePermission {
  path: string;
  permissions: Permission[];
  exact?: boolean;
}

export const routePermissions: RoutePermission[] = [
  // Admin routes
  { path: '/admin/dashboard', permissions: ['view_analytics'] },
  { path: '/admin/users', permissions: ['manage_users'] },
  { path: '/admin/reports', permissions: ['generate_reports'] },
  { path: '/admin/settings', permissions: ['manage_system_settings'] },
  { path: '/admin/bill-scan', permissions: ['scan_bills'] },
  
  // Customer routes
  { path: '/customer/products', permissions: ['browse_products'] },
  { path: '/customer/orders', permissions: ['manage_own_orders'] },
  { path: '/customer/returns', permissions: ['request_returns'] },
  { path: '/customer/wishlist', permissions: ['manage_wishlist'] },
  { path: '/customer/profile', permissions: ['manage_profile'] },
  
  // Designer routes
  { path: '/designer/designs', permissions: ['manage_own_designs'] },
  { path: '/designer/upload', permissions: ['upload_designs'] },
  { path: '/designer/analytics', permissions: ['view_design_analytics'] },
  { path: '/designer/collaboration', permissions: ['collaborate_with_inventory'] },
  
  // Staff routes
  { path: '/staff/orders', permissions: ['process_orders'] },
  { path: '/staff/returns', permissions: ['handle_returns'] },
  { path: '/staff/customers', permissions: ['manage_customers'] },
  { path: '/staff/support', permissions: ['customer_support'] },
  
  // Inventory routes
  { path: '/inventory/stock', permissions: ['manage_inventory'] },
  { path: '/inventory/designs', permissions: ['approve_designs'] },
  { path: '/inventory/alerts', permissions: ['view_stock_alerts'] },
  { path: '/inventory/reports', permissions: ['generate_inventory_reports'] }
];

// Permission checking functions
export function hasPermission(userRole: UserRole, permission: Permission): boolean {
  return rolePermissions[userRole]?.includes(permission) ?? false;
}

export function hasAnyPermission(userRole: UserRole, permissions: Permission[]): boolean {
  return permissions.some(permission => hasPermission(userRole, permission));
}

export function hasAllPermissions(userRole: UserRole, permissions: Permission[]): boolean {
  return permissions.every(permission => hasPermission(userRole, permission));
}

export function canAccessRoute(userRole: UserRole, pathname: string): boolean {
  const routePermission = routePermissions.find(route => {
    if (route.exact) {
      return route.path === pathname;
    }
    return pathname.startsWith(route.path);
  });
  
  if (!routePermission) {
    return true; // Allow access if no specific permissions defined
  }
  
  return hasAnyPermission(userRole, routePermission.permissions);
}

// Get user permissions for a role
export function getUserPermissions(userRole: UserRole): Permission[] {
  return rolePermissions[userRole] || [];
}

// Permission caching for performance
class PermissionCache {
  private cache = new Map<string, boolean>();
  private cacheTimeout = 5 * 60 * 1000; // 5 minutes
  private cacheTimestamps = new Map<string, number>();

  set(key: string, value: boolean): void {
    this.cache.set(key, value);
    this.cacheTimestamps.set(key, Date.now());
  }

  get(key: string): boolean | null {
    const timestamp = this.cacheTimestamps.get(key);
    if (!timestamp || Date.now() - timestamp > this.cacheTimeout) {
      this.cache.delete(key);
      this.cacheTimestamps.delete(key);
      return null;
    }
    return this.cache.get(key) ?? null;
  }

  clear(): void {
    this.cache.clear();
    this.cacheTimestamps.clear();
  }
}

export const permissionCache = new PermissionCache();

// Cached permission checking
export function hasPermissionCached(userRole: UserRole, permission: Permission): boolean {
  const cacheKey = `${userRole}:${permission}`;
  let result = permissionCache.get(cacheKey);
  
  if (result === null) {
    result = hasPermission(userRole, permission);
    permissionCache.set(cacheKey, result);
  }
  
  return result;
}
