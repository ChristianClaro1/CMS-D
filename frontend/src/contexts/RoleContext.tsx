import React, { createContext, useContext, useState } from 'react'

type Role = 'Curriculum Committee' | 'Department Chair' | 'Registrar' | 'Admin'

type RoleContextType = {
  role: Role
  setRole: (r: Role) => void
}

const RoleContext = createContext<RoleContextType | undefined>(undefined)

export function RoleProvider({ children }: { children: React.ReactNode }) {
  const [role, setRole] = useState<Role>('Admin')

  return <RoleContext.Provider value={{ role, setRole }}>{children}</RoleContext.Provider>
}

export function useRole() {
  const ctx = useContext(RoleContext)
  if (!ctx) throw new Error('useRole must be used within RoleProvider')
  return ctx
}

export default RoleProvider
