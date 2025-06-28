// src/components/layout/mobile-menu.tsx
'use client'

import { useState } from 'react'
import { Menu, X, Search } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet'
import { SearchBar } from '@/components/shared/search-bar'
import { useAuth } from '@/lib/hooks/use-auth'
import { getMenuItems } from '@/lib/navigation/menu-items'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils/cn'

export function MobileMenu() {
  const [isOpen, setIsOpen] = useState(false)
  const { role } = useAuth()
  const pathname = usePathname()

  const menuItems = role ? getMenuItems(role) : []

  const isActive = (href: string) => {
    return pathname === href || pathname.startsWith(href + '/')
  }

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="sm" className="md:hidden">
          <Menu className="h-6 w-6" />
        </Button>
      </SheetTrigger>
      
      <SheetContent side="left" className="w-80 p-0">
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="p-4 border-b border-border">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold">Menu</h2>
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => setIsOpen(false)}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Search */}
          <div className="p-4 border-b border-border">
            <SearchBar />
          </div>

          {/* Navigation */}
          <nav className="flex-1 overflow-y-auto p-4">
            <div className="space-y-2">
              {menuItems.map((item) => (
                <div key={item.title}>
                  <Link
                    href={item.href}
                    onClick={() => setIsOpen(false)}
                    className={cn(
                      'flex items-center h-10 px-3 rounded-md text-sm font-medium transition-colors hover:bg-muted',
                      isActive(item.href) && 'bg-muted text-foreground'
                    )}
                  >
                    <item.icon className="h-4 w-4 mr-3" />
                    <span>{item.title}</span>
                  </Link>
                  
                  {/* Sub-items */}
                  {item.children && (
                    <div className="ml-4 mt-1 space-y-1">
                      {item.children.map((child) => (
                        <Link
                          key={child.title}
                          href={child.href}
                          onClick={() => setIsOpen(false)}
                          className={cn(
                            'flex items-center h-9 px-3 rounded-md text-sm font-medium transition-colors hover:bg-muted',
                            isActive(child.href) && 'bg-muted text-foreground'
                          )}
                        >
                          <child.icon className="h-4 w-4 mr-3" />
                          <span>{child.title}</span>
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </nav>
        </div>
      </SheetContent>
    </Sheet>
  )
}