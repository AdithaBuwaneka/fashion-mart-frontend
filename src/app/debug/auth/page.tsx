// src/app/debug/auth/page.tsx
'use client'

import { AuthDebug } from '@/components/debug/auth-debug'

export default function AuthDebugPage() {
  return (
    <div className="container mx-auto p-8">
      <h1 className="text-3xl font-bold mb-8">Authentication Debug</h1>
      <AuthDebug />
    </div>
  )
}
