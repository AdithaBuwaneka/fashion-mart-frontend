
// src/lib/context/auth-context.tsx
'use client'

import { createContext, useContext, useEffect, useState, ReactNode } from 'react'
import { useUser } from '@clerk/nextjs'
import { User, UserRole } from '@/lib/types/auth'
import { apiClient } from '@/lib/utils/api-client'
import toast from 'react-hot-toast'

interface AuthContextType {
  user: User | null
  isLoading: boolean
  isSignedIn: boolean
  role: UserRole | null
  hasRole: (roles: UserRole | UserRole[]) => boolean
  refreshUser: () => Promise<void>
  updateUserRole: (role: UserRole) => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const { user: clerkUser, isLoaded, isSignedIn } = useUser()
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  const fetchUserData = async () => {
    if (!clerkUser || !isSignedIn) {
      setUser(null)
      setIsLoading(false)
      return
    }

    try {
      const userData = await apiClient.get<User>(`/auth/user/${clerkUser.id}`)
      setUser(userData)
    } catch (error) {
      console.error('Failed to fetch user data:', error)
      // If user doesn't exist in backend, create them
      if (error instanceof Error && error.message.includes('404')) {
        try {
          const newUser = await apiClient.post<User>('/auth/register', {
            clerkId: clerkUser.id,
            email: clerkUser.emailAddresses[0]?.emailAddress,
            firstName: clerkUser.firstName,
            lastName: clerkUser.lastName,
            role: 'customer' // Default role
          })
          setUser(newUser)
          toast.success('Account created successfully!')
        } catch (createError) {
          console.error('Failed to create user:', createError)
          toast.error('Failed to create account. Please try again.')
        }
      }
    } finally {
      setIsLoading(false)
    }
  }

  const refreshUser = async () => {
    if (!clerkUser) return
    setIsLoading(true)
    await fetchUserData()
  }

  const updateUserRole = async (role: UserRole) => {
    if (!user) return
    
    try {
      const updatedUser = await apiClient.patch<User>(`/auth/user/${user.id}/role`, { role })
      setUser(updatedUser)
      toast.success('User role updated successfully!')
    } catch (error) {
      console.error('Failed to update user role:', error)
      toast.error('Failed to update user role')
    }
  }

  const hasRole = (roles: UserRole | UserRole[]) => {
    if (!user) return false
    const roleArray = Array.isArray(roles) ? roles : [roles]
    return roleArray.includes(user.role)
  }

  useEffect(() => {
    if (isLoaded) {
      fetchUserData()
    }
  }, [clerkUser, isLoaded, isSignedIn])

  const value: AuthContextType = {
    user,
    isLoading,
    isSignedIn: isSignedIn && !!user,
    role: user?.role || null,
    hasRole,
    refreshUser,
    updateUserRole
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}