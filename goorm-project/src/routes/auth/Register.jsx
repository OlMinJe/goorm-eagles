import { useState } from 'react'
import { Link, useNavigate } from 'react-router'
import z from 'zod'

import { auth } from '@/api/auth'

const RegisterSchema = z.object({
  email: z.string().trim().toLowerCase().email('올바른 이메일 형식이 아니에요.'),
  name: z
    .string()
    .trim()
    .min(2, '이름은 2자 이상 입력해주세요.')
    .max(30, '이름은 30자 이하여야 해요.'),
  password: z
    .string()
    .min(8, '비밀번호는 8자 이상이어야 해요.')
    .regex(/[A-Za-z]/, '영문자를 포함해주세요.')
    .regex(/\d/, '숫자를 포함해주세요.'),
})

export default function Register() {
  const navigate = useNavigate()
  const [form, setForm] = useState({
    email: 'test@example.com',
    name: 'minje',
    password: '',
  })

  const [errors, setErrors] = useState({}) // { email?,  name?, password?, _form? }
  const [pending, setPending] = useState(false)

  const onChange = (e) => {
    const { name, value } = e.target
    setForm((p) => ({ ...p, [name]: value }))
    setErrors((err) => ({ ...err, [name]: undefined, _form: undefined }))
  }

  const onSubmit = async () => {
    setErrors({})

    // zod 검증
    const parsed = RegisterSchema.safeParse(form)
    if (!parsed.success) {
      const fieldErrors = parsed.error.flatten().fieldErrors
      setErrors({
        email: fieldErrors.email?.[0],
        name: fieldErrors.name?.[0],
        password: fieldErrors.password?.[0],
      })
      return
    }

    // 서버 호출
    try {
      setPending(true)
      await auth.register({ email: form.email, name: form.name, password: form.password })
      navigate('/login', { replace: true })
    } catch (err) {
      console.error(err)
      setErrors({ _form: err?.message || '회원가입에 실패했어요. 잠시 후 다시 시도해주세요' })
    } finally {
      setPending(false)
    }
  }

  return (
    <div className="grid place-items-center bg-slate-50 p-4">
      <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl">
        <h1 className="mb-4 text-2xl font-bold">회원가입</h1>

        <div className="grid gap-3">
          {errors._form && (
            <div className="rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
              {errors._form}
            </div>
          )}
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
              aria-invalid={!!errors.email}
              aria-describedby={errors.email ? 'email-error' : undefined}
              disabled={pending}
            />
            {errors.email && (
              <p id="email-error" className="text-xs text-red-600">
                {errors.email}
              </p>
            )}
          </label>

          <label className="grid gap-2 text-sm">
            이름
            <input
              name="name"
              value={form.name}
              onChange={onChange}
              placeholder="Your name"
              className="h-11 w-full rounded-xl border border-slate-200 px-3 outline-none focus:border-slate-400 disabled:bg-slate-100"
              aria-invalid={!!errors.name}
              aria-describedby={errors.name ? 'name-error' : undefined}
              disabled={pending}
            />
            {errors.name && (
              <p id="name-error" className="text-xs text-red-600">
                {errors.name}
              </p>
            )}
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
              aria-invalid={!!errors.password}
              aria-describedby={errors.password ? 'pwd-error' : undefined}
              disabled={pending}
            />
            {errors.password && (
              <p id="pwd-error" className="text-xs text-red-600">
                {errors.password}
              </p>
            )}
          </label>

          <button
            type="button"
            onClick={onSubmit}
            disabled={pending}
            className="h-11 rounded-xl bg-slate-900 font-semibold text-white hover:bg-slate-800 disabled:opacity-60"
          >
            {pending ? '가입 처리 중…' : '회원가입'}
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
