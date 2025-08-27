import { useEffect, useState } from 'react'

import { api } from '@/api/http'
import { token } from '@/api/token'

export default function Mypage() {
  const [hasToken, setHasToken] = useState(Boolean(token.get()))

  // 상태
  const [profile, setProfile] = useState({ name: '', email: '' })

  // 내 정보 조회
  useEffect(() => {
    async function fetchMe() {
      if (!hasToken) {
        return
      }
      try {
        const me = await api.get('/me')

        setProfile({
          name: me.data.name || '',
          email: me.data.email || '',
        })
      } catch (err) {
        console.error(err)
      }
    }
    fetchMe()
  }, [hasToken])

  return (
    <div className="bg-slate-50 p-4">
      <div className="mx-auto w-full max-w-3xl space-y-6">
        <header className="flex items-center justify-between">
          <h1 className="text-2xl font-bold">마이페이지</h1>
        </header>

        {/* 내 정보 */}
        <section className="rounded-2xl bg-white p-6 shadow-sm">
          <h2 className="mb-4 text-lg font-semibold">내 정보</h2>

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
              e-mail
              <input
                value={profile.email}
                onChange={(e) => setProfile((p) => ({ ...p, name: e.target.value }))}
                className="h-11 w-full rounded-xl border border-slate-200 px-3 outline-none focus:border-slate-400"
              />
            </label>
          </div>
        </section>
      </div>
    </div>
  )
}
