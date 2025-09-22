'use client'
import { useEffect, useState } from 'react'

export default function EffectAbuse() {
  const [count, setCount] = useState(0)

  useEffect(() => {
    // let cancelled = false
    const controller = new AbortController()
    const signal = controller.signal

    // 사용자가 페이지 떠날때 진행 중인 요청 취소
    window.addEventListener('beforeunload', () => controller.abort())

    fetch('/api/products?noop=' + Math.random(), { signal })
      .then((r) => r.json())
      .then(() => {
        // if (!cancelled) console.log('fetch done')
        console.log('fetch done')
      })
      .catch((error) => {
        if (error.name === 'AbortError') {
          console.log('요청이 중단되었습니다.', error)
        } else {
          console.log('다른 오류 발생', error)
        }
      })

    const onScroll = () => setCount((c) => c + 1)
    window.addEventListener('scroll', onScroll)

    return () => {
      // cancelled = true
      controller.abort()
      window.removeEventListener('scroll', onScroll)
    }
  }, [])

  return (
    <section className="section">
      <h2 className="h2 mb-2">/bad – Effect 남용/정리 누락</h2>
      <p className="text-slate-400 mb-3">렌더마다 fetch + 스크롤 리스너 중복 등록</p>
      <div className="card">스크롤할 때마다 count: {count}</div>
    </section>
  )
}
