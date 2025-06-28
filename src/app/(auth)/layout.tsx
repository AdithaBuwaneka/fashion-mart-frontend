// src/app/(auth)/layout.tsx
import { ReactNode } from 'react'
import { ShoppingBag } from 'lucide-react'
import Link from 'next/link'

export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted/20">
      {/* Header */}
      <div className="absolute top-0 left-0 right-0 p-6 z-10">
        <Link href="/" className="flex items-center gap-2 text-foreground hover:text-primary transition-colors">
          <ShoppingBag className="h-6 w-6" />
          <span className="text-xl font-bold">Fashion Mart</span>
        </Link>
      </div>

      {/* Content */}
      <div className="flex min-h-screen">
        {children}
      </div>

      {/* Footer */}
      <div className="absolute bottom-0 left-0 right-0 p-6 text-center text-sm text-muted-foreground">
        <p>&copy; 2025 Fashion Mart. All rights reserved.</p>
      </div>
    </div>
  )
}