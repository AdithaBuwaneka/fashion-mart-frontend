// src/app/(auth)/layout.tsx
import { ReactNode } from 'react'

export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/5 via-background to-secondary/5">
      <div className="w-full max-w-md p-6">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-foreground">Fashion Mart</h1>
          <p className="text-muted-foreground mt-2">
            Premium Fashion Platform
          </p>
        </div>
        {children}
      </div>
    </div>
  )
}