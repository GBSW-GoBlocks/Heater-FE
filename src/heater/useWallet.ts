// 지갑 연결 / 네트워크 전환 / 연결 해제
import { useCallback } from 'react'
import { useConnect, useConnection, useConnectors, useDisconnect, useSwitchChain } from 'wagmi'
import { HEATER_CHAIN_ID } from './contract'
import { describeError } from './errors'

export type Wallet = {
  address: string | undefined
  chainId: number | undefined
  isConnected: boolean
  isConnecting: boolean
  /** 연결은 됐는데 다른 네트워크에 있는 상태 */
  wrongChain: boolean
  connect: () => void
  disconnect: () => void
  switchChain: () => void
  connectError: string | null
}

export function useWallet(): Wallet {
  const { address, chainId, isConnected } = useConnection()
  const connectors = useConnectors()
  const connectMutation = useConnect()
  const { mutate: disconnectMutation } = useDisconnect()
  const switchChainMutation = useSwitchChain()

  const connect = useCallback(() => {
    const injected = connectors[0]
    if (!injected) return
    connectMutation.mutate({ connector: injected, chainId: HEATER_CHAIN_ID })
  }, [connectors, connectMutation])

  const switchChain = useCallback(() => {
    switchChainMutation.mutate({ chainId: HEATER_CHAIN_ID })
  }, [switchChainMutation])

  const disconnect = useCallback(() => disconnectMutation(), [disconnectMutation])

  return {
    address,
    chainId,
    isConnected,
    isConnecting: connectMutation.isPending,
    wrongChain: isConnected && chainId !== HEATER_CHAIN_ID,
    connect,
    disconnect,
    switchChain,
    connectError: connectMutation.error ? describeError(connectMutation.error) : null,
  }
}
