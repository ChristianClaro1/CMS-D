
import { Routes, Route, Navigate } from 'react-router-dom'
import { Navbar } from '@/components/layout/Navbar'
import { Sidebar } from '@/components/layout/Sidebar'
import { Dashboard } from '@/pages/Dashboard'
import { CourseCatalog } from '@/pages/CourseCatalog'
import { CourseManagement } from '@/pages/CourseManagement'
import { InstructorManagement } from '@/pages/InstructorManagement'
import { PricingManagement } from '@/pages/PricingManagement'
import { Reports } from '@/pages/Reports'
import { Settings } from '@/pages/Settings'
import { Login } from '@/pages/Login'
import { useAuth } from '@/hooks/useAuth'

function App() {
  const { user, isLoading } = useAuth()

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary-600"></div>
      </div>
    )
  }

  if (!user) {
    return <Login />
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="flex">
        <Sidebar />
        <main className="flex-1 p-6">
          <Routes>
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/courses" element={<CourseCatalog />} />
            <Route path="/courses/manage" element={<CourseManagement />} />
            <Route path="/instructors" element={<InstructorManagement />} />
            <Route path="/pricing" element={<PricingManagement />} />
            <Route path="/reports" element={<Reports />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="*" element={<Navigate to="/dashboard" replace />} />
          </Routes>
        </main>
      </div>
    </div>
  )
}

export default App
