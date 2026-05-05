import { Calendar } from 'lucide-react'

function fmtDate(d: Date) {
  return d.toLocaleString(undefined, { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })
}

const mockLogs = [
  { id: 'a1', user: 'atUZI1XhsjIb6yc62ye', action: 'COURSE_CREATED', resource: 'INTEGRATION_EVENT', resourceId: 'cAQORq6n...', ts: new Date() },
  { id: 'a2', user: 'atUZI1XhsjIb6yc62ye', action: 'COURSE_ARCHIVED', resource: 'INTEGRATION_EVENT', resourceId: 'cAQORq6n...', ts: new Date(Date.now() - 60000) },
  { id: 'a3', user: 'rfrw7J3IzFTO9b1Huc', action: 'INSTRUCTOR_ASSIGNED', resource: 'INTEGRATION_EVENT', resourceId: 'SYSTEM...', ts: new Date(Date.now() - 720000) },
  { id: 'a4', user: 'rfrw7J3IzFTO9b1Huc', action: 'INSTRUCTOR_ASSIGNED', resource: 'INTEGRATION_EVENT', resourceId: 'SYSTEM...', ts: new Date(Date.now() - 780000) },
  { id: 'a5', user: 'rfrw7J3IzFTO9b1Huc', action: 'COURSE_CREATED', resource: 'INTEGRATION_EVENT', resourceId: 'cAQORq6n...', ts: new Date(Date.now() - 1200000) },
  { id: 'a6', user: 'XSAuPWuusmUhAp', action: 'SECTION_CAPACITY_CHANGED', resource: 'INTEGRATION_EVENT', resourceId: 'vYi7n4qE...', ts: new Date(Date.now() - 1440000) },
  { id: 'a7', user: 'rfrw7J3IzFTO9b1Huc', action: 'SECTION_CREATED', resource: 'EVENT', resourceId: 'vYi7n4qE...', ts: new Date(Date.now() - 86400000) },
]

export function Reports() {
  return (
    <div className="space-y-6">
      <header className="pb-6">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-[2.1rem] font-extrabold italic uppercase tracking-tight text-[#0f2147] sm:text-[2.3rem]">
            SECURITY AUDIT LOG
          </h1>
          <p className="mt-2 text-[0.74rem] font-semibold uppercase tracking-[0.16em] text-[#6f7f9d]">
            HISTORICAL RECORD OF ALL SYSTEM CHANGES AND ADMINISTRATIVE EVENTS
          </p>
        </div>
      </header>

      <div className="mx-auto max-w-7xl rounded-[1.9rem] bg-[#fef9ec] p-4 sm:p-6 lg:p-8">
        <div className="rounded-[1.5rem] border border-[#dfe7f3] bg-white shadow-[0_10px_26px_rgba(15,33,71,0.06)] overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full border-collapse">
              <thead>
                <tr className="bg-[#f4f7fb]">
                  <th className="px-6 py-4 text-left text-[0.7rem] font-extrabold uppercase tracking-[0.18em] text-[#97a6c0]">
                    User
                  </th>
                  <th className="px-6 py-4 text-left text-[0.7rem] font-extrabold uppercase tracking-[0.18em] text-[#97a6c0]">
                    Action
                  </th>
                  <th className="px-6 py-4 text-left text-[0.7rem] font-extrabold uppercase tracking-[0.18em] text-[#97a6c0]">
                    Resource
                  </th>
                  <th className="px-6 py-4 text-right text-[0.7rem] font-extrabold uppercase tracking-[0.18em] text-[#97a6c0]">
                    Timestamp
                  </th>
                </tr>
              </thead>

              <tbody>
                {mockLogs.map((l) => (
                  <tr key={l.id} className="border-t border-[#edf1f7] transition-colors hover:bg-[#f9fbfe]">
                    <td className="px-6 py-5 align-middle">
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#f4f7fb] text-[#9fb0cb] ring-1 ring-[#e6ecf6]">
                          <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" d="M20 21a8 8 0 10-16 0" />
                            <path strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" d="M12 11a4 4 0 100-8 4 4 0 000 8z" />
                          </svg>
                        </div>
                        <div className="min-w-0 text-[0.95rem] font-bold text-[#1a2340]">
                          {l.user}
                        </div>
                      </div>
                    </td>

                    <td className="px-6 py-5 align-middle">
                      <span className="inline-flex rounded-md border border-[#cdd7eb] bg-[#f5f7fd] px-3 py-1 text-[0.72rem] font-extrabold uppercase tracking-[0.16em] text-[#0f2147] shadow-[0_2px_8px_rgba(15,33,71,0.04)]">
                        {l.action}
                      </span>
                    </td>

                    <td className="px-6 py-5 align-middle">
                      <div className="min-w-0">
                        <div className="text-[0.98rem] font-extrabold uppercase tracking-tight text-[#1a2340]">
                          {l.resource}
                        </div>
                        <div className="mt-1 text-[0.72rem] font-semibold uppercase tracking-[0.08em] text-[#a5afc3]">
                          ID: {l.resourceId}
                        </div>
                      </div>
                    </td>

                    <td className="px-6 py-5 align-middle text-right">
                      <div className="inline-flex items-center gap-2 text-[0.9rem] text-[#9aa8c0]">
                        <Calendar className="h-4 w-4 text-[#bcc6d8]" />
                        <span>{fmtDate(l.ts)}</span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Reports
