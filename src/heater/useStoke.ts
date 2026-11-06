// 연료 투입 트랜잭션: 체인 전환 → 시뮬레이션 → 서명 → 블록 포함 대기 → 화면 갱신
import { useCallback, useEffect, useState } from 'react'
import { useQueryClient } from '@tanstack/react-query'
import { useConfig } from 'wagmi'
import {
  simulateContract,
  switchChain as switchChainAction,
  waitForTransactionReceipt,
  writeContract,
} from 'wagmi/actions'
import { HEATER_CHAIN_ID } from './contract'
import { describeError } from './errors'
import { heaterContract } from './queries'
import type { TxStatus } from './types'

/** 성공·실패 문구를 띄워두는 시간(ms) */
const CLEAR_AFTER = { success: 2_500, error: 6_000 }

export type StokeTx = {
  stoke: () => Promise<void>
  txStatus: TxStatus
  txError: string
  txHash: string | null
}

export function useStoke(address: string | undefined, chainId: number | undefined): StokeTx {
  const config = useConfig()
  const queryClient = useQueryClient()
  const [txStatus, setTxStatus] = useState<TxStatus>('idle')
  const [txError, setTxError] = useState('')
  const [txHash, setTxHash] = useState<string | null>(null)

  const stoke = useCallback(async () => {
    if (!address) return
    setTxError('')
    setTxHash(null)
    try {
      if (chainId !== HEATER_CHAIN_ID) {
        setTxStatus('switching')
        await switchChainAction(config, { chainId: HEATER_CHAIN_ID })
      }

      // 실패할 트랜잭션은 서명 전에 걸러낸다 (쿨다운·과열 → 커스텀 에러).
      // 사용자가 헛되이 서명하고 가스비를 내는 일을 막는다.
      const { request } = await simulateContract(config, {
        ...heaterContract,
        functionName: 'stoke',
        account: address as `0x${string}`,
      })

      setTxStatus('signing')
      const hash = await writeContract(config, request)
      setTxHash(hash)

      setTxStatus('mining')
      const receipt = await waitForTransactionReceipt(config, {
        hash,
        chainId: HEATER_CHAIN_ID,
      })
      if (receipt.status !== 'success') throw new Error('트랜잭션이 실패했어요.')

      // snapshot, previewStoke, 기록 화면 등 읽기 쿼리를 모두 새로 읽는다.
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ['readContract'] }),
        queryClient.invalidateQueries({ queryKey: ['readContracts'] }),
      ])
      setTxStatus('success')
    } catch (error) {
      setTxError(describeError(error))
      setTxStatus('error')
    }
  }, [address, chainId, config, queryClient])

  // 성공/실패 문구는 잠깐만 띄운다
  useEffect(() => {
    if (txStatus !== 'success' && txStatus !== 'error') return
    const id = setTimeout(() => setTxStatus('idle'), CLEAR_AFTER[txStatus])
    return () => clearTimeout(id)
  }, [txStatus])

  return { stoke, txStatus, txError, txHash }
}
