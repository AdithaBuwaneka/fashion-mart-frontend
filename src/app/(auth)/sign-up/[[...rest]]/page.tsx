// src/app/(auth)/sign-up/[[...rest]]/page.tsx
import { SignUp } from '@clerk/nextjs'

export default function SignUpPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background to-muted/20 p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-foreground">Join Fashion Mart</h1>
          <p className="text-muted-foreground mt-2">Create your account to get started</p>
        </div>
        <SignUp 
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
          signInUrl="/sign-in"
        />
      </div>
    </div>
  )
}
