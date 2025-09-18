'use client'
import React, { useState } from 'react'

export default function KeyedList() {
  const [list, setList] = useState(() =>
    Array.from({ length: 200 }).map((_, i) => ({ id: i + 1, name: `Row ${i + 1}` }))
  )

  const prepend = () => setList((prev) => [{ id: Date.now(), name: 'NEW' }, ...prev])
  const removeFirst = () => setList((prev) => prev.slice(1))

  return (
    <section className="section">
      <h2 className="h2 mb-2">/bad – index key & 재정렬</h2>
      <p className="text-slate-400 mb-3">앞 삽입/삭제 시 index key는 전체 리마운트 유발</p>
      <div className="flex gap-2 mb-4">
        <button className="btn btn-primary" onClick={prepend}>
          앞에 추가
        </button>
        <button className="btn btn-ghost" onClick={removeFirst}>
          첫 항목 제거
        </button>
      </div>
      <ul>
        {list.map((row, index) => (
          <li key={index} className="card mb-2">
            <input
              className="w-full bg-slate-800/70 rounded-xl px-3 py-2"
              defaultValue={row.name}
            />
          </li>
        ))}
      </ul>
    </section>
  )
}
