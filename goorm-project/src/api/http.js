import axios from 'axios'

const BASE_API_URL = import.meta.env.DEV ? '/api' : import.meta.env.VITE_API_URL

export const instance = axios.create({
  baseURL: BASE_API_URL,
  timeout: 1000,
  headers: { 'X-Custom-Header': 'foobar' },
})
