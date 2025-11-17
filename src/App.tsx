import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { AuthProvider } from '@/contexts/AuthContext'
import { ProtectedRoute } from '@/components/ProtectedRoute'
import { HomePage } from '@/components/HomePage'
import { LoginPage } from '@/components/LoginPage'
import { SignupPage } from '@/components/SignupPage'
import { HindiTypingPractice } from '@/components/HindiTypingPractice'
import { EnglishTypingPractice } from '@/components/EnglishTypingPractice'
import { StartTypePage } from '@/components/StartTypePage'
import { PracticePage } from '@/components/PracticePage'
import { LeaderboardPage } from '@/components/LeaderboardPage'
import { AnalyticsPage } from '@/components/AnalyticsPage'
import { ExamPrepHub } from '@/components/ExamPrepHub'
import { SettingsPage } from '@/components/SettingsPage'
import { ProfilePage } from '@/components/ProfilePage'

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />
          <Route path="/start-type" element={<StartTypePage />} />
          <Route path="/practice" element={<HindiTypingPractice />} />
          <Route path="/english-practice" element={<EnglishTypingPractice />} />
          <Route 
            path="/stenography" 
            element={
              <ProtectedRoute>
                <PracticePage />
              </ProtectedRoute>
            } 
          />
          <Route path="/exam-prep" element={<ExamPrepHub />} />
          <Route path="/leaderboard" element={<LeaderboardPage />} />
          <Route path="/settings" element={<SettingsPage />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route 
            path="/analytics" 
            element={
              <ProtectedRoute>
                <AnalyticsPage />
              </ProtectedRoute>
            } 
          />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  )
}

export default App
