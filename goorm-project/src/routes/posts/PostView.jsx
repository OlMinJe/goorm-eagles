import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { Link, useNavigate, useParams } from 'react-router'

import { postsApi } from '@/api/posts'
import { token } from '@/api/token'

export default function PostView() {
  const { id } = useParams()
  const navigate = useNavigate()
  const qc = useQueryClient()

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ['post', id],
    queryFn: () => postsApi.get(id),
    select: (d) => d.post,
  })

  const deleteM = useMutation({
    mutationKey: ['post-delete', id],
    mutationFn: () => postsApi.remove(id),
    onSuccess: async () => {
      await qc.invalidateQueries({ queryKey: ['posts'] })
      navigate('/posts', { replace: true })
    },
  })

  if (isLoading) {
    return <div className="p-4">불러오는 중…</div>
  }
  if (isError) {
    return <div className="p-4 text-red-600">오류: {error?.message || '불러오기 실패'}</div>
  }
  if (!data) {
    return <div className="p-4">Not Found</div>
  }

  const canEdit = Boolean(token.get()) // 실제로는 소유자 여부를 서버에서 판단; 버튼은 UI 편의상 노출

  return (
    <div className="mx-auto max-w-3xl p-4">
      <div className="mb-3 flex items-center justify-between">
        <h1 className="text-2xl font-bold">{data.title}</h1>
        <div className="flex gap-2">
          <Link to="/posts" className="rounded-lg border px-3 py-1 hover:bg-slate-50">
            목록
          </Link>
          {canEdit && (
            <>
              <Link
                to={`/posts/${data._id}/edit`}
                className="rounded-lg border px-3 py-1 hover:bg-slate-50"
              >
                수정
              </Link>
              <button
                onClick={() => {
                  if (confirm('정말 삭제하시겠습니까?')) {
                    deleteM.mutate()
                  }
                }}
                disabled={deleteM.isPending}
                className="rounded-lg border px-3 py-1 text-red-600 hover:bg-red-50 disabled:opacity-60"
              >
                {deleteM.isPending ? '삭제 중…' : '삭제'}
              </button>
            </>
          )}
        </div>
      </div>

      {!!data.tags?.length && (
        <div className="mb-3 flex flex-wrap gap-2 text-xs">
          {data.tags.map((t) => (
            <span key={t} className="rounded-full border border-slate-200 px-2 py-1">
              #{t}
            </span>
          ))}
        </div>
      )}

      <article className="whitespace-pre-wrap rounded-xl border border-slate-200 p-4">
        {data.body || <span className="text-slate-400">내용 없음</span>}
      </article>
    </div>
  )
}
