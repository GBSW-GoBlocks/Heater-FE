// 화면에 보여줄 문자열로 바꾸는 함수들. 계산은 heater/temperature.ts 가 한다.
import { Cause } from '@/heater/temperature'

/** 0x1234...abcd */
export const shortAddr = (a: string) => `${a.slice(0, 6)}...${a.slice(-4)}`

/**
 * 초 → "3시간 12분". 큰 단위 두 개까지만 보여준다.
 * 딱 떨어지면 0인 꼬리 단위는 붙이지 않는다 (21600 → "6시간 0분" 이 아니라 "6시간").
 */
export function formatDuration(seconds: number): string {
  let s = Math.max(0, Math.floor(seconds))
  const d = Math.floor(s / 86400)
  s -= d * 86400
  const h = Math.floor(s / 3600)
  s -= h * 3600
  const m = Math.floor(s / 60)
  const sec = s - m * 60
  if (d > 0) return h > 0 ? `${d}일 ${h}시간` : `${d}일`
  if (h > 0) return m > 0 ? `${h}시간 ${m}분` : `${h}시간`
  if (m > 0) return sec > 0 ? `${m}분 ${sec}초` : `${m}분`
  return `${sec}초`
}

/** 지난 시간 → "3시간 전" */
export function formatAgo(seconds: number): string {
  const s = Math.max(0, Math.floor(seconds))
  if (s < 60) return '방금 전'
  if (s < 3600) return `${Math.floor(s / 60)}분 전`
  if (s < 86400) return `${Math.floor(s / 3600)}시간 전`
  return `${Math.floor(s / 86400)}일 전`
}

/** 쿨다운 카운트다운 → "5:59:12" / "59:12" */
export function formatCountdown(seconds: number): string {
  const total = Math.max(0, Math.floor(seconds))
  const h = Math.floor(total / 3600)
  const m = Math.floor((total % 3600) / 60)
  const s = total % 60
  const pad = (n: number) => (n < 10 ? `0${n}` : `${n}`)
  return h > 0 ? `${h}:${pad(m)}:${pad(s)}` : `${m}:${pad(s)}`
}

/** 유닉스 초 → "오후 3:04" */
export function clockTime(sec: number): string {
  const d = new Date(sec * 1000)
  const h = d.getHours()
  const m = d.getMinutes()
  return `${h < 12 ? '오전' : '오후'} ${h % 12 === 0 ? 12 : h % 12}:${m < 10 ? `0${m}` : m}`
}

/** 유닉스 초 → "11월 5일 오후 3:04" */
export function dateTime(sec: number): string {
  const d = new Date(sec * 1000)
  return `${d.getMonth() + 1}월 ${d.getDate()}일 ${clockTime(sec)}`
}

/** 꺼진 원인 → 사람이 읽는 문장 */
export const causeLabel = (cause: number) =>
  cause === Cause.Burnout ? '과열로 타버림' : '식어서 꺼짐'
