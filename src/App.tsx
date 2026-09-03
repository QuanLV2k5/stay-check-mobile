import { Route, Routes } from 'react-router'

import AboutPage from './pages/AboutPage'
import HomePage from './pages/HomePage'
import StatisticsPage from './pages/StatisticsPage'
import SurveyPage from './pages/SurveyPage'

function App() {
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