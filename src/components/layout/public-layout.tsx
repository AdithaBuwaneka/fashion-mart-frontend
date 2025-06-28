// src/components/layout/public-layout.tsx
'use client'

import { useState } from 'react'
import { ShoppingBag, Menu, User, LogIn } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet'
import { SearchBar } from '@/components/shared/search-bar'
import { useAuth } from '@/lib/hooks/use-auth'
import { APP_CONFIG } from '@/lib/constants'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils/cn'

interface PublicLayoutProps {
  children: React.ReactNode
}

export function PublicLayout({ children }: PublicLayoutProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const { isSignedIn, role } = useAuth()
  const pathname = usePathname()

  const navigationItems = [
    { label: 'Products', href: '/products' },
    { label: 'Categories', href: '/categories' },
    { label: 'Designers', href: '/designers' },
    { label: 'About', href: '/about' },
    { label: 'Contact', href: '/contact' },
  ]

  const isActive = (href: string) => pathname === href

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Public Header */}
      <header className="sticky top-0 z-50 w-full bg-card border-b border-border backdrop-blur supports-[backdrop-filter]:bg-card/95">
        <div className="container mx-auto px-4">
          <div className="flex h-16 items-center justify-between">
            {/* Logo */}
            <Link href="/" className="flex items-center space-x-2">
              <ShoppingBag className="h-8 w-8 text-primary" />
              <span className="text-xl font-bold text-foreground">
                {APP_CONFIG.name}
              </span>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center space-x-6">
              {navigationItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    'text-sm font-medium transition-colors hover:text-primary',
                    isActive(item.href) 
                      ? 'text-primary' 
                      : 'text-muted-foreground'
                  )}
                >
                  {item.label}
                </Link>
              ))}
            </nav>

            {/* Right Section */}
            <div className="flex items-center space-x-4">
              {/* Search - Desktop */}
              <div className="hidden md:flex">
                <SearchBar />
              </div>

              {/* Auth Buttons */}
              {isSignedIn ? (
                <div className="flex items-center space-x-2">
                  <Button variant="outline" size="sm" asChild>
                    <Link href={`/${role}/dashboard`}>
                      <User className="h-4 w-4 mr-1" />
                      Dashboard
                    </Link>
                  </Button>
                </div>
              ) : (
                <div className="hidden md:flex items-center space-x-2">
                  <Button variant="ghost" size="sm" asChild>
                    <Link href="/sign-in">
                      <LogIn className="h-4 w-4 mr-1" />
                      Sign In
                    </Link>
                  </Button>
                  <Button size="sm" asChild>
                    <Link href="/sign-up">
                      Get Started
                    </Link>
                  </Button>
                </div>
              )}

              {/* Mobile Menu */}
              <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
                <SheetTrigger asChild>
                  <Button variant="ghost" size="sm" className="md:hidden">
                    <Menu className="h-6 w-6" />
                  </Button>
                </SheetTrigger>
                
                <SheetContent side="right" className="w-80">
                  <div className="flex flex-col space-y-6">
                    {/* Mobile Search */}
                    <div className="pt-6">
                      <SearchBar />
                    </div>

                    {/* Mobile Navigation */}
                    <nav className="flex flex-col space-y-4">
                      {navigationItems.map((item) => (
                        <Link
                          key={item.href}
                          href={item.href}
                          onClick={() => setIsMobileMenuOpen(false)}
                          className={cn(
                            'text-lg font-medium transition-colors hover:text-primary',
                            isActive(item.href) 
                              ? 'text-primary' 
                              : 'text-foreground'
                          )}
                        >
                          {item.label}
                        </Link>
                      ))}
                    </nav>

                    {/* Mobile Auth */}
                    <div className="border-t border-border pt-6">
                      {isSignedIn ? (
                        <Button className="w-full" asChild>
                          <Link href={`/${role}/dashboard`}>
                            <User className="h-4 w-4 mr-2" />
                            Go to Dashboard
                          </Link>
                        </Button>
                      ) : (
                        <div className="space-y-3">
                          <Button variant="outline" className="w-full" asChild>
                            <Link href="/sign-in">
                              <LogIn className="h-4 w-4 mr-2" />
                              Sign In
                            </Link>
                          </Button>
                          <Button className="w-full" asChild>
                            <Link href="/sign-up">
                              Get Started
                            </Link>
                          </Button>
                        </div>
                      )}
                    </div>
                  </div>
                </SheetContent>
              </Sheet>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1">
        {children}
      </main>

      {/* Public Footer */}
      <footer className="bg-card border-t border-border">
        <div className="container mx-auto px-4 py-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {/* Brand */}
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <ShoppingBag className="h-6 w-6 text-primary" />
                <span className="text-lg font-bold">{APP_CONFIG.name}</span>
              </div>
              <p className="text-sm text-muted-foreground">
                Premium fashion marketplace with design collaboration.
              </p>
            </div>

            {/* Quick Links */}
            <div className="space-y-4">
              <h4 className="text-sm font-semibold">Quick Links</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><Link href="/products" className="hover:text-foreground">Shop</Link></li>
                <li><Link href="/categories" className="hover:text-foreground">Categories</Link></li>
                <li><Link href="/designers" className="hover:text-foreground">Designers</Link></li>
                <li><Link href="/about" className="hover:text-foreground">About</Link></li>
              </ul>
            </div>

            {/* Support */}
            <div className="space-y-4">
              <h4 className="text-sm font-semibold">Support</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><Link href="/help" className="hover:text-foreground">Help Center</Link></li>
                <li><Link href="/contact" className="hover:text-foreground">Contact</Link></li>
                <li><Link href="/returns" className="hover:text-foreground">Returns</Link></li>
                <li><Link href="/shipping" className="hover:text-foreground">Shipping</Link></li>
              </ul>
            </div>

            {/* Legal */}
            <div className="space-y-4">
              <h4 className="text-sm font-semibold">Legal</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><Link href="/privacy" className="hover:text-foreground">Privacy</Link></li>
                <li><Link href="/terms" className="hover:text-foreground">Terms</Link></li>
                <li><Link href="/cookies" className="hover:text-foreground">Cookies</Link></li>
              </ul>
            </div>
          </div>

          <div className="border-t border-border mt-8 pt-8 flex flex-col md:flex-row justify-between items-center">
            <p className="text-sm text-muted-foreground">
              © {new Date().getFullYear()} {APP_CONFIG.name}. All rights reserved.
            </p>
            <p className="text-sm text-muted-foreground mt-2 md:mt-0">
              Version {APP_CONFIG.version}
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}
