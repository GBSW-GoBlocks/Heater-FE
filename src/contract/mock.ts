// 임시 가짜 데이터 (컨트랙트 연결되면 지우기)
import type { FireStatus, Stoke } from './types'

export const MAX_TEMP = 100
export const OVERHEAT = 85
export const STOKE_AMOUNT = 15
export const COOLING_PER_HOUR = 10
export const COOLDOWN = 30 * 60

const now = () => Math.floor(Date.now() / 1000)

function randomAddr() {
  let a = '0x'
  for (let i = 0; i < 40; i++) a += '0123456789abcdef'[Math.floor(Math.random() * 16)]
  return a
}

const people = [randomAddr(), randomAddr(), randomAddr(), randomAddr(), randomAddr()]
const fakeStokes: Stoke[] = []
for (let i = 1; i <= 10; i++) {
  fakeStokes.push({ stoker: people[i % 5], timestamp: now() - i * 3600, amount: STOKE_AMOUNT, tempAfter: 45 + ((i * 17) % 35) })
}

const data = {
  temp: 62,
  lastStokedAt: now() - 600,
  bornAt: now() - 12 * 86400,
  totalStokes: 120,
  extinguishCount: 3,
  stokes: fakeStokes,
  counts: { [people[0]]: 30, [people[1]]: 25, [people[2]]: 20, [people[3]]: 15, [people[4]]: 10 } as Record<string, number>,
  lastByUser: {} as Record<string, number>,
}

export function getTemp() {
  const t = data.temp - ((now() - data.lastStokedAt) / 3600) * COOLING_PER_HOUR
  return t < 0 ? 0 : t
}

export function getStatus(): FireStatus {
  const t = getTemp()
  if (t <= 0) return 'extinguished'
  if (t >= OVERHEAT) return 'overheated'
  return 'normal'
}

export function getCooldown(addr: string) {
  const last = data.lastByUser[addr]
  if (!last) return 0
  return Math.max(0, last + COOLDOWN - now())
}

export function getStats() {
  return {
    totalStokes: data.totalStokes,
    bornAt: data.bornAt,
    extinguishCount: data.extinguishCount,
    lastStokedAt: data.lastStokedAt,
  }
}

export const getStokes = () => data.stokes
export const getCount = (addr: string) => data.counts[addr] || 0
export const getRanking = () =>
  Object.keys(data.counts)
    .map((address) => ({ address, count: data.counts[address] }))
    .sort((a, b) => b.count - a.count)

export function stoke(addr: string) {
  if (getCooldown(addr) > 0) throw new Error('아직 쿨다운 중이에요')
  if (getStatus() === 'overheated') throw new Error('과열이라 넣을 수 없어요')

  if (getStatus() === 'extinguished') {
    data.extinguishCount++
    data.bornAt = now()
  }
  data.temp = Math.min(MAX_TEMP, getTemp() + STOKE_AMOUNT)
  data.lastStokedAt = now()
  data.lastByUser[addr] = now()
  data.totalStokes++
  data.counts[addr] = getCount(addr) + 1
  data.stokes = [{ stoker: addr, timestamp: now(), amount: STOKE_AMOUNT, tempAfter: Math.round(data.temp) }, ...data.stokes]
}

// 지갑 연결 전이라 테스트할 때 쓰는 내 주소
export const MY_ADDR = randomAddr()

// 테스트용
export function setTemp(t: number) {
  data.temp = t
  data.lastStokedAt = now()
}
export function resetCooldown() {
  data.lastByUser = {}
}
export { randomAddr }
