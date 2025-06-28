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
  '/api/public(.*)',
  '/debug(.*)',
  '/auth-test'
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
    return NextResponse.redirect(new URL('/dashboard', req.url));
  }

  // Enhanced protection for dashboard routes
  const userRole = await getUserRole(auth);
  
  // For dashboard routes, only check if user is authenticated
  // Let component-level RoleGuard handle role-specific protection
  if (pathname.startsWith('/admin') || 
      pathname.startsWith('/customer') || 
      pathname.startsWith('/designer') || 
      pathname.startsWith('/staff') || 
      pathname.startsWith('/inventory')) {
    
    // Skip role checking for dashboard routes - let components handle it
    // This allows the AuthContext to properly fetch user data from database
    return NextResponse.next();
  }

  // Add user role and ID to headers for downstream components
  const response = NextResponse.next();
  if (userRole) {
    response.headers.set('x-user-role', userRole);
  }
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