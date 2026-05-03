import NavTab from '@/components/NavTab'
import { Link } from 'react-router-dom'
import { useRole } from '@/contexts/RoleContext'

const mockCourses = [
  {
    course_id: 'CRS-2024-0001',
    course_code: 'CS101',
    course_name: 'Introduction to Programming',
    course_type: 'Lecture',
    units: 3,
    price: 15000,
    section_capacity: 40,
    enrolled_count: 35,
    instructor_name: 'Dr. Maria Santos',
    prerequisites: ['CS100'],
    is_elective: false,
    status: 'Active',
  },
  {
    course_id: 'CRS-2024-0002',
    course_code: 'CS101L',
    course_name: 'Intro to Programming Lab',
    course_type: 'Lab',
    units: 1,
    price: 5000,
    section_capacity: 30,
    enrolled_count: 28,
    instructor_name: 'Prof. Juan Reyes',
    prerequisites: [],
    is_elective: false,
    status: 'Active',
  },
]

export function CourseCatalog() {
  const { role } = useRole()

  return (
    <div className="space-y-6">
      <header className="pb-6">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-3xl font-extrabold italic text-[#0f2147] tracking-tight">ACADEMIC PROGRAMS</h1>
          <p className="mt-2 text-sm text-[#0f2147]">ACADEMIC PROGRAM & CURRICULUM DEVELOPMENT PORTAL</p>

          <nav className="mt-6 flex gap-8 text-sm font-semibold">
            {((role as string) !== 'Department Chair' && (role as string) !== 'Registrar') && <NavTab to="/courses/manage" label="NEW PROGRAM PROPOSAL" />}
            {role === 'Registrar' ? (
              <>
                <NavTab to="/courses/oversight" label="PROPOSAL OVERSIGHT" />
                <NavTab to="/courses" label="ACADEMIC CATALOG" />
              </>
            ) : (
              <>
                <NavTab to="/courses" label="ACADEMIC CATALOG" />
                {((role as string) !== 'Department Chair' && (role as string) !== 'Registrar') && <NavTab to="/prerequisites" label="PREREQUISITE MANAGER" />}
              </>
            )}
          </nav>
        </div>
      </header>

      <div className="max-w-7xl mx-auto bg-white rounded-2xl shadow p-6">
        {/* Filters area */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex-1">
            <div className="relative max-w-lg">
              <input
                className="w-full px-4 py-3 rounded-lg border border-gray-200 placeholder-gray-400"
                placeholder="Search by code or title..."
              />
            </div>
          </div>

            <div className="flex items-center gap-3">
              <button className="px-4 py-2 rounded-md bg-white border border-gray-200">Filter</button>
              {((role as string) !== 'Registrar') && (
                <Link to="/courses/manage" className="px-4 py-2 rounded-md bg-[#0f2147] text-white shadow-md">+ Add Course</Link>
              )}
            </div>
        </div>

        {/* Course list */}
        <div className="space-y-4">
          {mockCourses.map((course) => (
            <div key={course.course_id} className="bg-white rounded-lg shadow-sm p-4 border border-gray-100">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-gray-50 rounded-md flex items-center justify-center text-sm font-bold text-gray-600">{course.course_code.slice(0,2)}</div>
                  <div>
                    <div className="font-semibold text-lg">{course.course_name}</div>
                    <div className="text-sm text-gray-500 mt-1">{course.course_code} • {course.units} Units • {course.course_type} • {course.is_elective ? 'Elective' : 'Core'}</div>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="text-sm text-green-600">{course.status}</div>
                  <div className="p-2 rounded-full bg-gray-50">•••</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default CourseCatalog
