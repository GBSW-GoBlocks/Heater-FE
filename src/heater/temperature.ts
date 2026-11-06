// 온도 계산 — 컨트랙트와 같은 식을 브라우저에서 돌린다.
// 덕분에 1초마다 화면을 다시 그려도 RPC 를 부르지 않는다.
import type { ContractFunctionReturnType } from 'viem'
import { heaterAbi } from './contract'

/** 컨트랙트의 온도 값은 °C × 100 (TEMP_DECIMALS = 2). 1500 = 15.00°C */
const TEMP_SCALE = 100

/** UI 저온 기준 30.00°C — 컨트랙트 규칙이 아니라 화면에서 정한 값이다. */
const LOW_TEMP = 30n * BigInt(TEMP_SCALE)

/** Heater.Cause — 불이 꺼진 원인 */
export const Cause = { None: 0, Cooled: 1, Burnout: 2 } as const
export type Cause = (typeof Cause)[keyof typeof Cause]

/** 화면 연출 구간 */
export type Zone = 'off' | 'low' | 'normal' | 'hot'

/** snapshot() 반환값 — ABI 에서 바로 뽑아 쓴다. */
export type Snapshot = ContractFunctionReturnType<typeof heaterAbi, 'view', 'snapshot'>

/** 배포 시 고정된 규칙 (컨트랙트 원시값, °C × 100 / 초) */
export type ChainRules = {
  stokeAmount: bigint
  coolingRate: bigint
  cooldown: bigint
  overheatThreshold: bigint
  overheatGrace: bigint
}

/** 컨트랙트 원시값(°C × 100) → 화면용 °C */
export const toCelsius = (t: bigint) => Number(t) / TEMP_SCALE

/**
 * snapshot 을 받은 뒤 흐른 시간을 반영해 지금 온도를 계산한다.
 * 컨트랙트와 같은 식(경과 시간 × 냉각률 / 3600, 내림)이라 RPC 를 다시 부르지 않아도 된다.
 * snapshot 시점 기준으로 다시 내림하므로 최대 0.01°C 차이가 날 수 있다.
 */
export function estimateTemp(snap: Snapshot, rules: ChainRules, nowSec: bigint): bigint {
  if (snap.temperature === 0n) return 0n
  if (snap.extinguishesAt !== 0n && nowSec >= snap.extinguishesAt) return 0n
  const elapsed = nowSec > snap.timestamp ? nowSec - snap.timestamp : 0n
  const drop = (elapsed * rules.coolingRate) / 3600n
  return drop >= snap.temperature ? 0n : snap.temperature - drop
}

/** 온도 → 화면 연출 구간 */
export function zoneOf(temp: bigint, rules: ChainRules): Zone {
  if (temp === 0n) return 'off'
  if (temp >= rules.overheatThreshold) return 'hot'
  if (temp < LOW_TEMP) return 'low'
  return 'normal'
}
