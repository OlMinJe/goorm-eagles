// src/pages/Mypage.jsx
import { useEffect, useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useNavigate } from 'react-router'
import axios, { CanceledError } from 'axios'

import { api } from '@/api/http'
import { auth } from '@/api/auth'
import { token } from '@/api/token'

// 쿼리 키
const qk = { me: ['me'] }

// Axios 취소 여부 판정
const isCanceled = (e) =>
  e instanceof CanceledError || axios.isCancel?.(e) || e?.code === 'ERR_CANCELED'

// Axios/커스텀 에러 메시지 추출(취소는 무음 처리)
const pickMsg = (e) => {
  if (isCanceled(e)) return ''
  return (
    e?.response?.data?.message || e?.response?.data?.error || e?.data?.message || e?.message || ''
  )
}

export default function Mypage() {
  const navigate = useNavigate()
  const qc = useQueryClient()

  // --- 로그인 가드: 토큰 실시간 추적 ---
  const [hasToken, setHasToken] = useState(Boolean(token.get()))
  useEffect(() => {
    const unsub = token.subscribe((t) => setHasToken(Boolean(t)))
    return unsub
  }, [])

  useEffect(() => {
    if (!hasToken) navigate('/login', { replace: true })
  }, [hasToken, navigate])

  // --- /me: 내 정보 조회 ---
  const meQ = useQuery({
    queryKey: qk.me,
    queryFn: ({ signal }) => api.get('/me', { signal }),
    enabled: hasToken,
    staleTime: 30_000,
    refetchOnWindowFocus: false,
    retry: (failCount, err) => (isCanceled(err) ? false : failCount < 2),
    onError: (err) => {
      if (isCanceled(err)) return // 취소는 무시
      // 필요 시 로깅/토스트
      // console.error('[me] error', err)
    },
  })

  // --- 폼 상태: 최초 1회만 주입 ---
  const [profile, setProfile] = useState({ name: '', bio: '', avatarUrl: '' })
  const [didInit, setDidInit] = useState(false)
  useEffect(() => {
    if (meQ.data && !didInit) {
      const { name = '', bio = '', avatarUrl = '' } = meQ.data
      setProfile({ name, bio, avatarUrl })
      setDidInit(true)
    }
  }, [meQ.data, didInit])

  // --- 프로필 수정 (낙관적 업데이트 + 성공 시 서버 응답으로 동기화) ---
  const patchMeM = useMutation({
    mutationFn: (payload) => api.patch('/me', payload),
    onMutate: async (payload) => {
      // 현재 in-flight 쿼리 취소(여기서 CanceledError 발생 가능 → UI에서 무시)
      await qc.cancelQueries({ queryKey: qk.me })
      const prev = qc.getQueryData(qk.me)
      // 낙관적 캐시
      qc.setQueryData(qk.me, (old) => ({ ...(old ?? {}), ...(payload ?? {}) }))
      return { prev }
    },
    onError: (err, _vars, ctx) => {
      if (ctx?.prev) qc.setQueryData(qk.me, ctx.prev) // 롤백
    },
    onSuccess: (data) => {
      // 서버가 돌려준 최신 상태로 캐시 정합성 확보
      if (data && typeof data === 'object') {
        qc.setQueryData(qk.me, (old) => ({ ...(old ?? {}), ...data }))
      }
    },
    // 꼭 강제 새요청이 필요할 때만 활성 쿼리 한정 무효화(취소 빈도 완화)
    // onSettled: () => qc.invalidateQueries({ queryKey: qk.me, refetchType: 'active' }),
  })

  // --- 비밀번호 변경 ---
  const [pw, setPw] = useState({ currentPassword: '', newPassword: '' })
  const changePwM = useMutation({
    mutationFn: (payload) => api.patch('/me/password', payload),
    onSuccess: () => setPw({ currentPassword: '', newPassword: '' }),
    retry: (failCount, err) => (isCanceled(err) ? false : failCount < 1),
  })

  // --- 로그아웃 ---
  const logoutM = useMutation({
    mutationFn: () => auth.logout(),
    onSuccess: () => {
      // 언마운트로 자연 취소 → UI 노이즈 최소화
      navigate('/login', { replace: true })
      qc.clear()
    },
  })

  // --- 에러 메시지(취소는 비움) ---
  const serverErrorMe = meQ.isError ? pickMsg(meQ.error) : ''
  const serverErrorPatch = patchMeM.isError ? pickMsg(patchMeM.error) : ''
  const serverErrorPw = changePwM.isError ? pickMsg(changePwM.error) : ''

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

        {/* 내 정보 */}
        <section className="rounded-2xl bg-white p-6 shadow-sm">
          <h2 className="mb-4 text-lg font-semibold">내 정보</h2>

          {meQ.isLoading ? (
            <p>불러오는 중...</p>
          ) : meQ.isError && serverErrorMe ? (
            <p className="rounded-lg border border-red-200 bg-red-50 p-2 text-sm text-red-700">
              {serverErrorMe || '정보를 불러오지 못했습니다.'}
            </p>
          ) : (
            <>
              <div className="mb-4 grid gap-3 sm:grid-cols-2">
                <label className="grid gap-2 text-sm">
                  이름
                  <input
                    value={profile.name}
                    onChange={(e) => setProfile((p) => ({ ...p, name: e.target.value }))}
                    className="h-11 w-full rounded-xl border border-slate-200 px-3 outline-none focus:border-slate-400"
                  />
                </label>
                <label className="grid gap-2 text-sm">
                  아바타 URL
                  <input
                    value={profile.avatarUrl}
                    onChange={(e) => setProfile((p) => ({ ...p, avatarUrl: e.target.value }))}
                    className="h-11 w-full rounded-xl border border-slate-200 px-3 outline-none focus:border-slate-400"
                  />
                </label>
                <label className="sm:col-span-2 grid gap-2 text-sm">
                  소개
                  <textarea
                    rows={4}
                    value={profile.bio}
                    onChange={(e) => setProfile((p) => ({ ...p, bio: e.target.value }))}
                    className="w-full rounded-xl border border-slate-200 p-3 outline-none focus:border-slate-400"
                  />
                </label>
              </div>

              {serverErrorPatch && (
                <p className="mb-2 rounded-lg border border-red-200 bg-red-50 p-2 text-sm text-red-700">
                  {serverErrorPatch}
                </p>
              )}

              <div className="flex gap-2">
                <button
                  onClick={() => patchMeM.mutate(profile)}
                  disabled={patchMeM.isPending}
                  className="h-11 rounded-xl bg-slate-900 px-4 font-semibold text-white hover:bg-slate-800 disabled:opacity-60"
                >
                  {patchMeM.isPending ? '저장 중...' : '프로필 저장'}
                </button>
                <button
                  onClick={() => meQ.refetch()}
                  className="h-11 rounded-xl border border-slate-300 bg-white px-4 hover:bg-slate-50"
                >
                  새로고침
                </button>
              </div>
            </>
          )}
        </section>

        {/* 비밀번호 변경 */}
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

          {serverErrorPw && (
            <p className="mb-2 rounded-lg border border-red-200 bg-red-50 p-2 text-sm text-red-700">
              {serverErrorPw}
            </p>
          )}

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
