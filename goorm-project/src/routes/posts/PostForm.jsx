import { useState, useEffect } from 'react'

export default function PostForm({
  initial = { title: '', body: '', tags: [] },
  loading = false,
  onSubmit,
  resetKey,
}) {
  const [form, setForm] = useState({ title: '', body: '', tags: [] })
  const [tagsInput, setTagsInput] = useState('')

  const [clientError, setClientError] = useState('')

  const key = resetKey ?? initial?._id ?? 'new'

  useEffect(() => {
    setForm({
      title: initial?.title ?? '',
      body: initial?.body ?? '',
      tags: Array.isArray(initial?.tags) ? initial.tags : [],
    })
    setTagsInput((initial?.tags || []).join(', ')) // 👈 초기 문자열

    setClientError('')
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key])

  // 입력 핸들러
  const handleChange = (e) => {
    const { name, value } = e.target
    setForm((p) => ({ ...p, [name]: value }))
    setClientError('')
  }

  const handleTagsChange = (e) => {
    setTagsInput(e.target.value)
    setClientError('')
  }

  // 검증
  const validate = () => {
    if (!form.title.trim()) {
      return '제목은 필수입니다.'
    }
    if (form.title.length > 200) {
      return '제목은 200자 이하여야 합니다.'
    }
    if (form.body.length > 10_000) {
      return '본문은 10,000자 이하여야 합니다.'
    }
    if (form.tags.length > 20) {
      return '태그는 최대 20개까지입니다.'
    }
    if (tagsInput.split(',').filter(Boolean).length > 20) {
      return '태그는 최대 20개까지입니다.'
    }
    return ''
  }

  // 전송
  const submit = (e) => {
    e.preventDefault()
    const msg = validate()
    if (msg) {
      return setClientError(msg)
    }

    const tags = [
      ...new Set(
        tagsInput
          .split(',')
          .map((s) => s.trim())
          .filter(Boolean)
      ),
    ]

    onSubmit?.({
      title: form.title.trim(),
      body: form.body,
      tags,
    })
  }

  return (
    <form onSubmit={submit} className="grid gap-3" noValidate>
      <label className="grid gap-2 text-sm">
        제목
        <input
          name="title"
          value={form.title}
          onChange={handleChange}
          disabled={loading}
          className="h-11 w-full rounded-xl border border-slate-200 px-3 outline-none focus:border-slate-400 disabled:bg-slate-100"
          placeholder="제목을 입력하세요"
        />
      </label>

      <label className="grid gap-2 text-sm">
        본문
        <textarea
          name="body"
          value={form.body}
          onChange={handleChange}
          disabled={loading}
          rows={10}
          className="w-full rounded-xl border border-slate-200 p-3 outline-none focus:border-slate-400 disabled:bg-slate-100"
          placeholder="내용을 작성하세요"
        />
      </label>

      <label className="grid gap-2 text-sm">
        태그 (쉼표로 구분)
        <input
          type="text"
          name="tags"
          value={tagsInput}
          onChange={handleTagsChange}
          disabled={loading}
          className="h-11 w-full rounded-xl border border-slate-200 px-3 outline-none focus:border-slate-400 disabled:bg-slate-100"
          placeholder="react, mongo, query"
        />
      </label>

      {clientError && (
        <p className="rounded-lg border border-red-200 bg-red-50 p-2 text-sm text-red-700">
          {clientError}
        </p>
      )}

      <button
        type="submit"
        disabled={loading}
        className="h-11 rounded-xl bg-slate-900 font-semibold text-white hover:bg-slate-800 disabled:opacity-60"
      >
        {loading ? '저장 중...' : '저장'}
      </button>
    </form>
  )
}
