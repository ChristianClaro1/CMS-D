type Params = Record<string, string | number | boolean | undefined | null>

const API_BASE_FALLBACK = import.meta.env.DEV ? "http://localhost:8000" : undefined
const API_URL = import.meta.env.VITE_API_URL || API_BASE_FALLBACK

if (!API_URL) {
  throw new Error("VITE_API_URL is not defined");
}

const API_BASE = new URL("/api/v1/", API_URL);

export function getAuthToken() {
  return localStorage.getItem('auth_token')
}

function getAppRole() {
  return localStorage.getItem('user_role')
}

export function setAuthToken(token: string) {
  localStorage.setItem('auth_token', token)
}

export function clearAuthToken() {
  localStorage.removeItem('auth_token')
}

async function request(method: string, path: string, body?: any, params?: Params) {
  const normalizedPath = path.replace(/^\/+/, '')
  const url = new URL(normalizedPath, API_BASE)
  if (params) {
    Object.entries(params).forEach(([k, v]) => {
      if (v !== undefined && v !== null) {
        url.searchParams.set(k, String(v))
      }
    })
  }

  const token = getAuthToken()

  const res = await fetch(url.toString(), {
    method,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(getAppRole() ? { 'x-user-role': getAppRole() as string } : {}),
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
