export default function About() {
  return (
    <div className="about">
      <h2>혼자서는 지킬 수 없는 불</h2>
      <p>여럿이 번갈아 지펴야 유지되는 온체인 화로예요.</p>

      <div className="box">
        <h3>서비스 소개</h3>
        <p>
          누구나 연료를 넣어 온도를 올릴 수 있고, 시간이 지나면 불은 자연히 식어요. 아무도 넣지 않으면 꺼져요.
          그래서 불이 살아 있다는 건 지금 여러 사람이 함께 있다는 뜻이에요.
        </p>
      </div>

      <div className="box">
        <h3>📖 규칙</h3>
        <ol className="tutorial">
          <li>
            <span>지갑을 연결하고 연료를 넣으면 온도가 15° 올라가요</span>
          </li>
          <li>
            <span className="tut-icon">⏳</span>
            <span>시간이 지나면 온도가 조금씩 내려가요</span>
          </li>
          <li>
            <span className="tut-icon">👥</span>
            <span>한 지갑은 30분에 한 번만 넣을 수 있어요 (혼자서는 못 지켜요)</span>
          </li>
          <li>
            <span className="tut-icon">⚠</span>
            <span>85° 이상이면 과열! 연료를 넣을 수 없고, 오래 두면 꺼져요</span>
          </li>
          <li>
            <span className="tut-icon">📜</span>
            <span>누가 언제 지폈는지 블록체인에 지워지지 않게 남아요</span>
          </li>
        </ol>
      </div>
    </div>
  )
}
