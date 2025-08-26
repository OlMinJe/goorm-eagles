import { useState } from 'react'
import { useNavigate, Link } from 'react-router'

import { auth } from '@/api/auth'

export default function Register() {
  const navigate = useNavigate()
  const [form, setForm] = useState({
    email: 'test@example.com',
    name: 'Sion',
    password: '',
    confirm: '',
  })
  const [loading, setLoading] = useState(false)
  const [clientError, setClientError] = useState('')
  const [serverError, setServerError] = useState('')

  const onChange = (e) => {
    const { name, value } = e.target
    setForm((p) => ({ ...p, [name]: value }))
    setClientError('')
    setServerError('')
  }

  const validate = () => {
    if (!form.email.trim()) {
      return '이메일을 입력해 주세요.'
    }
    if (!/\S+@\S+\.\S+/.test(form.email)) {
      return '올바른 이메일 형식이 아닙니다.'
    }
    if (!form.password) {
      return '비밀번호를 입력해 주세요.'
    }
    if (form.password.length < 6) {
      return '비밀번호는 6자 이상이어야 합니다.'
    }
    if (form.password !== form.confirm) {
      return '비밀번호가 일치하지 않습니다.'
    }
    return ''
  }

  const onSubmit = async (e) => {
    e.preventDefault()
    const msg = validate()
    if (msg) {
      return setClientError(msg)
    }

    setLoading(true)
    setServerError('')
    try {
      await auth.register(
        { email: form.email.trim(), name: form.name.trim(), password: form.password },
        { auth: false }
      )
      navigate('/login', { replace: true })
    } catch (err) {
      setServerError(err?.data?.message || err?.message || '가입에 실패했습니다.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="grid place-items-center bg-slate-50 p-4">
      <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl">
        <h1 className="mb-4 text-2xl font-bold">회원가입</h1>

        <form onSubmit={onSubmit} className="grid gap-3" noValidate>
          <label className="grid gap-2 text-sm">
            이메일
            <input
              name="email"
              type="email"
              value={form.email}
              onChange={onChange}
              placeholder="you@example.com"
              autoComplete="email"
              disabled={loading}
              className="h-11 w-full rounded-xl border border-slate-200 px-3 outline-none focus:border-slate-400 disabled:bg-slate-100"
            />
          </label>

          <label className="grid gap-2 text-sm">
            이름
            <input
              name="name"
              value={form.name}
              onChange={onChange}
              placeholder="Your name"
              disabled={loading}
              className="h-11 w-full rounded-xl border border-slate-200 px-3 outline-none focus:border-slate-400 disabled:bg-slate-100"
            />
          </label>

          <label className="grid gap-2 text-sm">
            비밀번호
            <input
              name="password"
              type="password"
              value={form.password}
              onChange={onChange}
              placeholder="••••••••"
              autoComplete="new-password"
              disabled={loading}
              className="h-11 w-full rounded-xl border border-slate-200 px-3 outline-none focus:border-slate-400 disabled:bg-slate-100"
            />
          </label>

          <label className="grid gap-2 text-sm">
            비밀번호 확인
            <input
              name="confirm"
              type="password"
              value={form.confirm}
              onChange={onChange}
              placeholder="••••••••"
              autoComplete="new-password"
              disabled={loading}
              className="h-11 w-full rounded-xl border border-slate-200 px-3 outline-none focus:border-slate-400 disabled:bg-slate-100"
            />
          </label>

          {(clientError || serverError) && (
            <p className="rounded-lg border border-red-200 bg-red-50 p-2 text-sm text-red-700">
              {clientError || serverError}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="h-11 rounded-xl bg-slate-900 font-semibold text-white hover:bg-slate-800 disabled:opacity-60"
          >
            {loading ? '가입 중...' : '회원가입'}
          </button>
        </form>

        <div className="mt-3 text-center text-sm">
          <span>이미 계정이 있나요? </span>
          <Link to="/login" className="text-slate-900 underline-offset-2 hover:underline">
            로그인
          </Link>
        </div>
      </div>
    </div>
  )
}
