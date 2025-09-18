'use client'
import { useEffect, useRef, useState } from 'react'

export default function Gallery() {
  const [count, setCount] = useState(0)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el = ref.current!
    el.innerHTML = ''
    for (let i = 0; i < 3000; i++) {
      const d = document.createElement('div')
      d.className = 'rounded-xl bg-slate-700/60 mb-2 h-6'
      el.appendChild(d)
    }
  }, [count])

  return (
    <section className="section">
      <h2 className="h2 mb-3">/bad – Gallery (대량 DOM 추가)</h2>
      <button className="btn btn-primary" onClick={() => setCount((c) => c + 1)}>
        다시 렌더(느림)
      </button>
      <div ref={ref} className="mt-6" />
      <div
        className="mt-6 w-24 h-24 bg-cyan-500 rounded-xl relative"
        style={{ animation: 'move 2s linear infinite' }}
      />
      <style>{`
        @keyframes move {
          0% { top:0px; left:0px; }
          50% { top:120px; left:120px; }
          100% { top:0px; left:0px; }
        }
      `}</style>
    </section>
  )
}
