export default function Home() {
  return (
    <div className="section">
      <h2 className="h1 mb-4">성능 측정 수업 안내</h2>
      <ul className="list-disc pl-6 space-y-2 text-slate-300">
        <li>
          <b>/bad</b> : 실무에서 흔히 보는 안티패턴(느리게 만듦)
        </li>
        <li>
          <b>/good</b> : 동일 UI를 성능 최적화한 버전
        </li>
        <li>Performance 패널에서 Record → 두 경로 각각 상호작용 → 전/후 비교</li>
      </ul>
    </div>
  )
}
