// src/components/shared/unauthorized-access.tsx
import { AlertTriangle, Home, ArrowLeft } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { UserRole } from '@/lib/types'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/lib/hooks/use-auth'

interface UnauthorizedAccessProps {
  userRole: UserRole | null
  requiredRoles: UserRole[]
}

const getUserRoleDisplayName = (role: UserRole): string => {
  const roleNames: Record<UserRole, string> = {
    admin: 'Administrator',
    customer: 'Customer',
    designer: 'Designer',
    staff: 'Staff',
    inventory_manager: 'Inventory Manager'
  }
  return roleNames[role] || role
}

export function UnauthorizedAccess({ userRole, requiredRoles }: UnauthorizedAccessProps) {
  const router = useRouter()
  const { redirectToDashboard } = useAuth()

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <Card className="max-w-md w-full">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 p-3 bg-destructive/10 rounded-full w-fit">
            <AlertTriangle className="h-8 w-8 text-destructive" />
          </div>
          <CardTitle className="text-xl">Access Denied</CardTitle>
          <CardDescription>
            You don&apos;t have permission to access this page
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="bg-muted p-4 rounded-lg">
            <p className="text-sm text-muted-foreground mb-2">
              <strong>Your Role:</strong> {userRole ? getUserRoleDisplayName(userRole) : 'Unknown'}
            </p>
            <p className="text-sm text-muted-foreground">
              <strong>Required Roles:</strong>{' '}
              {requiredRoles.map(role => getUserRoleDisplayName(role)).join(', ')}
            </p>
          </div>
          
          <div className="flex flex-col space-y-2">
            <Button onClick={redirectToDashboard} className="w-full">
              <Home className="w-4 h-4 mr-2" />
              Go to My Dashboard
            </Button>
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