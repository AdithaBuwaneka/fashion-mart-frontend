// src/app/(dashboard)/layout.tsx (Updated)
'use client'

// Force dynamic rendering to prevent build-time prerendering issues
export const dynamic = 'force-dynamic'

import { useState } from 'react'
import { ProtectedRoute } from '@/components/shared/protected-route'
import { ErrorBoundary } from '@/components/shared/error-boundary'
import { Navbar } from '@/components/layout/navbar'
import { Sidebar } from '@/components/layout/sidebar'
import { Breadcrumb } from '@/components/layout/breadcrumb'

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false)

  return (
    <ProtectedRoute requireAuth>
      <ErrorBoundary>
        <div className="min-h-screen bg-background flex flex-col">
          <Navbar onToggleSidebar={() => setSidebarOpen(!sidebarOpen)} />
          
          <div className="flex flex-1 pt-16">
            <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
            
            <main className="flex-1 lg:ml-64">
              <div className="container-padding section-spacing">
                <ErrorBoundary>
                  <Breadcrumb />
                  <div className="fade-in">
                    {children}
                  </div>
                </ErrorBoundary>
              </div>
            </main>
          </div>
        </div>
      </ErrorBoundary>
    </ProtectedRoute>
  )
}