// src/app/auth-test/page.tsx
'use client'

import { useAuth } from '@/lib/hooks/use-auth'
import { useUser } from '@clerk/nextjs'
import { useState, useEffect } from 'react'

export default function AuthTestPage() {
  const auth = useAuth()
  const { user: clerkUser } = useUser()
  const [debugInfo, setDebugInfo] = useState<Record<string, unknown>>({})

  useEffect(() => {
    const info = {
      authContext: {
        isLoading: auth.isLoading,
        isSignedIn: auth.isSignedIn,
        role: auth.role,
        user: auth.user,
        hasCustomerRole: auth.hasRole('customer'),
        hasCustomerRoleArray: auth.hasRole(['customer'])
      },
      clerkUser: {
        id: clerkUser?.id,
        email: clerkUser?.emailAddresses?.[0]?.emailAddress,
        firstName: clerkUser?.firstName,
        lastName: clerkUser?.lastName
      }
    }
    setDebugInfo(info)
  }, [auth, clerkUser])

  return (
    <div className="container mx-auto p-8">
      <h1 className="text-3xl font-bold mb-8">Authentication Test</h1>
      
      <div className="space-y-6">
        <div className="bg-gray-100 p-4 rounded">
          <h2 className="text-xl font-semibold mb-4">Auth Context State</h2>
          <pre className="text-sm overflow-auto">
            {JSON.stringify(debugInfo.authContext, null, 2)}
          </pre>
        </div>

        <div className="bg-blue-100 p-4 rounded">
          <h2 className="text-xl font-semibold mb-4">Clerk User</h2>
          <pre className="text-sm overflow-auto">
            {JSON.stringify(debugInfo.clerkUser, null, 2)}
          </pre>
        </div>

        <button 
          onClick={() => auth.refreshUser()}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Refresh User Data
        </button>
      </div>
    </div>
  )
}
