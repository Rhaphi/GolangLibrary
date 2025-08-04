"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { UserNav } from "@/components/user-nav"
import { authService, type User } from "@/lib/auth"

export function Navigation() {
  const [user, setUser] = useState<User | null>(null)

  useEffect(() => {
    const currentUser = authService.getCurrentUser()
    setUser(currentUser)
  }, [])

  return (
    <header className="bg-background border-b shadow-sm">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        {/* Logo */}
        <Link href="/">
          <h1 className="text-xl font-bold text-foreground hover:opacity-80 transition">LibraryHub</h1>
        </Link>

        {/* Navigation + User */}
        <div className="flex items-center gap-6">
          <nav className="space-x-4">
            <Link href="/">
              <Button variant="ghost">Home</Button>
            </Link>
            <Link href="/about">
              <Button variant="ghost">About</Button>
            </Link>
            <Link href="/contact">
              <Button variant="ghost">Contact</Button>
            </Link>
          </nav>

          {/* User menu or login/register */}
          {user ? (
            <UserNav user={user} />
          ) : (
            <>
              <Link href="/login">
                <Button variant="outline">Login</Button>
              </Link>
              <Link href="/register">
                <Button variant="default">Register</Button>
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  )
}
