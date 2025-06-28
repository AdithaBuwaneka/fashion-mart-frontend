// src/components/layout/footer.tsx
'use client'

import { useAuth } from '@/lib/hooks/use-auth'
import { Separator } from '@/components/ui/separator'
import Link from 'next/link'

export function Footer() {
  const { role } = useAuth()

  const currentYear = new Date().getFullYear()

  const footerLinks = {
    support: [
      { label: 'Help Center', href: '/help' },
      { label: 'Contact Support', href: '/support' },
      { label: 'Documentation', href: '/docs' },
      { label: 'Status', href: '/status' }
    ],
    legal: [
      { label: 'Privacy Policy', href: '/privacy' },
      { label: 'Terms of Service', href: '/terms' },
      { label: 'Cookie Policy', href: '/cookies' },
      { label: 'GDPR', href: '/gdpr' }
    ],
    company: [
      { label: 'About Us', href: '/about' },
      { label: 'Careers', href: '/careers' },
      { label: 'Blog', href: '/blog' },
      { label: 'Press', href: '/press' }
    ]
  }

  return (
    <footer className="bg-card border-t border-border mt-auto">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="space-y-4">
            <h3 className="text-lg font-bold text-foreground">Fashion Mart</h3>
            <p className="text-sm text-muted-foreground">
              Complete fashion platform with design collaboration, e-commerce, and inventory management.
            </p>
            <div className="text-sm text-muted-foreground">
              <p>&copy; {currentYear} Fashion Mart</p>
              <p>All rights reserved.</p>
            </div>
          </div>

          {/* Support */}
          <div className="space-y-4">
            <h4 className="text-sm font-semibold text-foreground">Support</h4>
            <ul className="space-y-2">
              {footerLinks.support.map((link) => (
                <li key={link.label}>
                  <Link 
                    href={link.href}
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal */}
          <div className="space-y-4">
            <h4 className="text-sm font-semibold text-foreground">Legal</h4>
            <ul className="space-y-2">
              {footerLinks.legal.map((link) => (
                <li key={link.label}>
                  <Link 
                    href={link.href}
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div className="space-y-4">
            <h4 className="text-sm font-semibold text-foreground">Company</h4>
            <ul className="space-y-2">
              {footerLinks.company.map((link) => (
                <li key={link.label}>
                  <Link 
                    href={link.href}
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <Separator className="my-6" />

        <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
          <div className="text-sm text-muted-foreground">
            Built with Next.js, Tailwind CSS, and Clerk Authentication
          </div>
          <div className="flex items-center space-x-4 text-sm text-muted-foreground">
            <span>Version 1.0.0</span>
            {role && (
              <span className="capitalize">
                Logged in as {role.replace('_', ' ')}
              </span>
            )}
          </div>
        </div>
      </div>
    </footer>
  )
}