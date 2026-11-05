type Props = {
  page: string
  connect: () => void
}

export default function Header({ page, connect }: Props) {
  return (
    <header className="header">
      <a href="#/" className="logo">히터</a>
      <nav>
        <a href="#/" className={page === 'main' ? 'active' : ''}>화로</a>
        <a href="#/records" className={page === 'records' ? 'active' : ''}>기록</a>
        <a href="#/about" className={page === 'about' ? 'active' : ''}>소개</a>
      </nav>
      {/* 지갑 연결은 현우가 붙일 예정 */}
      <button className="wallet-btn" onClick={connect}>
        <span className="coin">🪙</span> 지갑 연결
      </button>
    </header>
  )
}
