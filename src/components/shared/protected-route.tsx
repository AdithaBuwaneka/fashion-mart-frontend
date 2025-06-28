// src/components/shared/protected-route.tsx
'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/lib/hooks/use-auth'
import { UserRole } from '@/lib/types/auth'
import { canAccessRoute } from '@/lib/utils/auth-utils'
import { LoadingScreen } from '@/components/shared/loading-screen'
import { UnauthorizedAccess } from '@/components/shared/unauthorized-access'

interface ProtectedRouteProps {
  children: React.ReactNode
  allowedRoles?: UserRole[]
  requireAuth?: boolean
  redirectTo?: string
}

export function ProtectedRoute({ 
  children, 
  allowedRoles = [], 
  requireAuth = true,
  redirectTo 
}: ProtectedRouteProps) {
  const { user, isLoading, isSignedIn, role } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!isLoading) {
      // Redirect if authentication is required but user is not signed in
      if (requireAuth && !isSignedIn) {
        router.push('/sign-in')
        return
      }

      // Check role-based access
      if (isSignedIn && role && allowedRoles.length > 0) {
        if (!allowedRoles.includes(role)) {
          if (redirectTo) {
            router.push(redirectTo)
          }
          return
        }
      }
    }
  }, [isLoading, isSignedIn, role, requireAuth, allowedRoles, router, redirectTo])

  // Show loading while checking authentication
  if (isLoading) {
    return <LoadingScreen />
  }

  // Show error if authentication required but user not signed in
  if (requireAuth && !isSignedIn) {
    return null // Will redirect via useEffect
  }

  // Show unauthorized if user doesn't have required role
  if (isSignedIn && role && allowedRoles.length > 0 && !allowedRoles.includes(role)) {
    return <UnauthorizedAccess userRole={role} requiredRoles={allowedRoles} />
  }

  return <>{children}</>
}