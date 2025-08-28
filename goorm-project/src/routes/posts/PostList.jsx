import { useQuery } from '@tanstack/react-query'
import { Link } from 'react-router'

import { postsApi } from '@/api/posts'

export default function PostsList() {
  const { data, isLoading, isError, error } = useQuery({
    queryKey: ['posts'],
    queryFn: () => postsApi.list(), // 서버 기본값(page=1, limit=10)
    staleTime: 30_000,
  })

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

      {isLoading && <p>불러오는 중…</p>}
      {isError && <p className="text-red-600">오류: {error?.message || '불러오기 실패'}</p>}

      {data?.items?.length ? (
        <ul className="space-y-3">
          {data.items.map((p) => (
            <li key={p._id} className="rounded-xl border border-slate-200 p-4">
              <Link to={`/posts/${p._id}`} className="text-lg font-semibold hover:underline">
                {p.title}
              </Link>
              <div className="mt-1 text-sm text-slate-600 line-clamp-2">{p.body}</div>

              {!!p.tags?.length && (
                <div className="mt-2 flex flex-wrap gap-2 text-xs">
                  {(p.tags ?? []).map((t, i) => (
                    <span
                      key={`${t}-${i}`}
                      className="rounded-full border border-slate-200 px-2 py-1"
                    >
                      #{t}
                    </span>
                  ))}
                </div>
              )}
            </li>
          ))}
        </ul>
      ) : (
        !isLoading && <p>게시글이 없습니다.</p>
      )}
    </div>
  )
}
