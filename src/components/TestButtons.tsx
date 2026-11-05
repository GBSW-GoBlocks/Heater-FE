// 화면 테스트용 버튼 (나중에 지우기)
import { setTemp, resetCooldown } from '../contract/mock'

export default function TestButtons() {
  return (
    <div className="test-buttons">
      <span>테스트</span>
      <button onClick={() => setTemp(0)}>소화</button>
      <button onClick={() => setTemp(20)}>저온</button>
      <button onClick={() => setTemp(60)}>적정</button>
      <button onClick={() => setTemp(95)}>과열</button>
      <button onClick={resetCooldown}>쿨다운 초기화</button>
    </div>
  )
}
