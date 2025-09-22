'use client'
import React, { useCallback, useMemo, useState } from 'react'

const Row = React.memo(function Row({
  item,
  onToggle,
}: {
  item: { id: number; name: string }
  onToggle: (id: number) => void
}) {
  return (
    <div className="flex items-center justify-between px-3 py-2 rounded-xl bg-slate-800/60 mb-2">
      <span>{item.name}</span>
      <button className="btn btn-ghost" onClick={() => onToggle(item.id)}>
        toggle
      </button>
    </div>
  )
})

export default function UnstableProps() {
  const [tick, setTick] = useState(0)
  const items = useMemo(
    () => Array.from({ length: 300 }).map((_, i) => ({ id: i + 1, name: `Item ${i + 1}` })),
    []
  )
  const onToggle = useCallback((id: number) => {
    console.log('toggle', id)
  }, [])

  return (
    <section className="section">
      <h2 className="h2 mb-2">/bad – 불안정 props/함수</h2>
      <p className="text-slate-400 mb-3">부모 변경 시 매번 새 참조 → memo 무력화</p>
      <button className="btn btn-primary mb-4" onClick={() => setTick((t) => t + 1)}>
        부모 rerender ({tick})
      </button>
      <div>
        {items.map((it) => (
          <Row key={it.id} item={it} onToggle={onToggle} />
        ))}
      </div>
    </section>
  )
}
