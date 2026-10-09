import { useMemo, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { getPD3WritingExam } from '../../../data/pd3'
import { analyzeWriting } from '../../../lib/writingAnalyzer'
import { addAttempt, getAttempts, getSrsState } from '../../../lib/storage'
import { askCoach, computeStats } from '../../../lib/coach'
import { isDue } from '../../../lib/srs'
import type { WritingPrompt } from '../../../types'

export function PD3WritingPractice() {
  const { examId, taskId } = useParams()
  const exam = examId ? getPD3WritingExam(examId) : undefined
  const task = exam?.tasks.find((t) => t.id === taskId)

  const [text, setText] = useState('')
  const [aiFeedback, setAiFeedback] = useState<string | null>(null)
  const [aiLoading, setAiLoading] = useState(false)
  const [saved, setSaved] = useState(false)

  // analyzeWriting only reads .minWords/.bullets off the prompt object, so a
  // minimal shape covering PD3's task fields is sufficient here.
  const promptLike = useMemo(
    () => (task ? ({ minWords: task.minWords, bullets: task.bullets } as WritingPrompt) : undefined),
    [task],
  )
  const analysis = useMemo(() => analyzeWriting(text, { prompt: promptLike }), [text, promptLike])

  if (!exam || !task) {
    return (
      <div className="card p-8 text-center">
        <p className="text-gray-600">Opgaven blev ikke fundet.</p>
        <Link to="/pd3/writing" className="text-dk-red font-semibold underline mt-2 inline-block">
          ← Tilbage til PD3 Writing
        </Link>
      </div>
    )
  }

  function handleSave() {
    addAttempt({
      module: 'pd3-writing',
      refId: `${exam!.id}/${task!.id}`,
      label: `${task!.title} — ${exam!.exam.label}`,
      details: { wordCount: analysis.wordCount },
    })
    setSaved(true)
  }

  async function handleAiFeedback() {
    setAiLoading(true)
    try {
      const attempts = getAttempts()
      const dueCount = Object.values(getSrsState()).filter(isDue).length
      const stats = computeStats(attempts, dueCount)
      const question = `Giv konstruktiv feedback på denne danske tekst til Prøve i Dansk 3, niveau B2 (opgave: ${task!.title}). Fremhæv 2-3 styrker og 2-3 konkrete forbedringer (grammatik, ordvalg, argumentation, struktur). Teksten:\n\n${text}`
      const answer = await askCoach(question, stats)
      setAiFeedback(answer)
    } finally {
      setAiLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <Link to="/pd3/writing" className="text-sm text-gray-500 hover:text-dk-red font-medium">
          ← PD3 Writing
        </Link>
        <h1 className="text-xl font-extrabold text-gray-900 mt-1">
          {task.title} · {exam.exam.label}
        </h1>
      </div>

      <div className="card bg-amber-50 border-amber-200/70 p-4 text-sm text-amber-900 space-y-2">
        {task.situation && !task.situation.startsWith('Delprøve') && <p className="font-semibold">{task.situation}</p>}
        {task.context && <p className="whitespace-pre-wrap">{task.context}</p>}
        <p className="font-semibold">Du skal:</p>
        <ul className="list-disc list-inside space-y-0.5">
          {task.bullets.map((b, i) => (
            <li key={i}>{b}</li>
          ))}
        </ul>
        <p className="font-semibold">Minimum {task.minWords} ord.</p>
      </div>

      <div>
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          rows={14}
          placeholder="Skriv din besvarelse her…"
          className="w-full border-2 border-gray-200 rounded-2xl p-4 text-[15px] leading-relaxed focus:outline-none focus:border-dk-red transition-colors font-sans shadow-soft"
        />
        <div className="flex items-center justify-between mt-3 text-sm text-gray-500 flex-wrap gap-2">
          <span className="font-semibold">
            {analysis.wordCount} ord · {analysis.sentenceCount} sætninger
          </span>
          <div className="flex gap-2">
            <button
              onClick={handleAiFeedback}
              disabled={aiLoading || text.trim().length < 10}
              className="text-xs bg-gray-100 hover:bg-gray-200 px-3.5 py-2 rounded-full font-semibold disabled:opacity-50 transition-colors"
            >
              {aiLoading ? 'Spørger AI Coach…' : '🤖 Få AI-feedback'}
            </button>
            <button
              onClick={handleSave}
              disabled={text.trim().length < 5}
              className="text-xs btn-primary px-3.5 py-2 rounded-full disabled:opacity-50"
            >
              {saved ? 'Gemt ✓' : 'Gem forsøg'}
            </button>
          </div>
        </div>
      </div>

      {aiFeedback && (
        <div className="card bg-indigo-50 border-indigo-200 p-4 text-sm text-indigo-900 whitespace-pre-wrap">
          <div className="font-bold mb-1.5 flex items-center gap-1.5">🤖 AI Coach feedback</div>
          {aiFeedback}
        </div>
      )}

      <div className="card p-4">
        <h2 className="font-semibold text-gray-900 mb-3">Automatisk tjek</h2>
        <ul className="space-y-1.5">
          {analysis.feedback.map((f, i) => (
            <li
              key={i}
              className={`text-sm flex gap-2 ${
                f.level === 'error' ? 'text-red-700' : f.level === 'warning' ? 'text-amber-700' : 'text-emerald-700'
              }`}
            >
              <span>{f.level === 'error' ? '✗' : f.level === 'warning' ? '⚠' : '✓'}</span>
              <span>{f.message}</span>
            </li>
          ))}
        </ul>
        {analysis.bulletsCovered.length > 0 && (
          <div className="mt-3 pt-3 border-t border-gray-100">
            <div className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1.5">Punkter i opgaven</div>
            <ul className="space-y-1">
              {analysis.bulletsCovered.map((b, i) => (
                <li key={i} className={`text-sm flex gap-2 ${b.covered ? 'text-green-700' : 'text-gray-400'}`}>
                  <span>{b.covered ? '✓' : '○'}</span>
                  <span>{b.bullet}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  )
}
