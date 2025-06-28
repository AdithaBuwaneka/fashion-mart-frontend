// src/lib/hooks/use-auth.ts
import { useAuth as useAuthContext } from '@/lib/context/auth-context'
import { useUser, useClerk } from '@clerk/nextjs'
import { useRouter } from 'next/navigation'
import { UserRole } from '@/lib/types/auth'

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

    const dashboardRoutes: Record<UserRole, string> = {
      admin: '/admin/dashboard',
      customer: '/customer/dashboard',
      designer: '/designer/dashboard',
      staff: '/staff/dashboard',
      inventory_manager: '/inventory/dashboard'
    }

    const route = dashboardRoutes[authContext.user.role]
    if (route) {
      router.push(route)
    }
  }

  return {
    ...authContext,
    clerkUser,
    logout,
    redirectToDashboard
  }
}