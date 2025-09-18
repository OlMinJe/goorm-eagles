'use client'
import { useEffect } from 'react'

export default function CTA() {
  useEffect(() => {
    const s = document.createElement('script')
    s.src = 'https://cdnjs.cloudflare.com/ajax/libs/lodash.js/4.17.21/lodash.min.js'
    s.async = false // 동기 로드 (렌더 차단)
    document.head.appendChild(s)
  }, [])

  return (
    <section className="section">
      <div className="card flex items-center justify-between">
        <div>
          <h3 className="text-xl font-bold">/bad – CTA (동기 스크립트)</h3>
          <p className="text-slate-300">동기 서드파티 스크립트는 초기 렌더를 막습니다.</p>
        </div>
        <button className="btn btn-primary">지금 시작</button>
      </div>
    </section>
  )
}
