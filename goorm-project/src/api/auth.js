import { api } from '@/api/http'
import { token } from '@/api/token'

export const auth = {
  register: (payload) => api.post('/auth/register', payload, { auth: false }),
  login: async (payload) => {
    const res = await api.post('/auth/login', payload, { auth: false })
    console.log('res.data.token', res)
    token.set(res.data.token) // access 토큰 저장(동일 동작)
    return res
  },
  logout: async () => {
    try {
      await api.post('/auth/logout', {}, { auth: true })
    } finally {
      token.clear() // 서버 통신 결과와 무관하게 로컬 토큰은 즉시 제거해 보안/UX 일관성 확보
    }
  },
}
