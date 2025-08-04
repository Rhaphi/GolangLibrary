import { useCallback, useState } from "react"
import type { ReactNode } from "react"

// Define ToastActionElement yourself
export type ToastActionElement = ReactNode

export interface Toast {
  id: string
  title?: string
  description?: string
  action?: ToastActionElement
}

export function useToast() {
  const [toasts, setToasts] = useState<Toast[]>([])

  const addToast = useCallback((toast: Omit<Toast, "id">) => {
    const id = Date.now().toString()
    setToasts((prev) => [...prev, { ...toast, id }])
  }, [])

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id))
  }, [])

  return {
    toasts,
    addToast,
    removeToast,
  }
}
