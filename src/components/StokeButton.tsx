import type { Heater } from '@/heater/types'
import { clockTime, formatCountdown } from '@/lib/format'

const EXPLORER_TX = 'https://testnet.bscscan.com/tx/'

type ButtonState = {
  label: string
  icon: string
  disabled: boolean
  action: 'stoke' | 'connect' | 'switchChain'
}

/**
 * 버튼 하나가 상황에 따라 다르게 동작한다 (기획서: "핵심 조작은 버튼 하나").
 * 지갑 미연결 → 연결, 다른 네트워크 → 전환, 그 외 → 투입.
 */
export function stokeButtonState(heater: Heater): ButtonState {
  if (!heater.isConnected) {
    return {
      label: heater.isConnecting ? '연결 중...' : '지갑 연결하고 불 지피기',
      icon: '🪙',
      disabled: heater.isConnecting,
      action: 'connect',
    }
  }
  if (heater.wrongChain) {
    return { label: 'BNB 테스트넷으로 전환', icon: '⚠', disabled: false, action: 'switchChain' }
  }

  switch (heater.txStatus) {
    case 'switching':
      return { label: '네트워크 전환 중...', icon: '⏳', disabled: true, action: 'stoke' }
    case 'signing':
      return { label: '지갑에서 서명해 주세요', icon: '✍', disabled: true, action: 'stoke' }
    case 'mining':
      return { label: '블록에 기록하는 중...', icon: '⏳', disabled: true, action: 'stoke' }
  }

  if (heater.cooldown > 0) {
    return { label: '쿨다운 중', icon: '⏳', disabled: true, action: 'stoke' }
  }
  if (heater.zone === 'hot') {
    return { label: '과열이라 넣을 수 없어요', icon: '🔒', disabled: true, action: 'stoke' }
  }
  if (heater.zone === 'off') {
    return { label: '불 다시 붙이기', icon: '', disabled: false, action: 'stoke' }
  }
  return { label: '연료 넣기', icon: '', disabled: false, action: 'stoke' }
}

export default function StokeButton({ heater }: { heater: Heater }) {
  const { rules, preview } = heater
  const state = stokeButtonState(heater)
  const onClick =
    state.action === 'connect'
      ? heater.connect
      : state.action === 'switchChain'
        ? heater.switchChain
        : heater.stoke

  const busy = ['switching', 'signing', 'mining'].includes(heater.txStatus)
  const ready = heater.isConnected && !heater.wrongChain
  const nextAt = heater.chainNow + heater.cooldown

  return (
    <div className="stoke-box">
      <button className="stoke-btn" disabled={state.disabled} onClick={onClick}>
        {state.icon && <span className="btn-icon">{state.icon}</span>}
        <span>{state.label}</span>
      </button>

      {ready && heater.cooldown > 0 ? (
        <p className="cooldown">
          다음에 넣을 수 있는 시각: <b>{clockTime(nextAt)}</b> ({formatCountdown(heater.cooldown)}{' '}
          남음)
        </p>
      ) : (
        <p className="small">
          한 번에 +{rules.stokeAmount}°, 한 지갑당 {rules.cooldown / 3600}시간에 한 번만 넣을 수
          있어요 · 시간당 -{rules.coolingRate}°
        </p>
      )}

      {/* 투입 전 경고 — previewStoke */}
      {!busy && ready && preview?.canStoke && (
        <p
          className={
            'preview' + (preview.willBurnout ? ' danger' : preview.willOverheat ? ' warn' : '')
          }
        >
          넣으면 <b>{preview.tempAfter.toFixed(1)}°</b>
          {preview.willBurnout
            ? ' — 과열이 오래 이어져 불이 타버려요!'
            : preview.willOverheat
              ? ' — 과열 구간에 들어가요.'
              : ''}
        </p>
      )}

      {heater.txStatus === 'success' && <p className="ok">연료를 넣었어요!</p>}
      {heater.txStatus === 'error' && <p className="err">{heater.txError}</p>}
      {heater.connectError && <p className="err">{heater.connectError}</p>}
      {heater.txHash && (
        <a className="tx-link" href={EXPLORER_TX + heater.txHash} target="_blank" rel="noreferrer">
          트랜잭션 보기 ↗
        </a>
      )}
    </div>
  )
}
