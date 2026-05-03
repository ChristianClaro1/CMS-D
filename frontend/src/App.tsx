
import { Routes, Route, Navigate } from 'react-router-dom'
import { Sidebar } from '@/components/layout/Sidebar'
import { RoleProvider } from '@/contexts/RoleContext'
import { Dashboard } from '@/pages/Dashboard'
import { CourseCatalog } from '@/pages/CourseCatalog'
import CourseManagement from '@/pages/CourseManagement'
import ProposalOversight from '@/pages/ProposalOversight'
import { InstructorManagement } from '@/pages/InstructorManagement'
import { PricingManagement } from '@/pages/PricingManagement'
import { PrerequisiteManager } from '@/pages/PrerequisiteManager'
import { EnrollmentHub } from '@/pages/EnrollmentHub'
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
    <div className="min-h-screen bg-cream">
      <div className="flex h-screen">
        <RoleProvider>
          <Sidebar />
          <main className="flex-1 p-6 overflow-auto ml-72">
          <Routes>
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/courses" element={<CourseCatalog />} />
            <Route path="/courses/manage" element={<CourseManagement />} />
            <Route path="/courses/oversight" element={<ProposalOversight />} />
            <Route path="/prerequisites" element={<PrerequisiteManager />} />
            <Route path="/enrollment" element={<EnrollmentHub />} />
            <Route path="/instructors" element={<InstructorManagement />} />
            <Route path="/pricing" element={<PricingManagement />} />
            <Route path="/reports" element={<Reports />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="*" element={<Navigate to="/dashboard" replace />} />
          </Routes>
          </main>
        </RoleProvider>
      </div>
    </div>
  )
}

export default App
