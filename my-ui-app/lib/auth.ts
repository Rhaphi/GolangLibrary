"use client"

export interface User {
  id: string
  name: string
  email: string
}

export interface AuthState {
  user: User | null
  isAuthenticated: boolean
}

const API_URL = "http://localhost:8080/api" // Adjust if different

export const authService = {
  login: async (email: string, password: string): Promise<User> => {
    const res = await fetch(`${API_URL}/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    })

    if (!res.ok) {
      const data = await res.json()
      throw new Error(data.message || "Login failed")
    }

    const data = await res.json()

    const user: User = {
      id: data.user.id.toString(),
      name: data.user.name,
      email: data.user.email,
    }

    localStorage.setItem("token", data.token)
    localStorage.setItem("user", JSON.stringify(user))

    return user
  },

  signup: async (name: string, email: string, password: string): Promise<User> => {
    const res = await fetch(`${API_URL}/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, password }),
    })

    if (!res.ok) {
      const data = await res.json()
      throw new Error(data.message || "Signup failed")
    }

    const data = await res.json()

    const user: User = {
      id: data.user.id.toString(),
      name: data.user.name,
      email: data.user.email,
    }

    localStorage.setItem("token", data.token)
    localStorage.setItem("user", JSON.stringify(user))

    return user
  },

  logout: () => {
    localStorage.removeItem("token")
    localStorage.removeItem("user")
  },

  getCurrentUser: (): User | null => {
    if (typeof window === "undefined") return null
    const userStr = localStorage.getItem("user")
    return userStr ? JSON.parse(userStr) : null
  },

  getToken: (): string | null => {
    if (typeof window === "undefined") return null
    return localStorage.getItem("token")
  },
}
    