import { Route, Routes, useLocation } from 'react-router'
import './styles/index.css'
import Header from '@/components/Header'
import Main from '@/pages/Main'
import Records from '@/pages/Records'
import About from '@/pages/About'
import { useHeater } from '@/heater/useHeater'

export default function App() {
  const { pathname } = useLocation()
  // 기록 화면의 무거운 조회는 기록 탭에 들어갈 때만 한다.
  const heater = useHeater({ records: pathname === '/records' })

  return (
    <div className="app">
      <Header heater={heater} />

      {heater.loadError ? (
        <div className="load-error">
          <p>화로 정보를 읽지 못했어요.</p>
          <p className="small">{heater.loadError}</p>
          <button className="more" onClick={() => window.location.reload()}>
            새로고침
          </button>
        </div>
      ) : heater.loading ? (
        <p className="loading">불러오는 중...</p>
      ) : (
        <main>
          <Routes>
            <Route path="/" element={<Main heater={heater} />} />
            <Route path="/records" element={<Records heater={heater} />} />
            <Route path="/about" element={<About heater={heater} />} />
            {/* 없는 주소는 화로로 */}
            <Route path="*" element={<Main heater={heater} />} />
          </Routes>
        </main>
      )}
    </div>
  )
}
