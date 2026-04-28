 
import { useAuth } from '@/hooks/useAuth'
import { Button } from '@heroui/react'
import { Bell, Search, User, LogOut } from 'lucide-react'

export function Navbar() {
  const { user, logout } = useAuth()

  return (
    <nav className="bg-white shadow-sm border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <h1 className="text-xl font-bold text-gray-900">
                Course Management System
              </h1>
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            {/* Search */}
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Search courses..."
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              />
            </div>
            
            {/* Notifications */}
            <Button
              variant="light"
              size="sm"
              startContent={<Bell className="h-4 w-4" />}
              className="text-gray-600 hover:text-gray-900"
            >
              <span className="sr-only">View notifications</span>
            </Button>
            
            {/* User menu */}
            <div className="flex items-center space-x-2">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                  <User className="h-4 w-4 text-white" />
                </div>
                <span className="text-sm font-medium text-gray-700">
                  {user?.name || 'Admin User'}
                </span>
              </div>
              
              <Button
                variant="light"
                size="sm"
                startContent={<LogOut className="h-4 w-4" />}
                onClick={logout}
                className="text-gray-600 hover:text-gray-900"
              >
                Logout
              </Button>
            </div>
          </div>
        </div>
      </div>
    </nav>
  )
}
