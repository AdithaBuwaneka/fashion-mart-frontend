// src/app/page.tsx
'use client'

import { useEffect } from 'react'
import { useAuth } from '@/lib/hooks/use-auth'
import { LoadingScreen } from '@/components/shared/loading-screen'
import { PublicLayout } from '@/components/layout/public-layout'
import { Button } from '@/components/ui/button'
import { ArrowRight, ShoppingBag, Palette, Users, Package } from 'lucide-react'
import Link from 'next/link'

export default function HomePage() {
  const { isSignedIn, isLoading, redirectToDashboard } = useAuth()

  useEffect(() => {
    if (!isLoading && isSignedIn) {
      redirectToDashboard()
    }
  }, [isSignedIn, isLoading, redirectToDashboard])

  if (isLoading) {
    return <LoadingScreen />
  }

  if (isSignedIn) {
    return <LoadingScreen /> // Will redirect via useEffect
  }

  return (
    <PublicLayout>
      <div className="bg-gradient-to-br from-primary/5 via-background to-secondary/5">
        {/* Hero Section */}
        <div className="container mx-auto px-4 py-16">
          <div className="text-center max-w-4xl mx-auto">
            <h1 className="text-5xl md:text-6xl font-bold text-foreground mb-6">
              Fashion <span className="text-primary">Revolution</span>
            </h1>
            <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              The ultimate platform for fashion collaboration, e-commerce, and design management. 
              Connect designers, manage inventory, and delight customers.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
              <Button asChild size="lg" className="text-lg px-8 py-6">
                <Link href="/sign-up">
                  Get Started
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="text-lg px-8 py-6">
                <Link href="/sign-in">
                  Sign In
                </Link>
              </Button>
            </div>

            {/* Features Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mt-16">
              <FeatureCard
                icon={<ShoppingBag className="h-8 w-8 text-primary" />}
                title="E-Commerce"
                description="Complete shopping experience with cart, checkout, and order management"
              />
              <FeatureCard
                icon={<Palette className="h-8 w-8 text-primary" />}
                title="Design Hub"
                description="Upload, manage, and collaborate on fashion designs with approval workflow"
              />
              <FeatureCard
                icon={<Package className="h-8 w-8 text-primary" />}
                title="Inventory"
                description="Real-time stock management with low-stock alerts and automated reports"
              />
              <FeatureCard
                icon={<Users className="h-8 w-8 text-primary" />}
                title="Multi-Role"
                description="Admin, Designer, Customer, Staff, and Inventory Manager interfaces"
              />
            </div>
          </div>
        </div>

        {/* Additional Content Sections */}
        <div className="container mx-auto px-4 py-16">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-foreground mb-4">
              Built for Every Role
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              From administrators to customers, our platform provides tailored experiences for every user type.
            </p>
          </div>
          
          <div className="text-center">
            <Button asChild size="lg" variant="outline">
              <Link href="/about">
                Learn More About Fashion Mart
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </PublicLayout>
  )
}

function FeatureCard({ icon, title, description }: {
  icon: React.ReactNode
  title: string
  description: string
}) {
  return (
    <div className="bg-card border border-border rounded-lg p-6 text-center hover:shadow-lg transition-shadow">
      <div className="mb-4 flex justify-center">{icon}</div>
      <h3 className="text-lg font-semibold text-foreground mb-2">{title}</h3>
      <p className="text-sm text-muted-foreground">{description}</p>
    </div>
  )
}
