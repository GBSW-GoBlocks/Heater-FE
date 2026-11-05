import { useEffect, useState } from 'react'
import './App.css'
import Header from './components/Header'
import TestButtons from './components/TestButtons'
import Main from './pages/Main'
import Records from './pages/Records'
import About from './pages/About'
import { useHeater } from './contract/useHeater'

function getPage() {
  if (window.location.hash === '#/records') return 'records'
  if (window.location.hash === '#/about') return 'about'
  return 'main'
}

function App() {
  const [page, setPage] = useState(getPage())
  const heater = useHeater()

  useEffect(() => {
    const onChange = () => setPage(getPage())
    window.addEventListener('hashchange', onChange)
    return () => window.removeEventListener('hashchange', onChange)
  }, [])

  return (
    <div className="app">
      <Header page={page} connect={heater.connect} />
      {heater.loading ? (
        <p className="loading">불러오는 중...</p>
      ) : (
        <>
          {page === 'main' && <Main heater={heater} />}
          {page === 'records' && <Records heater={heater} />}
          {page === 'about' && <About />}
        </>
      )}
      <TestButtons />
    </div>
  )
}

export default App
