
// src/lib/context/auth-context.tsx
'use client'

import { createContext, useContext, useEffect, useState, ReactNode, useCallback } from 'react'
import { useUser, useAuth as useClerkAuth } from '@clerk/nextjs'
import { User, UserRole } from '@/lib/types'
import { apiClient } from '@/lib/api/config'
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
  const { getToken } = useClerkAuth()
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  const fetchUserData = useCallback(async () => {
    if (!clerkUser || !isSignedIn) {
      setUser(null)
      setIsLoading(false)
      return
    }

    try {
      // Get auth token from Clerk and set it for API calls
      const token = await getToken()
      if (token) {
        apiClient.defaults.headers.Authorization = `Bearer ${token}`
      }

      const response = await apiClient.get(`/auth/profile`)
      setUser(response.data)
    } catch (error) {
      console.error('Failed to fetch user data:', error)
      // If user doesn't exist in backend, create them
      try {
        const token = await getToken()
        if (token) {
          apiClient.defaults.headers.Authorization = `Bearer ${token}`
        }
        
        const newUserResponse = await apiClient.post('/auth/sync', {
          clerkId: clerkUser.id,
          email: clerkUser.emailAddresses[0]?.emailAddress,
          firstName: clerkUser.firstName,
          lastName: clerkUser.lastName,
          role: 'customer' // Default role
        })
        setUser(newUserResponse.data)
        toast.success('Account created successfully!')
      } catch (createError) {
        console.error('Failed to create user:', createError)
        toast.error('Failed to create account. Please try again.')
      }
    } finally {
      setIsLoading(false)
    }
  }, [clerkUser, isSignedIn, getToken])

  const refreshUser = async () => {
    setIsLoading(true)
    await fetchUserData()
  }

  const updateUserRole = async (role: UserRole) => {
    if (!user) return
    
    try {
      const token = await getToken()
      if (token) {
        apiClient.defaults.headers.Authorization = `Bearer ${token}`
      }
      
      const response = await apiClient.patch(`/auth/user/${user.id}/role`, { role })
      setUser(response.data)
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
  }, [isLoaded, fetchUserData])

  const value: AuthContextType = {
    user,
    isLoading,
    isSignedIn: Boolean(isSignedIn && user),
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