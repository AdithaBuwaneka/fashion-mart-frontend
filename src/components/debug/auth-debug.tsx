// src/components/debug/auth-debug.tsx
'use client'

import { useAuth } from '@/lib/hooks/use-auth'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'

export function AuthDebug() {
  const auth = useAuth()

  const handleRefresh = () => {
    auth.refreshUser()
  }

  return (
    <Card className="max-w-md mx-auto mt-8">
      <CardHeader>
        <CardTitle>Authentication Debug</CardTitle>
        <CardDescription>Current authentication state</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <p><strong>Is Loading:</strong> {auth.isLoading.toString()}</p>
          <p><strong>Is Signed In:</strong> {auth.isSignedIn.toString()}</p>
          <p><strong>Role:</strong> {auth.role || 'null'}</p>
          <p><strong>User ID:</strong> {auth.user?.id || 'null'}</p>
          <p><strong>User Email:</strong> {auth.user?.email || 'null'}</p>
          <p><strong>Has Customer Role:</strong> {auth.hasRole('customer').toString()}</p>
          <p><strong>Has Customer Role (array):</strong> {auth.hasRole(['customer']).toString()}</p>
        </div>
        
        <div className="bg-muted p-3 rounded text-xs">
          <strong>Full User Object:</strong>
          <pre>{JSON.stringify(auth.user, null, 2)}</pre>
        </div>

        <div className="bg-muted p-3 rounded text-xs">
          <strong>Clerk User:</strong>
          <pre>{JSON.stringify(auth.clerkUser, null, 2)}</pre>
        </div>

        <Button onClick={handleRefresh} className="w-full">
          Refresh User Data
        </Button>
      </CardContent>
    </Card>
  )
}
