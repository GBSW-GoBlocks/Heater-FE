import type { Heater } from '../contract/types'
import { aliveTime, shortAddr, timeAgo } from '../utils'

export default function Records({ heater }: { heater: Heater }) {
  const { stats, recentStokes, ranking } = heater

  return (
    <div className="records">
      <h2>기록</h2>

      {/* 내 기록 */}
      <div className="box my">
        <span className="achv-icon">🏅</span>
        <h3>내 기록</h3>
        <p>지금까지 <b>{heater.myCount}번</b> 지폈어요</p>
      </div>

      {/* 불의 생존 기록 */}
      <div className="stat-list">
        <div className="box">
          <h3>연속 유지 시간</h3>
          <b>{heater.status === 'extinguished' ? '꺼짐' : aliveTime(stats.bornAt)}</b>
        </div>
        <div className="box">
          <span className="achv-icon">💨</span>
          <h3>꺼진 횟수</h3>
          <b>{stats.extinguishCount}회</b>
        </div>
        <div className="box">
          <h3>누적 투입</h3>
          <b>{stats.totalStokes}회</b>
        </div>
      </div>

      <div className="two">
        {/* 투입 이력: 누가, 언제, 얼마나 */}
        <div className="box log-box">
          <h3>📜 투입 이력</h3>
          <table>
            <thead>
              <tr>
                <th>누가</th>
                <th>언제</th>
                <th>얼마나</th>
                <th>투입 후</th>
              </tr>
            </thead>
            <tbody>
              {recentStokes.length === 0 && (
                <tr>
                  <td colSpan={4} className="empty">아직 장작을 넣은 사람이 없어요</td>
                </tr>
              )}
              {recentStokes.map((s, i) => (
                <tr key={i}>
                  <td>{shortAddr(s.stoker)}</td>
                  <td>{timeAgo(s.timestamp)}</td>
                  <td>+{s.amount}°</td>
                  <td>{s.tempAfter}°</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* 기여자 랭킹 */}
        <div className="box rank-box">
          <h3>🏆 기여자 랭킹</h3>
          <ol className="ranking">
            {ranking.length === 0 && <li className="empty">아직 장작을 넣은 사람이 없어요</li>}
            {ranking.map((r, i) => (
              <li key={r.address}>
                <span className={'num rank-' + (i + 1)}>{i === 0 ? '🥇' : i === 1 ? '🥈' : i === 2 ? '🥉' : i + 1}</span>
                {shortAddr(r.address)}
                <span className="count">{r.count}회</span>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </div>
  )
}
