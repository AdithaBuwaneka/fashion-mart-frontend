// src/components/shared/loading-screen.tsx
import { Spinner } from '@/components/ui/spinner'

export function LoadingScreen() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="text-center">
        <Spinner size="lg" className="mx-auto mb-4" />
        <h2 className="text-xl font-semibold text-foreground mb-2">
          Loading Fashion Mart
        </h2>
        <p className="text-muted-foreground">
          Please wait while we prepare your experience...
        </p>
      </div>
    </div>
  )
}