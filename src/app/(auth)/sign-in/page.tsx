// src/app/(auth)/sign-in/page.tsx
import { SignIn } from '@clerk/nextjs'

export default function SignInPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background to-muted/20 p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-foreground">Welcome Back</h1>
          <p className="text-muted-foreground mt-2">Sign in to your Fashion Mart account</p>
        </div>
        <SignIn 
          appearance={{
            elements: {
              rootBox: 'w-full',
              card: 'w-full shadow-xl border bg-card rounded-lg',
              headerTitle: 'text-2xl font-bold text-foreground',
              headerSubtitle: 'text-muted-foreground',
              formButtonPrimary: 'bg-primary hover:bg-primary/90 text-primary-foreground rounded-md',
              socialButtonsBlockButton: 'border-input hover:bg-accent hover:text-accent-foreground rounded-md',
              formFieldInput: 'border-input bg-background rounded-md',
              footerActionLink: 'text-primary hover:text-primary/90',
              identityPreviewEditButton: 'text-primary hover:text-primary/90'
            },
            layout: {
              socialButtonsPlacement: 'top'
            }
          }}
          redirectUrl="/dashboard"
          signUpUrl="/sign-up"
        />
      </div>
    </div>
  )
}