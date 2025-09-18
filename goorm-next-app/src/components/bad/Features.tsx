'use client'
import { useEffect, useRef } from 'react'

export default function Features() {
  const boxesRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const boxes = boxesRef.current?.querySelectorAll('.box') ?? []
    for (let i = 0; i < 300; i++) {
      const el = boxes[i % boxes.length] as HTMLElement
      el.style.height = `${20 + Math.random() * 80}px`
      const h = el.offsetHeight // 강제 레이아웃
      el.style.backgroundColor = `hsl(${(h * 3) % 360} 60% 35%)`
    }
  })

  return (
    <section className="section">
      <h2 className="h2 mb-3">/bad – Features (Layout Thrashing)</h2>
      <div ref={boxesRef} className="grid grid-cols-5 gap-2">
        {Array.from({ length: 50 }).map((_, i) => (
          <div key={i} className="box h-10 rounded-xl bg-slate-700/70" />
        ))}
      </div>
    </section>
  )
}
