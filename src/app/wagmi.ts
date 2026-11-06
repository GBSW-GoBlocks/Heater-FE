import { createConfig, fallback, http } from 'wagmi'
import { bscTestnet } from 'wagmi/chains'
import { injected } from 'wagmi/connectors'

// viem 의 bscTestnet 기본 RPC(:8545)는 일부 네트워크에서 막히므로 RPC 를 직접 지정한다.
// 쉼표로 여러 개를 넣으면 앞에서부터 순서대로 시도한다 (fallback).
const rpcUrls = (
  import.meta.env.VITE_BSC_TESTNET_RPC_URLS ?? 'https://bsc-testnet-rpc.publicnode.com'
)
  .split(',')
  .map((url: string) => url.trim())
  .filter(Boolean)

export const config = createConfig({
  chains: [bscTestnet],
  connectors: [injected()],
  transports: {
    [bscTestnet.id]: fallback(rpcUrls.map((url: string) => http(url, { batch: true }))),
  },
  pollingInterval: 4_000,
})

declare module 'wagmi' {
  interface Register {
    config: typeof config
  }
}
