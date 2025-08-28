import { useEffect, useMemo, useState } from 'react'

// ✅ Bootcamp-ready: Single-file React component (Pure JSX)
// - Tech: React + TailwindCSS (no extra libs)
// - Time: ~1 hour build target
// - Features:
//   1) A/B 투표 (버튼 클릭 → 집계)
//   2) 중복 투표 방지 (localStorage로 기기당 1회)
//   3) 실시간 퍼센트/프로그레스 바
//   4) 결과 토글 보기 / 숨기기
//   5) 리셋 버튼
// - 확장 아이디어: ① 옵션 3개 이상, ② URL 쿼리로 제목/옵션 주입, ③ 간단 서버 연동

export default function PollAB() {
  // ====== 1) 초기값 ======
  const POLL_ID = 'bootcamp-poll-ab-v1' // 로컬스토리지 키 분리용
  const [title, setTitle] = useState('React vs. Vue — 당신의 선택은?')
  const [options, setOptions] = useState([
    { id: 'A', label: 'React', color: 'bg-blue-500' },
    { id: 'B', label: 'Vue', color: 'bg-emerald-500' },
  ])

  // ====== 2) 투표 상태 ======
  const [votes, setVotes] = useState({ A: 0, B: 0 })
  const [myChoice, setMyChoice] = useState(null) // 내 투표 기록
  const [showResults, setShowResults] = useState(true)

  // 초기 로드: 저장값 복구
  useEffect(() => {
    const saved = localStorage.getItem(POLL_ID)
    if (saved) {
      try {
        const parsed = JSON.parse(saved)
        if (parsed && typeof parsed === 'object') {
          if (parsed.votes) {
            setVotes(parsed.votes)
          }
          if (parsed.myChoice) {
            setMyChoice(parsed.myChoice)
          }
          if (typeof parsed.showResults === 'boolean') {
            setShowResults(parsed.showResults)
          }
          if (parsed.title) {
            setTitle(parsed.title)
          }
          if (parsed.options && Array.isArray(parsed.options)) {
            setOptions(parsed.options)
          }
        }
      } catch (e) {
        // ignore parse errors
      }
    }
  }, [])

  // 변경사항 저장
  useEffect(() => {
    localStorage.setItem(POLL_ID, JSON.stringify({ votes, myChoice, showResults, title, options }))
  }, [votes, myChoice, showResults, title, options])

  // 총합/퍼센트 계산
  const total = useMemo(() => Object.values(votes).reduce((a, b) => a + b, 0), [votes])
  const percent = (key) => {
    if (total === 0) {
      return 0
    }
    const n = votes[key] || 0
    return Math.round((n / total) * 100)
  }

  // 투표 핸들러
  const vote = (key) => {
    if (myChoice) {
      return
    } // 중복투표 방지
    setVotes((v) => ({ ...v, [key]: (v[key] || 0) + 1 }))
    setMyChoice(key)
  }

  // 리셋(교사용)
  const reset = () => {
    if (!confirm('정말 초기화할까요? 모든 집계가 삭제됩니다.')) {
      return
    }
    setVotes({ A: 0, B: 0 })
    setMyChoice(null)
    setShowResults(true)
  }

  // ====== 3) UI ======
  return (
    <div className="min-h-[100dvh] w-full bg-gradient-to-b from-white to-slate-50 text-slate-900 flex items-center justify-center p-6">
      <div className="w-full max-w-2xl rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        {/* 헤더 */}
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1">
            <h1 className="text-2xl font-bold tracking-tight">{title}</h1>
            <p className="mt-1 text-sm text-slate-500">기기당 1회 투표가 저장됩니다.</p>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowResults((s) => !s)}
              className="rounded-lg border border-slate-200 px-3 py-2 text-sm hover:bg-slate-50"
            >
              {showResults ? '결과 숨기기' : '결과 보기'}
            </button>
            <button
              onClick={reset}
              className="rounded-lg border border-rose-200 bg-rose-50 px-3 py-2 text-sm text-rose-700 hover:bg-rose-100"
              title="교사용 초기화"
            >
              리셋
            </button>
          </div>
        </div>

        {/* 투표 영역 */}
        <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
          {options.map((opt) => (
            <button
              key={opt.id}
              onClick={() => vote(opt.id)}
              disabled={!!myChoice}
              className={`group relative overflow-hidden rounded-xl border p-5 text-left transition ${
                myChoice === opt.id
                  ? 'border-slate-800 bg-slate-900 text-white'
                  : 'border-slate-200 bg-white hover:bg-slate-50'
              }`}
            >
              <span className="block text-base font-semibold">{opt.label}</span>
              <span className="mt-1 block text-xs text-slate-500 group-disabled:opacity-70">
                {myChoice
                  ? myChoice === opt.id
                    ? '내가 선택한 항목'
                    : '다른 항목'
                  : '지금 투표하세요'}
              </span>

              {/* 하단 진행바 (선택 시 강조) */}
              {showResults && (
                <div className="mt-4">
                  <div className="flex items-center justify-between text-xs text-slate-500">
                    <span>득표수: {votes[opt.id] || 0}</span>
                    <span>{percent(opt.id)}%</span>
                  </div>
                  <div className="mt-1 h-2 w-full rounded-full bg-slate-100">
                    <div
                      className={`h-2 rounded-full ${opt.color}`}
                      style={{ width: `${percent(opt.id)}%` }}
                    />
                  </div>
                </div>
              )}

              {/* 선택 표시 배지 */}
              {myChoice === opt.id && (
                <span className="absolute right-3 top-3 rounded-full bg-white/90 px-2 py-0.5 text-[11px] font-medium text-slate-900 shadow-sm">
                  선택됨
                </span>
              )}
            </button>
          ))}
        </div>

        {/* 총계/상태 */}
        <div className="mt-6 rounded-xl border border-slate-100 bg-slate-50 p-4 text-sm text-slate-600">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div>
              총 투표수: <b>{total}</b>
            </div>
            <div>
              상태:{' '}
              {myChoice ? (
                <span className="font-medium text-slate-900">투표 완료 ({myChoice})</span>
              ) : (
                <span className="text-slate-500">미참여</span>
              )}
            </div>
          </div>
        </div>

        {/* (선택) 편집 패널: 제목/옵션 교체 (교사용) */}
        <details className="mt-4 cursor-pointer select-none">
          <summary className="text-sm text-slate-500">편집 — 제목/옵션 변경</summary>
          <div className="mt-3 grid grid-cols-1 gap-3">
            <label className="block text-sm">
              <span className="mb-1 block text-slate-500">질문 제목</span>
              <input
                className="w-full rounded-lg border border-slate-200 px-3 py-2 outline-none focus:border-slate-900"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="질문을 입력하세요"
              />
            </label>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              {options.map((opt, idx) => (
                <label key={opt.id} className="block text-sm">
                  <span className="mb-1 block text-slate-500">옵션 {opt.id} 라벨</span>
                  <input
                    className="w-full rounded-lg border border-slate-200 px-3 py-2 outline-none focus:border-slate-900"
                    value={opt.label}
                    onChange={(e) => {
                      const next = [...options]
                      next[idx] = { ...opt, label: e.target.value }
                      setOptions(next)
                    }}
                  />
                </label>
              ))}
            </div>
          </div>
        </details>

        {/* 푸터 */}
        <div className="mt-6 text-center text-xs text-slate-400">
          Tip: 같은 브라우저에서는 중복투표가 차단됩니다. (localStorage 이용)
        </div>
      </div>
    </div>
  )
}
