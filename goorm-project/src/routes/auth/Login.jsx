import { useState } from 'react'
import { useNavigate, Link } from 'react-router'

import { auth } from '@/api/auth'

export default function Login() {
  const navigate = useNavigate()

  const [form, setForm] = useState({ email: '', password: '' })
  const [showPw, setShowPw] = useState(false)

  const onChange = (e) => {
    const { name, value } = e.target
    setForm((p) => ({ ...p, [name]: value }))
  }

  const onSubmit = async (e) => {
    try {
      await auth.login({ email: form.email.trim(), password: form.password }, { auth: false })
      navigate('/mypage', { replace: true })
    } catch (err) {
      console.log(err)
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
                className="h-11 w-full rounded-xl border border-slate-200 px-3 pr-20 outline-none focus:border-slate-400 disabled:bg-slate-100"
              />
              <button
                type="button"
                onClick={() => setShowPw((s) => !s)}
                className="absolute right-2 top-1.5 h-8 rounded-lg border border-slate-200 bg-slate-100 px-3 text-sm hover:bg-slate-200 disabled:opacity-60"
              >
                {showPw ? '숨기기' : '표시'}
              </button>
            </div>
          </label>

          <button
            type="submit"
            className="h-11 rounded-xl bg-slate-900 font-semibold text-white hover:bg-slate-800 disabled:opacity-60"
          >
            로그인
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
