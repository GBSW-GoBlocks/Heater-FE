// 컨트랙트에서 받아오는 데이터 타입
export type FireStatus = 'normal' | 'overheated' | 'extinguished'

export type Stoke = {
  stoker: string
  timestamp: number
  amount: number
  tempAfter: number
}

export type Stats = {
  totalStokes: number
  bornAt: number
  extinguishCount: number
  lastStokedAt: number
}

export type Heater = {
  loading: boolean
  temp: number
  status: FireStatus
  stats: Stats
  recentStokes: Stoke[]
  ranking: { address: string; count: number }[]
  cooldown: number
  myCount: number
  account: string | null
  connect: () => void
  stoke: () => Promise<void>
  txStatus: 'idle' | 'pending' | 'success' | 'error'
  txError: string
}
