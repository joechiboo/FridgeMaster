import { create } from 'zustand'

interface User {
  id: string
  email: string
  name?: string
}

interface AuthStore {
  user: User | null
  token: string | null
  setAuth: (user: User, token: string) => void
  logout: () => void
  isAuthenticated: () => boolean
  loadFromStorage: () => void
}

export const useAuthStore = create<AuthStore>((set, get) => ({
  user: null,
  token: null,
  setAuth: (user, token) => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('fridgemaster_token', token)
      localStorage.setItem('fridgemaster_user', JSON.stringify(user))
    }
    set({ user, token })
  },
  logout: () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('fridgemaster_token')
      localStorage.removeItem('fridgemaster_user')
      localStorage.removeItem('fridgemaster_fridges')
      localStorage.removeItem('fridgemaster_items')
    }
    set({ user: null, token: null })
  },
  isAuthenticated: () => {
    const { token } = get()
    return !!token
  },
  loadFromStorage: () => {
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('fridgemaster_token')
      const userStr = localStorage.getItem('fridgemaster_user')
      if (token && userStr) {
        try {
          const user = JSON.parse(userStr)
          set({ user, token })
        } catch (e) {
          console.error('Failed to parse user from localStorage')
        }
      }
    }
  },
}))
