import { useState } from 'react'
import { useNavigate, Link } from 'react-router'

import { auth } from '@/api/auth'

export default function Register() {
  const navigate = useNavigate()
  const [form, setForm] = useState({
    email: 'test@example.com',
    name: 'Sion',
    password: '',
  })

  const onChange = (e) => {
    const { name, value } = e.target
    setForm((p) => ({ ...p, [name]: value }))
  }

  const onSubmit = async () => {
    try {
      await auth.register({ email: form.email, name: form.name, password: form.password })
      navigate('/login', { replace: true })
    } catch (err) {
      console.error(err)
    }
  }

  return (
    <div className="grid place-items-center bg-slate-50 p-4">
      <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl">
        <h1 className="mb-4 text-2xl font-bold">회원가입</h1>

        <div className="grid gap-3">
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
            이름
            <input
              name="name"
              value={form.name}
              onChange={onChange}
              placeholder="Your name"
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
              className="h-11 w-full rounded-xl border border-slate-200 px-3 outline-none focus:border-slate-400 disabled:bg-slate-100"
            />
          </label>

          <button
            type="button"
            onClick={onSubmit}
            className="h-11 rounded-xl bg-slate-900 font-semibold text-white hover:bg-slate-800 disabled:opacity-60"
          >
            회원가입
          </button>
        </div>

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
