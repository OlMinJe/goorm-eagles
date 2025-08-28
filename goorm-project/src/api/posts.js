import { fetchApi } from '@/api/fetch'

const BASE_URL = import.meta.env.VITE_API_URL
  ? `${import.meta.env.VITE_API_URL}/posts`
  : '/api/posts'

export const postsApi = {
  list: ({ q, tag, page = 1, limit = 10 } = {}) => {
    const params = new URLSearchParams()
    if (q) {
      params.set('q', q)
    }
    if (tag) {
      params.set('tag', tag)
    }
    params.set('page', page)
    params.set('limit', limit)
    return fetchApi(`${BASE_URL}?${params.toString()}`, { auth: false })
  },
  get: (id) => fetchApi(`${BASE_URL}/${id}`, { auth: false }),
  create: (payload) => fetchApi(BASE_URL, { method: 'POST', body: payload, auth: true }),
  update: (id, payload) =>
    fetchApi(`${BASE_URL}/${id}`, { method: 'PATCH', body: payload, auth: true }),
  remove: (id) => fetchApi(`${BASE_URL}/${id}`, { method: 'DELETE', auth: true }),
}
