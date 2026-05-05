import NavTab from '@/components/NavTab'

const mockProposals: Array<{
  id: string
  code: string
  title: string
  proposer: string
  units: number
  status: string
  note: string
}> = []

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
            <NavTab to="/prerequisites" label="PREREQUISITE MANAGER" />
          </nav>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 pb-6">
        <div className="rounded-2xl bg-[#fef9ec] p-8">
          <div className="rounded-2xl border border-[#e1e7f2] bg-white px-8 py-10 shadow-[0_10px_24px_rgba(15,33,71,0.06)] sm:px-12 sm:py-12">
            <div className="flex flex-col gap-6">
              <div>
                <h2 className="text-[1.85rem] font-extrabold italic tracking-tight text-[#0f2147] sm:text-[2.15rem]">
                  PENDING PROPOSALS
                </h2>
                <p className="mt-3 text-[0.72rem] font-semibold uppercase tracking-[0.18em] text-[#6c7da2] sm:text-[0.76rem]">
                  REVIEW SUBMITTED PROPOSALS FOR ACCURACY AND ALIGNMENT WITH DEPARTMENT STANDARDS.
                </p>
              </div>

              {mockProposals.length === 0 ? (
                <div className="flex min-h-[300px] items-center justify-center rounded-xl bg-white px-6 py-10">
                  <p className="text-[1.05rem] font-medium text-[#8d9abc] sm:text-[1.1rem]">
                    No pending proposals for review.
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {mockProposals.map((p) => (
                    <div key={p.id} className="bg-white rounded-2xl shadow-sm p-5 border border-gray-100">
                      <div className="flex items-center justify-between gap-4">
                        <div className="flex items-center gap-4 min-w-0">
                          <div className="w-12 h-12 bg-[#f4f6fb] rounded-md flex items-center justify-center text-sm font-bold text-[#0f2147]">
                            {p.code.slice(0, 2)}
                          </div>
                          <div className="min-w-0">
                            <div className="flex items-center gap-3 flex-wrap">
                              <div className="text-lg font-bold text-[#0f2147]">{p.title}</div>
                              <span className="inline-flex items-center rounded-full bg-emerald-50 px-2.5 py-1 text-[0.65rem] font-bold uppercase tracking-[0.15em] text-emerald-600">
                                {p.status}
                              </span>
                            </div>
                            <div className="text-sm text-gray-500 mt-1">
                              {p.code} • {p.units} Units • Proposed by {p.proposer}
                            </div>
                            <div className="mt-2 text-sm text-gray-400 italic">"{p.note}"</div>
                          </div>
                        </div>

                        <div className="flex gap-3 shrink-0">
                          <button className="px-4 py-2 rounded-md bg-green-400 text-white font-semibold">APPROVE</button>
                          <button className="px-4 py-2 rounded-md bg-red-100 text-red-600 font-semibold">REJECT</button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}

export default ProposalOversight
