// src/lib/guards/permission-guard.tsx
'use client';

import { ReactNode } from 'react';
import { useAuth } from '@/lib/hooks/use-auth';
import { hasPermission, hasAnyPermission, hasAllPermissions, Permission } from '@/lib/permissions';
import { UserRole } from '@/lib/types';

interface PermissionCheckProps {
  children: ReactNode;
  permission?: Permission;
  permissions?: Permission[];
  requireAll?: boolean;
  role?: UserRole | UserRole[];
  fallback?: ReactNode;
  showFallback?: boolean;
}

/**
 * Component-level permission guard that conditionally renders children
 * based on user permissions
 */
export function PermissionCheck({
  children,
  permission,
  permissions,
  requireAll = false,
  role,
  fallback = null,
  showFallback = true
}: PermissionCheckProps) {
  const { user, isLoading } = useAuth();

  // Don't render anything while loading
  if (isLoading) {
    return null;
  }

  // Don't render if user is not authenticated
  if (!user) {
    return showFallback ? fallback : null;
  }

  // Check role if specified
  if (role) {
    const allowedRoles = Array.isArray(role) ? role : [role];
    if (!allowedRoles.includes(user.role)) {
      return showFallback ? fallback : null;
    }
  }

  // Check single permission
  if (permission && !hasPermission(user.role, permission)) {
    return showFallback ? fallback : null;
  }

  // Check multiple permissions
  if (permissions && permissions.length > 0) {
    const hasAccess = requireAll
      ? hasAllPermissions(user.role, permissions)
      : hasAnyPermission(user.role, permissions);

    if (!hasAccess) {
      return showFallback ? fallback : null;
    }
  }

  return <>{children}</>;
}

/**
 * Hook for checking permissions in components
 */
export function usePermissions() {
  const { user } = useAuth();

  const checkPermission = (permission: Permission): boolean => {
    if (!user) return false;
    return hasPermission(user.role, permission);
  };

  const checkAnyPermission = (permissions: Permission[]): boolean => {
    if (!user) return false;
    return hasAnyPermission(user.role, permissions);
  };

  const checkAllPermissions = (permissions: Permission[]): boolean => {
    if (!user) return false;
    return hasAllPermissions(user.role, permissions);
  };

  const checkRole = (role: UserRole | UserRole[]): boolean => {
    if (!user) return false;
    const roles = Array.isArray(role) ? role : [role];
    return roles.includes(user.role);
  };

  return {
    checkPermission,
    checkAnyPermission,
    checkAllPermissions,
    checkRole,
    userRole: user?.role || null,
    permissions: user ? getUserPermissions(user.role) : []
  };
}

// Shorthand components for common permission checks
export function AdminOnly({ children, fallback }: { children: ReactNode; fallback?: ReactNode }) {
  return (
    <PermissionCheck role="admin" fallback={fallback}>
      {children}
    </PermissionCheck>
  );
}

export function CustomerOnly({ children, fallback }: { children: ReactNode; fallback?: ReactNode }) {
  return (
    <PermissionCheck role="customer" fallback={fallback}>
      {children}
    </PermissionCheck>
  );
}

export function DesignerOnly({ children, fallback }: { children: ReactNode; fallback?: ReactNode }) {
  return (
    <PermissionCheck role="designer" fallback={fallback}>
      {children}
    </PermissionCheck>
  );
}

export function StaffOnly({ children, fallback }: { children: ReactNode; fallback?: ReactNode }) {
  return (
    <PermissionCheck role="staff" fallback={fallback}>
      {children}
    </PermissionCheck>
  );
}

export function InventoryOnly({ children, fallback }: { children: ReactNode; fallback?: ReactNode }) {
  return (
    <PermissionCheck role="inventory" fallback={fallback}>
      {children}
    </PermissionCheck>
  );
}

// Permission-specific components
export function CanManageUsers({ children, fallback }: { children: ReactNode; fallback?: ReactNode }) {
  return (
    <PermissionCheck permission="manage_users" fallback={fallback}>
      {children}
    </PermissionCheck>
  );
}

export function CanViewAnalytics({ children, fallback }: { children: ReactNode; fallback?: ReactNode }) {
  return (
    <PermissionCheck permission="view_analytics" fallback={fallback}>
      {children}
    </PermissionCheck>
  );
}

export function CanUploadDesigns({ children, fallback }: { children: ReactNode; fallback?: ReactNode }) {
  return (
    <PermissionCheck permission="upload_designs" fallback={fallback}>
      {children}
    </PermissionCheck>
  );
}

export function CanProcessOrders({ children, fallback }: { children: ReactNode; fallback?: ReactNode }) {
  return (
    <PermissionCheck permission="process_orders" fallback={fallback}>
      {children}
    </PermissionCheck>
  );
}

export function CanManageInventory({ children, fallback }: { children: ReactNode; fallback?: ReactNode }) {
  return (
    <PermissionCheck permission="manage_inventory" fallback={fallback}>
      {children}
    </PermissionCheck>
  );
}

// Helper to get user permissions
import { getUserPermissions } from '@/lib/permissions';
