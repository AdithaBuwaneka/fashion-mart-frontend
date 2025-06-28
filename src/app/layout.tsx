// src/app/layout.tsx
import './globals.css'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { ClerkProvider } from '@clerk/nextjs'
import { Toaster } from 'react-hot-toast'
import { AuthProvider } from '@/lib/context/auth-context'
import { NotificationProvider } from '@/lib/context/notification-context'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Fashion Mart - Premium Fashion Platform',
  description: 'Complete fashion e-commerce platform with design collaboration',
  keywords: 'fashion, e-commerce, designs, clothing, online shopping',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <ClerkProvider
      publishableKey={process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY!}
      appearance={{
        baseTheme: undefined,
        variables: {
          colorPrimary: '#f97316', // Orange primary color
          colorBackground: '#ffffff',
          colorInputBackground: '#ffffff',
          colorInputText: '#0f172a',
          fontFamily: 'Inter, sans-serif',
          borderRadius: '0.5rem',
        },
        elements: {
          formButtonPrimary: 'bg-primary hover:bg-primary/90 text-sm',
          card: 'shadow-lg border-0',
          headerTitle: 'text-xl font-semibold',
          headerSubtitle: 'text-muted-foreground',
        },
      }}
    >
      <html lang="en">
        <body className={inter.className}>
          <AuthProvider>
            <NotificationProvider>
              {children}
              <Toaster
                position="top-right"
                toastOptions={{
                  duration: 4000,
                  style: {
                    background: 'hsl(var(--background))',
                    color: 'hsl(var(--foreground))',
                    border: '1px solid hsl(var(--border))',
                  },
                }}
              />
            </NotificationProvider>
          </AuthProvider>
        </body>
      </html>
    </ClerkProvider>
  )
}