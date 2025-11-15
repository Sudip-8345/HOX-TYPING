import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { HomePage } from '@/components/HomePage'
import { HindiTypingPractice } from '@/components/HindiTypingPractice'
import { EnglishTypingPractice } from '@/components/EnglishTypingPractice'
import { PracticePage } from '@/components/PracticePage'
import { LeaderboardPage } from '@/components/LeaderboardPage'
import { AnalyticsPage } from '@/components/AnalyticsPage'
import { ExamPrepHub } from '@/components/ExamPrepHub'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/practice" element={<HindiTypingPractice />} />
        <Route path="/english-practice" element={<EnglishTypingPractice />} />
        <Route path="/stenography" element={<PracticePage />} />
        <Route path="/exam-prep" element={<ExamPrepHub />} />
        <Route path="/leaderboard" element={<LeaderboardPage />} />
        <Route path="/analytics" element={<AnalyticsPage />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
