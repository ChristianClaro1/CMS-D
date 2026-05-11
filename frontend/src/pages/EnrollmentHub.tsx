import { useEffect, useMemo, useState } from 'react'
import Portal from '@/components/Portal'
import { api } from '@/utils/api'
import type { Course } from '@/types'

type EnrollmentSection = {
  section_id: string
  course_id: string
  course_code: string
  course_name: string
  semester: string
  status: string
  section: string
  section_capacity: number
  enrolled_count: number
  available_slots: number
  room_requirement?: string | null
  room?: string | null
  schedule?: string | null
  instructor_name?: string | null
}

type SectionForm = {
  course_id: string
  section: string
  section_capacity: number
  room: string
  schedule: string
}

const defaultSectionForm: SectionForm = {
  course_id: '',
  section: 'A',
  section_capacity: 40,
  room: '',
  schedule: '',
}

const SECTION_STORAGE_KEY = 'enrollment_sections'

function normalizeStatus(status?: string) {
  return (status || 'active').toString().toLowerCase()
}

export function EnrollmentHub() {
  const [activeTab, setActiveTab] = useState<'all' | 'full' | 'available'>('all')
  const [showCreate, setShowCreate] = useState(false)
  const [modalMode, setModalMode] = useState<'create' | 'edit' | null>(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [sections, setSections] = useState<EnrollmentSection[]>([])
  const [catalogCourses, setCatalogCourses] = useState<Course[]>([])
  const [loading, setLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [form, setForm] = useState<SectionForm>(defaultSectionForm)

  const loadCatalogCourses = async () => {
    const response = await api.get('/courses', { limit: 100 })
    setCatalogCourses(response?.courses ?? [])
  }

  const loadSections = () => {
    const stored = window.localStorage.getItem(SECTION_STORAGE_KEY)
    const parsed: EnrollmentSection[] = stored ? JSON.parse(stored) : []

    const catalogById = new Map(catalogCourses.map((course) => [course.course_id, course]))
    const hydrated = parsed
      .map((section) => {
        const course = catalogById.get(section.course_id)
        if (!course || normalizeStatus(course.status) !== 'active') {
          return null
        }

        const enrolledCount = Number(section.enrolled_count ?? 0)
        const sectionCapacity = Number(section.section_capacity ?? course.section_capacity ?? 0)

        return {
          ...section,
          course_code: course.course_code,
          course_name: course.course_name,
          semester: course.semester,
          status: course.status,
          section_capacity: sectionCapacity,
          enrolled_count: enrolledCount,
          available_slots: Math.max(sectionCapacity - enrolledCount, 0),
          room_requirement: section.room_requirement ?? course.room_requirement ?? null,
          instructor_name: section.instructor_name ?? course.instructor_name ?? 'TBA',
        }
      })
      .filter((section): section is NonNullable<typeof section> => section !== null)

    setSections(hydrated)
  }

  const persistSections = (nextSections: EnrollmentSection[]) => {
    setSections(nextSections)
    window.localStorage.setItem(SECTION_STORAGE_KEY, JSON.stringify(nextSections))
  }

  const refreshData = async () => {
    setLoading(true)
    try {
      await loadCatalogCourses()
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('Failed to load enrollment data', error)
      setCatalogCourses([])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    void refreshData()
  }, [])

  useEffect(() => {
    loadSections()
  }, [catalogCourses])

  const activeCourses = useMemo(
    () => catalogCourses.filter((course) => normalizeStatus(course.status) === 'active'),
    [catalogCourses],
  )

  const visibleSections = useMemo(
    () => sections.filter((section) => {
      if (normalizeStatus(section.status) !== 'active') {
        return false
      }

      const matchesSearch = [
        section.course_code,
        section.course_name,
        section.section,
        section.room,
        section.schedule,
        section.instructor_name,
        section.semester,
      ]
        .filter((value): value is string => Boolean(value))
        .some((value) => value.toLowerCase().includes(searchTerm.toLowerCase()))

      const matchesTab = activeTab === 'all'
        || (activeTab === 'full' && section.enrolled_count >= section.section_capacity)
        || (activeTab === 'available' && section.enrolled_count < section.section_capacity)

      return matchesSearch && matchesTab
    }),
    [activeTab, searchTerm, sections],
  )

  function openCreate() {
    setModalMode('create')
    setForm(defaultSectionForm)
    setShowCreate(true)
  }

  function openEdit(section: EnrollmentSection) {
    setModalMode('edit')
    setForm({
      course_id: section.course_id,
      section: section.section || 'A',
      section_capacity: section.section_capacity,
      room: section.room || section.room_requirement || '',
      schedule: section.schedule || '',
    })
    setShowCreate(true)
  }

  function removeSection(sectionId: string) {
    const target = sections.find((item) => item.section_id === sectionId)
    if (!target) return

    const confirmed = window.confirm(`Remove ${target.course_code} section ${target.section}? This cannot be undone.`)
    if (!confirmed) return

    const nextSections = sections.filter((item) => item.section_id !== sectionId)
    persistSections(nextSections)
  }

  function closeModal() {
    setShowCreate(false)
    setModalMode(null)
    setForm(defaultSectionForm)
  }

  function buildSectionId(courseId: string, sectionCode: string) {
    return `${courseId}:${sectionCode.trim().toUpperCase()}`
  }

  async function submitSection(e: React.FormEvent) {
    e.preventDefault()

    if (!form.course_id) {
      alert('Please select an active course.')
      return
    }

    setIsSaving(true)
    try {
      const selectedCourse = activeCourses.find((course) => course.course_id === form.course_id)
      if (!selectedCourse) {
        throw new Error('Selected course is not active.')
      }

      const nextSection: EnrollmentSection = {
        section_id: modalMode === 'edit' && sections.find((section) => section.course_id === form.course_id && section.section === form.section)?.section_id
          ? sections.find((section) => section.course_id === form.course_id && section.section === form.section)!.section_id
          : buildSectionId(form.course_id, form.section),
        course_id: selectedCourse.course_id,
        course_code: selectedCourse.course_code,
        course_name: selectedCourse.course_name,
        semester: selectedCourse.semester,
        status: selectedCourse.status,
        section: form.section.trim().toUpperCase(),
        section_capacity: Number(form.section_capacity),
        enrolled_count: modalMode === 'edit' ? (sections.find((section) => section.course_id === form.course_id && section.section === form.section)?.enrolled_count ?? 0) : 0,
        available_slots: Math.max(Number(form.section_capacity) - (modalMode === 'edit' ? (sections.find((section) => section.course_id === form.course_id && section.section === form.section)?.enrolled_count ?? 0) : 0), 0),
        room_requirement: form.room || selectedCourse.room_requirement || null,
        room: form.room || null,
        schedule: form.schedule || null,
        instructor_name: selectedCourse.instructor_name || 'TBA',
      }

      const existingIndex = sections.findIndex((section) => section.course_id === form.course_id && section.section === nextSection.section)
      const nextSections = existingIndex >= 0
        ? sections.map((section, index) => (index === existingIndex ? nextSection : section))
        : [...sections, nextSection]

      persistSections(nextSections)

      await api.patch(`/courses/${form.course_id}/sections`, {
        section: nextSection.section,
        section_capacity: nextSection.section_capacity,
        room: nextSection.room || undefined,
        schedule: nextSection.schedule || undefined,
      })

      closeModal()
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('Failed to save section', error)
      alert('Failed to save section')
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <div className="space-y-6">
      <header className="pb-6">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-4xl font-extrabold italic text-[#0f2147] tracking-tight">ENROLLMENT HUB</h1>
          <p className="mt-2 text-sm text-[#0f2147]">MANAGE ENROLLMENT LIMITS AND TECHNICAL SECTION SCHEDULING</p>
        </div>
      </header>

      <div className="max-w-7xl mx-auto bg-[#fef9ec] rounded-2xl p-6">
        <div className="mb-6 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="bg-white rounded-full px-1 py-1 shadow-sm inline-flex">
            <button type="button" onClick={() => setActiveTab('all')} className={`px-4 py-2 rounded-full text-sm ${activeTab === 'all' ? 'bg-yellow-50 text-[#0f2147] font-semibold' : 'text-gray-400'}`}>ALL SECTIONS</button>
            <button type="button" onClick={() => setActiveTab('full')} className={`px-4 py-2 rounded-full text-sm ${activeTab === 'full' ? 'bg-yellow-50 text-[#0f2147] font-semibold' : 'text-gray-400'}`}>FULL</button>
            <button type="button" onClick={() => setActiveTab('available')} className={`px-4 py-2 rounded-full text-sm ${activeTab === 'available' ? 'bg-yellow-50 text-[#0f2147] font-semibold' : 'text-gray-400'}`}>AVAILABLE</button>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-full lg:w-80">
              <input
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search sections, rooms, or instructors..."
                className="w-full rounded-full border border-[#dce3f1] bg-white px-4 py-2 text-sm shadow-[0_8px_18px_rgba(15,33,71,0.04)]"
              />
            </div>
            <button type="button" onClick={openCreate} className="px-4 py-2 rounded-full bg-[#0f2147] text-yellow-400 shadow">+ CREATE SECTION</button>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow p-6">
          {loading ? (
            <div className="rounded-xl border border-dashed border-[#dce3f1] bg-[#f9fbff] px-6 py-10 text-center text-sm text-[#6b7280]">Loading sections...</div>
          ) : visibleSections.length === 0 ? (
            <div className="rounded-xl border border-dashed border-[#dce3f1] bg-[#f9fbff] px-6 py-10 text-center text-sm text-[#6b7280]">No sections match the current filters.</div>
          ) : (
            <div className="space-y-4">
              {visibleSections.map((section) => {
                const utilization = Math.min(100, Math.round((section.enrolled_count / Math.max(section.section_capacity, 1)) * 100))
                const status = normalizeStatus(section.status)

                return (
                  <div key={section.course_id} className="rounded-2xl border border-[#dce6f4] bg-[#fbfdff] p-5 shadow-[0_12px_28px_rgba(15,33,71,0.04)]">
                    <div className="flex flex-col gap-5 xl:flex-row xl:items-center xl:justify-between">
                      <div className="min-w-0 flex-1">
                        <div className="flex flex-wrap items-center gap-3">
                          <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-yellow-300 font-bold text-[#0f2147]">
                            {section.course_code}
                          </div>
                          <div>
                            <div className="text-lg font-extrabold text-[#0f2147]">{section.course_name}</div>
                            <div className="text-xs uppercase tracking-[0.2em] text-gray-400">
                              {section.course_code} • Section {section.section} • {section.semester}
                            </div>
                          </div>
                          <span className={`inline-flex items-center rounded-full px-3 py-1 text-[0.65rem] font-extrabold tracking-[0.16em] ${status === 'active' ? 'border border-emerald-200 bg-emerald-50 text-emerald-600' : status === 'draft' ? 'border border-amber-200 bg-amber-50 text-amber-700' : 'border border-slate-200 bg-slate-50 text-slate-600'}`}>
                            {section.status.toUpperCase()}
                          </span>
                        </div>

                        <div className="mt-4 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
                          <div className="rounded-xl bg-white px-4 py-3 ring-1 ring-[#e5ecf6]">
                            <div className="text-[0.68rem] font-extrabold uppercase tracking-[0.2em] text-[#8d97b3]">Enrollment</div>
                            <div className="mt-2 text-sm font-semibold text-[#0f2147]">{section.enrolled_count}/{section.section_capacity}</div>
                            <div className="mt-2 h-2 overflow-hidden rounded-full bg-gray-100">
                              <div className="h-2 rounded-full bg-[#0f2147]" style={{ width: `${utilization}%` }} />
                            </div>
                          </div>

                          <div className="rounded-xl bg-white px-4 py-3 ring-1 ring-[#e5ecf6]">
                            <div className="text-[0.68rem] font-extrabold uppercase tracking-[0.2em] text-[#8d97b3]">Available Slots</div>
                            <div className="mt-2 text-sm font-semibold text-[#0f2147]">{section.available_slots}</div>
                          </div>

                          <div className="rounded-xl bg-white px-4 py-3 ring-1 ring-[#e5ecf6]">
                            <div className="text-[0.68rem] font-extrabold uppercase tracking-[0.2em] text-[#8d97b3]">Room</div>
                            <div className="mt-2 text-sm font-semibold text-[#0f2147]">{section.room || section.room_requirement || 'Standard'}</div>
                          </div>

                          <div className="rounded-xl bg-white px-4 py-3 ring-1 ring-[#e5ecf6]">
                            <div className="text-[0.68rem] font-extrabold uppercase tracking-[0.2em] text-[#8d97b3]">Instructor</div>
                            <div className="mt-2 text-sm font-semibold text-[#0f2147]">{section.instructor_name || 'TBA'}</div>
                          </div>
                        </div>

                        <div className="mt-4 flex flex-wrap items-center gap-2 text-sm text-[#6b7280]">
                          <span className="font-semibold text-[#0f2147]">Schedule:</span>
                          <span>{section.schedule || 'Not set'}</span>
                        </div>
                      </div>

                      <div className="flex items-center gap-3 self-start xl:self-center">
                        <button
                          type="button"
                          onClick={() => openEdit(section)}
                          className="rounded-full border border-[#dce3f1] bg-white px-4 py-2 text-xs font-extrabold uppercase tracking-[0.2em] text-[#0f2147] shadow-[0_8px_18px_rgba(15,33,71,0.04)]"
                        >
                          Edit Section
                        </button>
                        <button
                          type="button"
                          onClick={() => removeSection(section.section_id)}
                          className="rounded-full border border-[#f2c1bb] bg-[#fff1f0] px-4 py-2 text-xs font-extrabold uppercase tracking-[0.2em] text-[#b42318] shadow-[0_8px_18px_rgba(15,33,71,0.04)]"
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>

        {showCreate && (
          <Portal>
            <div className="fixed inset-0 z-50 flex items-start justify-center bg-black bg-opacity-60 p-6 pt-20">
              <div className="bg-white rounded-2xl shadow-xl w-full max-w-md mx-auto p-6 sm:p-8 ring-1 ring-gray-100">
                <div className="flex items-start justify-between">
                  <div>
                    <h2 className="text-2xl font-bold text-[#0f2147]">{modalMode === 'edit' ? 'Update Section' : 'Deploy Section'}</h2>
                    <p className="mt-2 text-sm text-gray-500">
                      {modalMode === 'edit'
                        ? 'Adjust capacity and scheduling for an existing section.'
                        : 'Deploy a live section for an active course.'}
                    </p>
                  </div>
                  <button onClick={closeModal} className="text-gray-400 text-xl leading-none">×</button>
                </div>

                <form onSubmit={submitSection} className="mt-6 space-y-5">
                  {modalMode === 'create' ? (
                    <div>
                      <label className="block text-xs font-semibold text-gray-600 mb-2">Course</label>
                      <select
                        required
                        value={form.course_id}
                        onChange={(e) => setForm({ ...form, course_id: e.target.value })}
                        className="w-full px-4 py-3 rounded-lg border border-gray-100 bg-slate-50 text-sm"
                      >
                        <option value="">Select an active course</option>
                        {activeCourses.map((course) => (
                          <option key={course.course_id} value={course.course_id}>
                            {course.course_code} - {course.course_name} ({course.status})
                          </option>
                        ))}
                      </select>
                      <p className="mt-2 text-xs text-gray-500">Only active courses are available here.</p>
                    </div>
                  ) : (
                    <div className="rounded-2xl border border-[#dce3f1] bg-[#f9fbff] p-4">
                      <div className="text-[0.68rem] font-extrabold uppercase tracking-[0.22em] text-[#8d97b3]">Editing section</div>
                      <div className="mt-2 text-sm font-semibold text-[#0f2147]">
                        {activeCourses.find((course) => course.course_id === form.course_id)?.course_code || 'Course'} - {activeCourses.find((course) => course.course_id === form.course_id)?.course_name || 'Section'}
                      </div>
                      <div className="mt-1 text-sm text-[#6b7280]">Course is shown for context and cannot be changed here.</div>
                    </div>
                  )}

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-gray-600 mb-2">Section Code</label>
                      <input
                        required
                        value={form.section}
                        onChange={(e) => setForm({ ...form, section: e.target.value })}
                        placeholder="e.g. A"
                        className="w-full px-4 py-3 rounded-lg border border-gray-100 bg-slate-50 text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-gray-600 mb-2">Capacity</label>
                      <input
                        required
                        type="number"
                        min="1"
                        value={form.section_capacity}
                        onChange={(e) => setForm({ ...form, section_capacity: Number(e.target.value) })}
                        className="w-full px-4 py-3 rounded-lg border border-gray-100 bg-slate-50 text-sm"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-gray-600 mb-2">Schedule Details</label>
                    <input
                      value={form.schedule}
                      onChange={(e) => setForm({ ...form, schedule: e.target.value })}
                      placeholder="e.g. MW 9:00 - 10:30 AM"
                      className="w-full px-4 py-3 rounded-lg border border-gray-100 bg-slate-50 text-sm"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-gray-600 mb-2">Facility/Room Requirements</label>
                    <input
                      value={form.room}
                      onChange={(e) => setForm({ ...form, room: e.target.value })}
                      placeholder="e.g. Computer Lab, Projector required..."
                      className="w-full px-4 py-3 rounded-lg border border-gray-100 bg-slate-50 text-sm"
                    />
                  </div>

                  <div className="pt-2">
                    <button type="submit" disabled={isSaving} className="w-full px-6 py-3 rounded-xl bg-[#0f2147] text-yellow-400 shadow-md disabled:opacity-60">
                      {isSaving ? 'Saving...' : modalMode === 'edit' ? 'UPDATE SECTION' : 'DEPLOY SECTION'}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </Portal>
        )}
      </div>
    </div>
  )
}

export default EnrollmentHub
