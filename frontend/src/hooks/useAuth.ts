import { useState, useEffect } from 'react'
import { User } from '@/types'

const mockUser: User = {
  user_id: 'user-123',
  role: 'Admin',
  permissions: ['*'],
  name: 'John Doe',
  email: 'john.doe@university.edu',
}

export function useAuth() {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Simulate authentication check
    const checkAuth = async () => {
      try {
        // In a real app, this would validate JWT with backend
        const token = localStorage.getItem('auth_token')
        
        if (token) {
          // Mock authenticated user
          setUser(mockUser)
        }
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
    try {
      // Mock login - in real app would call API
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

  return {
    user,
    isLoading,
    login,
    logout,
  }
}
