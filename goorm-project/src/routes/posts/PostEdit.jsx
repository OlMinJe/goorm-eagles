import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useParams, useNavigate, Link } from 'react-router'

import PostForm from './PostForm'

import { postsApi } from '@/api/posts'

export default function PostEdit() {
  const { id } = useParams()
  const navigate = useNavigate()
  const qc = useQueryClient()

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ['post', id],
    queryFn: () => postsApi.get(id),
    select: (d) => d.post,
  })

  const updateM = useMutation({
    mutationKey: ['post-update', id],
    mutationFn: (payload) => postsApi.update(id, payload),
    onSuccess: async (res) => {
      await Promise.all([
        qc.invalidateQueries({ queryKey: ['posts'] }),
        qc.invalidateQueries({ queryKey: ['post', id] }),
      ])
      navigate(`/posts/${res.post._id}`, { replace: true })
    },
  })

  if (isLoading) {
    return <div className="p-4">불러오는 중…</div>
  }
  if (isError || !data) {
    return <div className="p-4 text-red-600">오류: {error?.message || '불러오기 실패'}</div>
  }

  return (
    <div className="mx-auto max-w-3xl p-4">
      <div className="mb-4 flex items-center justify-between">
        <h1 className="text-2xl font-bold">글 수정</h1>
        <Link to={`/posts/${id}`} className="rounded-lg border px-3 py-1 hover:bg-slate-50">
          보기
        </Link>
      </div>

      <PostForm
        key={data._id} // 다른 글로 이동 시 폼 리셋
        initial={data}
        loading={updateM.isPending}
        onSubmit={(payload) => updateM.mutate(payload)}
      />
      {updateM.isError && (
        <p className="mt-3 rounded-lg border border-red-200 bg-red-50 p-2 text-sm text-red-700">
          수정 실패
        </p>
      )}
    </div>
  )
}
