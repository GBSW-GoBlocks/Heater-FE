// 화면이 쓰는 데이터 모양. useHeater 가 컨트랙트 값을 이 모양으로 맞춰서 돌려준다.
// 온도는 전부 °C (컨트랙트의 °C × 100 은 훅에서 변환), 시간은 전부 초.
import type { Zone } from './temperature'

export type { Zone }

export type FireStatus = 'normal' | 'overheated' | 'extinguished'

/** 배포 시 고정된 규칙 (체인에서 읽는다) */
export type Rules = {
  stokeAmount: number // 1회 투입 상승 온도 (°C)
  coolingRate: number // 시간당 하강 온도 (°C/h)
  cooldown: number // 재투입 대기 시간(초)
  overheatThreshold: number // 과열 기준 온도 (°C)
  overheatGrace: number // 과열 허용 시간(초)
}

export type Stoke = {
  stoker: string
  timestamp: number // 유닉스 초
  ago: number // 지금 기준 지난 시간(초)
  fireId: number
  tempAfter: number // 투입 직후 온도 (°C)
}

export type Fire = {
  fireId: number
  bornAt: number
  diedAt: number
  lifetime: number // 생존 시간(초)
  stokes: number
  cause: number // 0 None / 1 Cooled / 2 Burnout
}

export type RankRow = {
  address: string
  count: number
  rank: number
}

export type Stats = {
  totalStokes: number
  extinguishCount: number
  longestLifetime: number // 초
  contributorCount: number
  currentFireId: number
  currentFireStokes: number
}

/** 지금 투입하면 어떻게 되는지 (previewStoke) */
export type Preview = {
  canStoke: boolean
  tempAfter: number
  willOverheat: boolean
  willBurnout: boolean
}

export type TxStatus = 'idle' | 'switching' | 'signing' | 'mining' | 'success' | 'error'

export type Heater = {
  loading: boolean
  loadError: string | null

  rules: Rules

  // ── 지금 화로 상태 (1초마다 로컬 계산)
  temp: number // 현재 온도 (°C)
  zone: Zone // 화면 구간: off / low / normal / hot
  status: FireStatus
  aliveFor: number // 현재 불이 꺼지지 않은 시간(초)
  extinguishesIn: number // 아무도 넣지 않으면 꺼지기까지 남은 시간(초)
  sinceLastStoke: number | null // 마지막 투입 후 지난 시간(초)
  lastStoker: string | null
  chainNow: number // 추정한 현재 체인 시각(초)

  // ── 기록
  stats: Stats
  recentStokes: Stoke[]
  ranking: RankRow[]
  fireHistory: Fire[]

  // ── 내 지갑
  account: string | null
  isConnected: boolean
  isConnecting: boolean
  wrongChain: boolean
  cooldown: number // 남은 쿨다운(초)
  myCount: number
  myRank: number | null
  preview: Preview | null

  // ── 동작
  connect: () => void
  disconnect: () => void
  switchChain: () => void
  stoke: () => Promise<void>
  txStatus: TxStatus
  txError: string
  txHash: string | null
  connectError: string | null // 지갑 연결 자체가 실패했을 때 (지갑 미설치 등)
}
