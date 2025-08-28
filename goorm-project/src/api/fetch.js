import { token } from '@/api/token'

export async function fetchApi(url, { method = 'GET', body, auth = true } = {}) {
  const headers = { 'Content-Type': 'application/json' }
  if (auth && token.get()) {
    headers.Authorization = `Bearer ${token.get()}`
  }
  const res = await fetch(url, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  })
  const data = await res.json().catch(() => ({}))
  if (!res.ok) {
    const err = new Error(data?.error?.message || data?.message || 'Request failed')
    err.data = data
    err.status = res.status
    throw err
  }
  return data
}
