// 화면이 쓰는 단 하나의 훅. 컨트랙트 값을 types.ts 의 Heater 모양으로 맞춰 돌려준다.
//
// 원칙
//  1. 읽기는 snapshot() 한 번 + 로컬 계산. 매초 RPC 를 부르지 않는다.
//  2. 쓰기는 stoke() 하나. 시뮬레이션 → 서명 → 블록 포함 대기 → 화면 갱신.
//  3. 기록 화면은 컨트랙트 조회 함수로 만든다 (queries.ts 참고).
import { useMemo } from 'react'
import { zeroAddress } from 'viem'
import { useNowMs } from '@/lib/useNowMs'
import { describeError } from './errors'
import {
  useContributors,
  useFireHistory,
  useLiveRefresh,
  usePreviewStoke,
  useRecentStokes,
  useRules,
  useSnapshot,
  useStats,
} from './queries'
import { estimateTemp, toCelsius, zoneOf } from './temperature'
import type { Fire, Heater, RankRow, Rules, Stoke } from './types'
import { useStoke } from './useStoke'
import { useWallet } from './useWallet'

/** 규칙을 아직 못 읽었을 때 쓰는 값 — 배포된 컨트랙트의 실제 규칙과 같다. */
const FALLBACK_RULES: Rules = {
  stokeAmount: 15,
  coolingRate: 5,
  cooldown: 21_600,
  overheatThreshold: 80,
  overheatGrace: 7_200,
}

