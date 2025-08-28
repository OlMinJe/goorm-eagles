import axios from 'axios'

import { token } from './token'

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
    return Promise.reject(error)
  }
)

api.interceptors.request.use((config) => {
  // 인증되었고, 토큰이 있으면
  if (config.auth !== false && token.get()) {
    config.headers.Authorization = `Bearer ${token.get()}`
  }
  return config
})
