 
function fmtDate(d: Date) {
  return d.toLocaleString(undefined, { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })
}

const mockLogs = [
  { id: 'a1', user: 'rfrw7J3lzFTO9bIH...', action: 'SECTION_CREATED', resource: 'EVENT', resourceId: 'vYi7n4qE...', ts: new Date() },
  { id: 'a2', user: 'rfrw7J3lzFTO9bIH...', action: 'COURSE_CREATED', resource: 'EVENT', resourceId: 'cA0Rq6n...', ts: new Date(Date.now() - 60000) },
  { id: 'a3', user: 'rfrw7J3lzFTO9bIH...', action: 'COURSE_STATUS_CHANGED', resource: 'EVENT', resourceId: 'vFtESrD6...', ts: new Date(Date.now() - 3600000) },
]

export function Reports() {
  return (
    <div className="space-y-6">
      <header className="pb-6">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-4xl font-extrabold italic text-[#0f2147] tracking-tight">Security Audit Log</h1>
          <p className="mt-2 text-sm text-[#0f2147]">Historical record of all system changes and administrative events</p>
        </div>
      </header>

      <div className="max-w-7xl mx-auto bg-[#fef9ec] rounded-2xl p-6">
        <div className="bg-white rounded-2xl shadow p-6">
          <div className="overflow-hidden">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase">User</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase">Action</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase">Resource</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase">Timestamp</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-100 rounded-lg">
                {mockLogs.map((l) => (
                  <tr key={l.id} className="hover:bg-gray-50">
                    <td className="px-6 py-5 align-top">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-gray-500">👤</div>
                        <div>
                          <div className="text-sm font-medium text-[#0f2147]">{l.user}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-5 align-top">
                      <span className="inline-block px-3 py-1 text-xs font-semibold bg-white border border-[#e6eef6] rounded">{l.action}</span>
                    </td>
                    <td className="px-6 py-5 align-top">
                      <div className="text-sm font-semibold text-[#0f2147]">{l.resource}</div>
                      <div className="text-xs text-gray-400">ID: {l.resourceId}</div>
                    </td>
                    <td className="px-6 py-5 align-top text-sm text-gray-400">
                      <div className="flex items-center gap-2">
                        <svg className="w-4 h-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3M3 11h18M5 21h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v11a2 2 0 002 2z"/></svg>
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
