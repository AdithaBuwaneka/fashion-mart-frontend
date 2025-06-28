// src/app/(auth)/sign-in/page.tsx
import { SignIn } from '@clerk/nextjs'

export default function SignInPage() {
  return (
    <div className="flex justify-center">
      <SignIn 
        appearance={{
          elements: {
            rootBox: 'w-full',
            card: 'w-full shadow-xl border-0 bg-card',
          }
        }}
        redirectUrl="/dashboard"
        signUpUrl="/sign-up"
      />
    </div>
  )
}