 
import {
  BookOpen,
  Users,
  TrendingUp,
  List,
  ShieldCheck,
  ClipboardList,
  Calendar,
} from 'lucide-react'
import DashboardCard from '../components/dashboard/DashboardCard'
import { useRole } from '@/contexts/RoleContext'
import { Link } from 'react-router-dom'

const topStats = [
  { name: 'Active Catalog', value: 2 },
  { name: 'Faculty Hub', value: 3 },
  { name: 'Under Review', value: 1 },
]

const modules = [
  { title: 'Academic Programs', desc: 'Propose and manage the curriculum lifecycle, including active catalog and prerequisite chains.', icon: List, to: '/courses/manage' },
  { title: 'Active Catalog', desc: 'Browse historical and active courses — the authoritative source of IAE course data.', icon: BookOpen, to: '/courses' },
  { title: 'Faculty Hub', desc: 'Assign faculty to sections and monitor teaching workloads for conflict resolution.', icon: Users, to: '/instructors' },
  { title: 'Enrollment Hub', desc: 'Manage section capacity limits and scheduling synchronized with SRM.', icon: Calendar, to: '/enrollment' },
  { title: 'Security Logs', desc: 'Trace administrative changes and ensure system accountability for audit purposes.', icon: ShieldCheck, to: '/reports' },
  { title: 'Prerequisite Manager', desc: 'Define and manage course prerequisite/co-requisite chains to ensure academic flow integrity.', icon: ClipboardList, to: '/prerequisites' },
]

export function Dashboard() {
  const { role } = useRole()

  // Filter modules based on role
  const visibleModules = (() => {
    if (role === 'Curriculum Committee') {
      return modules.filter((m) => ['Academic Programs', 'Active Catalog', 'Prerequisite Manager'].includes(m.title))
    }

    if (role === 'Department Chair') {
      return modules
        .filter((m) => ['Academic Programs', 'Faculty Hub', 'Enrollment Hub'].includes(m.title))
        .map((m) => (m.title === 'Academic Programs' ? { ...m, to: '/courses' } : m))
    }

    if (role === 'Registrar') {
      return modules.filter((m) => ['Academic Programs', 'Enrollment Hub'].includes(m.title))
        .map((m) => (m.title === 'Academic Programs' ? { ...m, to: '/courses' } : m))
    }

    return modules
  })()

  return (
    <div className="space-y-8">
      <header className="py-6">
        <div className="max-w-7xl mx-auto">
          <div>
            <h2 className="text-4xl font-extrabold text-[#0f2147] tracking-tight italic">WELCOME BACK, JOHN</h2>
            <p className="mt-2 text-sm text-[#0f2147] italic">SYSTEM-WIDE ADMINISTRATIVE ACCESS</p>
          </div>
        </div>
      </header>

      {/* Top stat boxes placed outside the hero container */}
      <div className="max-w-7xl mx-auto -mt-8 grid grid-cols-1 sm:grid-cols-3 gap-4 px-6">
        <Link to="/courses" className="relative bg-white rounded-xl shadow pl-0 block hover:shadow-md">
          <div className="absolute left-0 inset-y-0 w-1 bg-yellow-400 rounded-l-md"></div>
          <div className="px-6 py-3 flex items-center space-x-4 ml-3">
            <div className="bg-gray-50 rounded-md p-3">
              <BookOpen className="h-6 w-6 text-gray-400" />
            </div>
            <div>
              <div className="text-xl font-bold text-[#0f2147]">{topStats[0].value}</div>
              <div className="text-xs text-gray-500 uppercase">{topStats[0].name}</div>
            </div>
          </div>
        </Link>

        <Link to="/instructors" className="relative bg-white rounded-xl shadow pl-0 block hover:shadow-md">
          <div className="absolute left-0 inset-y-0 w-1 bg-yellow-400 rounded-l-md"></div>
          <div className="px-6 py-3 flex items-center space-x-4 ml-3">
            <div className="bg-gray-50 rounded-md p-3">
              <Users className="h-6 w-6 text-gray-400" />
            </div>
            <div>
              <div className="text-xl font-bold text-[#0f2147]">{topStats[1].value}</div>
              <div className="text-xs text-gray-500 uppercase">{topStats[1].name}</div>
            </div>
          </div>
        </Link>

        <Link to="/courses/manage" className="relative bg-white rounded-xl shadow pl-0 block hover:shadow-md">
          <div className="absolute left-0 inset-y-0 w-1 bg-yellow-400 rounded-l-md"></div>
          <div className="px-6 py-3 flex items-center space-x-4 ml-3">
            <div className="bg-gray-50 rounded-md p-3">
              <TrendingUp className="h-6 w-6 text-gray-400" />
            </div>
            <div>
              <div className="text-xl font-bold text-[#0f2147]">{topStats[2].value}</div>
              <div className="text-xs text-gray-500 uppercase">{topStats[2].name}</div>
            </div>
          </div>
        </Link>
      </div>

      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6 items-stretch">
        {visibleModules.map((m) => (
          <div key={m.title} className="h-full">
            <DashboardCard title={m.title} description={m.desc} icon={m.icon} to={m.to} />
          </div>
        ))}
      </div>

      <div className="max-w-7xl mx-auto">
        <div className="bg-white rounded-2xl shadow p-6 text-center">
          <h3 className="text-lg font-semibold text-[#0f2147]">System Operational</h3>
          <p className="mt-2 text-sm text-gray-500">All course management modules are currently synchronized and active.</p>
        </div>
      </div>
    </div>
  )
}

export default Dashboard
