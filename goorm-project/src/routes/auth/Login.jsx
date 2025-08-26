import { useEffect, useMemo, useState } from 'react'
import { useNavigate, useLocation, Link } from 'react-router'

import { auth } from '@/api/auth'
import { token } from '@/api/token'

export default function Login() {
  const navigate = useNavigate()
  const location = useLocation()

  // 이미 로그인 상태면 리다이렉트
  const alreadyLoggedIn = useMemo(() => Boolean(token.get()), [])
  if (alreadyLoggedIn) {
    navigate('/mypage', { replace: true })
  }

  const [form, setForm] = useState({ email: 'test@example.com', password: '' })
  const [showPw, setShowPw] = useState(false)
  const [loading, setLoading] = useState(false)
  const [clientError, setClientError] = useState('')
  const [serverError, setServerError] = useState('')

  useEffect(() => {
    console.log('token.get()', token.get())
  }, [])

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
      await auth.login({ email: form.email.trim(), password: form.password }, { auth: false })
      const from = location.state?.from ?? '/mypage'
      navigate(from, { replace: true })
    } catch (err) {
      setServerError(err?.data?.message || err?.message || '로그인에 실패했습니다.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="grid place-items-center bg-slate-50 p-4">
      <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl">
        <h1 className="mb-4 text-2xl font-bold">로그인</h1>

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
            비밀번호
            <div className="relative">
              <input
                name="password"
                type={showPw ? 'text' : 'password'}
                value={form.password}
                onChange={onChange}
                placeholder="••••••••"
                autoComplete="current-password"
                disabled={loading}
                className="h-11 w-full rounded-xl border border-slate-200 px-3 pr-20 outline-none focus:border-slate-400 disabled:bg-slate-100"
              />
              <button
                type="button"
                onClick={() => setShowPw((s) => !s)}
                disabled={loading}
                className="absolute right-2 top-1.5 h-8 rounded-lg border border-slate-200 bg-slate-100 px-3 text-sm hover:bg-slate-200 disabled:opacity-60"
              >
                {showPw ? '숨기기' : '표시'}
              </button>
            </div>
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
            {loading ? '로그인 중...' : '로그인'}
          </button>
        </form>

        <div className="mt-3 text-center text-sm">
          <span>계정이 없나요? </span>
          <Link to="/register" className="text-slate-900 underline-offset-2 hover:underline">
            회원가입
          </Link>
        </div>
      </div>
    </div>
  )
}
