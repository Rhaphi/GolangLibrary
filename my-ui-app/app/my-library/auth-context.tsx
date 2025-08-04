// lib/AuthContext.tsx
"use client"

import { createContext, useContext, useEffect, useState } from "react"
import { authService, type User } from "@/lib/auth"

type AuthContextType = {
  user: User | null
  login: (user: User, token: string) => void
  logout: () => void
}

const AuthContext = createContext<AuthContextType | null>(null)

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null)

  useEffect(() => {
    const existingUser = authService.getCurrentUser()
    if (existingUser) setUser(existingUser)
  }, [])

  const login = (user: User, token: string) => {
    authService.login(user, token)
    setUser(user)
  }

  const logout = () => {
    authService.logout()
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) throw new Error("useAuth must be used within AuthProvider")
  return context
}
