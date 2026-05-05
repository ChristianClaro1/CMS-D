import { useState } from 'react'
import NavTab from '@/components/NavTab'
import Portal from '@/components/Portal'
import { api } from '@/utils/api'
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
  const [isProposalOpen, setIsProposalOpen] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [form, setForm] = useState({
    course_code: '',
    course_name: '',
    course_type: 'Lecture',
    units: 3,
    price: 0,
    semester: '2026-01',
    reason: '',
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      await api.post('/courses', {
        course_code: form.course_code,
        course_name: form.course_name,
        course_type: form.course_type,
        units: Number(form.units),
        price: Number(form.price),
        section_capacity: 30,
        semester: form.semester,
        status: 'draft',
      })

      setForm({
        course_code: '',
        course_name: '',
        course_type: 'Lecture',
        units: 3,
        price: 0,
        semester: '2026-01',
        reason: '',
      })
      setIsProposalOpen(false)
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('Failed to create course', error)
      alert('Failed to create course')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="space-y-6">
      <header className="pb-6">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-3xl font-extrabold italic text-[#0f2147] tracking-tight">ACADEMIC PROGRAMS</h1>
          <p className="mt-2 text-sm text-[#0f2147]">ACADEMIC PROGRAM & CURRICULUM DEVELOPMENT PORTAL</p>

          <nav className="mt-6 flex gap-8 text-sm font-semibold">
            {role === 'Registrar' ? (
              <>
                <NavTab to="/courses/oversight" label="PROPOSAL OVERSIGHT" />
                <NavTab to="/courses" label="ACADEMIC CATALOG" />
              </>
            ) : (
              <>
                {((role as string) !== 'Department Chair') && <NavTab to="/courses/oversight" label="PROPOSAL OVERSIGHT" />}
                <NavTab to="/courses" label="ACADEMIC CATALOG" />
                {((role as string) !== 'Department Chair' && (role as string) !== 'Registrar') && <NavTab to="/prerequisites" label="PREREQUISITE MANAGER" />}
              </>
            )}
          </nav>
        </div>
      </header>

      <div className="max-w-7xl mx-auto rounded-2xl bg-white p-6 shadow-[0_10px_24px_rgba(15,33,71,0.06)] ring-1 ring-[#dce6f4]">
        {/* Filters area */}
        <div className="mb-6 flex items-center justify-between gap-4">
          <div className="flex-1">
            <div className="relative max-w-lg">
              <input
                className="w-full rounded-2xl border border-[#dce3f1] bg-white px-4 py-3 placeholder-gray-400 shadow-[0_8px_18px_rgba(15,33,71,0.04)]"
                placeholder="Search by code or title..."
              />
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button className="rounded-full border border-[#dce3f1] bg-white px-4 py-2 font-semibold text-[#0f2147] shadow-[0_8px_18px_rgba(15,33,71,0.04)]">
              Filter
            </button>
            {role !== 'Registrar' && role !== 'Department Chair' && (
              <button
                type="button"
                onClick={() => setIsProposalOpen(true)}
                className="rounded-full bg-[#0f2147] px-6 py-3 text-[0.72rem] font-extrabold tracking-[0.25em] text-[#ffd233] shadow-[0_12px_28px_rgba(15,33,71,0.24)] transition-transform hover:-translate-y-0.5 hover:shadow-[0_16px_34px_rgba(15,33,71,0.28)]"
              >
                NEW COURSE
              </button>
            )}
          </div>
        </div>

        {/* Course list */}
        <div className="space-y-5">
          {mockCourses.map((course) => (
            <div
              key={course.course_id}
              className="rounded-2xl border border-[#dce6f4] bg-white px-5 py-5 shadow-[0_10px_24px_rgba(15,33,71,0.05)] transition-shadow hover:shadow-[0_14px_30px_rgba(15,33,71,0.08)]"
            >
              <div className="flex items-start justify-between gap-6">
                <div className="flex min-w-0 items-start gap-4">
                  <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl border border-[#eef2f8] bg-[#fff9e9] text-sm font-extrabold text-[#8c9ab7] shadow-[0_6px_16px_rgba(15,33,71,0.04)]">
                    {course.course_code.slice(0, 2)}
                  </div>

                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-3">
                      <h3 className="text-[1.05rem] font-extrabold italic tracking-tight text-[#0f2147] sm:text-[1.15rem]">
                        {course.course_name}
                      </h3>
                      <span className="inline-flex items-center rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-[0.65rem] font-extrabold tracking-[0.16em] text-emerald-600">
                        ACTIVE
                      </span>
                    </div>

                    <div className="mt-3 flex flex-wrap items-center gap-x-3 gap-y-2 text-[0.72rem] font-bold uppercase tracking-[0.24em] text-[#8d97b3]">
                      <span className="rounded-md bg-[#f4f7fb] px-2.5 py-1 text-[#93a3c4] shadow-[inset_0_0_0_1px_rgba(15,33,71,0.03)]">
                        {course.course_code}
                      </span>
                      <span>{course.units} Units</span>
                      <span className="text-[#c0c8d8]">•</span>
                      <span>{course.course_type}</span>
                      <span className="text-[#c0c8d8]">•</span>
                      <span>{course.is_elective ? 'Elective' : 'Core'}</span>
                      <span className="text-[#c0c8d8]">•</span>
                      <span className="text-emerald-600">PNAN</span>
                    </div>

                    <div className="mt-4 flex flex-wrap items-center gap-2">
                      <span className="text-[0.7rem] font-bold uppercase tracking-[0.24em] text-[#8d97b3]">Prereq:</span>
                      {course.prerequisites.length > 0 ? (
                        <span className="inline-flex items-center rounded-md bg-[#fff0b8] px-3 py-1 text-[0.72rem] font-extrabold tracking-[0.1em] text-[#0f2147] shadow-[0_4px_10px_rgba(15,33,71,0.04)]">
                          {course.prerequisites[0]}
                        </span>
                      ) : (
                        <span className="inline-flex items-center rounded-md bg-[#f4f7fb] px-3 py-1 text-[0.72rem] font-extrabold tracking-[0.1em] text-[#93a3c4]">
                          NONE
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex shrink-0 items-start gap-3">
                  <div className="rounded-xl bg-[#f6f8fc] px-3 py-3 text-[#b7c0d3] shadow-[inset_0_0_0_1px_rgba(15,33,71,0.03)]">
                    •••
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {isProposalOpen && (
        <Portal>
          <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-black/60 px-4 py-4 backdrop-blur-md sm:px-6 sm:py-6">
            <div className="relative w-full max-w-5xl rounded-3xl bg-white shadow-[0_30px_90px_rgba(15,33,71,0.25)] ring-1 ring-[#0f2147]/10 max-h-[calc(100vh-2rem)] overflow-y-auto">
              <div className="px-8 py-8 sm:px-12 sm:py-10">
                <div>
                  <h2 className="text-3xl font-extrabold text-[#0f2147] uppercase tracking-wide">NEW COURSE PROPOSAL</h2>
                  <p className="mt-2 text-sm text-[#6b7280] uppercase tracking-wide">
                    Submit a new course proposal for review before it is added to the catalog.
                  </p>
                </div>

                <form onSubmit={handleSubmit} className="mt-8 space-y-8">
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
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

                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
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
                    <label className="text-xs font-medium text-slate-600 uppercase tracking-wide">REASON FOR PROPOSAL *</label>
                    <textarea
                      required
                      placeholder="Explain the academic necessity and target audience for this new course..."
                      value={form.reason}
                      onChange={(e) => setForm({ ...form, reason: e.target.value })}
                      className="mt-3 w-full px-6 py-5 border border-gray-100 rounded-xl bg-white text-base h-36 resize-none shadow-sm placeholder:text-slate-300"
                    />
                  </div>

                  <div className="pt-4 border-t border-gray-100 flex items-center justify-between">
                    <button type="button" onClick={() => setIsProposalOpen(false)} className="text-sm text-slate-600">
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="px-6 py-3 rounded-full bg-[#0f2147] text-yellow-400 shadow-[0_8px_24px_rgba(15,33,71,0.35)] text-sm font-semibold uppercase disabled:opacity-60"
                    >
                      {isSubmitting ? 'Submitting...' : 'Submit Proposal'}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </Portal>
      )}
    </div>
  )
}

export default CourseCatalog
