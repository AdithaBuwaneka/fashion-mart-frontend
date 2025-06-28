
// src/lib/context/auth-context.tsx
'use client'

import { createContext, useContext, useEffect, useState, ReactNode, useCallback } from 'react'
import { useUser, useAuth as useClerkAuth } from '@clerk/nextjs'
import { User, UserRole } from '@/lib/types'
import { apiClient } from '@/lib/api/config'
import toast from 'react-hot-toast'
import { AxiosError } from 'axios'

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

      // Try to get existing user profile
      const response = await apiClient.get(`/auth/profile`)
      setUser(response.data.data) // Extract data from ApiResponse
    } catch (error) {
      console.error('Failed to fetch user data:', error)
      
      // If user doesn't exist in backend (404) or there's an auth issue (401), try to sync user
      const shouldSyncUser = error instanceof AxiosError && 
        (error.response?.status === 404 || error.response?.status === 401)
      
      if (shouldSyncUser) {
        try {
          const token = await getToken()
          if (token) {
            apiClient.defaults.headers.Authorization = `Bearer ${token}`
          }
          
          console.log('Syncing user with backend...', {
            clerkId: clerkUser.id,
            email: clerkUser.emailAddresses[0]?.emailAddress,
            firstName: clerkUser.firstName,
            lastName: clerkUser.lastName
          })

          // Validate required data before making the request
          if (!clerkUser.id) {
            throw new Error('Clerk user ID is missing')
          }

          const primaryEmail = clerkUser.emailAddresses[0]?.emailAddress
          if (!primaryEmail) {
            throw new Error('Primary email address is missing')
          }
          
          const syncData = {
            clerkId: clerkUser.id,
            email: primaryEmail,
            firstName: clerkUser.firstName || '',
            lastName: clerkUser.lastName || '',
            role: 'customer' // Default role
          }

          console.log('Sending sync data:', syncData)
          
          const newUserResponse = await apiClient.post('/auth/sync', syncData)
          setUser(newUserResponse.data.data) // Extract data from ApiResponse
          toast.success('Account synced successfully!')
        } catch (createError) {
          console.error('Failed to sync user:', createError)
          if (createError instanceof AxiosError) {
            console.error('Sync error details:', {
              status: createError.response?.status,
              data: createError.response?.data,
              message: createError.message,
              url: createError.config?.url,
              method: createError.config?.method
            })
            
            // Show specific error message based on status code
            if (createError.response?.status === 400) {
              toast.error(createError.response.data?.message || 'Invalid user data')
            } else if (createError.response?.status === 500) {
              toast.error('Server error. Please try again in a moment.')
            } else {
              toast.error('Failed to sync account. Please try refreshing the page.')
            }
          } else {
            const errorMessage = createError instanceof Error ? createError.message : 'Unknown error occurred'
            console.error('Non-Axios error:', errorMessage)
            toast.error(`Sync failed: ${errorMessage}`)
          }
        }
      } else {
        // For other errors, show a generic error message
        console.error('Auth error details:', error instanceof AxiosError ? {
          status: error.response?.status,
          data: error.response?.data,
          message: error.message
        } : error)
        toast.error('Authentication error. Please try signing in again.')
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
      setUser(response.data.data) // Extract data from ApiResponse
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