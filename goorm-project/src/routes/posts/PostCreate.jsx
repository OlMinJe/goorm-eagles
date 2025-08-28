import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useNavigate } from 'react-router'

import PostForm from './PostForm'

import { postsApi } from '@/api/posts'

export default function PostCreate() {
  const navigate = useNavigate()
  const qc = useQueryClient()

  const createM = useMutation({
    mutationKey: ['post-create'],
    mutationFn: (payload) => postsApi.create(payload),
    onSuccess: async (res) => {
      await qc.invalidateQueries({ queryKey: ['posts'] })
      navigate(`/posts/${res.post._id}`, { replace: true })
    },
  })

  return (
    <div className="mx-auto max-w-3xl p-4">
      <div className="mb-4 flex items-center justify-between">
        <h1 className="text-2xl font-bold">글쓰기</h1>
      </div>
      <PostForm loading={createM.isPending} onSubmit={(payload) => createM.mutate(payload)} />
      {createM.isError && (
        <p className="mt-3 rounded-lg border border-red-200 bg-red-50 p-2 text-sm text-red-700">
          {createM.error?.data?.message || createM.error?.message || '작성 실패'}
        </p>
      )}
    </div>
  )
}
