import { useState, useEffect } from 'react'
import NavTab from '@/components/NavTab'
import Portal from '@/components/Portal'
import { useRole } from '@/contexts/RoleContext'
import { useNavigate } from 'react-router-dom'

const mockPrereqs = [
  { id: 'PR-001', course: 'GFDD: vvsd', prerequisite: 'MATH105', type: 'Hard' },
  { id: 'PR-002', course: 'MATH105: Calculus I', prerequisite: 'CS101', type: 'Hard' },
  { id: 'PR-003', course: 'CS101: Intro to Programming', prerequisite: 'No prerequisites defined', type: 'Soft' },
]

export function PrerequisiteManager() {
  const { role } = useRole()
  const navigate = useNavigate()

  useEffect(() => {
    if (role === 'Department Chair') {
      navigate('/courses', { replace: true })
    }

    if (role === 'Registrar') {
      navigate('/courses/oversight', { replace: true })
    }
  }, [role, navigate])

  const [showModal, setShowModal] = useState(false)
  const [selectedPrereq, setSelectedPrereq] = useState<{ id: string; course: string; prerequisite: string } | null>(null)

  function openConfig(p: { id: string; course: string; prerequisite: string }) {
    setSelectedPrereq(p)
    setShowModal(true)
  }

  function closeConfig() {
    setShowModal(false)
    setSelectedPrereq(null)
  }

  return (
    <div className="space-y-6">
      <header className="pb-6">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-3xl font-extrabold italic text-[#0f2147] tracking-tight">ACADEMIC PROGRAMS</h1>
          <p className="mt-2 text-sm text-[#0f2147]">ACADEMIC PROGRAM & CURRICULUM DEVELOPMENT PORTAL</p>

          <nav className="mt-6 flex gap-8 text-sm font-semibold">
            <NavTab to="/courses/oversight" label="PROPOSAL OVERSIGHT" />
            <NavTab to="/courses" label="ACADEMIC CATALOG" />
            {role !== 'Department Chair' && <NavTab to="/prerequisites" label="PREREQUISITE MANAGER" />}
          </nav>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 pb-4">
        <div className="rounded-[2rem] bg-[#fef9ec] p-4 sm:p-6 lg:p-8">
          <div className="rounded-[1.75rem] border border-[#dce6f4] bg-white px-6 py-8 shadow-[0_12px_28px_rgba(15,33,71,0.06)] sm:px-10 sm:py-10 lg:px-12 lg:py-12">
            <div className="mb-8">
              <h2 className="text-[1.8rem] font-extrabold text-[#192544] sm:text-[2.1rem]">Academic Dependency Manager</h2>
              <p className="mt-2 max-w-4xl text-[0.78rem] font-medium uppercase tracking-[0.12em] text-[#66789c] sm:text-[0.82rem]">
                Define and manage course prerequisites and co-requisites to ensure academic flow integrity.
              </p>
            </div>

            <div className="space-y-5">
              {mockPrereqs.map((p) => (
                <div
                  key={p.id}
                  className="flex items-center justify-between gap-6 rounded-[1.35rem] border border-[#dce6f4] bg-[#f7fbff] px-5 py-6 shadow-[0_8px_20px_rgba(15,33,71,0.03)] sm:px-6 sm:py-7"
                >
                  <div className="min-w-0">
                    <h3 className="text-[1.05rem] font-extrabold text-[#192544] sm:text-[1.1rem]">{p.course}</h3>
                    <p className="mt-2 text-[0.78rem] font-medium uppercase tracking-[0.14em] text-[#9aa8c0]">
                      {p.id} • {p.type} dependency
                    </p>
                    <div className="mt-3">
                      <span className="inline-flex items-center rounded-md border border-[#e4ebf7] bg-white px-2.5 py-1 text-[0.7rem] font-bold text-[#1b4dff] shadow-[0_4px_10px_rgba(15,33,71,0.03)]">
                        {p.prerequisite}
                      </span>
                    </div>
                  </div>

                  <div className="shrink-0">
                    <button
                      onClick={() => openConfig(p)}
                      className="rounded-2xl border border-[#dce3f1] bg-white px-6 py-3 text-sm font-semibold text-[#324160] shadow-[0_8px_18px_rgba(15,33,71,0.04)] transition-colors hover:border-[#c4d0e6] hover:text-[#0f2147]"
                    >
                      Configure Dependencies
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {showModal && selectedPrereq && (
        <Portal>
          <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-black/60 px-4 py-6 sm:items-center sm:px-6">
            <div className="mx-auto max-h-[calc(100vh-3rem)] w-full max-w-3xl overflow-y-auto rounded-2xl bg-white p-6 shadow-xl ring-1 ring-gray-100 sm:p-8">
              <div className="text-left">
                <h2 className="text-2xl font-bold text-[#0f2147]">Prerequisite Manager: {selectedPrereq.course}</h2>
                <p className="mt-2 text-sm text-gray-500">
                  Select courses that must be completed before enrolling in {selectedPrereq.course}.
                </p>
              </div>

              <div className="mt-6 rounded-xl bg-[#f7fbff] p-6">
                <div className="rounded-lg border border-[#e6eef6] bg-white p-6">
                  <div className="inline-block">
                    <span className="inline-flex items-center rounded-lg bg-[#0f2147] px-4 py-2 text-sm font-bold text-yellow-300">
                      {selectedPrereq.prerequisite}
                    </span>
                  </div>
                </div>
              </div>

              <div className="mt-6 flex items-center justify-between">
                <button onClick={closeConfig} className="text-sm font-semibold tracking-widest text-gray-400">
                  Cancel
                </button>
                <button onClick={closeConfig} className="rounded-xl bg-[#0f2147] px-6 py-3 text-yellow-400 shadow-md">
                  Save Changes
                </button>
              </div>
            </div>
          </div>
        </Portal>
      )}
    </div>
  )
}

export default PrerequisiteManager
