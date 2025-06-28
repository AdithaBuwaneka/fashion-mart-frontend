// src/lib/routing/dynamic-imports.ts
import { UserRole } from '@/lib/types';
import { ComponentType } from 'react';

// Type for lazy-loaded components
type LazyComponent = () => Promise<{ default: ComponentType<unknown> }>;

// Define route component loaders for each role (will be populated when pages exist)
export const adminComponents: Record<string, LazyComponent> = {
  // Will be populated in later steps when actual pages are created
  // dashboard: () => import('@/app/(dashboard)/admin/dashboard/page'),
  // users: () => import('@/app/(dashboard)/admin/users/page'),
  // reports: () => import('@/app/(dashboard)/admin/reports/page'),
};

export const customerComponents: Record<string, LazyComponent> = {
  // Will be populated in later steps when actual pages are created
  // dashboard: () => import('@/app/(dashboard)/customer/dashboard/page'),
  // products: () => import('@/app/(dashboard)/customer/products/page'),
};

export const designerComponents: Record<string, LazyComponent> = {
  // Will be populated in later steps when actual pages are created
  // dashboard: () => import('@/app/(dashboard)/designer/dashboard/page'),
  // designs: () => import('@/app/(dashboard)/designer/designs/page'),
};

export const staffComponents: Record<string, LazyComponent> = {
  // Will be populated in later steps when actual pages are created
  // dashboard: () => import('@/app/(dashboard)/staff/dashboard/page'),
  // orders: () => import('@/app/(dashboard)/staff/orders/page'),
};

export const inventoryComponents: Record<string, LazyComponent> = {
  // Will be populated in later steps when actual pages are created
  // dashboard: () => import('@/app/(dashboard)/inventory/dashboard/page'),
  // stock: () => import('@/app/(dashboard)/inventory/stock/page'),
};

// Component registry for dynamic loading
export const roleComponentRegistry: Record<UserRole, Record<string, LazyComponent>> = {
  admin: adminComponents,
  customer: customerComponents,
  designer: designerComponents,
  staff: staffComponents,
  inventory: inventoryComponents
};

// Preload components for a specific role
export function preloadRoleComponents(role: UserRole): void {
  const components = roleComponentRegistry[role];
  
  // Use requestIdleCallback for non-blocking preloading
  if (typeof window !== 'undefined' && 'requestIdleCallback' in window) {
    window.requestIdleCallback(() => {
      Object.values(components).forEach(componentLoader => {
        // Trigger lazy loading by calling the loader
        componentLoader().catch(() => {
          // Silently handle errors for components that don't exist yet
        });
      });
    });
  }
}

// Preload specific component
export function preloadComponent(role: UserRole, componentName: string): void {
  const componentLoader = roleComponentRegistry[role]?.[componentName];
  if (componentLoader && typeof window !== 'undefined') {
    // Trigger lazy loading
    componentLoader().catch(() => {
      // Silently handle errors for components that don't exist yet
    });
  }
}

// Route-specific preloading based on user navigation patterns
export const routePreloadStrategies = {
  // When user visits dashboard, preload common next routes
  dashboard: {
    admin: ['users', 'reports'],
    customer: ['products', 'orders'],
    designer: ['designs', 'upload'],
    staff: ['orders', 'returns'],
    inventory: ['stock', 'alerts']
  },
  
  // When user visits main feature, preload related features
  orders: {
    admin: ['reports'],
    customer: ['returns'],
    staff: ['customers'],
    inventory: ['stock']
  },
  
  products: {
    customer: ['orders', 'wishlist'],
    admin: ['reports']
  },
  
  designs: {
    designer: ['upload', 'analytics'],
    inventory: ['stock'],
    admin: ['reports']
  }
};

// Intelligent preloading based on current route
export function intelligentPreload(role: UserRole, currentRoute: string): void {
  const routeKey = currentRoute.split('/').pop() || 'dashboard';
  const strategy = routePreloadStrategies[routeKey as keyof typeof routePreloadStrategies];
  
  // Type assertion to Record<UserRole, string[]> for strategy
  const roleStrategy = strategy as Partial<Record<UserRole, string[]>>;
  if (roleStrategy && roleStrategy[role]) {
    roleStrategy[role]!.forEach((componentName: string) => {
      preloadComponent(role, componentName);
    });
  }
}

// Route optimization utilities
export class RouteOptimizer {
  private static instance: RouteOptimizer;
  private preloadedRoutes = new Set<string>();
  private preloadQueue: Array<{ role: UserRole; component: string }> = [];
  private isProcessing = false;

  static getInstance(): RouteOptimizer {
    if (!RouteOptimizer.instance) {
      RouteOptimizer.instance = new RouteOptimizer();
    }
    return RouteOptimizer.instance;
  }

  // Add route to preload queue
  queuePreload(role: UserRole, component: string): void {
    const routeKey = `${role}:${component}`;
    if (!this.preloadedRoutes.has(routeKey)) {
      this.preloadQueue.push({ role, component });
      this.processQueue();
    }
  }

  // Process preload queue with throttling
  private async processQueue(): Promise<void> {
    if (this.isProcessing || this.preloadQueue.length === 0) {
      return;
    }

    this.isProcessing = true;

    while (this.preloadQueue.length > 0) {
      const { role, component } = this.preloadQueue.shift()!;
      const routeKey = `${role}:${component}`;

      if (!this.preloadedRoutes.has(routeKey)) {
        try {
          preloadComponent(role, component);
          this.preloadedRoutes.add(routeKey);
        } catch (error) {
          console.warn(`Failed to preload component ${component} for role ${role}:`, error);
        }

        // Throttle preloading to avoid blocking the main thread
        await new Promise(resolve => setTimeout(resolve, 100));
      }
    }

    this.isProcessing = false;
  }

  // Clear preload cache
  clearCache(): void {
    this.preloadedRoutes.clear();
    this.preloadQueue = [];
    this.isProcessing = false;
  }

  // Get preloaded routes for debugging
  getPreloadedRoutes(): string[] {
    return Array.from(this.preloadedRoutes);
  }
}

// Export singleton instance
export const routeOptimizer = RouteOptimizer.getInstance();

// Helper function to register component loaders (to be used when pages are created)
export function registerComponent(role: UserRole, name: string, loader: LazyComponent): void {
  if (!roleComponentRegistry[role]) {
    roleComponentRegistry[role] = {};
  }
  roleComponentRegistry[role][name] = loader;
}
