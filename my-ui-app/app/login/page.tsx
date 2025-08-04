// app/login/page.tsx
"use client"

import { useRouter } from "next/navigation"
import { LoginForm } from "@/components/auth/login-form"
import { authService } from "@/lib/auth"

export default function LoginPage() {
  const router = useRouter()

  return (
    <main className="flex justify-center items-center h-screen">
      <LoginForm
        onSuccess={(user) => {
          router.push("/")
          router.refresh()
        }}
        onSwitchToSignup={() => router.push("/register")}
      />
    </main>
  )
}
