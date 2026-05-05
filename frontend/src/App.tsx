
import { Navigate, Outlet, Route, Routes } from 'react-router-dom'
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
import { Landing } from '@/pages/Landing'
import { UserRoles } from '@/pages/UserRoles'

function AppShell() {
  return (
    <div className="min-h-screen bg-cream">
      <div className="flex h-screen">
        <Sidebar />
        <main className="flex-1 p-6 overflow-auto ml-72">
          <Outlet />
        </main>
      </div>
    </div>
  )
}

function App() {
  return (
    <RoleProvider>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/user-roles" element={<UserRoles />} />
        <Route element={<AppShell />}>
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
          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
      </Routes>
    </RoleProvider>
  )
}

export default App
