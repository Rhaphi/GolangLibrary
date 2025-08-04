// app/register/page.tsx
"use client"

import { useRouter } from "next/navigation"
import { SignupForm } from "@/components/auth/signup-form"
import { authService } from "@/lib/auth"

export default function RegisterPage() {
  const router = useRouter()

  return (
    <main className="flex justify-center items-center h-screen">
      <SignupForm
        onSuccess={(user) => {

          router.push("/")
          router.refresh()
        }}
        onSwitchToLogin={() => router.push("/login")}
      />
    </main>
  )
}
