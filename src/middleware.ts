// src/middleware.ts
import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";
import { UserRole } from "@/lib/types";
import { protectApiRoute } from "@/lib/middleware/api-protection";

// Public routes that don't require authentication
const isPublicRoute = createRouteMatcher([
  '/',
  '/about',
  '/contact',
  '/products(.*)',
  '/connection-test',
  '/sign-in(.*)',
  '/sign-up(.*)',
  '/api/webhooks(.*)',
  '/unauthorized',
  '/api/public(.*)'
]);

// Authentication pages
const isAuthRoute = createRouteMatcher([
  '/sign-in(.*)',
  '/sign-up(.*)'
]);

// API routes that need protection
const isProtectedApiRoute = createRouteMatcher([
  '/api/admin(.*)',
  '/api/customer(.*)',
  '/api/designer(.*)',
  '/api/staff(.*)',
  '/api/inventory(.*)'
]);

// Role-based route patterns
const roleRoutePatterns: Record<UserRole, RegExp[]> = {
  admin: [
    /^\/admin(\/.*)?$/,
    /^\/api\/admin(\/.*)?$/
  ],
  customer: [
    /^\/customer(\/.*)?$/,
    /^\/api\/customer(\/.*)?$/
  ],
  designer: [
    /^\/designer(\/.*)?$/,
    /^\/api\/designer(\/.*)?$/
  ],
  staff: [
    /^\/staff(\/.*)?$/,
    /^\/api\/staff(\/.*)?$/
  ],
  inventory_manager: [
    /^\/inventory(\/.*)?$/,
    /^\/api\/inventory(\/.*)?$/
  ]
};

// Get user role from user metadata
async function getUserRole(auth: unknown): Promise<UserRole | null> {
  try {
    const authResult = await (auth as () => Promise<{ sessionClaims?: Record<string, unknown> }>)();
    const { sessionClaims } = authResult;
    return (sessionClaims as { metadata?: { role?: UserRole } })?.metadata?.role || null;
  } catch {
    return null;
  }
}

// Check if user has access to route based on role
function hasRouteAccess(role: UserRole, pathname: string): boolean {
  const patterns = roleRoutePatterns[role];
  return patterns.some(pattern => pattern.test(pathname));
}

// Get redirect URL based on user role
function getRoleBasedRedirect(role: UserRole): string {
  const redirectMap: Record<UserRole, string> = {
    admin: '/admin/dashboard',
    customer: '/customer/dashboard',
    designer: '/designer/dashboard',
    staff: '/staff/dashboard',
    inventory_manager: '/inventory/dashboard'
  };
  return redirectMap[role] || '/dashboard';
}

export default clerkMiddleware(async (auth, req: NextRequest) => {
  const { userId } = await auth();
  const { pathname } = req.nextUrl;

  // Allow public routes
  if (isPublicRoute(req)) {
    return NextResponse.next();
  }

  // Apply API route protection for protected API routes
  if (isProtectedApiRoute(req)) {
    const apiProtection = await protectApiRoute(req);
    if (apiProtection) {
      return apiProtection;
    }
  }

  // Redirect unauthenticated users to sign-in
  if (!userId) {
    const signInUrl = new URL('/sign-in', req.url);
    signInUrl.searchParams.set('redirect_url', pathname);
    return NextResponse.redirect(signInUrl);
  }

  // Redirect authenticated users away from auth pages
  if (isAuthRoute(req)) {
    const userRole = await getUserRole(auth);
    if (userRole) {
      return NextResponse.redirect(new URL(getRoleBasedRedirect(userRole), req.url));
    }
    return NextResponse.redirect(new URL('/dashboard', req.url));
  }

  // Enhanced protection for dashboard routes
  const userRole = await getUserRole(auth);
  
  if (!userRole) {
    return NextResponse.redirect(new URL('/unauthorized', req.url));
  }

  // Check role-based access for protected routes
  if (pathname.startsWith('/admin') || 
      pathname.startsWith('/customer') || 
      pathname.startsWith('/designer') || 
      pathname.startsWith('/staff') || 
      pathname.startsWith('/inventory')) {
    
    if (!hasRouteAccess(userRole, pathname)) {
      // Redirect to user's appropriate dashboard instead of unauthorized
      return NextResponse.redirect(new URL(getRoleBasedRedirect(userRole), req.url));
    }
  }

  // Add user role and ID to headers for downstream components
  const response = NextResponse.next();
  response.headers.set('x-user-role', userRole);
  response.headers.set('x-user-id', userId);

  return response;
});

export const config = {
  matcher: [
    '/((?!.*\\..*|_next).*)',
    '/',
    '/(api|trpc)(.*)'
  ],
};