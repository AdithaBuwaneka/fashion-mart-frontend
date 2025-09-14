// src/lib/guards/route-guard.tsx
'use client';

import { useAuth } from '@/lib/hooks/use-auth';
import { hasPermission, canAccessRoute, Permission } from '@/lib/permissions';
import { UserRole } from '@/lib/types';
import { useRouter, usePathname } from 'next/navigation';
import { useEffect, ReactNode } from 'react';
import { LoadingScreen } from '@/components/shared/loading-screen';
import { UnauthorizedAccess } from '@/components/shared/unauthorized-access';

interface RouteGuardProps {
  children: ReactNode;
  requiredRole?: UserRole | UserRole[];
  requiredPermissions?: Permission[];
  fallback?: ReactNode;
  redirectTo?: string;
  requireAll?: boolean; // If true, user must have ALL permissions, otherwise ANY
}

export function RouteGuard({
  children,
  requiredRole,
  requiredPermissions,
  fallback,
  redirectTo,
  requireAll = false
}: RouteGuardProps) {
  const { user, isLoading, isSignedIn } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (isLoading) return;

    // Check authentication
    if (!isSignedIn || !user) {
      const signInUrl = `/sign-in?redirect_url=${encodeURIComponent(pathname)}`;
      router.push(signInUrl);
      return;
    }

    // Check role access
    if (requiredRole) {
      const roles = Array.isArray(requiredRole) ? requiredRole : [requiredRole];
      if (!roles.includes(user.role)) {
        if (redirectTo) {
          router.push(redirectTo);
          return;
        }
      }
    }

    // Check route access based on permissions
    if (!canAccessRoute(user.role, pathname)) {
      if (redirectTo) {
        router.push(redirectTo);
        return;
      }
    }

    // Check specific permissions
    if (requiredPermissions && requiredPermissions.length > 0) {
      const hasAccess = requireAll
        ? requiredPermissions.every(permission => hasPermission(user.role, permission))
        : requiredPermissions.some(permission => hasPermission(user.role, permission));

      if (!hasAccess) {
        if (redirectTo) {
          router.push(redirectTo);
          return;
        }
      }
    }
  }, [isLoading, isSignedIn, user, requiredRole, requiredPermissions, requireAll, redirectTo, pathname, router]);

  // Show loading while checking authentication
  if (isLoading) {
    return <LoadingScreen />;
  }

  // Show unauthorized if not signed in
  if (!isSignedIn || !user) {
    return fallback || <LoadingScreen />;
  }

  // Check role access
  if (requiredRole) {
    const roles = Array.isArray(requiredRole) ? requiredRole : [requiredRole];
    if (!roles.includes(user.role)) {
      return fallback || <UnauthorizedAccess userRole={user.role} requiredRoles={roles} />;
    }
  }

  // Check route access
  if (!canAccessRoute(user.role, pathname)) {
    return fallback || <UnauthorizedAccess userRole={user.role} requiredRoles={[]} />;
  }

  // Check specific permissions
  if (requiredPermissions && requiredPermissions.length > 0) {
    const hasAccess = requireAll
      ? requiredPermissions.every(permission => hasPermission(user.role, permission))
      : requiredPermissions.some(permission => hasPermission(user.role, permission));

    if (!hasAccess) {
      return fallback || <UnauthorizedAccess userRole={user.role} requiredRoles={[]} />;
    }
  }

  return <>{children}</>;
}

// Higher-order component for page-level protection
export function withRouteGuard<P extends object>(
  WrappedComponent: React.ComponentType<P>,
  guardOptions: Omit<RouteGuardProps, 'children'>
) {
  return function GuardedComponent(props: P) {
    return (
      <RouteGuard {...guardOptions}>
        <WrappedComponent {...props} />
      </RouteGuard>
    );
  };
}

// Specific role guards for common use cases
export function AdminGuard({ children, fallback }: { children: ReactNode; fallback?: ReactNode }) {
  return (
    <RouteGuard requiredRole="admin" fallback={fallback}>
      {children}
    </RouteGuard>
  );
}

export function CustomerGuard({ children, fallback }: { children: ReactNode; fallback?: ReactNode }) {
  return (
    <RouteGuard requiredRole="customer" fallback={fallback}>
      {children}
    </RouteGuard>
  );
}

export function DesignerGuard({ children, fallback }: { children: ReactNode; fallback?: ReactNode }) {
  return (
    <RouteGuard requiredRole="designer" fallback={fallback}>
      {children}
    </RouteGuard>
  );
}

export function StaffGuard({ children, fallback }: { children: ReactNode; fallback?: ReactNode }) {
  return (
    <RouteGuard requiredRole="staff" fallback={fallback}>
      {children}
    </RouteGuard>
  );
}

export function InventoryGuard({ children, fallback }: { children: ReactNode; fallback?: ReactNode }) {
  return (
    <RouteGuard requiredRole="inventory_manager" fallback={fallback}>
      {children}
    </RouteGuard>
  );
}

// Permission-based guards
export function PermissionGuard({
  children,
  permissions,
  requireAll = false,
  fallback
}: {
  children: ReactNode;
  permissions: Permission[];
  requireAll?: boolean;
  fallback?: ReactNode;
}) {
  return (
    <RouteGuard
      requiredPermissions={permissions}
      requireAll={requireAll}
      fallback={fallback}
    >
      {children}
    </RouteGuard>
  );
}
