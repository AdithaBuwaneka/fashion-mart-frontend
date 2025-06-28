// src/components/shared/auth-guard.tsx
'use client'

import { useAuth } from '@/lib/hooks/use-auth'
import { UserRole } from '@/lib/types/auth'
import { LoadingScreen } from './loading-screen'
import { Button } from '@/components/ui/button'
import { LogIn } from 'lucide-react'

interface AuthGuardProps {
  children: React.ReactNode
  fallback?: React.ReactNode
  requireAuth?: boolean
  allowedRoles?: UserRole[]
}

export function AuthGuard({ 
  children, 
  fallback, 
  requireAuth = true, 
  allowedRoles = [] 
}: AuthGuardProps) {
  const { user, isLoading, isSignedIn, hasRole } = useAuth()

  if (isLoading) {
    return <LoadingScreen />
  }

  if (requireAuth && !isSignedIn) {
    return fallback || <SignInPrompt />
  }

  if (allowedRoles.length > 0 && !hasRole(allowedRoles)) {
    return fallback || <div>Access denied</div>
  }

  return <>{children}</>
}

function SignInPrompt() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="text-center max-w-md mx-auto p-6">
        <h2 className="text-2xl font-bold text-foreground mb-4">
          Sign In Required
        </h2>
        <p className="text-muted-foreground mb-6">
          You need to sign in to access this page. Please sign in with your account to continue.
        </p>
        <Button asChild size="lg" className="w-full">
          <a href="/sign-in">
            <LogIn className="w-4 h-4 mr-2" />
            Sign In
          </a>
        </Button>
      </div>
    </div>
  )
}