import { useState, useCallback, memo } from 'react'

// 👶 자식 컴포넌트
const Child = memo(({ onClick }) => {
  console.log('👶 Child 렌더링')
  return <button onClick={onClick}>자식 버튼</button>
})

export default function App() {
  const [count, setCount] = useState(0)

  // ❌ useCallback 없이: Parent 리렌더 시마다 새 함수 생성
  // const handleClick = () => console.log("Child 버튼 클릭");

  // ✅ useCallback 사용: 의존성 배열이 [] 이므로 동일 참조 재사용
  const handleClick = useCallback(() => {
    console.log('Child 버튼 클릭')
  }, [])

  console.log('👨 Parent 렌더링')

  return (
    <div style={{ padding: 20 }}>
      <h2>Count: {count}</h2>
      <button onClick={() => setCount(count + 1)}>부모 카운트 증가</button>
      <Child onClick={handleClick} />
    </div>
  )
}
