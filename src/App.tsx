import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { HomePage } from '@/components/HomePage'
import { HindiTypingPractice } from '@/components/HindiTypingPractice'
import { PracticePage } from '@/components/PracticePage'
import { LeaderboardPage } from '@/components/LeaderboardPage'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/practice" element={<HindiTypingPractice />} />
        <Route path="/stenography" element={<PracticePage />} />
        <Route path="/leaderboard" element={<LeaderboardPage />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
