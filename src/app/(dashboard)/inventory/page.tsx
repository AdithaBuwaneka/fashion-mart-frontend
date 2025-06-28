// src/app/(dashboard)/inventory/page.tsx
'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/lib/hooks/use-auth'
import { LoadingScreen } from '@/components/shared/loading-screen'

export default function InventoryRedirectPage() {
  const { user, isLoading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!isLoading && user?.role === 'inventory_manager') {
      router.replace('/inventory/dashboard')
    }
  }, [isLoading, user, router])

  if (isLoading) {
    return <LoadingScreen />
  }

  return <LoadingScreen />
}
