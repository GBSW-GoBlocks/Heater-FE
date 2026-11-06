// 컨트랙트 읽기 훅 모음. 갱신 주기는 여기 한곳에서만 정한다.
//
// 기록 화면은 컨트랙트 조회 함수로 만든다 (recentStokes / contributors / fireHistory).
// 이벤트 로그를 처음부터 훑지 않는다 — 공개 RPC 는 eth_getLogs 를 50,000블록까지만
// 받아주는데, BSC 테스트넷은 블록이 약 0.45초마다 생겨서 2주치면 호출이 50번을 넘는다.
// 이벤트는 실시간 알림 용도로만 쓴다 (useLiveRefresh).
import { useQueryClient } from '@tanstack/react-query'
import { zeroAddress } from 'viem'
import { useReadContract, useReadContracts, useWatchContractEvent } from 'wagmi'
import { HEATER_ADDRESS, HEATER_CHAIN_ID, heaterAbi } from './contract'
import type { ChainRules } from './temperature'

/** 모든 읽기/쓰기 호출이 공유하는 대상 */
export const heaterContract = {
  address: HEATER_ADDRESS,
  abi: heaterAbi,
  chainId: HEATER_CHAIN_ID,
} as const

/** 갱신 주기 — 자주 바뀌는 순서대로 */
const REFETCH = {
  snapshot: 15_000, // 다른 사람의 투입 반영
  preview: 15_000,
  stats: 30_000,
  recent: 30_000, // 자주 바뀌지 않음
  contributors: 60_000, // 무거운 조회
} as const

/** 규칙 상수 — 배포 후 바뀌지 않으므로 한 번만 읽는다 (멀티콜 1회). */
export function useRules() {
  return useReadContracts({
    contracts: [
      { ...heaterContract, functionName: 'STOKE_AMOUNT' },
      { ...heaterContract, functionName: 'COOLING_RATE' },
      { ...heaterContract, functionName: 'COOLDOWN' },
      { ...heaterContract, functionName: 'OVERHEAT_THRESHOLD' },
      { ...heaterContract, functionName: 'OVERHEAT_GRACE' },
    ],
    allowFailure: false,
    query: {
      staleTime: Infinity,
      gcTime: Infinity,
      select: ([
        stokeAmount,
        coolingRate,
        cooldown,
        overheatThreshold,
        overheatGrace,
      ]): ChainRules => ({
        stokeAmount,
        coolingRate,
        cooldown,
        overheatThreshold,
        overheatGrace,
      }),
    },
  })
}

/** 메인 화면 스냅샷 — RPC 1회로 화면 전체를 그린다. 지갑이 없으면 address(0). */
export function useSnapshot(address?: string) {
  return useReadContract({
    ...heaterContract,
    functionName: 'snapshot',
    args: [(address as `0x${string}`) ?? zeroAddress],
    query: { refetchInterval: REFETCH.snapshot },
  })
}

/** 누적 통계 — 지연 소화까지 반영된 값 */
export function useStats() {
  return useReadContract({
    ...heaterContract,
    functionName: 'stats',
    query: { refetchInterval: REFETCH.stats },
  })
}

/** 투입 전 미리보기: 투입 가능 여부, 투입 후 온도, 과열·소진 위험 */
export function usePreviewStoke(address?: string) {
  return useReadContract({
    ...heaterContract,
    functionName: 'previewStoke',
    args: address ? [address as `0x${string}`] : undefined,
    query: { enabled: !!address, refetchInterval: REFETCH.preview },
  })
}

/** 최근 투입 50건 (최신순) */
export function useRecentStokes(enabled: boolean) {
  return useReadContract({
    ...heaterContract,
    functionName: 'recentStokes',
    query: { enabled, refetchInterval: REFETCH.recent },
  })
}

/** 기여자 목록 — 컨트랙트는 투입 순서대로 주므로 정렬은 화면 쪽에서 한다. */
export function useContributors(enabled: boolean, limit = 500n) {
  return useReadContract({
    ...heaterContract,
    functionName: 'contributors',
    args: [0n, limit],
    query: { enabled, refetchInterval: REFETCH.contributors },
  })
}

/** 꺼진 불들의 생존 기록 — 최신 page 건 */
export function useFireHistory(enabled: boolean, page = 20n) {
  const length = useReadContract({
    ...heaterContract,
    functionName: 'fireHistoryLength',
    query: { enabled, refetchInterval: REFETCH.contributors },
  })

  const total = length.data ?? 0n
  const offset = total > page ? total - page : 0n

  return useReadContract({
    ...heaterContract,
    functionName: 'fireHistory',
    args: [offset, page],
    query: { enabled: enabled && length.isSuccess && total > 0n },
  })
}

/** 다른 사람이 투입하면 화면을 바로 갱신한다 (폴링 기반 이벤트 구독). */
export function useLiveRefresh() {
  const queryClient = useQueryClient()
  useWatchContractEvent({
    ...heaterContract,
    eventName: 'Stoked',
    poll: true,
    pollingInterval: 10_000,
    onLogs: () => {
      queryClient.invalidateQueries({ queryKey: ['readContract'] })
    },
  })
}
