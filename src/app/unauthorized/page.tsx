// src/app/unauthorized/page.tsx
'use client'

import { AlertTriangle, Home, ArrowLeft } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/lib/hooks/use-auth'
import Link from 'next/link'

export default function UnauthorizedPage() {
  const router = useRouter()
  const { redirectToDashboard, user } = useAuth()

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <Card className="max-w-md w-full">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 p-3 bg-destructive/10 rounded-full w-fit">
            <AlertTriangle className="h-8 w-8 text-destructive" />
          </div>
          <CardTitle className="text-xl">Access Denied</CardTitle>
          <CardDescription>
            You don&apos;t have permission to access the requested page
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {user && (
            <div className="bg-muted p-4 rounded-lg">
              <p className="text-sm text-muted-foreground mb-2">
                <strong>Current Role:</strong> {user.role}
              </p>
              <p className="text-sm text-muted-foreground">
                Contact your administrator if you believe this is an error.
              </p>
            </div>
          )}
          
          <div className="flex flex-col space-y-2">
            {user ? (
              <Button onClick={redirectToDashboard} className="w-full">
                <Home className="w-4 h-4 mr-2" />
                Go to My Dashboard
              </Button>
            ) : (
              <Button asChild className="w-full">
                <Link href="/sign-in">
                  <Home className="w-4 h-4 mr-2" />
                  Sign In
                </Link>
              </Button>
            )}
            <Button 
              variant="outline" 
              onClick={() => router.back()}
              className="w-full"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Go Back
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
