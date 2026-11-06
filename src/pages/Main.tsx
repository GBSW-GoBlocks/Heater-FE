import { useEffect, useState } from 'react'
import { Link } from 'react-router'
import Scene from '@/components/Scene'
import StokeButton from '@/components/StokeButton'
import TempGauge from '@/components/TempGauge'
import type { Heater } from '@/heater/types'
import { formatAgo, formatDuration, shortAddr } from '@/lib/format'

/** 이 시간 아래로 남으면 위기 연출 */
const URGENT_SEC = 3600

// 기획서 순서대로: 온도 -> 상태 -> (화로) -> 연료 투입 -> 기록
export default function Main({ heater }: { heater: Heater }) {
  const [showPlus, setShowPlus] = useState(false)
  const { rules, zone } = heater

  useEffect(() => {
    if (heater.txStatus !== 'success') return
    setShowPlus(true)
    const id = setTimeout(() => setShowPlus(false), 1500)
    return () => clearTimeout(id)
  }, [heater.txStatus])

  const urgent = zone !== 'off' && heater.extinguishesIn > 0 && heater.extinguishesIn < URGENT_SEC

  return (
    <div className="main">
      {/* 1. 온도 + 상태 */}
      <TempGauge heater={heater} />

      {/* 2. 화로 */}
      <div className="scene-frame">
        <Scene state={zone} showPlus={showPlus} plusText={`+${rules.stokeAmount}°`} />
      </div>

      {/* 꺼지기까지 남은 시간 */}
      {zone !== 'off' && heater.extinguishesIn > 0 && (
        <p className={'countdown-line' + (urgent ? ' urgent' : '')}>
          {urgent ? '🚨 ' : ''}아무도 넣지 않으면 <b>{formatDuration(heater.extinguishesIn)}</b> 뒤에
          꺼져요
        </p>
      )}

      {/* 3. 연료 투입 */}
      <StokeButton heater={heater} />

      {/* 4. 기록 */}
      <div className="record-box">
        <div className="record-row">
          <div className="alive">
            {zone === 'off' ? (
              <>
                <span>불이 꺼져 있어요 (지금까지 {heater.stats.extinguishCount}번 꺼짐)</span>
                <b>꺼짐</b>
              </>
            ) : (
              <>
                <span>불이 꺼지지 않은 시간</span>
                <b>{formatDuration(heater.aliveFor)}</b>
              </>
            )}
          </div>
          <div>
            <span>마지막 투입</span>
            <b>{heater.sinceLastStoke === null ? '아직 없음' : formatAgo(heater.sinceLastStoke)}</b>
          </div>
          <div>
            <span>누적 투입</span>
            <b>{heater.stats.totalStokes}회</b>
          </div>
          <div>
            <span>내가 지핀 횟수</span>
            <b>{heater.isConnected ? `${heater.myCount}회` : '-'}</b>
          </div>
        </div>

        {heater.lastStoker && (
          <p className="last-stoker">
            마지막으로 지핀 사람 · <code>{shortAddr(heater.lastStoker)}</code>
          </p>
        )}

        <Link to="/records" className="more">기록 더보기 →</Link>
      </div>
    </div>
  )
}
