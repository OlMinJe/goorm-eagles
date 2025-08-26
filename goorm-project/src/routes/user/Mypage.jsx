import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router'

import { auth } from '@/api/auth'
import { api } from '@/api/http'
import { token } from '@/api/token'

export default function Mypage() {
  const navigate = useNavigate()

  // 로그인 가드: 토큰 없으면 /login
  const hasToken = useMemo(() => Boolean(token.get()), [])
  useEffect(() => {
    console.log('hasToken', hasToken)
    console.log('hasToken', token.get())
    if (!hasToken) {
      //   navigate('/login', { replace: true })
    }
  }, [hasToken, navigate])

  // 상태
  const [loadingMe, setLoadingMe] = useState(true)
  const [meError, setMeError] = useState('')
  const [profile, setProfile] = useState({ name: '', bio: '', avatarUrl: '' })

  // 비밀번호 변경
  const [pw, setPw] = useState({ currentPassword: '', newPassword: '' })
  const [savingProfile, setSavingProfile] = useState(false)
  const [changingPw, setChangingPw] = useState(false)
  const [patchError, setPatchError] = useState('')
  const [pwError, setPwError] = useState('')

  // 내 정보 조회
  useEffect(() => {
    let alive = true
    async function fetchMe() {
      if (!hasToken) {
        return
      }
      setLoadingMe(true)
      setMeError('')
      try {
        const me = await api.get('/me')

        console.log('me', me)
        if (!alive) {
          return
        }
        setProfile({
          name: me.name || '',
          bio: me.bio || '',
          avatarUrl: me.avatarUrl || '',
        })
      } catch (err) {
        if (!alive) {
          return
        }
        setMeError(err?.data?.message || err?.message || '정보를 불러오지 못했습니다.')
      } finally {
        if (alive) {
          setLoadingMe(false)
        }
      }
    }
    fetchMe()
    return () => {
      alive = false
    }
  }, [hasToken])

  // 프로필 저장
  const handleSaveProfile = async () => {
    setSavingProfile(true)
    setPatchError('')
    try {
      await api.patch('/me', profile)
      // 성공 후 재조회(선택): 여기선 로컬 상태가 최신이라 생략 가능
    } catch (err) {
      setPatchError(err?.data?.message || err?.message || '프로필 저장 실패')
    } finally {
      setSavingProfile(false)
    }
  }

  // 비밀번호 변경
  const handleChangePw = async () => {
    if (!pw.currentPassword || !pw.newPassword) {
      return
    }
    setChangingPw(true)
    setPwError('')
    try {
      await api.patch('/me/password', pw)
      setPw({ currentPassword: '', newPassword: '' })
    } catch (err) {
      setPwError(err?.data?.message || err?.message || '비밀번호 변경 실패')
    } finally {
      setChangingPw(false)
    }
  }

  // 로그아웃
  const handleLogout = async () => {
    try {
      await auth.logout()
    } finally {
      navigate('/login', { replace: true })
    }
  }

  return (
    <div className="min-h-dvh bg-slate-50 p-4">
      <div className="mx-auto w-full max-w-3xl space-y-6">
        <header className="flex items-center justify-between">
          <h1 className="text-2xl font-bold">마이페이지</h1>
          <button
            onClick={handleLogout}
            className="rounded-xl bg-slate-900 px-4 py-2 font-semibold text-white hover:bg-slate-800"
          >
            로그아웃
          </button>
        </header>

        {/* 내 정보 */}
        <section className="rounded-2xl bg-white p-6 shadow-sm">
          <h2 className="mb-4 text-lg font-semibold">내 정보</h2>

          {loadingMe ? (
            <p>불러오는 중...</p>
          ) : meError ? (
            <p className="rounded-lg border border-red-200 bg-red-50 p-2 text-sm text-red-700">
              {meError}
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

              {patchError && (
                <p className="mb-2 rounded-lg border border-red-200 bg-red-50 p-2 text-sm text-red-700">
                  {patchError}
                </p>
              )}

              <div className="flex gap-2">
                <button
                  onClick={handleSaveProfile}
                  disabled={savingProfile}
                  className="h-11 rounded-xl bg-slate-900 px-4 font-semibold text-white hover:bg-slate-800 disabled:opacity-60"
                >
                  {savingProfile ? '저장 중...' : '프로필 저장'}
                </button>
                <button
                  onClick={() => window.location.reload()}
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

          {pwError && (
            <p className="mb-2 rounded-lg border border-red-200 bg-red-50 p-2 text-sm text-red-700">
              {pwError}
            </p>
          )}

          <button
            onClick={handleChangePw}
            disabled={changingPw || !pw.currentPassword || !pw.newPassword}
            className="h-11 rounded-xl bg-slate-900 px-4 font-semibold text-white hover:bg-slate-800 disabled:opacity-60"
          >
            {changingPw ? '변경 중...' : '비밀번호 변경'}
          </button>
        </section>
      </div>
    </div>
  )
}
