'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Input } from '@/components/ui/input'

import { Badge } from '@/components/ui/badge'
import { UserRole } from '@/lib/types'
import { apiClient } from '@/lib/api/config'
import toast from 'react-hot-toast'
import { useAuth } from '@/lib/hooks/use-auth'
import { Users, Search, UserCog } from 'lucide-react'

interface User {
  id: string
  email: string
  firstName: string
  lastName: string
  role: UserRole
  active: boolean
  createdAt: string
}

const roleOptions: { value: UserRole; label: string; description: string }[] = [
  { value: 'customer', label: 'Customer', description: 'Browse and purchase products' },
  { value: 'designer', label: 'Designer', description: 'Upload and manage designs' },
  { value: 'staff', label: 'Staff', description: 'Process orders and customer support' },
  { value: 'inventory_manager', label: 'Inventory Manager', description: 'Manage stock and inventory' },
  { value: 'admin', label: 'Administrator', description: 'Full system access' }
]

export function UserRoleManager() {
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [updatingRole, setUpdatingRole] = useState<string | null>(null)
  const { user: currentUser } = useAuth()

  const filteredUsers = users.filter(user => 
    user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.firstName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.lastName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.id.includes(searchTerm)
  )

  const fetchUsers = async () => {
    try {
      setLoading(true)
      const response = await apiClient.get('/admin/users')
      setUsers(response.data.data || [])
    } catch (error) {
      console.error('Failed to fetch users:', error)
      toast.error('Failed to load users')
    } finally {
      setLoading(false)
    }
  }

  const updateUserRole = async (userId: string, newRole: UserRole) => {
    if (userId === currentUser?.id && newRole !== 'admin') {
      toast.error('You cannot remove your own admin privileges')
      return
    }

    try {
      setUpdatingRole(userId)
      // Use admin endpoint for role updates
      await apiClient.patch(`/admin/users/${userId}/role`, { role: newRole })
      
      // Update local state
      setUsers(users.map(user => 
        user.id === userId ? { ...user, role: newRole } : user
      ))
      
      toast.success(`User role updated to ${roleOptions.find(r => r.value === newRole)?.label || newRole}`)
    } catch (error) {
      console.error('Failed to update user role:', error)
      const errorMessage = (error as { response?: { data?: { message?: string } } })?.response?.data?.message || 'Failed to update user role'
      toast.error(errorMessage)
    } finally {
      setUpdatingRole(null)
    }
  }

  useEffect(() => {
    fetchUsers()
  }, [])

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <UserCog className="h-5 w-5" />
            User Role Management
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">Loading users...</div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <UserCog className="h-5 w-5" />
          User Role Management
        </CardTitle>
        <CardDescription>
          Manage user roles and permissions
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Search */}
        <div className="flex items-center space-x-2">
          <Search className="h-4 w-4" />
          <Input
            placeholder="Search users by email, name, or ID..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="flex-1"
          />
        </div>

        {/* Quick Action for the specific user mentioned in logs */}
        <Card className="border-amber-200 bg-amber-50">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm">🚨 Access Denied Issue</CardTitle>
            <CardDescription className="text-xs">
              User trying to access admin features but has customer role
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-mono">user_2z7oU3MvRhDNS0S6GzNCO7xDL4M</p>
                <p className="text-xs text-muted-foreground">Currently: Customer</p>
              </div>
              <div className="flex gap-2">
                <Button
                  size="sm"
                  onClick={() => updateUserRole('user_2z7oU3MvRhDNS0S6GzNCO7xDL4M', 'admin')}
                  disabled={updatingRole === 'user_2z7oU3MvRhDNS0S6GzNCO7xDL4M'}
                  className="bg-green-600 hover:bg-green-700"
                >
                  {updatingRole === 'user_2z7oU3MvRhDNS0S6GzNCO7xDL4M' ? 'Updating...' : 'Make Admin'}
                </Button>
                <Select 
                  onValueChange={(role) => updateUserRole('user_2z7oU3MvRhDNS0S6GzNCO7xDL4M', role as UserRole)}
                  disabled={updatingRole === 'user_2z7oU3MvRhDNS0S6GzNCO7xDL4M'}
                >
                  <SelectTrigger className="w-[140px]">
                    <SelectValue placeholder="Select role" />
                  </SelectTrigger>
                  <SelectContent>
                    {roleOptions.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Users List */}
        <div className="space-y-3">
          {filteredUsers.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              {searchTerm ? 'No users found matching your search' : 'No users found'}
            </div>
          ) : (
            filteredUsers.map((user) => (
              <Card key={user.id} className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className="font-medium">
                        {user.firstName} {user.lastName}
                      </span>
                      {user.id === currentUser?.id && (
                        <Badge variant="secondary" className="text-xs">You</Badge>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground">{user.email}</p>
                    <p className="text-xs text-muted-foreground font-mono">{user.id}</p>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <Badge variant="outline">
                      {roleOptions.find(r => r.value === user.role)?.label || user.role}
                    </Badge>
                    
                    <Select 
                      value={user.role}
                      onValueChange={(role) => updateUserRole(user.id, role as UserRole)}
                      disabled={updatingRole === user.id}
                    >
                      <SelectTrigger className="w-[140px]">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {roleOptions.map((option) => (
                          <SelectItem key={option.value} value={option.value}>
                            <div>
                              <div className="font-medium">{option.label}</div>
                              <div className="text-xs text-muted-foreground">
                                {option.description}
                              </div>
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </Card>
            ))
          )}
        </div>

        <div className="pt-4 border-t">
          <Button onClick={fetchUsers} variant="outline" size="sm">
            <Users className="h-4 w-4 mr-2" />
            Refresh Users
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