export function useHeater({ records = false }: { records?: boolean } = {}): Heater {
  const wallet = useWallet()
  const tx = useStoke(wallet.address, wallet.chainId)

  const nowMs = useNowMs()
  useLiveRefresh()

  const rulesQuery = useRules()
  const snapshotQuery = useSnapshot(wallet.address)
  const statsQuery = useStats()
  const previewQuery = usePreviewStoke(wallet.address)

  // 기록 화면 전용 — 기록 탭에 들어갈 때만 읽는다 (초기 로딩을 가볍게)
  const recentQuery = useRecentStokes(records)
  const contributorsQuery = useContributors(records)
  const fireHistoryQuery = useFireHistory(records)

  const chainRules = rulesQuery.data
  const snap = snapshotQuery.data
  const snapUpdatedAt = snapshotQuery.dataUpdatedAt

  // ── 1초 단위 로컬 계산
  // 체인 시각 = snapshot.timestamp + (지금 - 스냅샷을 받은 시각)
  // 기준을 사용자 PC 시계가 아니라 블록 시각에 두므로, PC 시계가 틀려도 정확하다.
  const live = useMemo(() => {
    if (!chainRules || !snap) return null

    const drift = BigInt(Math.max(0, Math.floor((nowMs - snapUpdatedAt) / 1000)))
    const chainNow = snap.timestamp + drift
    const temp = estimateTemp(snap, chainRules, chainNow)
    const elapsed = chainNow - snap.timestamp
    const alive = temp > 0n

    return {
      chainNow: Number(chainNow),
      temp: toCelsius(temp),
      zone: zoneOf(temp, chainRules),
      aliveFor: alive ? Number(chainNow - snap.bornAt) : 0,
      extinguishesIn:
        alive && snap.extinguishesAt > chainNow ? Number(snap.extinguishesAt - chainNow) : 0,
      sinceLastStoke: snap.lastStokedAt === 0n ? null : Number(chainNow - snap.lastStokedAt),
      lastStoker: snap.lastStoker === zeroAddress ? null : snap.lastStoker,
      cooldown: snap.userCooldown > elapsed ? Number(snap.userCooldown - elapsed) : 0,
      myCount: Number(snap.userContribution),
    }
  }, [chainRules, snap, snapUpdatedAt, nowMs])

  const rules: Rules = useMemo(
    () =>
      chainRules
        ? {
            stokeAmount: toCelsius(chainRules.stokeAmount),
            coolingRate: toCelsius(chainRules.coolingRate),
            cooldown: Number(chainRules.cooldown),
            overheatThreshold: toCelsius(chainRules.overheatThreshold),
            overheatGrace: Number(chainRules.overheatGrace),
          }
        : FALLBACK_RULES,
    [chainRules],
  )

  const recentStokes: Stoke[] = useMemo(() => {
    if (!recentQuery.data || !live) return []
    return recentQuery.data.map((s) => ({
      stoker: s.stoker,
      timestamp: Number(s.timestamp),
      ago: Math.max(0, live.chainNow - Number(s.timestamp)),
      fireId: Number(s.fireId),
      tempAfter: toCelsius(s.tempAfter),
    }))
  }, [recentQuery.data, live])

  const ranking: RankRow[] = useMemo(() => {
    if (!contributorsQuery.data) return []
    const [accounts, counts] = contributorsQuery.data
    // 컨트랙트는 투입 순서대로 주므로 프론트에서 정렬한다.
    return accounts
      .map((address, i) => ({ address, count: Number(counts[i]) }))
      .sort((a, b) => b.count - a.count)
      .map((row, i) => ({ ...row, rank: i + 1 }))
  }, [contributorsQuery.data])

  const fireHistory: Fire[] = useMemo(() => {
    if (!fireHistoryQuery.data) return []
    // 오래된 순으로 오므로 최신순으로 뒤집는다.
    return [...fireHistoryQuery.data].reverse().map((f) => ({
      fireId: Number(f.fireId),
      bornAt: Number(f.bornAt),
      diedAt: Number(f.diedAt),
      lifetime: Number(f.diedAt - f.bornAt),
      stokes: Number(f.stokes),
      cause: f.cause,
    }))
  }, [fireHistoryQuery.data])

  const myRank = useMemo(() => {
    if (!wallet.address) return null
    const mine = ranking.find((r) => r.address.toLowerCase() === wallet.address!.toLowerCase())
    return mine ? mine.rank : null
  }, [ranking, wallet.address])

  const rawStats = statsQuery.data
  const zone = live?.zone ?? 'off'
  const loadError = rulesQuery.error ?? snapshotQuery.error
  const preview = previewQuery.data

  return {
    loading: !live && !loadError,
    loadError: loadError ? describeError(loadError) : null,

    rules,

    temp: live?.temp ?? 0,
    zone,
    status: zone === 'off' ? 'extinguished' : zone === 'hot' ? 'overheated' : 'normal',
    aliveFor: live?.aliveFor ?? 0,
    extinguishesIn: live?.extinguishesIn ?? 0,
    sinceLastStoke: live?.sinceLastStoke ?? null,
    lastStoker: live?.lastStoker ?? null,
    chainNow: live?.chainNow ?? Math.floor(nowMs / 1000),

    stats: {
      totalStokes: Number(rawStats?.totalStokes ?? 0n),
      extinguishCount: Number(rawStats?.extinguishCount ?? 0n),
      longestLifetime: Number(rawStats?.longestLifetime ?? 0n),
      contributorCount: Number(rawStats?.contributorCount ?? 0n),
      currentFireId: Number(rawStats?.currentFireId ?? 0n),
      currentFireStokes: Number(rawStats?.currentFireStokes ?? 0n),
    },
    recentStokes,
    ranking,
    fireHistory,

    account: wallet.address ?? null,
    isConnected: wallet.isConnected,
    isConnecting: wallet.isConnecting,
    wrongChain: wallet.wrongChain,
    cooldown: live?.cooldown ?? 0,
    myCount: live?.myCount ?? 0,
    myRank,
    preview: preview
      ? {
          canStoke: preview[0],
          tempAfter: toCelsius(preview[1]),
          willOverheat: preview[2],
          willBurnout: preview[3],
        }
      : null,

    connect: wallet.connect,
    disconnect: wallet.disconnect,
    switchChain: wallet.switchChain,
    connectError: wallet.connectError,

    stoke: tx.stoke,
    txStatus: tx.txStatus,
    txError: tx.txError,
    txHash: tx.txHash,
  }
}
