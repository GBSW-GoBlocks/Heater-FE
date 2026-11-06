import type { Heater } from '@/heater/types'
import { Cause } from '@/heater/temperature'
import { causeLabel, dateTime, formatAgo, formatDuration, shortAddr } from '@/lib/format'

export default function Records({ heater }: { heater: Heater }) {
  const { stats, recentStokes, ranking, fireHistory } = heater
  const mine = heater.account?.toLowerCase()

  return (
    <div className="records">
      <h2>기록</h2>

      {/* 내 기록 */}
      <div className="box my">
        <span className="achv-icon">🏅</span>
        <h3>내 기록</h3>
        {heater.isConnected ? (
          <p>
            지금까지 <b>{heater.myCount}번</b> 지폈어요
            {heater.myRank !== null && <> · 기여 순위 <b>{heater.myRank}위</b></>}
          </p>
        ) : (
          <p>지갑을 연결하면 내가 몇 번 지폈는지 볼 수 있어요</p>
        )}
      </div>

      {/* 불의 생존 기록 */}
      <div className="stat-list">
        <div className="box">
          <h3>연속 유지 시간</h3>
          <b>{heater.zone === 'off' ? '꺼짐' : formatDuration(heater.aliveFor)}</b>
        </div>
        <div className="box">
          <h3>역대 최장 유지</h3>
          <b>{stats.longestLifetime > 0 ? formatDuration(stats.longestLifetime) : '-'}</b>
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
        <div className="box">
          <span className="achv-icon">👥</span>
          <h3>함께한 사람</h3>
          <b>{stats.contributorCount}명</b>
        </div>
      </div>

      <div className="two">
        {/* 투입 이력: 누가, 언제, 얼마나 */}
        <div className="box log-box">
          <h3>📜 투입 이력 <span className="sub">최근 {recentStokes.length}건</span></h3>
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
              {recentStokes.map((s) => (
                <tr
                  key={`${s.timestamp}-${s.stoker}`}
                  className={s.stoker.toLowerCase() === mine ? 'is-me' : ''}
                >
                  <td title={s.stoker}>{shortAddr(s.stoker)}</td>
                  <td title={dateTime(s.timestamp)}>{formatAgo(s.ago)}</td>
                  <td>+{heater.rules.stokeAmount}°</td>
                  <td>{s.tempAfter.toFixed(1)}°</td>
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
            {ranking.slice(0, 10).map((r) => (
              <li key={r.address} className={r.address.toLowerCase() === mine ? 'is-me' : ''}>
                <span className={'num rank-' + r.rank}>
                  {r.rank === 1 ? '🥇' : r.rank === 2 ? '🥈' : r.rank === 3 ? '🥉' : r.rank}
                </span>
                <span title={r.address}>{shortAddr(r.address)}</span>
                <span className="count">{r.count}회</span>
              </li>
            ))}
          </ol>
        </div>
      </div>

      {/* 꺼진 불들의 생존 기록 */}
      <div className="box fire-box">
        <h3>🔥 불의 생존 기록 <span className="sub">{stats.extinguishCount}번 꺼짐</span></h3>
        {fireHistory.length === 0 ? (
          <p className="empty">아직 꺼진 불이 없어요</p>
        ) : (
          <ul className="fire-list">
            {fireHistory.map((f) => (
              <li key={f.fireId}>
                <span className="fire-id">#{f.fireId}</span>
                <span className="fire-life">{formatDuration(f.lifetime)}</span>
                <span className="fire-stokes">{f.stokes}번 지펴짐</span>
                <span className={'fire-cause' + (f.cause === Cause.Burnout ? ' burnout' : '')}>
                  {causeLabel(f.cause)}
                </span>
                <span className="fire-date">{dateTime(f.diedAt)}</span>
              </li>
            ))}
          </ul>
        )}
      </div>

      <p className="chain-note">
        모든 기록은{' '}
        <a
          href="https://testnet.bscscan.com/address/0x989ba280Ab048a2E5EAf1A92552bdB5F6f63DF87"
          target="_blank"
          rel="noreferrer"
        >
          BNB 테스트넷 컨트랙트
        </a>
        에 그대로 남아 있어요
      </p>
    </div>
  )
}
