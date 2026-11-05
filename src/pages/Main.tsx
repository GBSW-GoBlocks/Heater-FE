import { useEffect, useState } from 'react'
import Scene from '../components/Scene'
import type { Heater } from '../contract/types'
import { OVERHEAT, MAX_TEMP, STOKE_AMOUNT, COOLDOWN } from '../contract/mock'
import { aliveTime, countdown, timeAgo, clockTime } from '../utils'

// 기획서 순서대로: 온도 -> 상태 -> (화로) -> 연료 투입 -> 기록
export default function Main({ heater }: { heater: Heater }) {
  const [showPlus, setShowPlus] = useState(false)

  let state = 'normal'
  if (heater.status === 'extinguished') state = 'off'
  else if (heater.status === 'overheated' || heater.temp >= OVERHEAT) state = 'hot'
  else if (heater.temp < 30) state = 'low'

  const statusText: Record<string, string> = { off: '소화', low: '저온', normal: '정상', hot: '과열' }
  const message: Record<string, string> = {
    off: '불이 꺼졌어요. 누군가 다시 지펴주세요.',
    low: '불이 꺼져가고 있어요! 연료가 필요해요.',
    normal: '따뜻해요. 지금 이 불을 함께 지키고 있어요.',
    hot: '너무 뜨거워요! 식을 때까지 기다려주세요.',
  }

  useEffect(() => {
    if (heater.txStatus === 'success') {
      setShowPlus(true)
      setTimeout(() => setShowPlus(false), 1500)
    }
  }, [heater.txStatus])

  let buttonText = '연료 넣기'
  if (heater.txStatus === 'pending') buttonText = '넣는 중...'
  else if (heater.cooldown > 0) buttonText = '쿨다운 중'
  else if (state === 'hot') buttonText = '과열이라 넣을 수 없어요'
  else if (state === 'off') buttonText = '불 다시 붙이기'

  // 상태 아이콘 (색만으로 구분하지 않게)
  const statusIcon: Record<string, string> = { off: '💨', low: '🥶', normal: '', hot: '⚠' }

  let buttonIcon = ''
  if (heater.txStatus === 'pending' || heater.cooldown > 0) buttonIcon = '⏳'
  else if (state === 'hot') buttonIcon = '🔒'

  const disabled = heater.txStatus === 'pending' || heater.cooldown > 0 || state === 'hot'
  const nextTime = Math.floor(Date.now() / 1000) + heater.cooldown

  return (
    <div className="main">
      {/* 1. 온도 + 상태 */}
      <div className={'temp-box ' + state}>
        <div className="temp-wrap">
          <p className="small-title">현재 온도</p>
          <div className="temp">{heater.temp.toFixed(1)}°</div>
        </div>
        <div className="status">
          <span className={'badge ' + state}>
            {statusIcon[state] && <span className="badge-icon">{statusIcon[state]}</span>} {statusText[state]}
          </span>
          <p>{message[state]}</p>
        </div>
        <div className="bar">
          <div className="bar-fill" style={{ width: (heater.temp / MAX_TEMP) * 100 + '%' }}></div>
          <div className="bar-line" style={{ left: (OVERHEAT / MAX_TEMP) * 100 + '%' }}></div>
        </div>
      </div>

      {/* 2. 화로 */}
      <div className="scene-frame">
        <Scene state={state} showPlus={showPlus} />
      </div>

      {/* 3. 연료 투입 */}
      <div className="stoke-box">
        <button className="stoke-btn" disabled={disabled} onClick={heater.stoke}>
          {buttonIcon && <span className="btn-icon">{buttonIcon}</span>}
          <span>{buttonText}</span>
        </button>
        {heater.cooldown > 0 ? (
          <p className="cooldown">
            다음에 넣을 수 있는 시각: <b>{clockTime(nextTime)}</b> ({countdown(heater.cooldown)} 남음)
          </p>
        ) : (
          <p className="small">
            한 번에 +{STOKE_AMOUNT}°, 한 지갑당 {COOLDOWN / 60}분에 한 번만 넣을 수 있어요
          </p>
        )}
        {heater.txStatus === 'success' && <p className="ok">연료를 넣었어요!</p>}
        {heater.txStatus === 'error' && <p className="err">{heater.txError}</p>}
      </div>

      {/* 4. 기록 */}
      <div className="record-box">
        <div className="record-row">
          <div className="alive">
            {state === 'off' ? (
              <>
                <span>불이 꺼져 있어요 (지금까지 {heater.stats.extinguishCount}번 꺼짐)</span>
                <b>꺼짐</b>
              </>
            ) : (
              <>
                <span>불이 꺼지지 않은 시간</span>
                <b>{aliveTime(heater.stats.bornAt)}</b>
              </>
            )}
          </div>
          <div>
            <span>마지막 투입</span>
            <b>{timeAgo(heater.stats.lastStokedAt)}</b>
          </div>
          <div>
            <span>누적 투입</span>
            <b>{heater.stats.totalStokes}회</b>
          </div>
          <div>
            <span>내가 지핀 횟수</span>
            <b>{heater.myCount}회</b>
          </div>
        </div>
        <a href="#/records" className="more">기록 더보기 →</a>
      </div>
    </div>
  )
}
