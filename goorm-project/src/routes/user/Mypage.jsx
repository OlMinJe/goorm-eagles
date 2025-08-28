import { useEffect, useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useNavigate } from 'react-router'

import { api } from '@/api/http'
import { auth } from '@/api/auth'
import { token } from '@/api/token'

export default function Mypage() {
  const navigate = useNavigate()
  const qc = useQueryClient()

  const [hasToken, setHasToken] = useState(Boolean(token.get()))
  const [profile, setProfile] = useState({ name: '', email: '', bio: '', avatarUrl: '' })
  const [didInit, setDidInit] = useState(false)
  const [pw, setPw] = useState({ currentPassword: '', newPassword: '' })

  useEffect(() => {
    const unsub = token.subscribe((t) => setHasToken(Boolean(t)))
    return unsub
  }, [])

  useEffect(() => {
    if (!hasToken) navigate('/login', { replace: true })
  }, [hasToken, navigate])

  const {
    refetch,
    isLoading,
    isError,
    data: respons,
  } = useQuery({
    queryKey: ['me'],
    queryFn: () => api.get('/me'),
    enabled: hasToken,
    onError: (err) => {
      if (err?.status === 401) {
        // 이미 hasToken=false로 떨어지면 위 useEffect가 /login으로 보냄
        // 여기서 추가 동작이 필요 없다면 빈 처리
        return
      }
      console.error('[me] error', err)
    },
  })

  useEffect(() => {
    console.log('data', respons)

    if (respons && !didInit) {
      const { name = '', email = '', bio = '', avatarUrl = '' } = respons.data
      setProfile({ name, email, bio, avatarUrl })
      setDidInit(true)
    }
  }, [respons, didInit])

  const patchMeM = useMutation({
    mutationFn: (payload) => api.patch('/me', payload),
    onMutate: async (payload) => {
      await qc.cancelQueries({ queryKey: ['me'] })
      const prev = qc.getQueryData(['me'])
      qc.setQueryData(['me'], (old) => ({ ...(old ?? {}), ...(payload ?? {}) }))
      return { prev }
    },
    onError: (err, _vars, ctx) => {
      if (ctx?.prev) qc.setQueryData(['me'], ctx.prev) // 롤백
    },
    onSuccess: (data) => {
      if (data && typeof data === 'object') {
        qc.setQueryData(['me'], (old) => ({ ...(old ?? {}), ...data }))
      }
    },
  })

  const changePwM = useMutation({
    mutationFn: (payload) => api.patch('/me/password', payload),
    onSuccess: () => setPw({ currentPassword: '', newPassword: '' }),
    retry: (failCount, err) => (isCanceled(err) ? false : failCount < 1),
  })

  const logoutM = useMutation({
    mutationFn: () => auth.logout(),
    onSuccess: () => {
      navigate('/login', { replace: true })
      qc.clear()
    },
  })

  return (
    <div className="min-h-dvh bg-slate-50 p-4">
      <div className="mx-auto w-full max-w-3xl space-y-6">
        <header className="flex items-center justify-between">
          <h1 className="text-2xl font-bold">마이페이지</h1>
          <button
            onClick={() => logoutM.mutate()}
            disabled={logoutM.isPending}
            className="rounded-xl bg-slate-900 px-4 py-2 font-semibold text-white hover:bg-slate-800 disabled:opacity-60"
          >
            로그아웃
          </button>
        </header>

        <section className="rounded-2xl bg-white p-6 shadow-sm">
          <h2 className="mb-4 text-lg font-semibold">내 정보</h2>

          {isLoading ? (
            <p>불러오는 중...</p>
          ) : isError && serverErrorMe ? (
            <p className="rounded-lg border border-red-200 bg-red-50 p-2 text-sm text-red-700">
              {serverErrorMe || '정보를 불러오지 못했습니다.'}
            </p>
          ) : (
            <>
              <div className="mb-4 grid gap-3 sm:grid-cols-2">
                <label className="grid gap-2 text-sm">
                  이름
                  <input
                    name="name"
                    value={profile.name}
                    onChange={(e) => setProfile((p) => ({ ...p, name: e.target.value }))}
                    className="h-11 w-full rounded-xl border border-slate-200 px-3 outline-none focus:border-slate-400"
                  />
                </label>
                <label className="grid gap-2 text-sm">
                  email
                  <input
                    name="email"
                    value={profile.email}
                    onChange={(e) => setProfile((p) => ({ ...p, name: e.target.value }))}
                    className="h-11 w-full rounded-xl border border-slate-200 px-3 outline-none focus:border-slate-400"
                  />
                </label>
                <label className="sm:col-span-2 grid gap-2 text-sm">
                  아바타 URL
                  <input
                    name="avatarUrl"
                    value={profile.avatarUrl}
                    onChange={(e) => setProfile((p) => ({ ...p, avatarUrl: e.target.value }))}
                    className="h-11 w-full rounded-xl border border-slate-200 px-3 outline-none focus:border-slate-400"
                  />
                </label>
                <label className="sm:col-span-2 grid gap-2 text-sm">
                  소개
                  <textarea
                    name="bio"
                    rows={4}
                    value={profile.bio}
                    onChange={(e) => setProfile((p) => ({ ...p, bio: e.target.value }))}
                    className="w-full rounded-xl border border-slate-200 p-3 outline-none focus:border-slate-400"
                  />
                </label>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => patchMeM.mutate(profile)}
                  disabled={patchMeM.isPending}
                  className="h-11 rounded-xl bg-slate-900 px-4 font-semibold text-white hover:bg-slate-800 disabled:opacity-60"
                >
                  {patchMeM.isPending ? '저장 중...' : '프로필 저장'}
                </button>
                <button
                  onClick={() => refetch()}
                  className="h-11 rounded-xl border border-slate-300 bg-white px-4 hover:bg-slate-50"
                >
                  새로고침
                </button>
              </div>
            </>
          )}
        </section>

        <section className="rounded-2xl bg-white p-6 shadow-sm">
          <h2 className="mb-4 text-lg font-semibold">비밀번호 변경</h2>

          <div className="mb-3 grid gap-3 sm:grid-cols-2">
            <label className="grid gap-2 text-sm">
              현재 비밀번호
              <input
                type="password"
                value={pw.currentPassword}
                onChange={(e) => setPw((p) => ({ ...p, currentPassword: e.target.value }))}
                className="h-11 w-full rounded-xl border border-slate-200 px-3 outline-none focus:border-slate-400"
              />
            </label>
            <label className="grid gap-2 text-sm">
              새 비밀번호
              <input
                type="password"
                value={pw.newPassword}
                onChange={(e) => setPw((p) => ({ ...p, newPassword: e.target.value }))}
                className="h-11 w-full rounded-xl border border-slate-200 px-3 outline-none focus:border-slate-400"
              />
            </label>
          </div>

          <button
            onClick={() => changePwM.mutate(pw)}
            disabled={changePwM.isPending || !pw.currentPassword || !pw.newPassword}
            className="h-11 rounded-xl bg-slate-900 px-4 font-semibold text-white hover:bg-slate-800 disabled:opacity-60"
          >
            {changePwM.isPending ? '변경 중...' : '비밀번호 변경'}
          </button>
        </section>
      </div>
    </div>
  )
}
