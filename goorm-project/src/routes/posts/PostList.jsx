import { useQuery } from '@tanstack/react-query'
import { useState } from 'react'
import { Link, useSearchParams } from 'react-router'

import { postsApi } from '@/api/posts'

export default function PostsList() {
  const [params, setParams] = useSearchParams()
  const [qInput, setQInput] = useState(params.get('q') ?? '')
  const page = Number(params.get('page') ?? 1)
  const limit = Number(params.get('limit') ?? 10)
  const tag = params.get('tag') ?? undefined

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ['posts', { q: params.get('q') ?? '', tag, page, limit }],
    queryFn: () => postsApi.list({ q: params.get('q') ?? '', tag, page, limit }),
    keepPreviousData: true,
    staleTime: 30_000,
  })

  const submitSearch = (e) => {
    e.preventDefault()
    const next = new URLSearchParams(params)
    if (qInput) {
      next.set('q', qInput)
    } else {
      next.delete('q')
    }
    next.set('page', '1')
    setParams(next, { replace: true })
  }

  const toPage = (p) => {
    const next = new URLSearchParams(params)
    next.set('page', String(p))
    setParams(next, { replace: true })
  }

  return (
    <div className="mx-auto max-w-3xl p-4">
      <div className="mb-4 flex items-center justify-between">
        <h1 className="text-2xl font-bold">게시글 목록</h1>
        <Link
          to="/posts/new"
          className="rounded-lg bg-slate-900 px-4 py-2 text-white hover:bg-slate-800"
        >
          글쓰기
        </Link>
      </div>

      <form onSubmit={submitSearch} className="mb-4 flex gap-2">
        <input
          value={qInput}
          onChange={(e) => setQInput(e.target.value)}
          placeholder="검색어를 입력하세요"
          className="h-11 flex-1 rounded-xl border border-slate-200 px-3 outline-none focus:border-slate-400"
        />
        <button className="h-11 rounded-xl border border-slate-200 px-4 hover:bg-slate-100">
          검색
        </button>
      </form>

      {isLoading && <p>불러오는 중…</p>}
      {isError && <p className="text-red-600">오류: {error?.message || '불러오기 실패'}</p>}

      {data?.items?.length ? (
        <ul className="space-y-3">
          {[
            ...new Set(
              data.items.map((p) => (
                <li key={p._id} className="rounded-xl border border-slate-200 p-4">
                  <Link to={`/posts/${p._id}`} className="text-lg font-semibold hover:underline">
                    {p.title}
                  </Link>
                  <div className="mt-1 text-sm text-slate-600 line-clamp-2">{p.body}</div>
                  {!!p.tags?.length && (
                    <div className="mt-2 flex flex-wrap gap-2 text-xs">
                      {(p.tags ?? []).map((t, i) => (
                        <button
                          key={`${t}-${i}`}
                          onClick={() => {
                            const next = new URLSearchParams(params)
                            next.set('tag', t)
                            next.set('page', '1')
                            setParams(next, { replace: true })
                          }}
                          className="rounded-full border border-slate-200 px-2 py-1 hover:bg-slate-50"
                        >
                          #{t}
                        </button>
                      ))}
                    </div>
                  )}
                </li>
              ))
            ),
          ]}
        </ul>
      ) : (
        !isLoading && <p>게시글이 없습니다.</p>
      )}

      {data?.totalPages > 1 && (
        <div className="mt-4 flex items-center justify-center gap-2">
          <button
            disabled={page <= 1}
            onClick={() => toPage(page - 1)}
            className="rounded-lg border px-3 py-1 disabled:opacity-60"
          >
            이전
          </button>
          <span className="text-sm text-slate-600">
            {page} / {data.totalPages} (총 {data.total}개)
          </span>
          <button
            disabled={page >= data.totalPages}
            onClick={() => toPage(page + 1)}
            className="rounded-lg border px-3 py-1 disabled:opacity-60"
          >
            다음
          </button>
        </div>
      )}
    </div>
  )
}
