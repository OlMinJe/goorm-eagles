'use client'
import Image from 'next/image'
import { useEffect, useMemo, useState } from 'react'

export default function Hero() {
  const [data, setData] = useState<any[]>([])
  const [query, setQuery] = useState('')

  useEffect(() => {
    let mounted = true
    fetch('/api/products', { cache: 'no-store' })
      .then((r) => r.json())
      .then((d) => {
        if (mounted) setData(d.items)
      })
    return () => {
      mounted = false
    }
  }, [])

  const top10 = useMemo(() => {
    const sorted = [...data].sort((a, b) => b.price - a.price)
    return sorted.slice(0, 10).filter((i) => (query ? i.name.includes(query) : true))
  }, [data, query])

  return (
    <section className="section">
      <h2 className="h1 mb-3">/bad – Hero</h2>
      <p className="text-slate-300">클라이언트 fetch + 무거운 계산을 매 렌더마다 수행</p>
      <input
        className="mt-4 w-full rounded-xl bg-slate-800/70 px-3 py-2 outline-none"
        placeholder="검색(입력 시 매번 무거운 계산)"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />
      <div className="grid-3 mt-6">
        {top10.map((p) => (
          <div key={p.id} className="card">
            {/* <img src={p.image} alt={p.name} className="rounded-xl w-full h-48 object-cover" /> */}
            <Image
              src={p.image}
              alt={p.name}
              width={1200}
              height={800}
              className="rounded-xlobject-cover"
            />
            <div className="mt-3 font-semibold">{p.name}</div>
            <div className="text-slate-400">{p.price.toLocaleString()}원</div>
          </div>
        ))}
      </div>
    </section>
  )
}
