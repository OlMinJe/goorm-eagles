import { api } from '@/api/http'
import { token } from '@/api/token'

export const auth = {
  // 받아올 거 없어서 비동기 처리 x
  register: (payload) => {
    const response = api.post('/auth/register', payload, { auth: false })
    return response
  },
  login: async (payload) => {
    const response = await api.post('/auth/login', payload, { auth: false })
    token.set(response.data.token)
    return response
  },
  logout: async () => {
    try {
      await api.post('/auth/logout', {}, { auth: true })
    } finally {
      token.clear()
    }
  },
}
