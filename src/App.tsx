import { useEffect } from 'react'
import { Route, Routes } from 'react-router'

import AboutPage from './pages/AboutPage'
import HomePage from './pages/HomePage'
import StatisticsPage from './pages/StatisticsPage'
import SurveyPage from './pages/SurveyPage'
import { setupNetworkSync } from './services/networkSyncService'

function App() {
  useEffect(() => {
    let cleanup: (() => void) | undefined

    setupNetworkSync().then((cleanupFunction) => {
      cleanup = cleanupFunction
    })

    return () => {
      cleanup?.()
    }
  }, [])

  return (
    <Routes>
      <Route path="/" element={<HomePage />} />

      <Route
        path="/khao-sat"
        element={<SurveyPage />}
      />

      <Route
        path="/thong-ke"
        element={<StatisticsPage />}
      />

      <Route
        path="/gioi-thieu"
        element={<AboutPage />}
      />
    </Routes>
  )
}

export default App