import { useEffect, useState } from 'react'

/** 일정 주기로 다시 그리기 위한 현재 시각(ms) */
export function useNowMs(intervalMs = 1_000) {
  const [now, setNow] = useState(() => Date.now())
  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), intervalMs)
    return () => clearInterval(id)
  }, [intervalMs])
  return now
}
