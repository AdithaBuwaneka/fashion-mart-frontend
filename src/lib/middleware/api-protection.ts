// src/lib/middleware/api-protection.ts
import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { UserRole } from '@/lib/types';
import { hasPermission, Permission } from '@/lib/permissions';

// API route protection configuration
export interface ApiRouteConfig {
  path: string;
  method?: string | string[];
  requiredRole?: UserRole | UserRole[];
  requiredPermissions?: Permission[];
  requireAll?: boolean; // If true, user must have ALL permissions
}

// API route configurations
export const apiRouteConfigs: ApiRouteConfig[] = [
  // Admin API routes
  {
    path: '/api/admin/users',
    requiredRole: 'admin',
    requiredPermissions: ['manage_users']
  },
  {
    path: '/api/admin/reports',
    requiredRole: 'admin',
    requiredPermissions: ['generate_reports']
  },
  {
    path: '/api/admin/analytics',
    requiredRole: 'admin',
    requiredPermissions: ['view_analytics']
  },
  {
    path: '/api/admin/bill-scan',
    method: 'POST',
    requiredRole: 'admin',
    requiredPermissions: ['scan_bills']
  },

  // Customer API routes
  {
    path: '/api/customer/orders',
    requiredRole: ['customer', 'admin'],
    requiredPermissions: ['manage_own_orders']
  },
  {
    path: '/api/customer/cart',
    requiredRole: ['customer', 'admin'],
    requiredPermissions: ['place_orders']
  },
  {
    path: '/api/customer/returns',
    requiredRole: ['customer', 'staff', 'admin'],
    requiredPermissions: ['request_returns']
  },

  // Designer API routes
  {
    path: '/api/designer/designs',
    requiredRole: ['designer', 'admin'],
    requiredPermissions: ['manage_own_designs']
  },
  {
    path: '/api/designer/upload',
    method: 'POST',
    requiredRole: ['designer', 'admin'],
    requiredPermissions: ['upload_designs']
  },
  {
    path: '/api/designer/analytics',
    requiredRole: ['designer', 'admin'],
    requiredPermissions: ['view_design_analytics']
  },

  // Staff API routes
  {
    path: '/api/staff/orders',
    requiredRole: ['staff', 'admin'],
    requiredPermissions: ['process_orders']
  },
  {
    path: '/api/staff/returns',
    requiredRole: ['staff', 'admin'],
    requiredPermissions: ['handle_returns']
  },
  {
    path: '/api/staff/customers',
    requiredRole: ['staff', 'admin'],
    requiredPermissions: ['manage_customers']
  },

  // Inventory API routes
  {
    path: '/api/inventory/stock',
    requiredRole: ['inventory', 'admin'],
    requiredPermissions: ['manage_inventory']
  },
  {
    path: '/api/inventory/designs',
    requiredRole: ['inventory', 'admin'],
    requiredPermissions: ['approve_designs']
  },
  {
    path: '/api/inventory/reports',
    requiredRole: ['inventory', 'admin'],
    requiredPermissions: ['generate_inventory_reports']
  }
];

// Get user role from session
async function getUserRole(): Promise<UserRole | null> {
  try {
    const { sessionClaims } = await auth();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return (sessionClaims as any)?.metadata?.role || null;
  } catch {
    return null;
  }
}

// Check if route matches configuration
function matchesRoute(pathname: string, method: string, config: ApiRouteConfig): boolean {
  // Check path match
  const pathMatches = pathname.startsWith(config.path);
  if (!pathMatches) return false;

  // Check method if specified
  if (config.method) {
    const allowedMethods = Array.isArray(config.method) ? config.method : [config.method];
    if (!allowedMethods.includes(method.toUpperCase())) return false;
  }

  return true;
}

// Main API protection function
export async function protectApiRoute(req: NextRequest): Promise<NextResponse | null> {
  const { pathname } = req.nextUrl;
  const method = req.method;

  // Skip protection for public API routes
  if (pathname.startsWith('/api/public') || 
      pathname.startsWith('/api/webhooks')) {
    return null; // Allow request to continue
  }

  // Find matching route configuration
  const config = apiRouteConfigs.find(config => 
    matchesRoute(pathname, method, config)
  );

  if (!config) {
    return null; // No specific protection needed
  }

  // Get user authentication
  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json(
      { error: 'Unauthorized', message: 'Authentication required' },
      { status: 401 }
    );
  }

  // Get user role
  const userRole = await getUserRole();
  if (!userRole) {
    return NextResponse.json(
      { error: 'Forbidden', message: 'User role not found' },
      { status: 403 }
    );
  }

  // Check role access
  if (config.requiredRole) {
    const allowedRoles = Array.isArray(config.requiredRole) 
      ? config.requiredRole 
      : [config.requiredRole];
    
    if (!allowedRoles.includes(userRole)) {
      return NextResponse.json(
        { 
          error: 'Forbidden', 
          message: `Access denied. Required role: ${allowedRoles.join(' or ')}`,
          userRole,
          requiredRoles: allowedRoles
        },
        { status: 403 }
      );
    }
  }

  // Check permissions
  if (config.requiredPermissions && config.requiredPermissions.length > 0) {
    const hasAccess = config.requireAll
      ? config.requiredPermissions.every(permission => hasPermission(userRole, permission))
      : config.requiredPermissions.some(permission => hasPermission(userRole, permission));

    if (!hasAccess) {
      return NextResponse.json(
        { 
          error: 'Forbidden', 
          message: 'Insufficient permissions',
          userRole,
          requiredPermissions: config.requiredPermissions
        },
        { status: 403 }
      );
    }
  }

  return null; // Allow request to continue
}

// Wrapper for API route handlers
export function withApiProtection(
  handler: (req: NextRequest) => Promise<NextResponse>,
  customConfig?: Partial<ApiRouteConfig>
) {
  return async (req: NextRequest): Promise<NextResponse> => {
    // Apply custom protection if specified
    if (customConfig) {
      const protection = await protectApiRoute(req);
      if (protection) return protection;
    }

    // Call the original handler
    return handler(req);
  };
}

// Middleware helper for specific permissions
export function requirePermissions(permissions: Permission[], requireAll = false) {
  return async (): Promise<NextResponse | null> => {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const userRole = await getUserRole();
    if (!userRole) {
      return NextResponse.json(
        { error: 'Forbidden', message: 'User role not found' },
        { status: 403 }
      );
    }

    const hasAccess = requireAll
      ? permissions.every(permission => hasPermission(userRole, permission))
      : permissions.some(permission => hasPermission(userRole, permission));

    if (!hasAccess) {
      return NextResponse.json(
        { 
          error: 'Forbidden', 
          message: 'Insufficient permissions',
          requiredPermissions: permissions
        },
        { status: 403 }
      );
    }

    return null; // Allow request to continue
  };
}

// Role-specific middleware helpers
export const requireAdmin = () => requirePermissions(['view_analytics']);
export const requireCustomer = () => requirePermissions(['browse_products']);
export const requireDesigner = () => requirePermissions(['upload_designs']);
export const requireStaff = () => requirePermissions(['process_orders']);
export const requireInventory = () => requirePermissions(['manage_inventory']);
