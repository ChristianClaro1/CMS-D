type Params = Record<string, any>

const BASE = (((import.meta as any).env?.VITE_API_URL) as string) || 'http://localhost:8000/api/v1'

async function request(method: string, path: string, body?: any, params?: Params) {
  const url = new URL(BASE + path)
  if (params) {
    Object.entries(params).forEach(([k, v]) => url.searchParams.set(k, String(v)))
  }

  const token = localStorage.getItem('auth_token')

  const res = await fetch(url.toString(), {
    method,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: body ? JSON.stringify(body) : undefined,
  })

  if (!res.ok) {
    const text = await res.text()
    let payload: any = text
    try { payload = JSON.parse(text) } catch {}
    const err = new Error(payload?.message || res.statusText || 'Request failed')
    ;(err as any).status = res.status
    ;(err as any).body = payload
    throw err
  }

  const contentType = res.headers.get('content-type') || ''
  if (contentType.includes('application/json')) return res.json()
  return res.text()
}

export const api = {
  get: (path: string, params?: Params) => request('GET', path, undefined, params),
  post: (path: string, body?: any) => request('POST', path, body),
  put: (path: string, body?: any) => request('PUT', path, body),
  patch: (path: string, body?: any) => request('PATCH', path, body),
  delete: (path: string) => request('DELETE', path),
}

export default api
