import React, { createContext, useContext, useEffect, useState } from 'react'
import { User } from '@/types'

const mockUser: User = {
  user_id: 'user-123',
  role: 'Admin',
  permissions: ['*'],
  name: 'John Doe',
  email: 'john.doe@university.edu',
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
        const token = localStorage.getItem('auth_token')
        if (token) setUser(mockUser)
      } catch (error) {
        console.error('Auth check failed:', error)
        localStorage.removeItem('auth_token')
      } finally {
        setIsLoading(false)
      }
    }
    checkAuth()
  }, [])

  const login = async (email: string, password: string) => {
    void email
    void password
    try {
      const response = { success: true, token: 'mock-jwt-token', user: mockUser }
      if (response.success) {
        localStorage.setItem('auth_token', response.token)
        setUser(response.user)
        return { success: true }
      }
      return { success: false, error: 'Invalid credentials' }
    } catch (error) {
      return { success: false, error: 'Login failed' }
    }
  }

  const logout = () => {
    localStorage.removeItem('auth_token')
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
