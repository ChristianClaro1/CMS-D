import React, { useEffect, useState } from 'react'
import NavTab from '@/components/NavTab'
import { api } from '@/utils/api'
import { useRole } from '@/contexts/RoleContext'
import { useLocation, useNavigate } from 'react-router-dom'

const initialForm = {
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
}

export default function CourseManagement(): JSX.Element {
  const { role } = useRole()
  const navigate = useNavigate()
  const location = useLocation()

  useEffect(() => {
    // Department Chair can only view the Academic Catalog inside Academic Programs
    if (role === 'Department Chair') {
      const path = location.pathname
      if (path !== '/courses') {
        navigate('/courses', { replace: true })
      }
    }

    // Registrar should be sent to Proposal Oversight view inside Academic Programs
    if (role === 'Registrar') {
      const path = location.pathname
      if (path !== '/courses/oversight') {
        navigate('/courses/oversight', { replace: true })
      }
    }
  }, [role, location.pathname, navigate])

  const [form, setForm] = useState(initialForm)

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
      setForm(initialForm)
    } catch (err: any) {
      // eslint-disable-next-line no-console
      console.error('Failed to create course', err)
      alert(err?.message || 'Failed to create course')
    }
  }

  return (
    <div className="space-y-6">
      <header className="pb-8">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-4xl font-extrabold italic text-[#0f2147] tracking-tight">ACADEMIC PROGRAMS</h1>
          <p className="mt-2 text-sm text-[#0f2147]">ACADEMIC PROGRAM & CURRICULUM DEVELOPMENT PORTAL</p>

          <nav className="mt-6 flex gap-8 text-sm font-semibold">
            {(role !== 'Department Chair') && <NavTab to="/courses/manage" label="NEW PROGRAM PROPOSAL" />}
            <NavTab to="/courses" label="ACADEMIC CATALOG" />
            {(role !== 'Department Chair') && <NavTab to="/prerequisites" label="PREREQUISITE MANAGER" />}
          </nav>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4">
        <div className="mx-auto max-w-4xl bg-white rounded-3xl shadow-md border border-gray-100 p-8 sm:p-12">
          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between text-left">
            <div>
              <h2 className="text-4xl font-extrabold text-[#0f2147] uppercase tracking-wide">NEW COURSE PROPOSAL</h2>
              <p className="mt-2 text-sm text-[#6b7280] uppercase tracking-wide">Ensure all information is accurate. Your application will be reviewed based on academic standards.</p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="mt-10 space-y-10 mx-auto max-w-3xl">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-semibold text-[#0f2147] tracking-wider uppercase">COURSE CODE *</label>
                <input
                  required
                  placeholder="e.g. CS101"
                  value={form.course_code}
                  onChange={(e) => setForm({ ...form, course_code: e.target.value })}
                  className="mt-3 w-full px-6 py-4 border border-gray-100 rounded-lg bg-white text-base shadow-sm placeholder:text-slate-300"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-[#0f2147] tracking-wider uppercase">COURSE TITLE *</label>
                <input
                  required
                  placeholder="e.g. Introduction to Computing"
                  value={form.course_name}
                  onChange={(e) => setForm({ ...form, course_name: e.target.value })}
                  className="mt-3 w-full px-6 py-4 border border-gray-100 rounded-lg bg-white text-base shadow-sm placeholder:text-slate-300"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4">
              <div>
                <label className="text-xs font-medium text-slate-600 uppercase tracking-wide">CLASSIFICATION</label>
                <select
                  value={form.classification}
                  onChange={(e) => setForm({ ...form, classification: e.target.value })}
                  className="mt-3 w-full px-4 py-3 border border-gray-100 rounded-lg bg-white text-sm shadow-sm"
                >
                  <option>Core</option>
                  <option>Elective</option>
                  <option>Major</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-6">
              <div>
                <label className="text-xs font-medium text-slate-600 uppercase tracking-wide">TYPE</label>
                <select
                  value={form.course_type}
                  onChange={(e) => setForm({ ...form, course_type: e.target.value })}
                  className="mt-3 w-full px-4 py-3 border border-gray-100 rounded-lg bg-white text-sm shadow-sm"
                >
                  <option>Lecture</option>
                  <option>Lab</option>
                  <option>Seminar</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-medium text-slate-600 uppercase tracking-wide">UNITS</label>
                <input
                  type="number"
                  value={form.units}
                  onChange={(e) => setForm({ ...form, units: Number(e.target.value) })}
                  className="mt-3 w-full px-4 py-3 border border-gray-100 rounded-lg bg-white text-sm shadow-sm"
                />
              </div>

              <div>
                <label className="text-xs font-medium text-slate-600 uppercase tracking-wide">SEMESTER OFFERED</label>
                <input
                  placeholder="1st Semester"
                  value={form.semester}
                  onChange={(e) => setForm({ ...form, semester: e.target.value })}
                  className="mt-3 w-full px-4 py-3 border border-gray-100 rounded-lg bg-white text-sm shadow-sm"
                />
              </div>
            </div>

            <div className="border border-green-100 bg-green-50 rounded-lg p-6">
              <label className="text-xs font-semibold text-green-700">BASE TUITION FEE (PHP)</label>
              <div className="mt-3">
                <input
                  type="number"
                  value={form.price}
                  onChange={(e) => setForm({ ...form, price: Number(e.target.value) })}
                  className="w-56 px-4 py-3 rounded-lg border border-green-200 bg-white text-lg font-semibold text-green-800"
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-medium text-slate-600 uppercase tracking-wide">PREREQUISITES</label>
              <div className="mt-2 flex gap-2 flex-wrap">
                <span className="px-3 py-1 rounded-full bg-slate-100 text-slate-700 text-sm">MATH105</span>
                <span className="px-3 py-1 rounded-full bg-slate-100 text-slate-700 text-sm">CS101</span>
              </div>
            </div>

            <div>
              <label className="text-xs font-medium text-slate-600 uppercase tracking-wide">REASON FOR PROPOSAL *</label>
              <textarea
                required
                placeholder="Explain the academic necessity and target audience for this new course..."
                value={form.reason}
                onChange={(e) => setForm({ ...form, reason: e.target.value })}
                className="mt-3 w-full px-6 py-5 border border-gray-100 rounded-xl bg-white text-base h-36 resize-none shadow-sm placeholder:text-slate-300"
              />
            </div>

            <div className="pt-6 border-t border-gray-100 flex items-center justify-between">
              <button type="button" onClick={() => setForm(initialForm)} className="text-sm text-slate-600">Cancel</button>
              <button type="submit" className="px-6 py-3 rounded-full bg-[#0f2147] text-yellow-400 shadow-[0_8px_24px_rgba(15,33,71,0.35)] text-sm font-semibold uppercase">Submit Proposal</button>
            </div>
          </form>
        </div>
      
      </main>
    </div>
  )
}
