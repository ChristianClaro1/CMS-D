 
import { NavLink, useLocation } from 'react-router-dom'
import {
  LayoutDashboard,
  BookOpen,
  Users,
  DollarSign,
  FileText,
  Settings,
  LogOut,
  ShieldCheck,
} from 'lucide-react'
import { useAuth } from '@/hooks/useAuth'
import { useRole } from '@/contexts/RoleContext'

const navigation = [
  { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { name: 'Academic Programs', href: '/courses/manage', icon: BookOpen },
  { name: 'Faculty Hub', href: '/instructors', icon: Users },
  { name: 'Enrollment Hub', href: '/enrollment', icon: DollarSign },
  { name: 'Reports', href: '/reports', icon: FileText },
  { name: 'Settings', href: '/settings', icon: Settings },
]

export function Sidebar() {
  const { user, logout } = useAuth()
  const { role, setRole } = useRole()

  return (
    <div className="fixed left-0 top-0 w-72 h-screen bg-[#0f2147] text-white shadow-lg flex flex-col">
      <div className="p-6 flex-1 overflow-y-auto overflow-x-hidden no-scrollbar">
        <div className="mb-6">
          <h2 className="text-xl font-extrabold">IAESystem</h2>
          <div className="text-xs text-gray-200 mt-1">COURSE MANAGEMENT</div>
        </div>

        <div className="mb-4 border-b border-white/10 pb-4">
          <div className="text-xs uppercase text-gray-300 mb-3">View As</div>
          <div className="space-y-3">
            {(() => {
              const roles = ['Curriculum Committee', 'Department Chair', 'Registrar', 'Admin'] as const
              return roles.map((r) => (
                <button
                  key={r}
                  onClick={() => setRole(r)}
                  aria-pressed={role === r}
                  className={role === r
                    ? 'w-full min-w-0 flex items-center justify-between gap-3 px-3 py-2 rounded-2xl bg-yellow-400 text-[#0f2147] font-semibold shadow-lg'
                    : 'w-full min-w-0 flex items-center gap-3 px-3 py-2 rounded-md text-gray-200 hover:text-white hover:bg-yellow-400/10'}>
                  <div className="flex items-center gap-3 min-w-0">
                    <ShieldCheck className={role === r ? 'h-5 w-5 text-[#0f2147] flex-shrink-0' : 'h-5 w-5 text-gray-200 flex-shrink-0'} />
                    <span className="truncate">{r}</span>
                  </div>
                  {role === r && <span className="w-3 h-3 bg-white rounded-full" />}
                </button>
              ))
            })()}
          </div>
        </div>

        <div className="mt-4">
          <div className="text-xs uppercase text-gray-300 mb-2">Main Menu</div>
          <nav className="space-y-1">
            {(() => {
              const { role } = useRole()
              let visible = navigation

              if (role === 'Curriculum Committee') {
                visible = navigation.filter((i) => ['Dashboard', 'Academic Programs'].includes(i.name))
              } else if (role === 'Department Chair') {
                visible = navigation.filter((i) => ['Dashboard', 'Academic Programs', 'Faculty Hub', 'Enrollment Hub'].includes(i.name))
              } else if (role === 'Registrar') {
                visible = navigation.filter((i) => ['Dashboard', 'Academic Programs', 'Enrollment Hub'].includes(i.name))
              }

              return visible.map((item) => {
              const Icon = item.icon
                const location = useLocation()
                const pathname = location.pathname
                const isAcademicActive = pathname.startsWith('/courses') || pathname.startsWith('/prerequisites') || pathname === '/courses' || pathname === '/courses/manage'
                const active = item.name === 'Academic Programs' ? isAcademicActive : pathname === item.href

                return (
                  <NavLink
                    key={item.name}
                    to={item.href}
                    className={() =>
                      `group flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors cursor-pointer focus:outline-none focus:ring-2 focus:ring-yellow-300 ${
                        active
                          ? 'bg-yellow-400 text-[#0f2147]'
                          : 'text-gray-200 hover:bg-yellow-400/10 hover:text-white'
                      }`
                    }
                  >
                    <Icon className="mr-3 h-5 w-5 flex-shrink-0" />
                    {item.name}
                  </NavLink>
                )
              })
            })()}
          </nav>
        </div>
      </div>

      <div className="mt-auto p-6 border-t border-white/10">
        <div className="flex flex-col items-start gap-3">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-yellow-400 rounded-full flex items-center justify-center text-[#0f2147]">
              {user?.name ? user.name.charAt(0) : 'A'}
            </div>
            <div>
              <div className="text-sm font-semibold">{user?.name || 'John Doe'}</div>
              <div className="text-xs text-gray-300">Admin</div>
            </div>
          </div>

          <button
            onClick={logout}
            className="w-full text-left px-3 py-2 rounded-md text-sm text-yellow-400 hover:text-yellow-300 hover:bg-yellow-400/5 flex items-center gap-2"
          >
            <LogOut className="h-4 w-4" />
            <span>Sign Out</span>
          </button>
        </div>
      </div>
    </div>
  )
}
