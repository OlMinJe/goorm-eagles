'use client'
import React, { useCallback, useMemo, useState } from 'react'

function Tiny({ label, onPing }: { label: string; onPing: () => void }) {
  return (
    <button className="btn btn-ghost" onClick={onPing}>
      {label}
    </button>
  )
}

export default function MemoAbuse() {
  const [n, setN] = useState(0)
  const [q, setQ] = useState('')

  const title = useMemo(() => `현재 n: ${n}`, [q]) // 잘못된 의존성
  const tinyLabels = useMemo(() => Array.from({ length: 500 }).map((_, i) => `#${i}`), [q])

  const onInc = useCallback(() => setN((v) => v + 1), [tinyLabels])
  const onPingFactory = useCallback((id: number) => () => console.log('ping', id, q, n), [q, n])

  return (
    <section className="section">
      <h2 className="h2 mb-2">/bad – Memo/Callback 남발</h2>
      <p className="text-slate-400 mb-3">사소한 값 메모/불안정 의존성으로 오히려 성능/버그</p>
      <div className="mb-3 flex gap-2">
        <button className="btn btn-primary" onClick={onInc}>
          n++
        </button>
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          className="rounded-xl bg-slate-800/70 px-3 py-2"
          placeholder="q 바꾸기"
        />
      </div>
      <div className="card mb-3">{title}</div>
      <div className="flex flex-wrap gap-2">
        {tinyLabels.map((lb, i) => (
          <Tiny key={i} label={lb} onPing={onPingFactory(i)} />
        ))}
      </div>
    </section>
  )
}
