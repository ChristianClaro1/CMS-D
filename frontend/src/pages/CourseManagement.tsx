 
import React, { useEffect, useState } from 'react'
import { Button } from '@heroui/react'
import { Plus, Edit, Trash2 } from 'lucide-react'
import { api } from '@/utils/api'

type Course = {
  course_id: string
  course_code: string
  course_name: string
  course_type: string
  units: number
  price?: number
  status?: string
}

export function CourseManagement() {
  const [courses, setCourses] = useState<Course[]>([])
  const [loading, setLoading] = useState(false)
  const [showModal, setShowModal] = useState(false)
  const [form, setForm] = useState({
    course_code: '',
    course_name: '',
    course_type: 'Lecture',
    units: 3,
    price: 0,
    section_capacity: 30,
    semester: '2026-01',
    status: 'draft',
    classification: 'Core',
    reason: '',
  })

  const fetchCourses = async () => {
    setLoading(true)
    try {
      const res = await api.get('/courses/catalog')
      setCourses(res.courses || [])
    } catch (err) {
      console.error('Failed to fetch courses', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    void fetchCourses()
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const payload = {
        course_code: form.course_code,
        course_name: form.course_name,
        course_type: form.course_type,
        units: Number(form.units),
        price: Number(form.price),
        section_capacity: Number(form.section_capacity),
        semester: form.semester,
        status: form.status,
      }

      await api.post('/courses', payload)
      setShowModal(false)
      setForm({
        course_code: '',
        course_name: '',
        course_type: 'Lecture',
        units: 3,
        price: 0,
        section_capacity: 30,
        semester: '2026-01',
        status: 'draft',
        classification: 'Core',
        reason: '',
      })
      void fetchCourses()
    } catch (err: any) {
      console.error('Failed to create course', err)
      alert(err?.message || 'Failed to create course')
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Course Management</h1>
          <p className="mt-2 text-sm text-gray-700">Create, edit, and manage courses in the system.</p>
        </div>
        <Button className="flex items-center gap-2" onClick={() => setShowModal(true)}>
          <Plus className="h-4 w-4" />
          Add New Course
        </Button>
      </div>

      <div className="bg-white shadow rounded-lg">
        <div className="px-4 py-5 sm:p-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg leading-6 font-medium text-gray-900">All Courses</h3>
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Search courses..."
                className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
              <select className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-blue-500">
                <option>All Status</option>
                <option>Draft</option>
                <option>Active</option>
                <option>Archived</option>
              </select>
            </div>
          </div>

          <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 md:rounded-lg">
            <table className="min-w-full divide-y divide-gray-300">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Course Code</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Course Name</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Units</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {loading ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-4 text-center text-sm text-gray-500">Loading...</td>
                  </tr>
                ) : (
                  courses.map((c) => (
                    <tr key={c.course_id}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{c.course_code}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{c.course_name}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{c.course_type}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{c.units}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{c.status || 'Active'}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex gap-2">
                          <button className="text-blue-600 hover:text-blue-900">
                            <Edit className="h-4 w-4" />
                          </button>
                          <button className="text-red-600 hover:text-red-900">
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40 p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-4xl sm:max-w-5xl p-6 sm:p-8 ring-1 ring-gray-100 max-h-[calc(100vh-4rem)] overflow-y-auto">
            <div className="flex items-start justify-between">
              <div>
                <h2 className="text-2xl font-bold text-slate-900">NEW COURSE PROPOSAL</h2>
                <p className="mt-1 text-sm text-slate-500">Ensure all information is accurate. Your application will be reviewed based on academic standards.</p>
              </div>
              
            </div>

            <form onSubmit={handleSubmit} className="mt-6 space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-medium text-slate-600">COURSE CODE *</label>
                  <input required placeholder="e.g. CS101" value={form.course_code} onChange={(e) => setForm({ ...form, course_code: e.target.value })} className="mt-2 w-full px-4 py-3 border border-gray-100 rounded-xl bg-slate-50 text-sm" />
                </div>
                <div>
                  <label className="text-xs font-medium text-slate-600">COURSE TITLE *</label>
                  <input required placeholder="e.g. Introduction to Computing" value={form.course_name} onChange={(e) => setForm({ ...form, course_name: e.target.value })} className="mt-2 w-full px-4 py-3 border border-gray-100 rounded-xl bg-slate-50 text-sm" />
                </div>
              </div>

              <div className="grid grid-cols-1 gap-4">
                <div>
                  <label className="text-xs font-medium text-slate-600">CLASSIFICATION</label>
                  <select value={form.classification} onChange={(e) => setForm({ ...form, classification: e.target.value })} className="mt-2 w-full px-4 py-3 border border-gray-100 rounded-xl bg-slate-50 text-sm">
                    <option>Core</option>
                    <option>Elective</option>
                    <option>Major</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="text-xs font-medium text-slate-600">TYPE</label>
                  <select value={form.course_type} onChange={(e) => setForm({ ...form, course_type: e.target.value })} className="mt-2 w-full px-4 py-3 border border-gray-100 rounded-xl bg-slate-50 text-sm">
                    <option>Lecture</option>
                    <option>Lab</option>
                    <option>Seminar</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs font-medium text-slate-600">UNITS</label>
                  <input type="number" value={form.units} onChange={(e) => setForm({ ...form, units: Number(e.target.value) })} className="mt-2 w-full px-4 py-3 border border-gray-100 rounded-xl bg-slate-50 text-sm" />
                </div>
                <div>
                  <label className="text-xs font-medium text-slate-600">SEMESTER OFFERED</label>
                  <input placeholder="1st Semester" value={form.semester} onChange={(e) => setForm({ ...form, semester: e.target.value })} className="mt-2 w-full px-4 py-3 border border-gray-100 rounded-xl bg-slate-50 text-sm" />
                </div>
              </div>

              <div className="border border-green-100 bg-green-50 rounded-xl p-4">
                <label className="text-xs font-semibold text-green-700">BASE TUITION FEE (PHP)</label>
                <div className="mt-3">
                  <input type="number" value={form.price} onChange={(e) => setForm({ ...form, price: Number(e.target.value) })} className="w-48 px-4 py-3 rounded-lg border border-green-200 bg-white text-lg font-semibold text-green-800" />
                </div>
              </div>

              <div>
                <label className="text-xs font-medium text-slate-600">PREREQUISITES</label>
                <div className="mt-2 flex gap-2 flex-wrap">
                  {/* Example tags; for now static. */}
                  <span className="px-3 py-1 rounded-full bg-slate-100 text-slate-700 text-sm">MATH105</span>
                  <span className="px-3 py-1 rounded-full bg-slate-100 text-slate-700 text-sm">CS101</span>
                </div>
              </div>

              <div>
                <label className="text-xs font-medium text-slate-600">REASON FOR PROPOSAL *</label>
                <textarea required placeholder="Explain the academic necessity and target audience for this new course..." value={form.reason} onChange={(e) => setForm({ ...form, reason: e.target.value })} className="mt-2 w-full px-4 py-3 border border-gray-100 rounded-xl bg-slate-50 text-sm h-28 resize-none" />
              </div>

              <div className="flex justify-end items-center gap-6">
                <button type="button" onClick={() => setShowModal(false)} className="text-slate-600">Cancel</button>
                <button type="submit" className="px-6 py-3 rounded-xl bg-sky-900 text-white shadow-md">SUBMIT PROPOSAL</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
