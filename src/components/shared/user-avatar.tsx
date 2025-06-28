// src/components/shared/user-avatar.tsx
'use client'

import { useUser } from '@clerk/nextjs'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { User } from 'lucide-react'

interface UserAvatarProps {
  size?: 'sm' | 'md' | 'lg'
  className?: string
  showName?: boolean
}

export function UserAvatar({ size = 'md', className, showName = false }: UserAvatarProps) {
  const { user } = useUser()

  const sizeClasses = {
    sm: 'h-8 w-8',
    md: 'h-10 w-10',
    lg: 'h-12 w-12'
  }

  const getInitials = (firstName?: string, lastName?: string) => {
    if (!firstName && !lastName) return 'U'
    return `${firstName?.[0] || ''}${lastName?.[0] || ''}`.toUpperCase()
  }

  if (!user) {
    return (
      <Avatar className={`${sizeClasses[size]} ${className}`}>
        <AvatarFallback>
          <User className="h-4 w-4" />
        </AvatarFallback>
      </Avatar>
    )
  }

  return (
    <div className="flex items-center space-x-3">
      <Avatar className={`${sizeClasses[size]} ${className}`}>
        <AvatarImage src={user.imageUrl} alt={user.fullName || 'User'} />
        <AvatarFallback>
          {getInitials(user.firstName ?? undefined, user.lastName ?? undefined)}
        </AvatarFallback>
      </Avatar>
      {showName && (
        <div className="flex flex-col">
          <span className="text-sm font-medium text-foreground">
            {user.fullName || 'User'}
          </span>
          <span className="text-xs text-muted-foreground">
            {user.primaryEmailAddress?.emailAddress}
          </span>
        </div>
      )}
    </div>
  )
}