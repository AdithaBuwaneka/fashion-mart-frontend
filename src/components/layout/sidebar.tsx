// src/components/layout/sidebar.tsx
'use client'

import { useState } from 'react'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils/cn'
import { useAuth } from '@/lib/hooks/use-auth'
import { getMenuItems, MenuItem } from '@/lib/navigation/menu-items'
import { ChevronDown, ChevronRight, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { UserAvatar } from '@/components/shared/user-avatar'
import Link from 'next/link'

interface SidebarProps {
  isOpen: boolean
  onClose: () => void
}

export function Sidebar({ isOpen, onClose }: SidebarProps) {
  const { user, role } = useAuth()
  const pathname = usePathname()
  const [expandedItems, setExpandedItems] = useState<string[]>([])

  const menuItems = role ? getMenuItems(role) : []

  const toggleExpanded = (title: string) => {
    setExpandedItems(prev => 
      prev.includes(title) 
        ? prev.filter(item => item !== title)
        : [...prev, title]
    )
  }

  const isActive = (href: string) => {
    return pathname === href || pathname.startsWith(href + '/')
  }

  const isExpanded = (title: string) => {
    return expandedItems.includes(title)
  }

  return (
    <>
      {/* Mobile backdrop */}
      {isOpen && (
        <div 
          className="fixed inset-0 z-20 bg-black bg-opacity-50 lg:hidden"
          onClick={onClose}
        />
      )}
      
      {/* Sidebar */}
      <aside className={cn(
        'fixed top-0 left-0 z-40 w-64 h-screen pt-20 bg-card border-r border-border transition-transform duration-300 ease-in-out',
        isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
      )}>
        <div className="h-full flex flex-col">
          {/* Mobile close button */}
          <div className="flex items-center justify-between p-4 lg:hidden">
            <span className="text-lg font-semibold">Menu</span>
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          </div>
          
          {/* User info */}
          {user && (
            <div className="p-4">
              <div className="flex items-center space-x-3 p-3 bg-muted rounded-lg">
                <UserAvatar size="sm" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-foreground truncate">
                    {user.firstName} {user.lastName}
                  </p>
                  <p className="text-xs text-muted-foreground capitalize">
                    {role?.replace('_', ' ')}
                  </p>
                </div>
              </div>
            </div>
          )}

          <Separator className="mx-4" />

          {/* Navigation */}
          <nav className="flex-1 overflow-y-auto p-4 space-y-2">
            {menuItems.map((item) => (
              <SidebarItem
                key={item.title}
                item={item}
                isActive={isActive}
                isExpanded={isExpanded}
                onToggleExpanded={toggleExpanded}
                onItemClick={onClose}
              />
            ))}
          </nav>

          {/* Footer */}
          <div className="p-4 border-t border-border">
            <p className="text-xs text-muted-foreground text-center">
              Fashion Mart v1.0
            </p>
          </div>
        </div>
      </aside>
    </>
  )
}

interface SidebarItemProps {
  item: MenuItem
  isActive: (href: string) => boolean
  isExpanded: (title: string) => boolean
  onToggleExpanded: (title: string) => void
  onItemClick: () => void
}

function SidebarItem({ 
  item, 
  isActive, 
  isExpanded, 
  onToggleExpanded, 
  onItemClick 
}: SidebarItemProps) {
  const hasChildren = item.children && item.children.length > 0
  const expanded = isExpanded(item.title)

  if (hasChildren) {
    return (
      <div>
        <Button
          variant="ghost"
          className={cn(
            'w-full justify-between h-10 px-3',
            isActive(item.href) && 'bg-muted text-foreground'
          )}
          onClick={() => onToggleExpanded(item.title)}
        >
          <div className="flex items-center">
            <item.icon className="h-4 w-4 mr-3" />
            <span className="text-sm font-medium">{item.title}</span>
            {item.badge && (
              <Badge variant="secondary" className="ml-2 text-xs">
                {item.badge}
              </Badge>
            )}
          </div>
          {expanded ? (
            <ChevronDown className="h-4 w-4" />
          ) : (
            <ChevronRight className="h-4 w-4" />
          )}
        </Button>
        
        {expanded && (
          <div className="ml-4 mt-1 space-y-1">
            {item.children?.map((child) => (
              <Link
                key={child.title}
                href={child.href}
                onClick={onItemClick}
                className={cn(
                  'flex items-center h-9 px-3 rounded-md text-sm font-medium transition-colors hover:bg-muted',
                  isActive(child.href) && 'bg-muted text-foreground'
                )}
              >
                <child.icon className="h-4 w-4 mr-3" />
                <span>{child.title}</span>
                {child.badge && (
                  <Badge variant="secondary" className="ml-auto text-xs">
                    {child.badge}
                  </Badge>
                )}
              </Link>
            ))}
          </div>
        )}
      </div>
    )
  }

  return (
    <Link
      href={item.href}
      onClick={onItemClick}
      className={cn(
        'flex items-center h-10 px-3 rounded-md text-sm font-medium transition-colors hover:bg-muted',
        isActive(item.href) && 'bg-muted text-foreground'
      )}
    >
      <item.icon className="h-4 w-4 mr-3" />
      <span>{item.title}</span>
      {item.badge && (
        <Badge variant="secondary" className="ml-auto text-xs">
          {item.badge}
        </Badge>
      )}
    </Link>
  )
}