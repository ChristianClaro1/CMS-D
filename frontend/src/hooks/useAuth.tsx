import React, { createContext, useContext, useEffect, useState } from 'react'
import { User } from '@/types'
import { api, clearAuthToken, getAuthToken, setAuthToken } from '@/utils/api'

const AUTH_USER_KEY = 'auth_user'

type BackendLoginResponse = {
  access_token: string
  refresh_token?: string
  token_type?: string
  expires_in?: number
  user: {
    id: string
    name?: string
    email?: string
    role?: string
  }
}

function mapBackendUser(user: BackendLoginResponse['user']): User {
  return {
    user_id: user.id,
    role: user.role || 'Admin',
    permissions: user.role ? [user.role] : ['*'],
    name: user.name,
    email: user.email,
  }
}

type AuthContextType = {
  user: User | null
  isLoading: boolean
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>
  logout: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const token = getAuthToken()
        const storedUser = localStorage.getItem(AUTH_USER_KEY)

        if (token && storedUser) {
          setUser(JSON.parse(storedUser) as User)
        } else if (token) {
          setUser({
            user_id: 'authenticated-user',
            role: 'Admin',
            permissions: ['*'],
          })
        }
      } catch (error) {
        console.error('Auth check failed:', error)
        clearAuthToken()
        localStorage.removeItem(AUTH_USER_KEY)
      } finally {
        setIsLoading(false)
      }
    }
    checkAuth()
  }, [])

  const login = async (email: string, password: string) => {
    try {
      const response = (await api.post('/login', { email, password })) as BackendLoginResponse
      if (!response?.access_token || !response.user) {
        return { success: false, error: 'Login failed' }
      }

      const mappedUser = mapBackendUser(response.user)
      setAuthToken(response.access_token)
      localStorage.setItem(AUTH_USER_KEY, JSON.stringify(mappedUser))
      setUser(mappedUser)
      return { success: true }
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Login failed'
      return { success: false, error: message }
    }
  }

  const logout = () => {
    clearAuthToken()
    localStorage.removeItem(AUTH_USER_KEY)
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{ user, isLoading, login, logout }}>{children}</AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within an AuthProvider')
  return ctx
}
