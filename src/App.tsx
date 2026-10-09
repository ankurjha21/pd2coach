import { HashRouter, Route, Routes, useLocation } from 'react-router-dom'
import { Layout } from './components/Layout'
import { Dashboard } from './pages/Dashboard'
import { ReadingList } from './pages/reading/ReadingList'
import { ReadingRunner } from './pages/reading/ReadingRunner'
import { WritingHome } from './pages/writing/WritingHome'
import { WritingGenrePrompts } from './pages/writing/WritingGenrePrompts'
import { WritingPractice } from './pages/writing/WritingPractice'
import { SpeakingHome } from './pages/speaking/SpeakingHome'
import { SpeakingPractice } from './pages/speaking/SpeakingPractice'
import { GrammarHome } from './pages/grammar/GrammarHome'
import { GrammarQuiz } from './pages/grammar/GrammarQuiz'
import { VocabTrainer } from './pages/vocab/VocabTrainer'
import { Tips } from './pages/Tips'
import { Progress } from './pages/Progress'
import { Settings } from './pages/Settings'
import { ReviewMistakes } from './pages/ReviewMistakes'
import { CheatSheet } from './pages/CheatSheet'
import { PD3ReadingList } from './pages/pd3/reading/PD3ReadingList'
import { PD3ReadingRunner } from './pages/pd3/reading/PD3ReadingRunner'
import { PD3WritingHome } from './pages/pd3/writing/PD3WritingHome'
import { PD3WritingPractice } from './pages/pd3/writing/PD3WritingPractice'
import { PD3SpeakingHome } from './pages/pd3/speaking/PD3SpeakingHome'
import { PD3SpeakingPractice } from './pages/pd3/speaking/PD3SpeakingPractice'
import { PD3GrammarHome } from './pages/pd3/grammar/PD3GrammarHome'
import { PD3GrammarQuiz } from './pages/pd3/grammar/PD3GrammarQuiz'
import { PD3VocabTrainer } from './pages/pd3/vocab/PD3VocabTrainer'

// React Router reuses the same component instance across navigations that
// only change dynamic params (e.g. switching from one reading section to
// another) - without a key tied to the full path, per-attempt state like
// "submitted"/answers would otherwise leak between different exercises.
function AppRoutes() {
  const location = useLocation()
  const k = location.pathname

  return (
    <Routes>
      <Route element={<Layout />}>
        <Route index element={<Dashboard />} />

        <Route path="reading" element={<ReadingList />} />
        <Route path="reading/:examId/:taskId" element={<ReadingRunner key={k} />} />

        <Route path="writing" element={<WritingHome />} />
        <Route path="writing/:genre" element={<WritingGenrePrompts />} />
        <Route path="writing/:genre/:promptId" element={<WritingPractice key={k} />} />

        <Route path="speaking" element={<SpeakingHome />} />
        <Route path="speaking/:topicId" element={<SpeakingPractice key={k} />} />

        <Route path="grammar" element={<GrammarHome />} />
        <Route path="grammar/:topicId" element={<GrammarQuiz key={k} />} />

        <Route path="vocab" element={<VocabTrainer />} />

        <Route path="tips" element={<Tips />} />

        <Route path="progress" element={<Progress />} />
        <Route path="settings" element={<Settings />} />
        <Route path="review" element={<ReviewMistakes />} />
        <Route path="cheatsheet" element={<CheatSheet />} />

        <Route path="pd3/reading" element={<PD3ReadingList />} />
        <Route path="pd3/reading/:examId/:paperId/:sectionId" element={<PD3ReadingRunner key={k} />} />

        <Route path="pd3/writing" element={<PD3WritingHome />} />
        <Route path="pd3/writing/:examId/:taskId" element={<PD3WritingPractice key={k} />} />

        <Route path="pd3/speaking" element={<PD3SpeakingHome />} />
        <Route path="pd3/speaking/:examId/:topicId" element={<PD3SpeakingPractice key={k} />} />

        <Route path="pd3/grammar" element={<PD3GrammarHome />} />
        <Route path="pd3/grammar/:topicId" element={<PD3GrammarQuiz key={k} />} />

        <Route path="pd3/vocab" element={<PD3VocabTrainer />} />
      </Route>
    </Routes>
  )
}

function App() {
  return (
    <HashRouter>
      <AppRoutes />
    </HashRouter>
  )
}

export default App
