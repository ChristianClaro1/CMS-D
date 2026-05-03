 

import { useState } from 'react'
import Portal from '@/components/Portal'

export function InstructorManagement() {
  const [showAddModal, setShowAddModal] = useState(false)
  const [form, setForm] = useState({ name: '', email: '', dept: '', capacity: '18' })

  function openAdd() {
    setShowAddModal(true)
  }

  function closeAdd() {
    setShowAddModal(false)
    setForm({ name: '', email: '', dept: '', capacity: '18' })
  }

  function submitAdd(e: React.FormEvent) {
    e.preventDefault()
    // TODO: wire to API
    closeAdd()
  }

  const instructors = [
    { id: 'I-001', name: 'Engr. Andres Bonifacio', dept: 'Engineering', email: 'andres@iae.edu', load: 15, capacity: 18 },
    { id: 'I-002', name: 'Dr. Maria Clara', dept: 'Computer Science', email: 'maria@iae.edu', load: 12, capacity: 18 },
    { id: 'I-003', name: 'Prof. Jose Rizal', dept: 'Information Systems', email: 'jose@iae.edu', load: 6, capacity: 15 },
  ]

  return (
    <div className="space-y-6">
      <header className="pb-6">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-4xl font-extrabold italic text-[#0f2147] tracking-tight">FACULTY HUB</h1>
          <p className="mt-2 text-sm text-[#0f2147]">MANAGE FACULTY WORKLOADS AND ACADEMIC ALLOCATIONS</p>
        </div>
      </header>

      <div className="max-w-7xl mx-auto bg-[#fef9ec] rounded-2xl p-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <div className="bg-white rounded-xl shadow p-6 flex items-center gap-4">
            <div className="w-12 h-12 rounded-lg bg-[#eef2ff] flex items-center justify-center">
              <span className="text-xl text-[#0f2147]">👥</span>
            </div>
            <div>
              <div className="text-xs font-semibold text-gray-400 uppercase">Total Faculty</div>
              <div className="text-2xl font-extrabold text-[#0f2147]">3</div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow p-6 flex items-center gap-4">
            <div className="w-12 h-12 rounded-lg bg-[#ecfdf5] flex items-center justify-center">
              <span className="text-xl text-green-700">🎓</span>
            </div>
            <div>
              <div className="text-xs font-semibold text-gray-400 uppercase">Active Assignments</div>
              <div className="text-2xl font-extrabold text-[#0f2147]">0</div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow p-6 flex items-center gap-4">
            <div className="w-12 h-12 rounded-lg bg-[#fff7ed] flex items-center justify-center">
              <span className="text-xl text-yellow-600">✔️</span>
            </div>
            <div>
              <div className="text-xs font-semibold text-gray-400 uppercase">Total Capacity</div>
              <div className="text-2xl font-extrabold text-[#0f2147]">51</div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow p-4">
            <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100">
            <div className="flex-1 max-w-lg">
              <input placeholder="Search instructors..." className="w-full px-4 py-2 rounded-lg border border-gray-200 text-sm bg-white" />
            </div>
            <div>
              <button onClick={openAdd} className="ml-4 px-4 py-2 rounded-full bg-[#0f2147] text-yellow-400 shadow">+ Add Instructor</button>
            </div>
          </div>

          <div className="divide-y divide-gray-100">
            {instructors.map((ins) => {
              const pct = Math.round((ins.load / ins.capacity) * 100)
              return (
                <div key={ins.id} className="flex items-center justify-between px-6 py-5">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-[#fff7ed] flex items-center justify-center text-lg font-bold text-[#0f2147]">{ins.name.split(' ').map(n=>n[0]).slice(0,2).join('')}</div>
                    <div>
                      <div className="font-semibold text-[#0f2147]">{ins.name}</div>
                      <div className="text-sm text-gray-400">{ins.dept} • {ins.email}</div>
                    </div>
                  </div>

                  <div className="flex items-center gap-6">
                    <div className="text-sm text-gray-400 uppercase">Workload</div>
                    <div className="w-48">
                      <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                        <div className={`h-2 rounded-full ${pct > 80 ? 'bg-red-400' : pct > 60 ? 'bg-green-500' : 'bg-green-300'}`} style={{ width: `${pct}%` }} />
                      </div>
                    </div>
                    <div className="text-sm font-semibold text-[#0f2147]">{ins.load}/{ins.capacity}</div>
                    <div className="text-sm text-[#0f2147] font-semibold">Assign ▸</div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>
      {showAddModal && (
        <Portal>
          <div className="fixed inset-0 z-50 flex items-start justify-center bg-black bg-opacity-60 p-6 pt-20">
            <div className="bg-white rounded-2xl shadow-xl w-full max-w-md mx-auto p-6 sm:p-8 ring-1 ring-gray-100">
              <div className="flex items-start justify-between">
                <div>
                  <h2 className="text-2xl font-bold text-[#0f2147]">Add New Instructor</h2>
                  <p className="mt-2 text-sm text-gray-500">Register a new faculty member</p>
                </div>
                <button onClick={closeAdd} className="text-gray-400 text-xl leading-none">×</button>
              </div>

              <form onSubmit={submitAdd} className="mt-6 space-y-5">
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-2">Full Name</label>
                  <input required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="e.g. Dr. Maria Clara" className="w-full px-4 py-3 rounded-lg border border-gray-100 bg-slate-50 text-sm" />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-2">Email Address</label>
                  <input required type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} placeholder="e.g. maria@iae.edu" className="w-full px-4 py-3 rounded-lg border border-gray-100 bg-slate-50 text-sm" />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-2">Department</label>
                  <input value={form.dept} onChange={(e) => setForm({ ...form, dept: e.target.value })} placeholder="e.g. Computer Science" className="w-full px-4 py-3 rounded-lg border border-gray-100 bg-slate-50 text-sm" />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-2">Max Workload (Units)</label>
                  <input value={form.capacity} onChange={(e) => setForm({ ...form, capacity: e.target.value })} className="w-full px-4 py-3 rounded-lg border border-gray-100 bg-slate-50 text-sm" />
                </div>

                <div className="pt-2">
                  <button type="submit" className="w-full px-6 py-3 rounded-xl bg-[#0f2147] text-yellow-400 shadow-md">REGISTER INSTRUCTOR</button>
                </div>
              </form>
            </div>
          </div>
        </Portal>
      )}
    </div>
  )
}
