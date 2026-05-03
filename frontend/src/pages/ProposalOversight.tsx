// React import not required with the new JSX transform
import NavTab from '@/components/NavTab'

const mockProposals = [
  { id: 'P-001', code: 'GFDD:VVSD', proposer: 'rfw7J3IzFTO9b1HuqXLsMbdHp52', units: 3, note: 'dfdv' },
]

export function ProposalOversight() {
  return (
    <div className="space-y-6">
      <header className="pb-6">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-3xl font-extrabold italic text-[#0f2147] tracking-tight">ACADEMIC PROGRAMS</h1>
          <p className="mt-2 text-sm text-[#0f2147]">ACADEMIC PROGRAM & CURRICULUM DEVELOPMENT PORTAL</p>

          <nav className="mt-6 flex gap-8 text-sm font-semibold">
            <NavTab to="/courses/oversight" label="PROPOSAL OVERSIGHT" />
            <NavTab to="/courses" label="ACADEMIC CATALOG" />
          </nav>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4">
        <div className="mx-auto bg-white rounded-3xl shadow-md border border-gray-100 p-8 sm:p-12">
          <h2 className="text-2xl font-extrabold text-[#0f2147] uppercase tracking-wide">PENDING PROPOSALS</h2>
          <p className="mt-2 text-sm text-[#6b7280] uppercase tracking-wide">REVIEW SUBMITTED PROPOSALS FOR ACCURACY AND ALIGNMENT WITH DEPARTMENT STANDARDS</p>

          <div className="mt-8 space-y-4">
            {mockProposals.map((p) => (
              <div key={p.id} className="bg-slate-50 border border-gray-100 rounded-xl p-4 flex items-center justify-between">
                <div>
                  <div className="text-lg font-bold text-[#0f2147]">{p.code}</div>
                  <div className="text-xs text-gray-500 mt-1">PROPOSED BY: {p.proposer} • {p.units} UNITS</div>
                  <div className="mt-2 text-sm text-gray-400 italic">"{p.note}"</div>
                </div>

                <div className="flex gap-3">
                  <button className="px-4 py-2 rounded-md bg-green-400 text-white font-semibold">APPROVE</button>
                  <button className="px-4 py-2 rounded-md bg-red-100 text-red-600 font-semibold">REJECT</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  )
}

export default ProposalOversight
