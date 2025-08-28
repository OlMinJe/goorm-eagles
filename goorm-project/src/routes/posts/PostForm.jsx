import { useState } from 'react'

export default function PostForm({ initial, loading = false, onSubmit }) {
  const [title, setTitle] = useState(initial?.title ?? '')
  const [body, setBody] = useState(initial?.body ?? '')
  const [tagsInput, setTagsInput] = useState((initial?.tags ?? []).join(', '))

  const submit = (e) => {
    e.preventDefault()
    const tags = tagsInput
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean)
    onSubmit?.({ title: title.trim(), body, tags })
  }

  return (
    <form onSubmit={submit} className="grid gap-3" noValidate>
      <label className="grid gap-2 text-sm">
        제목
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          disabled={loading}
          className="h-11 w-full rounded-xl border border-slate-200 px-3 outline-none focus:border-slate-400 disabled:bg-slate-100"
          placeholder="제목을 입력하세요"
        />
      </label>

      <label className="grid gap-2 text-sm">
        본문
        <textarea
          value={body}
          onChange={(e) => setBody(e.target.value)}
          disabled={loading}
          rows={10}
          className="w-full rounded-xl border border-slate-200 p-3 outline-none focus:border-slate-400 disabled:bg-slate-100"
          placeholder="내용을 작성하세요"
        />
      </label>

      <label className="grid gap-2 text-sm">
        태그 (쉼표로 구분)
        <input
          value={tagsInput}
          onChange={(e) => setTagsInput(e.target.value)}
          disabled={loading}
          className="h-11 w-full rounded-xl border border-slate-200 px-3 outline-none focus:border-slate-400 disabled:bg-slate-100"
          placeholder="react, mongo, query"
        />
      </label>

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
