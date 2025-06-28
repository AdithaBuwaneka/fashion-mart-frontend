// src/lib/hooks/use-navigation.ts
'use client';

import { useAuth } from '@/lib/hooks/use-auth';
import { useRouter, usePathname } from 'next/navigation';
import { useEffect, useCallback } from 'react';
import { intelligentPreload, routeOptimizer } from '@/lib/routing/route-optimization';
import { canAccessRoute } from '@/lib/permissions';
import { UserRole } from '@/lib/types';
import { getDashboardRoute } from '@/lib/utils/auth-utils';

export function useNavigation() {
  const { user } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  // Preload likely next routes on navigation
  useEffect(() => {
    if (user?.role) {
      intelligentPreload(user.role, pathname);
    }
  }, [user?.role, pathname]);

  // Enhanced navigation with permission checking and preloading
  const navigateTo = useCallback((path: string, preload = true) => {
    if (!user) {
      router.push(`/sign-in?redirect_url=${encodeURIComponent(path)}`);
      return;
    }

    // Check if user can access the route
    if (!canAccessRoute(user.role, path)) {
      // Redirect to user's appropriate dashboard instead of showing unauthorized
      const dashboardRoute = getDashboardRoute(user.role);
      router.push(dashboardRoute);
      return;
    }

    // Preload related components if requested
    if (preload) {
      const routeKey = path.split('/').pop() || 'dashboard';
      routeOptimizer.queuePreload(user.role, routeKey);
    }

    router.push(path);
  }, [user, router]);

  // Navigate to user's dashboard
  const navigateToDashboard = useCallback(() => {
    if (user) {
      const dashboardRoute = getDashboardRoute(user.role);
      navigateTo(dashboardRoute);
    }
  }, [user, navigateTo]);

  // Check if current route is accessible
  const isCurrentRouteAccessible = useCallback(() => {
    if (!user) return false;
    return canAccessRoute(user.role, pathname);
  }, [user, pathname]);

  // Get available routes for current user
  const getAvailableRoutes = useCallback(() => {
    if (!user) return [];
    
    const roleRoutes: Record<UserRole, string[]> = {
      admin: [
        '/admin/dashboard',
        '/admin/users',
        '/admin/reports',
        '/admin/settings',
        '/admin/bill-scan'
      ],
      customer: [
        '/customer/dashboard',
        '/customer/products',
        '/customer/orders',
        '/customer/returns',
        '/customer/wishlist',
        '/customer/profile'
      ],
      designer: [
        '/designer/dashboard',
        '/designer/designs',
        '/designer/upload',
        '/designer/analytics',
        '/designer/collaboration'
      ],
      staff: [
        '/staff/dashboard',
        '/staff/orders',
        '/staff/returns',
        '/staff/customers',
        '/staff/support'
      ],
      inventory: [
        '/inventory/dashboard',
        '/inventory/stock',
        '/inventory/designs',
        '/inventory/alerts',
        '/inventory/reports'
      ]
    };

    return roleRoutes[user.role] || [];
  }, [user]);

  // Preload all user's accessible routes
  const preloadUserRoutes = useCallback(() => {
    if (user) {
      const routes = getAvailableRoutes();
      routes.forEach(route => {
        const componentName = route.split('/').pop() || 'dashboard';
        routeOptimizer.queuePreload(user.role, componentName);
      });
    }
  }, [user, getAvailableRoutes]);

  return {
    navigateTo,
    navigateToDashboard,
    isCurrentRouteAccessible,
    getAvailableRoutes,
    preloadUserRoutes,
    currentPath: pathname,
    userRole: user?.role || null
  };
}

// Hook for breadcrumb navigation with permission checking
export function useBreadcrumbs() {
  const { user } = useAuth();
  const pathname = usePathname();
  const { navigateTo } = useNavigation();

  const getBreadcrumbs = useCallback(() => {
    if (!user) return [];

    const pathSegments = pathname.split('/').filter(Boolean);
    const breadcrumbs = [];

    // Always start with home
    breadcrumbs.push({
      label: 'Home',
      href: '/',
      accessible: true
    });

    // Add role-based dashboard
    if (pathSegments.length > 0) {
      const roleSegment = pathSegments[0];
      breadcrumbs.push({
        label: `${roleSegment.charAt(0).toUpperCase() + roleSegment.slice(1)} Dashboard`,
        href: `/${roleSegment}/dashboard`,
        accessible: canAccessRoute(user.role, `/${roleSegment}/dashboard`)
      });
    }

    // Add remaining path segments
    let currentPath = '';
    for (let i = 0; i < pathSegments.length; i++) {
      currentPath += `/${pathSegments[i]}`;
      
      if (i === 0) continue; // Skip role segment as it's already added
      
      const label = pathSegments[i]
        .split('-')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');

      breadcrumbs.push({
        label,
        href: currentPath,
        accessible: canAccessRoute(user.role, currentPath)
      });
    }

    return breadcrumbs;
  }, [user, pathname]);

  const navigateToBreadcrumb = useCallback((href: string) => {
    navigateTo(href);
  }, [navigateTo]);

  return {
    breadcrumbs: getBreadcrumbs(),
    navigateToBreadcrumb
  };
}

// Hook for managing navigation state and optimization
export function useNavigationOptimization() {
  const { user } = useAuth();

  // Get optimization statistics
  const getOptimizationStats = useCallback(() => {
    return {
      preloadedRoutes: routeOptimizer.getPreloadedRoutes(),
      cacheSize: routeOptimizer.getPreloadedRoutes().length
    };
  }, []);

  // Clear optimization cache
  const clearOptimizationCache = useCallback(() => {
    routeOptimizer.clearCache();
  }, []);

  // Force preload specific routes
  const forcePreload = useCallback((routes: string[]) => {
    if (!user) return;
    
    routes.forEach(route => {
      const componentName = route.split('/').pop() || 'dashboard';
      routeOptimizer.queuePreload(user.role, componentName);
    });
  }, [user]);

  return {
    getOptimizationStats,
    clearOptimizationCache,
    forcePreload
  };
}
