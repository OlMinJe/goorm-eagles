import { api } from '@/api/http'
import { token } from '@/api/token'

export const auth = {
  login: async (payload) => {
    const res = await api.post('/auth/login', payload, { auth: false })
    token.set(res.token) // access 토큰 저장(동일 동작)
    return res
  },
}
