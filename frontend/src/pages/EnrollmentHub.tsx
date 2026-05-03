import { useState } from 'react'
import Portal from '@/components/Portal'

export function EnrollmentHub() {
  const sections = [
    {
      id: 'S-101',
      code: 'MATAYAP',
      title: 'CALCULUS I',
      term: '1ST SEMESTER • MW',
      enrolled: 0,
      capacity: 40,
      roomReq: 'Standard',
      instructor: 'TBA',
    },
  ]

  const [activeTab, setActiveTab] = useState<'all' | 'full' | 'available'>('all')

  const [showCreate, setShowCreate] = useState(false)

  const filtered = sections.filter((s) => {
    if (activeTab === 'all') return true
    if (activeTab === 'full') return s.enrolled >= s.capacity
    return s.enrolled < s.capacity
  })

  return (
    <div className="space-y-6">
      <header className="pb-6">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-4xl font-extrabold italic text-[#0f2147] tracking-tight">ENROLLMENT HUB</h1>
          <p className="mt-2 text-sm text-[#0f2147]">MANAGE ENROLLMENT LIMITS AND TECHNICAL SECTION SCHEDULING</p>
        </div>
      </header>

      <div className="max-w-7xl mx-auto bg-[#fef9ec] rounded-2xl p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <div className="bg-white rounded-full px-1 py-1 shadow-sm inline-flex">
              <button onClick={() => setActiveTab('all')} className={`px-4 py-2 rounded-full text-sm ${activeTab === 'all' ? 'bg-yellow-50 text-[#0f2147] font-semibold' : 'text-gray-400'}`}>ALL SECTIONS</button>
              <button onClick={() => setActiveTab('full')} className={`px-4 py-2 rounded-full text-sm ${activeTab === 'full' ? 'bg-yellow-50 text-[#0f2147] font-semibold' : 'text-gray-400'}`}>FULL</button>
              <button onClick={() => setActiveTab('available')} className={`px-4 py-2 rounded-full text-sm ${activeTab === 'available' ? 'bg-yellow-50 text-[#0f2147] font-semibold' : 'text-gray-400'}`}>AVAILABLE</button>
            </div>
          </div>

              <div>
                <button onClick={() => setShowCreate(true)} className="px-4 py-2 rounded-full bg-[#0f2147] text-yellow-400 shadow">+ CREATE SECTION</button>
              </div>
        </div>

        <div className="bg-white rounded-2xl shadow p-6">
          {filtered.map((s) => (
            <div key={s.id} className="flex items-center gap-6 p-4 rounded-xl border border-gray-100">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-lg bg-yellow-300 flex items-center justify-center font-bold text-[#0f2147]">{s.code}</div>
                <div>
                  <div className="text-lg font-extrabold text-[#0f2147]">{s.title}</div>
                  <div className="text-xs uppercase text-gray-400">{s.term}</div>
                </div>
              </div>

              <div className="flex-1 flex items-center justify-center gap-6">
                <div className="text-xs text-gray-400 uppercase">Live Enrollment (SRM Sync)</div>
                <div className="w-48">
                  <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                    <div className="h-2 bg-gray-200" style={{ width: `${(s.enrolled / s.capacity) * 100}%` }} />
                  </div>
                </div>
                <div className="text-lg font-semibold">{s.enrolled}/{s.capacity}</div>
                <div className="text-xs text-gray-400 uppercase">Room Req</div>
                <div className="px-3 py-1 bg-gray-50 rounded text-sm">{s.roomReq}</div>
              </div>

              <div className="flex items-center gap-4">
                <div className="text-xs text-gray-400 uppercase">Instructor</div>
                <div className="flex items-center gap-2">
                  <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-sm text-gray-500">👤</div>
                  <div className="text-sm font-semibold text-[#0f2147]">{s.instructor}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
            {showCreate && (
              <Portal>
                <div className="fixed inset-0 z-50 flex items-start justify-center bg-black bg-opacity-60 p-6 pt-20">
                  <div className="bg-white rounded-2xl shadow-xl w-full max-w-md mx-auto p-6 sm:p-8 ring-1 ring-gray-100">
                    <div className="flex items-start justify-between">
                      <div>
                        <h2 className="text-2xl font-bold text-[#0f2147]">New Course Section</h2>
                        <p className="mt-2 text-sm text-gray-500">Create a new course section</p>
                      </div>
                      <button onClick={() => setShowCreate(false)} className="text-gray-400 text-xl leading-none">×</button>
                    </div>

                    <form onSubmit={(e) => { e.preventDefault(); setShowCreate(false) }} className="mt-6 space-y-5">
                      <div>
                        <label className="block text-xs font-semibold text-gray-600 mb-2">Course Assignment</label>
                        <select className="w-full px-4 py-3 rounded-lg border border-gray-100 bg-slate-50 text-sm">
                          <option>Select an Active Course</option>
                        </select>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-xs font-semibold text-gray-600 mb-2">Section Code</label>
                          <input placeholder="e.g. A" className="w-full px-4 py-3 rounded-lg border border-gray-100 bg-slate-50 text-sm" />
                        </div>
                        <div>
                          <label className="block text-xs font-semibold text-gray-600 mb-2">Capacity</label>
                          <input defaultValue={40} className="w-full px-4 py-3 rounded-lg border border-gray-100 bg-slate-50 text-sm" />
                        </div>
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-gray-600 mb-2">Schedule Details</label>
                        <input placeholder="e.g. MW 9:00 - 10:30 AM" className="w-full px-4 py-3 rounded-lg border border-gray-100 bg-slate-50 text-sm" />
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-gray-600 mb-2">Facility/Room Requirements</label>
                        <input placeholder="e.g. Computer Lab, Projector required..." className="w-full px-4 py-3 rounded-lg border border-gray-100 bg-slate-50 text-sm" />
                      </div>

                      <div className="pt-2">
                        <button type="submit" className="w-full px-6 py-3 rounded-xl bg-[#0f2147] text-yellow-400 shadow-md">DEPLOY SECTION</button>
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
