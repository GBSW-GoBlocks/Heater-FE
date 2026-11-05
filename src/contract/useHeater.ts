// TODO: 현우 - 여기서 컨트랙트 + 지갑 연결 (지금은 mock.ts 씀)
// 리턴하는 모양(types.ts의 Heater)만 똑같이 맞춰주면 화면은 안 고쳐도 됨
import { useEffect, useState } from 'react'
import * as mock from './mock'
import type { Heater } from './types'

export function useHeater(): Heater {
  const [, setTick] = useState(0)
  const [loading, setLoading] = useState(true)
  const [txStatus, setTxStatus] = useState<Heater['txStatus']>('idle')
  const [txError, setTxError] = useState('')

  useEffect(() => {
    setTimeout(() => setLoading(false), 300)
    const timer = setInterval(() => setTick((t) => t + 1), 1000)
    return () => clearInterval(timer)
  }, [])

  // TODO: 현우 - 지갑 연결 (지금은 버튼만 있고 아무것도 안 함)
  const connect = () => {}

  // 지금은 지갑 없이 mock.MY_ADDR로 테스트
  const stoke = async () => {
    setTxStatus('pending')
    setTxError('')
    await new Promise((r) => setTimeout(r, 1500))
    try {
      mock.stoke(mock.MY_ADDR)
      setTxStatus('success')
      setTimeout(() => setTxStatus('idle'), 2000)
    } catch (e: any) {
      setTxError(e.message)
      setTxStatus('error')
    }
  }

  return {
    loading,
    temp: mock.getTemp(),
    status: mock.getStatus(),
    stats: mock.getStats(),
    recentStokes: mock.getStokes(),
    ranking: mock.getRanking(),
    cooldown: mock.getCooldown(mock.MY_ADDR),
    myCount: mock.getCount(mock.MY_ADDR),
    account: null,
    connect,
    stoke,
    txStatus,
    txError,
  }
}
