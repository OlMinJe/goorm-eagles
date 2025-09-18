import axios from 'axios'

import { token } from '@/api/token'

const BASE_API_URL = import.meta.env.VITE_API_URL ? import.meta.env.VITE_API_URL : '/api'

export const api = axios.create({
  baseURL: BASE_API_URL,
  timeout: 10000,
  headers: { 'Content-Type': 'application/json' },
})

api.interceptors.response.use(
  (response) => response,
  (error) => {
    // 로그인 시도 실패, 토큰 정보 삭제
    console.error(error)
    token.clear()
    window.location.href = '/login'
    return Promise.reject(error)
  }
)

api.interceptors.request.use((config) => {
  const t = token.get() || localStorage.getItem('accessToken') || ''

  if (config.auth !== false && t) {
    config.headers.Authorization = `Bearer ${t}`
  }

  return config
})
