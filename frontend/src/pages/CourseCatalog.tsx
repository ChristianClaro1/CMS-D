import { BookOpen, Users, DollarSign } from 'lucide-react'

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
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-gray-900">Course Catalog</h1>
        <p className="mt-2 text-sm text-gray-700">
          Browse and search available courses for the current semester.
        </p>
      </div>

      {/* Filters */}
      <div className="bg-white shadow rounded-lg p-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Semester
            </label>
            <select className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm">
              <option>2024-2025-1</option>
              <option>2024-2025-2</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Course Type
            </label>
            <select className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm">
              <option>All</option>
              <option>Lecture</option>
              <option>Lab</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Classification
            </label>
            <select className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm">
              <option>All</option>
              <option>Core</option>
              <option>Elective</option>
              <option>Major</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Search
            </label>
            <input
              type="text"
              placeholder="Search courses..."
              className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            />
          </div>
        </div>
      </div>

      {/* Course Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {mockCourses.map((course) => (
          <div
            key={course.course_id}
            className="bg-white overflow-hidden shadow rounded-lg hover:shadow-lg transition-shadow duration-200"
          >
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                  course.course_type === 'Lab' 
                    ? 'bg-purple-100 text-purple-800'
                    : 'bg-blue-100 text-blue-800'
                }`}>
                  {course.course_type}
                </span>
                <span className="text-sm text-gray-500">
                  {course.units} units
                </span>
              </div>
              
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                {course.course_code}: {course.course_name}
              </h3>
              
              <div className="space-y-2 text-sm text-gray-600">
                <div className="flex items-center">
                  <Users className="h-4 w-4 mr-2" />
                  <span>{course.enrolled_count}/{course.section_capacity} enrolled</span>
                </div>
                <div className="flex items-center">
                  <BookOpen className="h-4 w-4 mr-2" />
                  <span>{course.instructor_name}</span>
                </div>
                <div className="flex items-center">
                  <DollarSign className="h-4 w-4 mr-2" />
                  <span>₱{course.price.toLocaleString()}</span>
                </div>
              </div>
              
              {course.prerequisites.length > 0 && (
                <div className="mt-4">
                  <p className="text-xs font-medium text-gray-700 mb-1">Prerequisites:</p>
                  <div className="flex flex-wrap gap-1">
                    {course.prerequisites.map((prereq) => (
                      <span
                        key={prereq}
                        className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-gray-100 text-gray-800"
                      >
                        {prereq}
                      </span>
                    ))}
                  </div>
                </div>
              )}
              
              <div className="mt-4 flex justify-between items-center">
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                  course.status === 'Active'
                    ? 'bg-green-100 text-green-800'
                    : 'bg-gray-100 text-gray-800'
                }`}>
                  {course.status}
                </span>
                <button className="text-blue-600 hover:text-blue-800 text-sm font-medium">
                  View Details
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
