export const shortAddr = (a: string) => a.slice(0, 6) + '...' + a.slice(-4)

export function timeAgo(ts: number) {
  const diff = Math.floor(Date.now() / 1000) - ts
  if (diff < 60) return '방금 전'
  if (diff < 3600) return Math.floor(diff / 60) + '분 전'
  if (diff < 86400) return Math.floor(diff / 3600) + '시간 전'
  return Math.floor(diff / 86400) + '일 전'
}

export function aliveTime(bornAt: number) {
  const sec = Math.floor(Date.now() / 1000) - bornAt
  const d = Math.floor(sec / 86400)
  const h = Math.floor((sec % 86400) / 3600)
  const m = Math.floor((sec % 3600) / 60)
  if (d > 0) return d + '일 ' + h + '시간'
  if (h > 0) return h + '시간 ' + m + '분'
  return m + '분'
}

export function countdown(sec: number) {
  const m = Math.floor(sec / 60)
  const s = sec % 60
  return m + ':' + (s < 10 ? '0' + s : s)
}

export function clockTime(ts: number) {
  const d = new Date(ts * 1000)
  const h = d.getHours()
  const m = d.getMinutes()
  return (h < 12 ? '오전 ' : '오후 ') + (h % 12 === 0 ? 12 : h % 12) + ':' + (m < 10 ? '0' + m : m)
}
