// src/components/shared/role-guard.tsx
'use client'

import { useAuth } from '@/lib/hooks/use-auth'
import { UserRole } from '@/lib/types'
import { UnauthorizedAccess } from './unauthorized-access'

interface RoleGuardProps {
  children: React.ReactNode
  allowedRoles: UserRole[]
  fallback?: React.ReactNode
  showFallback?: boolean
}

export function RoleGuard({ 
  children, 
  allowedRoles, 
  fallback = null, 
  showFallback = false 
}: RoleGuardProps) {
  const { hasRole, isLoading, user } = useAuth()

  // Show loading state
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    )
  }

  // Check role access
  if (!hasRole(allowedRoles)) {
    if (showFallback) {
      return <>{fallback}</>
    }
    
    // Show unauthorized access component instead of nothing
    return <UnauthorizedAccess userRole={user?.role || null} requiredRoles={allowedRoles} />
  }

  return <>{children}</>
}