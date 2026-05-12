import React, { createContext, useContext, useEffect, useState } from 'react'
import type { User } from '@/types'
import { isSupabaseConfigured, supabase } from '@/lib/supabase'
import { clearAuthToken, setAuthToken } from '@/utils/api'

const VALID_ROLES = ['Admin', 'Curriculum Committee', 'Department Chair', 'Registrar'] as const
const PROFILE_TABLE = import.meta.env.VITE_SUPABASE_PROFILE_TABLE || 'profiles'

type AuthUser = {
  id: string
  email?: string | null
  user_metadata?: {
    full_name?: string
    role?: string
    [key: string]: unknown
  }
}

type ProfileRow = {
  id: string
  full_name: string
  role: string
}

function normalizeRole(role?: string) {
  return VALID_ROLES.includes(role as (typeof VALID_ROLES)[number]) ? (role as (typeof VALID_ROLES)[number]) : 'Admin'
}

function mapAuthUser(user: AuthUser, profile?: ProfileRow | null): User {
  const role = normalizeRole(profile?.role || user.user_metadata?.role)
  const name = profile?.full_name || user.user_metadata?.full_name || user.email || undefined

  return {
    user_id: user.id,
    role,
    permissions: [role],
    name,
    email: user.email || undefined,
  }
}

type AuthContextType = {
  user: User | null
  isLoading: boolean
  login: (email: string, password: string) => Promise<{ success: true; user: User } | { success: false; error?: string }>
  signUp: (email: string, password: string, role: string, name: string) => Promise<{ success: true; user: User; requiresConfirmation?: boolean } | { success: false; error?: string }>
  logout: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

async function fetchProfile(userId: string) {
  if (!supabase) return null

  const { data, error } = await supabase
    .from(PROFILE_TABLE)
    .select('id, full_name, role')
    .eq('id', userId)
    .maybeSingle<ProfileRow>()

  if (error) {
    throw error
  }

  return data ?? null
}

async function upsertProfile(user: AuthUser) {
  if (!supabase) {
    return {
      id: user.id,
      full_name: user.user_metadata?.full_name || user.email || 'User',
      role: normalizeRole(user.user_metadata?.role),
    } satisfies ProfileRow
  }

  const fallbackRole = normalizeRole(user.user_metadata?.role)
  const fallbackName = user.user_metadata?.full_name || user.email || 'User'

  const { error } = await supabase.from(PROFILE_TABLE).upsert(
    {
      id: user.id,
      full_name: fallbackName,
      role: fallbackRole,
    },
    { onConflict: 'id' },
  )

  if (error) {
    throw error
  }

  return {
    id: user.id,
    full_name: fallbackName,
    role: fallbackRole,
  } satisfies ProfileRow
}

async function syncProfile(user: AuthUser) {
  try {
    const profile = await fetchProfile(user.id)
    if (profile) {
      return mapAuthUser(user, profile)
    }

    const createdProfile = await upsertProfile(user)
    return mapAuthUser(user, createdProfile)
  } catch (error) {
    return mapAuthUser(user)
  }
}

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const checkAuth = async () => {
      if (!supabase) {
        setIsLoading(false)
        return
      }

      try {
        const { data } = await supabase.auth.getSession()
        const sessionUser = data.session?.user

        if (sessionUser) {
          if (data.session?.access_token) {
            setAuthToken(data.session.access_token)
          }
          const mappedUser = mapAuthUser(sessionUser as AuthUser)
          setUser(mappedUser)
          void syncProfile(sessionUser as AuthUser).then((syncedUser) => {
            setUser(syncedUser)
          })
        } else {
          clearAuthToken()
          setUser(null)
        }
      } catch (error) {
        console.error('Auth check failed:', error)
        setUser(null)
      } finally {
        setIsLoading(false)
      }
    }

    checkAuth()

    if (!supabase) {
      return () => undefined
    }

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event: string, session: any) => {
      try {
        setIsLoading(true)
        if (session?.user) {
          if (session?.access_token) {
            setAuthToken(session.access_token)
          }
          const mappedUser = mapAuthUser(session.user as AuthUser)
          setUser(mappedUser)
          void syncProfile(session.user as AuthUser).then((syncedUser) => {
            setUser(syncedUser)
          })
        } else {
          clearAuthToken()
          setUser(null)
        }
      } finally {
        setIsLoading(false)
      }
    })

    return () => {
      subscription.unsubscribe()
    }
  }, [])

  const login: AuthContextType['login'] = async (email, password) => {
    if (!supabase) {
      return { success: false, error: 'Supabase is not configured. Set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY.' }
    }

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (error) {
        return { success: false, error: error.message }
      }

      if (!data.user) {
        return { success: false, error: 'Login failed' }
      }

      const authUser = data.user as AuthUser
      const mappedUser = mapAuthUser(authUser)
      setUser(mappedUser)
      void syncProfile(authUser).then((syncedUser) => {
        setUser(syncedUser)
      })
      return { success: true, user: mappedUser }
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Login failed'
      return { success: false, error: message }
    }
  }

  const signUp: AuthContextType['signUp'] = async (email, password, role, name) => {
    const trimmedEmail = email.trim()
    const trimmedName = name.trim()

    if (!trimmedEmail || !password || !role || !trimmedName) {
      return { success: false, error: 'Please complete all signup fields' }
    }

    if (!isSupabaseConfigured || !supabase) {
      return { success: false, error: 'Supabase is not configured. Set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY.' }
    }

    try {
      const { data, error } = await supabase.auth.signUp({
        email: trimmedEmail,
        password,
        options: {
          data: {
            full_name: trimmedName,
            role,
          },
        },
      })

      if (error) {
        return { success: false, error: error.message }
      }

      if (!data.user) {
        return { success: false, error: 'Signup failed' }
      }

      if (data.session) {
        setAuthToken(data.session.access_token)
        const authUser = data.user as AuthUser
        const mappedUser = mapAuthUser(authUser)
        setUser(mappedUser)
        void syncProfile(authUser).then((syncedUser) => {
          setUser(syncedUser)
        })
        return { success: true, user: mappedUser }
      }

      return {
        success: true,
        user: mapAuthUser(data.user as AuthUser),
        requiresConfirmation: true,
      }
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Signup failed'
      return { success: false, error: message }
    }
  }

  const logout = () => {
    clearAuthToken()
    if (!supabase) {
      setUser(null)
      return
    }

    void supabase.auth.signOut().finally(() => {
      setUser(null)
    })
  }

  return (
    <AuthContext.Provider value={{ user, isLoading, login, signUp, logout }}>{children}</AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within an AuthProvider')
  return ctx
}
