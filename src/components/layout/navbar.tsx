// src/components/layout/navbar.tsx
'use client'

import { useState } from 'react'
import { Menu, Search, Bell, Settings, LogOut, User, ShoppingBag } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuLabel, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu'
import { UserAvatar } from '@/components/shared/user-avatar'
import { NotificationBell } from '@/components/shared/notification-bell'
import { SearchBar } from '@/components/shared/search-bar'
import { useAuth } from '@/lib/hooks/use-auth'
import { useClerk } from '@clerk/nextjs'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

interface NavbarProps {
  onToggleSidebar: () => void
}

export function Navbar({ onToggleSidebar }: NavbarProps) {
  const { user, role } = useAuth()
  const { signOut } = useClerk()
  const router = useRouter()
  const [isSearchOpen, setIsSearchOpen] = useState(false)

  const handleSignOut = async () => {
    await signOut()
    router.push('/')
  }

  const getRoleDisplayName = (userRole: string) => {
    const roleNames: Record<string, string> = {
      admin: 'Administrator',
      customer: 'Customer',
      designer: 'Designer',
      staff: 'Staff Member',
      inventory_manager: 'Inventory Manager'
    }
    return roleNames[userRole] || userRole
  }

  return (
    <nav className="fixed top-0 z-50 w-full bg-card border-b border-border backdrop-blur supports-[backdrop-filter]:bg-card/95">
      <div className="px-3 py-3 lg:px-5 lg:pl-3">
        <div className="flex items-center justify-between">
          {/* Left Section */}
          <div className="flex items-center justify-start">
            <Button
              variant="ghost"
              size="sm"
              onClick={onToggleSidebar}
              className="lg:hidden"
              aria-label="Toggle sidebar"
            >
              <Menu className="h-6 w-6" />
            </Button>
            
            <div className="flex ml-2 md:mr-24">
              <Link href="/" className="flex items-center">
                <ShoppingBag className="h-8 w-8 text-primary mr-2" />
                <span className="self-center text-xl font-bold sm:text-2xl whitespace-nowrap text-foreground">
                  Fashion Mart
                </span>
              </Link>
            </div>
          </div>

          {/* Center Section - Search */}
          <div className="hidden md:flex flex-1 max-w-lg mx-4">
            <SearchBar />
          </div>

          {/* Right Section */}
          <div className="flex items-center space-x-3">
            {/* Mobile Search Toggle */}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsSearchOpen(!isSearchOpen)}
              className="md:hidden"
              aria-label="Toggle search"
            >
              <Search className="h-5 w-5" />
            </Button>

            {/* Notifications */}
            <NotificationBell />

            {/* User Menu */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                  <UserAvatar size="sm" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end" forceMount>
                <DropdownMenuLabel className="font-normal">
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none">
                      {user?.firstName} {user?.lastName}
                    </p>
                    <p className="text-xs leading-none text-muted-foreground">
                      {user?.email}
                    </p>
                    {role && (
                      <Badge variant="secondary" className="w-fit text-xs">
                        {getRoleDisplayName(role)}
                      </Badge>
                    )}
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                
                <DropdownMenuItem asChild>
                  <Link href={`/${role}/profile`} className="cursor-pointer">
                    <User className="mr-2 h-4 w-4" />
                    <span>Profile</span>
                  </Link>
                </DropdownMenuItem>
                
                <DropdownMenuItem asChild>
                  <Link href={`/${role}/settings`} className="cursor-pointer">
                    <Settings className="mr-2 h-4 w-4" />
                    <span>Settings</span>
                  </Link>
                </DropdownMenuItem>
                
                <DropdownMenuSeparator />
                
                <DropdownMenuItem onClick={handleSignOut} className="cursor-pointer">
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Log out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        {/* Mobile Search Bar */}
        {isSearchOpen && (
          <div className="md:hidden mt-3 pb-3">
            <SearchBar />
          </div>
        )}
      </div>
    </nav>
  )
}