import type { Heater } from '@/heater/types'
import { shortAddr } from '@/lib/format'

export default function WalletButton({ heater }: { heater: Heater }) {
  if (!heater.isConnected) {
    return (
      <button className="wallet-btn" onClick={heater.connect} disabled={heater.isConnecting}>
        <span className="coin">🪙</span> {heater.isConnecting ? '연결 중...' : '지갑 연결'}
      </button>
    )
  }

  if (heater.wrongChain) {
    return (
      <button className="wallet-btn warn" onClick={heater.switchChain}>
        <span className="coin">⚠</span> BNB 테스트넷으로 전환
      </button>
    )
  }

  return (
    <button className="wallet-btn connected" onClick={heater.disconnect} title="연결 해제">
      <span className="coin">🔥</span> {shortAddr(heater.account!)}
    </button>
  )
}
