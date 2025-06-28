// src/app/(auth)/sign-up/page.tsx
import { SignUp } from '@clerk/nextjs'

export default function SignUpPage() {
  return (
    <div className="flex justify-center">
      <SignUp 
        appearance={{
          elements: {
            rootBox: 'w-full',
            card: 'w-full shadow-xl border-0 bg-card',
          }
        }}
        redirectUrl="/dashboard"
        signInUrl="/sign-in"
      />
    </div>
  )
}