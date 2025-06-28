'use client'

import { useState } from 'react'
import { SignIn, SignUp } from '@clerk/nextjs'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Separator } from '@/components/ui/separator'
import { ShoppingBag, Users, Palette, Shield, Package } from 'lucide-react'
import Link from 'next/link'

export function AuthFormContainer() {
  const [activeTab, setActiveTab] = useState<'sign-in' | 'sign-up'>('sign-in')

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background to-muted/20 p-4">
      <div className="w-full max-w-4xl grid lg:grid-cols-2 gap-8 items-center">
        {/* Branding & Info Section */}
        <div className="space-y-6">
          <div className="text-center lg:text-left">
            <div className="flex items-center justify-center lg:justify-start gap-2 mb-4">
              <ShoppingBag className="h-8 w-8 text-primary" />
              <h1 className="text-3xl font-bold">Fashion Mart</h1>
            </div>
            <p className="text-lg text-muted-foreground">
              Your one-stop destination for modern fashion and design collaboration
            </p>
          </div>

          <div className="space-y-4">
            <h3 className="text-xl font-semibold">Join our community</h3>
            <div className="grid gap-3">
              <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
                <Users className="h-5 w-5 text-primary" />
                <div>
                  <p className="font-medium">Shop & Discover</p>
                  <p className="text-sm text-muted-foreground">Browse unique fashion designs</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
                <Palette className="h-5 w-5 text-primary" />
                <div>
                  <p className="font-medium">Design & Create</p>
                  <p className="text-sm text-muted-foreground">Upload and sell your designs</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
                <Package className="h-5 w-5 text-primary" />
                <div>
                  <p className="font-medium">Manage & Track</p>
                  <p className="text-sm text-muted-foreground">Professional inventory tools</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Auth Forms Section */}
        <Card className="w-full">
          <CardHeader className="text-center">
            <Tabs value={activeTab} onValueChange={(value: string) => setActiveTab(value as 'sign-in' | 'sign-up')}>
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="sign-in">Sign In</TabsTrigger>
                <TabsTrigger value="sign-up">Sign Up</TabsTrigger>
              </TabsList>
            </Tabs>
          </CardHeader>
          <CardContent>
            <Tabs value={activeTab} onValueChange={(value: string) => setActiveTab(value as 'sign-in' | 'sign-up')}>
              <TabsContent value="sign-in">
                <div className="space-y-4">
                  <div className="text-center">
                    <CardTitle>Welcome back</CardTitle>
                    <CardDescription>Sign in to your Fashion Mart account</CardDescription>
                  </div>
                  <SignIn 
                    appearance={{
                      elements: {
                        formButtonPrimary: 'bg-primary hover:bg-primary/90 text-primary-foreground',
                        card: 'bg-transparent shadow-none',
                        headerTitle: 'hidden',
                        headerSubtitle: 'hidden',
                        socialButtonsBlockButton: 'border-input hover:bg-accent hover:text-accent-foreground',
                        formFieldInput: 'border-input bg-background',
                        footerActionLink: 'text-primary hover:text-primary/90'
                      }
                    }}
                    redirectUrl="/dashboard"
                    signUpUrl="/sign-up"
                  />
                </div>
              </TabsContent>
              <TabsContent value="sign-up">
                <div className="space-y-4">
                  <div className="text-center">
                    <CardTitle>Create your account</CardTitle>
                    <CardDescription>Join the Fashion Mart community today</CardDescription>
                  </div>
                  <SignUp 
                    appearance={{
                      elements: {
                        formButtonPrimary: 'bg-primary hover:bg-primary/90 text-primary-foreground',
                        card: 'bg-transparent shadow-none',
                        headerTitle: 'hidden',
                        headerSubtitle: 'hidden',
                        socialButtonsBlockButton: 'border-input hover:bg-accent hover:text-accent-foreground',
                        formFieldInput: 'border-input bg-background',
                        footerActionLink: 'text-primary hover:text-primary/90'
                      }
                    }}
                    redirectUrl="/dashboard"
                    signInUrl="/sign-in"
                  />
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

// Role Selection Component (for after signup)
export function RoleSelectionForm() {
  const [selectedRole, setSelectedRole] = useState<string>('')

  const roles = [
    {
      id: 'customer',
      title: 'Customer',
      description: 'Browse and purchase fashion items',
      icon: Users,
      features: ['Shop products', 'Track orders', 'Easy returns', 'Wishlist']
    },
    {
      id: 'designer',
      title: 'Designer',
      description: 'Upload and sell your designs',
      icon: Palette,
      features: ['Upload designs', 'Earn revenue', 'Design analytics', 'Collaborate']
    },
    {
      id: 'staff',
      title: 'Staff',
      description: 'Process orders and support customers',
      icon: Shield,
      features: ['Process orders', 'Handle returns', 'Customer support', 'Order tracking']
    },
    {
      id: 'inventory_manager',
      title: 'Inventory Manager',
      description: 'Manage stock and approve designs',
      icon: Package,
      features: ['Stock management', 'Approve designs', 'Inventory reports', 'Low stock alerts']
    }
  ]

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <Card className="w-full max-w-4xl">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl">Choose Your Role</CardTitle>
          <CardDescription>
            Select how you&apos;d like to use Fashion Mart. You can change this later.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-4">
            {roles.map((role) => {
              const Icon = role.icon
              return (
                <div
                  key={role.id}
                  className={`p-6 border rounded-lg cursor-pointer transition-all hover:shadow-md ${
                    selectedRole === role.id 
                      ? 'border-primary bg-primary/5' 
                      : 'border-border hover:border-primary/50'
                  }`}
                  onClick={() => setSelectedRole(role.id)}
                >
                  <div className="flex items-start gap-4">
                    <div className={`p-2 rounded-lg ${
                      selectedRole === role.id ? 'bg-primary text-primary-foreground' : 'bg-muted'
                    }`}>
                      <Icon className="h-6 w-6" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-lg">{role.title}</h3>
                      <p className="text-muted-foreground text-sm mb-3">{role.description}</p>
                      <ul className="space-y-1">
                        {role.features.map((feature, index) => (
                          <li key={index} className="text-sm text-muted-foreground flex items-center gap-2">
                            <div className="w-1 h-1 bg-primary rounded-full" />
                            {feature}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
          
          <Separator className="my-6" />
          
          <div className="flex justify-between items-center">
            <Button variant="outline" asChild>
              <Link href="/dashboard">Skip for now</Link>
            </Button>
            <Button 
              disabled={!selectedRole}
              onClick={() => {
                // Handle role selection
                console.log('Selected role:', selectedRole)
              }}
            >
              Continue
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}