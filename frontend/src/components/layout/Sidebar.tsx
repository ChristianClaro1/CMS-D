 
import { NavLink } from 'react-router-dom'
import { 
  LayoutDashboard, 
  BookOpen, 
  Users, 
  DollarSign, 
  FileText, 
  Settings 
} from 'lucide-react'

const navigation = [
  { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { name: 'Course Catalog', href: '/courses', icon: BookOpen },
  { name: 'Course Management', href: '/courses/manage', icon: BookOpen },
  { name: 'Instructors', href: '/instructors', icon: Users },
  { name: 'Pricing', href: '/pricing', icon: DollarSign },
  { name: 'Reports', href: '/reports', icon: FileText },
  { name: 'Settings', href: '/settings', icon: Settings },
]

export function Sidebar() {
  return (
    <div className="w-64 bg-white shadow-sm border-r border-gray-200 h-full">
      <div className="p-4">
        <nav className="space-y-1">
          {navigation.map((item) => {
            const Icon = item.icon
            return (
              <NavLink
                key={item.name}
                to={item.href}
                className={({ isActive }) =>
                  `group flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                    isActive
                      ? 'bg-blue-50 text-blue-700 border-r-2 border-blue-700'
                      : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                  }`
                }
              >
                <Icon className="mr-3 h-5 w-5 flex-shrink-0" />
                {item.name}
              </NavLink>
            )
          })}
        </nav>
      </div>
    </div>
  )
}
