// src/app/dashboard/page.tsx
'use client'

import { useEffect } from 'react'
import { useAuth } from '@/lib/hooks/use-auth'
import { LoadingScreen } from '@/components/shared/loading-screen'

export default function DashboardPage() {
  const { redirectToDashboard, isLoading, isSignedIn } = useAuth()

  useEffect(() => {
    if (!isLoading && isSignedIn) {
      redirectToDashboard()
    }
  }, [isLoading, isSignedIn, redirectToDashboard])

  return <LoadingScreen />
}