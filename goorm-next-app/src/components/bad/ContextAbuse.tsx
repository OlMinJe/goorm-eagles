'use client'
import { createContext, useContext, useMemo, useState } from 'react'

const TextContext = createContext<string>('')

function DeepChild() {
  const text = useContext(TextContext)
  return (
    <div className="text-slate-300 text-sm">
      length: {text.length} / preview: {text.slice(0, 12)}
    </div>
  )
}

export default function ContextAbuse() {
  const [text, setText] = useState('')
  const value = useMemo(() => text, [text])
  // const [now, setNow] = useState<number>(Date.now())

  // // ✅ 클라이언트에서만 현재 시각 주입
  // useEffect(() => {
  //   if (typeof window !== 'undefined') {
  //     setNow(Date.now())
  //   }
  // }, [])

  // const value = useMemo(() => {
  //   const big = 'x'.repeat(200_000)
  //   return {
  //     blob: big,
  //     count: text.length,
  //     ts: now,
  //     nested: { a: { b: { c: big } } },
  //   }
  // }, [text, now])

  return (
    <section className="section">
      <h2 className="h2 mb-2">/bad – Context 과사용</h2>
      <p className="text-slate-400 mb-3">입력마다 거대한 Context value 재생성 → 전역 리렌더</p>
      <TextContext value={value}>
        <input
          value={text}
          onChange={(e) => setText(e.target.value)}
          className="w-full rounded-xl bg-slate-800/70 px-3 py-2"
          placeholder="타이핑 → 전역 리렌더"
        />
        <div className="mt-3 grid grid-cols-3 gap-2">
          {Array.from({ length: 30 }).map((_, i) => (
            <div key={i} className="card">
              <DeepChild />
            </div>
          ))}
        </div>
      </TextContext>
    </section>
  )
}
