import type { Heater } from '@/heater/types'

const statusText: Record<string, string> = { off: '소화', low: '저온', normal: '정상', hot: '과열' }
const statusIcon: Record<string, string> = { off: '💨', low: '🥶', normal: '', hot: '⚠' }
const message: Record<string, string> = {
  off: '불이 꺼졌어요. 누군가 다시 지펴주세요.',
  low: '불이 꺼져가고 있어요! 연료가 필요해요.',
  normal: '따뜻해요. 지금 이 불을 함께 지키고 있어요.',
  hot: '너무 뜨거워요! 식을 때까지 기다려주세요.',
}

/** 게이지 눈금 최대값 (컨트랙트에 온도 상한은 없고, 화면 표시용 기준) */
const GAUGE_MAX = 100

/** 온도 → 상태 순서로 보여주는 화면 맨 위 간판 */
export default function TempGauge({ heater }: { heater: Heater }) {
  const { zone, rules } = heater

  return (
    <div className={'temp-box ' + zone}>
      <div className="temp-wrap">
        <p className="small-title">현재 온도</p>
        <div className="temp">{heater.temp.toFixed(1)}°</div>
      </div>
      <div className="status">
        <span className={'badge ' + zone}>
          {statusIcon[zone] && <span className="badge-icon">{statusIcon[zone]}</span>}{' '}
          {statusText[zone]}
        </span>
        <p>{message[zone]}</p>
      </div>
      <div className="bar">
        <div
          className="bar-fill"
          style={{ width: Math.min(100, (heater.temp / GAUGE_MAX) * 100) + '%' }}
        ></div>
        <div
          className="bar-line"
          style={{ left: (rules.overheatThreshold / GAUGE_MAX) * 100 + '%' }}
        ></div>
      </div>
    </div>
  )
}
