import { HashRouter, Route, Routes } from 'react-router-dom'
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

function App() {
  return (
    <HashRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route index element={<Dashboard />} />

          <Route path="reading" element={<ReadingList />} />
          <Route path="reading/:examId/:taskId" element={<ReadingRunner />} />

          <Route path="writing" element={<WritingHome />} />
          <Route path="writing/:genre" element={<WritingGenrePrompts />} />
          <Route path="writing/:genre/:promptId" element={<WritingPractice />} />

          <Route path="speaking" element={<SpeakingHome />} />
          <Route path="speaking/:topicId" element={<SpeakingPractice />} />

          <Route path="grammar" element={<GrammarHome />} />
          <Route path="grammar/:topicId" element={<GrammarQuiz />} />

          <Route path="vocab" element={<VocabTrainer />} />

          <Route path="tips" element={<Tips />} />

          <Route path="progress" element={<Progress />} />
          <Route path="settings" element={<Settings />} />
        </Route>
      </Routes>
    </HashRouter>
  )
}

export default App
