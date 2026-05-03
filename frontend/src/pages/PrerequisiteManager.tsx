import { useState, useEffect } from 'react'
import NavTab from '@/components/NavTab'
import Portal from '@/components/Portal'
import { useRole } from '@/contexts/RoleContext'
import { useNavigate } from 'react-router-dom'

const mockPrereqs = [
  { id: 'PR-001', course: 'CS101', prerequisite: 'MATH101', type: 'Hard' },
  { id: 'PR-002', course: 'CS201', prerequisite: 'CS101', type: 'Soft' },
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
            {(role !== 'Department Chair') && <NavTab to="/courses/manage" label="NEW PROGRAM PROPOSAL" />}
            <NavTab to="/courses" label="ACADEMIC CATALOG" />
            {(role !== 'Department Chair') && <NavTab to="/prerequisites" label="PREREQUISITE MANAGER" />}
          </nav>
        </div>
      </header>

      <div className="max-w-7xl mx-auto">
        <div className="bg-[#fef9ec] rounded-2xl p-8">
          <div className="bg-white rounded-2xl shadow-lg p-8">
            <div className="mb-6">
              <div>
                <h2 className="text-3xl font-extrabold text-[#0f2147]">Academic Dependency Manager</h2>
                <p className="mt-2 text-sm text-[#6b7280] uppercase tracking-wider">Define and manage course prerequisites and co-requisites to ensure academic flow integrity.</p>
              </div>
            </div>

            <div className="space-y-4">
              {mockPrereqs.map((p) => (
                <div key={p.id} className="flex items-center justify-between p-5 bg-[#f7fbfe] rounded-xl border border-[#e6eef6]">
                  <div>
                    <h3 className="text-lg font-semibold text-[#0f2147]">{p.course}: <span className="font-medium text-gray-700">{p.prerequisite.replace(/,.*/,'')}</span></h3>
                    <p className="mt-1 text-sm text-gray-400">{p.id} • {p.type} dependency</p>
                    <div className="mt-3">
                      <span className="inline-block px-2 py-1 text-xs font-semibold text-[#0f2147] bg-white border border-[#e6eef6] rounded">{p.prerequisite}</span>
                    </div>
                  </div>

                  <div>
                    <button onClick={() => openConfig(p)} className="px-4 py-2 rounded-full bg-white border border-gray-200 shadow-sm">Configure Dependencies</button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
      {showModal && selectedPrereq && (
        <Portal>
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60 p-6">
            <div className="bg-white rounded-2xl shadow-xl w-full max-w-3xl mx-auto p-6 sm:p-8 ring-1 ring-gray-100">
              <div className="text-left">
                <h2 className="text-2xl font-bold text-[#0f2147]">Prerequisite Manager: {selectedPrereq.course}</h2>
                <p className="mt-2 text-sm text-gray-500">Select courses that must be completed before enrolling in {selectedPrereq.course}.</p>
              </div>

              <div className="mt-6 bg-[#f7fbff] rounded-xl p-6">
                <div className="bg-white rounded-lg p-6 border border-[#e6eef6]">
                  <div className="inline-block">
                    <span className="inline-block px-4 py-2 text-sm font-bold text-yellow-300 bg-[#0f2147] rounded-lg">{selectedPrereq.prerequisite}</span>
                  </div>
                </div>
              </div>

              <div className="mt-6 flex items-center justify-between">
                <button onClick={closeConfig} className="text-sm font-semibold text-gray-400 tracking-widest">Cancel</button>
                <button onClick={closeConfig} className="px-6 py-3 rounded-xl bg-[#0f2147] text-yellow-400 shadow-md">Save Changes</button>
              </div>
            </div>
          </div>
        </Portal>
      )}
    </div>
  )
}

export default PrerequisiteManager
