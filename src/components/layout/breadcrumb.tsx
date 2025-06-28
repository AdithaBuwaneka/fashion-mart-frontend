// src/components/layout/breadcrumb.tsx
'use client'

import { usePathname } from 'next/navigation'
import { ChevronRight, Home } from 'lucide-react'
import { generateBreadcrumbs } from '@/lib/navigation/breadcrumb-utils'
import Link from 'next/link'
import { cn } from '@/lib/utils/cn'

export function Breadcrumb() {
  const pathname = usePathname()
  const breadcrumbs = generateBreadcrumbs(pathname)

  if (breadcrumbs.length <= 1) {
    return null
  }

  return (
    <nav className="flex items-center space-x-1 text-sm text-muted-foreground mb-6">
      <Home className="h-4 w-4" />
      {breadcrumbs.map((item, index) => (
        <div key={index} className="flex items-center space-x-1">
          <ChevronRight className="h-4 w-4" />
          {item.href ? (
            <Link
              href={item.href}
              className="hover:text-foreground transition-colors"
            >
              {item.label}
            </Link>
          ) : (
            <span className={cn(
              item.isCurrentPage && 'text-foreground font-medium'
            )}>
              {item.label}
            </span>
          )}
        </div>
      ))}
    </nav>
  )
}