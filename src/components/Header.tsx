import { NavLink } from 'react-router'
import type { Heater } from '@/heater/types'
import WalletButton from './WalletButton'

/** 현재 탭이면 'active' — 나무 탭이 앞으로 튀어나온다 */
const tab = ({ isActive }: { isActive: boolean }) => (isActive ? 'active' : '')

export default function Header({ heater }: { heater: Heater }) {
  return (
    <header className="header">
      <NavLink to="/" className="logo">히터</NavLink>
      <nav>
        <NavLink to="/" end className={tab}>화로</NavLink>
        <NavLink to="/records" className={tab}>기록</NavLink>
        <NavLink to="/about" className={tab}>소개</NavLink>
      </nav>
      <WalletButton heater={heater} />
    </header>
  )
}
