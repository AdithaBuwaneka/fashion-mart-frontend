// src/lib/hooks/use-auth.ts
import { useAuth as useAuthContext } from '@/lib/context/auth-context'
import { useUser, useClerk } from '@clerk/nextjs'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import { UserRole } from '@/lib/types'
import { getDashboardRoute } from '@/lib/utils/auth-utils'

export const useAuth = () => {
  const authContext = useAuthContext()
  const { user: clerkUser } = useUser()
  const { signOut } = useClerk()
  const router = useRouter()

  const logout = async () => {
    try {
      await signOut()
      router.push('/')
    } catch (error) {
      console.error('Logout failed:', error)
    }
  }

  const redirectToDashboard = () => {
    if (!authContext.user) return

    const route = getDashboardRoute(authContext.user.role)
    router.push(route)
  }

  return {
    ...authContext,
    clerkUser,
    logout,
    redirectToDashboard
  }
}

export function useRequireAuth(allowedRoles?: UserRole | UserRole[]) {
  const auth = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!auth.isLoading) {
      if (!auth.isSignedIn) {
        router.push('/sign-in')
        return
      }

      if (allowedRoles && !auth.hasRole(allowedRoles)) {
        router.push('/unauthorized')
        return
      }
    }
  }, [auth.isLoading, auth.isSignedIn, auth, allowedRoles, router])

  return auth
}

export function useRoleGuard(allowedRoles: UserRole | UserRole[]) {
  const auth = useAuth()
  
  if (auth.isLoading) {
    return { isLoading: true, hasAccess: false }
  }

  if (!auth.isSignedIn) {
    return { isLoading: false, hasAccess: false }
  }

  const hasAccess = auth.hasRole(allowedRoles)
  return { isLoading: false, hasAccess }
}

export function useUserRole() {
  const auth = useAuth()
  return auth.role
}

export function useIsRole(role: UserRole) {
  const auth = useAuth()
  return auth.hasRole(role)
}

// Helper hooks for specific roles
export function useIsAdmin() {
  return useIsRole('admin')
}

export function useIsCustomer() {
  return useIsRole('customer')
}

export function useIsDesigner() {
  return useIsRole('designer')
}

export function useIsStaff() {
  return useIsRole('staff')
}

export function useIsInventory() {
  return useIsRole('inventory_manager')
}