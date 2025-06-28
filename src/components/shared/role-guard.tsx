// src/components/shared/role-guard.tsx
'use client'

import { useAuth } from '@/lib/hooks/use-auth'
import { UserRole } from '@/lib/types/auth'

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
  const { hasRole } = useAuth()

  if (!hasRole(allowedRoles)) {
    return showFallback ? <>{fallback}</> : null
  }

  return <>{children}</>
}